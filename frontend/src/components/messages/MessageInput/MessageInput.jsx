import React, { useState } from 'react';
import { FiSend } from "react-icons/fi";
import { CircularProgress } from '@mui/material';
import useSendMessage from '../../../hooks/useSendMessage';
import { CgAttachment } from "react-icons/cg";
import { TbPhoto } from "react-icons/tb";
import "./MessageInput.css";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const { loading, sendMessage } = useSendMessage();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message && !file) return;

    await sendMessage(message, file);
    setMessage(''); 
    setFile(null);
  };

  return (
    <form encType="multipart/form-data" className='msg-input-form' onSubmit={handleSubmit}>
      <div className='msg-input-container'>
        <input
          className='msg-text-input'
          type='text'
          placeholder='Send a message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <label className="file-input-label">
          <TbPhoto className="icon" />
          <input
            type="file"
            accept="image/*, video/*"
            className="file-input"
            onChange={handleFileChange}
          />
        </label>
        <label className="file-input-label">
          <CgAttachment className="icon" />
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            className="file-input"
            onChange={handleFileChange}
          />
        </label>
        <button type='submit'>
          {loading ? <CircularProgress color="inherit" size="20px" /> : <FiSend />}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
