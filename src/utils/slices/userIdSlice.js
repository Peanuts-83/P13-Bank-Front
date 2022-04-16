import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { rememberMeSelector, statusSelector } from '../selectors'

// User initial state
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

// Functions & Middleware Thunks to dispatch actions in user reducer

/**
 * Manage REMEMBERME value
 * It takes a value, dispatches an action to the store, and then saves the value to local storage for persistent information
 * @param {boolean} value - The value to be set.
 * @returns A function that takes a dispatch function as an argument.
 */
export function setRememberMe(value) {
    return (dispatch) => {
        dispatch(remember(value))
        localStorage.setItem('ARGENTBANK_rememberMe', value)
    }
}

/**
 * Manage LOGOUT user
 * Initiate state on logout, but keeps rememberMe state
 * @returns A thunk.
 */
export function initProfile() {
    return async (dispatch, getState) => {
        const status = statusSelector(getState())
        if (status === 'connected') {
            console.log('DISCONNECTING - Empty User Credentials')
            dispatch(init())
        }
        return
    }
}


/**
 * Manage LOGIN user
 * It returns a thunk that dispatches a fetching action, then makes an API call, then dispatches a
 * resolved or rejected action based on the result of the API call
 * @param {string} email - The email address of the user
 * @param {string} password - The password of the user
 * @param {boolean} rememberMe
 * @returns A thunk
 */
export function loginUser(email, password, rememberMe) {
    return async (dispatch, getState) => {
        if (!rememberMe) {
            rememberMe = rememberMeSelector(getState())
        }
        dispatch(fetching())
        try {
            const response = await axios.post('http://127.0.0.1:3001/api/v1/user/login', { email, password })
            const token = await response.data.body.token
            const bearerToken = `Bearer ${token}`
            dispatch(resolved(bearerToken, rememberMe))
        } catch (error) {
            console.log('ERROR CONNECTING -', error)
            alert('User unknown\n Please try again...')
            dispatch(rejected(error.message))
        }
    }
}


/**
 * Manage FETCHING user profile
 * It returns a thunk that dispatches a fetching action, then makes an API call, then dispatches a
 * resolved or rejected action based on the result of the API call
 * @param {string} token - The token to access the API
 * @returns A thunk
 */
export function getUserProfile(token) {
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


/**
 * Manage UPDATING user profile
 * It returns a thunk that dispatches a fetching action, then makes an API call, then dispatches a
 * resolved or rejected action based on the result of the API call
 * @param {string} token - The token to access the API
 * @param {object} values - LastName & FirstName to be updated on database
 * @returns A thunk
 */
export function updateUserProfile(token, values) {
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
            dispatch(resolved(token, rememberMe, data))
        } catch (error) {
            console.log('ERROR CONNECTING -', error)
            dispatch(rejected(error.message))
        }
    }
}

/**
 * Reducer and Actions with Redux Toolkit createSlice()
 * @param {string} name - Reducer's name
 * @param {object} initialState - Reducer's initial state
 * @param {object} reducers - Actions creator
 * @returns Actions & a Reducer
 */
const { actions, reducer } = createSlice({
    name: 'user',
    initialState,
    reducers: {
        init: (draft) => {
            draft.status = 'void'
            draft.infos = initialState.infos
            // Remove token from sessionStorage on logout
            // Token should be managed by a cookie with 'HTMLOnly' parameter served from API
            sessionStorage.removeItem('ARGENTBANK_token')
            return
        },
        remember: (draft, action) => { draft.rememberMe = action.payload }
        ,
        fetching: (draft) => {
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
                if (draft.status === 'pending' || draft.status === 'updating') {
                    draft.status = 'connected'
                    draft.rememberMe = action.payload.rememberMe
                    draft.infos = action.payload.data
                    localStorage.setItem('ARGENTBANK_rememberMe', action.payload.rememberMe)
                    // Add token to sessionStorage on login
                    // Token should be managed by a cookie with 'HTMLOnly' parameter served from API
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

// Actions & Reducer from CreateSlice()
const { init, remember, fetching, resolved, rejected } = actions
export default reducer
