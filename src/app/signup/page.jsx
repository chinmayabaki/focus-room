"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/firebaseConfig";
import Link from "next/link";
import { motion } from "framer-motion"; // ✅ Smooth animations

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await registerUser(email, password);
      router.push("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-[#ff8c00] to-[#ff0080]">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Create Account</h1>
        <p className="text-gray-600 mb-6">Join us & boost your productivity!</p>

        {error && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg shadow-sm focus:ring-2 focus:ring-[#ff0080] focus:border-[#ff0080] outline-none transition-all"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg shadow-sm focus:ring-2 focus:ring-[#ff0080] focus:border-[#ff0080] outline-none transition-all"
              required
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            className="w-full py-3 text-lg font-semibold text-white bg-[#ff0080] rounded-xl shadow-md hover:bg-[#e60073] transition-all"
          >
            {isLoading ? "Registering..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="mt-6 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-[#ff0080] font-bold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
