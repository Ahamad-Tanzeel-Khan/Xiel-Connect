import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import "./Login.css"
import useLogin from '../../hooks/useLogin';
import CircularProgress from '@mui/material/CircularProgress';

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const {loading, login} = useLogin();

    const handleSubmit = async(e) => {
        e.preventDefault();
        await login(username, password)
    }

  return (
    <>
        <div className='login-parent-container'>
            <div className='login-child-container glass'>
                <div className='login-left-container'>
                    <div>
                        <div className='login-left-header'>
                            <img src="/background/logo.png" alt="logo" />
                            <span>Xielchat</span>
                        </div>
                        <svg viewBox="0 0 1200 150">
                            <text x="42%" y="50%" dy=".35em" textAnchor="middle">
                                WELCOME BACK
                            </text>
                        </svg>
                        <div className='login-title'> Login</div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className='login-element-container'>
                            <label>Username</label>
                            <input type="text" placeholder='Enter Username' 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className='login-element-container'>
                            <label>Password</label>
                            <input type="password" placeholder='Enter Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className='login-link-container'>
                            <Link to="/signup" >
                                Don't have an account?
                            </Link>
                        </div>
                        
                        <div className='form-btn'>
                            <button className='login-btn' disabled={loading}>
                                {loading ? <CircularProgress color="inherit" size="30px"/> : "Login"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className='login-right-container'>
                    <img src="/background/p1.jpg" alt=""/>
                </div>
            </div>
        </div>
    </>
  )
}

export default Login