'use client'

import React, { useCallback, useState } from "react"
import { SafeListing, SafeReservation, SafeUser } from "../types"
import Container from "../components/Container"
import Heading from "../components/Heading"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-hot-toast"
import ListingCard from "../components/listings/ListingCard"

interface PropertiesClientProps {
    properties: SafeListing[]
    currentUser?: SafeUser | null
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
    properties,
    currentUser
}) => {
    const router = useRouter()

    const [deletingId, setDeletingId] = useState('')

    const onDelete = useCallback((id : string) => {
        setDeletingId(id)

        axios.delete(`/api/listings/${id}`).then(() => {
            toast.success('Property deleted!')
            router.refresh()
        }).catch((error) => {
            toast.error(error?.response?.data?.error)
        }).finally(() => {
            setDeletingId('')
        })
    }, [router])
    
    return (
        <Container>
            <Heading title="Properties" subtitle="List of your properties" />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {properties.map((property: SafeListing) => (
                    <ListingCard
                        key={property.id}
                        data={property}
                        currentUser={currentUser}
                        disabled={deletingId === property.id}
                        actionLabel="Delete Property"
                        actionId={property.id}
                        onAction={onDelete}
                    />
                ))}
            </div>
        </Container>
    )
}

export default PropertiesClient