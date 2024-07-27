import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma/client";
import Iron from "@hapi/iron";
import { User } from "@/lib/user/user";

export default async function GetUser() {
  try {
    const cookiseStore = cookies();

    const sessionCookie = await Iron.unseal(
      cookiseStore.get("userSession")?.value as string,
      process.env.IRONPASS as string,
      Iron.defaults
    );

    const user: User = await prisma.user.findFirst({
      where: {
        id: sessionCookie?.id,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    // Error loging UI
  }

  await prisma.$disconnect;
}
