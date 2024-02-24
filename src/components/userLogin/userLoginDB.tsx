/* eslint-disable @typescript-eslint/no-var-requires */
"use server";

import type { loginEmailType } from "@/lib/login/loginEmailType";
import type { loginUserType } from "@/lib/login/loginUserType";
import { cookies } from "next/headers";
import * as Iron from "@hapi/iron";
import { prisma } from "@/lib/prisma/client";
import { User } from "@/lib/login/user";
import { nanoid } from "nanoid";
import { publicIpv4 } from "public-ip";
const bcrypt = require("bcrypt");

export async function userLoginEmailDB(
  loginEmail: loginEmailType
): Promise<{ success: boolean; error?: string } | undefined> {
  const cookieStore = cookies();
  const dbSessionID = nanoid(16);
  const ironPass = process.env.IRON_SESSION_PW as string;
  const userIP = await publicIpv4();
  const randomNano = nanoid(32);

  try {
    const findUserByEmail: User = await prisma.user.findFirst({
      where: {
        email: loginEmail.email,
      },
    });

    const passMatchEmail = await bcrypt.compare(
      loginEmail.password,
      findUserByEmail?.password
    );

    const sessionTokenByEmail = {
      userID: findUserByEmail?.id,
      email: findUserByEmail?.email,
      role: findUserByEmail?.roleID,
      userIP,
      randomNano,
    };

    if (findUserByEmail !== null && passMatchEmail) {
      const sealed = await Iron.seal(
        sessionTokenByEmail,
        ironPass,
        Iron.defaults
      );

      cookieStore.set("userSession", sealed);

      await prisma.session.create({
        data: {
          id: dbSessionID as string,
          userID: findUserByEmail?.id as string,
          sessionData: sealed as string,
          loginAt: new Date(), //.toISOString().slice(0, 19).replace('T', ' '),
          status: "active" as string,
        },
      });

      await prisma.$disconnect();
      return { success: true };
    }
  } catch (error) {
    await prisma.$disconnect();
    return {
      success: false,
      error: "A megadott emailcím vagy jelszó hibás",
    };
  }
}

export async function userLoginUserDB(
  loginUser: loginUserType
): Promise<{ success: boolean; error?: string } | undefined> {
  const cookieStore = cookies();
  const dbSessionID = nanoid(16);
  const ironPass = process.env.IRON_SESSION_PW as string;
  const userIP = await publicIpv4();
  const randomNano = nanoid(32);

  try {
    const findUserByUsername: User = await prisma.user.findFirst({
      where: {
        username: loginUser.username,
      },
    });

    const passMatchUser = await bcrypt.compare(
      loginUser.password,
      findUserByUsername?.password
    );

    const sessionTokenByUser = {
      userID: findUserByUsername?.id,
      email: findUserByUsername?.email,
      role: findUserByUsername?.roleID,
      userIP,
      randomNano,
    };

    if (findUserByUsername !== null && passMatchUser) {
      const sealed = await Iron.seal(
        sessionTokenByUser,
        ironPass,
        Iron.defaults
      );

      cookieStore.set("userSession", sealed);

      await prisma.session.create({
        data: {
          id: dbSessionID as string,
          userID: findUserByUsername?.id as string,
          sessionData: sealed as string,
          loginAt: new Date(),
          status: "active" as string,
        },
      });

      await prisma.$disconnect();
      return { success: true };
    }
  } catch (error) {
    await prisma.$disconnect();
    return { success: false, error: "Felhasználónév hibás" };
  }
}
