import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { rememberMeSelector, statusSelector  } from '../selectors'


const initialState = {
    status: 'void',
    rememberMe: localStorage.getItem('ARGENTBANK_rememberMe') === 'true' || false,
    error: null,
    infos: {
        firstName: null,
        lastName: null,
        id: null,
        email: null,
    }
}

export function setRememberMe(value) {
    return (dispatch) => {
        dispatch(remember(value))
        localStorage.setItem('ARGENTBANK_rememberMe', value)
    }
}

export function initProfile() {
    console.log('INITIALIZATION')
    return async (dispatch, getState) => {
        const status = statusSelector(getState())
        console.log('STATUS -', status)
        if (status === 'connected') {
            console.log('DISCONNECTING - Empty User Credentials')
            // TODO: empty localhost token
            dispatch(init())
        } else {
            console.log('NOthing to INIT - status', status)
        }
        return
    }
}

export function loginUser(email, password, rememberMe) {
    console.log('START LoginUser', email, password)
    // return a thunk
    return async (dispatch, getState) => {
        if (!rememberMe) {
            rememberMe = rememberMeSelector(getState())
        }
        console.log('START LoginUser')
        const status = statusSelector(getState())
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
            dispatch(resolved(bearerToken, rememberMe))
        } catch (error) {
            console.log('ERROR CONNECTING -', error)
            dispatch(rejected(error.message))
        }
    }
}

export function getUserProfile(token) {
    console.log('START getUserProfile', token)
    return async (dispatch, getState) => {
        const rememberMe = rememberMeSelector(getState())
        const status = statusSelector(getState())
        if (status !== 'connected' && status !== 'void') {
            console.log('EXITING / Status -', status)
            return
        }
        dispatch(fetching())
        try {
            // const token = tokenSelector(getState())
            const response = await axios.post(
                'http://127.0.0.1:3001/api/v1/user/profile',
                { request: "getUserProfile" },
                {
                    headers: { Authorization: token }
                })
            let data = await response.data.body
            dispatch(resolved(token, rememberMe, data))
        } catch (error) {
            console.log('ERROR CONNECTING -', error)
            dispatch(rejected(error.message))
        }
    }
}

export function updateUserProfile(token, values) {
    console.log('START updateUserProfile', values)
    return async (dispatch, getState) => {
        const rememberMe = rememberMeSelector(getState())
        const status = statusSelector(getState())
        if (status !== 'connected' && status !== 'void') {
            console.log('EXITING / Status -', status)
            return
        }
        dispatch(fetching())
        try {
            const response = await axios.put(
                'http://127.0.0.1:3001/api/v1/user/profile',
                {
                    firstName: values.firstName,
                    lastName: values.lastName,
                },
                {
                    headers: { Authorization: token }
                })
            const data = response.data.body
            console.log('UPDATE Data -', data)
            dispatch(resolved(token, rememberMe, data))
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
            console.log('INIT action');
            draft.status = 'void'
            draft.infos = initialState.infos
            sessionStorage.removeItem('ARGENTBANK_token')
            return
        },
        remember: (draft, action) => { draft.rememberMe = action.payload }
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
            prepare: (bearerToken, rememberMe = false, data = initialState.infos) => ({
                payload: { bearerToken, rememberMe, data }
            }),
            reducer: (draft, action) => {
                console.log('resolve -', action.payload)
                if (draft.status === 'pending' || draft.status === 'updating') {
                    draft.status = 'connected'
                    draft.rememberMe = action.payload.rememberMe
                    draft.infos = action.payload.data
                    localStorage.setItem('ARGENTBANK_rememberMe', action.payload.rememberMe)
                    sessionStorage.setItem('ARGENTBANK_token', action.payload.bearerToken)
                    if (draft.infos.firstName !== null) {
                        localStorage.setItem('ARGENTBANK_userInfos', JSON.stringify(action.payload.data))
                    }
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

const { init, remember, fetching, resolved, rejected } = actions
export default reducer
