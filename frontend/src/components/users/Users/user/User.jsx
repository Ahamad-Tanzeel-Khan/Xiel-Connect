import React from 'react'
import useConversation from '../../../../zustand/useConversation';
import { useSocketContext } from '../../../../context/SocketContext';

const User = ({ user, lastIdx }) => {
    const { selectedConversation, setSelectedConversation } = useConversation();

    const isSelected = selectedConversation?._id === user._id;

    
    const selectedColor = isSelected ? "#3e4a56" : "";
    
    // const otherParticipant = user.participants.find(
    //     (participant) => participant._id !== authUser._id
    // );

    const {onlineUsers} = useSocketContext();
    const isOnline = onlineUsers.includes(user?._id)
    
    function toTitleCase(str) {
        if (!str) return '';
        return str.replace(
            /\w\S*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        );
    }

    return (
        <div className='conversation-tile-container' style={{ backgroundColor: selectedColor }} onClick={() => setSelectedConversation(user)}>
            <div className='conversation-tile-content'>
                <div className='conversation-tile-img'>
                    <img src={user?.profilePic} alt="profile" />
                    {isOnline && <div className='isOnline'></div>}
                </div>
                <div>
                    <div>{toTitleCase(user?.username)}</div>
                    <div className='conversation-tile-last-msg'>Let's Connect!</div>
                </div>
            </div>
            <div className='conversation-tile-time'>
                12:39 PM
            </div>
        </div>
    )
}

export default User;