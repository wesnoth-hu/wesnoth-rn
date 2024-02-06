'use server'

import { cookies } from 'next/headers'
import { PrismaClient } from "@prisma/client";

export default async function DeleteCookieSession(userID:string) : Promise<void> {

    const prisma = new PrismaClient();

    try {
        await prisma.session.delete({
            where: {
                userID: userID
            }
        });

        const cookieStore = cookies();

        cookieStore.delete('userSessionID');

    } catch (error) {
        console.error(error)
    }

    await prisma.$disconnect()
}