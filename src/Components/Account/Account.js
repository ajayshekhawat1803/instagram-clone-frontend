import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { context } from '../../App'
import HomeBottom from '../Home/HomeBottom'
import './Account.css'
import insta from '../../Assets/instalogo.png'
import settings from '../../Assets/settings.png'
import axios from 'axios'

const Account = () => {
    const { isLoggedin, loggedInUser, token, serverLink } = useContext(context)
    const navigate = useNavigate()
    const [profileData, setProfileData] = useState({})

    useEffect(() => {
        if (!isLoggedin) {
            navigate('/login')
        }
        else {
            getUserData(loggedInUser)
        }
    }, [])

    const getUserData = async (username) => {
        const res = await axios.get(`${serverLink}/user/username/${username}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        console.log(res);
        setProfileData(res.data?.data)
    }
    return (
        <div className='container-main'>
            <div className='account-page'>
                <div className='top'>
                    <Link to='/'><img className='insta' src={insta}></img></Link>
                    <Link to='/'><img src={settings}></img></Link>
                </div>
                <div className='main'>
                    <div className='profile-top'>
                        <div className='profile-pic'>

                        </div>
                        <div className='profile-data-right'>
                            <div className='data-box'>
                                <h2>{profileData?.metaData?.posts}</h2>
                                <h4>Posts</h4>
                            </div>
                            <div className='data-box'>
                                <h2>{profileData?.metaData?.followers}</h2>
                                <h4>Followers</h4>
                            </div>
                            <div className='data-box'>
                                <h2>{profileData?.metaData?.followings}</h2>
                                <h4>Followings</h4>
                            </div>
                        </div>
                    </div>
                    <div className='profile-bio'>
                        <h3>{profileData?.name}</h3>
                        <p>{profileData?.metaData?.bio}</p>
                    </div>
                    <div className='profile-btns'>
                        <button>Edit Profile</button>
                        <button>Share Profile</button>
                    </div>
                    <div className='posts-section'>

                    </div>
                </div>
                <HomeBottom />
            </div>
        </div>
    )
}

export default Account