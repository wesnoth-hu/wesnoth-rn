'use server'

import { PrismaClient } from '@prisma/client';
import { signUpType } from '@/lib/signup/signUpType';
import { nanoid } from 'nanoid';

const bcrypt = require('bcrypt');

export default async function userCreateDB(signup:signUpType): Promise<void> {

    const prisma = new PrismaClient();

    const userId = nanoid(24);

    await bcrypt.hash(signup.password, 8, async function (err:string, hash:string) {
        try {
            await prisma.user.create({
                data: {
                    id: userId,
                    username: signup.username,
                    email: signup.email,
                    password: hash,
                    race: signup.race,
                    emailVerified: false
                }
            })

        } catch {
            console.log(err);
        }
    });
    await prisma.$disconnect();
}