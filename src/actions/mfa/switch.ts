"use server";

import { prisma } from "@/lib/prisma/client";

//ALIAS mfaEnabled

export default async function Switch(id: string, checked: boolean) {
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        mfaEnabled: checked,
      },
    });
  } catch (error) {
    console.log("MFA Switch Error: ", error);
  }
  await prisma.$disconnect();
}
