import { getAllUsers } from "../services/user.service.js";

export const getUsers = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

    const search = req.query.search?.trim() || "";

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

    const result = await getAllUsers({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};