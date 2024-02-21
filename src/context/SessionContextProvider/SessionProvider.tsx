"use client";

import React, { useState } from "react";
import { SessionContext } from "./SessionContext";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<string>("");

  return (
    <SessionContext.Provider value={[session, setSession]}>
      {children}
    </SessionContext.Provider>
  );
}
