import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { context } from '../../App'
import HomeBottom from '../Home/HomeBottom'
import './Account.css'
import insta from '../../Assets/instalogo.png'
import settings from '../../Assets/settings.png'
import axios from 'axios'
import { ProfilePostComponent } from '../Other Components/Post'
import { toast } from 'react-toastify'
import Followers from '../Followers-Followings/Followers'
import Followings from '../Followers-Followings/Followings'
import userIcon from '../../Assets/user-profile.png'
import EditProfile from '../Settings/Edit-Profile/EditProfile'


const Account = () => {
    const { isLoggedin, loggedInUser, token, serverLink, loggedInUserID, serverLinkforImages } = useContext(context)
    const navigate = useNavigate()
    const [profileData, setProfileData] = useState({})
    const [ShowFollowers, SetShowFollowers] = useState(false)
    const [ShowFollowings, SetShowFollowings] = useState(false)
    const [EditProfileStatus, SetEditProfileStatus] = useState(false)

    useEffect(() => {
        if (!isLoggedin) {
            navigate('/login')
        }
        else {
            getUserData(loggedInUser)
        }
    }, [isLoggedin, EditProfileStatus])

    const getUserData = async (username) => {
        let res;
        try {
            res = await axios.get(`${serverLink}/user/username/${username}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            // console.log(res);
            if (res.status === 200) {
                setProfileData(res.data?.data)
            } else {
                toast.error(res?.data?.message); // Show an error toast
            }
        } catch (error) {
            if (error.response) {
                res = error.response
                toast.error(res.data.message);
            } else {
                toast.error(error.message);
            }
        }
    }
    return (
        <div className='container-main'>
            <div className='account-page'>
                <div className='top'>
                    <Link to='/'><img className='insta' src={insta}></img></Link>
                    {/* <h3>{profileData?.username}</h3> */}
                    <Link to='/settings'><img src={settings}></img></Link>
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
                            }}>
                                <h2>{profileData?.followers?.length || 0}</h2>
                                <h4>Followers</h4>
                            </div>
                            <div className='data-box' onClick={() => {
                                SetShowFollowers(false)
                                SetShowFollowings(!ShowFollowings)
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
                        <button onClick={() => SetEditProfileStatus(!EditProfileStatus)}>Edit Profile</button>
                        <button>Share Profile</button>
                    </div>

                    <div className='posts-section'>
                        {
                            profileData?.posts?.length > 0
                                ? profileData?.posts?.map((post, index) => {
                                    return (
                                        <ProfilePostComponent
                                            key={index}
                                            postID={post?._id}
                                            user={profileData?.username}
                                            src={post?.files[0]} />
                                    )
                                })
                                : ""
                        }
                        {
                            profileData?.posts?.length ? "" : <h3>No Posts yet</h3>

                        }
                    </div>
                </div>
                {
                    ShowFollowers &&
                    <Followers
                        id={loggedInUserID}
                        SetShowFollowers={SetShowFollowers}
                        ShowFollowers={ShowFollowers}
                    />
                }
                {
                    ShowFollowings &&
                    <Followings
                        id={loggedInUserID}
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

export default Account