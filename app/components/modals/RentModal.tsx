'use client'

import { useMemo, useState } from "react"
import useRentState from "../../hooks/UseRentState"
import Modal from "./Modal"
import Heading from "../Heading"
import { categoriesList } from "../navbar/Categories"
import CategoryInput from "../inputs/CategoryInput"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import CountrySelect from "../inputs/CountrySelect"
import dynamic from "next/dynamic"
import Counter from "../inputs/Counter"
import ImageUpload from "../inputs/ImageUpload"
import Input from "../inputs/Input"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import axios from "axios"

enum STEPS{
    CATEGORIES = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState(STEPS.CATEGORIES)

    const router = useRouter()

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
    const guestCount = watch('guestCount')
    const roomCount = watch('roomCount')
    const bathroomCount = watch('bathroomCount')
    const imageSrc = watch('imageSrc')

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

    const onSubmit : SubmitHandler<FieldValues> = async (data) => {
        if(step !== STEPS.PRICE) {
            return onNext()
        }
        setIsLoading(true)

        await axios.post('/api/listings', data)
            .then(() => {
                toast.success('Listing created!')
                router.refresh()
                reset()
                setStep(STEPS.CATEGORIES)
                rentState.onClose()
            }).catch(() => { 
                toast.error('Something went wrong')
            }).finally(() => {
                setIsLoading(false)   
            })
    } 

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Submit'
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

    if (step === STEPS.INFO) {
        bodyContents = (
            <div className="flex flex-col gap-8">
                <Heading title="Share about your place!" center subtitle="What facilities do you have?" />
                <Counter title="Guests" subtitle="Enter the max guests" value={guestCount} onChange={(value) => setCustomValue('guestCount', value)} />
                <hr />
                <Counter title="Rooms" subtitle="Enter the room do you have" value={roomCount} onChange={(value) => setCustomValue('roomCount', value)} />
                <hr />
                <Counter title="Bathrooms" subtitle="Enter the bathroom do you have" value={bathroomCount} onChange={(value) => setCustomValue('bathroomCount', value)} />
            </div>
        )
    }

    if(step === STEPS.IMAGES) {
        bodyContents = (
            <div className="flex flex-col gap-8">
                <Heading title="Add a photo of your place!" center subtitle="Tell your guets what your place is looks like!" />
                <ImageUpload value={imageSrc} onChange={(value) => setCustomValue('imageSrc', value)} />
            </div>
        )
    }

    if(step === STEPS.DESCRIPTION) {
        bodyContents = (
            <div className="flex flex-col gap-8">
                <Heading title="Describe your place!" center subtitle="Short description would be very helpful for your guests!" />
                <Input id="title" label="Title" disabled={isLoading} register={register} required errors={errors}/>
                <hr />
                <Input id="description" label="Description" disabled={isLoading} register={register} required errors={errors}/>
            </div>
        )
    }

    if(step === STEPS.PRICE) {
        bodyContents = (
            <div className="flex flex-col gap-8">
                <Heading title="Set your price!" center subtitle="How much you charge per night?" />
                <Input id="price" label="Price" disabled={isLoading} formatPrice register={register} required errors={errors} type="number" />
            </div>
        )
    }

    return (
        <Modal actionLabel={actionLabel} secondaryActionLabel={secondaryActionLabel} secondaryAction={onBack} onClose={rentState.onClose} onSubmit={handleSubmit(onSubmit)} isOpen={rentState.isOpen} title="Airbnb your home!" body={bodyContents} />
    )
}

export default RentModal