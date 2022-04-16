import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserProfile, initProfile } from '../utils/slices/userIdSlice'
import { statusSelector, userInfosSelector } from '../utils/selectors'
import { useNavigate } from 'react-router-dom'

const User = () => {
  // TODO: check token in sessionstorage
  // TODO: if not redux, getUserProfile with localstorage token
  // TODO: if !connected navigate ('/)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = sessionStorage.ARGENTBANK_token
  const { firstName } = useSelector(state => userInfosSelector(state))
  const status = useSelector(state => statusSelector(state))

  useEffect(() => {
    if(!token) {
      dispatch(initProfile())
      navigate('/login')
    } else {
      try{
        dispatch(getUserProfile(token))
      } catch(error) {
        console.log('ERROR GETTING USER DATA -', error)
        dispatch(initProfile())
        navigate('/login')
      }
    }
  }, [dispatch, navigate, token])

  return (
    <main className="main bg-dark">
      <div className="header">
        <h1>Welcome back<br />{firstName}</h1>
        <button className="edit-button">Edit Name</button>
      </div>
      <h2 className="sr-only">Accounts</h2>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Checking (x8349)</h3>
          <p className="account-amount">$2,082.79</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Savings (x6712)</h3>
          <p className="account-amount">$10,928.42</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
          <p className="account-amount">$184.30</p>
          <p className="account-amount-description">Current Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
    </main>
  )
}

export default User