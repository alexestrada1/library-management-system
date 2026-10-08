// The logged-in user (matches what our login API returns)
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

// What /api/auth/login and /api/auth/register send back
export interface AuthResponse {
  token: string;
  user: User;
}

// MongoDB ids are called _id
export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn?: string;
  category?: string;
  totalCopies: number;
  availableCopies: number;
}

// A borrow record after the server swapped ids for real data (populate)
export interface BorrowRecord {
  _id: string;
  // null if the book was deleted after it was returned
  book: { _id: string; title: string; author: string } | null;
  // only filled in on the admin list, and we only read it there
  user?: { _id: string; name: string; email: string } | null;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
}
