import prisma from '../libs/prismadb'

export const getListings = async () => {
    try {
        const listings = await prisma.listing.findMany({
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