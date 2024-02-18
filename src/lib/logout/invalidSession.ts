"use server";

import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import * as Iron from "@hapi/iron";
import { UnsealObject } from "@/components/Account/unsealed";

export default async function InvalidSession(): Promise<void> {
  const prisma = new PrismaClient();
  const cookieStore = cookies();
  const IronPass = process.env.IRON_SESSION_PW as string;

  try {
    const unsealed: UnsealObject = await Iron.unseal(
      cookieStore.get("userSession")?.value as string,
      IronPass,
      Iron.defaults
    );

    const session = await prisma.session.findFirst({
      where: {
        AND: [
          {
            userID: {
              equals: unsealed?.userID, // searches for the first session entry with the given userID
            },
            status: {
              equals: "active", // searches for the first session entry which is `active`, based on userID
            },
          },
        ],
      },
    });

    await prisma.session.update({
      where: {
        id: session?.id, // updates the session entry based on the session entry's ID
      },
      data: {
        logoutAt: new Date(), // updates the session entry with current date and time, changes `status`
        status: "invalid",
      },
    });

    cookieStore.delete("userSession"); // deletes the `userSession` cookie
  } catch (error) {
    console.error("invalidSession error: ", error);
  }

  await prisma.$disconnect();
}
