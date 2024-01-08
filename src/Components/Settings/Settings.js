import React, { useContext, useEffect } from 'react'
import HomeBottom from '../Home/HomeBottom'
import Cookies from 'js-cookie';
import { context } from '../../App';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { isLoggedin,setIsLoggedIn } = useContext(context)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedin) {
      navigate('/login')
    }
  }, [isLoggedin])
    return (
        <div className='settings-main-cont'>
            <div className='home'>
                Click to logout
                <button onClick={() => { Cookies.remove('userData'); setIsLoggedIn(false) }}>logout</button>
            </div>
            <HomeBottom />
        </div>
    )
}

export default Settings