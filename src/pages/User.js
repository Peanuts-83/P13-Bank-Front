import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserProfile, initProfile, updateUserProfile } from '../utils/slices/userIdSlice'
import { userInfosSelector } from '../utils/selectors'
import { useNavigate } from 'react-router-dom'

/**
 * It displays user Page & takes the profile form data, and updates the user's profile
 * @returns A React component
 */
const User = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = sessionStorage.ARGENTBANK_token
  let { firstName, lastName, email, createdAt } = useSelector(state => userInfosSelector(state))
  const profileForm = document.querySelector('.profile')

  // Check token to grant access or throw to /signin page
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

  /**
   * It takes the form data, and updates the user's profile
   * @param e - the event object
   * @callback updateUserProfile - Dispatch new profile
   */
  function updateProfile(e) {
    e.preventDefault()
    closeProfileForm()
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
    setTimeout(() => dispatch(updateUserProfile(token, values)), 500)
  }

  function closeProfileForm() {
    profileForm.style.top = '-100%'
    profileForm.style.opacity = '0'
  }

  function showProfileForm() {
    profileForm.style.top = '0'
    profileForm.style.opacity = '1'
  }

  return (
    <main className="main bg-dark">
      <div className="header">
        <h1>Welcome back<br />{firstName}</h1>
        <button className="edit-button" onClick={showProfileForm}>Edit Name</button>
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
        <button className='profile-form-close-btn' onClick={closeProfileForm}>X</button>
        <h1>Your personnal informations</h1>
        <p><em>( Account created at {createdAt} )</em></p>
        <h2>{email}</h2>
        <form className='profile-form' onSubmit={e => updateProfile(e)}>
          <div className="input-wrapper profile-wrapper">
            <label htmlFor="firstName">Fist Name</label>
            <input
              type="text"
              id="firstName"
              placeholder={firstName}
            /><br />
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              placeholder={lastName}
            /><br />
            <input className='profile-form-save-btn' type='submit' value='Save' />
          </div>
        </form>
      </section>
    </main>
  )
}

export default User