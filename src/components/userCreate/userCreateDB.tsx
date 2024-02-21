/* eslint-disable @typescript-eslint/no-var-requires */
"use server";

import { prisma } from "@/lib/prisma/client";
import { signUpType } from "@/lib/signup/signUpType";
import { nanoid } from "nanoid";

const bcrypt = require("bcrypt");

export default async function userCreateDB(signup: signUpType): Promise<void> {
  const userId = nanoid(16);

  const hashedPass = await bcrypt.hash(signup.password, 8);

  try {
    await prisma.user.create({
      data: {
        id: userId,
        username: signup.username,
        email: signup.email,
        password: hashedPass,
        race: signup.race,
        emailVerified: false,
      },
    });
  } catch (err) {
    console.log("Error: ", err);
  }

  await prisma.$disconnect();
}
