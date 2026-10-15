import { Router } from "express";
import { addBooking,getAllBookings,getBookingsById,deleteBooking } from "../controllers/bookingControllers";
import { protect } from "../middleware/oAuthoMiddleware";

const router = Router();

router.post("/bookings", addBooking)
router.get("/bookings",protect, getAllBookings)
router.get("/bookings/:id",getBookingsById)
router.delete("/bookings/:id",protect,deleteBooking)

export default router;
