import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from "../utils/slices/userIdSlice"


const Signin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const connected = useSelector(state => state.user.status === 'connected')
  const navigate = useNavigate()

  function signIn(e) {
    e.preventDefault()
    console.log(`email / password : ${email} / ${password}`)
    dispatch(loginUser(email, password))
  }

  if (connected) {
    // navigate('/user')
    setTimeout(() => navigate('/user'), 500)
  }

  return (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form onSubmit={e => signIn(e)}>
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
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <input className="sign-in-button" type="submit" value="Sign In" />

        </form>
      </section>
    </main>
  )
}

export default Signin