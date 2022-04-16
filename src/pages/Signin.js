import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, setRememberMe } from "../utils/slices/userIdSlice"
import { rememberMeSelector, statusSelector } from "../utils/selectors"


/**
 * It's a component that renders a form to sign in a user
 * @returns A React component
 */
const Signin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const emailError = document.querySelector('.usermail')
  const passwordError = document.querySelector('.userpassword')
  const [formValidator, setFormValidator] = useState(false)
  const connected = useSelector(state => statusSelector(state) === 'connected')
  const rememberMe = useSelector(state => rememberMeSelector(state) === true)

  // Auto-displays user email if conditions true
  useEffect(() => {
    if (rememberMe &&
      localStorage.ARGENTBANK_userInfos &&
      localStorage.ARGENTBANK_userInfos.email !== null) {
      setEmail(JSON.parse(localStorage.ARGENTBANK_userInfos).email)
      document.querySelector('#remember-me').setAttribute('checked', true)
    }
  }, [rememberMe])

  // Dispatch user's credentials to gain access to user's Page
  function logIn(e) {
    e.preventDefault()
    if (!formValidator) {
      console.log('VALIDATOR', formValidator);
      return
    }
    if (e.target[2].checked) {
      dispatch(loginUser(email, password, true))
    } else {
      dispatch(loginUser(email, password))
    }
  }

  // Validate each input and sets value for email & password
  function validateForm(type, value) {
    console.log(type, value)
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    switch (type) {
      case 'email':
        setEmail(value)
        console.log('now', email)
        if (!emailRegex.test(value)) {
          emailError.classList.add('error-show')
          setFormValidator(false)
          return
        } else {
          emailError.classList.remove('error-show')
        }
        break
      default:
        setPassword(value)
        console.log(password);
        if (value.length < 6) {
          passwordError.classList.add('error-show')
          setFormValidator(false)
          return
        } else {
          passwordError.classList.remove('error-show')
        }
        break
    }
    setFormValidator(true)
  }

  function toggleRememberMe() {
    dispatch(setRememberMe(!rememberMe))
  }

  if (connected) {
    setTimeout(() => navigate('/user'), 500)
  }

  return (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form onSubmit={e => logIn(e)}>
          <div className="input-wrapper">
            <label htmlFor="usermail">User Mail</label>
            <input
              type="text"
              id="usermail"
              onChange={e => validateForm('email', e.target.value)}
            />
            <div className="error-msg usermail">This is not a correct email</div>
          </div>
          <div className="input-wrapper">
            <label htmlFor="userpassword">Password</label>
            <input
              type="password"
              id="userpassword"
              onChange={e => validateForm('password', e.target.value)}
            />
            <div className="error-msg userpassword">Password should be at least 6 characters long</div>
          </div>
          <div className="input-remember">
            <input type="checkbox" id="remember-me" onClick={toggleRememberMe} />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <input className="sign-in-button" type="submit" value="Sign In" />
        </form>
      </section>
    </main>
  )
}

export default Signin