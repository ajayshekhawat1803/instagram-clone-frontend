import { createContext, useState } from 'react';
import './App.css';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export const context = createContext({});
function App() {
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('')

  return (
    <>
      <BrowserRouter>
        <context.Provider value={{ token, setToken, isLoggedin, setIsLoggedIn }}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </context.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
