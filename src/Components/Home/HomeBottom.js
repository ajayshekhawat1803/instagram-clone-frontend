import React from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import homeIcon from '../../Assets/home.png'
import likeIcon from '../../Assets/heart.png'
import postIcon from '../../Assets/more.png'
import userIcon from '../../Assets/user.png'
import searchIcon from '../../Assets/search.png'

const HomeBottom = () => {
  return (
    <div className='HomeBottom'>
      <Link to='/'><img src={homeIcon} className='footerIcon' ></img></Link>
      <Link to='/search'><img src={searchIcon} className='footerIcon' ></img></Link>
      <Link to='/post'><img src={postIcon} className='footerIcon'></img></Link>
      <Link to='/notifications'><img src={likeIcon} className='footerIcon'></img></Link>
      <Link to='/account'><img src={userIcon} className='footerIcon'></img></Link>
    </div>
  )
}

export default HomeBottom;