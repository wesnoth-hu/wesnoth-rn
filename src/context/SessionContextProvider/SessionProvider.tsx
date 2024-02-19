"use client";

import { useState } from "react";
import { SessionContext } from "./SessionContext";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<{
    userID: string;
    email: string;
    userIP: string;
    randomNano: string;
  }>({ userID: "", email: "", userIP: "", randomNano: "" });

  return (
    <SessionContext.Provider value={[session, setSession]}>
      {children}
    </SessionContext.Provider>
  );
}
