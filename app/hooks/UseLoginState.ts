import { create } from "zustand"

interface UseLoginProps {
    isOpen : boolean
    onOpen : () => void
    onClose : () => void
}

const useLoginState = create<UseLoginProps>((set) => ({
    isOpen: false,
    onOpen: () => {set({isOpen : true})},
    onClose: () => {set({isOpen : false})}
}))

export default useLoginState