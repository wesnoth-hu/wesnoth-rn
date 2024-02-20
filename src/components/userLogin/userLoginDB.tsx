/* eslint-disable @typescript-eslint/no-var-requires */
"use server";

import type { loginType } from "@/lib/login/loginType";
import { cookies } from "next/headers";
import * as Iron from "@hapi/iron";
import { prisma } from "@/lib/prisma/client";
import { User } from "@/lib/login/user";
import { nanoid } from "nanoid";
import { publicIpv4 } from "public-ip";
const bcrypt = require("bcrypt");

export default async function userLoginDB(login: loginType): Promise<boolean> {
  const cookieStore = cookies();
  const dbSessionID = nanoid(16);

  const findUser: User = await prisma.user.findFirst({
    where: {
      email: login.email,
    },
  });
  const matched = await bcrypt.compare(login.password, findUser?.password);

  const ironPass = process.env.IRON_SESSION_PW as string;
  const userIP = await publicIpv4();
  const randomNano = nanoid(32);
  const logmail = {
    userID: findUser?.id,
    email: login.email,
    userIP,
    randomNano,
  };

  if (matched) {
    const sealed = await Iron.seal(logmail, ironPass, Iron.defaults);

    cookieStore.set("userSession", sealed);

    await prisma.session.create({
      data: {
        id: dbSessionID as string,
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
