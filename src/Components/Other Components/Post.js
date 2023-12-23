import React from 'react'
import './post.css'

const PostComponent = (prop) => {
    return (
        <div className='post-box'>
            <div className='post-img-box'>
                <img src={prop.src} />
            </div>
            <div className='content'>
                <h5>{prop.username || ''}</h5>
                <p>{prop.caption || ''}</p>
            </div>
        </div>
    )
}

export const ProfilePostComponent = (prop) => {
    return (
        <div className='post-box-profile'>
            <div className='post-img-box'>
                <img src={prop.src} />
            </div>
        </div>
    )
}

export default PostComponent