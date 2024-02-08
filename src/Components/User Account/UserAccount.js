import React, { useContext, useEffect, useState } from 'react'
import './UserAccount.css'
import { context } from '../../App';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HomeBottom from '../Home/HomeBottom';
import insta from '../../Assets/instalogo.png'
import settings from '../../Assets/settings.png'
import { ProfilePostComponent } from '../Other Components/Post';
import Followers from '../Followers-Followings/Followers';
import axios from 'axios';
import { toast } from 'react-toastify';
import userIcon from '../../Assets/user-profile.png'
import Followings from '../Followers-Followings/Followings';
import EditProfile from '../Settings/Edit-Profile/EditProfile';

const UserAccount = () => {
    const { isLoggedin, loggedInUser, token, serverLink, loggedInUserID, serverLinkforImages } = useContext(context)
    const [profileData, setProfileData] = useState({})
    const [selfAccount, setIsSelfAccount] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [ShowFollowers, SetShowFollowers] = useState(false)
    const [ShowFollowings, SetShowFollowings] = useState(false)
    const [EditProfileStatus, SetEditProfileStatus] = useState(false)
    const { username: paramUsername } = useParams(); // Get the username from the URL parameters

    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoggedin) {
            navigate('/login');
        } else {
            if (loggedInUser === paramUsername) {
                setIsSelfAccount(true);
            }
            getUserData(paramUsername);
        }
    }, [isLoggedin, paramUsername]);

    useEffect(() => {
        if (profileData?.followers?.includes(loggedInUserID)) {
            setIsFollowing(true)
        }
        else {
            setIsFollowing(false)
        }
    }, [profileData])

    const getUserData = async (username) => {
        let res;
        try {
            res = await axios.get(`${serverLink}/user/username/${username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                toast.error("Network Error")
            }
            if (error.response) {
                res = error.response
            }
            else {
                toast.error(error.message)
            }
        }
        if (res.status === 200) {
            setProfileData(res.data?.data)
        }
        else {
            toast.error(res?.data?.message);
        }

    }


    const handleFollow = async () => {
        // In case if he is not already following
        if (!isFollowing) {
            let res;
            try {
                res = await axios.post(`${serverLink}/followers/startfollowing`, {
                    self: loggedInUserID,
                    other: profileData?._id
                },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });

            } catch (error) {
                if (error.code === "ERR_NETWORK") {
                    toast.error("Network Error")
                }
                if (error.response) {
                    res = error.response
                }
                else {
                    toast.error(error.message)
                }
            }
            if (res.status === 200) {
                setProfileData({ ...profileData, followers: res?.data?.data })
            }
            else {
                toast.error(res?.data?.message); // Show an error toast
            }
        }
        // in case he is already following then he will be removed
        else {
            let res;
            try {
                res = await axios.post(`${serverLink}/followers/removefollowing`, {
                    self: loggedInUserID,
                    other: profileData?._id
                },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });

            } catch (error) {
                if (error.code === "ERR_NETWORK") {
                    toast.error("Network Error")
                }
                if (error.response) {
                    res = error.response
                }
                else {
                    toast.error(error.message)
                }
            }
            if (res.status === 200) {
                setProfileData({ ...profileData, followers: res?.data?.data })
            }
            else {
                toast.error(res?.data?.message); // Show an error toast
            }
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
                            <img src={profileData?.photo ? profileData?.photo : userIcon} alt='profile' />
                        </div>

                        <div className='profile-data-right'>
                            <div className='data-box'>
                                <h2>{profileData?.posts?.length || 0}</h2>
                                <h4>Posts</h4>
                            </div>
                            <div className='data-box' onClick={() => {
                                SetShowFollowers(!ShowFollowers)
                                SetShowFollowings(false)
                            }
                            }>
                                <h2>{profileData?.followers?.length || 0}</h2>
                                <h4>Followers</h4>
                            </div>
                            <div className='data-box' onClick={() => {
                                SetShowFollowings(!ShowFollowings)
                                SetShowFollowers(false)
                            }}>
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
                        {
                            selfAccount
                                ? <>
                                    <button onClick={() => SetEditProfileStatus(!EditProfileStatus)}>Edit Profile</button>
                                    <button>Share Profile</button>
                                </>
                                : <>
                                    <button className={isFollowing ? '' : 'follow-btn'} onClick={handleFollow}>{isFollowing ? 'Following' : 'Follow'}</button>
                                    <button className='message-btn'>Message</button>
                                </>
                        }
                    </div>

                    <div className='posts-section'>
                        {
                            profileData?.posts?.map((post, index) => {
                                return (
                                    <ProfilePostComponent
                                        key={index}
                                        postID={post.postID}
                                        user={profileData?.username}
                                        src={post.files[0]}
                                    />
                                )
                            })
                        }
                        {
                            profileData?.posts?.length ? "" : <h3>No Posts yet</h3>

                        }
                    </div>
                </div>
                {
                    ShowFollowers &&
                    <Followers
                        id={profileData?._id}
                        SetShowFollowers={SetShowFollowers}
                        ShowFollowers={ShowFollowers}
                    />
                }
                {
                    ShowFollowings &&
                    <Followings
                        id={profileData?._id}
                        SetShowFollowings={SetShowFollowings}
                        ShowFollowings={ShowFollowings}
                    />
                }
                {
                    EditProfileStatus &&
                    <EditProfile
                        username={profileData?.username}
                        SetEditProfileStatus={SetEditProfileStatus}
                        EditProfileStatus={EditProfileStatus}
                    />
                }
                <HomeBottom />
            </div>
        </div>
    )
}

export default UserAccount