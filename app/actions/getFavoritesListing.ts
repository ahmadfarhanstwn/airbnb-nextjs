import { Listing } from '@prisma/client'
import prisma from '../libs/prismadb'
import { getUserSession } from './getCurrentUser'

export default async function getFavoritesListing() {
    try {
        const currentUser = await getUserSession()

        if(!currentUser) {
            return []
        }

        const favorites = await prisma.listing.findMany({
            where: {
                id: {
                    in: [...(currentUser.favouriteIds || [])]
                }
            }
        })

        const safeFavorites = favorites.map((favorite: Listing) => ({
            ...favorite,
            createdAt: favorite.createdAt.toISOString()  
        }))

        return safeFavorites
    } catch(error: any) {
        throw new Error(error)
    }
}