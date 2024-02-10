'use server'

import type { loginType } from '@/lib/login/loginType';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import * as Iron from '@hapi/iron';
import { PrismaClient } from '@prisma/client';
import { User } from '@/lib/login/user';
import { nanoid } from 'nanoid';
const bcrypt = require('bcrypt');

export default async function userLoginDB(login:loginType): Promise<void> {

    const prisma = new PrismaClient();
    const cookieStore = cookies();

        try {
            const passwordHash = await bcrypt.hash(login.password, 8);
            const matched = await bcrypt.compare(login.password, passwordHash);
            const ironPass = process.env.IRON_SESSION_PW as string;
            const logmail = {email: login.email}
            
            if (matched) {
                const sealed = await Iron.seal(`${logmail.email}`, ironPass, Iron.defaults);

                cookieStore.set('userSession',sealed);
                
                const findUser: User | null = await prisma.user.findFirst({
                    where: {
                        email: login.email
                    }
                });
                
                await prisma.session.create({
                    data: {
                        id: nanoid(16) as string,
                        userID: findUser?.id as string,
                        sessionData: sealed as string
                    }
                });

            }
        } catch (error) {
            console.error(error);
            redirect('/');
        }

        await prisma.$disconnect();
}