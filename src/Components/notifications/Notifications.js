import React, { useContext, useEffect, useState } from 'react'
import './Notifications.css'
import HomeBottom from '../Home/HomeBottom'
import userPic from '../../Assets/user-profile.png'
import axios from 'axios'
import { toast } from 'react-toastify'
import { context } from '../../App'
import { useNavigate } from 'react-router-dom'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const { serverLink, token } = useContext(context)

  useEffect(() => {
    if (token) {
      fetchNotifications()
    }
  }, [token])

  const fetchNotifications = async () => {
    setLoading(true)
    let res;
    try {
      res = await axios.get(`${serverLink}/notifications`,
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
      setLoading(false)
    }
    if (res?.status === 200) {
      setNotifications(res.data.data);
    }
    else {
      toast.error(res.data.message)
    }
    setLoading(false)
  }
  return (
    <div className='notifications-cont-main'>
      <h3 id='main-head-notifications'>Notifications</h3>
      {
        loading
          ?
          <h4 id='loading-notifications-heading'>Loading Notifications....</h4>
          :
          <div className='notification-cont'>
            {
              notifications?.length > 0
                ?
                <>
                  {
                    notifications.map((notification, index) => {
                      return (
                        <NotificationComponent
                          key={index}
                          user={notification?.from}
                          type={notification?.type}
                          postId={notification?.postId}
                        />
                      )
                    })
                  }
                </>
                :
                <h4 id='no-notifications-heading'>No notifications !!</h4>
            }
          </div>
      }
      <HomeBottom />
    </div>
  )
}


const NotificationComponent = (prop) => {
  let { user, type, postId } = prop;
  const [notificationContent, setNotificationContent] = useState("")
  const [isFollowing, setIsFollowing] = useState(false)
  const [FetchedUserFollowers, setFetchedUserFollowers] = useState([])
  const [FetchedUserName, setFetchedUserName] = useState("")
  const [FetchedUserPhoto, setFetchedUserPhoto] = useState("")
  const [FetchedPost, setFetchedPost] = useState('')
  const { serverLink, token, loggedInUserID, serverLinkforImages } = useContext(context)
  const navigate = useNavigate()
  useEffect(() => {
    fetchUser()
    setNotificationContentFunc()
    if (postId) {
      fetchPost()
    }
  }, [])

  useEffect(() => {
    if (FetchedUserFollowers?.includes(loggedInUserID)) {
      setIsFollowing(true)
    }
    else {
      setIsFollowing(false)
    }
  }, [FetchedUserFollowers])

  const setNotificationContentFunc = () => {
    if (type === "like") {
      setNotificationContent(" liked your post")
    }
    if (type === "comment") {
      setNotificationContent(" commented on your post")
    }
    if (type === "follow") {
      setNotificationContent(" has started following you")
    }
  }

  const fetchUser = async () => {
    let res;
    try {
      res = await axios.get(`${serverLink}/user/get-for-notification/${user}`,
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
      setFetchedUserName(res?.data?.data?.username);
      setFetchedUserFollowers(res?.data?.data?.followers);
      if (res?.data?.data?.photo) {
        setFetchedUserPhoto(res?.data?.data?.photo);
      }
    }
    else {
      toast.error(res.data.message)
    }
  }

  const fetchPost = async () => {
    let res;
    try {
      res = await axios.get(`${serverLink}/posts/post/${postId}`,
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
      if (res?.data?.data?.files[0]) {
        setFetchedPost(res?.data?.data?.files[0])
      }
    }
    else {
      toast.error(res.data.message)
    }
  }

  const handleFollow = async () => {
    // In case if he is not already following
    if (!isFollowing) {
      let res;
      try {
        res = await axios.post(`${serverLink}/followers/startfollowing`, {
          self: loggedInUserID,
          other: user
        },
          {
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
        setFetchedUserFollowers(res?.data?.data)
      }
      else {
        toast.error(res?.data?.message); // Show an error toast
      }
    }
    // in case he is already following then he will be removed
    else {
      let res;
      try {
        res = await axios.post(`${serverLink}/followers/removefollowing`, {
          self: loggedInUserID,
          other: user
        },
          {
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
        setFetchedUserFollowers(res?.data?.data)
      }
      else {
        toast.error(res?.data?.message); // Show an error toast
      }
    }
  }

  const HandleNotificationClick = async (e) => {
    if (type === "follow") {
      if (e.target.name !== "follow-btn") {
        navigate(`/user/${FetchedUserName}`)
      }
    }
    else {
      navigate(`/post/${postId}`)
    }
  }

  return (
    <div className='notification-box' onClick={HandleNotificationClick}>
      <img src={FetchedUserPhoto ? FetchedUserPhoto : userPic} alt='user' className='user-pic-notification ' />
      <div className='notification-content'>
        <p> <b>{FetchedUserName}</b> {notificationContent}</p>
      </div>
      {
        type === "follow"
          ?
          <button name='follow-btn' className={isFollowing ? 'following-btn' : 'follow-btn'} onClick={handleFollow}>{isFollowing ? 'Following' : 'Follow'}</button>
          :
          <img alt='post' src={FetchedPost} className='post-img-notification' />
      }
    </div>
  )
}

export default Notifications