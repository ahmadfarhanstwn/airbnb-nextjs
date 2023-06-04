'use client'

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { SafeListing, SafeUser } from "../../types"
import { Reservation } from "@prisma/client"
import { categoriesList } from "../../components/navbar/Categories"
import Container from "../../components/Container"
import ListingHead from "../../components/listings/ListingHead"
import ListingInfo from "../../components/listings/ListingInfo"
import useLoginState from "../../hooks/UseLoginState"
import { useRouter } from "next/navigation"
import { differenceInDays, eachDayOfInterval } from "date-fns"
import axios from "axios"
import { toast } from "react-hot-toast"
import ListingReservation from "../../components/listings/ListingReservation"
import { Range } from "react-date-range"

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

interface ListingClientProps {
    reservations?: Reservation[],
    listing: SafeListing & {
        user: SafeUser
    },
    currentUser?: SafeUser | null
}

const ListingClient: React.FC<ListingClientProps> = ({reservations = [], listing, currentUser}) => {
    const loginState = useLoginState()
    const router = useRouter()

    const disabledDates = useMemo(() => {
        let dates: Date[] = []

        reservations.forEach((reservation: Reservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate)
            })

            dates = [...dates, ...range]
        })

        return dates
    }, [reservations])

    const [isLoading, setIsLoading] = useState(false)
    const [totalPrice, setTotalPrice] = useState(listing.price)
    const [dateRange, setDateRange] = useState<Range>(initialDateRange)

    const onCreateReservation = useCallback(() => {
        if (!currentUser) return loginState.onOpen()

        setIsLoading(true)

        axios.post('/api/reservations', {
            totalPrice,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            listingId: listing?.id
        }).then(() => {
            toast.success('Create reservation success!')
            setDateRange(initialDateRange)
            router.refresh()
        }).catch(() => {
            toast.error('Something went wrong!')
        }).finally(() => {
            setIsLoading(false)
        })
    }, [totalPrice, dateRange, listing?.id, router, currentUser, loginState])

    useEffect(() => {
        if(dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInDays(
                dateRange.endDate,
                dateRange.startDate
            )

            if (dayCount && listing.price) {
                setTotalPrice(dayCount * listing.price)
            } else {
                setTotalPrice(listing.price)
            }
        }
    }, [dateRange, listing.price])

    const category = useMemo(() => categoriesList.find((item) => {
        return item.label === listing.category
    }), [listing.category])

    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead
                        title={listing.title}
                        imageSrc={listing.imageSrc}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        currentUser={currentUser}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
                        <ListingInfo
                            user={listing.user}
                            category={category}
                            description={listing.description}
                            roomCount={listing.roomCount}
                            bathroomCount={listing.bathroomCount}
                            guestCount={listing.guestCount}
                            locationValue={listing.locationValue}
                        />
                        <div className="order-first mb-10 md:order-last md:col-span-3">
                            <ListingReservation 
                                dateRange={dateRange} 
                                disabledDates={disabledDates}
                                onChangeDate={(value) => setDateRange(value)}
                                onSubmit={onCreateReservation}
                                disabled={isLoading}
                                price={listing.price}
                                totalPrice={totalPrice}     
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ListingClient