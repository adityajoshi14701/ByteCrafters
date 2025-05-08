import express from "express";
import verifyUser, { verifyAdmin } from "../middleware/auth.middleware.js";
import { createProblem } from "../controllers/problem.controller.js";

const problemRoutes = express.Router();

problemRoutes.post("/create-problem", verifyUser, verifyAdmin, createProblem);
problemRoutes.get('/get-all-problems', verifyUser, getAllProblems);
problemRoutes.get('/get-problem/:id', verifyUser, getProblemById);
problemRoutes.put('/update-problem/:id', verifyUser, verifyAdmin, updateProblemById);
export default problemRoutes;
