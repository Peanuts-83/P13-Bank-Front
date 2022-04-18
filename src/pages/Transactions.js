import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    getUserProfile,
    initProfile,
    updateUserProfile,
    getUserTransactions
} from '../utils/slices/userIdSlice'
import { transactionsSelector } from '../utils/selectors'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Transaction from '../components/transactions/Transaction'

const Transactions = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userId } = useParams()
    const token = sessionStorage.ARGENTBANK_token
    const id = JSON.parse(localStorage.getItem('ARGENTBANK_userInfos')).id
    const transactions = useSelector(state => transactionsSelector(state))
    const [isLoading, setLoading] = useState(true)

    // Check token to grant access or throw to /signin page
    useEffect(() => {
        if (!token) {
            dispatch(initProfile())
            navigate('/signin')
        }
        else {
            try {
                dispatch(getUserProfile(token))
                dispatch(getUserTransactions(token))
            } catch (error) {
                console.log('ERROR GETTING USER/TRANSACTIONS DATA -', error)
                dispatch(initProfile())
                navigate('/signin')
            }
        }
    }, [token])


    // Secure userId route
    useEffect(() => {
        console.log('PARAMID-', userId, 'ID-', id);
        console.log('TRANSACTIONS -', transactions)
        if (userId !== id) {
            dispatch(initProfile())
            navigate('/signin')
        }
    }, [id])

    // Wait for data to be fetched
    useEffect(() => {
        if (transactions.status === 'resolved') {
            setLoading(false)
        }
    }, [transactions])


    return (
        <main className="main bg-dark">
            <div className="header transactions-header">
                <div className='back'>
                    <Link to={`/user/${userId}`}><FontAwesomeIcon className='fa fa-sign-out' icon="arrow-left" /> Back </Link>
                </div>
                <h3>Argent Bank Checking (x8349)</h3>
                <h1>$2,082.79</h1>
            </div>
            <h2 className="sr-only">Transactions</h2>
            {!isLoading && transactions.data.map((transaction, i) => (
                <Transaction data={transaction} token={token} key={`transaction-${i}`} />
            ))}
        </main>
    )
}

export default Transactions