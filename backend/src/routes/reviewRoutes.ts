import { Router } from "express";
import { addReviews, deleteReview, getAllReviews, getReviewsById, } from "../controllers/reviewController";
import { protect } from "../middleware/oAuthoMiddleware";

const router = Router();

router.post("/reviews", protect, addReviews)
router.get("/reviews", getAllReviews)
router.get("/reviews/:id", getReviewsById)
router.delete("/reviews/:id",protect, deleteReview)

export default router;