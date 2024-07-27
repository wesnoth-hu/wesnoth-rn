"use server";

import { prisma } from "@/lib/prisma/client";
import Iron from "@hapi/iron";
import { CodeExpiryCronStop } from "./codeExpiryCron";

export default async function VerifyEmailCode({
  id,
  emailCode,
}: {
  id: string;
  emailCode: string;
}): Promise<
  { success: boolean; message?: string; error?: string } | undefined
> {
  try {
    // get the user information about the `emailVerified` column
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        emailVerified: true,
      },
    });

    // get the latest verificationn code from the DB per user
    const codeFromDB = await prisma.codes.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      where: {
        userID: id,
      },
      select: {
        code: true,
        used: true,
        expired: true,
      },
    });

    // use `Iron.unseal` to decode the verification code
    const unsealed = await Iron.unseal(
      codeFromDB[0]?.code as string,
      process.env.IRONPASS as string,
      Iron.defaults
    );

    // verification code obtained from the email link
    const codeFromEmail: string = await Iron.unseal(
      emailCode as string,
      process.env.IRONPASS as string,
      Iron.defaults
    );

    // check the `emailVerified` column
    if (!user?.emailVerified && unsealed === codeFromEmail) {
      // verify the code
      // if the unsealed object equals to the code from the email link
      // then return success
      if (codeFromDB[0]?.expired === false && codeFromDB[0]?.used === false) {
        // update the user record at emailverified column
        await prisma.user.update({
          where: {
            id: id,
          },
          data: {
            emailVerified: true,
          },
        });

        // obtain the id of the codes record
        const codes: { id: string }[] | null = await prisma.codes.findMany({
          orderBy: [
            {
              createdAt: "desc",
            },
          ],
          where: {
            userID: id,
          },
          select: {
            id: true,
          },
        });

        // use previously obtained record to update the
        // the verification record to `used`
        await prisma.codes.update({
          where: {
            id: codes[0]?.id,
          },
          data: {
            used: true,
            usedAt: new Date(),
          },
        });
        await CodeExpiryCronStop();
        await prisma.$disconnect();
        return {
          success: true,
          message: "Email verified successfully",
        };
      } else if (
        codeFromDB[0]?.expired === true &&
        codeFromDB[0]?.used === false
      ) {
        return {
          success: false,
          error: "Code is expired",
        };
      }
    } else if (user?.emailVerified && unsealed === codeFromEmail) {
      if (codeFromDB[0]?.used === true && codeFromDB[0]?.expired === false) {
        await CodeExpiryCronStop();

        return {
          success: false,
          error: "Code is already used",
        };
      } else if (
        codeFromDB[0]?.expired === false &&
        codeFromDB[0]?.used === false
      ) {
        return {
          success: false,
          error: "Email already verified",
        };
      }
    }
  } catch (error) {
    console.log(error);
    return { success: false, error: `Unexpected error occured` };
  } finally {
    await prisma.$disconnect();
  }
}
