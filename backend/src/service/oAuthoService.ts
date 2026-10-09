import {query} from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuthUser } from '../Types/oAutho.types';

export const createOAuthUserTable = async (): Promise<void> => {
  const { rows } = await query(`
    CREATE TABLE IF NOT EXISTS oauth_users (
      id SERIAL PRIMARY KEY,
      authoId INT UNIQUE,
      authoProvider VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      name VARCHAR(255),
      role VARCHAR(50) DEFAULT 'guest',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  try{
    console.log('OAuth users table created successfully');
  } catch (error) {
    console.error('Error creating OAuth users table:', error);
  }
};

export const getOAuthUserByEmail = async (email: string): Promise<OAuthUser | null> => {
  const { rows } = await query('SELECT * FROM oauth_users WHERE email = $1', [email]);
  return rows[0] || null;
};

export const createOAuthUser = async (email: string, name: string, password: string, authoId: number,
  authoProvider: string, role: string): Promise<OAuthUser> => {
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const { rows } = await query(
 'INSERT INTO oauth_users (authoId, authoProvider, email, name, role, password)VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
 [authoId, authoProvider, email, name, role, password_hash]
  );
  return rows[0];
};

//by Admin
export const findAllusers = async(): Promise<OAuthUser[]> => {
    const { rows } = await query(
        `SELECT id, authoId,authoProvider,email,name,role,createdat 
        FROM oauth_users ORDER BY id ASC`
    );
    return rows;
};

//by Guest
export const findUserById = async(id: number): Promise<OAuthUser | null> => {
    const { rows } = await query(`SELECT * FROM oauth_users WHERE id= $1` ,[id]);
    return rows[0] || null;
};

//by Guest
export const updateUserById = async(id: number, appData:OAuthUser ): Promise<OAuthUser | null> => {
    const {email,name,password,role} = appData
    const { rows } = await query(`UPDATE oauth_users 
        SET email = COALESCE($1,email),
        name = COALESCE($2,name),
        password = COALESCE($3,password),
        role = COALESCE($4,role)
        WHERE id = $5
        RETURNING * `,
        [email ,name,password,password,id]
    );
    return rows[0] || null;
};

//by Admin
export const deleteUserById = async(id: number): Promise<OAuthUser | null> =>{
    const { rows } =await query(
        `DELETE FROM oauth_users WHERE id = $1 RETURNING *`,
        [id]
    );
    return rows [0] || null
};
     

