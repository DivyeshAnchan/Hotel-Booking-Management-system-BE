import User from "../models/user.model.js";

const allowedSortFields = {
  name: "name",
  bookings: "bookings",
  createdAt: "createdAt",
  lastSeen: "lastLoggedIn",
};



export const getAllUsers = async ({
  page = 1,
  limit = 10,
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc",
}) => {
  const skip = (page - 1) * limit;

  const matchStage = search
    ? {
      $match: {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      },
    }
    : {
      $match: {},
    };

  const sortField = allowedSortFields[sortBy] || "createdAt";
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const pipeline = [
    matchStage,

    {
      $lookup: {
        from: "bookings",
        localField: "_id",
        foreignField: "userId",
        as: "userBookings",
      },
    },

    {
      $addFields: {
        bookings: {
          $size: "$userBookings",
        },
      },
    },

    {
      $project: {
        name: 1,
        email: 1,
        phone: 1,
        bookings: 1,
        joinedAt: "$createdAt",
        lastSeen: "$lastLoggedIn",
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
        ],
        totalCount: [
          { $count: "count" },
        ],
      },
    },
  ];

  const [result] = await User.aggregate(pipeline);

  const users = result.data;
  const totalUsers = result.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users,
    pagination: {
      totalItems: totalUsers,
      currentPage: page,
      totalPages,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};