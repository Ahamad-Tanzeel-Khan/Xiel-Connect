import React from 'react'
import "./Conversations.css"
import { CircularProgress } from '@mui/material';
import Conversation from '../conversation/Conversation';
import useConversation from '../../../zustand/useConversation';
import useGetConversations from '../../../hooks/useGetConversations';

const Conversations = () => {
  const { conversations } = useConversation();
  const {loading} = useGetConversations();
  // const loading = conversations.length === 0;

  const loadingStyle = loading ? {display: "flex", alignItems: "center", justifyContent: "center"} : {}
  return (
    <div className='conversations-container'>
      {conversations.length === 0 ? <NoConversationAvailable /> : (
        <>
          <div className='conversations-title'>Recent</div>
          <div className='conversations-tiles' style={loadingStyle}>
            {!loading && conversations.map((conversation, idx) => (
              <Conversation
                key={conversation._id}
                conversation={conversation}
                lastIdx = {idx === conversations.length - 1}
              />
            ))}
            {loading ? <CircularProgress color="inherit" size="40px"/> : null}
          </div>
        </>
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
