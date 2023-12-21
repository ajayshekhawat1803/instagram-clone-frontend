import React, { useContext, useEffect } from 'react'
import { context } from '../../App'
import { useNavigate } from 'react-router-dom'
import HomeTop from './HomeTop'
import HomeBottom from './HomeBottom'
import Cookies from 'js-cookie'

const Home = () => {
  const { isLoggedin } = useContext(context)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedin) {
      console.log('navigated');
      navigate('/login')
    }
    else {
      console.log('not navigated logged in ');
    }
  }, [])


  return (
    <div className='home-page'>
      <HomeTop />
      <div className='home'>
        Home
        <button onClick={()=>Cookies.remove('userData')}>logout</button>
      </div>
      <HomeBottom />
    </div>
  )
}

export default Home