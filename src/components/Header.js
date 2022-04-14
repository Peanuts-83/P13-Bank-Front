import logo from '../assets/argentBankLogo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initProfil } from '../utils/slices/userIdSlice'
import { userInfosSelector } from '../utils/selectors'

const Header = () => {
  const connected = useSelector(state => state.user.status === 'connected')
  const userinfos = useSelector(state => userInfosSelector(state))
  // const {firstname, lastname, email, password} = userinfos


  return (
    <header className='main-nav'>
    <Link to="/" className='main-nav-logo'>
      <img className='main-nav-logo-image' src={logo} alt='logo' />
    </Link>
    {connected ? (
      <Link to='/' className='main-nav-item' onClick="initProfil">
        <FontAwesomeIcon className='fa fa-circle-user' icon="circle-user" />
        {null}
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
