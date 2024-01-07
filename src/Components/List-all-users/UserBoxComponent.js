import React, { useContext, useEffect, useState } from 'react'
import { context } from '../../App'
import axios from 'axios'
import { toast } from 'react-toastify'
import userIcon from '../../Assets/user-profile.png'
import { useNavigate } from 'react-router-dom'


const UserBoxComponent = (prop) => {
    const { user } = prop;
    const navigate = useNavigate()
    const { isLoggedin, loggedInUser, token, serverLink, loggedInUserID, serverLinkforImages } = useContext(context)
    const [isFollowing, setIsFollowing] = useState(false)
    const [userFollowers, setUserFollowers] = useState(user.followers || [])
    const photoSrc = `${serverLinkforImages}/uploads/${user?._id}/photo/${user?.photo}`

    useEffect(() => {
        if (userFollowers?.includes(loggedInUserID)) {
            setIsFollowing(true)
        }
        else {
            setIsFollowing(false)
        }
    }, [userFollowers])


    const handleFollow = async () => {
        // In case if he is not already following
        if (!isFollowing) {
            let res;
            try {
                res = await axios.post(`${serverLink}/followers/startfollowing`, {
                    self: loggedInUserID,
                    other: user._id
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
                setUserFollowers(res?.data?.data)
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
                    other: user._id
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
                setUserFollowers(res?.data?.data)
            }
            else {
                toast.error(res?.data?.message); // Show an error toast
            }
        }
    }

    const handleBoxClick = (e) => {
        if (e.target.name !== "follow-btn") {
            navigate(`/user/${user.username}`)
        }
    }

    return (
        <div className='user-box' onClick={(e) => handleBoxClick(e)} >
            <img src={user?.photo ? photoSrc : userIcon} alt='user' />
            <h3  >{user.username}</h3>
            <h2 >{user.name}</h2>
            {
                user?._id === loggedInUserID
                    ?
                    <button disabled className='following-btn' name='follow-btn'>Its you</button>
                    :
                    <button name='follow-btn' className={isFollowing ? 'following-btn' : 'follow-btn'} onClick={handleFollow}>{isFollowing ? 'Following' : 'Follow'}</button>
            }
        </div>
    )
}

export default UserBoxComponent