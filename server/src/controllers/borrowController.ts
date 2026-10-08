import { Response } from "express";
import mongoose from "mongoose";
import Book from "../models/Book";
import BorrowRecord from "../models/BorrowRecord";
import { AuthRequest } from "../middleware/authMiddleware";

const LOAN_DAYS = 14;

// POST /api/borrow/:bookId   (logged-in user)
export async function borrowBook(req: AuthRequest, res: Response) {
  try {
    const bookId = req.params.bookId;
    const userId = req.user?.id; // set earlier by the protect middleware

    if (!userId) {
      return res.status(401).json({ message: "Not logged in" });
    }
    if (!mongoose.isValidObjectId(bookId)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    // Does the book exist?
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Block double borrowing
    const alreadyBorrowed = await BorrowRecord.findOne({
      user: userId,
      book: bookId,
      returnDate: null,
    });
    if (alreadyBorrowed) {
      return res
        .status(400)
        .json({ message: "You have already borrowed this book" });
    }

    // Take one copy off the shelf, if one is available
    const updatedBook = await Book.findOneAndUpdate(
      { _id: bookId, availableCopies: { $gt: 0 } },
      { $inc: { availableCopies: -1 } },
      { new: true },
    );
    if (!updatedBook) {
      return res.status(400).json({ message: "No copies available right now" });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + LOAN_DAYS);

    try {
      const record = await BorrowRecord.create({
        user: userId,
        book: bookId,
        dueDate: dueDate,
      });
      res.status(201).json(record);
    } catch (createError) {
      // If saving the record failed, put the copy back so it isn't lost
      await Book.findByIdAndUpdate(bookId, { $inc: { availableCopies: 1 } });
      throw createError;
    }
  } catch (error) {
    console.error("Borrow error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// PUT /api/borrow/:recordId/return  returning borrowed books.
export async function returnBook(req: AuthRequest, res: Response) {
  try {
    const recordId = req.params.recordId;

    if (!mongoose.isValidObjectId(recordId)) {
      return res.status(400).json({ message: "Invalid record id" });
    }

    const record = await BorrowRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    // Users can only return their own books
    if (record.user.toString() !== req.user?.id) {
      return res
        .status(403)
        .json({ message: "You can only return your own books" });
    }

    // Mark returned ONLY if it isn't already returned
    const updatedRecord = await BorrowRecord.findOneAndUpdate(
      { _id: recordId, returnDate: null },
      { returnDate: new Date() },
      { new: true },
    );
    if (!updatedRecord) {
      return res
        .status(400)
        .json({ message: "This book was already returned" });
    }

    // Put the copy back on the shelf
    await Book.findByIdAndUpdate(record.book, { $inc: { availableCopies: 1 } });

    res.json(updatedRecord);
  } catch (error) {
    console.error("Return error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/borrow/my  record of borrowed books for the logged-in user
export async function getMyBorrows(req: AuthRequest, res: Response) {
  try {
    const records = await BorrowRecord.find({ user: req.user?.id })
      .populate("book", "title author")
      .sort({ borrowDate: -1 });

    res.json(records);
  } catch (error) {
    console.error("My borrows error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/borrow  admin can see everyone records.
export async function getAllBorrows(req: AuthRequest, res: Response) {
  try {
    const records = await BorrowRecord.find()
      .populate("user", "name email")
      .populate("book", "title author")
      .sort({ borrowDate: -1 });

    res.json(records);
  } catch (error) {
    console.error("All borrows error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
