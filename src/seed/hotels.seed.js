import dotenv from "dotenv";

import connectDB from "../config/db.js";
import Hotel from "../models/hotel.model.js";

dotenv.config();

const hotels = [
  {
    name: "Ocean Pearl",
    location: "MG Road",
    city: "Mangalore",
    state: "Karnataka",
    country: "India",
    phone: "9876543210",
    rating: 4.5,
    amenities: ["Wifi", "Pool", "Gym", "Parking"],
    pricePerNight: 4500,
    availableRooms: 12,
    totalBooked: 220,
    isActive: true,
  },

  {
    name: "Royal Residency",
    location: "Kadri Road",
    city: "Mangalore",
    state: "Karnataka",
    country: "India",
    phone: "9876543211",
    rating: 4.2,
    amenities: ["Wifi", "Restaurant", "Parking"],
    pricePerNight: 3800,
    availableRooms: 8,
    totalBooked: 180,
    isActive: true,
  },

  {
    name: "Grand Palace",
    location: "Brigade Road",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    phone: "9876543212",
    rating: 5,
    amenities: ["Wifi", "Spa", "Pool", "Bar"],
    pricePerNight: 7200,
    availableRooms: 5,
    totalBooked: 340,
    isActive: true,
  },

  {
    name: "City Comfort Inn",
    location: "Panjim Market",
    city: "Panjim",
    state: "Goa",
    country: "India",
    phone: "9876543213",
    rating: 3.8,
    amenities: ["Wifi", "Parking"],
    pricePerNight: 2500,
    availableRooms: 20,
    totalBooked: 120,
    isActive: true,
  },

  {
    name: "Sea Breeze Resort",
    location: "Calangute Beach",
    city: "Calangute",
    state: "Goa",
    country: "India",
    phone: "9876543214",
    rating: 4.7,
    amenities: ["Pool", "Beach View", "Spa", "Wifi"],
    pricePerNight: 8600,
    availableRooms: 6,
    totalBooked: 410,
    isActive: true,
  },

  {
    name: "Hilltop Retreat",
    location: "Ooty Hills",
    city: "Ooty",
    state: "Tamil Nadu",
    country: "India",
    phone: "9876543215",
    rating: 4.1,
    amenities: ["Wifi", "Bonfire", "Parking"],
    pricePerNight: 3900,
    availableRooms: 15,
    totalBooked: 160,
    isActive: false,
  },

  {
    name: "Lakeside Residency",
    location: "Alleppey Lake",
    city: "Alleppey",
    state: "Kerala",
    country: "India",
    phone: "9876543216",
    rating: 4.6,
    amenities: ["Wifi", "Boat Ride", "Restaurant"],
    pricePerNight: 5600,
    availableRooms: 10,
    totalBooked: 290,
    isActive: true,
  },

  {
    name: "Urban Stay",
    location: "Banjara Hills",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    phone: "9876543217",
    rating: 3.9,
    amenities: ["Wifi", "Parking", "Gym"],
    pricePerNight: 3100,
    availableRooms: 18,
    totalBooked: 140,
    isActive: true,
  },

  {
    name: "Desert Mirage",
    location: "Jaisalmer Fort Road",
    city: "Jaisalmer",
    state: "Rajasthan",
    country: "India",
    phone: "9876543218",
    rating: 4.3,
    amenities: ["Wifi", "Camel Safari", "Restaurant"],
    pricePerNight: 4700,
    availableRooms: 9,
    totalBooked: 200,
    isActive: false,
  },

  {
    name: "Snow Peak Hotel",
    location: "Mall Road",
    city: "Manali",
    state: "Himachal Pradesh",
    country: "India",
    phone: "9876543219",
    rating: 4.8,
    amenities: ["Heater", "Wifi", "Mountain View"],
    pricePerNight: 6900,
    availableRooms: 4,
    totalBooked: 380,
    isActive: true,
  },
];

const seedHotels = async () => {
  try {
    await connectDB();

    await Hotel.deleteMany();

    await Hotel.insertMany(hotels);

    console.log("Hotels Seeded Successfully");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

seedHotels();