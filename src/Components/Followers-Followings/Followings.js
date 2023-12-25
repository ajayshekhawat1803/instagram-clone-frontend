import React, { useContext, useEffect, useState } from 'react'
import './Followers.css'
import close from '../../Assets/cancel.png'
import { context } from '../../App';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Followings = (props) => {
    const { id, SetShowFollowings, ShowFollowings } = props;
    const [followings, setFollowings] = useState([])
    const { serverLink, token, serverLinkforImages } = useContext(context)
    const navigate = useNavigate()
    useEffect(() => {
        FetchFollowings(id)
    }, [])

    const FetchFollowings = async (id) => {
        let res;
        try {
            res = await axios.get(`${serverLink}/followings/${id}`, {
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
            setFollowings(res?.data?.data?.followings)
        }
        if (res?.status >= 400 && res?.status <= 499) {
            toast.error(`${res?.data.message}`)
        }
    }

    return (
        <div className='followings-box'>
            <div className='top'>
                <h3>Followings</h3>
                <img
                    src={close}
                    alt='Close'
                    onClick={() => SetShowFollowings(!ShowFollowings)} />
            </div>
            <div className='allFollowings '>
                {
                    followings?.map((following) => {
                        return (
                            <div className='following-user-box' key={following._id}
                                onClick={() => {
                                    SetShowFollowings(false)
                                    navigate(`/user/${following.username}`)
                                }}>
                                <img src={`${serverLinkforImages}/uploads/${following._id}/photo/${following.photo}`} />
                                <div>
                                    <h2>{following.username}</h2>
                                    <h3>{following.name}</h3>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    followings?.length < 1 ? "No Followings" : ""
                }
            </div>
        </div >
    )
}

export default Followings;
