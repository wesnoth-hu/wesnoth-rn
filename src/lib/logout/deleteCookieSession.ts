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
    await prisma.session.delete({
      where: {
        userID: userID,
      },
    });
    cookieStore.delete("userSession");
  } catch (error) {
    console.error(error);
  }

  await prisma.$disconnect();
}
