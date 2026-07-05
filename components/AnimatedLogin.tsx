"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

/* ─── Floating particle for background ─── */
function FloatingParticle({ delay, size, x, y, duration }: {
  delay: number; size: number; x: string; y: string; duration: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: "radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0.3, 0.7, 0],
        scale: [0.5, 1.2, 0.8, 1, 0.5],
        y: [0, -30, 10, -20, 0],
        x: [0, 15, -10, 5, 0],
      }}
      transition={{
        repeat: Infinity,
        duration,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

/* ─── Animated background with gradient mesh ─── */
function AnimatedBackground() {
  const particles = [
    { delay: 0, size: 120, x: "10%", y: "20%", duration: 8 },
    { delay: 1.5, size: 80, x: "70%", y: "10%", duration: 10 },
    { delay: 0.8, size: 60, x: "85%", y: "60%", duration: 7 },
    { delay: 2, size: 100, x: "20%", y: "70%", duration: 9 },
    { delay: 3, size: 50, x: "50%", y: "40%", duration: 11 },
    { delay: 1, size: 90, x: "40%", y: "85%", duration: 8.5 },
    { delay: 2.5, size: 70, x: "60%", y: "30%", duration: 9.5 },
    { delay: 0.5, size: 40, x: "30%", y: "50%", duration: 7.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0f2027 0%, #203a43 40%, #2c5364 100%)",
        }}
      />
      {/* Moving gradient orb 1 */}
      <motion.div
        className="absolute"
        style={{
          width: "60vmax",
          height: "60vmax",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(104,126,80,0.35) 0%, transparent 70%)",
          top: "-20%",
          left: "-15%",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, 30, -20, 0],
        }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      />
      {/* Moving gradient orb 2 */}
      <motion.div
        className="absolute"
        style={{
          width: "50vmax",
          height: "50vmax",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(101,163,153,0.3) 0%, transparent 70%)",
          bottom: "-25%",
          right: "-10%",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, -40, 20, 0],
          y: [0, -30, 40, 0],
        }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
      />
      {/* Moving gradient orb 3 - accent */}
      <motion.div
        className="absolute"
        style={{
          width: "35vmax",
          height: "35vmax",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(197,213,168,0.2) 0%, transparent 70%)",
          top: "40%",
          left: "30%",
          filter: "blur(50px)",
        }}
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
      />
      {/* Floating particles */}
      {particles.map((p, i) => (
        <FloatingParticle key={i} {...p} />
      ))}
      {/* Subtle noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

/* ─── Eye icon for show/hide password ─── */
function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function AnimatedLogin() {
  const [showLogin, setShowLogin] = useState(false);
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setShowLogin(true), 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nip, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login gagal");
        setIsLoading(false);
        return;
      }

      document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, [nip, password, router]);

  /* ─── Glassmorphism card style ─── */
  const glassStyle = {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
  };



  return (
    <div className="login-glass relative min-h-screen w-full overflow-hidden">
      <AnimatedBackground />

      <AnimatePresence mode="wait">
        {!showLogin ? (
          /* ═══════════════════════════════════════════
             SPLASH SCREEN
             ═══════════════════════════════════════════ */
          <motion.div
            key="splash"
            className="relative z-10 flex min-h-screen flex-col items-center justify-center"
            exit={{ opacity: 0, scale: 0.85, filter: "blur(16px)" }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Glow ring behind logo */}
            <motion.div
              className="absolute"
              style={{
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />

            {/* Logo with white circle background */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.34, 1.56, 0.64, 1],
                delay: 0.2,
              }}
              className="relative flex items-center justify-center"
            >
              {/* White circle backdrop */}
              <div
                className="absolute rounded-full"
                style={{
                  width: 200,
                  height: 200,
                  background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 70%, rgba(255,255,255,0.4) 100%)",
                  boxShadow: "0 0 60px rgba(255,255,255,0.3), 0 0 120px rgba(197,213,168,0.2)",
                }}
              />
              <Image
                src="/images/logo.png"
                alt="Bimbingan Konseling 12"
                width={220}
                height={220}
                className="relative drop-shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
                priority
              />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
              className="mt-8 text-center"
            >
              <motion.h1
                className="text-4xl font-bold tracking-[0.2em] text-white md:text-5xl"
                style={{ textShadow: "0 2px 20px rgba(197,213,168,0.3)" }}
              >
                BIMBINGAN
              </motion.h1>
              <motion.h2
                className="mt-2 text-3xl font-bold tracking-[0.25em] text-white/90 md:text-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                KONSELING 12
              </motion.h2>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 0.6, letterSpacing: "0.3em" }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-5 text-sm text-white/60"
            >
              SMKN 12 JAKARTA
            </motion.p>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="absolute bottom-20 flex flex-col items-center gap-4"
            >
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.4,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #C5D5A8, #8B9A6D)",
                      boxShadow: "0 0 8px rgba(197,213,168,0.4)",
                    }}
                  />
                ))}
              </div>
              <motion.p
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-xs tracking-[0.3em] text-white/40"
              >
                MEMUAT
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          /* ═══════════════════════════════════════════
             LOGIN FORM
             ═══════════════════════════════════════════ */
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8"
          >
            {/* Container for centering */}
            <div className="flex w-full max-w-sm flex-col items-center">
              {/* Logo + brand */}
              <motion.div
                initial={{ opacity: 0, y: -30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                className="mb-2 flex flex-col items-center"
              >
                {/* Logo with white circle background */}
                <div className="relative flex items-center justify-center">
                  {/* White circle backdrop */}
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: 110,
                      height: 110,
                      background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 70%, rgba(255,255,255,0.4) 100%)",
                      boxShadow: "0 0 40px rgba(255,255,255,0.2), 0 0 80px rgba(197,213,168,0.15)",
                    }}
                  />
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={120}
                    height={120}
                    className="relative drop-shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
                    priority
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-8 text-center"
              >
                <h1
                  className="text-2xl font-bold tracking-[0.12em] text-white"
                  style={{ textShadow: "0 2px 15px rgba(197,213,168,0.2)" }}
                >
                  BIMBINGAN KONSELING
                </h1>
                <p className="mt-1 text-sm tracking-[0.15em] text-white/50">
                  SMKN 12 JAKARTA
                </p>
              </motion.div>

              {/* Glass card */}
              <motion.div
                initial={{ y: 60, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 120,
                  delay: 0.3,
                }}
                className="w-full rounded-[24px] p-8"
                style={glassStyle}
              >
                {/* Card title */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6 text-center"
                >
                  <h2 className="text-xl font-semibold text-white/90">
                    Selamat Datang
                  </h2>
                  <p className="mt-1 text-sm text-white/40">
                    Silakan masuk ke akun Anda
                  </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* NIP Input */}
                  <motion.div
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.55, type: "spring", damping: 20 }}
                  >
                    <label className="mb-2 block text-xs font-medium tracking-wider text-white/50">
                      NIP
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors duration-300"
                        style={{ color: "rgba(255,255,255,0.3)" }}
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
                        placeholder="Masukkan NIP"
                        value={nip}
                        onChange={(e) => setNip(e.target.value)}
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Password Input */}
                  <motion.div
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.65, type: "spring", damping: 20 }}
                  >
                    <label className="mb-2 block text-xs font-medium tracking-wider text-white/50">
                      PASSWORD
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors duration-300"
                        style={{ color: "rgba(255,255,255,0.3)" }}
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
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors duration-200 hover:text-white/60"
                        tabIndex={-1}
                      >
                        <EyeIcon open={showPassword} />
                      </button>
                    </div>
                  </motion.div>

                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="rounded-xl px-4 py-3 text-center text-sm font-medium"
                          style={{
                            background: "rgba(239, 68, 68, 0.15)",
                            border: "1px solid rgba(239, 68, 68, 0.25)",
                            color: "#fca5a5",
                          }}
                        >
                          {error}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Login Button */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.75 }}
                  >
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={isLoading}
                      className="relative w-full overflow-hidden rounded-2xl py-4 text-base font-bold tracking-wider text-white transition-all disabled:opacity-60"
                      style={{
                        background: "linear-gradient(135deg, #687E50 0%, #8B9A6D 50%, #687E50 100%)",
                        backgroundSize: "200% 200%",
                        boxShadow: "0 4px 20px rgba(104, 126, 80, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                      }}
                    >
                      {/* Shimmer effect on button */}
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
                        }}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{
                          repeat: Infinity,
                          duration: 3,
                          ease: "easeInOut",
                          repeatDelay: 1,
                        }}
                      />
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                          />
                          <span className="text-sm text-white/70">Memproses...</span>
                        </div>
                      ) : (
                        <span className="relative z-10">MASUK</span>
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>

              {/* Footer text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-8 text-center text-xs text-white/25"
              >
                © 2025 Bimbingan Konseling — SMKN 12 Jakarta
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}