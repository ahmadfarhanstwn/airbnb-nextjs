import { create } from "zustand"

interface UseRegisterProps {
    isOpen : boolean
    onOpen : () => void
    onClose : () => void
}

const useRegisterState = create<UseRegisterProps>((set) => ({
    isOpen: false,
    onOpen: () => {set({isOpen : true})},
    onClose: () => {set({isOpen : false})}
}))

export default useRegisterState