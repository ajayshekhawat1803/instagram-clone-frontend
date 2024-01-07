import React, { useContext, useEffect, useState } from 'react'
import './Feed.css'
import StartFollowingBox from './StartFollowingBox'
import { context } from '../../App'
import axios from 'axios'
import { toast } from 'react-toastify'
import PostComponent from '../Other Components/Post'
import { useNavigate } from 'react-router-dom'
import userPic from '../../Assets/user-profile.png'

const Feed = () => {
    const [userFeed, setUserFeed] = useState([])
    const [loading, setLoading] = useState(false)
    const { serverLink, token, loggedInUserID, serverLinkforImages } = useContext(context)
    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            getFeed()
        }
    }, [token])

    const getFeed = async () => {
        let res;
        try {
            res = await axios.get(`${serverLink}/feed`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            )
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
        if (res?.status === 200) {
            setUserFeed(res.data.feed);
        }
        else {
            toast.error(res.data.message)
        }
    }

    return (
        <div className='feed-container'>
            {
                userFeed?.length > 0
                    ?
                    <div className='feed-cont'>
                        {
                            userFeed.map((post) => {
                                return (
                                    <PostComponent
                                        key={post?._id}
                                        post={post}
                                        postOwnerId={post?.user}
                                        username={post?.username}
                                        src={`${serverLinkforImages}/uploads/${post.user}/posts/${post?.files[0]}`}
                                        userPhoto={post?.photo ? `${serverLinkforImages}/uploads/${post.user}/photo/${post?.photo}` : userPic}
                                    />
                                )
                            })
                        }
                        <button id='viewalluserbtnInFeed'
                            onClick={() => navigate('/all-available-users')}>Follow other users to see their posts in feed</button>
                    </div>
                    :
                    <div className='no-feed-box'>
                        {
                            loading
                                ? <h3>Loading your feed...🚀</h3>
                                : <>
                                    <h3>Follow for a visual feast! <span> #InstaVibes</span></h3>
                                    <button id='viewalluserbtn'
                                        onClick={() => navigate('/all-available-users')}>View all users</button>
                                </>

                        }
                    </div>
            }
            <StartFollowingBox />
        </div>
    )
}

export default Feed