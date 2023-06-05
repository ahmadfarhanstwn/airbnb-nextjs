'use client'

import React, { useCallback, useState } from "react"
import { SafeReservation, SafeUser } from "../types"
import Container from "../components/Container"
import Heading from "../components/Heading"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-hot-toast"
import ListingCard from "../components/listings/ListingCard"

interface ReservationsClientProps {
    reservations: SafeReservation[],
    currentUser: SafeUser | null
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
    reservations,
    currentUser
}) => {
    const router = useRouter()
    
    const [deletingId, setDeletingID] = useState('')

    const onCancel = useCallback((id: string) => {
        setDeletingID(id)

        axios.delete(`/api/reservations/${id}`).
            then(() => {
                toast.success('Reservation cancelled')
                router.refresh()
            }).catch(() => {
                toast.error('Something went wrong!')
            }).finally(() => {
                setDeletingID('')
            })
    }, [router])

    return (
        <Container>
            <Heading title="Reservations" subtitle="Bookings on your properties" />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {reservations.map((reservation: SafeReservation) => (
                    <ListingCard
                        key={reservation.id}
                        data={reservation.listing}
                        currentUser={currentUser}
                        reservation={reservation}
                        disabled={deletingId === reservation.id}
                        actionLabel="Cancel Guest Reservation"
                        actionId={reservation.id}
                        onAction={onCancel}
                    />
                ))}
            </div>
        </Container>
    )
}

export default ReservationsClient