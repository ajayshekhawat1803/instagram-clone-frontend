import React, { useContext, useEffect } from 'react'
import { context } from '../../App'
import { useNavigate } from 'react-router-dom'
import HomeTop from './HomeTop'
import HomeBottom from './HomeBottom'
import Cookies from 'js-cookie'
import Feed from '../Feed/Feed'
import Stories from '../Stories/Stories'

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
      {/* <Stories/> */}
     
      <Feed/>
      <HomeBottom />
    </div>
  )
}

export default Home