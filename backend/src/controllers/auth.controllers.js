import bcrypt from "bcryptjs";
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

/**
 * Handles user login.
 *
 * This function receives user login data from the request body,
 * including email and password, and attempts to authenticate the user.
 * It checks if a user with the provided email exists in the database.
 * If the user is found, it verifies the password. Upon successful
 * authentication, it generates a JWT token and sets it as an HTTP-only
 * cookie in the response. If the user is not found or the password is
 * incorrect, it responds with an appropriate error message.
 *
 * @param {object} req - The request object containing user login data.
 * @param {object} res - The response object to send back the response.
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ error: "User Not Found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        id: user.id,
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
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        // image: user.image, // implement image functionality later on
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Handles user logout.
 *
 * This function clears the JWT cookie set by the loginUser function and
 * responds with a success message. If there is an error clearing the cookie,
 * it responds with an appropriate error message.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object to send back the response.
 */
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Checks if a user is authenticated.
 *
 * This function verifies the JWT cookie sent by the client and responds
 * with a success message if the user is authenticated. If there is an
 * error verifying the JWT, it responds with an appropriate error message.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object to send back the response.
 */
const checkUser = async (req, res) => {
  const token = req.cookies.jwt;
  try {
    res.status(200).json({
      message: "User is authenticated",
      user: req.user,
    });
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { registerUser, loginUser, logoutUser, checkUser };
