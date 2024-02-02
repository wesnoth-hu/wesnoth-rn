'use server'

import { loginType } from '@/lib/loginType';

const bcrypt = require('bcrypt');

export default async function userLoginDB(login:loginType): Promise<boolean | void> {

    const logger = () => {
        bcrypt.hash(login.password, 8, async function (err:string, hash:string) {
            bcrypt.compare(login.password, hash, async function (err: string, result: string) {
                return result;
            })
        })
    };

    return logger();
}