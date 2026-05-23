import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/user.model.js";

dotenv.config();

const users = [
  {
    name: "Divyesh Anchan",
    email: "divyesh@gmail.com",
    phone: "9876543210",
    bookings: 4,
    lastLoggedIn: new Date(),
  },
  {
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "9876543211",
    bookings: 2,
    lastLoggedIn: new Date(),
  },
  {
    name: "Priya Nair",
    email: "priya@gmail.com",
    phone: "9876543212",
    bookings: 7,
    lastLoggedIn: new Date(),
  },
  {
    name: "Arjun Shetty",
    email: "arjun@gmail.com",
    phone: "9876543213",
    bookings: 1,
    lastLoggedIn: new Date(),
  },
  {
    name: "Sneha Rao",
    email: "sneha@gmail.com",
    phone: "9876543214",
    bookings: 5,
    lastLoggedIn: new Date(),
  },
];

const seedUsers = async () => {
  try {
    await connectDB();

    await User.deleteMany();

    await User.insertMany(users);

    console.log("Users Seeded Successfully");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

seedUsers();