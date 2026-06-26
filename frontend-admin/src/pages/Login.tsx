import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../store/authStore";

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F] px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-lg mb-4">
            V
          </div>
          <h1 className="text-white text-lg font-semibold">Vibrer Admin</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to manage your store</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-7 rounded-2xl shadow-xl"
        >
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="you@vibrer.co.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2.5 pl-9 text-sm outline-none focus:border-black transition-colors"
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2.5 pl-9 text-sm outline-none focus:border-black transition-colors"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm mb-4 bg-red-50 rounded-lg p-2.5">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white p-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};
