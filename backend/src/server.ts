import express from 'express';
import dotenv from 'dotenv';
import cors from "cors"
import { testDbConnection } from './config/database';
import { createOAuthUserTable } from './service/oAuthoService';
import oAuthoRoutes from './routes/oAuthoRoutes';
import hotelRoutes from './routes/hotelRoutes';
import roomRoutes from './routes/roomRoutes';
import bookingRoutes from './routes/bookingRoutes';
import reviewRoutes from './routes/reviewRoutes';
import favouriteRoutes from './routes/favouriteRoutes'
import { createHotelsTable } from './service/hotelService'
import { createRoomsTable } from './service/roomService';
import { createBookingTables } from './service/bookingService';
import { createReviewsTable } from './service/reviewService';
import { createFavourateTable } from './service/favouriteService';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  app.use(express.json());
  app.use(cors())

  await testDbConnection();

  const creatingTables = async () => {
    await createOAuthUserTable();
    await createHotelsTable ();
    await createRoomsTable();
    await createBookingTables();
    await createReviewsTable();
    await createFavourateTable();



  }
  creatingTables();
 
  app.use("/api/autho",oAuthoRoutes);
  app.use("/api",hotelRoutes );
  app.use("/api",roomRoutes);
  app.use("/api",bookingRoutes);
  app.use("/api", reviewRoutes);
  app.use("/api", favouriteRoutes);
 


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
};

startServer()