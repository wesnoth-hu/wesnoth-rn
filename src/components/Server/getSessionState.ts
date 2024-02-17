"use server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { Session } from "@/lib/Session";

export default async function GetSessionState({
  userID,
}: {
  userID: string;
}): Promise<boolean> {
  const cookieStore = cookies();
  const prisma = new PrismaClient();

  const sealedSession: Session = await prisma.session.findFirst({
    where: {
      userID: {
        equals: userID,
      },
    },
  });

  if (cookieStore.get("userSession")?.value === sealedSession?.sessionData) {
    return true;
  } else {
    return false;
  }
}
