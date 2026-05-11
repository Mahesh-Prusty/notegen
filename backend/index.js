import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import subjectRoute from "./routes/subject.routes.js";
import topicRoute from "./routes/topic.routes.js";
import noteRoute from "./routes/note.routes.js";
import authRoute from "./routes/auth.routes.js";
import filterRoute from "./routes/filter.routes.js";

dotenv.config();

const app = express();
const port = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(express.json());
// FIX: CORS locked to client origin — was fully open
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Routes
app.use("/api/subjects", subjectRoute);
app.use("/api/topics", topicRoute);
app.use("/api/notes", noteRoute);
app.use("/api/auth", authRoute);
app.use("/api", filterRoute);

// Health check
app.get("/", (req, res) => {
  res.send("API is running");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();