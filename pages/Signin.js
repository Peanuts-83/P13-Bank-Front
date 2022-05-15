import { useEffect, useState, useRef } from "react"
// import { useNavigate,
import Link from 'next/link'
import { useRouter } from "next/router"
import { useDispatch, useSelector } from 'react-redux'
import { initProfile } from '../store/slices/userIdSlice'
import { signinUser, setRememberMe, getUserProfile, resolvedUser } from "../store/slices/userIdSlice"
import { rememberMeSelector, statusSelector, userInfosSelector } from "../store/selectors"
import Layout from '../components/Layout';
import style from '../styles/components/index.module.scss'
import { userService } from "services"

/**
 * It's a component that renders a form to sign in a user
 * @returns A React component
 */
const Signin = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formValidator, setFormValidator] = useState(false)
  const emailError = useRef(null)
  const passwordError = useRef(null)
  const connected = useSelector(state => statusSelector(state) === 'connected')
  const rememberMe = useSelector(state => rememberMeSelector(state) === true)
  const userId = useSelector(state => userInfosSelector(state).id)

  // Initiate user profile
  useEffect(() => {
    dispatch(initProfile())
  }, [])

  // redirect to User if already logged in
  // useEffect(() => {
  //   if (userService.userValue !== null) {
  //     console.log('userService.userValue not null!');
  //     if (userId === null) {
  //       console.log('userId is null!');
  //       dispatch(resolvedUser(JSON.parse(localStorage.getItem('ARGENTBANK_userInfos')), JSON.parse(localStorage.getItem('ARGENTBANK_rememberMe'))))
  //     }
  //     router.push('/User')
  //   }
  // }, [userService.userValue])

  // Auto-displays user email on demand
  useEffect(() => {
    if (rememberMe &&
      localStorage.ARGENTBANK_userInfos &&
      localStorage.ARGENTBANK_userInfos.email !== null) {
      setEmail(JSON.parse(localStorage.ARGENTBANK_userInfos).email)
      document.querySelector('#remember-me').setAttribute('checked', true)
    }
  }, [rememberMe])

  // Fetch USERPROFILE if access granted
  // useEffect(() => {
  //   if (connected) {
  //     const token = sessionStorage.ARGENTBANK_token
  //     dispatch(getUserProfile(token))
  //   }
  // }, [connected])

  // Navigate to USER PAGE with ID if profile fetched
  // useEffect(() => {
  //   if (connected) {
  //     router.push(`/user/${userId}`)
  //   }
  // }, [userId])

  // Dispatch user's credentials to gain access to user's Page
  async function logIn(e) {
    e.preventDefault()
    if (!formValidator) {
      return
    }

    return userService.login(email, password)
      .then((user) => {
        const returnUrl = router.query.returnUrl || '/User';

        //Third arg for remeberMe
        if (e.target[2].checked) {
          dispatch(signinUser(user, true))
        } else {
          dispatch(signinUser(user, false))
        }
        router.push(returnUrl)
      })
      .catch(error => {
        console.log('API Error', { message: error });
      })
  }

  // Validate each input and sets value for email & password
  function validateForm(type, value) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    switch (type) {
      case 'email':
        setEmail(value)
        if (!emailRegex.test(value)) {
          emailError.current.className = `${style.errorMsg} ${style.errorShow}`
          setFormValidator(false)
          return
        } else {
          emailError.current.className = style.errorMsg
        }
        break
      default:
        setPassword(value)
        if (value.length < 6) {
          passwordError.current.className = `${style.errorMsg} ${style.errorShow}`
          setFormValidator(false)
          return
        } else {
          passwordError.current.className = style.errorMsg
        }
        break
    }
    setFormValidator(true)
  }

  function toggleRememberMe() {
    dispatch(setRememberMe(!rememberMe))
  }

  return (
    <Layout>
      <main className={`${style.main} ${style.bgDark}`}>
        <section className={style.signInContent}>
          <i className="fa fa-user-circle sign-in-icon"></i>
          <h1>Sign In</h1>
          <form onSubmit={e => logIn(e)}>
            <div className={style.inputWrapper}>
              <label htmlFor="usermail">User Mail</label>
              <input
                type="text"
                id="usermail"
                onChange={e => validateForm('email', e.target.value)}
                value={email}
              />
              <div className={style.errorMsg} ref={emailError}>This is not a correct email</div>
            </div>
            <div className={style.inputWrapper}>
              <label htmlFor="userpassword">Password</label>
              <input
                type="password"
                id="userpassword"
                onChange={e => validateForm('password', e.target.value)}
              />
              <div className={style.errorMsg} ref={passwordError}>Password should be at least 6 characters long</div>
            </div>
            <div className={style.inputRemember}>
              <input type="checkbox" id="remember-me" onClick={toggleRememberMe} />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <input className={style.signInButton} type="submit" value="Sign In" />
          </form>
          <Link href="/Signup"><a> No account? Signup here...</a></Link>
        </section>
      </main>
    </Layout>
  )
}

export default Signin