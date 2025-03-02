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
import defaultChannelPic from '../../../assets/pictures/default-channel-pic.jpg'
import { useSelectedElement } from '../../../context/SelectedElement';
import Information from '../../info/Information';
import { IoClose } from "react-icons/io5";


const MessagesContainer = () => {
  const { selectedConversation, setSelectedConversation, favoriteConversations, conversations } = useConversation();
  const { authUser } = useAuthContext();
  const [slidingOut, setSlidingOut] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [infoPanelClass, setInfoPanelClass] = useState("hidden");
	const {onlineUsers} = useSocketContext();
  const {deleteForUser} = useDeleteForUser();
  const {addToFavorites} = useAddToFavorites();
  const { selectedElement } = useSelectedElement();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);
  
  const activeConversation = conversations?.find(conv => conv._id === selectedConversation?._id) || selectedConversation;

  let otherParticipant = activeConversation?.participants?.find(
    (participant) => participant._id !== authUser._id
  );

  if (!otherParticipant) {
    otherParticipant = activeConversation
  }

  let profilePic = otherParticipant?.profilePic;
  let name = otherParticipant?.username;

  if(activeConversation?.isChannel){
    profilePic = activeConversation?.icon || defaultChannelPic;
    name = activeConversation?.name;
  }

  const handleNameClick = () => {
    setShowInfo(true);
    setTimeout(() => {
      setInfoPanelClass("visible");
    }, 50);
  };
  

  const handleCloseInformation = () => {
    setInfoPanelClass("slide-out");
    setTimeout(() => {
      setShowInfo(false);
      setInfoPanelClass("hidden");
    }, 400);
  };


  const handleClick = () => {
    setSlidingOut(true);
    setTimeout(() => {
      setSelectedConversation(null);
      setSlidingOut(false);
    }, 400);
  };

	const isOnline = onlineUsers.includes(otherParticipant?._id);

  let isFavorite = favoriteConversations.includes(activeConversation?._id)

  const handleToggleFavorites = async(e) => {
    e.preventDefault();
    await addToFavorites();
  }

  const handleDelete = async(e) => {
    e.preventDefault();
    await deleteForUser();
  }

  return (
    <div className='messages-container-wrapper'>
      <div className={`messages-container ${activeConversation ? 'slide-in' : ''} ${slidingOut ? 'slide-out' : ''}`}>
        {!activeConversation ? <NoChatSelected /> : (
          <>
            <div className='msg-container-header'>
              <div className='msg-profile'>
                <IoChevronBackOutline onClick={handleClick} />
                <img src={profilePic} alt="" />
                <span onClick={handleNameClick} style={{ cursor: "pointer" }}>
                    {name}
                  </span>
                {selectedElement === 'chat' && isOnline && <div className='online'></div>}
              </div>
              <div className='chat-functions'>
                {!activeConversation.isChannel && activeConversation.participants && (
                  <>
                    {<div onClick={handleToggleFavorites}>
                      {isFavorite ? <FaStar style={{color: "#d9b902"}}/> : <FaRegStar />}
                    </div>}
                    <IoCall />
                    <FaVideo />
                  </>
                )}
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

      {activeConversation?.isChannel && showInfo && (
        <>
          <div className='info-background'></div>
          <div className={`glass info-panel ${infoPanelClass}`}>
            <div className='info-panel-btn' onClick={handleCloseInformation}><IoClose /></div>
            <Information conversation={activeConversation}/>
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
