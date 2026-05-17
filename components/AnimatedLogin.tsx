"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AnimatedLogin() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setShowLogin(true), 2500);
    return () => clearTimeout(timer);
  }, []);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login gagal");
      setIsLoading(false);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    router.push("/dashboard");
    router.refresh();
  } catch {
    setError("Terjadi kesalahan. Silakan coba lagi.");
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#C5D5A8] to-[#8B9A6D]">
      <AnimatePresence mode="wait">
        {!showLogin ? (
          // ============================================
          // SPLASH SCREEN - LOGO & TULISAN BESAR
          // ============================================
          <motion.div
            key="splash"
            className="flex min-h-screen flex-col items-center justify-center"
            exit={{ opacity: 0, scale: 0.8, y: -50, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* LOGO BESAR - 180px */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, rotate: -10 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
              }}
              transition={{ 
                duration: 1, 
                ease: [0.34, 1.56, 0.64, 1], // Spring effect
                delay: 0.2 
              }}
            >
              <Image
                src="/images/logo.png"
                alt="Bimbingan Konseling 12"
                width={180}
                height={180}
                className="drop-shadow-2xl"
                priority
              />
            </motion.div>

            {/* TULISAN BESAR */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="mt-8 text-center"
            >
              <motion.h1 
                className="text-4xl font-bold tracking-[0.2em] text-[#1B4D3E] md:text-5xl"
                animate={{ 
                  textShadow: [
                    "0 0 0px rgba(27,77,62,0)",
                    "0 0 20px rgba(27,77,62,0.3)",
                    "0 0 0px rgba(27,77,62,0)"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 2, delay: 1 }}
              >
                BIMBINGAN
              </motion.h1>
              <motion.h2 
                className="mt-2 text-3xl font-bold tracking-[0.25em] text-[#1B4D3E] md:text-4xl"
              >
                KONSELING 12
              </motion.h2>
            </motion.div>

            {/* SUBTITLE (opsional) */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1.2 }}
              className="mt-4 text-sm tracking-widest text-[#1B4D3E]"
            >
              SMKN 12 JAKARTA 
            </motion.p>

            {/* LOADING INDICATOR */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-16 flex flex-col items-center gap-3"
            >
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.2,
                      delay: i * 0.2
                    }}
                    className="h-3 w-3 rounded-full bg-[#1B4D3E]"
                  />
                ))}
              </div>
              <motion.p 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-xs tracking-wider text-[#1B4D3E]"
              >
                MEMUAT...
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          // ============================================
          // LOGIN PAGE - LOGO & TULISAN MASIH BESAR
          // ============================================
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex min-h-screen flex-col"
          >
            {/* HEADER - LOGO & TULISAN BESAR */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex flex-1 flex-col items-center justify-center px-6 pt-8"
            >
              {/* LOGO - 100px (masih terlihat jelas) */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  damping: 20,
                  stiffness: 100,
                  delay: 0.2 
                }}
              >
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={100}
                  height={100}
                  priority
                />
              </motion.div>

              {/* TULISAN - TETAP BESAR & BOLD */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-6 text-center"
              >
                <h1 className="text-2xl font-bold tracking-[0.15em] text-[#1B4D3E] md:text-3xl">
                  BIMBINGAN
                </h1>
                <h2 className="mt-1 text-xl font-bold tracking-[0.2em] text-[#1B4D3E] md:text-2xl">
                  KONSELING 12
                </h2>
              </motion.div>

              {/* GARIS DEKORATIF */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-4 h-1 w-24 rounded-full bg-[#1B4D3E] opacity-50"
              />
            </motion.div>

            {/* FORM LOGIN CARD */}
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.3,
              }}
              className="rounded-t-[35px] bg-white px-8 pb-12 pt-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* INPUT USERNAME */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <div className="relative group">
                    <svg
                      className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#1B4D3E]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl bg-gray-100 py-4 pl-14 pr-4 text-lg text-gray-700 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#C5D5A8]"
                      required
                    />
                  </div>
                </motion.div>

                {/* INPUT PASSWORD */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  <div className="relative group">
                    <svg
                      className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#1B4D3E]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl bg-gray-100 py-4 pl-14 pr-4 text-lg text-gray-700 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#C5D5A8]"
                      required
                    />
                  </div>
                </motion.div>

                {/* ERROR MESSAGE */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    className="text-center text-sm font-medium text-red-500"
                  >
                    {error}
                  </motion.p>
                )}

                {/* BUTTON LOGIN */}
                <motion.button
                  type="submit"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.03, translateY: -2 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isLoading}
                  className="w-full rounded-2xl bg-[#C5D5A8] py-4 text-lg font-bold tracking-wide text-white shadow-lg transition-colors hover:bg-[#B5C598] disabled:opacity-70"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="mx-auto h-6 w-6 rounded-full border-3 border-white border-t-transparent"
                    />
                  ) : (
                    "LOG IN"
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}