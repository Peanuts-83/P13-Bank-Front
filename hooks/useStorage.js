import { useEffect } from 'react'

function useStorage(type, name, value) {
    // const [value, setValue] = useState('')
    const types = {sessionStorage, localStorage}

    useEffect(() => {
        window.types[type].setItem(name, value)
    }, [name])
    return value
}

export default useStorage
