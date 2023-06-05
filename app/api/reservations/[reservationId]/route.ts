import { NextResponse } from "next/server"
import { getUserSession } from "../../../actions/getCurrentUser"
import prisma from '../../../libs/prismadb'

interface IParams {
    reservationId?: string
}

export async function DELETE(
    request : Request, 
    {params } : {params : IParams}) {
        const currentUser = await getUserSession()

        if(!currentUser) {
            return NextResponse.error()
        }

        const { reservationId } = params

        if(!reservationId || typeof reservationId !== 'string') {
            throw new Error('Reservation ID is not valid')
        }

        const reservation = await prisma.reservation.deleteMany({
            where: {
                id: reservationId,
                OR: [
                    {userId: currentUser.id},
                    {listing: { userId: currentUser.id }}
                ]
            },
        })

        return NextResponse.json(reservation)
}