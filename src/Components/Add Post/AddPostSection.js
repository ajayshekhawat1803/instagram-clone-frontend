// components/posts/AddPost.js
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './AddPostSection.css'
import HomeBottom from '../Home/HomeBottom';
import { context } from '../../App';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddPost = () => {
    const navigate = useNavigate()
    const [loading, setloading] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileObjectUrl, setSelectedFileObjectUrl] = useState('');
    const [caption, setCaption] = useState('')
    const [validationErrors, setValidationErrors] = useState({})
    const { isLoggedin, loggedInUser, token, serverLink, loggedInUserID, serverLinkforImages } = useContext(context)

    useEffect(() => {
        if (!isLoggedin) {
            navigate('/login')
        }
    }, [isLoggedin])

    const HandleAddPost = async (e) => {
        e.preventDefault()
        setloading(true)
        let res;
        try {
            res = await axios.post(`${serverLink}/posts/create`, {
                user: loggedInUserID,
                caption: caption,
                posts: selectedFile
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
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
                setloading(false)
            }
        }
        console.log(res);
        if (res?.status === 201) {
            toast.success(`Post Created Successfully`)
            navigate('/account')
        }
        if (res?.status > 400 && res?.status <= 499) {
            if (res?.data.message) {
                const field = res.data.message.split(' ')[0];
                setValidationErrors({ [field]: res.data.message })
            }
        }
        if (res?.status === 400 && Array.isArray(res?.data.message)) {
            let errs = {}
            res.data.message.forEach(mess => {
                const field = mess.split(' ')[0];
                errs[field] = mess;
            });
            setValidationErrors(errs)
        }
        setloading(false)
    }

    return (
        <>
            <div className='add-post-section'>
                <div className='add-post'>
                    <h2>Add Post</h2>
                    <input type='file' name='file'
                        onChange={(e) => {
                            setSelectedFile(e.target.files[0]);
                            setSelectedFileObjectUrl((URL.createObjectURL(e.target.files[0])))
                            setValidationErrors({})
                        }} />
                    <h5>{validationErrors?.file ? validationErrors?.file : ""}</h5>
                    {
                        selectedFile && <>
                            <div className='post-image-box'>
                                <img src={selectedFileObjectUrl ? selectedFileObjectUrl : ""} />
                                <textarea placeholder='Add Caption Here' name='caption' value={caption}
                                    onChange={(e) => {
                                        setCaption(e.target.value)
                                    }} />
                                <button disabled={loading}
                                    onClick={HandleAddPost}
                                >{loading ? 'Adding Post' : 'Add Post'}</button>
                            </div>
                        </>
                    }
                </div>
                <HomeBottom />
            </div>
        </>
    );
};

export default AddPost;