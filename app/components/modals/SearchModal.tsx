'use client'

import { useCallback, useMemo, useState } from "react"
import useSearchState from "../../hooks/UseSearchState"
import Modal from "./Modal"
import { useRouter, useSearchParams } from "next/navigation"
import { Range } from "react-date-range"
import dynamic from "next/dynamic"
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect"
import qs from 'query-string'
import { formatISO, setDate } from "date-fns"
import Heading from "../Heading"
import Calendar from "../inputs/Calendar"
import Counter from "../inputs/Counter"

enum STEP {
    LOCATION = 0,
    DATE = 1,
    INFO = 2
}

const SearchModal = () => {
    const searchState = useSearchState()
    const router = useRouter()
    const params = useSearchParams()

    const [step, setStep] = useState(STEP.LOCATION)
    const [roomCount, setRoomCount] = useState(1)
    const [guestCount, setGuestCount] = useState(1)
    const [bathroomCount, setBathroomCount] = useState(1)
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    })
    const [location, setLocation] = useState<CountrySelectValue>()

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location])

    const onBack = useCallback(() => {
        setStep((value) => value - 1)
    }, [])

    const onNext = useCallback(() => {
        setStep((value) => value + 1)
    }, [])

    const onSubmit = useCallback(async () => {
        if (step !== STEP.INFO) {
            return onNext()
        }

        let currentQuery: any = {}

        if (params) {
            currentQuery = qs.parse(params.toString())
        }

        const updatedQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount,
        }

        if(dateRange.startDate){
            updatedQuery.startDate = formatISO(dateRange.startDate)
        }

        if(dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate)
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, {
            skipNull: true
        })

        setStep(STEP.LOCATION)
        searchState.onClose()
        
        router.push(url)
    }, [step, location, guestCount, roomCount, bathroomCount, dateRange, onNext, params, searchState, router])

    const actionLabel = useMemo(() => {
        if(step === STEP.INFO) return 'Search'

        return 'Next'
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if(step === STEP.LOCATION) return undefined

        return 'Back'
    }, [step])

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading title="Where do you wanna go?" subtitle="Find the perfect location!" />
            <CountrySelect value={location} onChange={(value) => setLocation(value as CountrySelectValue)} />
            <hr />
            <Map center={location?.latlng} />
        </div>
    )

    if (step === STEP.DATE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="When do you plan to go?" subtitle="Make sure everyone is free!" />
                <Calendar value={dateRange} onChange={(value) => setDateRange(value.selection)} />
            </div>
        )
    }

    if (step === STEP.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="More Information" subtitle="Find your perfect place!" />
                <Counter title="Rooms" subtitle="How many rooms?" value={roomCount} onChange={(value) => setRoomCount(value)} />
                <Counter title="Bathrooms" subtitle="How many bathrooms?" value={bathroomCount} onChange={(value) => setBathroomCount(value)} />
                <Counter title="Guests" subtitle="How many guests?" value={guestCount} onChange={(value) => setGuestCount(value)} />
            </div>
        )
    }

    return (
        <Modal 
            onClose={searchState.onClose}
            onSubmit={onSubmit}
            isOpen={searchState.isOpen}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={onBack}
            title="Filter"
            body={bodyContent}
        />
    )
}

export default SearchModal