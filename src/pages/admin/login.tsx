import React, { useState } from "react";
import { useRouter } from "next/router";
import { Lock, Mail } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { loginAsync } from "@/services/admin/asyncThunk";
import {  setAuthFromStorage } from "@/redux/slices/adminSlice";

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector((state) => state.admin);

  const [formData, setFormData] = useState({ email: "", password: "" });

// useEffect(() => {
//   // redirect only if token exists OR redux says authenticated
//   if (typeof window === "undefined") return;

//   const token = localStorage.getItem("access_token");
//   if (token || isAuthenticated) {
//     router.replace("/admin/admin"); // ✅ keep single dashboard route
//   }
// }, [isAuthenticated, router]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const result = await dispatch(loginAsync(formData)).unwrap();

    // ✅ IMPORTANT: persist token before redirect
    if (result?.accessToken) {
      console.log("Login successful, token:", result.accessToken);
      localStorage.setItem("access_token", result.accessToken);
      dispatch(setAuthFromStorage({ token: result.accessToken }));
      router.replace("/admin/admin");
    }
  } catch (err) {
    console.error("Login failed:", err);
  }
};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // if (error) dispatch(clearAuthError());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
            <Lock className="w-8 h-8 text-gray-900" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Social Connections Events</p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-8">
          {error && (
            <div className="mb-6 p-3 rounded-lg border border-red-700 bg-red-900/40 text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="w-full py-3 px-4 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {loading ? "Logging in..." : "Login to Dashboard"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Protected area - Authorized personnel only</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
