"use server";
import { prisma } from "../prisma/client";
import { cookies } from "next/headers";
import Iron from "@hapi/iron";
import { UnsealObject } from "@/components/Account/unsealed";

export default async function GetUserID(): Promise<string> {
  const cookieStore = cookies();

  const IronPass: string = process.env.IRON_SESSION_PW as string;

  const unsealed: UnsealObject = await Iron.unseal(
    cookieStore.get("userSession")?.value as string,
    IronPass,
    Iron.defaults
  ); // unseales cookie to extract data

  const userID = await prisma.user.findFirst({
    where: {
      email: unsealed.email,
    },
  }); // searches for users' ID based on email address obtained from unsealed cookie data

  await prisma.$disconnect();

  return userID?.id as string;
}
