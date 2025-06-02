import express from "express"
import authRoutes from "./auth.routes";
import { getAllSubmission, getAllTheSubmissionsForProblem, getSubmissionForProblem } from "../controllers/submission.controller";
import verifyUser from "../middleware/auth.middleware";

const submissionRoutes = express.Router()

submissionRoutes.get("/get-all-submissions",verifyUser,getAllSubmission);
submissionRoutes.get("/get-submission/:problemId",verifyUser,getSubmissionForProblem);
submissionRoutes.get("get-submissions-count/:problemId",verifyUser,getAllTheSubmissionsForProblem);


export default submissionRoutes;