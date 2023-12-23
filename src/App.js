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
    console.log(serverLink);
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
  return (
    <>
      <BrowserRouter>
        <context.Provider value={{ token, setToken, isLoggedin, loggedInUser, serverLink, serverLinkforImages, setloggedInUser, setIsLoggedIn, setloggedInUserID, loggedInUserID }}>
          <ToastContainer autoClose={1500} position='top-right' bodyClassName="custom-toast-body"
            toastStyle={{
              background: '#333',
              color: '#fff',
            }} />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/account' element={<Account />} />
            <Route path='/post' element={<AddPost />} >
              <Route path='/post/step-2' element={<h3>Hello</h3>} />
            </Route>
          </Routes>
        </context.Provider>
      </BrowserRouter >
    </>
  );
}

export default App;