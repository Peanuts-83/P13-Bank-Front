import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { createUser } from '../utils/slices/userIdSlice'
import { useNavigate } from 'react-router-dom'

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
    const navigate = useNavigate()

    function logIn(e) {
        e.preventDefault()

        if (!formValidator) {
            return
        }
        dispatch(createUser(fName, lName, email, password, true))
        navigate('/signin')
      }

    function validateForm(type, value) {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        switch (type) {
            case 'fName':
                setFname(value)
                if (value.length < 2) {
                    errorFname.current.className = 'error-msg error-show'
                    setFormValidator(false)
                    return
                } else {
                    errorFname.current.className = 'error-msg'
                }
                break
            case 'lName':
                setLname(value)
                if (value.length < 2) {
                    errorLname.current.className = 'error-msg error-show'
                    setFormValidator(false)
                    return
                } else {
                    errorLname.current.className = 'error-msg'
                }
                break
            case 'email':
                setEmail(value)
                if (!emailRegex.test(value)) {
                    errorEmail.current.className = 'error-msg error-show'
                    setFormValidator(false)
                    return
                } else {
                    errorEmail.current.className = 'error-msg'
                }
                break
            default:
                setPassword(value)
                if (value.length < 6) {
                    errorPassword.current.className = 'error-msg error-show'
                    setFormValidator(false)
                    return
                } else {
                    errorPassword.current.className = 'error-msg'
                }
                break
        }
        setFormValidator(true)
    }

    return (
        <main className="main bg-dark">
            <section className="sign-in-content">
                <i className="fa fa-user-circle sign-in-icon"></i>
                <h1>Sign Up</h1>
                <form onSubmit={e => logIn(e)}>
                    <div className="input-wrapper">
                        <label htmlFor="userFname">Firstname</label>
                        <input
                            type="text"
                            id="userFname"
                            onChange={e => validateForm('fName', e.target.value)}
                        />
                        <div className="error-msg" ref={errorFname}>Firstname should be at least 2 letters long</div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="userLname">Lastname</label>
                        <input
                            type="text"
                            id="userLname"
                            onChange={e => validateForm('lName', e.target.value)}
                        />
                        <div className="error-msg" ref={errorLname}>Lastname should be at least 2 letters long</div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="usermail">User Mail</label>
                        <input
                            type="text"
                            id="usermail"
                            onChange={e => validateForm('email', e.target.value)}
                        />
                        <div className="error-msg" ref={errorEmail}>This is not a correct email</div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="userpassword">Password</label>
                        <input
                            type="password"
                            id="userpassword"
                            onChange={e => validateForm('password', e.target.value)}
                        />
                        <div className="error-msg" ref={errorPassword}>Password should be at least 6 characters long</div>
                    </div>

                    <input className="sign-in-button" type="submit" value="Sign In" />
                </form>
                <Link to="/signin">You have an account?<br /> Signin here...</Link>
            </section>
        </main>
    )
}

export default Signup