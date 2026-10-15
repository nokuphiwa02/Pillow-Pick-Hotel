import { query } from "express-validator";
import { Reviews, NewReviews } from "../Types/reviews.types";

export const createReviewsTable = async(): Promise<void> => {
    await query(`
        CREATE TABLE IF NOT EXISTS reviews(
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES oauth_users(id) ON DELETE CASCADE,
        hotel_id INT NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
        rating INT,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `);
     try{
        console.log('reviews table created successfully');
     }catch(error){
        console.error('Error creating reviews table:',error)
     }
}