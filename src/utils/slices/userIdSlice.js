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
    },
    transactions: {
        status: 'void',
        data: null,
        error: null
    }
}

/* ---- Functions & Middleware Thunks to dispatch actions in user reducer ---- */
/* --------------------------------------------------------------------------- */

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


/* --------------- PROFILE ---------------- */

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
export function signinUser(email, password, rememberMe) {
    return async (dispatch, getState) => {
        if (!rememberMe) {
            rememberMe = rememberMeSelector(getState())
        }
        dispatch(fetching())
        try {
            const response = await axios.post('http://127.0.0.1:3001/api/v1/user/login', { email, password })
            const token = await response.data.body.token
            const bearerToken = `Bearer ${token}`
            dispatch(resolvedUser(bearerToken, rememberMe))
        } catch (error) {
            console.log('ERROR CONNECTING -', error)
            alert('User unknown\n Please try again...')
            dispatch(rejected(error.message))
        }
    }
}

/**
 * Manage CREATING new user profile
 * It returns a thunk that dispatches a fetching action, then makes an API call, then dispatches a
 * resolved or rejected action based on the result of the API call
 * @param {string} fName - Firstname
 * @param {string} lName - Lastname
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns A thunk
 */
export function createUser(fName, lName, email, password) {
    return async (dispatch, getState) => {
        const status = statusSelector(getState())
        if (status === 'connected') {
            alert('Please disconnect to create new Account')
            return
        }
        dispatch(fetching())
        try {
            const response = await axios.post('http://127.0.0.1:3001/api/v1/user/signup', {
                email: email,
                password: password,
                firstName: fName,
                lastName: lName
            })
            dispatch(resolvedCreationUser(response.data.body))
        } catch (error) {
            console.log('ERROR CREATING ACCOUNT -', error)
            alert('Unable to create new account. \nPlease retry later...')
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
        const userInfosStorage = localStorage.getItem('ARGENTBANK_userInfos')
        const rememberMe = rememberMeSelector(getState())
        const status = statusSelector(getState())
        if (status !== 'connected' && status !== 'void') {
            console.log('EXITING / Status -', status)
            return
        }
        dispatch(fetching())
        console.log(userInfosStorage)
        if (userInfosStorage && JSON.parse(userInfosStorage).firstName) {
            const data = JSON.parse(userInfosStorage)
            console.log('DATA -', data)
            dispatch(resolvedUser(token, rememberMe, data))
            return
        }
        try {
            // const token = tokenSelector(getState())
            const response = await axios.post(
                'http://127.0.0.1:3001/api/v1/user/profile',
                { request: "getUserProfile" },
                {
                    headers: { Authorization: token }
                })
            const data = await response.data.body
            dispatch(resolvedUser(token, rememberMe, data))
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
            dispatch(resolvedUser(token, rememberMe, data))
        } catch (error) {
            console.log('ERROR CONNECTING -', error)
            dispatch(rejected(error.message))
        }
    }
}


/* --------------- TRANSACTIONS ---------------- */

/**
 * Manage FETCHING user transactions
 * It returns a thunk that dispatches a fetching action, then makes an API call, then dispatches a
 * resolved or rejected action based on the result of the API call
 * @param {string} token - The token to access the API
 * @returns A thunk
 */
export function getUserTransactions(token) {
    console.log('FETCHING TRANSACTIONS')
    return async (dispatch, getState) => {
        dispatch(fetching())
        try {
            const response = await axios.post(
                'http://127.0.0.1:3001/api/v1/user/transaction',
                {},
                {
                    headers: { Authorization: token }
                })
            console.log('TRANSACTIONS -', response.data.body)
            const data = response.data.body.map(transaction =>
                ({ id: transaction.id,
                    date: transaction.date,
                    description: transaction.description,
                    amount: transaction.amount,
                    balance: transaction.balance }))
            dispatch(resolvedTransactions(data))
        } catch (error) {
            console.log('ERROR fetching transactions -', error)
            dispatch(rejected(error))
        }
    }
}



/**
 * REDUCER and ACTIONS build with Redux Toolkit createSlice()
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
            console.log(('INITIALISATION'));
            draft.status = 'void'
            draft.infos = initialState.infos
            draft.transactions = initialState.transactions
            // Remove token from sessionStorage on logout
            // Token should be managed by a cookie with 'HTMLOnly' parameter served from API
            sessionStorage.removeItem('ARGENTBANK_token')
            const oldStorage = JSON.parse(localStorage.getItem('ARGENTBANK_userInfos'))
            localStorage.setItem('ARGENTBANK_userInfos', JSON.stringify({email: oldStorage.email}))
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
        resolvedUser: {
            prepare: (bearerToken, rememberMe = false, data = initialState.infos) => ({
                payload: { bearerToken, rememberMe, data }
            }),
            reducer: (draft, action) => {
                console.log('EMAIL -', action.payload);
                if (draft.status === 'pending' || draft.status === 'updating') {
                    draft.status = 'connected'
                    draft.rememberMe = action.payload.rememberMe
                    draft.infos.email = action.payload.data.email
                    draft.infos.id = action.payload.data.id
                    draft.infos.firstName = action.payload.data.firstName
                    draft.infos.lastName = action.payload.data.lastName
                    localStorage.setItem('ARGENTBANK_rememberMe', action.payload.rememberMe)
                    // Add token to sessionStorage on signin
                    // Token should be managed by a cookie with 'HTMLOnly' parameter served from API
                    sessionStorage.setItem('ARGENTBANK_token', action.payload.bearerToken)
                    if (draft.infos.firstName !== null) {
                        localStorage.setItem('ARGENTBANK_userInfos', JSON.stringify(draft.infos))
                    }
                    return
                }
                return
            }
        },
        resolvedCreationUser: (draft, action) => {
            draft.status = 'void'
            console.log(`New user created \nID: ${action.payload._id} \nEMAIL: ${action.payload.email}`);
            alert('User account successfully created!')
            return
        },
        resolvedTransactions: {
            prepare: (data) => ({
                payload: { data }
            }),
            reducer: (draft, action) => {
                draft.status = 'connected'
                draft.transactions.data = action.payload.data
                return
            }
        }
        ,
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
const {
    init,
    remember,
    fetching,
    resolvedUser,
    resolvedCreationUser,
    resolvedTransactions,
    rejected
} = actions
export default reducer
