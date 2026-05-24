import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import Hotel from "../models/hotel.model.js";
import mongoose from "mongoose";

const allowedSortFields = {
  bookingDate: "bookingDate",
  checkInDate: "checkInDate",
  checkOutDate: "checkOutDate",
  numberOfGuests: "numberOfGuests",
  totalAmount: "totalAmount",
  createdAt: "createdAt",
};

const allowedBookingStatuses = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
];

const activeRoomHoldStatuses = ["pending", "confirmed"];

const buildDateFilter = (from, to) => {
  const dateFilter = {};

  if (from) {
    dateFilter.$gte = new Date(from);
  }

  if (to) {
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);
    dateFilter.$lte = endDate;
  }

  return Object.keys(dateFilter).length ? dateFilter : null;
};

const generateBookingNumber = () => {
  const year = new Date().getFullYear();
  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  return `HB-${year}-${randomNumber}`;
};

const getBookedRoomsForHotel = async ({
  hotelId,
  checkInDate,
  checkOutDate,
  excludeBookingId = null,
}) => {
  const matchFilter = {
    hotelId: new mongoose.Types.ObjectId(hotelId),
    status: {
      $in: activeRoomHoldStatuses,
    },
  };

  if (checkInDate && checkOutDate) {
    matchFilter.checkInDate = {
      $lt: checkOutDate,
    };

    matchFilter.checkOutDate = {
      $gt: checkInDate,
    };
  }

  if (excludeBookingId) {
    matchFilter._id = {
      $ne: new mongoose.Types.ObjectId(excludeBookingId),
    };
  }

  const [result] = await Booking.aggregate([
    {
      $match: matchFilter,
    },
    {
      $group: {
        _id: "$hotelId",
        bookedRooms: {
          $sum: "$roomsBooked",
        },
      },
    },
  ]);

  return result?.bookedRooms || 0;
};

export const getAllBookings = async ({
  page = 1,
  limit = 10,
  search = "",
  roomType = "",
  status = "",
  bookingDateFrom = "",
  bookingDateTo = "",
  checkInDateFrom = "",
  checkInDateTo = "",
  checkOutDateFrom = "",
  checkOutDateTo = "",
  sortBy = "bookingDate",
  sortOrder = "desc",
}) => {
  const skip = (page - 1) * limit;

  const filter = {};

  if (roomType) {
    filter.roomType = roomType;
  }

  if (status) {
    filter.status = status;
  }

  const bookingDateFilter = buildDateFilter(bookingDateFrom, bookingDateTo);
  const checkInDateFilter = buildDateFilter(checkInDateFrom, checkInDateTo);
  const checkOutDateFilter = buildDateFilter(checkOutDateFrom, checkOutDateTo);

  if (bookingDateFilter) {
    filter.bookingDate = bookingDateFilter;
  }

  if (checkInDateFilter) {
    filter.checkInDate = checkInDateFilter;
  }

  if (checkOutDateFilter) {
    filter.checkOutDate = checkOutDateFilter;
  }

  const sortField = allowedSortFields[sortBy] || "bookingDate";
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "hotels",
        localField: "hotelId",
        foreignField: "_id",
        as: "hotel",
      },
    },
    {
      $unwind: "$hotel",
    },
    {
      $match: {
        ...filter,
        ...(search
          ? {
              $or: [
                { bookingNumber: { $regex: search, $options: "i" } },

                { "user.name": { $regex: search, $options: "i" } },
                { "user.email": { $regex: search, $options: "i" } },
                { "user.phone": { $regex: search, $options: "i" } },

                { "hotel.name": { $regex: search, $options: "i" } },
                { "hotel.phone": { $regex: search, $options: "i" } },
                { "hotel.city": { $regex: search, $options: "i" } },
              ],
            }
          : {}),
      },
    },
    {
      $sort: {
        [sortField]: sortDirection,
      },
    },
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              bookingNumber: 1,

              user: {
                _id: "$user._id",
                name: "$user.name",
                email: "$user.email",
                phone: "$user.phone",
              },

              hotel: {
                _id: "$hotel._id",
                name: "$hotel.name",
                phone: "$hotel.phone",
                location: "$hotel.location",
                city: "$hotel.city",
                state: "$hotel.state",
                country: "$hotel.country",
                rating: "$hotel.rating",
              },

              roomType: 1,
              checkInDate: 1,
              checkOutDate: 1,

              duration: {
                $dateDiff: {
                  startDate: "$checkInDate",
                  endDate: "$checkOutDate",
                  unit: "day",
                },
              },

              numberOfGuests: 1,
              roomsBooked: 1,
              status: 1,
              totalAmount: 1,
              bookingDate: 1,
              cancelledAt: 1,
              completedAt: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],

        totalCount: [
          {
            $count: "count",
          },
        ],
      },
    },
  ];

  const [result] = await Booking.aggregate(pipeline);

  const bookings = result.data;
  const totalItems = result.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    bookings,
    pagination: {
      totalItems,
      currentPage: page,
      totalPages,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const createBooking = async ({
  userId,
  hotelId,
  checkInDate,
  checkOutDate,
  roomType,
  totalAmount,
  numberOfGuests,
}) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Invalid userId");
    error.statusCode = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    const error = new Error("Invalid hotelId");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId).lean();

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const hotel = await Hotel.findById(hotelId).lean();

  if (!hotel) {
    const error = new Error("Hotel not found");
    error.statusCode = 404;
    throw error;
  }

  if (!hotel.isActive) {
    const error = new Error("Hotel is inactive");
    error.statusCode = 400;
    throw error;
  }

  const selectedRoomType = hotel.roomTypes.find(
    (room) => room.type === roomType
  );

  if (!selectedRoomType) {
    const error = new Error("Room type not available");
    error.statusCode = 400;
    throw error;
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    const error = new Error("Invalid check-in or check-out date");
    error.statusCode = 400;
    throw error;
  }

  if (checkOut <= checkIn) {
    const error = new Error("Check-out date must be after check-in date");
    error.statusCode = 400;
    throw error;
  }

  const guests = Number(numberOfGuests);

  if (!Number.isInteger(guests) || guests < 1) {
    const error = new Error("Number of guests must be at least 1");
    error.statusCode = 400;
    throw error;
  }

  const amount = Number(totalAmount);

  if (!Number.isFinite(amount) || amount < 0) {
    const error = new Error("Total amount must be a valid positive number");
    error.statusCode = 400;
    throw error;
  }

  const roomsRequired = Math.ceil(guests / selectedRoomType.capacity);

  const bookedRooms = await getBookedRoomsForHotel({
    hotelId,
    checkInDate: checkIn,
    checkOutDate: checkOut,
  });

  const actualAvailableRooms = hotel.availableRooms - bookedRooms;

  if (actualAvailableRooms <= 0 || actualAvailableRooms < roomsRequired) {
    const error = new Error(
      `Not enough rooms available. Only ${Math.max(
        actualAvailableRooms,
        0
      )} room(s) available`
    );
    error.statusCode = 400;
    throw error;
  }

  const booking = await Booking.create({
    bookingNumber: generateBookingNumber(),
    userId,
    hotelId,
    roomType,
    roomsBooked: roomsRequired,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    numberOfGuests: guests,
    totalAmount: amount,
    status: "pending",
    bookingDate: new Date(),
  });

  return booking;
};

export const updateBookingStatus = async ({ bookingId, status }) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    const error = new Error("Invalid bookingId");
    error.statusCode = 400;
    throw error;
  }

  if (!allowedBookingStatuses.includes(status)) {
    const error = new Error("Invalid booking status");
    error.statusCode = 400;
    throw error;
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (booking.status === status) {
    return booking;
  }

  if (booking.status === "cancelled") {
    const error = new Error("Cancelled booking status cannot be changed");
    error.statusCode = 400;
    throw error;
  }

  if (booking.status === "completed") {
    const error = new Error("Completed booking status cannot be changed");
    error.statusCode = 400;
    throw error;
  }

  const validTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["completed", "cancelled"],
  };

  if (!validTransitions[booking.status]?.includes(status)) {
    const error = new Error(
      `Booking status cannot be changed from '${booking.status}' to '${status}'`
    );
    error.statusCode = 400;
    throw error;
  }

  booking.status = status;

  if (status === "cancelled") {
    booking.cancelledAt = new Date();
  }

  if (status === "completed") {
    booking.completedAt = new Date();
  }

  await booking.save();

  return booking;
};

export const cancelBooking = async ({ bookingId }) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    const error = new Error("Invalid bookingId");
    error.statusCode = 400;
    throw error;
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    status: {
      $in: ["pending", "confirmed"],
    },
  });

  if (!booking) {
    const existingBooking = await Booking.findById(bookingId).lean();

    if (!existingBooking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      throw error;
    }

    const error = new Error(
      `Booking with status '${existingBooking.status}' cannot be cancelled`
    );
    error.statusCode = 400;
    throw error;
  }

  booking.status = "cancelled";
  booking.cancelledAt = new Date();

  await booking.save();

  return booking;
};