"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <div>
        <h1>Subscription Tracker</h1>
        <p>Logged in as: {session.user?.name}</p>
        <p>Email: {session.user?.email}</p>

        <button onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Subscription Tracker</h1>
      <p>You are not logged in</p>

      <button onClick={() => signIn("google")}>
        Sign in with Google
      </button>
    </div>
  );
}
