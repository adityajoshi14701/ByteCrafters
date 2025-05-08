import express from "express";
import {
  checkUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controllers.js";
import verifyUser from "../middleware/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/logout", verifyUser, logoutUser);
authRoutes.get("/check", verifyUser, checkUser);

export default authRoutes;
