import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import api, { getErrorMessage } from "../api";
import { useAuth } from "../context/authContext";
import type { AuthResponse } from "../types";
import Alert from "../components/Alert";

function LoginPage() {
  // Each input is "controlled": React state holds its current value
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();

  // Already logged in? Go to the home page instead of showing the form
  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); // stop the browser from reloading the page
    setError("");

    // Basic form validation
    if (!email.trim() || !password) {
      setError("Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password: password,
      });
      const data: AuthResponse = response.data;
      login(data.token, data.user); // saves the token, and the redirect above kicks in
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false); // runs whether it worked or failed
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-sm rounded bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold">Log in</h1>
      <Alert message={error} type="error" />

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded border border-gray-300 p-2"
        />

        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded border border-gray-300 p-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-indigo-600 py-2 text-white hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        No account?{" "}
        <Link to="/register" className="text-indigo-600 underline">
          Register
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
