import express from 'express';
import dotenv from 'dotenv';
import { testDbConnection } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

testDbConnection(); 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});