import React, { useContext, useState } from 'react'
import './post.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import heart from '../../Assets/heart.png'
import heartLiked from '../../Assets/heart-liked.png'
import comment from '../../Assets/comment.png'
import send from '../../Assets/paper.png'
import { context } from '../../App'
import { toast } from 'react-toastify'

const PostComponent = (prop) => {
    let { postID, caption } = prop.post
    const { serverLink, token, loggedInUserID } = useContext(context)
    const [metaData, setMetaData] = useState(prop.post.metaData)
    const [showComments, setShowComments] = useState(false)
    const src = prop.src
    const postOwnerId = prop.postOwnerId
    const username = prop.username

    const HandleLike = async (postOwnerId, postID) => {
        let res;
        try {
            res = await axios.post(`${serverLink}/likes`,
                {
                    postId: postID, postOwnerId
                },
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
        if (res?.status === 201) {
            setMetaData(res.data?.data?.metaData)
        }
        else {
            toast.error(res.data.message)
        }
    }

    return (
        <div className='post-box'>
            <div className='post-img-box'>
                <img src={src} />
            </div>
            <div className='metaData-section'>
                <div>
                    <img src={metaData?.likes?.includes(loggedInUserID) ? heartLiked : heart} alt='like' onClick={() => { HandleLike(postOwnerId, postID) }} />
                    <h6>{metaData.likes.length} Likes</h6>
                </div>
                <img src={comment} alt='comment' onClick={() => setShowComments(!showComments)} />
            </div>
            <div className='content'>
                <h5>{username}</h5>
                <p>{caption}</p>
            </div>
            {
                showComments &&
                <div className='comment-section'>
                    <div className='add-comment'>
                        <input placeholder='Add your comment' />
                        <img src={send} />
                    </div>
                </div>
            }
        </div>
    )
}

export const ProfilePostComponent = (prop) => {
    const navigate = useNavigate()
    const { src, postID, user } = prop
    return (
        <div className='post-box-profile'
            onClick={() => {
                navigate(`/posts/${user}`)
            }}>
            <div className='post-img-box'>
                <img src={src} />
            </div>
        </div>
    )
}

export default PostComponent