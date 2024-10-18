
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import Login from './Pages/Login';
import Register from './Pages/Register';
import LandingPage from './Pages/Landing';
import Dashboard from './Pages/dashboard';
import VerifyOTP from './Pages/VerifyOTP';
import UpdateProfile from './Pages/UpdateProfile';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/updateProfile' element={<UpdateProfile />} />
        <Route path='/verifyOTP' element={<VerifyOTP />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App;
