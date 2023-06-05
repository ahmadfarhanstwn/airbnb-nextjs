import { getUserSession } from "../actions/getCurrentUser"
import getReservations from "../actions/getReservations"
import ClientOnly from "../components/ClientOnly"
import EmptyState from "../components/EmptyState"
import TripsClient from "./TripsClient"


const TripsPage = async () => {
    const currentUser = await getUserSession()
    
    if(!currentUser) {
        return (
            <ClientOnly>
                <EmptyState title="Unauthorized" subtitle="Please login to see this page" />
            </ClientOnly>
        )
    }

    const reservations = await getReservations({userId: currentUser.id})

    if(reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState title="No reservations" subtitle="You haven't made any reservations" />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <TripsClient reservations={reservations} currentUser={currentUser} />
        </ClientOnly>
    )
}

export default TripsPage
