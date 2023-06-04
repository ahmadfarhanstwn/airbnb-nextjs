import { getUserSession } from "../../actions/getCurrentUser"
import getListingById from "../../actions/getListingById"
import ClientOnly from "../../components/ClientOnly"
import EmptyState from "../../components/EmptyState"
import ListingClient from "./ListingClient"

interface IParams {
    listingId?: string
}

const ListingDetailPage  = async ({params} : {params : IParams}) => {
    const listing = await getListingById(params)
    const currentUser = await getUserSession()

    if(!listing) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <ListingClient listing={listing} currentUser={currentUser} />
        </ClientOnly>
    )
}

export default ListingDetailPage