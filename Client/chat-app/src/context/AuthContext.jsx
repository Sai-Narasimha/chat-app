import React, { createContext, useCallback, useEffect, useState } from 'react'
import { baseUrl, postRequest } from '../utils/services'

export const AuthContext = createContext()
export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [registerError, setRegisterError] = useState(null)
    const [isRegisterLoading, setIsRegisterLoading] = useState(false)
    const [loginError, setLoginError] = useState(null)
    const [isLoginLoading, setIsLoginLoading] = useState(false)
    const [registerInfo, setRegisterInfo] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        setUser(user)
    }, [])

    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info)
    }, [])
    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info)
    }, [])
    const registerUser = useCallback(async (e) => {
        e.preventDefault();
        setIsRegisterLoading(true)
        setRegisterError(null)
        const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo));
        setIsRegisterLoading(false)
        if (response.error) {
            return setRegisterError(response);
        }
        localStorage.setItem('user', JSON.stringify(response));
        setUser(response)
    }, [registerInfo])

    const loginUser = useCallback(async (e
    ) => {
        e.preventDefault();
        setIsLoginLoading(true)
        setLoginError(null)
        const response = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo));
        setIsLoginLoading(false)
        if (response.error) {
            return setLoginError(response);
        }
        localStorage.setItem('user', JSON.stringify(response));
        setUser(response)
    }, [loginInfo])

    const logoutUser = useCallback(() => {
        localStorage.removeItem('user')
        setUser(null)
    }, [])
    return <AuthContext.Provider value={{ user, registerInfo, registerError, isRegisterLoading, loginInfo, loginError, isLoginLoading, updateRegisterInfo, registerUser, loginUser, updateLoginInfo, logoutUser }}>
        {children}
    </AuthContext.Provider>
}
