import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { context } from '../../App'
import HomeBottom from '../Home/HomeBottom'
import './Account.css'
import insta from '../../Assets/instalogo.png'
import settings from '../../Assets/settings.png'

const Account = () => {
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
        <div className='container-main'>
            <div className='account-page'>
                <div className='top'>
                    <Link to='/'><img className='insta' src={insta}></img></Link>
                    <Link to='/'><img src={settings}></img></Link>
                </div>
                <div className='main'>
                    <div className='profile-top'>
                        <div className='profile-pic'>

                        </div>
                        <div className='profile-data-right'>
                            <div className='data-box'>
                                <h2>40</h2>
                                <h4>Posts</h4>
                            </div>
                            <div className='data-box'>
                                <h2>363</h2>
                                <h4>Followers</h4>
                            </div>
                            <div className='data-box'>
                                <h2>344</h2>
                                <h4>Followings</h4>
                            </div>
                        </div>
                    </div>
                    <div className='profile-bio'>
                        <h3>Ajay Singh Shekhawat</h3>
                        <p>hellon hiii iagrihg iggri irigr ninrsgir jsirgir jirgrigj</p>
                    </div>
                    <div className='profile-btns'>
                        <button>Edit Profile</button>
                        <button>Share Profile</button>
                    </div>
                    <div className='posts-section'>

                    </div>
                </div>
                <HomeBottom />
            </div>
        </div>
    )
}

export default Account