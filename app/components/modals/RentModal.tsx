'use client'

import { useMemo, useState } from "react"
import useRentState from "../../hooks/UseRentState"
import Modal from "./Modal"
import Heading from "../Heading"
import { categoriesList } from "../navbar/Categories"
import CategoryInput from "../inputs/CategoryInput"
import { FieldValues, useForm } from "react-hook-form"
import CountrySelect from "../inputs/CountrySelect"
import dynamic from "next/dynamic"

enum STEPS{
    CATEGORIES = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {
    const [step, setStep] = useState(STEPS.CATEGORIES)

    const rentState = useRentState()

    const {register, watch, handleSubmit, setValue, formState: {errors}, reset} = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: ''
        }
    })

    const category = watch('category')
    const location = watch('location')

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location])

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        })
    }

    const onBack = () => {
        setStep((value) => value - 1)
    }

    const onNext = () => {
        setStep((value) => value + 1)
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return undefined
        }

        return 'Next'
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORIES) {
            return undefined
        }

        return 'Back'
    }, [step])

    // category body
    let bodyContents = (
        <div className="flex flex-col gap-8">
            <Heading title="Which of these best describes your place?" center subtitle="Pick a category" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto" >
                {categoriesList.map((item) => (
                    <CategoryInput icon={item.icon} label={item.label} onClick={(category) => setCustomValue('category', category)} selected={category === item.label} />
                ))}
            </div>
        </div>
    )

    if(step === STEPS.LOCATION) {
        bodyContents = (
            <div className="flex flex-col gap-8">
                <Heading title="Where is your place?" center subtitle="Let's help your guest!"/>
                <CountrySelect value={location} onChange={(value) => setCustomValue('location', value)} />
                <Map center={location?.latlng} />
            </div>
        )
    }

    return (
        <Modal actionLabel={actionLabel} secondaryActionLabel={secondaryActionLabel} secondaryAction={onBack} onClose={rentState.onClose} onSubmit={onNext} isOpen={rentState.isOpen} title="Airbnb your home!" body={bodyContents} />
    )
}

export default RentModal