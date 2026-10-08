import express from 'express';
import dotenv from 'dotenv';
import { testDbConnection } from './config/database';
import { createOAuthUserTable } from './service/oAuthoService';
import oAuthoRoutes from './routes/oAuthoRoutes';
// import { await } from 'react-router-dom';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  app.use(express.json());

  await testDbConnection();

  const creatingTables = async () => {
    await createOAuthUserTable();



  }
  creatingTables();
 
  app.use("/api/autho",oAuthoRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
};

startServer()