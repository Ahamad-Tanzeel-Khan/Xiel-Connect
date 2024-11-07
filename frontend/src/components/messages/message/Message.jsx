import React, { useEffect, useRef, useState } from 'react';
import useConversation from '../../../zustand/useConversation';
import { useAuthContext } from '../../../context/AuthContext';
import { extractTime } from '../../../utils/extractTime';
import { BiTime } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineContentCopy } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri"; 
import { MdCloudDownload } from "react-icons/md";
import useDeleteMessages from '../../../hooks/useDeleteMessages';
import './Message.css';

const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const {deleteMessage} = useDeleteMessages();

    const fromMe = message.senderId === authUser._id;
    const formattedTime = extractTime(message.createdAt);
    const chatColor = fromMe ? { backgroundColor: "#5271ff", marginRight: "50px" } : { backgroundColor: "#36404a", marginLeft: "50px" };
    const chatPosition = fromMe ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" };
    const timePosition = fromMe ? { justifyContent: "flex-start" } : { justifyContent: "flex-end" };
    const displayAuthUser = fromMe ? {display: "block"} : {display: "none"};
    const displayUser = fromMe ? {display: "none"} : {display: "block"};
    const fileMsgColor = fromMe ? { backgroundColor: "#6984f8" } : { backgroundColor: "#3e4a56" };

    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    function toTitleCase(str) {
        if (!str) return '';
        return str.replace(
            /\w\S*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        );
    }

    let otherParticipant = selectedConversation.participants?.find(
        (participant) => participant._id !== authUser._id
    );

    if (!otherParticipant) {
        otherParticipant = selectedConversation;
    }

    const profilePic = fromMe ? authUser.profilePic : otherParticipant?.profilePic;

    const handleCopyClick = async () => {
        try {
            await window.navigator.clipboard.writeText(message.message);
            toggleMenu();
        } catch (err) {
            console.error("Unable to copy to clipboard.", err);
        }
    };

    const handleDelete = async(e) => {
        e.preventDefault();
        
        if(!message) return;
    
        await deleteMessage(message._id);
    }

    return (
        <div className='msg-user-container' style={chatPosition}>
            <div>
                <div style={{ display: "flex", gap: "0" }} className="three-dots-container">

                    {fromMe && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "end" }} ref={menuRef}>
                            <BsThreeDotsVertical className="three-dots-icon" onClick={toggleMenu} />
                            {menuVisible && (
                                <div className="message-options-menu">
                                    <div className='dots-icon' onClick={handleCopyClick}><span>Copy</span><MdOutlineContentCopy /></div>
                                    <div className='dots-icon' onClick={handleDelete}><span>Delete</span><RiDeleteBin6Line /></div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className='msg-content' style={chatColor}>
                        <div>{message.message}</div>
                        {message.mediaUrl && (
                            <div className='msg-file-container'>
                                {message.mediaType === 'image' && <img src={message.mediaUrl} alt="Shared file" />}
                                {message.mediaType === 'video' && <video src={message.mediaUrl} controls />}
                                {message.mediaType === 'audio' && <audio src={message.mediaUrl} controls />}
                                {message.mediaType === 'application' && (
                                    <div className='msg-app-container'>
                                        <a href={message.mediaUrl} target="_blank" rel="noreferrer" download style={fileMsgColor}>
                                            <div>{message.originalFileName || 'Download File'}</div>
                                            <MdCloudDownload />
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className='msg-time' style={timePosition}>
                            <BiTime /> {formattedTime}
                        </div>
                    </div>

                    {!fromMe && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }} ref={menuRef}>
                            <BsThreeDotsVertical className="three-dots-icon" onClick={toggleMenu} />
                            <div>
                                {menuVisible && (
                                    <div className="message-options-menu">
                                        <div className='dots-icon' onClick={handleCopyClick}><span>Copy</span><MdOutlineContentCopy /></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className='msg-usr-img' style={chatPosition}>
                    <span style={displayAuthUser}>{toTitleCase(authUser.username)}</span>
                    <img alt='bubble' src={profilePic} />
                    <span style={displayUser}>{toTitleCase(otherParticipant?.username)}</span>
                </div>
            </div>
        </div>
    );
};

export default Message;