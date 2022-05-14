import Link from 'next/link'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { createUser } from '../store/slices/userIdSlice'
import { useRouter } from 'next/router'
import style from '../styles/components/index.module.scss'
import Layout from '../components/Layout'

/**
 * Manage SIGNUP to create new user account
 * Component that displays the registration form
 * @returns A React component
 */
const Signup = () => {
    const dispatch = useDispatch()
    const [fName, setFname] = useState()
    const [lName, setLname] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const errorFname = useRef(null)
    const errorLname = useRef(null)
    const errorEmail = useRef(null)
    const errorPassword = useRef(null)
    const [formValidator, setFormValidator] = useState(false)
    const router = useRouter()

    /**
     * The function is called when the user clicks the submit button on the signup form. It prevents
     * the default action of the submit button, which is to refresh the page. It then checks to see if
     * the form is valid. If it is not, the function returns. If it is, the function calls the
     * createUser action creator, which creates a new user in the database. The function then navigates
     * the user to the signin page
     * @param e - the event object
     * @returns the dispatch function createUser & navigate to '/signin' page
     */
    function register(e) {
        e.preventDefault()
        if (!formValidator) {
            return
        }
        dispatch(createUser(fName, lName, email, password, true))
        router.push('/Signin')
    }

    /**
     * It takes in a type and a value, and then checks if the value is valid for that type. If it is,
     * it sets the state for that type to the value, and if it isn't, it sets the state for that type
     * to the value and sets the formValidator state to false
     * @param {string} type - The type of input field. 'email' || 'password' || 'fName' || 'lName'
     * @param {string} value - The value of the input field
     * @returns the value of the formValidator.
     */
    function validateForm(type, value) {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        switch (type) {
            case 'fName':
                setFname(value)
                if (value.length < 2) {
                    errorFname.current.className = `${style.errorMsg} ${style.errorShow}`
                    setFormValidator(false)
                    return
                } else {
                    errorFname.current.className = style.errorMsg
                }
                break
            case 'lName':
                setLname(value)
                if (value.length < 2) {
                    errorLname.current.className = `${style.errorMsg} ${style.errorShow}`
                    setFormValidator(false)
                    return
                } else {
                    errorLname.current.className = style.errorMsg
                }
                break
            case 'email':
                setEmail(value)
                if (!emailRegex.test(value)) {
                    errorEmail.current.className = `${style.errorMsg} ${style.errorShow}`
                    setFormValidator(false)
                    return
                } else {
                    errorEmail.current.className = style.errorMsg
                }
                break
            default:
                setPassword(value)
                if (value.length < 6) {
                    errorPassword.current.className = `${style.errorMsg} ${style.errorShow}`
                    setFormValidator(false)
                    return
                } else {
                    errorPassword.current.className = style.errorMsg
                }
                break
        }
        setFormValidator(true)
    }

    return (
        <Layout>
        <main className={`${style.main} ${style.bgDark}`}>
            <section className={style.signInContent}>
                <i className="fa fa-user-circle sign-in-icon"></i>
                <h1>Sign Up</h1>
                <form onSubmit={e => register(e)}>
                    <div className={style.inputWrapper}>
                        <label htmlFor="userFname">Firstname</label>
                        <input
                            type="text"
                            id="userFname"
                            onChange={e => validateForm('fName', e.target.value)}
                        />
                        <div className={style.errorMsg} ref={errorFname}>Firstname should be at least 2 letters long</div>
                    </div>
                    <div className={style.inputWrapper}>
                        <label htmlFor="userLname">Lastname</label>
                        <input
                            type="text"
                            id="userLname"
                            onChange={e => validateForm('lName', e.target.value)}
                        />
                        <div className={style.errorMsg} ref={errorLname}>Lastname should be at least 2 letters long</div>
                    </div>
                    <div className={style.inputWrapper}>
                        <label htmlFor="usermail">User Mail</label>
                        <input
                            type="text"
                            id="usermail"
                            onChange={e => validateForm('email', e.target.value)}
                        />
                        <div className={style.errorMsg} ref={errorEmail}>This is not a correct email</div>
                    </div>
                    <div className={style.inputWrapper}>
                        <label htmlFor="userpassword">Password</label>
                        <input
                            type="password"
                            id="userpassword"
                            onChange={e => validateForm('password', e.target.value)}
                        />
                        <div className={style.errorMsg} ref={errorPassword}>Password should be at least 6 characters long</div>
                    </div>

                    <input className={style.signInButton} type="submit" value="Sign Up" />
                </form>
                <Link href="/Signin"><a> You have an account?<br /> Signin here...</a></Link>
            </section>
        </main>
        </Layout>
    )
}

export default Signup