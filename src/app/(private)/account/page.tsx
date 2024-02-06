'use client'

import React, { useState } from 'react';
import useAuthStore from "@/lib/zustand/authState";

export default function Account() {

    const { isAuthenticated, userID, sessionData } = useAuthStore();

    return (
        <>
            <div>
                ACCOUNT

                
                    <div>Logged In {isAuthenticated.toString()}</div>
                    <div>Here's your userID, {userID}</div>
                    <div>Here's your sessionData, {sessionData}</div>
                
            </div>
        </>
    )
}