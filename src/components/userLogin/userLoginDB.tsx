"use server";

import type { loginType } from "@/lib/login/loginType";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import * as Iron from "@hapi/iron";
import { PrismaClient } from "@prisma/client";
import { User } from "@/lib/login/user";
import { nanoid } from "nanoid";
import { publicIpv4 } from "public-ip";
import { match } from "assert";
const bcrypt = require("bcrypt");

export default async function userLoginDB(login: loginType): Promise<boolean> {
  const prisma = new PrismaClient();
  const cookieStore = cookies();

  const dbPassHash: User | null = await prisma.user.findFirst({
    where: {
      email: login.email,
    },
  });
  const matched = await bcrypt.compare(login.password, dbPassHash?.password);

  const ironPass = process.env.IRON_SESSION_PW as string;
  const userIP = await publicIpv4();
  const randomNano = nanoid(32);
  const logmail = { email: login.email, userIP, randomNano };

  if (matched) {
    const sealed = await Iron.seal(logmail, ironPass, Iron.defaults);

    cookieStore.set("userSession", sealed);

    const findUser: User | null = await prisma.user.findFirst({
      where: {
        email: login.email,
      },
    });

    await prisma.session.create({
      data: {
        id: nanoid(16) as string,
        userID: findUser?.id as string,
        sessionData: sealed as string,
        loginAt: new Date(), //.toISOString().slice(0, 19).replace('T', ' '),
        status: "active" as string,
      },
    });

    await prisma.$disconnect();
    return true;
  } else {
    await prisma.$disconnect();
    return false;
  }
}
