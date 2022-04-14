import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    status: 'void',
    token: null,
    error: null,
    infos: {
        firstname: null,
        lastname: null,
        email: null,
        password: null,
    }
}

export async function initProfil(dispatch, getState) {
    const status = getState().user.status
    if  (status === 'connected') {
        dispatch(init())
    }
    return
}

export function loginUser(email, password) {
    // console.log('START LoginUser', email, password)
    // return a thunk
    return async (dispatch, getState) => {
        // const state = getState()
        const status = getState().user.status
        if (status === 'pending' || status === 'updating') {
            console.log('EXITING / Status -', status)
            return
        }
        dispatch(fetching())
        try {
            const response = await axios.post('http://127.0.0.1:3005/api/v1/user/login', { email, password })
            console.log('RESPONSE -', response)
            const token = await response.data.body.token
            const bearerToken = `Bearer${token}`
            console.log('TOKEN -', bearerToken)
            // TODO: token lifetime
            dispatch(resolved(bearerToken, email, password))
            getUserProfile()
        } catch (error) {
            console.log('ERROR CONNECTING -', error)
            dispatch(rejected(error.message))
        }
    }
}

export async function getUserProfile(dispatch, getState) {
    const status = getState().user.status
    if (status === 'pending' || status === 'updating') {
        console.log('EXITING / Status -', status)
        return
    }
    console.log('FETCHING -', fetching)
    dispatch(fetching())
    try {
        const response = await axios.post('http://127.0.0.1:3005/api/v1/user/profile', {
            headers: {
                'Authorization': getState().user.token
            }
         })
        console.log('RESPONSE -', response)
        // dispatch(resolved())
    } catch (error) {
        console.log('ERROR CONNECTING -', error)
        dispatch(rejected(error.message))
    }

}


const { actions, reducer } = createSlice({
    // slice name
    name: 'user',
    // initial state
    initialState,
    // reducer & actions
    reducers: {
        init: (draft) => {
            console.log('INITIALIZING STATE')
            draft = initialState
            return
        }
        ,
        fetching: (draft) => {
            // console.log('fetching')
            draft.token = null
            draft.error = null
            if (draft.status === 'resolved') {
                draft.status = 'updating'
                return
            } else {
                draft.status = 'pending'
                return
            }
        },
        resolved: {
            prepare: (bearerToken, email, password) => ({
                payload: { bearerToken, email, password }
            }),
            reducer: (draft, action) => {
                // console.log('resolve')
                if (draft.status === 'pending' || draft.status === 'updating') {
                    draft.status = 'connected'
                    draft.token = action.payload.bearerToken
                    draft.infos.email = action.payload.email
                    draft.infos.password = action.payload.password
                    localStorage.setItem('ARGENTBANK_Token', action.payload.bearerToken)
                    return
                }
                return
            }
        },
        rejected: {
            prepare: (error) => ({
                payload: { error }
            }),
            reducer: (draft, action) => {
                // console.log('reject')
                if (draft.status === 'pending' || draft.status === 'updating') {
                    draft.status = 'rejected'
                    draft.error = action.payload.error
                    return
                }
                return
            }
        }
    }
})

const { init, fetching, resolved, rejected } = actions
export default reducer