import { query } from '../config/database'
import { Favourites,NewFavourites } from '../Types/favourites.types'

export const createFavourateTable = async() : Promise<void> => {
    await query(`
        CREATE TABLE IF NOT EXISTS favourites(
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES oauth_users(id) ON DELETE CASCADE,
        hotel_id INT NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `)
        try{
            console.log('favourates table created successfully')
        }catch(error){
            console.error('Error creating reviews table:',error)
        }
};

export const createFavourites = async (appData: NewFavourites): Promise<Favourites> => {
 const { user_id, hotel_id} = appData;

 const { rows } = await query(
    `INSERT INTO favourites (user_id,hotel_id) VALUES($1,$2) 
    RETURNING * 
    `,
    [user_id,hotel_id]
 );
 return rows [0];
};

export const findAllFavourites = async(): Promise<Favourites[]> => {
    const { rows } = await query(
        `SELECT id,user_id,hotel_id,created_at
        FROM favourites ORDER BY id ASC`
    );
    return rows;
};

export const findFavouritesById = async(id: number): Promise<Favourites | null> => {
    const { rows } = await query(`SELECT * FROM favourites WHERE id= $1` ,[id]);
    return rows[0] || null;
};

export const deleteFavouritesById = async(id: number): Promise<Favourites | null> =>{
    const { rows } =await query(
        `DELETE FROM favourites WHERE id = $1 RETURNING *`,
        [id]
    );
    return rows [0] || null
};

