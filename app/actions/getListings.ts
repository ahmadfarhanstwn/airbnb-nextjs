import prisma from '../libs/prismadb'

export interface IListingsParams {
    userId?: string,
    roomCount?: string,
    guestCount?: string,
    bathroomCount?: string,
    locationValue?: string,
    startDate?: string,
    endDate?: string,
    category?: string
}

export const getListings = async (params : IListingsParams) => {
    try {
        let query: any = {}

        const { userId, roomCount, bathroomCount, guestCount, locationValue, startDate, endDate, category } = params

        if(userId) {
            query.userId = userId
        }
        
        if(category) {
            query.category = category
        }

        if(roomCount) {
            query.roomCount = {
                gte: +roomCount
            }
        }

        if(bathroomCount) {
            query.bathroomCount = {
                gte: +bathroomCount
            }
        }

        if(guestCount) {
            query.guestCount = {
                gte: +guestCount
            }
        }

        if(locationValue) {
            query.locationValue = locationValue
        }

        if(startDate && endDate) {
            query.NOT = {
                reservations: {
                    some: {
                        OR: [
                            {
                                endDate: { gte: startDate },
                                startDate: { lte: endDate }
                            },
                            {
                                startDate: { lte: endDate },
                                endDate: { gte : endDate }
                            }
                        ]
                    }
                }
            }
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