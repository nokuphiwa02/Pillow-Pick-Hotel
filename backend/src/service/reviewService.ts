import { query } from "../config/database";
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
};

export const createReviews = async ( appData: NewReviews): Promise<Reviews> => {
    const {user_id, hotel_id,rating,comment} = appData;

    const { rows } = await query(
        `INSERT INTO reviews (user_id,hotel_id,rating,comment)
        VALUES($1, $2, $3,$4)
        RETURNING *
        `,
        [user_id, hotel_id,rating,comment]
    );
    return rows[0]
};

export const findAllReviews = async(): Promise<Reviews[]> => {
    const { rows } = await query(
        `SELECT id,user_id, hotel_id, rating, comment,created_at
        FROM reviews ORDER BY id ASC`
    );
    return rows;
};

export const findReviewsById = async(id: number): Promise<Reviews | null> => {
    const { rows } = await query(`SELECT * FROM reviews WHERE id= $1` ,[id]);
    return rows[0] || null;
};

export const deleteReviewsById = async(id: number): Promise<Reviews | null> =>{
    const { rows } =await query(
        `DELETE FROM reviews WHERE id = $1 RETURNING *`,
        [id]
    );
    return rows [0] || null
};