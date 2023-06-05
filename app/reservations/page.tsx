import { getUserSession } from "../actions/getCurrentUser"
import getReservations from "../actions/getReservations"
import ClientOnly from "../components/ClientOnly"
import EmptyState from "../components/EmptyState"
import ReservationsClient from "./ReservationsClient"

const ReservationsPage = async () => {
    const currentUser = await getUserSession()
    
    if(!currentUser) {
        return (
            <ClientOnly>
                <EmptyState title="Unauthorized" subtitle="Please login to see this page" />
            </ClientOnly>
        )
    }

    const reservations = await getReservations({authorId: currentUser.id})

    if(reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState title="No reservations" subtitle="There is no reservations in your properties!" />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <ReservationsClient reservations={reservations} currentUser={currentUser} />
        </ClientOnly>
    )
}

export default ReservationsPage
