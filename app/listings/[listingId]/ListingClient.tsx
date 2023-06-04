'use client'

import React, { useMemo } from "react"
import { SafeListing, SafeUser } from "../../types"
import { Reservation } from "@prisma/client"
import { categoriesList } from "../../components/navbar/Categories"
import Container from "../../components/Container"
import ListingHead from "../../components/listings/ListingHead"
import ListingInfo from "../../components/listings/ListingInfo"

interface ListingClientProps {
    reservation?: Reservation,
    listing: SafeListing & {
        user: SafeUser
    },
    currentUser?: SafeUser | null
}

const ListingClient: React.FC<ListingClientProps> = ({reservation, listing, currentUser}) => {
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
                    <ListingInfo
                        user={listing.user}
                        category={category}
                        description={listing.description}
                        roomCount={listing.roomCount}
                        bathroomCount={listing.bathroomCount}
                        guestCount={listing.guestCount}
                        locationValue={listing.locationValue}
                    />
                </div>
            </div>
        </Container>
    )
}

export default ListingClient