'use client'

import {AiOutlineMenu} from 'react-icons/ai'
import Avatar from '../Avatar'
import React, { useCallback, useState } from 'react'
import MenuItem from './MenuItem'
import useRegisterState from '../../hooks/UseRegisterState'
import { signOut } from 'next-auth/react'
import { SafeUser } from '../../types'
import useLoginState from '../../hooks/UseLoginState'

interface UserMenuProps{
    currentUser : SafeUser | null
}

const UserMenu : React.FC<UserMenuProps> = ({currentUser}) => {
    const registerState = useRegisterState()
    const loginState = useLoginState()

    const [isOpen, setIsOpen] = useState(false)

    const toggleIsOpen = useCallback(() => {
        setIsOpen((value) => !value)
    }, [])
    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div onClick={() => {}} 
                    className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                    Airbnb your home
                </div>
                <div onClick={toggleIsOpen}
                    className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
                        <AiOutlineMenu />
                </div>
                <div className='hidden md:block'>
                    <Avatar src={currentUser?.image} />
                </div>
                {isOpen && (
                    <div className='absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm'>
                        <div className='flex flex-col cursor-pointer'>
                            {currentUser ? 
                                <>
                                    <MenuItem onClick={() => {}} label='My Trips' />
                                    <MenuItem onClick={() => {}} label='My Favorites' />
                                    <MenuItem onClick={() => {}} label='My Reservations' />
                                    <MenuItem onClick={() => {}} label='My Properties' />
                                    <MenuItem onClick={() => {}} label='Airbnb My Home' />
                                    <MenuItem onClick={() => signOut()} label='Sign Out' />
                                </>
                            : 
                                <>
                                    <MenuItem onClick={loginState.onOpen} label='Sign In' />
                                    <MenuItem onClick={registerState.onOpen} label='Sign Up' />
                                </>
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserMenu