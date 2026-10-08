import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import {
  borrowBook,
  returnBook,
  getMyBorrows,
  getAllBorrows,
} from "../controllers/borrowController";

const router = express.Router();

router.use(protect); // everything here needs a login

router.get("/my", getMyBorrows);
router.get("/", adminOnly, getAllBorrows);
router.post("/:bookId", borrowBook);
router.put("/:recordId/return", returnBook);

export default router;
