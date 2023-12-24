import React, { useContext, useEffect } from 'react'
import { context } from '../../App'
import { useNavigate } from 'react-router-dom'
import HomeTop from './HomeTop'
import HomeBottom from './HomeBottom'
import Cookies from 'js-cookie'

const Home = () => {
  const { isLoggedin,setIsLoggedIn } = useContext(context)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedin) {
      navigate('/login')
    }
  }, [isLoggedin])


  return (
    <div className='home-page'>
      <HomeTop />
      <div className='home'>
        Home
        <button onClick={()=>{Cookies.remove('userData');setIsLoggedIn(false)}}>logout</button>
      </div>
      <HomeBottom />
    </div>
  )
}

export default Home