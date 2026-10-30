import { query } from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NewProfile, Profile } from '../Types/profile.types';

export const createProfileTable = async (): Promise<void> => {
    const { rows } = await query(`
        CREATE TABLE IF NOT EXISTS profile(
        id SERIAL PRIMARY KEY,
        user_id INT UNIQUE NOT NULL REFERENCES oauth_users(id) ON DELETE CASCADE,
        name VARCHAR(100),
        email VARCHAR(100),
        password VARCHAR(100),
        phone VARCHAR(20),
        profile_picture TEXT,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    try{
        console.log("profile table created successfully");
    }catch(error){
        console.error('Error creating profile table:', error);
    }
};


export const createProfile = async (appData: NewProfile): Promise<Profile> => {
  const {
    user_id,
    name,
    email,
    password,
    phone,
    profile_picture,
    address,
  } = appData;

  const { rows } = await query(
    `INSERT INTO profile (
      user_id, name, email, password, phone, profile_picture, address
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      user_id,
      name,
      email,
      password,
      phone,
      profile_picture,
      address,
    ]
  );

  return rows[0];
};


export const findProfileById = async (
  userId: number
): Promise<Profile | null> => {
  const { rows } = await query(
    `SELECT * FROM profile WHERE user_id = $1`,
    [userId]
  );

  return rows[0] || null;
};
export const updateProfileById = async (
  userId: number,
  appData: Partial<Profile>
): Promise<Profile | null> => {
  const { name, email, password, phone, profile_picture, address } = appData;

  const { rows } = await query(
    `UPDATE profile
     SET name = COALESCE($1, name),
         email = COALESCE($2, email),
         password = COALESCE($3, password),
         phone = COALESCE($4, phone),
         profile_picture = COALESCE($5, profile_picture),
         address = COALESCE($6, address)
     WHERE user_id = $7
     RETURNING *`,
    [name, email, password, phone, profile_picture, address, userId]
  );

  return rows[0] || null;
};