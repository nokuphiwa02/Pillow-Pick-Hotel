
import { Pool } from "pg";
import dotenv from "dotenv";
import dns from "dns";
import net from "net";

dotenv.config();

 dns.setDefaultResultOrder("ipv4first");
 net.setDefaultAutoSelectFamilyAttemptTimeout(5000);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 30000,
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
