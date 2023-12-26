import React from 'react'
import './post.css'
import { useNavigate } from 'react-router-dom'
import heart from '../../Assets/heart.png'
import comment from '../../Assets/comment.png'

const PostComponent = (prop) => {
    const { src, postID, caption, username } = prop
    return (
        <div className='post-box'>
            <div className='post-img-box'>
                <img src={src} />
            </div>
            <div className='metaData-section'>
                <img src={heart} alt='like' />
                <img src={comment} alt='comment' />
            </div>
            <div className='content'>
                <h5>{username}</h5>
                <p>{caption}</p>
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