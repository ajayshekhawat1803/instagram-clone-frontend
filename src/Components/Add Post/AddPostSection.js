// components/posts/AddPost.js
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AddPost = () => {
    const navigate = useNavigate()
    const [selectedFile, setSelectedFile] = useState(null);
    const [croppedImageData, setCroppedImageData] = useState(null);

    return (
        <div>
            <h1>Add Post</h1>
            <h2> Upload Image</h2>
            <input type='file'
                onChange={(e) => {
                    setSelectedFile(e.target.files[0]);
                    navigate('/post/step-2')
                }} />
                <Outlet/>
        </div>
    );
};

export default AddPost;







// import React, { useContext, useEffect } from 'react'
// import './AddPostSection.css'
// import { context } from '../../App'
// import { useNavigate } from 'react-router-dom'

// const AddPostSection = () => {
//     const { isLoggedin, loggedInUser, token, serverLink, loggedInUserID, serverLinkforImages } = useContext(context)
//     const navigate = useNavigate()

//     useEffect(() => {
//         if (!isLoggedin) {
//             navigate('/login')
//         }
//         else {
//            console.log('Logged in');
//         }
//     }, [isLoggedin])

//     return (
//         <div className='add-post-section'>

//         </div>
//     )
// }


// export default AddPostSection