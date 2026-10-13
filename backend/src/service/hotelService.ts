import { query } from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Hotels, NewHotels } from '../Types/hotels.types';

export const createHotelsTable = async (): Promise<void> => {
    const {rows} = await query(`
    CREATE TABLE IF NOT EXISTS hotels(
    id SERIAL PRIMARY KEY,
    hotel_name VARCHAR(200),
    address VARCHAR(200),
    city VARCHAR(200),
    rating INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `);
    try{
        console.log('hotels table created successfully');
    }catch(error){
        console.error('Error creating hotels table')
    }
};

export const createHotels = async (appData: NewHotels):Promise<Hotels> => {
    const {hotel_name, address,city,rating,description} = appData
    const {rows} = await query(
    `INSERT INTO hotels (hotel_name, address,city,rating,description) VALUES($1,$2,$3,$4,$5)RETURNING *`,
    [hotel_name, address,city,rating,description]
    );
    return rows[0];
};

export const findAllHotels = async(): Promise<Hotels[]> => {
    const { rows } = await query(
        `SELECT id,hotel_name,address,city,rating,description,created_at
        FROM hotels ORDER BY id ASC`
    );
    return rows;
};

export const findHotelById = async(id: number): Promise<Hotels | null> => {
    const { rows } = await query(`SELECT * FROM hotels WHERE id= $1` ,[id]);
    return rows[0] || null;
};

export const updateHotelById = async(id: number, appData: Hotels ): Promise<Hotels | null> => {
    const {hotel_name,address,city,rating,description} = appData
    const { rows } = await query(`UPDATE hotels
        SET hotel_name = COALESCE($1,hotel_name),
        address = COALESCE($2,address),
        city= COALESCE($3,city),
        rating = COALESCE($4,rating),
        description = COALESCE($5,description)
        WHERE id = $6
        RETURNING * `,
        [hotel_name ,address,city,rating,description,id]
    );
    return rows[0] || null;
};

export const deleteHotelById = async(id: number): Promise<Hotels | null> =>{
    const { rows } =await query(
        `DELETE FROM hotels WHERE id = $1 RETURNING *`,
        [id]
    );
    return rows [0] || null
};
     