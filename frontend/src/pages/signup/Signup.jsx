import React, { useState } from 'react'
import GenderCheckBox from './GenderCheckbox'
import { Link } from 'react-router-dom'
import "./Signup.css"
import useSignup from '../../hooks/useSignup'
import { CircularProgress } from '@mui/material'

const Signup = () => {

    const [inputs, setInputs] = useState({
        fullname: '',
        username: '',
        password: '',
        confirmPassword: '',
        gender: '',
    });

    const handleCheckboxChange = (gender) => {
        setInputs({...inputs, gender})  
    }

    const {loading, signup} = useSignup();

    const handleSubmit = async(e) => {
        e.preventDefault();
        await signup(inputs);
    }

  return (
    <>
        <div className='signup-parent-container'>
            <div className='signup-child-container glass'>
                <div className='signup-left-container'>
                    <div>
                        <div className='signup-left-header'>
                            <img src="/background/logo.png" alt="" />
                            <span>Xielchat</span>
                        </div>
                        <svg viewBox="0 0 1200 150">
                            <text x="28%" y="50%" dy=".35em" textAnchor="middle">
                                WELCOME
                            </text>
                        </svg>
                        <div className='signup-title'> Sign Up</div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className='signup-element-container'>
                            <label>Full Name</label>
                            <input type="text" placeholder='Enter Fullname' 
                                value={inputs.fullname}
                                onChange={(e) => setInputs({...inputs, fullname: e.target.value})}
                            />
                        </div>

                        <div className='signup-element-container'>
                            <label>Username</label>
                            <input type="text" placeholder='Enter Username' 
                                value={inputs.username}
                                onChange={(e) => setInputs({...inputs, username: e.target.value})}
                            />
                        </div>

                        <div className='signup-element-container'>
                            <label>Password</label>
                            <input type="password" placeholder='Enter Password'
                                value={inputs.password}
                                onChange={(e) => setInputs({...inputs, password: e.target.value})}
                            />
                        </div>

                        <div className='signup-element-container'>
                            <label>Confirm Password</label>
                            <input type="password" placeholder='Confirm Password'
                                value={inputs.confirmPassword}
                                onChange={(e) => setInputs({...inputs, confirmPassword: e.target.value})}
                            />
                        </div>

                        <GenderCheckBox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />

                        <Link to="/login" className='login-link'>
                            Already have an account?
                        </Link>
                        
                        <div className='form-btn'>
                            <button className='signup-btn' disabled={loading} >
                                {loading ? <CircularProgress color="inherit" size="30px"/> : "Signup"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className='signup-right-container'>
                    <img src="/background/p1.jpg" alt=""/>
                </div>
            </div>
        </div>
    </>
  )
}

export default Signup