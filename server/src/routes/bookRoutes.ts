import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController";

const router = express.Router();

// Every book route requires a valid login
router.use(protect);

// Any logged-in user can view
router.get("/", getBooks);
router.get("/:id", getBookById);

// Only admins can change the catalog
router.post("/", adminOnly, createBook);
router.put("/:id", adminOnly, updateBook);
router.delete("/:id", adminOnly, deleteBook);

export default router;
