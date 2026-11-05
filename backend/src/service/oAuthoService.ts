
import { query } from '../config/database';
import bcrypt from 'bcryptjs';
import { OAuthUser } from '../Types/oAutho.types';

// Create OAuth users table
export const createOAuthUserTable = async (): Promise<void> => {
  await query(`
    CREATE TABLE IF NOT EXISTS oauth_users (
      id SERIAL PRIMARY KEY,
      authoId VARCHAR(255) UNIQUE,
      authoProvider VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      name VARCHAR(255),
      role VARCHAR(50) DEFAULT 'guest',
      phone INT UNIQUE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('OAuth users table created successfully');
};

// Find user by email
export const getOAuthUserByEmail = async (
  email: string
): Promise<OAuthUser | null> => {
  const { rows } = await query(
    'SELECT * FROM oauth_users WHERE email = $1',
    [email]
  );

  return rows[0] || null;
};

// Create normal email/password user
export const createOAuthUser = async (
  email: string,
  name: string,
  password: string,
  phone: number
): Promise<OAuthUser> => {
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const { rows } = await query(
    `INSERT INTO oauth_users (email, name, phone, password)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [email, name, phone, password_hash]
  );

  return rows[0];
};

// Find user by Google ID
export const findGoogleUser = async (
  googleId: string
): Promise<OAuthUser | null> => {
  const { rows } = await query(
    `SELECT
      id,
      authoid AS "authoId",
      authoprovider AS "authoProvider",
      email,
      password,
      name,
      role,
      phone,
      createdat AS "createdAt"
     FROM oauth_users
     WHERE authoid = $1`,
    [googleId]
  );

  return rows[0] || null;
};

// Create a new Google user
export const createGoogleUser = async (
  googleId: string,
  email: string,
  name: string
): Promise<OAuthUser> => {
  const { rows } = await query(
    `INSERT INTO oauth_users (
      authoid,
      authoprovider,
      email,
      name,
      role,
      password,
      phone
    )
    VALUES ($1, 'google', $2, $3, 'guest', NULL, NULL)
    RETURNING
      id,
      authoid AS "authoId",
      authoprovider AS "authoProvider",
      email,
      password,
      name,
      role,
      phone,
      createdat AS "createdAt"`,
    [googleId, email, name]
  );

  return rows[0];
};

// Get all users (Admin)
export const findAllusers = async (): Promise<OAuthUser[]> => {
  const { rows } = await query(
    `SELECT
      id,
      authoid AS "authoId",
      authoprovider AS "authoProvider",
      email,
      name,
      role,
      createdat AS "createdAt"
     FROM oauth_users
     ORDER BY id ASC`
  );

  return rows;
};

// Find user by ID
export const findUserById = async (
  id: number
): Promise<OAuthUser | null> => {
  const { rows } = await query(
    'SELECT * FROM oauth_users WHERE id = $1',
    [id]
  );

  return rows[0] || null;
};

// Update user
export const updateUserById = async (
  id: number,
  appData: OAuthUser
): Promise<OAuthUser | null> => {
  const { email, name, password, role } = appData;

  const { rows } = await query(
    `UPDATE oauth_users
     SET email = COALESCE($1, email),
         name = COALESCE($2, name),
         password = COALESCE($3, password),
         role = COALESCE($4, role)
     WHERE id = $5
     RETURNING *`,
    [email, name, password, role, id]
  );

  return rows[0] || null;
};

// Delete user (Admin)
export const deleteUserById = async (
  id: number
): Promise<OAuthUser | null> => {
  const { rows } = await query(
    'DELETE FROM oauth_users WHERE id = $1 RETURNING *',
    [id]
  );

  return rows[0] || null;
};
