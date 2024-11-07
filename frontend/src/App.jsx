import React from 'react'
import Signup from './pages/signup/Signup'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import { Toaster } from 'react-hot-toast'
import { useAuthContext } from './context/AuthContext'
import NewGroup from './pages/newgroup/NewGroup'

const App = () => {
  const {authUser} = useAuthContext();
  return (
    <>
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" /> } />
          <Route path='/login' element={authUser ? <Navigate to="/" /> : <Login />} />
          <Route path='/signup' element={authUser ? <Navigate to="/" /> : <Signup />} />
          <Route path='/create-new-group' element={authUser ? <NewGroup /> : <Navigate to="/login" />} />
        </Routes>
      <Toaster />
    </>
  )
}

export default App