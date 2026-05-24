import dotenv from "dotenv";

import connectDB from "../config/db.js";
import Hotel from "../models/hotel.model.js";

dotenv.config();

const budgetRooms = [
  {
    type: "standard",
    pricePerNight: 2200,
    capacity: 2,
  },
  {
    type: "deluxe",
    pricePerNight: 3800,
    capacity: 2,
  },
];

const premiumRooms = [
  {
    type: "standard",
    pricePerNight: 3000,
    capacity: 2,
  },
  {
    type: "deluxe",
    pricePerNight: 4800,
    capacity: 2,
  },
  {
    type: "suite",
    pricePerNight: 7500,
    capacity: 2,
  },
];

const luxuryRooms = [
  {
    type: "deluxe",
    pricePerNight: 6500,
    capacity: 2,
  },
  {
    type: "suite",
    pricePerNight: 10000,
    capacity: 2,
  },
  {
    type: "villa",
    pricePerNight: 18000,
    capacity: 2,
  },
];

const mangaloreHotels = [
  ["Ocean Pearl", "MG Road", "9876543210", 4.5],
  ["Royal Residency", "Kadri Road", "9876543211", 4.2],
  ["Blue Lagoon", "Balmatta Road", "9876543220", 4.3],
  ["Palm Residency", "Airport Road", "9876543221", 4.1],
  ["Harbor View Inn", "Hampankatta", "9876500001", 4.2],
  ["Coastal Comfort", "Kadri", "9876500002", 4.5],
  ["Cityline Residency", "Lalbagh", "9876500003", 3.9],
  ["Palm Grove Hotel", "Surathkal", "9876500004", 4.1],
  ["Bay Breeze Stay", "Bejai", "9876500005", 4.0],
  ["Comfort Inn Express", "Attavar", "9876500015", 3.7],
  ["Canara Grand", "Kankanady", "9876500016", 4.4],
  ["West Coast Suites", "Bendoorwell", "9876500017", 4.6],
  ["Nethravathi Residency", "Jeppinamogaru", "9876500018", 3.8],
  ["Port City Hotel", "Bunder", "9876500019", 4.0],
  ["Kadri Heights", "Kadri Hills", "9876500020", 4.3],
  ["Lighthouse Bay Resort", "Tannirbhavi", "9876500021", 4.7],
  ["Mangaladevi Comforts", "Mangaladevi", "9876500022", 3.9],
  ["Falnir Executive Stay", "Falnir", "9876500023", 4.2],
  ["Sultan Bathery Inn", "Sultan Bathery", "9876500024", 4.1],
  ["Panambur Beach Stay", "Panambur", "9876500025", 4.5],
  ["Ullal Sea View", "Ullal", "9876500026", 4.4],
  ["Bejai Urban Hotel", "Bejai Main Road", "9876500027", 4.0],
  ["Bondel Business Hotel", "Bondel", "9876500028", 3.8],
  ["Derebail Grand Stay", "Derebail", "9876500029", 4.2],
  ["Pumpwell Plaza", "Pumpwell", "9876500030", 3.9],
  ["Kuloor River View", "Kuloor", "9876500031", 4.3],
  ["Kottara Royal Inn", "Kottara Chowki", "9876500032", 4.1],
  ["Valencia Comfort Stay", "Valencia", "9876500033", 4.0],
  ["Urwa Residency", "Urwa", "9876500034", 3.7],
  ["Bajpe Airport Hotel", "Bajpe", "9876500035", 4.2],
  ["Surathkal Elite", "Surathkal Main Road", "9876500036", 4.3],
  ["Thokkottu Grand", "Thokkottu", "9876500037", 3.9],
  ["Car Street Heritage Hotel", "Car Street", "9876500038", 4.4],
  ["Forum Mall Stay", "Pandeshwar", "9876500039", 4.1],
  ["Central Market Hotel", "Central Market", "9876500040", 3.8],
];

const hotels = [
  ...mangaloreHotels.map(([name, location, phone, rating], index) => ({
    name,
    location,

    city: "Mangalore",
    state: "Karnataka",
    country: "India",

    phone,

    rating,

    amenities: ["Wifi", "Parking", "Restaurant"],

    roomTypes:
      index % 3 === 0
        ? luxuryRooms
        : index % 2 === 0
        ? premiumRooms
        : budgetRooms,

    availableRooms: 8 + (index % 15),

    totalBooked: 100 + index * 10,

    isActive: true,
  })),

  {
    name: "Grand Palace",

    location: "Brigade Road",

    city: "Bangalore",
    state: "Karnataka",
    country: "India",

    phone: "9876543212",

    rating: 5,

    amenities: ["Wifi", "Spa", "Pool", "Bar"],

    roomTypes: luxuryRooms,

    availableRooms: 5,

    totalBooked: 340,

    isActive: true,
  },

  {
    name: "Skyline Suites",

    location: "Indiranagar",

    city: "Bangalore",
    state: "Karnataka",
    country: "India",

    phone: "9876543222",

    rating: 4.8,

    amenities: ["Pool", "Spa", "Wifi", "Bar"],

    roomTypes: luxuryRooms,

    availableRooms: 7,

    totalBooked: 340,

    isActive: true,
  },

  {
    name: "Tech Park Inn",

    location: "Whitefield",

    city: "Bangalore",
    state: "Karnataka",
    country: "India",

    phone: "9876543223",

    rating: 3.9,

    amenities: ["Wifi", "Parking"],

    roomTypes: budgetRooms,

    availableRooms: 20,

    totalBooked: 210,

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

    roomTypes: budgetRooms,

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

    roomTypes: luxuryRooms,

    availableRooms: 6,

    totalBooked: 410,

    isActive: true,
  },

  {
    name: "Beach Crown",

    location: "Baga Beach",

    city: "Goa",
    state: "Goa",
    country: "India",

    phone: "9876543224",

    rating: 4.7,

    amenities: ["Pool", "Beach View", "Wifi"],

    roomTypes: luxuryRooms,

    availableRooms: 5,

    totalBooked: 420,

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

    roomTypes: premiumRooms,

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

    roomTypes: premiumRooms,

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

    roomTypes: budgetRooms,

    availableRooms: 18,

    totalBooked: 140,

    isActive: true,
  },

  {
    name: "Metro Grand",

    location: "Hitech City",

    city: "Hyderabad",
    state: "Telangana",
    country: "India",

    phone: "9876543225",

    rating: 4.0,

    amenities: ["Wifi", "Gym", "Parking"],

    roomTypes: premiumRooms,

    availableRooms: 16,

    totalBooked: 190,

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

    roomTypes: premiumRooms,

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

    roomTypes: luxuryRooms,

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

    process.exit(0);
  } catch (error) {
    console.error("Hotel Seed Error:", error);

    process.exit(1);
  }
};

seedHotels();