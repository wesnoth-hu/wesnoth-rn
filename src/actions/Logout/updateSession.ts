"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma/client";

export default async function UpdateSession(ID: string): Promise<void> {
  const cookieStore = cookies();

  try {
    const session = await prisma.session.findFirst({
      where: {
        AND: [
          {
            userID: {
              equals: ID, // searches for the first session entry with the given userID
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
        status: "loggedOut",
      },
    });

    cookieStore.delete("userSession"); // deletes the `userSession` cookie
  } catch (error) {
    console.error("updateSession error: ", error);
    // TODO implement custom error message shown in the UI => { success: false/true, error: "Custom Error Message"}
  }

  await prisma.$disconnect();
}
