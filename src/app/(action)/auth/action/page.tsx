'use client'

import { useState } from 'react';
import { redirect } from 'next/navigation';

function VerifyEmail(username: string, code: string) {
    return (
        <>The code for {username} is {code}</>
    )
}

export default function Page({ searchParams }: { searchParams: { mode: string; user: string; actionCode: string; } }) {

    switch (searchParams.mode) {
        case ("verifyEmail"):
            return VerifyEmail(searchParams.user, searchParams.actionCode);
        case ("passwordReset"):
            return (<div></div>)
        default: {
            return (
                redirect('/')
            )
        }
    }


}