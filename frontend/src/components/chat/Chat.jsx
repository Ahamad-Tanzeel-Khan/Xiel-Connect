import React from 'react'
import Conversations from './conversations/Conversations';
import "./Chat.css"
import SearchInput from '../search-input/SearchInput';
import useListenMessages from '../../hooks/useListenMessages';
import useGetFavorites from '../../hooks/useGetFavorites';

const Chat = () => {
  useListenMessages();
  useGetFavorites();
  
  return (
    <div className='chats-conatiner'>
      <div className="chats-title">Chats</div>
      <SearchInput />
      <Conversations />
    </div>
  )
}

export default Chat