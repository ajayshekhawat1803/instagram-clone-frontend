import { createContext, useEffect, useState } from 'react';
import './App.css';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';
import Signup from './Components/Signup/Signup';
import Account from './Components/Account/Account';
import SuccessMessage from './Components/Responses/SuccessMessage';

export const context = createContext({});
function App() {
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('')
  const [loggedInUser, setloggedInUser] = useState('')
  const [loggedInUserID, setloggedInUserID] = useState('')
  const serverLink = `http://localhost:5000/api/v1`
  const serverLinkforImages = serverLink.split('/api/v1')[0]

  const [succMessage, setSuccMessage] = useState('')

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
  return (
    <>
      <BrowserRouter>
        <context.Provider value={{ token, setToken, isLoggedin, loggedInUser, serverLink, serverLinkforImages,setloggedInUser, setIsLoggedIn, setloggedInUserID, loggedInUserID }}>
          {/* <SuccessMessage message={succMessage} /> */}
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/account' element={<Account />} />
          </Routes>
        </context.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
