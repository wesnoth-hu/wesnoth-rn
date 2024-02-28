"use server";
import { cookies } from "next/headers";

export default async function GetSessionCookie(): Promise<string> {
  const cookieStore = cookies();

  return cookieStore.get("userSession")?.value as string;
}
