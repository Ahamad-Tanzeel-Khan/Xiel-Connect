import React, { useEffect, useState } from 'react';
import "./MessagesContainer.css";
import { FaVideo } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import { IoCall, IoChevronBackOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import useConversation from '../../../zustand/useConversation';
import { useAuthContext } from '../../../context/AuthContext';
import MessageInput from '../MessageInput/MessageInput';
import Messages from '../Messages';
import { useSocketContext } from '../../../context/SocketContext';
import useDeleteForUser from '../../../hooks/useDeleteMessagesForUser';
import useAddToFavorites from '../../../hooks/useAddToFavorites';

const MessagesContainer = () => {
  const { selectedConversation, setSelectedConversation, favoriteConversations } = useConversation();
  const { authUser } = useAuthContext();
  const [slidingOut, setSlidingOut] = useState(false);
	const {onlineUsers} = useSocketContext();
  const {deleteForUser} = useDeleteForUser();
  const {loading, addToFavorites} = useAddToFavorites();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  let otherParticipant = selectedConversation?.participants?.find(
    (participant) => participant._id !== authUser._id
  );

  if (!otherParticipant) {
    otherParticipant = selectedConversation
  }

  const handleClick = () => {
    setSlidingOut(true);
    setTimeout(() => {
      setSelectedConversation(null);
      setSlidingOut(false);
    }, 400);
  };

	const isOnline = onlineUsers.includes(otherParticipant?._id);

  let isFavorite = favoriteConversations.includes(selectedConversation?._id)

  function toTitleCase(str) {
    if (!str) return '';
    return str.replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  }

  
  const handleToggleFavorites = async(e) => {
    e.preventDefault();
    await addToFavorites();
  }

  const handleDelete = async(e) => {
    e.preventDefault();
    await deleteForUser();
  }

  return (
    <div className={`messages-container ${selectedConversation ? 'slide-in' : ''} ${slidingOut ? 'slide-out' : ''}`}>
      {!selectedConversation ? <NoChatSelected /> : (
        <>
          <div className='msg-container-header'>
            <div className='msg-profile'>
              <IoChevronBackOutline onClick={handleClick} />
              <img src={otherParticipant.profilePic} alt="" />
              <span> {toTitleCase(otherParticipant.username)}</span>
              {isOnline && <div className='online'></div>}
            </div>
            <div className='chat-functions'>
              {<div onClick={handleToggleFavorites}>
                {isFavorite ? <FaStar style={{color: "#d9b902"}}/> : <FaRegStar />}
              </div>}
              <IoCall />
              <FaVideo />
              <RiDeleteBin6Line onClick={handleDelete}/>
            </div>
          </div>
          <hr className='msg-header-line' />
          <div className='msgs-main-container'>
            <Messages />
          </div>
          <div className='msg-bottom-main-container'>
            <hr className='msg-header-line' />
            <div className='msg-bottom-container'>
              <MessageInput />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MessagesContainer;

const NoChatSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <div className='no-chat-selected'>
      <div>
        <p>Welcome <span style={{ color: "#5271ff" }}>{authUser.fullname} ✨</span></p>
        <p>Choose a Chat to Begin!</p>
      </div>
    </div>
  );
};
