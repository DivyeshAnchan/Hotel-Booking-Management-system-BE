import Hotel from "../models/hotel.model.js";

const allowedSortFields = {
  name: "name",
  rating: "rating",
  pricePerNight: "pricePerNight",
  availability: "availableRooms",
  totalBooked: "totalBooked",
  createdAt: "createdAt",
};

export const getAllHotels = async ({
  page = 1,
  limit = 10,
  search = "",
  state = "",
  city = "",
  rating = "",
  status = "",
  sortBy = "createdAt",
  sortOrder = "desc",
}) => {
  const skip = (page - 1) * limit;

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  if (state) {
    filter.state = { $regex: `^${state}$`, $options: "i" };
  }

  if (city) {
    filter.city = { $regex: `^${city}$`, $options: "i" };
  }

  if (rating) {
    filter.rating = { $gte: Number(rating) };
  }

  if (status === "active") {
    filter.isActive = true;
  }

  if (status === "inactive") {
    filter.isActive = false;
  }

  const sortField = allowedSortFields[sortBy] || "createdAt";
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const [hotels, totalItems] = await Promise.all([
    Hotel.find(filter)
      .select(
        "name location city state country phone rating amenities pricePerNight availableRooms totalBooked isActive createdAt updatedAt"
      )
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean(),

    Hotel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    hotels,
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