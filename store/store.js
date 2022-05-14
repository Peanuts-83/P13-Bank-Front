import { configureStore } from '@reduxjs/toolkit'
// import { createWrapper } from 'next-redux-wrapper'
import userIdReducer from './slices/userIdSlice'

export function makeStore() {
    return configureStore({
        reducer: {
            user: userIdReducer,
        }
    })
}

const store = makeStore()

export default store
// const makeStore = () => store

// export const wrapper = createWrapper(makeStore)⎄