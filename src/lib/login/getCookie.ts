'use server'
import { cookies } from 'next/headers';

export default async function GetCookie() : Promise<string> {
    const cookieStore = cookies();

    const sessionData = cookieStore.get('userSessionID');

    return sessionData?.value as string
}