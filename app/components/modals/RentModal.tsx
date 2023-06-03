'use client'

import { useMemo, useState } from "react"
import useRentState from "../../hooks/UseRentState"
import Modal from "./Modal"
import Heading from "../Heading"
import { categoriesList } from "../navbar/Categories"
import CategoryInput from "../inputs/CategoryInput"
import { FieldValues, useForm } from "react-hook-form"

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

    return (
        <Modal actionLabel={actionLabel} secondaryActionLabel={secondaryActionLabel} secondaryAction={onNext} onClose={rentState.onClose} onSubmit={onBack} isOpen={rentState.isOpen} title="Airbnb your home!" body={bodyContents} />
    )
}

export default RentModal