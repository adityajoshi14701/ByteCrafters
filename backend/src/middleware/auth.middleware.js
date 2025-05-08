import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import e from "express";
/**
 * Verify if the user is authenticated.
 *
 * It verifies the JWT cookie sent by the client and
 * checks if a user with the provided id exists in the database.
 * If the user is found, it sets the user in the request object.
 * If the JWT is invalid or the user is not found, it responds with
 * a 401 status code and an Unauthorized message.
 *
 * @param {e.Request} req - The request object.
 * @param {e.Response} res - The response object.
 * @param {e.NextFunction} next - The next middleware.
 */
const verifyUser = async (req, res, next) => {
  const token = req.cookies.jwt;

  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  } catch (error) {}
};

export default verifyUser;
