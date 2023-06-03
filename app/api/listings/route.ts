import { NextResponse } from "next/server";
import { getUserSession } from "../../actions/getCurrentUser";
import prisma from '../../libs/prismadb'

export async function POST(request : Request) {
    const currentUser = await getUserSession()

    if(!currentUser) {
        return NextResponse.error()
    }

    const body = await request.json()

    const {
        category,
        location,
        guestCount,
        roomCount,
        bathroomCount,
        imageSrc,
        price,
        title,
        description
    } = body

    const listing = await prisma.listing.create(
        {
            data: {
                category,
                locationValue: location.value,
                bathroomCount,
                description,
                guestCount,
                imageSrc,
                price: parseInt(price, 10),
                roomCount,
                title,
                userId: currentUser.id
            }
        }
    )

    return NextResponse.json(listing)
}