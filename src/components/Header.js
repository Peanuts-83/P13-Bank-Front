import logo from '../assets/argentBankLogo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className='main-nav'>
    <Link to="/" className='main-nav-logo'>
      <img className='main-nav-logo-image' src={logo} alt='logo' />
    </Link>
    <Link to="/login" className='main-nav-item'>
      <FontAwesomeIcon className='fa fa-circle-user' icon="circle-user" />
      Sign In
    </Link>
  </header>
  )
}

export default Header