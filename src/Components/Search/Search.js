import React, { useContext, useEffect, useState } from 'react'
import './Search.css'
import HomeBottom from '../Home/HomeBottom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { context } from '../../App'

const Search = () => {
    const [searchValue, setSearchValue] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const { isLoggedin, loggedInUser, token, serverLink, loggedInUserID, serverLinkforImages } = useContext(context)
    const navigate = useNavigate()


    useEffect(() => {
        if (!isLoggedin) {
            navigate('/login')
        }
        else {
            handleSearch()
        }
    }, [searchValue])
    const handleSearch = async () => {
        if (!searchValue) {
            setSearchResults([])
            return;
        }
        let res;
        try {
            res = await axios.get(`${serverLink}/search/${searchValue}`, {
                headers: {
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
            }
        }
        if (res?.status === 200) {
            setSearchResults(res?.data?.data)
        }
        if (res?.status > 400 && res?.status <= 499) {
            toast.error(`${res.data?.message}`)
            if (res?.status === 401) {
                navigate('/login')
            }
        }
    }
    return (
        <div className='container-main'>
            <div className='search-container'>
                <input
                autoFocus
                    name='searchValue'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
                    placeholder='Search Here...' />
                <div className='search-results'>
                    {
                        searchResults?.length > 0
                            ? <>
                                {
                                    searchResults.map((user) => {
                                        return (
                                            <div className='searched-user-box' key={user._id}
                                            onClick={()=>navigate(`/user/${user.username}`)}>
                                                <img src={`${serverLinkforImages}/uploads/${user._id}/photo/${user.photo}`} />
                                                <div>
                                                    <h2>{user.username}</h2>
                                                    <h3>{user.name}</h3>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </>
                            :
                            searchValue && searchResults.length < 1
                                ? <h2>No Matching User</h2>
                                : <h2>Searched results will appear here....</h2>
                    }
                </div>
                <button id='viewalluserbtn'
                onClick={()=>navigate('/all-available-users')}>View all users</button>
            </div>
            <HomeBottom />
        </div >
    )
}

export default Search