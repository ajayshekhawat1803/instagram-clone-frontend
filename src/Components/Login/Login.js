import React, { useContext, useEffect, useState } from 'react';
import './Login.css';
import axios from 'axios';
import { context } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { isLoggedin, setIsLoggedIn, setToken, setloggedInUser, setloggedInUserID, serverLink } = useContext(context)
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
        setLoading(true);
        let response;
        try {
            response = await axios.post(`${serverLink}/auth/login`, { username, password });

            if (response.status === 200) {
                if (response.data.data) {
                    // Successful login
                    toast.success(response.data.message);
                    setToken(response.data.data.access_token);
                    const userDataToSave = {
                        token: response.data.data.access_token,
                        username: response.data.data.username,
                        _id: response.data.data._id
                    };
                    Cookies.set('userData', JSON.stringify(userDataToSave), { expires: 1 }); // Set cookie to expire in 1 day
                    setloggedInUser(userDataToSave.username);
                    setIsLoggedIn(true);
                    setloggedInUserID(userDataToSave._id);
                } else {
                    // Handle other cases where data is not available in the response
                    toast.error(response.data.message);
                }
            } else if (response.status === 401) {
                toast.error('Unauthorized access. Please login again.');
            } else {
                toast.error(`Unexpected status code: ${response.status}`);
            }

        } catch (error) {
            setLoading(false);
            if (error.response) {
                response = error.response
                toast.error(`${response.data.message}`);
            } else {
                toast.error(`${error.message}`);
            }
        }
        setLoading(false);
        // console.log(response);
    }
    return (
        <div className='container-main'>
            <div className='login-page'>
                <ToastContainer autoClose={4000} position='top-right' bodyClassName="custom-toast-body"
                    toastStyle={{
                        background: '#333',
                        color: '#fff',
                    }} />
                <h1 id='insta-heading-main'>Instagram</h1>
                <form>
                    <input type='text' autoFocus placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} />
                    <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button id='login-btn' disabled={loading} onClick={handleLogin}>{loading ? 'Logging in' : 'Login'}</button>
                    <a>forgot password ?</a>
                </form>

                <h4>Don't have account?  <Link to='/signup'>Sign Up</Link></h4>

            </div>
        </div>
    );
};

export default Login;
