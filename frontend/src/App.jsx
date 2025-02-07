import React from 'react'
import Signup from './pages/signup/Signup'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import { Toaster } from 'react-hot-toast'
import { useAuthContext } from './context/AuthContext'

const App = () => {
  const {authUser} = useAuthContext();
  return (
    <>
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" /> } />
        <Route path='/login' element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route path='/signup' element={authUser ? <Navigate to="/" /> : <Signup />} />
        </Routes>
      <Toaster />
    </>
  )
}

export default App