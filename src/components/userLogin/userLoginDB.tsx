'use server'

import { loginType } from '@/lib/loginType';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';
import { PrismaClient } from '@prisma/client';
const bcrypt = require('bcrypt');

export default async function userLoginDB(login:loginType): Promise<void> {

    const cookieStore = cookies();

    const prisma = new PrismaClient();

        try {
            const passwordHash = await bcrypt.hash(login.password, 8);
            const matched = await bcrypt.compare(login.password, passwordHash);

            if (matched) {
                cookieStore.set("userSessionID", nanoid(32), { 
                    httpOnly: true,
                    secure: true,
                    sameSite: 'lax'
                });

                const findUser = await prisma.user.findFirst({
                    where: {
                        email: login.email
                    }
                });
                
                const getCookie = cookieStore.get('userSessionID');
                
                await prisma.session.create({
                    data: {
                        userID: findUser?.id as string,
                        sessionData: getCookie?.value as string
                    }
                });
            }
        } catch (error) {
            redirect("/signin");
        }

}