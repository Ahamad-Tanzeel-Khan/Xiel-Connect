import React, { useState } from 'react';
import { usePopup } from '../../../context/PopupContext';
import { CircularProgress } from '@mui/material';
import useJoinChannel from '../../../hooks/useJoinChannel';


const JoinChannel = () => {
  const { isPopupVisible, popupType, closePopup } = usePopup();
  const {load, joinChannel} = useJoinChannel();
  const [inviteCode, setInviteCode] = useState('');
  

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!inviteCode) return;

    await joinChannel({inviteCode});

  }
 
  if (!isPopupVisible || popupType !== "joinChannel") return null;


  return (
    <div className="create-channel-container">
      <div className="create-channel-content">
        <h2>Join channel</h2>
        <form className='create-channel-form' action="">
          <input
            type="text"
            placeholder="Enter invite code..."
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />

          <div className='create-grp-btn-container'>
            <button onClick={closePopup}>
              Close 
            </button>
            <button onClick={handleSubmit} style={{backgroundColor: "#5271ff"}} disabled={load}>
              {load ? <CircularProgress color="inherit" size="20px"/> : "Join"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinChannel;
