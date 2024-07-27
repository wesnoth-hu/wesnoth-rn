"use server";

import { cookies } from "next/headers";
import Iron from "@hapi/iron";
import MFASetupCheck from "../mfa/mfaSetupCheck";

export default async function TOTPCheck(): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const unsealed = await Iron.unseal(
      cookieStore.get("userSession")?.value as string,
      process.env.IRONPASS as string,
      Iron.defaults
    );
    if (unsealed) {
      const check = await MFASetupCheck();
      return check;
    } else {
      return false;
    }
  } catch (error) {
    console.log("TOTP Check at Login Error: ", error);
    return false;
  }
}
