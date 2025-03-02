import React from 'react';
import "./Conversation.css";
import { useAuthContext } from '../../context/AuthContext';
import { useSocketContext } from '../../context/SocketContext';
import useMarkAsRead from '../../hooks/useMarkAsRead';
import useConversation from '../../zustand/useConversation';
import defaultChannelPic from '../../assets/pictures/default-channel-pic.jpg'
import { useSelectedElement } from '../../context/SelectedElement';

const Conversation = ({ conversation }) => {
    const { selectedConversation, setSelectedConversation, unreadCounts } = useConversation();
    const { authUser } = useAuthContext();
    const { markAsRead } = useMarkAsRead();
    const { selectedElement } = useSelectedElement();

    const isSelected = selectedConversation?._id === conversation._id;
    const selectedColor = isSelected ? "#3e4a56" : "";
    
    const otherParticipant = conversation.participants.find(
        (participant) => participant._id !== authUser._id
    );

    let profilePic = otherParticipant?.profilePic;
    let name = otherParticipant?.username;

    if(conversation?.name){
        profilePic = conversation?.icon || defaultChannelPic;
        name = conversation?.name;
    }

    const { onlineUsers } = useSocketContext();
    const isOnline = onlineUsers.includes(otherParticipant?._id);

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
            markAsRead(conversation._id, conversation.isChannel); 
        }
    };

    return (
        <div className='conversation-tile-container' style={{ backgroundColor: selectedColor }} onClick={handleConversationClick}>
            <div className='conversation-tile-content'>
                <div className='conversation-tile-img'>
                    <img src={profilePic} alt="profile" />
                    {selectedElement === 'chat' && isOnline && <div className='isOnline'></div>}
                </div>
                <div>
                    <div>{name}</div>
                    <div className='conversation-tile-last-msg'>{lastMessage || 'Start a conversation 😀!!!'}</div>
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

export default React.memo(Conversation);
