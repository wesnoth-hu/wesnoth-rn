'use server'

import { loginType } from '@/lib/loginType';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';

const bcrypt = require('bcrypt');

export default async function userLoginDB(login:loginType): Promise<void> {

    const cookieStore = cookies();

    const logger = () => {
        bcrypt.hash(login.password, 8, async function (err:string, hash:string) {
            bcrypt.compare(login.password, hash, async function (err: string, result: boolean) {
                try {
                    if (result) {
                        console.log(result);
                        cookieStore.set('userSessionID', nanoid(24));
                    }
                }
                catch (err) {
                    return redirect('/signin')
                }
            })
        })
    };

    logger();
}