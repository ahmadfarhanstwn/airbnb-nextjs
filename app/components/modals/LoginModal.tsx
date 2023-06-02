'use client'

import { useState } from "react"
import { useForm, FieldValues, SubmitHandler } from "react-hook-form"
import Modal from "./Modal"
import Heading from "../Heading"
import Input from "../inputs/Input"
import { toast } from 'react-hot-toast'
import useLoginState from "../../hooks/UseLoginState"
import Button from "../Button"
import { FcGoogle } from 'react-icons/fc'
import { AiFillGithub } from 'react-icons/ai'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const LoginModal = () => {
    const [isLoading, setIsLoading] = useState(false)
    const loginState = useLoginState()
    const router = useRouter()

    const {register, handleSubmit, formState: {errors}} = useForm<FieldValues>({
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit : SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)

        signIn('credentials', {
            ...data,
            redirect: false
        }).then((callback) => {
            setIsLoading(false)
            if(callback?.ok) {
                toast.success('Logged in')
                router.refresh()
                loginState.onClose()
            }
            if(callback?.error) {
                toast.error(callback.error)
            }
        })
    } 

    const BodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome back" subtitle="Let's Sign In!" center />
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
                    Don't have an account?
                </div>
                <div onClick={loginState.onClose} className="text-neutral-800 cursor-pointer hover:underline">
                    Sign Up
                </div>
            </div>
        </div>
    )

    return (
        <Modal disabled={isLoading} isOpen={loginState.isOpen} title="Login" actionLabel="Sign In" onClose={loginState.onClose} onSubmit={handleSubmit(onSubmit)} body={BodyContent} footer={FooterContent} />
    )
}

export default LoginModal