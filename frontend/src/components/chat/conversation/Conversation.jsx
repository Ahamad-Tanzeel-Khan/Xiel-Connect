import React from 'react';
import "./Conversation.css";
import useConversation from '../../../zustand/useConversation';
import { useAuthContext } from '../../../context/AuthContext';
import { useSocketContext } from '../../../context/SocketContext';
import useMarkAsRead from '../../../hooks/useMarkAsRead';

const Conversation = ({ conversation }) => {
    const { selectedConversation, setSelectedConversation, unreadCounts } = useConversation();
    const { authUser } = useAuthContext();
    const { markAsRead } = useMarkAsRead(); // Get the function to mark messages as read

    const isSelected = selectedConversation?._id === conversation._id;
    const selectedColor = isSelected ? "#3e4a56" : "";

    const otherParticipant = conversation.participants.find(
        (participant) => participant._id !== authUser._id
    );

    const { onlineUsers } = useSocketContext();
    const isOnline = onlineUsers.includes(otherParticipant?._id);

    function toTitleCase(str) {
        if (!str) return '';
        return str.replace(
            /\w\S*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        );
    }

    const lastMsgTime = new Date(conversation.lastMessage.timestamp).toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit'
    });

    let lastMessage = conversation.lastMessage.text || '';
    if (lastMessage.length >= 17) {
        lastMessage = conversation.lastMessage.text + "...";
    }

    
    const handleConversationClick = () => {
        if (selectedConversation?._id === conversation._id) {
            return;
        }
        setSelectedConversation(conversation);
        if (unreadCounts[conversation._id] > 0) {
            markAsRead(conversation._id); 
        }
    };
    
    

    return (
        <div className='conversation-tile-container' style={{ backgroundColor: selectedColor }} onClick={handleConversationClick}>
            <div className='conversation-tile-content'>
                <div className='conversation-tile-img'>
                    <img src={otherParticipant?.profilePic} alt="profile" />
                    {isOnline && <div className='isOnline'></div>}
                </div>
                <div>
                    <div>{toTitleCase(otherParticipant?.username)}</div>
                    <div className='conversation-tile-last-msg'>{lastMessage}</div>
                </div>
            </div>
            <div className='conversation-tile-time'>
                {lastMsgTime}
                {unreadCounts[conversation._id] > 0 && (
                    <div className='conversation-unread-msg'>{unreadCounts[conversation._id]}</div>
                )}
            </div>
        </div>
    );
}

export default Conversation;
