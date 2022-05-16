import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import router from 'next/router'
import { signinUser } from 'store/slices/userIdSlice';
import { useDispatch, useSelector } from 'react-redux'
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig()
console.log('publicRuntimeConfig.apiUrl -', publicRuntimeConfig.apiUrl);
const baseUrl = `${publicRuntimeConfig.apiUrl}`
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('ARGENTBANK_userInfos')))
// const dispatch = useDispatch()

export const userService = {
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value },
    login,
    logout,
    getAll
}

async function login(email, password) {
    const user = await fetchWrapper.post(`${baseUrl}authenticate`, { email, password });
    userSubject.next(user);
    localStorage.setItem('ARGENTBANK_userInfos', JSON.stringify(user))
    // dispatch(signinUser(email, password))
    return user;
}

function logout() {
    localStorage.removeItem('ARGENTBANK_userInfos')
    userSubject.next(null)
    router.push('/')
}

function getAll() {
    return fetchWrapper.get(baseUrl)
}
