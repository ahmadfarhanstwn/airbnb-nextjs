import { create } from "zustand"

interface UseSearchProps {
    isOpen : boolean
    onOpen : () => void
    onClose : () => void
}

const useSearchState = create<UseSearchProps>((set) => ({
    isOpen: false,
    onOpen: () => {set({isOpen : true})},
    onClose: () => {set({isOpen : false})}
}))

export default useSearchState