import React from 'react'
import SearchInput from '../search-input/SearchInput'
import Conversations from '../conversations/Conversations'
import useConversation from '../../zustand/useConversation';
import useGetChannels from '../../hooks/useGetChannels';

const Channels = () => {
    const { loading } = useGetChannels();
    const { channels } = useConversation();
  return (
    <div className='chats-conatiner'>
      <div className="chats-title">Favorites</div>
      <SearchInput />
      <Conversations conversations={channels} loading={loading}/>
    </div>
  )
}

export default Channels