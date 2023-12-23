import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { context } from '../../App'
import HomeBottom from '../Home/HomeBottom'
import './Account.css'
import insta from '../../Assets/instalogo.png'
import settings from '../../Assets/settings.png'
import axios from 'axios'
import  { ProfilePostComponent } from '../Other Components/Post'
import { toast } from 'react-toastify'


const Account = () => {
    const { isLoggedin, loggedInUser, token, serverLink, loggedInUserID, serverLinkforImages } = useContext(context)
    const navigate = useNavigate()
    const [profileData, setProfileData] = useState({})

    useEffect(() => {
        if (!isLoggedin) {
            navigate('/login')
        }
        else {
            getUserData(loggedInUser)
        }
    }, [isLoggedin])

    const getUserData = async (username) => {
        console.log(username);
        try {
            const res = await axios.get(`${serverLink}/user/username/${username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            // console.log(res);
            if (res.status === 200) {
                setProfileData(res.data?.data)
                setProfileData(res.data?.data);
            } else {
                toast.error(res?.data?.message); // Show an error toast
            }
        } catch (error) {
            toast.error('Error fetching user data: ' + error.message);
        }
    }
    return (
        <div className='container-main'>
            <div className='account-page'>
                <div className='top'>
                    <Link to='/'><img className='insta' src={insta}></img></Link>
                    {/* <h3>{profileData?.username}</h3> */}
                    <Link to='/'><img src={settings}></img></Link>
                </div>
                <div className='main'>
                    <div className='profile-top'>
                        <div className='profile-pic'>
                            <img src={`${serverLinkforImages}/uploads/${loggedInUserID}/photo/${profileData?.photo}` || ''} alt='profile' />
                        </div>
                        <div className='profile-data-right'>
                            <div className='data-box'>
                                <h2>{profileData?.posts?.length || 0}</h2>
                                <h4>Posts</h4>
                            </div>
                            <div className='data-box'>
                                <h2>{profileData?.followers?.length || 0}</h2>
                                <h4>Followers</h4>
                            </div>
                            <div className='data-box'>
                                <h2>{profileData?.followings?.length || 0}</h2>
                                <h4>Followings</h4>
                            </div>
                        </div>
                    </div>
                    <div className='profile-bio'>
                        <h3>{profileData?.name}</h3>
                        <p>{profileData?.bio || 'No Bio Added'}</p>
                    </div>
                    <div className='profile-btns'>
                        <button>Edit Profile</button>
                        <button>Share Profile</button>
                    </div>
                    <div className='posts-section'>
                        {
                            profileData?.posts?.map((post,index) => {
                                return (
                                    <ProfilePostComponent key={index} src={`${serverLinkforImages}/uploads/${loggedInUserID}/posts/${post.files[0]}`} />
                                )
                            })
                        }
                        {
                            profileData?.posts?.length ? "" : <h3>No Posts yet</h3>

                        }
                    </div>
                </div>
                <HomeBottom />
            </div>
        </div>
    )
}

export default Account