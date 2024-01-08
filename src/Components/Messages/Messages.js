import React from 'react'
import './Messages.css'
import HomeBottom from '../Home/HomeBottom'
import backIcon from '../../Assets/back-icon.png'
import { useNavigate } from 'react-router-dom'

const Messages = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className='messages-cont-main'>
                <div className='AllUserPosts messages-cont'>
                    <div className='top'>
                        <img src={backIcon} alt='back' onClick={() => navigate(-1)} />
                        <h2>Messages</h2>
                    </div>
                    <input placeholder='Search here'/>
                </div>
            </div>
            <HomeBottom />
        </>
    )
}

export default Messages