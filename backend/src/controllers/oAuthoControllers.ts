
import { Request, Response } from "express";
import * as oAuthoService from "../service/oAuthoService";
import * as profileService from "../service/profileService";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

// Google OAuth client
const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

// Register with email and password
export const register = async (req: Request, res: Response) => {
    const { email, name, password, phone } = req.body;

    if (!email || !name || !password || !phone) {
        return res.status(400).json({
            message: "Missing required fields"
        });
    }

    try {
        const existingUser = await oAuthoService.getOAuthUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        // Create the user
        const user = await oAuthoService.createOAuthUser(
            email,
            name,
            password,
            phone
        );

        // Create the user's profile
        const profile = await profileService.createProfile({
            user_id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            phone: String(user.phone),
            profile_picture: "",
            address: ""
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            profile: {
                id: profile.id,
                user_id: profile.user_id,
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
                profile_picture: profile.profile_picture,
                address: profile.address
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Error registering user"
        });
    }
};

// Login with email and password
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    try {
        const user = await oAuthoService.getOAuthUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                message: "Invalid email"
            });
        }

        // Prevent Google-only accounts from using password login
        if (!user.password) {
            return res.status(400).json({
                message: "This account uses Google login. Please sign in with Google."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET!,
            {
                expiresIn: "1h"
            }
        );

        console.log(`User ${email} logged in successfully`);

        return res.status(200).json({
            message: "Login Successful",
            token,
            user
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Error logging in"
        });
    }
};

// Login with Google
export const googleLogin = async (req: Request, res: Response) => {
    const { credential } = req.body;

    if (!credential) {
        return res.status(400).json({
            message: "Google credential is required"
        });
    }

    try {
        // Verify Google ID token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (
            !payload ||
            !payload.sub ||
            !payload.email ||
            payload.email_verified !== true
        ) {
            return res.status(401).json({
                message: "Invalid or unverified Google account"
            });
        }

        const googleId = payload.sub;
        const email = payload.email.toLowerCase();
        const name = payload.name || email;

        // Check if Google user already exists
        let user = await oAuthoService.findGoogleUser(googleId);

        if (!user) {
            // Check if email already belongs to another account
            const existingUser =
                await oAuthoService.getOAuthUserByEmail(email);

            if (existingUser) {
                return res.status(409).json({
                    message: "An account with this email already exists. Please use your existing login."
                });
            }

            // Create new Google user
            user = await oAuthoService.createGoogleUser(
                googleId,
                email,
                name
            );

            // Create Google user's profile
            await profileService.createProfile({
                user_id: user.id,
                name: user.name,
                email: user.email,
                password: null,
                phone: null,
                profile_picture: payload.picture || "",
                address: ""
            });
        }

        // Generate HavenStay JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            message: "Google login successful",
            token,
            user
        });

    } catch (error) {
        console.error("Google login error:", error);

        return res.status(500).json({
            message: "Google login failed"
        });
    }
};

// Get all users (Admin only)
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        if (req.user!.role !== "admin") {
            return res.status(403).json({
                message: "Only Admin can get all users"
            });
        }

        const users = await oAuthoService.findAllusers();

        return res.status(200).json(users);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Error retrieving users"
        });
    }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);

        const user = await oAuthoService.findUserById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Error retrieving user"
        });
    }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        if (req.user!.role !== "guest") {
            return res.status(403).json({
                message: "Only guests can update profiles"
            });
        }

        const id = parseInt(req.params.id as string);

        const updateUser = await oAuthoService.updateUserById(id, req.body);

        if (!updateUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json(updateUser);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error updating profile"
        });
    }
};

// Delete user (Admin only)
export const deleteUserProfile = async (req: Request, res: Response) => {
    try {
        if (req.user!.role !== "admin") {
            return res.status(403).json({
                message: "Only Admin can delete users"
            });
        }

        const id = parseInt(req.params.id as string);

        const deleteUser = await oAuthoService.deleteUserById(id);

        if (!deleteUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error deleting user"
        });
    }
};
