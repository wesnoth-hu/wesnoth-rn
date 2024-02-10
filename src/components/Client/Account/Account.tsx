'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import useAuthStore from "@/lib/zustand/authState";
import { User } from '@/lib/login/user';

export default function Account({cookie, user}: {cookie: boolean, user: User | null}) {

    const { isAuthenticated, userID, sessionData } = useAuthStore();

    const [userData, setuserData] = useState<User>({
        id: "",
        username: "",
        email: "",
        emailVerified: false,
        password: "",
        race: "",
        money: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    useEffect(() => {
        if (cookie) {
            setuserData(user as User);
        }
    }, []);

    return (
        <>
            <div>{userData.id}</div>
            <div>{userData.email}</div>
            <div><Image 
                    src={`/race/${userData.race}.png`}
                    alt={`${userData.race}-icon`}  
                    width={72}
                    height={72}  
                /></div>
            <div>{userData.username}</div>
            <div>{userData.emailVerified}</div>
            <div>{userData.createdAt.toString()}</div>
        </>
    )
}