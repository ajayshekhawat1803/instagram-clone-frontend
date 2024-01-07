import React, { useContext, useEffect, useState } from 'react'
import './EditProfile.css'
// import userIcon from '../../../Assets/user-profile.png'
import userIcon from '../../../Assets/user-profile.png'
import { toast } from 'react-toastify'
import axios from 'axios'
import { context } from '../../../App'
import { useNavigate } from 'react-router-dom'


const EditProfile = (prop) => {
  const { username, EditProfileStatus, SetEditProfileStatus } = prop;
  const { isLoggedin, loggedInUser, token, serverLink, loggedInUserID, serverLinkforImages } = useContext(context)
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({})
  const [validationError, setValidationError] = useState({})
  const [profilePic, setprofilePic] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    let res;
    try {
      res = await axios.get(`${serverLink}/user/getuser-for-edit`,
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
    if (res?.status === 200) {
      setUserData(res.data?.data)
      if (res?.data?.data?.photo) {
        setprofilePic(`${serverLinkforImages}/uploads/${loggedInUserID}/photo/${res?.data?.data?.photo}`)
      }
    }
    else {
      toast.error(res.data.message)
    }
  }

  const HandleUserUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    let res;
    try {
      res = await axios.patch(`${serverLink}/user/edit`, userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
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
        setLoading(false)
      }
      console.log(error.response);
    }
    if (res?.status === 200) {
      console.log(res.data);
      toast.success('Details updated successfully')
      SetEditProfileStatus(false)
      // setRegisteredID(res.data.data._id)
      // navigate('/login')
    }
    else if (res?.status > 400 && res?.status <= 499) {
      if (res?.data.message) {
        const field = res.data.message.split(' ')[0];
        setValidationError({ [field]: res.data.message })
      }
    }
    else if (res?.status === 400 && Array.isArray(res?.data.message)) {
      let errs = {}
      res.data.message.forEach(mess => {
        const field = mess.split(' ')[0];
        errs[field] = mess;
      });
      setValidationError(errs)
    }
    else {
      toast.error(res.data.message)
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    let { name, value } = e.target;
    setUserData({ ...userData, [name]: value })
  }

  return (
    <div className='edit-profile-cont'>
      <h3>Your Details</h3>
      <div className='user-details-form'>
        <div className="profile-picture-container">
          <img src={profilePic || userIcon} alt='User profile' />
          <input
            type="file"
            name="photo"
            className="profile-photo-input"
            onChange={(e) => {
              setUserData({ ...userData, photo: e.target.files[0] })
              if (e.target.files[0]) {
                setprofilePic(URL.createObjectURL(e.target.files[0]))
              }
            }}
          />
        </div>
        <h4 id='add-profile-photo-heading'>Click to change</h4>
        <span>{validationError.photo ? validationError.photo : ''}</span>

        <input
          type='text'
          placeholder='Your name'
          value={userData.name}
          name='name'
          onChange={handleChange}
        />
        <span>{validationError.name ? validationError.name : ''}</span>

        <input
          type='text'
          placeholder='Username'
          value={userData.username}
          name='username'
          onChange={handleChange}
        />
        <span>{validationError.username ? validationError.username : ''}</span>

        <input
          type='email'
          placeholder='Email'
          value={userData.email}
          name='email'
          onChange={handleChange}
        />
        <span>{validationError.email ? validationError.email : ''}</span>

        <input
          type='date'
          value={userData.dob}
          name='dob'
          onChange={handleChange}
        />
        <span>{validationError.dob ? validationError.dob : ''}</span>

        <input
          type='number'
          placeholder='Mobile Number'
          value={userData.mobile}
          name='mobile'
          onChange={handleChange}
        />
        <span>{validationError.mobile ? validationError.mobile : ''}</span>

        <textarea
          placeholder='Describe yourself'
          value={userData.bio}
          name='bio'
          onChange={handleChange}
        />
        <span>{validationError.bio ? validationError.bio : ''}</span>

        <input  type='submit' value='Update' onClick={HandleUserUpdate} disabled={loading ? true : false} />
      </div>
    </div>
  )
}

export default EditProfile
