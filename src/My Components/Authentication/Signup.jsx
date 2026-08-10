import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/apiConfig.js";
import { saveAuthState } from "../../utils/auth.js";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 4 || password.length > 100) {
      setError("Password must be between 6 and 100 characters.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const text = await response.text();
      let data = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = { message: text };
      }

      if (!response.ok) {
        const message =
          data?.message ||
          text ||
          response.statusText ||
          "Unable to create your account.";
        throw new Error(`(${response.status}) ${message}`);
      }

      const user = data?.user || data;
      const token =
        data?.token ||
        data?.accessToken ||
        data?.jwt ||
        data?.jwtToken ||
        data?.tokenString;

      saveAuthState({ user, token });
      navigate("/");
    } catch (fetchError) {
      const message =
        fetchError?.message || "Unable to signup. Please try again later.";
      setError(message.replace(/\(\d{3}\)\s*/, ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-4xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-black/50">
            Create account
          </p>
          <h1 className="mt-4 text-3xl font-black text-black">
            Signup for free
          </h1>
        </div>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-black/80">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-gray-200 bg-[#F8F8F8] px-4 py-3 text-sm text-black outline-none transition focus:border-black"
              placeholder="Your name"
            />
          </label>

          <label className="block text-sm font-medium text-black/80">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-gray-200 bg-[#F8F8F8] px-4 py-3 text-sm text-black outline-none transition focus:border-black"
              placeholder="your@email.com"
            />
          </label>

          <label className="block text-sm font-medium text-black/80">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-gray-200 bg-[#F8F8F8] px-4 py-3 text-sm text-black outline-none transition focus:border-black"
              placeholder="••••••••"
            />
          </label>

          <label className="block text-sm font-medium text-black/80">
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-gray-200 bg-[#F8F8F8] px-4 py-3 text-sm text-black outline-none transition focus:border-black"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-black px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/50"
          >
            {loading ? "Creating account..." : "Signup"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-black/70">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-black hover:text-black/80"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
