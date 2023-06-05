import { getUserSession } from "../actions/getCurrentUser"
import getFavoritesListing from "../actions/getFavoritesListing"
import ClientOnly from "../components/ClientOnly"
import EmptyState from "../components/EmptyState"
import FavoritesListingClient from "./FavoritesListingClient"

const Favorites = async () => {
    const currentUser = await getUserSession()

    if(!currentUser) {
        return (
            <ClientOnly>
                <EmptyState title="Unauthorized" subtitle="Please login to see your favorites listing!" />
            </ClientOnly>
        )
    }

    const favoritesListing = await getFavoritesListing()

    if(favoritesListing.length === 0) {
        return (
            <ClientOnly>
                <EmptyState title="No Favorites" subtitle="Add your favorites listing!" />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <FavoritesListingClient favoritesListing={favoritesListing} currentUser={currentUser} />
        </ClientOnly>
    )
}

export default Favorites