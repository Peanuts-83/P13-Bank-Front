import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserProfile, initProfile, updateUserProfile } from '../utils/slices/userIdSlice'
import { statusSelector, userInfosSelector } from '../utils/selectors'
import { useNavigate } from 'react-router-dom'

const User = () => {
  // TODO: check token in sessionstorage
  // TODO: if not redux, getUserProfile with localstorage token
  // TODO: if !connected navigate ('/)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = sessionStorage.ARGENTBANK_token
  let { firstName, lastName, email, createdAt } = useSelector(state => userInfosSelector(state))

  useEffect(() => {
    if (!token) {
      dispatch(initProfile())
      navigate('/login')
    } else {
      try {
        dispatch(getUserProfile(token))
      } catch (error) {
        console.log('ERROR GETTING USER DATA -', error)
        dispatch(initProfile())
        navigate('/login')
      }
    }
  }, [dispatch, navigate, token])

  // function updateValue(target, value) {
  //   const values = {
  //     firstName: firstName,
  //     lastName: lastName,
  //     email: email
  //   }
  //   console.log('TARGET/VALUE -', target, value, values['firstName'], firstName)
  //   values[target] = value
  //   // firstName = value
  //   console.log(firstName, lastName)
  // }

  function updateProfile(e) {
    e.preventDefault()
    const values = {
      firstName: firstName,
      lastName: lastName,
      email: email
    }
    Object.values(e.target).forEach((obj, index) => {
      if (obj.value === undefined) {
        return
      }
      if (obj.value !== "") {
        values[Object.keys(values)[index]] = Object.values(e.target)[index].value
      }
    })
    console.log(values)
    setTimeout(() => dispatch(updateUserProfile(token, values)), 500)
  }

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
      <section className='profile'>
        <div className="account-content-wrapper">
          <h1>Your personnal informations:</h1>
          <p>Account created at {createdAt}</p>
          <form className='profile-form' onSubmit={e => updateProfile(e)}>
            <label htmlFor="firstName">Fist Name</label>
            <input
              type="text"
              id="firstName"
              placeholder={firstName}
              // onChange={e => updateValue('firstName', e.target.value)}
            />
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              placeholder={lastName}
              // onChange={e => updateValue('lastName', e.target.value)}
            />
            <label htmlFor="email">email</label>
            <input
              type="text"
              id="email"
              placeholder={email}
              // onChange={e => updateValue('email', e.target.value)}
            />
            <input className='profile-form-save-btn' type='submit' />
          </form>
        </div>

      </section>
    </main>
  )
}

export default User