import express from 'express';
import dotenv from 'dotenv';
import cors from "cors"
import { testDbConnection } from './config/database';
import { createOAuthUserTable } from './service/oAuthoService';
import oAuthoRoutes from './routes/oAuthoRoutes';
import hotelRoutes from './routes/hotelRoutes';
import { createHotelsTable } from './service/hotelService'


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



  }
  creatingTables();
 
  app.use("/api/autho",oAuthoRoutes);
  app.use("/api",hotelRoutes )


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
};

startServer()