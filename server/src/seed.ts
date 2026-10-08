import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "./config/db";
import User from "./models/User";
import Book from "./models/Book";
import BorrowRecord from "./models/BorrowRecord";

// Demo admin login (change the password if you ever put this online)
const ADMIN_EMAIL = "admin@library.com";
const ADMIN_PASSWORD = "admin123";

const sampleBooks = [
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    totalCopies: 3,
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt and David Thomas",
    category: "Programming",
    totalCopies: 2,
  },
  {
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    category: "Programming",
    totalCopies: 4,
  },
  {
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    totalCopies: 1,
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    totalCopies: 3,
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    totalCopies: 2,
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    category: "Science Fiction",
    totalCopies: 2,
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    totalCopies: 5,
  },
];

async function seed() {
  try {
    await connectDB();

    // Create the admin if it doesn't exist yet
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("Admin already exists, skipping");
    } else {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await User.create({
        name: "Admin",
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin created: " + ADMIN_EMAIL + " / " + ADMIN_PASSWORD);
    }

    // Reset books and borrow records so the demo always starts clean
    await BorrowRecord.deleteMany({});
    await Book.deleteMany({});

    // Every sample book starts with all copies available
    const booksToInsert = sampleBooks.map((book) => ({
      ...book,
      availableCopies: book.totalCopies,
    }));
    await Book.insertMany(booksToInsert);
    console.log("Added " + booksToInsert.length + " sample books");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await mongoose.disconnect(); // close the connection so the script can exit
  }
}

seed();
