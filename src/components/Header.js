import logo from '../assets/argentBankLogo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initProfil } from '../utils/slices/userIdSlice'
import { userInfos } from '../utils/selectors'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const connected = useSelector(state => state.user.status === 'connected')
  const userinfos = useSelector(state => userInfos(state))
  const {firstname, lastname, email, password} = userinfos


  return (
    <header className='main-nav'>
    <Link to="/" className='main-nav-logo'>
      <img className='main-nav-logo-image' src={logo} alt='logo' />
    </Link>
    {connected ? (
      <Link to='/' className='main-nav-item' onClick={initProfil()}>
        <FontAwesomeIcon className='fa fa-circle-user' icon="circle-user" />
        {email}
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
