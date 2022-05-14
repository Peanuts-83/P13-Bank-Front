import logo from '../public/assets/argentBankLogo.png'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { userInfosSelector } from '../store/selectors'
import style from '../styles/components/header.module.scss'
import { userService } from 'services'



/**
 * It returns a header with a logo, a link to the home page, and a link to the signin page if the user
 * is not connected, and a link to the home page and a link to sign out if the user is connected
 * @returns A header with a logo and a link to the signin page.
 */
const Header = () => {
  const connected = useSelector(state => state.user.status === 'connected')
  const { firstName } = useSelector(state => userInfosSelector(state))

  return (
    <header className={style.mainNav}>
      <a className={style.mainNavLogo} onClick={userService.logout}>
        <div className={style.mainNavLogoImage}>
          <Image src={logo} alt='logo' />
        </div>
      </a>
      {connected ? (
          <a className={style.mainNavItem}  onClick={userService.logout}><FontAwesomeIcon className={`${style.fa} fa-circle-user`} icon="circle-user" />
            {firstName}
            <FontAwesomeIcon className={`${style.fa} fa-sign-out`} icon="sign-out" />
            Sign Out</a>
      ) : (
        <Link href="/Signin">
          <a className={style.mainNavItem}><FontAwesomeIcon className={`${style.fa} fa-circle-user`} icon="circle-user" />
            Sign In</a>
        </Link>
      )}
    </header>
  )
}

export default Header
