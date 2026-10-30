
import { Request, Response } from "express";
import * as reviewService from "../service/reviewService";

export const addReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;

    if (!user?.id) {
      res.status(401).json({
        message: "Please log in to submit a review.",
      });
      return;
    }

    const { hotel_id, rating, comment } = req.body;

    if (!hotel_id || rating === undefined || rating === null) {
      res.status(400).json({
        message: "Hotel ID and rating are required.",
      });
      return;
    }

    const hotelId = Number(hotel_id);
    const reviewRating = Number(rating);

    if (!Number.isInteger(hotelId) || hotelId <= 0) {
      res.status(400).json({
        message: "Invalid hotel ID.",
      });
      return;
    }

    if (
      !Number.isInteger(reviewRating) ||
      reviewRating < 1 ||
      reviewRating > 5
    ) {
      res.status(400).json({
        message: "Rating must be between 1 and 5.",
      });
      return;
    }

    if (comment !== undefined && typeof comment !== "string") {
      res.status(400).json({
        message: "Comment must be text.",
      });
      return;
    }

    const newReview = await reviewService.createReviews({
      user_id: user.id,
      hotel_id: hotelId,
      rating: reviewRating,
      comment: comment?.trim() || "",
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);

    res.status(500).json({
      message: "Unable to create review.",
    });
  }
};

export const getAllReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reviews = await reviewService.findAllReviews();

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error retrieving reviews:", error);

    res.status(500).json({
      message: "Error retrieving reviews.",
    });
  }
};

export const getReviewsById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        message: "Invalid review ID.",
      });
      return;
    }

    const review = await reviewService.findReviewsById(id);

    if (!review) {
      res.status(404).json({
        message: "Review not found.",
      });
      return;
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("Error retrieving review:", error);

    res.status(500).json({
      message: "Error retrieving review.",
    });
  }
};

export const deleteReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({
        message: "Only admins can delete reviews.",
      });
      return;
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        message: "Invalid review ID.",
      });
      return;
    }

    const review = await reviewService.deleteReviewsById(id);

    if (!review) {
      res.status(404).json({
        message: "Review not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting review:", error);

    res.status(500).json({
      message: "Error deleting review.",
    });
  }
};
