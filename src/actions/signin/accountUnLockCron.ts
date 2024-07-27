"use server";

import { CronJob } from "cron";
import { prisma } from "@/lib/prisma/client";
import Iron from "@hapi/iron";
import ReadCookieData from "./readCookie";

const currentTime = new Date();
const halfLater = new Date();

const accountUnlock = new CronJob(
  new Date(halfLater.setTime(currentTime.getTime() + 30 * 60 * 1000)),
  async () => {
    try {
      const cookieData = await ReadCookieData();
      const unsealed: { username?: string; email?: string } = await Iron.unseal(
        cookieData as string,
        process.env.IRONPASS as string,
        Iron.defaults
      );
      console.log(
        "Unlocking account for ",
        unsealed.username ? unsealed.username : unsealed.email
      );
      if (unsealed.email) {
        await prisma.user.update({
          where: {
            email: unsealed.email,
          },
          data: {
            status: "active",
            lockedAt: null,
          },
        });
      } else if (unsealed.username) {
        await prisma.user.update({
          where: {
            username: unsealed.username,
          },
          data: {
            status: "active",
            lockedAt: null,
          },
        });
      }
      await prisma.$disconnect();
    } catch (error) {
      console.log("accountUnLockCron - ", error);
      await prisma.$disconnect();
    }
  }
);

export default async function AccountUnLock() {
  accountUnlock.start();
}
