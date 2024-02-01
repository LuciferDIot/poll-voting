"use server";
import {User} from "../models/userModel";
import bcrypt from "bcrypt";
import { connectToDataBase } from "../database";

export async function signup({ formData }: { formData: FormData }) {
    try {
        console.log("started");

        await connectToDataBase();

        const username = formData.get("username")?.toString();
        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();

        console.log(username, email, password);

        if (!username || !email || !password) {
            return {
                success: false,
                message: "All fields are required!",
                user: null,
            };
        }

        const existingUserName = await User.findOne({ username }).exec();
        const existingEmail = await User.findOne({ email }).exec();

        if (existingUserName) {
            return {
                success: false,
                message: "UserName already exists",
                user: null,
            }
        } 
        else if (existingEmail) {
            return {
                success: false,
                message: "Email already exists",
                user: null,
            }
        } 
        else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
            });

            const userResponse = {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            };

            return {
                success: true,
                message: "User saved successfully",
                user: userResponse,
            };
        }
    } catch (error) {
        console.error("Error during signup:", error);

        return {
            success: false,
            message: "An unexpected error occurred",
            user: null,
        };
    }
}

export const login = async ({ formData }: { formData: FormData }) => {
    try {
        await connectToDataBase();
        const username = formData.get("username")?.toString();
        const password = formData.get("password")?.toString();

        if (!username || !password) {
            return {
                success: false,
                message: "Username and password are required fields",
                user: null
            };
        }

        const user: {
            _id: number
            username: string;
            email: string;
            password: string;
        } | null = await User.findOne({ username });

        if (!user) {
            return {
                success: false,
                message: "User not found",
                user: null
            };
        }

        const passwordMatch = bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return {
                success: false,
                message: "Invalid password",
                user: null
            };
        }

        // Password is correct, generate JWT token or set session here

        return {
            success: true,
            message: "Login successful",
            user: user
        };
    } catch (error) {
        console.error("Error in login:", error);
        return {
            success: false,
            message: "Server error",
            user: null
        };
    }
};


export async function getUserById(userId: number) {
    try {
        await connectToDataBase();

        const user = await User.findOne({ _id: userId });

        if (!user) {
            return {
                success: false,
                message: "user not found",
            };
        }

        return {
            success: true,
            message: "Found",
            category_id: user._id,
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
                category_id: null,
            };
        } else {
            return {
                success: false,
                message: "An unexpected error occurred",
                category_id: null,
            };
        }
    }
}
