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

  const filter = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const sortField = allowedSortFields[sortBy] || "createdAt";
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const [users, totalUsers] = await Promise.all([
    User.find(filter)
      .select("name email phone bookings createdAt lastLoggedIn")
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean(),

    User.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users,
    pagination: {
      totalUsers,
      currentPage: page,
      totalPages,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};