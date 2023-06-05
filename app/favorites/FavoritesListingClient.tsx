'use client'

import React from "react"
import { SafeListing, SafeUser } from "../types"
import Container from "../components/Container"
import Heading from "../components/Heading"
import ListingCard from "../components/listings/ListingCard"

interface FavoritesListingClientProps {
    favoritesListing: SafeListing[],
    currentUser: SafeUser | null
}

const FavoritesListingClient: React.FC<FavoritesListingClientProps> = (
    {
        favoritesListing,
        currentUser
    }
) => {
    return (
        <Container>
            <Heading title="Favorites Listing" subtitle="List of places you have favorited" />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {favoritesListing.map((favoriteListing: SafeListing) => (
                    <ListingCard
                        key={favoriteListing.id}
                        data={favoriteListing}
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
    )
}

export default FavoritesListingClient