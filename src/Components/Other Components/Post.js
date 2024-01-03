import React, { useContext, useEffect, useState } from 'react'
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
    const postID = prop.post._id
    let { caption } = prop.post
    const { serverLink, token, loggedInUserID,serverLinkforImages } = useContext(context)
    const [metaData, setMetaData] = useState(prop.post.metaData)
    const [showComments, setShowComments] = useState(false)
    const src = prop.src
    const postOwnerId = prop.post.user
    const username = prop.username
    const [newComment, setNewComment] = useState("")
    
    const userPhotoSrc = prop.userPhoto

    const navigate = useNavigate()

    useEffect(() => {
        fetchComments()
    }, [showComments])

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
            setMetaData({ ...metaData, likes: res.data?.data?.metaData?.likes })
        }
        else {
            toast.error(res.data.message)
        }
    }

    const fetchComments = async () => {
        let res;
        try {
            res = await axios.get(`${serverLink}/comments/?postId=${postID}&postOwnerId=${postOwnerId}`,
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
            if (res.data.data) {
                setMetaData(res.data?.data?.metaData)
            }
        }
        else {
            toast.error(res.data.message)
        }
    }

    const HandleAddComment = async () => {
        let res;
        try {
            res = await axios.post(`${serverLink}/comments/add`,
                {
                    postId: postID,
                    postOwnerId: postOwnerId,
                    comment: newComment
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
        if (res?.status === 200 || 201) {
            if (res.data.data) {
                toast.success("Comment added")
            }
            setNewComment("")
        }
        else {
            toast.error(res.data.message)
        }
        setShowComments(false)
    }

    return (
        <div className='post-box'>
            <div className='post-box-top-section-cont'>
                <div className='post-box-top-section'>
                    <img src={userPhotoSrc} alt=''/>
                    <h4 onClick={() => navigate(`/user/${username}`)}>{username}</h4>
                </div>
            </div>
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
            {
                caption &&
                <div className='content'>
                    <h5 onClick={() => navigate(`/user/${username}`)}>{username}</h5>
                    <p>{caption}</p>
                </div>
            }
            {
                showComments &&
                <div className='comment-section'>
                    <p>{metaData?.comments?.length} comments</p>
                    {
                        metaData?.comments?.map((comment, index) => {
                            return (
                                <div className='comment-box' key={index}>
                                    <h4 onClick={() => navigate(`/user/${comment?.user?.username}`)}>{comment?.user?.username}</h4>
                                    <p>{comment?.comment}</p>
                                </div>
                            )
                        })
                    }

                </div>
            }
            <div className='comment-section'>
                <div className='add-comment'>
                    <input placeholder='Add your comment' value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                    <img src={send} onClick={HandleAddComment} />
                </div>
            </div>
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