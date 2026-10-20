import { query } from '../config/database';
import {hotelImage, NewHotelImage} from'../Types/hotelImage.types'

export const createHotelImageTable = async(): Promise<void> => {
    await query(`
        CREATE TABLE IF NOT EXISTS hotel_image(
        id SERIAL PRIMARY KEY,
        hotel_id INT NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
        is_primary BOOLEAN DEFAULT FALSE NOT NULL,
        img_url VARCHAR(2048) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `)
        try{
            console.log('hotel_image table created successfuly');
        }catch(error){
            console.error('Error creating hotelImage:',error)
        }
};

export const createhotelImage = async (appData: NewHotelImage): Promise<hotelImage> => {
    const {  hotel_id, is_primary,  img_url} = appData;

    const { rows } = await query(
        `
        INSERT INTO hotel_image(hotel_id, is_primary, img_url)
        VALUES($1, $2, $3)
        RETURNING *
        `,
        [hotel_id, is_primary, img_url]
    );

    return rows[0];
};

export const findAllhotelImage = async(): Promise<hotelImage[]> => {
    const { rows } = await query(
        `SELECT id,hotel_id, is_primary, img_url,created_at
        FROM hotel_image ORDER BY id ASC`
    );
    return rows;
};

export const findhotelImageById = async(id: number): Promise<hotelImage | null> => {
    const { rows } = await query(`SELECT * FROM hotel_image WHERE id= $1` ,[id]);
    return rows[0] || null;
};

export const updateHotelImageById = async(id: number, appData: hotelImage ): Promise<hotelImage | null> => {
    const {hotel_id, is_primary, img_url} = appData
    const { rows } = await query(`UPDATE hotel_image
        SET hotel_id = COALESCE($1,hotel_id),
        is_primary = COALESCE($2,is_primary),
        img_url= COALESCE($3,img_url),
        WHERE id = $4
        RETURNING * `,
        [hotel_id,is_primary,img_url,id]
    );
    return rows[0] || null;
};

export const deletehotelImageById = async(id: number): Promise<hotelImage | null> =>{
    const { rows } =await query(
        `DELETE FROM hotel_image WHERE id = $1 RETURNING *`,
        [id]
    );
    return rows [0] || null
};