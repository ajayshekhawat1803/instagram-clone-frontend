import React, { useContext, useEffect, useState } from 'react'
import './Followers.css'
import close from '../../Assets/cancel.png'
import { context } from '../../App';
import { toast } from 'react-toastify';
import axios from 'axios';
import userIcon from '../../Assets/user-profile.png'
import { useNavigate } from 'react-router-dom';

const Followers = (props) => {
    const { id, SetShowFollowers, ShowFollowers } = props;
    const [followers, setFollowers] = useState([])
    const { serverLink, token, serverLinkforImages } = useContext(context)
    const navigate = useNavigate()
    useEffect(() => {
        FetchFollowers(id)
    }, [])

    const FetchFollowers = async (id) => {
        let res;
        try {
            res = await axios.get(`${serverLink}/followers/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
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
        if (res?.status === 200 && res.data?.data) {
            setFollowers(res?.data?.data?.followers)
        }
        if (res?.status >= 400 && res?.status <= 499) {
            toast.error(`${res?.data.message}`)
        }
    }

    return (
        <div className='followers-box'>
            <div className='top'>
                <h3>Followers</h3>
                <img
                    src={close}
                    alt='Close'
                    onClick={() => SetShowFollowers(!ShowFollowers)} />
            </div>
            <div className='allFollowers '>
                {
                    followers?.map((follower) => {
                        return (
                            <div className='follower-user-box' key={follower._id}
                                onClick={() => {
                                    SetShowFollowers(false)
                                    navigate(`/user/${follower.username}`)
                                }}>
                                <img src={follower.photo?`${serverLinkforImages}/uploads/${follower._id}/photo/${follower.photo}`:userIcon} />
                                <div>
                                    <h2>{follower.username}</h2>
                                    <h3>{follower.name}</h3>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    followers?.length < 1 ? "No Followers" : ""
                }
            </div>
        </div >
    )
}

export default Followers;
