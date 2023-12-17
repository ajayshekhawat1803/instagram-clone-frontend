import React, { useContext, useEffect, useState } from 'react';
import './Login.css';
import axios from 'axios';
import { context } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const { isLoggedin, setIsLoggedIn, token, setToken } = useContext(context)
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoggedin) {
            // console.log('logged in So navigated.token', token);
            navigate('/')
        } else {
            // console.log('not logged in');
        }
    }, [isLoggedin])

    const handleLogin = async (e) => {
        e.preventDefault();
        let response;
        try {
            response = await axios.post(`http://localhost:5000/api/v1/auth/login`, { username, password })
            if (response.data.data) {
                setToken(response.data.data.access_token);
                const userDataToSave = {
                    token: response.data.data.access_token,
                    username: response.data.data.user.username
                }
                Cookies.set('userData', JSON.stringify(userDataToSave), { expires: 1 }); // Set cookie to expire in 1 days
                setIsLoggedIn(true)
            }
        } catch (error) {
            console.log('error occured', error.response);
        }
        console.log(response);
    }
    return (
        <div className='container-main'>
            <div className='login-page'>
                <h1 id='insta-heading-main'>Instagram</h1>
                <form>
                    <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button id='login-btn' onClick={handleLogin}>Login</button>
                    <a>forgot password ?</a>
                </form>

                <h4>Don't have account?  <Link to='/signup'>Sign Up</Link></h4>

            </div>
        </div>
    );
};

export default Login;
