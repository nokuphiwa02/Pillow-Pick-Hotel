import { query } from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Rooms, NewRooms } from '../Types/rooms.types';

export const createRoomsTable = async (): Promise<void> => {
    await query(`
        DO $$ BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_type  WHERE   typname ='room_type')
        THEN CREATE TYPE room_type AS ENUM ('Standard Room', 
        'Superior Room', 'Deluxe Room', 'Executive Room');
        END IF;
        END $$
        `);

    await query(`
    CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    hotel_id INT NOT NULL,
    room_type room_type NOT NULL,
    capacity INT NOT NULL,
    quantity INT NOT NULL,
    description TEXT,
    price_per_night DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     )
    `);
    try{
        console.log('rooms table created successfully');
    }catch(error){
         console.error('Error creating rooms table:', error);
    }
};

export const createRooms = async(appData: NewRooms): Promise<Rooms> =>{
    const {hotel_id,room_type,capacity,quantity,description,price_per_night} = appData
    const { rows} = await query(`
        INSERT INTO rooms(hotel_id,room_type,capacity,quantity,description,price_per_night) 
        VALUES($1,$2,$3,$4,$5,$6)RETURNING *`,
        [hotel_id,room_type,capacity,quantity,description,price_per_night]
        );
        return rows[0];
};


export const findAllRooms = async(): Promise<Rooms[]> => {
    const { rows } = await query(
        `SELECT id,hotel_id,room_type,capacity,quantity,description,price_per_night,created_at
        FROM rooms ORDER BY id ASC`
    );
    return rows;
};

export const findRoomById = async(id: number): Promise<Rooms | null> => {
    const { rows } = await query(`SELECT * FROM rooms WHERE id= $1` ,[id]);
    return rows[0] || null;
};

export const updateRoomById = async(id: number, appData: Rooms ): Promise<Rooms | null> => {
    const {hotel_id,room_type,capacity,quantity,description,price_per_night} = appData
    const { rows } = await query(`UPDATE rooms
        SET hotel_id = COALESCE($1,hotel_id),
        room_type = COALESCE($2,room_type),
        capacity= COALESCE($3,capacity),
        quantity = COALESCE($4,quantity),
        description = COALESCE($5,description),
        price_per_night = COALESCE($6,price_per_night)
        WHERE id = $7
        RETURNING * `,
        [hotel_id,room_type,capacity,quantity,description,price_per_night,id]
    );
    return rows[0] || null;
};

export const deleteRoomById = async(id: number): Promise<Rooms | null> =>{
    const { rows } =await query(
        `DELETE FROM rooms WHERE id = $1 RETURNING *`,
        [id]
    );
    return rows [0] || null
};