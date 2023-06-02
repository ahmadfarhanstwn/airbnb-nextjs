import { getServerSession } from "next-auth"
import { authOptions } from "../../pages/api/auth/[...nextauth]"
import prisma from '../libs/prismadb'

export const getSession = async () => {
    return await getServerSession(authOptions)
}

export const getUserSession = async () => {
    try{
        const session = await getSession()

        if(!session?.user?.email) return null

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        })

        if(!currentUser) return null

        return currentUser
    } catch(err)
    {
        return null
    }
} 