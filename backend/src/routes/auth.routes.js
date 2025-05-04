import express from "express";
import {
  checkUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controllers";
const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/logout", logoutUser);
authRoutes.get("/check", checkUser);

export default authRoutes;
