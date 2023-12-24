import React, { useContext, useEffect, useState } from 'react'
import './Followers.css'
import close from '../../Assets/cancel.png'
import { context } from '../../App';
import { toast } from 'react-toastify';
import axios from 'axios';

const Followers = (props) => {
    const { id, SetShowFollowers, ShowFollowers } = props;
    const [followers, setFollowers] = useState([])
    const { serverLink, token } = useContext(context)

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
            <div className='allFollowers'>
                {
                    followers.map((follower, index) => {
                        return <h3 key={index}>{follower}</h3>
                    })
                }
                {
                    followers?.length < 1 ? "No Followers" : ""
                }
            </div>
        </div>
    )
}

export default Followers;
