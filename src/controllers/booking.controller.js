import { getAllBookings ,createBooking,updateBookingStatus,cancelBooking} from "../services/booking.service.js";

const allowedRoomTypes = ["standard", "deluxe", "suite", "villa"];
const allowedStatuses = ["pending", "confirmed", "cancelled", "completed"];

export const getBookings = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

    const search = req.query.search?.trim() || "";

    const roomType = allowedRoomTypes.includes(req.query.roomType)
      ? req.query.roomType
      : "";

    const status = allowedStatuses.includes(req.query.status)
      ? req.query.status
      : "";

    const bookingDateFrom = req.query.bookingDateFrom || "";
    const bookingDateTo = req.query.bookingDateTo || "";

    const checkInDateFrom = req.query.checkInDateFrom || "";
    const checkInDateTo = req.query.checkInDateTo || "";

    const checkOutDateFrom = req.query.checkOutDateFrom || "";
    const checkOutDateTo = req.query.checkOutDateTo || "";

    const sortBy = req.query.sortBy || "bookingDate";
    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

    const result = await getAllBookings({
      page,
      limit,
      search,
      roomType,
      status,
      bookingDateFrom,
      bookingDateTo,
      checkInDateFrom,
      checkInDateTo,
      checkOutDateFrom,
      checkOutDateTo,
      sortBy,
      sortOrder,
    });

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: result.bookings,
      pagination: result.pagination,
      filters: {
        search,
        roomType,
        status,
        bookingDateFrom,
        bookingDateTo,
        checkInDateFrom,
        checkInDateTo,
        checkOutDateFrom,
        checkOutDateTo,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("Get Bookings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

export const createBookingController = async (req, res) => {
  try {
    const booking = await createBooking(req.body);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create booking",
    });
  }
};

export const updateBookingStatusController = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await updateBookingStatus({
      bookingId,
      status,
    });

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
    });
  } catch (error) {
    console.error("Update Booking Status Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update booking status",
    });
  }
};

export const cancelBookingController = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await cancelBooking({ bookingId });

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to cancel booking",
    });
  }
};