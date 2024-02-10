"use server";
import { PrismaClient } from "@prisma/client";
import type { loginType } from "./loginType";

export default async function GetUserID(login: loginType): Promise<string> {
  const prisma = new PrismaClient();

  const userID = await prisma.user.findFirst({
    where: {
      email: login.email,
    },
  });

  await prisma.$disconnect();

  return userID?.id as string;
}
