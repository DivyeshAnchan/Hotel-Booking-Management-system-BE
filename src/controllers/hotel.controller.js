import { getAllHotels } from "../services/hotel.service.js";

export const getHotels = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

    const search = req.query.search?.trim() || "";
    const state = req.query.state?.trim() || "";
    const city = req.query.city?.trim() || "";
    const rating = req.query.rating || "";
    const status = req.query.status || "";

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

    const result = await getAllHotels({
      page,
      limit,
      search,
      state,
      city,
      rating,
      status,
      sortBy,
      sortOrder,
    });

    return res.status(200).json({
      success: true,
      message: "Hotels fetched successfully",
      data: result.hotels,
      pagination: result.pagination,
      filters: {
        search,
        state,
        city,
        rating,
        status,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("Get Hotels Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hotels",
    });
  }
};