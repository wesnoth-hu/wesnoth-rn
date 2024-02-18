"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import Iron from "@hapi/iron";

import { User } from "@/lib/login/user";
import { UnsealObject } from "./unsealed";

export default async function FindUser(): Promise<User> {
  const cookieStore = cookies();
  const prisma = new PrismaClient();
  const ironPass = process.env.IRON_SESSION_PW as string;

  if (cookieStore.get("userSession")) {
    const unsealed: UnsealObject = await Iron.unseal(
      `${cookieStore.get("userSession")?.value}`,
      ironPass,
      Iron.defaults
    );

    const findUser: User | null = await prisma.user.findFirst({
      where: {
        email: unsealed.email,
      },
    });

    await prisma.$disconnect();

    return findUser as User;
  } else {
    redirect("/");
  }
}
