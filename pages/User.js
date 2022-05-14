import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  getUserProfile,
  initProfile,
  updateUserProfile,
  getUserTransactions
} from 'store/slices/userIdSlice'
import { userInfosSelector } from 'store/selectors'
import { useRouter } from 'next/router'
import useStorage from 'hooks/useStorage'
import Layout from 'components/Layout'
import style from 'styles/components/user.module.scss'
import mainStyle from 'styles/components/index.module.scss'

/**
 * It displays user Page & takes the profile form data, and updates the user's profile
 * @returns A React component
 */
const User = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { userId } = router.query
  // const token = useSelector(state => userInfosSelector(token))
  // const id = JSON.parse(localStorage.getItem('ARGENTBANK_userInfos')).id
  let { firstName, lastName, email, createdAt, token } = useSelector(state => userInfosSelector(state))
  const profileForm = useRef(null)


  // Check token to grant access or throw to /signin page
  // useEffect(() => {
  //   if (!token) {
  //     dispatch(initProfile())
  //     router.replace('/Signin')
  //   }
  //   else {
  //     try {
  //       dispatch(getUserProfile(token))
  //     } catch (error) {
  //       console.log('ERROR GETTING USER DATA -', error)
  //       dispatch(initProfile())
  //       router.replace('/Signin')
  //     }
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [token])

  // Secure userId route
  // useEffect(() => {
  //   // console.log('PARAMID-', userId, 'ID-', id);
  //   if (userId !== id) {
  //     dispatch(initProfile())
  //     router.replace('/Signin')
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [id])

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
    dispatch(updateUserProfile(token, values))
  }

  function closeProfileForm() {
    profileForm.current.style.top = '-100%'
    profileForm.current.style.opacity = '0'
  }

  function showProfileForm() {
    profileForm.current.style.top = '0'
    profileForm.current.style.opacity = '1'
  }

  function consultAccount(e) {
    dispatch(getUserTransactions(token))
    router.push(`transactions`)
  }

  return (
    <Layout>
      <main className={`${mainStyle.main} ${mainStyle.bgDark}`}>
        <div className={style.header}>
          <h1>Welcome back<br />{firstName}</h1>
          <button className={style.editButton} onClick={showProfileForm}>Edit Name</button>
        </div>
        <h2 className={style.srOnly}>Accounts</h2>
        <section className={style.account}>
          <div className={style.accountContentWrapper}>
            <h3 className={style.accountTitle}>Argent Bank Checking (x8349)</h3>
            <p className={style.accountAmount}>$2,082.79</p>
            <p className={style.accountAmountDescription}>Available Balance</p>
          </div>
          <div className={`${style.accountContentWrapper} ${style.cta}`}>
            <button className={style.transactionButton} onClick={e => consultAccount(e)}>View transactions</button>
          </div>
        </section>
        <section className={style.account}>
          <div className={style.accountContentWrapper}>
            <h3 className={style.accountTitle}>Argent Bank Savings (x6712)</h3>
            <p className={style.accountAmount}>$10,928.42</p>
            <p className={style.accountAmountDescription}>Available Balance</p>
          </div>
          <div className={`${style.accountContentWrapper} ${style.cta}`}>
            <button className={style.transactionButton}>View transactions</button>
          </div>
        </section>
        <section className={style.account}>
          <div className={style.accountContentWrapper}>
            <h3 className={style.accountTitle}>Argent Bank Credit Card (x8349)</h3>
            <p className={style.accountAmount}>$184.30</p>
            <p className={style.accountAmountDescription}>Current Balance</p>
          </div>
          <div className={`${style.accountContentWrapper} ${style.cta}`}>
            <button className={style.transactionButton}>View transactions</button>
          </div>
        </section>
        <section className={style.profile} ref={profileForm}>
          <button className={style.profileFormCloseBtn} onClick={closeProfileForm}>X</button>
          <h1>Your personnal informations</h1>
          <p><em>( Account created at {createdAt} )</em></p>
          <h2>{email}</h2>
          <form className={style.profileForm} onSubmit={e => updateProfile(e)}>
            <div className={`${mainStyle.inputWrapper} ${style.profileWrapper}`}>
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
              <input className={style.profileFormSaveBtn} type='submit' value='Save' />
            </div>
          </form>
        </section>
      </main>
    </Layout>
  )
}

export default User