"use server";

import { prisma } from "@/lib/prisma/client";
import { UnsealObject } from "@/components/Account/unsealed";
import * as Iron from "@hapi/iron";
import GetSessionCookie from "./getSessionCookie";

export default async function SessionData(session: string): Promise<{
  userID: string;
  email: string;
  userIP: string;
  randomNano: string;
}> {
  const ironPass = process.env.IRON_SESSION_PW as string;
  const sessionCookie = await GetSessionCookie();
  const unsealed: UnsealObject = await Iron.unseal(
    sessionCookie as string,
    ironPass,
    Iron.defaults
  );
  return unsealed;
}
