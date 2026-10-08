import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";

const app = express();

// CORS: only allow our React app's address to call this API
app.use(cors({ origin: process.env.CLIENT_URL }));

// Use the authentication routes

// Lets us read JSON sent in request bodies as req.body
app.use(express.json());

// A simple route to check the server is alive
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});
app.use("/api/auth", authRoutes);

export default app;
