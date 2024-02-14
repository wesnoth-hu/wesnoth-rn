"use server";

import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { SessionData } from "@/lib/login/sessionData";

export default async function DeleteCookieSession(
  userID: string
): Promise<void> {
  const prisma = new PrismaClient();
  const cookieStore = cookies();

  try {
    const sessionID = await prisma.session.findFirstOrThrow({
      where: {
        userID: userID,
      },
    });

    await prisma.session.update({
      where: {
        id: sessionID.id,
      },
      data: {
        logoutAt: new Date(), //.toISOString().slice(0, 19).replace("T", " "),
        status: "loggedOut",
      },
    });
    cookieStore.delete("userSession");
  } catch (error) {
    console.error(error);
  }

  await prisma.$disconnect();
}
