import React, { useContext, useEffect } from 'react'
import { context } from '../../App'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { isLoggedin } = useContext(context)
  const navigate = useNavigate()
  useEffect(() => {
    if (!isLoggedin) {
      console.log('navigated');
      navigate('/login')
    }
    else{
      console.log('not navigated logged in ');
    }
  },[])
  return (
    <div>Home</div>
  )
}

export default Home