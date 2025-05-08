import express from "express";
import verifyUser, { verifyAdmin } from "../middleware/auth.middleware.js";
import {
  createProblem,
  deleteProblemById,
  updateProblemById,
  getAllProblems,
  getProblemById,
  getAllProblemsSolvedByUser,
} from "../controllers/problem.controller.js";

const problemRoutes = express.Router();

problemRoutes.post("/create-problem", verifyUser, verifyAdmin, createProblem);
problemRoutes.get("/get-all-problems", verifyUser, getAllProblems);
problemRoutes.get("/get-problem/:id", verifyUser, getProblemById);
problemRoutes.put(
  "/update-problem/:id",
  verifyUser,
  verifyAdmin,
  updateProblemById
);
problemRoutes.delete(
  "/delete-problem/:id",
  verifyUser,
  verifyAdmin,
  deleteProblemById
);
//problemRoutes.get('/get-problems-by-category/:category', verifyUser, getProblemsByCategory);
//problemRoutes.get('/get-problems-by-status/:status', verifyUser, getProblemsByStatus);
//problemRoutes.get('/get-problems-by-difficulty/:difficulty', verifyUser, getProblemsByDifficulty);
problemRoutes.get(
  "/get-solved-problems",
  verifyUser,
  getAllProblemsSolvedByUser
);
export default problemRoutes;
