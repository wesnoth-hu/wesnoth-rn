
import Account from "@/components/Client/Account/Account";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import Iron from '@hapi/iron';
import { User } from "@/lib/login/user";

export default async function Page() {

    const cookieStore = cookies();
    const prisma = new PrismaClient();
    const ironPass = process.env.IRON_SESSION_PW as string;
    
    try {
        if (cookieStore.get('userSession')?.value !== null || cookieStore.get('userSession')?.value !== undefined) {
            const unsealed:string = await Iron.unseal(`${cookieStore.get('userSession')?.value}`, ironPass, Iron.defaults);
        
            const findUser: User | null = await prisma.user.findFirst({
                where: {
                    email: unsealed,
                }
            });
        
            return (
                <>
                    <Account cookie={true} user={findUser}/>
                </>
            )
        }
    } catch (error) {
        console.error(error);
        //TODO send email notification to ADmin UI
    }

    return (
        redirect('/')
    )
}