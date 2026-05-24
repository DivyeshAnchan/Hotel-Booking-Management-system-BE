import Hotel from "../models/hotel.model.js";

const allowedSortFields = {
  name: "name",
  rating: "rating",
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

  const matchFilter = {};

  if (search) {
    matchFilter.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  if (state) {
    matchFilter.state = { $regex: `^${state}$`, $options: "i" };
  }

  if (city) {
    matchFilter.city = { $regex: `^${city}$`, $options: "i" };
  }

  if (rating) {
    matchFilter.rating = { $gte: Number(rating) };
  }

  if (status === "active") {
    matchFilter.isActive = true;
  }

  if (status === "inactive") {
    matchFilter.isActive = false;
  }

  const sortField = allowedSortFields[sortBy] || "createdAt";
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const pipeline = [
    {
      $match: matchFilter,
    },

    {
      $lookup: {
        from: "bookings",
        localField: "_id",
        foreignField: "hotelId",
        as: "hotelBookings",
      },
    },

    {
      $addFields: {
        totalBooked: {
          $size: "$hotelBookings",
        },
      },
    },

    {
      $project: {
        name: 1,
        location: 1,
        city: 1,
        state: 1,
        country: 1,
        phone: 1,
        rating: 1,
        amenities: 1,
        roomTypes: 1,
        availableRooms: 1,
        totalBooked: 1,
        isActive: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },

    {
      $sort: {
        [sortField]: sortDirection,
      },
    },

    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const [result] = await Hotel.aggregate(pipeline);

  const hotels = result.data;
  const totalItems = result.totalCount[0]?.count || 0;
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

export const getAvailableStates = async () => {
  const states = await Hotel.distinct("state", {
    isActive: true,
  });

  return states.sort();
};

export const getAvailableCitiesByState = async (state) => {
  const filter = {
    isActive: true,
  };

  if (state) {
    filter.state = { $regex: `^${state}$`, $options: "i" };
  }

  const cities = await Hotel.distinct("city", filter);

  return cities.sort();
};
