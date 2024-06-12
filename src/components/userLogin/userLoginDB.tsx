/* eslint-disable @typescript-eslint/no-var-requires */
"use server";

import type { loginEmailType } from "@/lib/login/loginEmailType";
import type { loginUserType } from "@/lib/login/loginUserType";
import type { User } from "@/lib/user/user";
import { cookies } from "next/headers";
import * as Iron from "@hapi/iron";
import { prisma } from "@/lib/prisma/client";
import { nanoid } from "nanoid";
import { publicIpv4 } from "public-ip";
const bcrypt = require("bcryptjs");

export async function userLoginEmailDB(
  loginEmail: loginEmailType
): Promise<{ success: boolean; error?: string; admin?: string }> {
  try {
    const cookieStore = cookies();
    const dbSessionID = nanoid(16);
    const ironPass = process.env.IRONPASS as string;
    const userIP = await publicIpv4();
    const randomNano = nanoid(32);

    const findUserByEmail: User = await prisma.user.findUnique({
      where: {
        email: loginEmail.email,
      },
    });

    if (!findUserByEmail) {
      return {
        success: false,
        error: "A megadott emailcím hibás vagy nem létezik",
      };
    }

    const passMatchEmail = await bcrypt.compare(
      loginEmail.password,
      findUserByEmail?.passwordHash
    );

    if (!passMatchEmail) {
      return { success: false, error: "A megadott jelszó hibás" };
    }

    const sessionTokenByEmail = {
      userID: findUserByEmail?.id,
      email: findUserByEmail?.email,
      userIP,
      randomNano,
    };

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
        sessiondata: sealed as string,
        loginAt: new Date(), //.toISOString().slice(0, 19).replace('T', ' '),
        status: "active" as string,
      },
    });

    await prisma.$disconnect();
    return { success: true };
  } catch (error) {
    await prisma.$disconnect();
    return {
      success: false,
      error: "Hiba tőrtént a bejelentkezés során",
      admin: `userLoginEmailDB - ${error}`,
    };
  }
}

export async function userLoginUserDB(
  loginUser: loginUserType
): Promise<{ success: boolean; error?: string; admin?: string }> {
  try {
    const cookieStore = cookies();
    const dbSessionID = nanoid(16);
    const ironPass = process.env.IRONPASS as string;
    const userIP = await publicIpv4();
    const randomNano = nanoid(32);

    const findUserByUsername = await prisma.user.findUnique({
      where: {
        username: loginUser.username,
      },
    });

    if (!findUserByUsername) {
      return {
        success: false,
        error: "A megadott felhasználónév hibás vagy nem létezik",
      };
    }

    const passMatchUser = await bcrypt.compare(
      loginUser.password,
      findUserByUsername.passwordHash
    );

    if (!passMatchUser) {
      return { success: false, error: "A megadott jelszó hibás" };
    }

    const sessionTokenByUser = {
      userID: findUserByUsername.id,
      email: findUserByUsername.email,
      userIP,
      randomNano,
    };

    const sealed = await Iron.seal(sessionTokenByUser, ironPass, Iron.defaults);

    cookieStore.set("userSession", sealed);

    await prisma.session.create({
      data: {
        id: dbSessionID,
        userID: findUserByUsername.id,
        sessiondata: sealed,
        loginAt: new Date(),
        status: "active",
      },
    });

    await prisma.$disconnect();
    return { success: true };
  } catch (error) {
    await prisma.$disconnect();
    return {
      success: false,
      error: "Hiba történt a bejelentkezés során",
      admin: `userLoginUserDB - ${error}`,
    };
  }
}
