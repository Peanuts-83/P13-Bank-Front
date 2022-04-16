import logo from '../assets/argentBankLogo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { userInfosSelector } from '../utils/selectors'



/**
 * It returns a header with a logo, a link to the home page, and a link to the login page if the user
 * is not connected, and a link to the home page and a link to sign out if the user is connected
 * @returns A header with a logo and a link to the login page.
 */
const Header = () => {
  const connected = useSelector(state => state.user.status === 'connected')
  const {firstName} = useSelector(state => userInfosSelector(state))

  return (
    <header className='main-nav'>
    <Link to="/" className='main-nav-logo'>
      <img className='main-nav-logo-image' src={logo} alt='logo' />
    </Link>
    {connected ? (
      <Link to='/' className='main-nav-item'>
        <FontAwesomeIcon className='fa fa-circle-user' icon="circle-user" />
        {firstName}
        <FontAwesomeIcon className='fa fa-sign-out' icon="sign-out" />
        Sign Out
      </Link>
    ):(
      <Link to="/login" className='main-nav-item'>
        <FontAwesomeIcon className='fa fa-circle-user' icon="circle-user" />
        Sign In
      </Link>
    )}
  </header>
  )
}

export default Header
