import { useEffect, useState } from "react"
import { _WIDTH_MOBILE, _WIDTH_TABLET } from "./helper"

export const useAdaptive = () => {
    const [type, setType] = useState<'MOBILE' | 'TABLET' | 'DESK'>('DESK')

    useEffect(() => {
        resize();
        window.addEventListener('resize', resize)
        return () => { window.removeEventListener('resize', resize) }
    }, [])

    const resize = () => {
        let w = window.innerWidth
        if(w <= _WIDTH_MOBILE){
            setType('MOBILE')
        }
        if(w > _WIDTH_MOBILE && w <= _WIDTH_TABLET){
            setType('TABLET')
        }
        if(w > _WIDTH_TABLET){
            setType("DESK")
        }
    }

    return type
}