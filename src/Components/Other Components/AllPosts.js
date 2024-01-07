    import React, { useContext, useEffect, useState } from 'react'
import { context } from '../../App';
import { useNavigate, useParams } from 'react-router-dom';
import './AllPosts.css'
import backIcon from '../../Assets/back-icon.png'
import { toast } from 'react-toastify';
import axios from 'axios';
import PostComponent from './Post';
import userPic from '../../Assets/user-profile.png'
import HomeBottom from '../Home/HomeBottom';

const AllPosts = (props) => {
    const { isLoggedin, loggedInUser, token, serverLink, loggedInUserID, serverLinkforImages } = useContext(context)
    const { username: paramUsername } = useParams(); // Get the username from the URL parameters
    const [AllPosts, setAllPosts] = useState([])
    const [userID, setUserID] = useState("")
    const [userPhoto, setUserPhoto] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoggedin) {
            navigate('/login');
        } else {
            getUserPosts(paramUsername)
        }
    }, [isLoggedin, paramUsername]);

    const getUserPosts = async (username) => {
        let res;
        try {
            res = await axios.get(`${serverLink}/posts/${username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

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
        if (res.status === 200) {
            setUserID(res?.data?.data?._id)
            setAllPosts(res?.data?.data?.posts)
            setUserPhoto(res?.data?.data?.photo)
        }
        else {
            toast.error(res?.data?.message);
        }
    }


    return (
        <div className='container-main'>
            <div className='AllUserPosts'>
                <div className='top'>
                    <img src={backIcon} alt='back' onClick={() => navigate(-1)} />
                    <h2>Posts</h2>
                </div>
                <div className='All-posts-section'>
                    {
                        AllPosts?.map((post) => {
                            return (
                                <PostComponent
                                    key={post._id}
                                    post={post}
                                    postOwnerId={userID}
                                    username={paramUsername}
                                    src={`${serverLinkforImages}/uploads/${userID}/posts/${post?.files[0]}`}
                                    userPhoto={userPhoto?`${serverLinkforImages}/uploads/${userID}/photo/${userPhoto}`:userPic}
                                />
                            )
                        })
                    }
                </div>
                <HomeBottom/>
            </div>
        </div>
    )
}

export default AllPosts;