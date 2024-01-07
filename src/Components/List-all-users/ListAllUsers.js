import React, { useContext, useEffect, useState } from 'react'
import backIcon from '../../Assets/back-icon.png'
import HomeBottom from '../Home/HomeBottom'
import './ListAllUsers.css'
import { context } from '../../App'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import UserBoxComponent from './UserBoxComponent'

const ListAllUsers = () => {
    const [ActiveUsers, setActiveUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { isLoggedin, token, serverLink } = useContext(context)

    useEffect(() => {
        if (!isLoggedin) {
            navigate('/login');
        } else {
            fetchAllUsers()
        }
    }, [isLoggedin]);


    const fetchAllUsers = async () => {
        setLoading(true)
        let res;
        try {
            res = await axios.get(`${serverLink}/user/get-all-users`,
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
            setActiveUsers(res.data.data)
        }
        else {
            toast.error(res.data.message)
        }
        setLoading(false)
    }



    return (
        <div className='ListAllUsers-main-cont'>
            <div className='AllUserPosts'>
                <div className='top'>
                    <img src={backIcon} alt='back' onClick={() => navigate(-1)} />
                    <h2>Active users</h2>
                </div>
                <div className='list-all-users-main'>
                    {
                        loading ?
                            <h3>Loading available users....</h3>
                            :
                            ActiveUsers?.length > 0
                                ?
                                <div className='all-users-cont'>
                                    {
                                        ActiveUsers?.map((user, index) => {
                                            return (
                                                <UserBoxComponent
                                                    user={user}
                                                    key={index}
                                                />
                                            )
                                        })
                                    }
                                </div>
                                :
                                <h3>No Users Found</h3>
                    }
                </div>
            </div>
            <HomeBottom />
        </div>
    )
}


export default ListAllUsers