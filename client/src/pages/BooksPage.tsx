import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../api";
import { useAuth } from "../context/authContext";
import type { Book } from "../types";
import Alert from "../components/Alert";

function BooksPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchInput, setSearchInput] = useState(""); // what's typed in the box
  const [searchTerm, setSearchTerm] = useState(""); // what was actually searched
  const [reloadKey, setReloadKey] = useState(0); // bump this number to reload the list
  const [busyId, setBusyId] = useState(""); // which book is being borrowed/deleted

  // Load the books on page open, and again whenever searchTerm or reloadKey changes
  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/books", {
          params: { search: searchTerm },
        });
        setBooks(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, [searchTerm, reloadKey]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setSuccess("");
    setSearchTerm(searchInput.trim());
  }

  function handleClear() {
    setSearchInput("");
    setSearchTerm("");
  }

  async function handleBorrow(bookId: string) {
    setError("");
    setSuccess("");
    setBusyId(bookId);
    try {
      await api.post("/borrow/" + bookId);
      setSuccess("Book borrowed! See 'My Books' for the due date.");
      setReloadKey(reloadKey + 1); // reload so the available count updates
    } catch (err) {
      setError(getErrorMessage(err)); // e.g. "You have already borrowed this book"
    } finally {
      setBusyId("");
    }
  }

  async function handleDelete(book: Book) {
    // Ask first. Deleting can't be undone.
    const confirmed = window.confirm(
      'Delete "' + book.title + '"? This cannot be undone.',
    );
    if (!confirmed) return;

    setError("");
    setSuccess("");
    setBusyId(book._id);
    try {
      await api.delete("/books/" + book._id);
      setSuccess('Deleted "' + book.title + '".');
      setReloadKey(reloadKey + 1);
    } catch (err) {
      setError(getErrorMessage(err)); // e.g. "Can't delete: this book is currently borrowed"
    } finally {
      setBusyId("");
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Books</h1>

      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title or author"
          className="min-w-0 flex-1 rounded border border-gray-300 p-2"
        />
        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Search
        </button>
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
          >
            Clear
          </button>
        )}
      </form>

      <Alert message={error} type="error" />
      <Alert message={success} type="success" />

      {loading && books.length === 0 && <p>Loading books...</p>}
      {!loading && books.length === 0 && !error && <p>No books found.</p>}

      {books.length > 0 && (
        // overflow-x-auto: if the table is too wide for a phone, it scrolls sideways inside this box
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-3">Title</th>
                <th className="hidden p-3 sm:table-cell">Author</th>
                <th className="hidden p-3 md:table-cell">Category</th>
                <th className="p-3">Available</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">{book.title}</div>
                    {/* On phones the Author column is hidden, so show it under the title */}
                    <div className="text-sm text-gray-500 sm:hidden">
                      {book.author}
                    </div>
                  </td>
                  <td className="hidden p-3 sm:table-cell">{book.author}</td>
                  <td className="hidden p-3 md:table-cell">{book.category}</td>
                  <td className="p-3">
                    {book.availableCopies} / {book.totalCopies}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleBorrow(book._id)}
                        disabled={
                          book.availableCopies === 0 || busyId === book._id
                        }
                        className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                      >
                        {book.availableCopies === 0 ? "Unavailable" : "Borrow"}
                      </button>

                      {/* Admin-only buttons */}
                      {isAdmin && (
                        <>
                          <Link
                            to={"/admin/books/" + book._id + "/edit"}
                            className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(book)}
                            disabled={busyId === book._id}
                            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:bg-gray-400"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BooksPage;
