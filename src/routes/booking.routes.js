import express from "express";

import {
  getBookings,
  createBookingController,
  updateBookingStatusController,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/", getBookings);
router.post("/", createBookingController);
router.patch("/:bookingId/status", updateBookingStatusController);

export default router;