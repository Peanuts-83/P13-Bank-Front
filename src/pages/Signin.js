import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, setRememberMe } from "../utils/slices/userIdSlice"
import { rememberMeSelector, statusSelector } from "../utils/selectors"


const Signin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const connected = useSelector(state => statusSelector(state) === 'connected')
  const rememberMe = useSelector(state => rememberMeSelector(state) === true)

  useEffect(() => {
    if (rememberMe &&
      localStorage.ARGENTBANK_userInfos &&
      localStorage.ARGENTBANK_userInfos.email !== null) {
      setEmail(JSON.parse(localStorage.ARGENTBANK_userInfos).email)
      document.querySelector('#remember-me').setAttribute('checked', true)
    }
    console.log('REMEMBER', rememberMe)
  }, [rememberMe])

  function logIn(e) {
    e.preventDefault()
    if (e.target[2].checked) {
      dispatch(loginUser(email, password, true))
    } else {
      dispatch(loginUser(email, password))
    }
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
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="userpassword">Password</label>
            <input
              type="password"
              id="userpassword"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
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