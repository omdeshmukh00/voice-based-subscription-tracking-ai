"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("SESSION OBJECT:", session);
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    return (
      <div>
        <h1>Not logged in</h1>
        <button onClick={() => signIn("google")}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Logged in as {session.user?.email}</h1>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
