import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { statusSelector, tokenSelector } from '../selectors'

const initialState = {
    status: 'void',
    token: null,
    error: null,
    infos: {
    }
}

export async function initProfil() {
    return async (dispatch, getState) => {
        const status = statusSelector(getState())
        alert('STATUS initProfil', status)
        if (status === 'connected') {
            console.log('DISCONNECTING - Empty User Credentials')
            // TODO: empty localhost token
            dispatch(init())
        }
        return
    }
}

export function loginUser(email, password) {
    console.log('START LoginUser', email, password)
    // return a thunk
    return async (dispatch, getState) => {
        console.log('From async LoginUser')
        const status = statusSelector(getState())
        // console.log('STATUS loginUser', status)
        if (status === 'pending' || status === 'updating') {
            console.log('EXITING / Status -', status)
            return
        }
        dispatch(fetching())
        try {
            const response = await axios.post('http://127.0.0.1:3001/api/v1/user/login', { email, password })
            // console.log('RESPONSE -', response)
            const token = await response.data.body.token
            const bearerToken = `Bearer ${token}`
            console.log('TOKEN -', bearerToken)
            // TODO: token lifetime
            dispatch(resolved(bearerToken))
        } catch (error) {
            console.log('ERROR CONNECTING -', error)
            dispatch(rejected(error.message))
        }
    }
}

export function getUserProfile(token) {
    console.log('START getUserProfile', token)
    return async (dispatch, getState) => {
        console.log('From async THUNK')
        const status = statusSelector(getState())
        console.log('STATUS getUserProfile', status)
        if (status !== 'connected') {
            console.log('EXITING / Status -', status)
            return
        }
        console.log('FETCHING -', fetching)
        dispatch(fetching())
        try {
            // const token = tokenSelector(getState())
            const response = await axios.post(
                'http://127.0.0.1:3001/api/v1/user/profile',
                { request: "getUserProfile" },
                {
                    headers: {
                        Authorization: token
                    }
                })
            console.log('RESPONSE -', response)
            const data = await response.data.body
            console.log('DATA -', data)
            dispatch(resolved(token, data))
        } catch (error) {
            console.log('ERROR CONNECTING -', error)
            dispatch(rejected(error.message))
        }
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
            prepare: (bearerToken, data) => ({
                payload: { bearerToken, data }
            }),
            reducer: (draft, action) => {
                console.log('resolve -', action.payload)
                if (draft.status === 'pending' || draft.status === 'updating') {
                    draft.status = 'connected'
                    draft.token = action.payload.bearerToken
                    draft.infos = action.payload.data
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