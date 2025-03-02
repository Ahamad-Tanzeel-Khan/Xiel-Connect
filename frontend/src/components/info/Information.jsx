import React, { useState } from "react";
import "./Information.css";
import Accordion from "../dropdown/Accordion";
import defaultChannelPic from '../../assets/pictures/default-channel-pic.jpg'
import { FiLink } from "react-icons/fi";
import { FaCopy } from "react-icons/fa6";
import toast from "react-hot-toast";


const Information = ({ conversation }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleCopyClick = async () => {
    try {
      await window.navigator.clipboard.writeText(conversation.inviteLink);
      toast.success("Invite Link Copied")
    } catch (err) {
      console.error("Unable to copy to clipboard.", err);
    }
  };

  const dateObj = new Date(conversation.createdAt);
  const formattedDate = dateObj.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
    
  return (
    <>
    <div className='info-container'>
      <div className='info-header'>
        <div className='info-img'><img src={conversation.icon || defaultChannelPic} alt="" /></div>
        <div className="info-name-container">
          <span className="info-name">{conversation.name}</span>
          <span>Members: {conversation.participants.length}</span>
        </div>
      </div>
      <hr />
      <div className='info-bio'>
        <span>{conversation.description || 'Welcome to the channel'}</span>
      </div>
      <hr />
      <div className='info-body'>
        <div style={{display: "flex", flexDirection: "column"}}>
          <Accordion
            title={'📄 About'}
            isOpen={openIndex === 0}
            onToggle={() => toggleAccordion(0)}
          >
            <div className="info-about accordian">
              <p><strong>Name :</strong> {conversation.name}</p>
              <p><strong>Created By :</strong> {conversation.creatorId.fullname}</p>
              <p><strong>Created On :</strong> <span style={{ fontWeight: "bold" }}> {formattedDate}</span></p>
            </div>
          </Accordion>

          
          <Accordion
            title="👥 Members"
            isOpen={openIndex === 1}
            onToggle={() => toggleAccordion(1)}
          >
            <div className="info-participants-container">
              {conversation?.participants?.map((participant) => (
                <div className="info-participants-content accordian">
                  <img src={participant.profilePic} alt="" />
                  <div>{participant.username}</div>
                </div>
              ))}
            </div>
          </Accordion>
        </div>

        <div className="invitelink-container">
          <span><FiLink /> Invite Link</span>
          <div className="invitelink"><span>{conversation.inviteLink}</span><FaCopy onClick={handleCopyClick}/></div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Information;
