import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import hotelRoutes from "./routes/hotel.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hotel Backend Running",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);

export default app;