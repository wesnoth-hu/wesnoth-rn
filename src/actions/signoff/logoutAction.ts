"use server";

import { prisma } from "@/lib/prisma/client";
import { cookies } from "next/headers";
import { SessionExpiryStop } from "./sessionExpiredCron";

export default async function LogoutAction(): Promise<void> {
  try {
    const cookieStore = cookies();
    const cookieValue = cookieStore.get("userSession")?.value;

    if (cookieValue) {
      const session = await prisma.session.findFirstOrThrow({
        where: {
          sessiondata: cookieValue,
        },
      });
      await prisma.session.update({
        where: {
          id: session.id,
        },
        data: {
          logoutAt: new Date(),
          status: "loggedOut",
        },
      });
    }

    await SessionExpiryStop();

    cookieStore.delete("userSession");

    await prisma.$disconnect();
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
}
