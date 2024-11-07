import React, { useEffect, useRef } from 'react'
import useGetMessages from '../../hooks/useGetMessages';
import { CircularProgress } from '@mui/material';
import Message from './message/Message';
import { useAuthContext } from '../../context/AuthContext';

const Messages = () => {

    const {messages, loading} = useGetMessages();
    const { authUser } = useAuthContext();
    const lastMessageRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    const loadingStyle = loading ? {display: "flex", alignItems: "center", justifyContent: "center", height: "100%"} : {padding: "25px",flexGrow: 1, overflowY: 'scroll' }

    

    return (
        <div style={loadingStyle}>
            {!loading && Array.isArray(messages) && messages.length > 0 && messages
                .filter((msg) => !msg.deletedFor.includes(authUser._id))
                .map((message) => (
                <div key={message._id} ref={lastMessageRef}>
                    <Message message={message} />
                </div>
            ))}


            {loading &&  <CircularProgress color="inherit" size="50px"/>}   

            {!loading && messages.length === 0 && (
                <div className='text-center'>Send a message to start the conversation 👀.</div>
            )}

        </div>
    )
}

export default Messages