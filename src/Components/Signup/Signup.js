import React, { useContext, useEffect, useState } from 'react';
import './Signup.css';
import { context } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Additional_sign_up_data, signup_data } from '../../constants/default-constants';
import { toast } from 'react-toastify';
import userProfile from '../../Assets/user-profile.png'

const Signup = () => {
    const [userData, setUserData] = useState(signup_data)
    const [userData2, setUserData2] = useState(Additional_sign_up_data)
    const [loading, setloading] = useState(false)
    const [validationError, setValidationError] = useState({})
    const [screen1, setScreen1] = useState(true);
    const [screen2, setScreen2] = useState(false);
    const [registeredId, setRegisteredID] = useState('')

    const navigate = useNavigate()
    const { isLoggedin } = useContext(context)
    const [uplodedimg, setuploadedImg] = useState('');
    useEffect(() => {
        if (isLoggedin) {
            navigate('/')
        } else {
            // console.log('not logged in');
        }
    }, [isLoggedin])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value })
        setUserData2({ ...userData2, [name]: value })
        delete validationError[name]
    }
    const handleChange2 = (e) => {
        let { name, value } = e.target;
        if (name === "mobile") {
            value = Number(value)
        }
        setUserData2({ ...userData2, [name]: value })
        delete validationError[name]
    }

    const handleSignUp = async (e) => {
        e.preventDefault()
        setloading(true)
        if (userData.password !== userData.cnfPassword) {
            setValidationError({ cnfPassword: `Confirm password must be same` })
            setloading(false)
            return
        }

        let res;
        try {
            res = await axios.post(`http://localhost:5000/api/v1/auth/signup`, userData)
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                toast.error("Network Error")
            }
            if (error.response) {
                res = error.response
            }
            else {
                toast.error(error.message)
                setloading(false)
            }
        }
        if (res?.status === 201) {
            setScreen1(false)
            setScreen2(true)
            setRegisteredID(res.data.data._id)
        }
        if (res?.status > 400 && res?.status <= 499) {
            // console.log(res);
            // toast.error(res.data.message)
            if (res?.data.message) {
                const field = res.data.message.split(' ')[0];
                setValidationError({ [field]: res.data.message })
            }
        }
        if (res?.status === 400 && Array.isArray(res?.data.message)) {
            let errs = {}
            res.data.message.forEach(mess => {
                const field = mess.split(' ')[0];
                errs[field] = mess;
            });
            setValidationError(errs)
        }
        setloading(false)
    }


    const handleAdditionalInformationUpload = async (e) => {
        e.preventDefault()
        setloading(true)
        // userData2.dob = new Date(userData2.dob)
        let res;
        try {
            res = await axios.post(`http://localhost:5000/api/v1/auth/signup/add-details/${registeredId}`, userData2, {
            // res = await axios.post(`http://localhost:5000/api/v1/auth/signup/add-details/6585c7850b2be642b86ef9b4`, userData2, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                toast.error("Network Error")
            }
            if (error.response) {
                res = error.response
            }
            else {
                toast.error(error.message)
                setloading(false)
            }
        }
        if (res?.status === 201) {
            toast.success(<><h4>Added details succesfully</h4>Login now</>)
            setRegisteredID(res.data.data._id)
            navigate('/login')
        }
        if (res?.status > 400 && res?.status <= 499) {
            // console.log(res);
            // toast.error(res.data.message)
            if (res?.data.message) {
                const field = res.data.message.split(' ')[0];
                setValidationError({ [field]: res.data.message })
            }
        }
        if (res?.status === 400 && Array.isArray(res?.data.message)) {
            let errs = {}
            res.data.message.forEach(mess => {
                const field = mess.split(' ')[0];
                errs[field] = mess;
            });
            setValidationError(errs)
        }
        setloading(false)
    }

    return (
        <div className='container-main'>
            <div className='signup-page'>
                {screen1 && <>
                    <h1 id='insta-heading-main'>Instagram</h1>
                    <form>
                        <input type='text' placeholder='Name' value={userData.name} name='name' onChange={handleChange} />
                        <span>{validationError.name ? validationError.name : ''}</span>

                        <input type='email' placeholder='Email' value={userData.email} name='email' onChange={handleChange} />
                        <span>{validationError.email ? validationError.email : ''}</span>

                        <input type='text' placeholder='Username' value={userData.username} name='username' onChange={handleChange} />
                        <span>{validationError.username ? validationError.username : ''}</span>

                        <input type='password' placeholder='Password' value={userData.password} name='password' onChange={handleChange} />
                        <span>{validationError.password ? validationError.password : ''}</span>

                        <input type='password' placeholder='Confirm Password' value={userData.cnfPassword} name='cnfPassword' onChange={handleChange} />
                        <span>{validationError.cnfPassword ? validationError.cnfPassword : ''}</span>

                        <button id='signup-btn' disabled={loading} onClick={handleSignUp}>{loading ? 'Registering' : 'Sign up'}</button>
                    </form>
                    <h4>Already have an account? <Link to='/login'>Login</Link></h4>

                </>}
                {screen2 && <>
                    <div className="profile-picture-container">
                        <img src={uplodedimg || userProfile} alt='User profile' />
                        <input
                            type="file"
                            name="photo"
                            onChange={(e) => {
                                setUserData2({ ...userData2, photo: e.target.files[0] })
                                setuploadedImg(URL.createObjectURL(e.target.files[0]))
                            }}
                            className="profile-photo-input"
                        />
                    </div>
                    <h4 id='add-profile-photo-heading'>Add profile Photo</h4>
                    <form>
                        <input type='number' placeholder='Mobile number' name='mobile' value={userData2.mobile} onChange={handleChange2} />
                        <span>{validationError.mobile ? validationError.mobile : ''}</span>

                        <input type='date' name='dob' value={userData2.dob} onChange={handleChange2} />
                        <span>{validationError.dob ? validationError.dob : ''}</span>

                        <textarea type='text' placeholder='Describe yourself' name='bio' value={userData2.bio} onChange={handleChange2} ></textarea >
                        <span>{validationError.bio ? validationError.bio : ''}</span>

                    </form>
                    <div className='last-action-btns'>
                        <Link to='/login'
                            onClick={() => {
                                toast.success(<h4>
                                    Additional details skipped...
                                    <br />
                                    Login now
                                </h4>)
                            }}>Skip</Link>
                        <button onClick={handleAdditionalInformationUpload}>Save</button>
                    </div>
                </>}
            </div>
        </div>
    );
};

export default Signup;
