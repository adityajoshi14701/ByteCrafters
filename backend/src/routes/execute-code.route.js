import express from "express";
import verifyUser from "../middleware/auth.middleware";
import { executeCode } from "../controllers/execute-code.controller";

const executionRoutes = express.Router();

executionRoutes.post("/", verifyUser, executeCode);

export default executionRoutes;
