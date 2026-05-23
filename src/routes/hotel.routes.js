import express from "express";
import { getHotels } from "../controllers/hotel.controller.js";

const router = express.Router();

router.get("/", getHotels);

export default router;