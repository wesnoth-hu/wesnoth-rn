"use server";
import { cookies } from "next/headers";

export default async function GetCookieState(): Promise<boolean> {
  const cookieStore = cookies();

  if (cookieStore.get("userSession")) {
    return true;
  } else {
    return false;
  }
}
