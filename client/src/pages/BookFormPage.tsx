import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { getErrorMessage } from "../api";
import type { Book } from "../types";
import Alert from "../components/Alert";

const inputClass = "mb-3 w-full rounded border border-gray-300 p-2";

// One form used for BOTH adding (/admin/books/new) and editing (/admin/books/:id/edit)
function BookFormPage() {
  const { id } = useParams(); // the :id from the URL (undefined when adding)
  const isEditing = id !== undefined;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");
  const [totalCopies, setTotalCopies] = useState("1"); // inputs always give strings
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEditing); // only load when editing
  const [saving, setSaving] = useState(false);

  // When editing, fetch the existing book and fill in the form
  useEffect(() => {
    if (!id) return;

    async function loadBook() {
      try {
        const response = await api.get(`/books/${id}`);
        const book: Book = response.data;
        setTitle(book.title);
        setAuthor(book.author);
        setIsbn(book.isbn || "");
        setCategory(book.category || "");
        setTotalCopies(String(book.totalCopies));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    // Form validation
    if (!title.trim() || !author.trim()) {
      setError("Title and author are required");
      return;
    }
    const copies = Number(totalCopies);
    if (!Number.isInteger(copies) || copies < 1) {
      setError("Total copies must be a whole number of at least 1");
      return;
    }

    const bookData = {
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      category: category.trim(),
      totalCopies: copies,
    };

    setSaving(true);
    try {
      if (isEditing) {
        await api.put(`/books/${id}`, bookData); // update
      } else {
        await api.post("/books", bookData); // create
      }
      navigate("/"); // back to the book list
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading book...</p>;
  }

  return (
    <div className="mx-auto max-w-lg rounded bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold">
        {isEditing ? "Edit book" : "Add a book"}
      </h1>
      <Alert message={error} type="error" />

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />

        <label htmlFor="author" className="mb-1 block text-sm font-medium">
          Author *
        </label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className={inputClass}
        />

        <label htmlFor="isbn" className="mb-1 block text-sm font-medium">
          ISBN
        </label>
        <input
          id="isbn"
          type="text"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className={inputClass}
        />

        <label htmlFor="category" className="mb-1 block text-sm font-medium">
          Category
        </label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        />

        <label htmlFor="copies" className="mb-1 block text-sm font-medium">
          Total copies *
        </label>
        <input
          id="copies"
          type="number"
          min="1"
          value={totalCopies}
          onChange={(e) => setTotalCopies(e.target.value)}
          className="mb-5 w-full rounded border border-gray-300 p-2"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {saving ? "Saving..." : isEditing ? "Save changes" : "Add book"}
          </button>
          <Link
            to="/"
            className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default BookFormPage;
