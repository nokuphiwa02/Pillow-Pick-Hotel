import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path'; 
import { testDbConnection } from './config/database';
import { createOAuthUserTable } from './service/oAuthoService';
import oAuthoRoutes from './routes/oAuthoRoutes';
import hotelRoutes from './routes/hotelRoutes';
import roomRoutes from './routes/roomRoutes';
import bookingRoutes from './routes/bookingRoutes';
import reviewRoutes from './routes/reviewRoutes';
import favouriteRoutes from './routes/favouriteRoutes';
import hotelImageRoutes from './routes/hotelImageRoutes';
import profileRoutes from './routes/profileRoutes';
import PaymentRoutes from './routes/paymentRoutes';
import { createHotelsTable } from './service/hotelService';
import { createRoomsTable } from './service/roomService';
import { createBookingTables } from './service/bookingService';
import { createReviewsTable } from './service/reviewService';
import { createFavourateTable } from './service/favouriteService';
import { createHotelImageTable } from './service/hotelImageService';
import { createProfileTable } from './service/profileService';
import { createPaymentTables } from './service/paymentService';

dotenv.config();

const app = express();
// Render automatically handles process.env.PORT, falling back to 5000 locally
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  app.use(express.json());
  app.use(cors())

//   // 1. Configure allowed origins array
//   const allowedOrigins = [
//     process.env.FRONTEND_URL?.replace(/\/$/, ""),
//     "http://localhost:5173",
//   ].filter(Boolean) as string[];

//   // 2. Properly initialize CORS with your allowedOrigins array
//   app.use(
//   cors({
//     origin(origin, callback) {
//       // Allow requests without Origin for tools such as Thunder Client.
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Origin is not allowed by CORS."));
//       }
//     },
//     credentials: true,
//   }),
// );


  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  // 3. Connect to database and sync tables sequentially
  try {
    await testDbConnection();
    
    console.log("Synchronizing database tables...");
    await createOAuthUserTable();
    await createHotelsTable();
    await createRoomsTable();
    await createBookingTables();
    await createReviewsTable();
    await createFavourateTable();
    await createHotelImageTable();
    await createProfileTable();
    await createPaymentTables();
    console.log("All tables checked/created successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }

  // 4. Register Route Handlers
  app.use("/api/autho", oAuthoRoutes);
  app.use("/api", hotelRoutes);
  app.use("/api", roomRoutes);
  app.use("/api", bookingRoutes);
  app.use("/api", reviewRoutes);
  app.use("/api", favouriteRoutes);
  app.use("/api", hotelImageRoutes);
  app.use("/api", profileRoutes);
  app.use("/api", PaymentRoutes);

  // 5. Start Listener
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
