import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  getUserProfile,
  initProfile,
  updateUserProfile,
  getUserTransactions
} from '../utils/slices/userIdSlice'
import { userInfosSelector } from '../utils/selectors'
import { useNavigate, useParams } from 'react-router-dom'

const Transactions = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {userId} = useParams()
    const token = sessionStorage.ARGENTBANK_token
    const id = JSON.parse(localStorage.getItem('ARGENTBANK_userInfos')).id
    let { firstName, lastName, email, createdAt } = useSelector(state => userInfosSelector(state))
    const profileForm = useRef(null)

    // Check token to grant access or throw to /signin page
    useEffect(() => {
      if (!token) {
        dispatch(initProfile())
        navigate('/signin')
      }
      else {
        try {
          dispatch(getUserProfile(token))
        } catch (error) {
          console.log('ERROR GETTING USER DATA -', error)
          dispatch(initProfile())
          navigate('/signin')
        }
      }
    }, [token])

    // Secure userId route
    useEffect(() => {
      console.log('PARAMID-', userId, 'ID-', id);
      if (userId !== id) {
        dispatch(initProfile())
        navigate('/signin')
      }
    }, [id])



    return (
        <main className="main bg-dark">
            <div className="header">
                <h1>Welcome back<br /></h1>
                <button className="edit-button" >Edit Name</button>
            </div>
            <h2 className="sr-only">Accounts</h2>
            <section className="account">
                <div className="account-content-wrapper">
                    <h3 className="account-title">Argent Bank Checking (x8349)</h3>
                    <p className="account-amount">$2,082.79</p>
                    <p className="account-amount-description">Available Balance</p>
                </div>
                <div className="account-content-wrapper cta">
                    <button className="transaction-button" >View transactions</button>
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

export default Transactions