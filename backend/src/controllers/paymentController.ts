
import { Request, Response } from "express";
import * as paymentService from "../service/paymentService";
import * as bookingService from "../service/bookingService";

// CREATE PAYMENT AND INITIALIZE PAYSTACK
export const addPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  let paymentId: number | undefined;

  try {
    const user = req.user;
    const bookingId = Number(req.body.booking_id);

    if (!user?.id || !user.email) {
      res.status(401).json({
        message: "User authentication required.",
      });
      return;
    }

    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      res.status(400).json({
        message: "A valid booking_id is required.",
      });
      return;
    }

    const booking = await bookingService.findBookingsById(bookingId);

    if (!booking) {
      res.status(404).json({ message: "Booking not found." });
      return;
    }

    if (Number(booking.user_id) !== Number(user.id)) {
      res.status(403).json({
        message: "You cannot pay for another user's booking.",
      });
      return;
    }

    const amount = Number(booking.total_price);
    
    if (!Number.isFinite(amount) || amount <= 0) {
      res.status(400).json({
        message: "The booking has an invalid payment amount.",
      });
      return;
    }

    const payment = await paymentService.createPayment({
      booking_id: bookingId,
      user_id: user.id,
      amount,
      currency: "ZAR",
      payment_method: "paystack",
    });

    paymentId = payment.id;

    const checkout = await paymentService.initializePaystackPayment(
      payment.id,
      bookingId,
      amount,
      user.email
    );

    await paymentService.updatePaymentReference(
      payment.id,
      checkout.reference
    );

    const savedPayment = await paymentService.getPaymentById(payment.id);

    res.status(201).json({
      message: "Payment initialized successfully.",
      payment: savedPayment ?? payment,
      authorization_url: checkout.authorization_url,
      reference: checkout.reference,
    });
  } catch (error: unknown) {
    console.error("addPayment error:", error);

    if (paymentId !== undefined) {
      try {
        await paymentService.updatePaymentStatus(paymentId, "failed");
      } catch (updateError) {
        console.error("Failed to update payment status:", updateError);
      }
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unable to initialize payment.";

    res.status(502).json({
      message: "Payment initialization failed.",
      error: errorMessage,
    });
  }
};

// GET ALL PAYMENTS — ADMIN ONLY
export const getAllPayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({
        message: "Admin access required.",
      });
      return;
    }

    const payments = await paymentService.getAllPayments();
    res.status(200).json(payments);
  } catch (error: unknown) {
    console.error("getAllPayments error:", error);
    res.status(500).json({
      message: "Failed to fetch payments.",
    });
  }
};

// GET PAYMENT BY ID
export const getPaymentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: "Invalid payment ID." });
      return;
    }

    const payment = await paymentService.getPaymentById(id);

    if (!payment) {
      res.status(404).json({ message: "Payment not found." });
      return;
    }

    if (
      req.user?.role !== "admin" &&
      Number(payment.user_id) !== Number(req.user?.id)
    ) {
      res.status(403).json({ message: "Access denied." });
      return;
    }

    res.status(200).json(payment);
  } catch (error: unknown) {
    console.error("getPaymentById error:", error);
    res.status(500).json({
      message: "Failed to fetch payment.",
    });
  }
};

// GET CURRENT USER'S PAYMENTS
export const getMyPayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        message: "User authentication required.",
      });
      return;
    }

    const payments = await paymentService.getPaymentsByUserId(
      Number(req.user.id)
    );

    res.status(200).json(payments);
  } catch (error: unknown) {
    console.error("getMyPayments error:", error);
    res.status(500).json({
      message: "Failed to fetch your payments.",
    });
  }
};
