"use server";

import { prisma } from "@/lib/prisma/client";
import { User } from "@/lib/login/user";

export default async function FindUser(ID: string): Promise<User> {
  const findUser: User | null = await prisma.user.findFirst({
    where: {
      id: ID,
    },
  });

  await prisma.$disconnect();

  return findUser as User;
}
