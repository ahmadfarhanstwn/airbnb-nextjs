'use client'

import { useState } from "react"
import useRegisterState from "../../hooks/UseRegisterState"
import { useForm, FieldValues, SubmitHandler } from "react-hook-form"
import axios from "axios"
import Modal from "./Modal"
import Heading from "../Heading"
import Input from "../inputs/Input"
import { toast } from 'react-hot-toast'
import Button from "../Button"
import { FcGoogle } from 'react-icons/fc'
import { AiFillGithub } from 'react-icons/ai'

const RegisterModal = () => {
    const [isLoading, setIsLoading] = useState(false)
    const registerState = useRegisterState()

    const {register, handleSubmit, formState: {errors}} = useForm<FieldValues>({
        defaultValues: {
            name : "",
            email: "",
            password: ""
        }
    })

    const onSubmit : SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true)

        await axios.post('/api/register', data)
            .then(() => {
                registerState.onClose()
            }).catch(e => {
                toast.error('Something went wrong')
            }).finally(() => {
                setIsLoading(false)   
            })
    } 

    const BodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome to Airbnb" subtitle="Create an account!" center />
            <Input id="name" label="Name" register={register} errors={errors} />
            <Input id="email" label="Email" type="email" register={register} errors={errors} />
            <Input id="password" label="Password" type="password" register={register} errors={errors} />
        </div>
    )

    const FooterContent = (
        <div className="flex flex-col gap-4">
            <hr />
            <Button label="Continue With Google" onClick={() => {}} icon={FcGoogle} outline />
            <Button label="Continue With Github" onClick={() => {}} icon={AiFillGithub} outline />
            <div className="flex flex-row justify-center items-center gap-2">
                <div>
                    Already have an account?
                </div>
                <div onClick={registerState.onClose} className="text-neutral-800 cursor-pointer hover:underline">
                    Sign In
                </div>
            </div>
        </div>
    )

    return (
        <Modal disabled={isLoading} isOpen={registerState.isOpen} title="Register" actionLabel="Continue" onClose={registerState.onClose} onSubmit={handleSubmit(onSubmit)} body={BodyContent} footer={FooterContent} />
    )
}

export default RegisterModal