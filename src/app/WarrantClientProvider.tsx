"use client";

import React from "react";
import { WarrantProvider } from "@warrantdev/react-warrant-js";

export default function WarrantClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WarrantProvider clientKey={process.env.WARRANT_CLIENT_KEY as string}>
        {children}
      </WarrantProvider>
    </>
  );
}
