import prisma from '../libs/prismadb'

export interface IListingsParams {
    userId?: string
}

export const getListings = async (params : IListingsParams) => {
    try {
        let query: any = {}

        const { userId } = params

        if(userId) {
            query.userId = userId
        }

        const listings = await prisma.listing.findMany({
            where: query,
            orderBy: {
                createdAt: 'desc'
            }
        })

        return listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString()
        }))
    } catch(error : any) {
        throw new Error(error)
    }
}

export default getListings