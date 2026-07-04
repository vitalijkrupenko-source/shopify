"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace("/");
      router.refresh();
    } else {
      setError("Wrong password.");
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={submit} className="card w-full max-w-sm p-6">
        <h1 className="text-2xl font-bold">
          Review<span className="text-indigo-600">Ops</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter your dashboard password.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="input mt-4"
        />
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
        <button type="submit" disabled={busy || !password} className="btn-primary mt-4 w-full">
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
