// src/components/LoginScreen.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClient";

export type LoginScreenState = "HIDDEN" | "LOGIN" | "SIGNUP";

type Props = {
  loginScreenState?: LoginScreenState;
  setLoginScreenState?: React.Dispatch<
    React.SetStateAction<LoginScreenState>
  >;
};

/**
 * Dual-mode LoginScreen:
 * - If loginScreenState prop is provided -> acts like the old full-screen modal (compat)
 * - If no prop -> renders as a card (perfect for embedding inside your own modal)
 */
export const LoginScreen: React.FC<Props> = ({
  loginScreenState,
  setLoginScreenState,
}) => {
  const router = useRouter();
  const [screen, setScreen] = useState<"start" | "login" | "signup">("start");

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // sync with old API if parent controls it
  useEffect(() => {
    if (typeof loginScreenState === "undefined") return;
    if (loginScreenState === "LOGIN") setScreen("login");
    else if (loginScreenState === "SIGNUP") setScreen("signup");
    else setScreen("start");
  }, [loginScreenState]);

  // 🔑 Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log("✅ Logged in:", data);
      router.push("/selectsub"); // redirect after success
    }

    setLoading(false);
  };

  // 🆕 Handle Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log("✅ Signed up:", data);
      router.push("/selectsub");
    }

    setLoading(false);
  };

  const card = (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-gray-800">
      {screen === "start" && (
        <>
          <h2 className="text-2xl font-bold mb-3 text-center">स्वागत है</h2>
          <div className="space-y-3">
            <button
              onClick={() => setScreen("login")}
              className="w-full rounded-lg bg-[#7B3F00] text-white py-2 font-semibold transition-all duration-300 ease-in-out hover:bg-[#5C4033]"
            >
              मेरे पास पहले से खाता है
            </button>

            <button
              onClick={() => setScreen("signup")}
              className="w-full rounded-lg border py-2 font-semibold"
              style={{ borderColor: "#6F0E1B", color: "#6F0E1B" }}
            >
              खाता बनाएँ
            </button>
          </div>
        </>
      )}

      {screen === "login" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void router.push("/selectsubh");
          }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">लॉग इन</h2>
          <label className="block text-sm font-medium">ईमेल</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full mb-2 px-3 py-2 border rounded-lg"
            required
          />
          <label className="block text-sm font-medium">पासवर्ड</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full mb-4 px-3 py-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 text-white py-2 font-semibold"
            style={{ backgroundColor: "#7B3F00" }}
          >
            लॉग इन
          </button>

          <p className="text-center mt-3 text-sm">
            नए हैं?{" "}
            <button
              type="button"
              onClick={() => void router.push("/selectsubh")}
              className="text-blue-600 font-semibold"
            >
              साइन अप
            </button>
          </p>
        </form>
      )}

      {screen === "signup" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void router.push("/selectsubh");
          }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">साइन अप</h2>
          <label className="block text-sm font-medium">पूरा नाम</label>
          <input className="w-full mb-2 px-3 py-2 border rounded-lg" required />

          <label className="block text-sm font-medium">ईमेल</label>
          <input type="email" className="w-full mb-2 px-3 py-2 border rounded-lg" required />

          <label className="block text-sm font-medium">पासवर्ड</label>
          <input type="password" className="w-full mb-4 px-3 py-2 border rounded-lg" required />

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 text-white py-2 font-semibold"
            style={{ backgroundColor: "#7B3F00" }}
          >
            खाता बनाएँ
          </button>

          <p className="text-center mt-3 text-sm">
            पहले से खाता है?{" "}
            <button
              type="button"
              onClick={() => void router.push("/selectsubh")}
              className="text-blue-600 font-semibold"
            >
              लॉग इन
            </button>
          </p>
        </form>
      )}
    </div>
  );

  // If parent is using old API, render the full-screen container (compat)
  if (typeof loginScreenState !== "undefined") {
    return (
      <article
        className={[
          "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition duration-200",
          loginScreenState === "HIDDEN" ? "pointer-events-none opacity-0" : "opacity-100",
        ].join(" ")}
        aria-hidden={loginScreenState === "HIDDEN"}
      >
        {card}
      </article>
    );
  }

  // Default: return the card (for embedding in a modal)
  return card;
};

export default LoginScreen;

// Backwards-compatible hook (small stub so old pages won't crash)
export function useLoginScreen() {
  return {
    loginScreenState: "HIDDEN" as LoginScreenState,
    setLoginScreenState: (() => {}) as React.Dispatch<React.SetStateAction<LoginScreenState>>,
  };
}
