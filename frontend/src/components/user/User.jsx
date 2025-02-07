import React from 'react'
import useConversation from '../../zustand/useConversation';

const User = ({ conversation, lastIdx }) => {
    const { selectedConversation, setSelectedConversation, conversations } = useConversation();

    
    // Check if an existing conversation already exists with this user
    const existingConversation = conversations?.find(conv =>
        conv.participants.some(participant => participant._id === conversation._id)
    );
    
    const handleSelectUser = () => {
        if (existingConversation) {
            setSelectedConversation(existingConversation); // Use the existing conversation
        } else {
            setSelectedConversation(conversation); // Fallback to just user object
        }
    };
    
    const isSelected = (selectedConversation?._id === conversation?._id) || (selectedConversation?._id === existingConversation?._id);
    const selectedColor = isSelected ? "#3e4a56" : "";
    

    return (
        <div className='conversation-tile-container' style={{ backgroundColor: selectedColor }} onClick={handleSelectUser}>
            <div className='conversation-tile-content'>
                <div className='conversation-tile-img'>
                    <img src={conversation?.profilePic} alt="profile" />
                </div>
                <div>
                    <div>{conversation?.username}</div>
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