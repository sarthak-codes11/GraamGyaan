"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClient";

export type LoginScreenState = "HIDDEN" | "LOGIN" | "SIGNUP";

type Props = {
  loginScreenState?: LoginScreenState;
  setLoginScreenState?: React.Dispatch<React.SetStateAction<LoginScreenState>>;
};

// 🔑 helper to safely get redirect path
function getStoredRedirectPath() {
  let redirectPath = "/selectsub";
  try {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("loginRedirect");
      if (stored) {
        redirectPath = stored;
        window.localStorage.removeItem("loginRedirect");
      }
    }
  } catch {
    // ignore storage errors
  }
  return redirectPath;
}

export const LoginScreen: React.FC<Props> = ({ loginScreenState }) => {
  const router = useRouter();
  const [screen, setScreen] = useState<"start" | "login" | "signup">("start");

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // sync with parent control if provided
  useEffect(() => {
    if (typeof loginScreenState === "undefined") return;
    if (loginScreenState === "LOGIN") setScreen("login");
    else if (loginScreenState === "SIGNUP") setScreen("signup");
    else setScreen("start");
  }, [loginScreenState]);

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });
      if (authError) throw authError;
      if (!authData.user) throw new Error("User not found");

      await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", authData.user.id);

      const redirectPath = getStoredRedirectPath();
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || "Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });
      if (signUpError) throw signUpError;

      if (signUpData.user) {
        await supabase
          .from("users")
          .upsert([
            {
              id: signUpData.user.id,
              email,
              first_name: firstName,
              last_name: lastName,
              last_login: new Date().toISOString(),
            },
          ])
          .eq("id", signUpData.user.id);
      }

      const redirectPath = getStoredRedirectPath();
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || "Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------- UI -------------------
  const card = (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-gray-800">
      {screen === "start" && (
        <>
          <h2 className="text-2xl font-bold mb-3 text-center">Welcome</h2>
          <div className="space-y-3">
            <button
              onClick={() => setScreen("login")}
              className="w-full rounded-lg bg-[#7B3F00] text-white py-2 font-semibold transition-all duration-300 ease-in-out hover:bg-[#5C4033]"
            >
              I already have an account
            </button>
            <button
              onClick={() => setScreen("signup")}
              className="w-full rounded-lg border py-2 font-semibold"
              style={{ borderColor: "#6F0E1B", color: "#6F0E1B" }}
            >
              Create an account
            </button>
          </div>
        </>
      )}

      {screen === "login" && (
        <form onSubmit={handleLogin}>
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <label className="block text-sm font-medium">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full mb-2 px-3 py-2 border rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
            required
          />
          <label className="block text-sm font-medium">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full mb-4 px-3 py-2 border rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg text-white py-2 font-semibold"
            style={{ backgroundColor: "#7B3F00" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      )}

      {screen === "signup" && (
        <form onSubmit={handleSignup}>
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

          <label className="block text-sm font-medium">First Name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
            className="w-full mb-2 px-3 py-2 border rounded-lg"
            required
          />

          <label className="block text-sm font-medium">Last Name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            type="text"
            className="w-full mb-2 px-3 py-2 border rounded-lg"
            required
          />

          <label className="block text-sm font-medium">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full mb-2 px-3 py-2 border rounded-lg"
            required
          />

          <label className="block text-sm font-medium">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full mb-2 px-3 py-2 border rounded-lg"
            required
          />

          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            className="w-full mb-4 px-3 py-2 border rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg text-white py-2 font-semibold"
            style={{ backgroundColor: "#7B3F00" }}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      )}
    </div>
  );

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

  return card;
};

export default LoginScreen;

export function useLoginScreen() {
  return {
    loginScreenState: "HIDDEN" as LoginScreenState,
    setLoginScreenState: (() => {}) as React.Dispatch<React.SetStateAction<LoginScreenState>>,
  };
}