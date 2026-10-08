import "dotenv/config"; // loads the .env file into process.env
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import bookRoutes from "./routes/bookRoutes";
import borrowRoutes from "./routes/borrowRoutes";
import connectDB from "./config/db";

const app = express();

// CORS: only allow our React app's address to call this API
app.use(cors({ origin: process.env.CLIENT_URL }));

// Lets us read JSON sent in request bodies as req.body
app.use(express.json());

// A simple route to check the server is alive
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

export default app;
