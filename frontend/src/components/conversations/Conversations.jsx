import React, { useEffect } from 'react'
import "./Conversations.css"
import { CircularProgress } from '@mui/material';
import Conversation from '../conversation/Conversation';
import { useSelectedElement } from '../../context/SelectedElement';
import User from '../user/User';

const Conversations = ({ conversations, loading }) => {

  const { selectedElement } = useSelectedElement();

  const AllUsers = selectedElement === 'users'

  useEffect(() => {
    console.log("Conversations updated:", conversations);
  }, [conversations]);

  return (
    <div className='conversations-container'>
      {loading ? (
        <div className='conversations-tiles' style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress color="inherit" size="40px" />
        </div>
      ) : (
        conversations.length === 0 ? <NoConversationAvailable /> : (
          <>
            <div className='conversations-title'>Recent</div>
            <div className='conversations-tiles'>
              {!AllUsers && conversations?.map((conversation, idx) => (
                <Conversation
                  key={conversation._id}
                  conversation={conversation}
                  lastIdx={idx === conversations.length - 1}
                />
              ))}
              {AllUsers && conversations.map((conversation, idx) => (
                <User
                  key={conversation?._id}
                  conversation={conversation}
                  lastIdx={idx === conversations.length - 1}
                />
              ))}
            </div>
          </>
        )
      )}

    </div>
  )
}

export default Conversations

const NoConversationAvailable = () => {
  return (
    <div className='no-conversation-available'>
      <p>Start a conversation with someone</p>
    </div>
  );
};
