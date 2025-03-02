import React from 'react'
import SearchInput from '../search-input/SearchInput'
import Conversations from '../conversations/Conversations'
import useConversation from '../../zustand/useConversation';
import useGetChannels from '../../hooks/useGetChannels';
import CreateChannel from './CreateChannel/CreateChannel';
import { usePopup } from '../../context/PopupContext';
import JoinChannel from './JoinChannel/JoinChannel';
import "./Channels.css"

const Channels = () => {
    const { loading } = useGetChannels();
    const { channels } = useConversation();
    const { openPopup } = usePopup();
  return (
    <div className='chats-conatiner'>
      <div className='chats-button-container'>
        <button onClick={() => openPopup("createChannel")}> <span>+</span> Create </button>
        <button onClick={() => openPopup("joinChannel")}> <span>+</span> Join </button>
      </div>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <div style={{color: "#eff2f7", fontSize: "23px"}}>Channels</div>
      </div>
      <SearchInput conversations={channels} />
      <Conversations conversations={channels} loading={loading}/>
      <CreateChannel />
      <JoinChannel />
    </div>
  )
}

export default Channels