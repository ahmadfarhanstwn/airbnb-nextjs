import { getUserSession } from "../../actions/getCurrentUser"
import getListingById from "../../actions/getListingById"
import getReservations from "../../actions/getReservations"
import ClientOnly from "../../components/ClientOnly"
import EmptyState from "../../components/EmptyState"
import ListingClient from "./ListingClient"

interface IParams {
    listingId?: string
}

const ListingDetailPage  = async ({params} : {params : IParams}) => {
    const listing = await getListingById(params)
    const currentUser = await getUserSession()
    const reservations = await getReservations(params)

    if(!listing) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <ListingClient reservations={reservations} listing={listing} currentUser={currentUser} />
        </ClientOnly>
    )
}

export default ListingDetailPage