import express from "express";
import verifyUser from "../middleware/auth.middleware.js";
import { executeCode } from "../controllers/execute-code.controller.js";

const executionRoutes = express.Router();

executionRoutes.post("/", verifyUser, executeCode);

export default executionRoutes;
