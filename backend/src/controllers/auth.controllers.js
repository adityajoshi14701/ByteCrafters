import bcrypt from "bcrypt";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
/**
 * Handles user registration.
 *
 * This function receives user registration data from the request body,
 * including name, email, and password, and checks if a user with the
 * provided email already exists in the database. If not, it proceeds
 * to create a new user.
 *
 * @param {object} req - The request object containing user registration data.
 * @param {object} res - The response object to send back the response.
 */

const registerUser = async (req, res) => {
  //add image functionality later on
  const { name, email, password } = req.body;
  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });

    const token = jwt.sign(
      {
        id: newUser.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      messge: "USer created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        //implement image functionality later on
        // image: newUser.image,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {};

const logoutUser = async (req, res) => {};

const checkUser = async (req, res) => {};

export { registerUser, loginUser, logoutUser, checkUser };
