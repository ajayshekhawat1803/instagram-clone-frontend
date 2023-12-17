import React, { useContext, useEffect, useState } from 'react';
import './Signup.css';
import { context } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [cnfPassword, setCnfPassword] = useState('')

    const { isLoggedin } = useContext(context)
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoggedin) {
            // console.log('logged in So navigated');
            navigate('/')
        } else {
            // console.log('not logged in');
        }
    }, [isLoggedin])

    const handleSignUp = async (e) => {
        e.preventDefault()
        let res;
        try {
            res = await axios.post(`http://localhost:5000/api/v1/auth/signup`, { name, email, password, username })
            console.log(res);
        } catch (error) {
            //    console.log(error.response);
            res = error.response
            console.log(res);
        }
        if (res.status === 201) {
            console.log('Successfull Sign up');
            navigate('/login')
        }
    }

    return (
        <div className='container-main'>
            <div className='signup-page'>
                <h1 id='insta-heading-main'>Instagram</h1>
                <form>
                    <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                    <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input type='password' placeholder='Confirm Password' value={cnfPassword} onChange={(e) => setCnfPassword(e.target.value)} />
                    <button id='signup-btn' onClick={handleSignUp}>Sign up</button>
                </form>
                <h4>Already have an account? <Link to='/login'>Login</Link></h4>
            </div>
        </div>
    );
};

export default Signup;
