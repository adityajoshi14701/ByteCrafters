import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.route.js";
import executionRoutes from "./routes/execute-code.route.js";
import submissionRoutes from "./routes/submission.route.js";
import playlistRoutes from "./routes/playlist.routes.js";
const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Hello World!❤️❤️");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoutes);
app.use("/api/v1/submission",submissionRoutesnRoutes);
app.use("api/v1/playlist",playlistRoutes)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
