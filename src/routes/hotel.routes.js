import express from "express";
import { getHotels,getCities,getStates } from "../controllers/hotel.controller.js";

const router = express.Router();

router.get("/", getHotels);
router.get("/states", getStates);
router.get("/cities", getCities);

export default router;