
import { Router } from "express";
import {addPayment,getAllPayments,getPaymentById,getMyPayments,verifyPayment,} from "../controllers/paymentController";
import { protect } from "../middleware/oAuthoMiddleware";

const router = Router();

// Create a payment for the logged-in user's booking
router.post("/payments", protect, addPayment);

// Get all payments (admin only — checked in controller)
router.get("/payments", protect, getAllPayments);

// Get payments belonging to the logged-in user
router.get("/payments/my-payments", protect, getMyPayments);

router.get("/payments/verify", protect, verifyPayment);

// // Get payments for a specific booking
// router.get("/payments/booking/:bookingId", protect, getPaymentsByBookingId);

// Get one payment by ID
router.get("/payments/:id", protect, getPaymentById);

// // Update payment status (admin only in the current controller)
// router.patch("/payments/:id/status", protect, updatePaymentStatus);

// // Delete a payment (admin only in the current controller)
// router.delete("/payments/:id", protect, deletePayment);

export default router;
