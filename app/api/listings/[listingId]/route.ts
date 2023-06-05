import { NextResponse } from "next/server"
import { getUserSession } from "../../../actions/getCurrentUser"
import prisma from '../../../libs/prismadb'

interface IParams {
    listingId?: string
}

export async function DELETE(request: Request, {params} : {params: IParams}) {
    const currentUser = await getUserSession()

    if(!currentUser) {
        return NextResponse.error()
    }

    const {listingId} = params

    if(!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid Listing ID')
    }

    const listings = await prisma.listing.deleteMany(
        {
            where: {
                id: listingId,
                userId: currentUser.id
            }
        }
    )

    return NextResponse.json(listings)
}