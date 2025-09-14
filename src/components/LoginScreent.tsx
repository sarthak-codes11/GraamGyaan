// src/components/LoginScreen.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type LoginScreenState = "HIDDEN" | "LOGIN" | "SIGNUP";

type Props = {
  loginScreenState?: LoginScreenState;
  setLoginScreenState?: React.Dispatch<
    React.SetStateAction<LoginScreenState>
  >;
};

/**
 * Dual-mode LoginScreen:
 * - If loginScreen_state prop is provided -> acts like the old full-screen modal (compat)
 * - If no prop -> renders as a card (perfect for embedding inside your own modal)
 */
export const LoginScreen: React.FC<Props> = ({
  loginScreenState,
  setLoginScreenState,
}) => {
  const router = useRouter();
  const [screen, setScreen] = useState<"start" | "login" | "signup">(
    "start"
  );

  // simple form state (demo)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // sync with old API if parent controls it
  useEffect(() => {
    if (typeof loginScreenState === "undefined") return;
    if (loginScreenState === "LOGIN") setScreen("login");
    else if (loginScreenState === "SIGNUP") setScreen("signup");
    else setScreen("start");
  }, [loginScreenState]);

  const card = (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-gray-800">
      {screen === "start" && (
        <>
          <h2 className="text-2xl font-bold mb-3 text-center">స్వాగతం</h2>
          <div className="space-y-3">
            <button
              onClick={() => setScreen("login")}
              className="w-full rounded-lg bg-[#7B3F00] text-white py-2 font-semibold transition-all duration-300 ease-in-out hover:bg-[#5C4033]"
            >
              నాకు ఇప్పటికే ఖాతా ఉంది
            </button>

            <button
              onClick={() => setScreen("signup")}
              className="w-full rounded-lg border py-2 font-semibold"
              style={{ borderColor: "#6F0E1B", color: "#6F0E1B" }}
            >
              ఖాతా సృష్టించండి
            </button>
          </div>
        </>
      )}

      {screen === "login" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void router.push("/selectsubt");
          }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">లాగిన్</h2>
          <label className="block text-sm font-medium">ఇమెయిల్</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full mb-2 px-3 py-2 border rounded-lg"
            required
          />
          <label className="block text-sm font-medium">పాస్‌వర్డ్</label>
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
            లాగిన్
          </button>

          <p className="text-center mt-3 text-sm">
            కొత్తవారా?{" "}
            <button
              type="button"
              onClick={() => void router.push("/selectsubt")}
              className="text-blue-600 font-semibold"
            >
              సైన్ అప్
            </button>
          </p>
        </form>
      )}

      {screen === "signup" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void router.push("/selectsubt");
          }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">సైన్ అప్</h2>
          <label className="block text-sm font-medium">పూర్తి పేరు</label>
          <input className="w-full mb-2 px-3 py-2 border rounded-lg" required />

          <label className="block text-sm font-medium">ఇమెయిల్</label>
          <input type="email" className="w-full mb-2 px-3 py-2 border rounded-lg" required />

          <label className="block text-sm font-medium">పాస్‌వర్డ్</label>
          <input type="password" className="w-full mb-4 px-3 py-2 border rounded-lg" required />

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 text-white py-2 font-semibold"
            style={{ backgroundColor: "#7B3F00" }}
          >
            ఖాతా సృష్టించండి
          </button>

          <p className="text-center mt-3 text-sm">
            ఇప్పటికే ఖాతా ఉందా?{" "}
            <button
              type="button"
              onClick={() => void router.push("/selectsubt")}
              className="text-blue-600 font-semibold"
            >
              లాగిన్
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
