import { create } from "zustand"

interface UseRentProps {
    isOpen : boolean
    onOpen : () => void
    onClose : () => void
}

const useRentState = create<UseRentProps>((set) => ({
    isOpen: false,
    onOpen: () => {set({isOpen : true})},
    onClose: () => {set({isOpen : false})}
}))

export default useRentState