"use server";

import { UnsealObject } from "@/components/Account/unsealed";
import * as Iron from "@hapi/iron";
import GetSessionCookie from "./getSessionCookie";

export default async function SessionData(): Promise<{
  userID: string;
  email: string;
  roleID: string;
  userIP: string;
  randomNano: string;
}> {
  const ironPass = process.env.IRON_SESSION_PW as string;
  const sessionCookie = await GetSessionCookie();
  try {
    const unsealed: UnsealObject = await Iron.unseal(
      sessionCookie as string,
      ironPass,
      Iron.defaults
    );
    return unsealed as UnsealObject;
  } catch (error) {
    return {
      userID: "",
      email: "",
      roleID: "",
      userIP: "",
      randomNano: "",
    };
  }
}
