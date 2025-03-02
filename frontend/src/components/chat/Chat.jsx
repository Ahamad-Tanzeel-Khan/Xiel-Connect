import React from 'react'
import "./Chat.css"
import SearchInput from '../search-input/SearchInput';
import useListenMessages from '../../hooks/useListenMessages';
import Conversations from '../conversations/Conversations';
import useConversation from '../../zustand/useConversation';
import useGetConversations from '../../hooks/useGetConversations';

const Chat = () => {
  useListenMessages();
  const {loading} = useGetConversations();
  const { conversations } = useConversation();

  return (
    <div className='chats-conatiner'>
      <div className="chats-title">Chats</div>
      <SearchInput conversations={conversations}/>
      <Conversations conversations={conversations} loading={loading}/>
    </div>
  )
}

export default Chat