/* eslint-disable @typescript-eslint/no-var-requires */
"use server";

import SendEmailVerification from "@/actions/emailVerify/sendEmailVerification";
import { prisma } from "@/lib/prisma/client";
import { signUpType } from "@/lib/signup/signUpType";
import { nanoid } from "nanoid";

const bcrypt = require("bcryptjs");

export default async function userCreateDB(signup: signUpType): Promise<void> {
  const userId = nanoid(16);

  const hashedPass = await bcrypt.hash(signup.password, 8);

  try {
    await prisma.user.create({
      data: {
        id: userId,
        username: signup.username,
        email: signup.email,
        passwordHash: hashedPass,
        race: signup.race,
        emailVerified: false,
        status: "active",
      },
    });

    await SendEmailVerification({
      username: signup.username,
      email: signup.email,
    });
  } catch (err) {
    console.log("Error: ", err);
  }

  await prisma.$disconnect();
}
