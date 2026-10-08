import { Request, Response } from "express";
import mongoose from "mongoose";
import Book from "../models/Book";
import BorrowRecord from "../models/BorrowRecord";

// GET /api/books   (any logged-in user)
export async function getBooks(req: Request, res: Response) {
  try {
    const search = req.query.search;
    let filter = {};

    if (typeof search === "string" && search.trim() !== "") {
      // Escape special regex characters so users can't send weird patterns
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter = {
        $or: [
          { title: { $regex: escaped, $options: "i" } },
          { author: { $regex: escaped, $options: "i" } },
        ],
      };
    }

    const books = await Book.find(filter).sort({ title: 1 });
    res.json(books);
  } catch (error) {
    console.error("Get books error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/books/:id   (any logged-in user)
export async function getBookById(req: Request, res: Response) {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Get book error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/books   (admin only)
export async function createBook(req: Request, res: Response) {
  try {
    const { title, author, isbn, category, totalCopies } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Title and author are required" });
    }
    const copies = Number(totalCopies);
    if (!Number.isInteger(copies) || copies < 1) {
      return res
        .status(400)
        .json({ message: "Total copies must be a whole number of at least 1" });
    }

    const book = await Book.create({
      title: title,
      author: author,
      isbn: isbn,
      category: category,
      totalCopies: copies,
      availableCopies: copies,
    });

    res.status(201).json(book);
  } catch (error) {
    console.error("Create book error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// PUT /api/books/:id   (admin only)
export async function updateBook(req: Request, res: Response) {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const { title, author, isbn, category, totalCopies } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Title and author are required" });
    }
    const copies = Number(totalCopies);
    if (!Number.isInteger(copies) || copies < 1) {
      return res
        .status(400)
        .json({ message: "Total copies must be a whole number of at least 1" });
    }

    const borrowedCount = book.totalCopies - book.availableCopies;

    // Can't shrink the total below the number of copies people are holding
    if (copies < borrowedCount) {
      return res.status(400).json({
        message:
          "Total copies can't be less than the " +
          borrowedCount +
          " copies currently borrowed",
      });
    }

    book.title = title;
    book.author = author;
    book.isbn = isbn;
    book.category = category;
    book.totalCopies = copies;
    book.availableCopies = copies - borrowedCount;

    await book.save();
    res.json(book);
  } catch (error) {
    console.error("Update book error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/books/:id   (admin only)
export async function deleteBook(req: Request, res: Response) {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    // Don't delete a book while someone still has it
    const activeLoans = await BorrowRecord.countDocuments({
      book: id,
      returnDate: null,
    });
    if (activeLoans > 0) {
      return res
        .status(400)
        .json({ message: "Can't delete: this book is currently borrowed" });
    }

    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted" });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
