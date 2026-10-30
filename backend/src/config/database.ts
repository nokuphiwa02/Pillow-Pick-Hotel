
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

export const query = (text: string, params?: any[]) =>
  pool.query(text, params);

export const testDbConnection = async (): Promise<void> => {
  let client;

  try {
    client = await pool.connect();
    console.log("Database connection successful");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    client?.release();
  }
};
