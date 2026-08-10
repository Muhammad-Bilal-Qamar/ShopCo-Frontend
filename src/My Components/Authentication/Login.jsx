import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/apiConfig.js";
import { saveAuthState } from "../../utils/auth.js";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
          "Invalid email or password.";
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
      setError(
        fetchError.message || "Unable to login. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-black/50">
            Welcome back
          </p>
          <h1 className="mt-4 text-3xl font-black text-black">
            Login to your account
          </h1>
        </div>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
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
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-black px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center justify-center">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-black/70">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-black hover:text-black/80"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
