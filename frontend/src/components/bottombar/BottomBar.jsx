import React, { useState } from 'react'
import "./BottomBar.css"
import { PiChatTeardropDotsBold } from "react-icons/pi";
import { RiGroupLine } from "react-icons/ri";
import { RiContactsLine } from "react-icons/ri";
import { FaRegStar } from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";
import useLogout from '../../hooks/useLogout';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuthContext } from '../../context/AuthContext';

const BottomBar = ({ onSelect }) => {
  const { loading, logout } = useLogout();
  const [selected, setSelected] = useState('chat');
  const {authUser} = useAuthContext();

  const handleIconClick = (icon) => {
    setSelected(icon);
    onSelect(icon);
  };

  return (
    <div className='bottombar'>
      <div className='bottombar-elements'>
        <PiChatTeardropDotsBold
          onClick={() => handleIconClick('chat')}
          className='bottombar-svg'
          style={{
            backgroundColor: selected === 'chat' ? "#3e4a56" : 'transparent',
            borderRadius: "10px",
            color: selected === 'chat' ? "#5271ff" : '#a4aecd'
          }}
        />
        <RiGroupLine
          onClick={() => handleIconClick('groups')}
          className='bottombar-svg'
          style={{
            backgroundColor: selected === 'groups' ? "#3e4a56" : 'transparent',
            borderRadius: "10px",
            color: selected === 'groups' ? "#5271ff" : '#a4aecd'
          }}
        />
        <RiContactsLine
          onClick={() => handleIconClick('users')}
          className='bottombar-svg'
          style={{
            backgroundColor: selected === 'users' ? "#3e4a56" : 'transparent',
            borderRadius: "10px",
            color: selected === 'users' ? "#5271ff" : '#a4aecd'
          }}
        />

        <FaRegStar
          onClick={() => handleIconClick('favorites')}
          className='bottombar-svg'
          style={{
            backgroundColor: selected === 'favorites' ? "#3e4a56" : 'transparent',
            borderRadius: "10px",
            color: selected === 'favorites' ? "#5271ff" : '#a4aecd'
          }}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          {!loading ? (
            <TbLogout2 className='bottombar-svg logout-icon'
              onClick={logout}
            />
          ) : (
            <CircularProgress color="inherit" size="30px" />
          )}
        </div>
        <img className='bottombar-profile' src={authUser.profilePic} alt="" />
      </div>
    </div>
  )
}

export default BottomBar