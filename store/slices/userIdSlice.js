import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { rememberMeSelector, statusSelector } from '../selectors'


// User initial state
export const initialState = {
    status: 'void',
    // rememberMe: localStorage.getItem('ARGENTBANK_rememberMe') === 'true' || false,
    rememberMe: false,
    error: null,
    infos: {
        firstName: null,
        lastName: null,
        id: null,
        email: null,
        createdAt: null,
        token: null
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
export function signinUser(user, rememberMe) {
    return async (dispatch, getState) => {
        if (!rememberMe) {
            rememberMe = rememberMeSelector(getState())
        }
        dispatch(fetching())
        try {
            console.log('USER -', user);
            dispatch(resolvedUser(user, rememberMe))
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
        if (userInfosStorage && JSON.parse(userInfosStorage).firstName !== undefined) {
            const data = JSON.parse(userInfosStorage)
            dispatch(resolvedUser(token, rememberMe, data))
            return
        }
        try {
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
    // console.log('FETCHING TRANSACTIONS')
    return async (dispatch) => {
        dispatch(fetchingTransactions())
        try {
            const response = await axios.get(
                'http://127.0.0.1:3001/api/v1/user/transaction',
                {
                    headers: { Authorization: token }
                })
            const data = response.data.body
            dispatch(resolvedTransactions(data))
        } catch (error) {
            console.log('ERROR fetching transactions -', error)
            dispatch(rejectedTransactions(error))
        }
    }
}


/**
 * Manage FETCHING user transaction {ID} details
 * It returns a thunk that dispatches a fetching action, then makes an API call, then dispatches a
 * resolved or rejected action based on the result of the API call
 * @param {string} token - The token to access the API
 * @param {string} id - The transaction ID
 * @returns A thunk
 */
export function getTransactionDetails(token, id) {
    // console.log(`FETCHING TRANSACTION n°${id}`)
    return async (dispatch) => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:3001/api/v1/user/transaction/${id}`,
                {},
                {
                    headers: { Authorization: token }
                })
            const details = response.data.body
            dispatch(resolvedTransactionDetails(details, id))
        } catch (error) {
            console.log('ERROR fetching transactions -', error)
            dispatch(rejectedTransactionDetails(error))
        }
    }
}


/**
 * Manage DELETING user transaction {ID} details
 * It returns a thunk that dispatches an update action, then makes an API call, then dispatches a
 * resolved or rejected action based on the result of the API call
 * @param {string} token - The token to access the API
 * @param {string} id - The transaction ID
 * @returns A thunk
 */
export function deleteTransactionDetails(token, id) {
    // console.log(`UPDATING TRANSACTION n°${id}`)
    return async (dispatch) => {
        try {
            const response = await axios.delete(
                `http://127.0.0.1:3001/api/v1/user/transaction/${id}`,
                {
                    headers: { Authorization: token }
                })
            const transactions = response.data.body.transactions
            dispatch(resolvedDeleteTransaction(transactions, id))
        } catch (error) {
            console.log('ERROR fetching transactions -', error)
            dispatch(rejectedTransactionDetails(error))
        }
    }
}


/**
 * Manage UPDATING user transaction {ID} details
 * It returns a thunk that dispatches an update action, then makes an API call, then dispatches a
 * resolved or rejected action based on the result of the API call
 * @param {string} token - The token to access the API
 * @param {string} id - The transaction ID
 * @param {object} newData - The full details data to change
 * @returns A thunk
 */
export function updateTransactionDetails(token, id, newData) {
    // console.log(`UPDATING TRANSACTION n°${id}`)
    return async (dispatch) => {
        try {
            const response = await axios.put(
                `http://127.0.0.1:3001/api/v1/user/transaction/${id}`,
                { data: newData },
                {
                    headers: { Authorization: token }
                })
            const transactions = response.data.body
            dispatch(resolvedUpdateDetails(transactions, id))
        } catch (error) {
            console.log('ERROR fetching transactions -', error)
            dispatch(rejectedTransactionDetails(error))
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
            // console.log(('INITIALISATION'));
            draft.status = 'void'
            draft.infos = initialState.infos
            draft.transactions = initialState.transactions
            // Remove token from sessionStorage on logout
            // Token should be managed by a cookie with 'HTMLOnly' parameter served from API
            // sessionStorage.removeItem('ARGENTBANK_token')
            // const oldStorage = JSON.parse(localStorage.getItem('ARGENTBANK_userInfos'))
            // localStorage.setItem('ARGENTBANK_userInfos', JSON.stringify({ email: oldStorage.email }))
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
            prepare: (user, rememberMe = false) => ({
                payload: { user, rememberMe }
            }),
            reducer: (draft, action) => {
                console.log('RESOLVED User -', action.payload.user);
                if (draft.status === 'pending' || draft.status === 'updating') {
                    draft.status = 'connected'
                    draft.rememberMe = action.payload.rememberMe
                    draft.infos.email = action.payload.user.email
                    draft.infos.id = action.payload.user.id
                    draft.infos.firstName = action.payload.user.firstName
                    draft.infos.lastName = action.payload.user.lastName
                    draft.infos.createdAt = action.payload.user.createdAt
                    draft.infos.token = action.payload.user.token
                    localStorage.setItem('ARGENTBANK_rememberMe', action.payload.rememberMe)
                    // useStorage('localStorage', 'ARGENTBANK_rememberMe', action.payload.rememberMe)
                    // Add token to sessionStorage on signin
                    // Token should be managed by a cookie with 'HTMLOnly' parameter served from API
                    // sessionStorage.setItem('ARGENTBANK_token', action.payload.bearerToken)
                    // useStorage('sessionStorage', 'ARGENTBANK_token', action.payload.res.token)
                    // if (draft.infos.firstName !== null) {
                    //     useStorage('localStorage', 'ARGENTBANK_userInfos', JSON.stringify(draft.infos))
                // }
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
    },
    fetchingTransactions: (draft) => {
        draft.error = null
        if (draft.transactions.status === 'resolved') {
            draft.transactions.status = 'updating'
            return
        } else {
            draft.transactions.status = 'pending'
            return
        }
    },
    resolvedTransactions: {
        prepare: (data) => ({
            payload: { data }
        }),
        reducer: (draft, action) => {
            // console.log('RESOLVED Transactions -', action.payload);
            draft.transactions.status = 'resolved'
            draft.transactions.data = action.payload.data
            draft.transactions.data.forEach(transaction =>
                transaction.details = [
                    'TS0000-0000',
                    {
                        type: null,
                        category: null,
                        notes: ''
                    }
                ]
            )
            return
        }
    },
    rejectedTransactions: {
        prepare: (error) => ({
            payload: { error }
        }),
        reducer: (draft, action) => {
            if (draft.transactions.status === 'pending' || draft.transactions.status === 'updating') {
                draft.transactions.status = 'rejected'
                draft.transactions.error = action.payload.error
                return
            }
            return
        }
    },
    resolvedTransactionDetails: {
        prepare: (details, id) => ({
            payload: { details, id }
        }),

        reducer: (draft, action) => {
            let transactionIndex;
            draft.transactions.data.forEach((transaction, i) => {
                // console.log('COMPARE -', transaction.id, action.payload.id);
                if (transaction.id === action.payload.id) {
                    transactionIndex = i
                }
            })
            // console.log('PAYLOAD -', transactionIndex,action.payload.id, action.payload.details);
            draft.transactions.data[transactionIndex].details = action.payload.details
            return
        }
    },
    resolvedDeleteTransaction: {
        prepare: (transactions, id) => ({
            payload: { transactions, id }
        }),
        reducer: (draft, action) => {
            const id = action.payload.id
            draft.transactions.data = action.payload.transactions
            console.log(`Transaction ${id}'s details successfully deleted!`)
            return
        }
    }
    ,
    resolvedUpdateDetails: {
        prepare: (transactions, id) => ({
            payload: { transactions, id }
        }),
        reducer: (draft, action) => {
            let transactionIndex;
            draft.transactions.data.forEach((transaction, i) => {
                if (transaction.id === action.payload.id) {
                    transactionIndex = i
                }
            })

            draft.transactions.data[transactionIndex].details = action.payload.transactions[transactionIndex].details
            return
        }
    }
    ,
    rejectedTransactionDetails: {
        prepare: (error) => ({
            payload: { error }
        }),
        reducer: (draft, action) => {
            console.log('REJECTED Transaction Details -', action.payload)
            return
        }
    }
}
})

// Actions & Reducer from CreateSlice()
export const {
    init,
    remember,
    fetching,
    fetchingTransactions,
    resolvedUser,
    resolvedCreationUser,
    resolvedTransactions,
    resolvedDeleteTransaction,
    rejected,
    rejectedTransactions,
    resolvedUpdateDetails,
    resolvedTransactionDetails,
    rejectedTransactionDetails,
} = actions

export default reducer
