"use server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import * as Iron from "@hapi/iron";
import { Session } from "@/lib/Session";
import { UnsealObject } from "../Account/unsealed";

export default async function GetSessionState(): Promise<boolean> {
  const cookieStore = cookies();
  const prisma = new PrismaClient();
  const IronPass = process.env.IRON_SESSION_PW as string;

  const unsealed: UnsealObject = await Iron.unseal(
    cookieStore.get("userSession")?.value as string,
    IronPass,
    Iron.defaults
  );

  const sealedSession: Session = await prisma.session.findFirst({
    where: {
      AND: [
        {
          userID: {
            equals: unsealed.userID,
          },
          status: {
            equals: "active",
          },
        },
      ],
    },
  });

  if (
    (cookieStore.get("userSession")?.value as string).localeCompare(
      sealedSession?.sessionData as string
    ) === 0
  ) {
    await prisma.$disconnect();
    return true;
  } else {
    await prisma.$disconnect();
    return false;
  }
}
