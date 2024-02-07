import React, { useContext, useEffect, useState } from 'react'
import backIcon from '../../Assets/back-icon.png'
import HomeBottom from '../Home/HomeBottom'
import './SinglePost.css'
import { useNavigate, useParams } from 'react-router-dom'
import { context } from '../../App'
import PostComponent from './Post'
import userPic from '../../Assets/user-profile.png'
import axios from 'axios'
import { toast } from 'react-toastify'

const SinglePost = () => {
    const navigate = useNavigate()
    const { postId: paramPostId } = useParams(); // Get the postID from the URL parameters
    const { isLoggedin, loggedInUser, token, serverLink, loggedInUserID, serverLinkforImages } = useContext(context)
    const [post, setPost] = useState({})

    useEffect(() => {
        if (!isLoggedin) {
            navigate('/login');
        } else {
            getPost(paramPostId)
        }
    }, [isLoggedin, paramPostId]);

    const getPost = async (postId) => {
        let res;
        try {
            res = await axios.get(`${serverLink}/posts/post/${postId}`,
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
            setPost(res.data.data)
        }
        else {
            toast.error(res.data.message)
        }
    }

    return (
        <div className='singlePostCont'>
            <div className='AllUserPosts'>
                <div className='top'>
                    <img src={backIcon} alt='back' onClick={() => navigate(-1)} />
                    <h2>Post</h2>
                </div>
                {
                    post?._id
                        ?
                        <PostComponent
                            post={post}
                            postOwnerId={post?.user}
                            username={post?.username}
                            src={post?.files[0]}
                            userPhoto={post.userPhoto ? post.userPhoto : userPic}
                        />
                        :
                        ""
                }
            </div>
            <HomeBottom />
        </div>
    )
}

export default SinglePost