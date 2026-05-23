import Booking from "../models/booking.model.js";

const allowedSortFields = {
  bookingDate: "bookingDate",
  checkInDate: "checkInDate",
  checkOutDate: "checkOutDate",
  numberOfGuests: "numberOfGuests",
  totalAmount: "totalAmount",
  createdAt: "createdAt",
};

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
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
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
              status: 1,
              totalAmount: 1,
              bookingDate: 1,
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