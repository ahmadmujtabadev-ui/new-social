import React, { useState } from "react";
import { useRouter } from "next/router";
import { Lock, Mail, ArrowLeft } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { loginAsync } from "@/services/admin/asyncThunk";
import { setAuthFromStorage } from "@/redux/slices/adminSlice";

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.admin);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await dispatch(loginAsync(formData)).unwrap();

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
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl items-center justify-center mb-6 shadow-2xl shadow-yellow-500/50 transform hover:scale-105 transition-transform">
            <Lock className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 mb-3">
            Admin Dashboard
          </h1>
          <p className="text-yellow-500/70 text-lg">Social Connections Events</p>
        </div>

        <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl border border-yellow-500/20 p-8 backdrop-blur-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-yellow-400 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50 w-5 h-5 group-focus-within:text-yellow-400 transition-colors" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-3.5 bg-black border-2 border-yellow-500/30 rounded-xl text-yellow-100 placeholder-yellow-500/30 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-yellow-400 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50 w-5 h-5 group-focus-within:text-yellow-400 transition-colors" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full pl-12 pr-4 py-3.5 bg-black border-2 border-yellow-500/30 rounded-xl text-yellow-100 placeholder-yellow-500/30 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !formData.email || !formData.password}
              className="w-full py-4 px-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold text-lg rounded-xl hover:from-yellow-500 hover:to-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none active:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login to Dashboard"
              )}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-yellow-500/50 flex items-center justify-center gap-2">
              <Lock className="w-3 h-3" />
              Protected area - Authorized personnel only
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-yellow-500/70 hover:text-yellow-400 transition-colors flex items-center justify-center gap-2 mx-auto group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;