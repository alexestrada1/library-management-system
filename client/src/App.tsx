import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BooksPage from "./pages/BooksPage";
import AdminRoute from "./components/AdminRoute";
import BookFormPage from "./pages/BookFormPage";
import MyBooksPage from "./pages/MyBooksPage";
import AllBorrowsPage from "./pages/AllBorrowsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Navbar />
          <main className="mx-auto max-w-5xl p-4">
            <Routes>
              {/* Public pages */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Pages that need a login */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<BooksPage />} />

                <Route element={<AdminRoute />}>
                  <Route path="/admin/books/new" element={<BookFormPage />} />
                  <Route
                    path="/admin/books/:id/edit"
                    element={<BookFormPage />}
                  />
                </Route>
                <Route path="/my-books" element={<MyBooksPage />} />
                <Route path="/admin/borrows" element={<AllBorrowsPage />} />
              </Route>

              {/* Anything else goes home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
