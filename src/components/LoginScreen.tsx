"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import { useBoundStore } from "~/hooks/useBoundStore";

export type LoginScreenState = "HIDDEN" | "LOGIN" | "SIGNUP";

type Props = {
  loginScreenState?: LoginScreenState;
  setLoginScreenState?: React.Dispatch<
    React.SetStateAction<LoginScreenState>
  >;
};

export const LoginScreen: React.FC<Props> = ({
  loginScreenState,
  setLoginScreenState,
}) => {
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

  // store setters
  const setStoreName = useBoundStore((s) => s.setName);
  const setStoreUsername = useBoundStore((s) => s.setUsername);
  const setStoreEmail = useBoundStore((s) => s.setEmail);
  const logInStore = useBoundStore((s) => (s as any).logIn ?? (() => {}));

  // sync with parent
  useEffect(() => {
    if (!loginScreenState) return;
    if (loginScreenState === "LOGIN") setScreen("login");
    else if (loginScreenState === "SIGNUP") setScreen("signup");
    else setScreen("start");
  }, [loginScreenState]);

  // 🔑 Handle Login (unchanged)
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

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("User not found.");
        setLoading(false);
        return;
      }

      // ✅ Update last_login safely
      const { error: updateError } = await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", authData.user.id);

      if (updateError) {
        console.warn("Could not update last_login:", updateError.message);
      }

      // Fetch profile fields from users table to populate store
      const { data: userRow } = await supabase
        .from("users")
        .select("first_name,last_name,email")
        .eq("id", authData.user.id)
        .single();

      const fullName = userRow?.first_name || userRow?.last_name
        ? `${userRow?.first_name ?? ""} ${userRow?.last_name ?? ""}`.trim()
        : (authData.user.user_metadata?.full_name as string | undefined) ?? "";
      const derivedUsername = (userRow?.email ?? authData.user.email ?? "")
        .split("@")[0] ?? "";

      setStoreName(fullName || derivedUsername || "");
      setStoreUsername(derivedUsername);
      setStoreEmail(userRow?.email ?? authData.user.email ?? "");
      try { logInStore(); } catch {}

      // Redirect
      if (typeof window !== "undefined") {
        const intent = window.localStorage.getItem("loginRedirect");
        const target = intent || "/learn";
        window.localStorage.removeItem("loginRedirect");
        void router.push(target);
      } else {
        void router.push("/learn");
      }
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🆕 Handle Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 🚨 Password confirmation check
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (signUpData.user) {
        // ✅ Insert user details into "users" table
        const { error: insertError } = await supabase
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

        if (insertError)
          console.error("Failed to insert user:", insertError.message);
        else console.log("User saved/updated in users table");

        // Populate store for Profile
        const fullName = `${firstName} ${lastName}`.trim();
        const derivedUsername = (email ?? "").split("@")[0] ?? "";
        setStoreName(fullName || derivedUsername);
        setStoreUsername(derivedUsername);
        setStoreEmail(email);
        try { logInStore(); } catch {}
      }

      if (typeof window !== "undefined") {
        const intent = window.localStorage.getItem("loginRedirect");
        const target = intent || "/learn";
        window.localStorage.removeItem("loginRedirect");
        void router.push(target);
      } else {
        void router.push("/learn");
      }
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong. Try again.");
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
              Create account
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
            className="w-full mb-2 px-3 py-2 border rounded-lg"
            required
          />
          <label className="block text-sm font-medium">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Logging in..." : "Log in"}
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
            {loading ? "Creating..." : "Create account"}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      )}
    </div>
  );

  if (loginScreenState) {
    return (
      <article
        className={[
          "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition duration-200",
          loginScreenState === "HIDDEN"
            ? "pointer-events-none opacity-0"
            : "opacity-100",
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
    setLoginScreenState: (() => {}) as React.Dispatch<
      React.SetStateAction<LoginScreenState>
    >,
  };
}
