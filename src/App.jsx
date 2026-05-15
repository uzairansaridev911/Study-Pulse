import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Pages/Home'
import Login from '../Pages/Login'
import Signup from '../Pages/Signup'
import Forgotten from '../Pages/Forgotten'
import About from '../Pages/About'
import Services from '../Pages/Services'
import Contact from '../Pages/Contact'
import LearnMore from '../Pages/lm'
import Dashboard from '../Pages/Dashboard'
import Profile from '../Pages/Profile'
import OTPVerification from '../Pages/OTPVerification'
import ChangePassword from '../Pages/ChangePass'
import { Link, useLocation } from 'react-router-dom'
import LocomotiveScroll from 'locomotive-scroll';
import Thanks from '../Pages/Thanks'
import { UserProvider } from '../Context/UserContext'
const locomotiveScroll = new LocomotiveScroll();
const App = () => {
  const location = useLocation()
  
  
  return (
    <div>
      <UserProvider>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/Login' element={<Login />}/>
        <Route path='/Signup' element={<Signup/>}/>
        <Route path='/ForgottenPassword' element={<Forgotten/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/Services' element={<Services/>}/>
        <Route path='/Contact' element={<Contact/>}/>
        <Route path='/Learnmore' element={<LearnMore/>} />
        <Route path='/otp' element={<OTPVerification/>} />
        <Route path='/Dashboard' element={<Dashboard/>} />
        <Route path='/Profile' element={<Profile/>} />
        <Route path='/Thanks' element={<Thanks/>} />
        <Route path='/Change_Password' element={<ChangePassword/>} />
        {/* OTP routes (support both old/new URLs) */}
        
        <Route
          path='*'
          element={
            <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Route not found</h2>
              <p style={{ marginTop: 8 }}>
                Current path: <code>{location?.pathname}</code>
              </p>
              <p style={{ marginTop: 12 }}>
                Try: <Link to="/otp">/otp</Link> or <Link to="/Login">/Login</Link>
              </p>
            </div>
          }
        />
      </Routes>
      </UserProvider>
    </div>
  )
}

export default App