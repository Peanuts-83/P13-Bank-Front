import '../styles/globals.scss'
import store from '../store/store'
import { Provider } from 'react-redux'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { userService } from '../services/user.service'
// import { initProfile } from '../store/slices/userIdSlice'
// import { useDispatch } from 'react-redux'


export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    authCheck(router.asPath)

    // set authorized to false to hide page content while changing routes
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    // run auth check on route change
    router.events.on('routeChangeComplete', authCheck)

    // unsubscribe from events in useEffect return function
    return () => {
        router.events.off('routeChangeStart', hideContent);
        router.events.off('routeChangeComplete', authCheck);
    }
  })

  function authCheck(url) {
    const publicPaths = ['/', '/Signin', '/Signup']
    const path = url.split('?')[0]
    console.log('PATH -', path);
    if (!userService.userValue && !publicPaths.includes(path)) {
      setAuthorized(false)
      router.push({
        pathname: '/',
        query: { returnUrl: router.asPath }
      })
    } else {
      setAuthorized(true)
    }
  }


  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
