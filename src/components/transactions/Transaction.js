import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { transactionsSelector, transactionDetailSelector } from "../../utils/selectors"
import { getTransactionDetails } from "../../utils/slices/userIdSlice"


const Transaction = ({ data, token }) => {
    console.log('TRANSACTION IMPORTED')
    const dispatch = useDispatch()
    const { id, date, description, amount, balance } = data
    const {type, category, notes} = useSelector(state => transactionsSelector(state))

    useEffect(() => {

    })

    function displayDetails() {
        console.log('Display DETAILS')
        dispatch(getTransactionDetails(token, id))
    }

    function changeType(e) {
        console.log('CHANGE TYPE -', type, e.target.value)
    }

    return (
        <section className="account">
            <div className="account-content-wrapper">
                <h3 className="transaction account-title">{description} ({id})</h3>
                <div className='amounts'>
                    <div className='amount'>
                        <p className="transaction account-amount">${amount}</p>
                        <p className="transaction account-amount-description">Amount</p>
                    </div>
                    <div className='balance'>
                        <p className="transaction account-amount">${balance}</p>
                        <p className="transaction account-amount-description">Available Balance</p>
                    </div>
                </div>
            </div>
            <div className='details'>
                <div><span>Type - </span>
                    <form>
                        <select name={type} onChange={e => changeType(e)}>
                            <option value='Electronic'>Electronic</option>
                            <option value='Services'>Services</option>
                            <option value='Representation'>Representation</option>
                            <option value='Furnitures'>Furnitures</option>
                            <option value='Other'>Other</option>
                        </select>
                    </form>
                </div>
                <div><span>Category - </span>Electronic</div>
                <div><span>Notes - </span>Electronic</div>

            </div>
            <div className="transaction account-content-wrapper cta">
                <p className="transaction account-amount-description">{date}</p>
                <button className="transaction-button" onClick={displayDetails}>View Details</button>
            </div>
        </section>
    )
}

export default Transaction