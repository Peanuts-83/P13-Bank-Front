import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    getUserProfile,
    initProfile,
    getUserTransactions
} from '../store/slices/userIdSlice'
import { transactionsSelector } from '../store/selectors'
// import { useNavigate, useParams, Link } from 'react-router-dom'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Transaction from '../components/transactions/Transaction'
import Layout from 'components/Layout'

const Transactions = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const { userId } = router.query
    const token = sessionStorage.ARGENTBANK_token
    const id = JSON.parse(localStorage.getItem('ARGENTBANK_userInfos')).id
    const transactions = useSelector(state => transactionsSelector(state))
    const [isLoading, setLoading] = useState(true)

    // Check token to grant access or throw to /signin page
    useEffect(() => {
        if (!token) {
            dispatch(initProfile())
            router.replace('/signin')
        }
        else {
            try {
                dispatch(getUserProfile(token))
                dispatch(getUserTransactions(token))
            } catch (error) {
                console.log('ERROR GETTING USER/TRANSACTIONS DATA -', error)
                dispatch(initProfile())
                router.replace('/signin')
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])


    // Secure userId route
    useEffect(() => {
        // console.log('PARAMID-', userId, 'ID-', id);
        // console.log('TRANSACTIONS -', transactions)
        if (userId !== id) {
            dispatch(initProfile())
            router.replace('/signin')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    // Wait for data to be fetched
    useEffect(() => {
        if (transactions.status === 'resolved') {
            setLoading(false)
        }
    }, [transactions])


    return (
        <Layout>
            <main className="main bg-dark">
                <div className="header transactions-header">
                    <div className='back'>
                        <Link href={`/user/${userId}`}>
                            <a>
                                <FontAwesomeIcon className='fa fa-sign-out' icon="arrow-left" /> Back
                            </a>
                        </Link>
                    </div>
                    <h3>Argent Bank Checking (x8349)</h3>
                    <h1>$2,082.79</h1>
                </div>
                <h2 className="sr-only">Transactions</h2>
                {!isLoading && transactions.data.map((transaction, i) => (
                    <Transaction data={transaction} token={token} index={i} key={`transaction-${i}`} />
                ))}
            </main>
        </Layout>
    )
}

export default Transactions