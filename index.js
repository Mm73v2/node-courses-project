import express from "express";
import coursesRouter from "./routes/courses.route.js";
import usersRouter from "./routes/users.route.js";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import httpStatusText from "./utils/httpStatusText.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const url = process.env.DATA_BASE_URL;
mongoose.connect(url).then(() => console.log("mongodb conected"));

// Recreate the __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url); // Get the current file's URL and convert it to a path
const __dirname = path.dirname(__filename); // Get the directory name from the file path
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);

app.all("*", (req, res) =>
  res.json({
    status: httpStatusText.ERROR,
    message: "Route not found.",
  })
);

app.use(cors());

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(process.env.PORT, () => {
  console.log("port is 5000");
});
