import { createContext, useEffect, useState } from 'react';
import './App.css';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';
import Signup from './Components/Signup/Signup';
import Account from './Components/Account/Account';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddPost from './Components/Add Post/AddPostSection';
import Search from './Components/Search/Search';
import UserAccount from './Components/User Account/UserAccount';
import AllPosts from './Components/Other Components/AllPosts';
import axios from 'axios';
import Notifications from './Components/notifications/Notifications';

export const context = createContext({});
function App() {
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('')
  const [loggedInUser, setloggedInUser] = useState('')
  const [loggedInUserID, setloggedInUserID] = useState('')
  const serverLink = process.env.REACT_APP_SERVER_URL;
  const serverLinkforImages = serverLink?.split('/api/v1')[0]

  useEffect(() => {
    let storedUserData;
    try {
      storedUserData = JSON.parse(Cookies.get('userData'));
    } catch (error) {
      // console.log('didnt got cookies app.js');
    }
    if (storedUserData) {
      setToken(storedUserData.token)
      setloggedInUser(storedUserData.username)
      setloggedInUserID(storedUserData._id)
      setIsLoggedIn(true)
    }
  }, []);

  // This function is just to keep the server live so that it wont go to sleep mode due to inactive requests
  // setInterval(() => {
  //   axios.get(`${serverLink}/health`)
  // }, 840000);

  return (
    <>
      <BrowserRouter>
        <context.Provider value={{ token, setToken, setIsLoggedIn, isLoggedin, loggedInUser, serverLink, serverLinkforImages, setloggedInUser, setIsLoggedIn, setloggedInUserID, loggedInUserID }}>
          <ToastContainer autoClose={1500} position='top-right' bodyClassName="custom-toast-body"
            toastStyle={{
              background: '#333',
              color: '#fff',
            }} />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/search' element={<Search />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/notifications' element={<Notifications />} />
            <Route path='/account' element={<Account />} />
            <Route path='/post' element={<AddPost />} />
            <Route path='/user/:username' element={<UserAccount />} />
            <Route path='/posts/:username' element={<AllPosts />} />
          </Routes>
        </context.Provider>
      </BrowserRouter >
    </>
  );
}

export default App;
