import dotenv from "dotenv";

import connectDB from "../config/db.js";

import User from "../models/user.model.js";
import Hotel from "../models/hotel.model.js";
import Booking from "../models/booking.model.js";

dotenv.config();

const seedBookings = async () => {
  try {
    await connectDB();

    await Booking.deleteMany();

    const users = await User.find().lean();
    const hotels = await Hotel.find().lean();

    if (!users.length || !hotels.length) {
      console.log("Users or Hotels not found");

      process.exit(1);
    }

    const bookings = [
      {
        bookingNumber: "HB-2026-0001",

        userId: users[0]._id,
        hotelId: hotels[0]._id,

        roomType: "deluxe",

        checkInDate: new Date("2026-06-10"),
        checkOutDate: new Date("2026-06-13"),

        numberOfGuests: 4,

        status: "confirmed",

        totalAmount: 27000,

        bookingDate: new Date("2026-05-23"),
      },

      {
        bookingNumber: "HB-2026-0002",

        userId: users[1]._id,
        hotelId: hotels[1]._id,

        roomType: "standard",

        checkInDate: new Date("2026-06-15"),
        checkOutDate: new Date("2026-06-18"),

        numberOfGuests: 2,

        status: "pending",

        totalAmount: 11400,

        bookingDate: new Date("2026-05-24"),
      },

      {
        bookingNumber: "HB-2026-0003",

        userId: users[2]._id,
        hotelId: hotels[2]._id,

        roomType: "suite",

        checkInDate: new Date("2026-07-01"),
        checkOutDate: new Date("2026-07-05"),

        numberOfGuests: 2,

        status: "completed",

        totalAmount: 56000,

        bookingDate: new Date("2026-05-25"),
      },

      {
        bookingNumber: "HB-2026-0004",

        userId: users[3]._id,
        hotelId: hotels[3]._id,

        roomType: "villa",

        checkInDate: new Date("2026-07-10"),
        checkOutDate: new Date("2026-07-15"),

        numberOfGuests: 6,

        status: "confirmed",

        totalAmount: 125000,

        bookingDate: new Date("2026-05-26"),
      },

      {
        bookingNumber: "HB-2026-0005",

        userId: users[4]._id,
        hotelId: hotels[4]._id,

        roomType: "deluxe",

        checkInDate: new Date("2026-08-01"),
        checkOutDate: new Date("2026-08-03"),

        numberOfGuests: 2,

        status: "cancelled",

        totalAmount: 18000,

        bookingDate: new Date("2026-05-27"),
      },

      {
        bookingNumber: "HB-2026-0006",

        userId: users[0]._id,
        hotelId: hotels[5]._id,

        roomType: "standard",

        checkInDate: new Date("2026-08-10"),
        checkOutDate: new Date("2026-08-12"),

        numberOfGuests: 2,

        status: "confirmed",

        totalAmount: 7800,

        bookingDate: new Date("2026-05-28"),
      },

      {
        bookingNumber: "HB-2026-0007",

        userId: users[1]._id,
        hotelId: hotels[6]._id,

        roomType: "suite",

        checkInDate: new Date("2026-08-20"),
        checkOutDate: new Date("2026-08-25"),

        numberOfGuests: 4,

        status: "pending",

        totalAmount: 45000,

        bookingDate: new Date("2026-05-29"),
      },

      {
        bookingNumber: "HB-2026-0008",

        userId: users[2]._id,
        hotelId: hotels[7]._id,

        roomType: "deluxe",

        checkInDate: new Date("2026-09-01"),
        checkOutDate: new Date("2026-09-04"),

        numberOfGuests: 2,

        status: "completed",

        totalAmount: 15000,

        bookingDate: new Date("2026-05-30"),
      },

      {
        bookingNumber: "HB-2026-0009",

        userId: users[3]._id,
        hotelId: hotels[8]._id,

        roomType: "villa",

        checkInDate: new Date("2026-09-10"),
        checkOutDate: new Date("2026-09-15"),

        numberOfGuests: 8,

        status: "confirmed",

        totalAmount: 175000,

        bookingDate: new Date("2026-05-31"),
      },

      {
        bookingNumber: "HB-2026-0010",

        userId: users[4]._id,
        hotelId: hotels[9]._id,

        roomType: "suite",

        checkInDate: new Date("2026-10-01"),
        checkOutDate: new Date("2026-10-05"),

        numberOfGuests: 2,

        status: "confirmed",

        totalAmount: 64000,

        bookingDate: new Date("2026-06-01"),
      },
    ];

    await Booking.insertMany(bookings);

    console.log("Bookings Seeded Successfully");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

seedBookings();