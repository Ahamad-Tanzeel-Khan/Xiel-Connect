import React, { useState, useRef, useEffect } from 'react';
import { usePopup } from '../../../context/PopupContext';
import { LuChevronsUpDown } from "react-icons/lu";
import { MdGroups } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import useGetAllUsers from '../../../hooks/useGetAllUsers';
import { CircularProgress } from '@mui/material';
import "./CreateChannel.css";
import useCreateChannel from '../../../hooks/useCreateChannel';


const CreateChannel = () => {
  const { isPopupVisible, popupType, closePopup } = usePopup();
  const { loading, users } = useGetAllUsers();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchInput, setSearchInput] = useState('');
  const {load, createChannel} = useCreateChannel();
  const [icon, setIcon] = useState("");
  
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addParticipant = (user) => {
    if (!participants.includes(user)) {
      setParticipants([...participants, user]);
    }
    setDropdownOpen(false);
    setSearchInput(''); 
  };

  const removeParticipant = (user) => {
    setParticipants(participants.filter((p) => p !== user));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setFilteredUsers(users.filter(user => user.username.toLowerCase().includes(value.toLowerCase())));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!name && !participants) return;

    await createChannel({name, description, participants, icon});

    setIcon("")
  }
 
  if (!isPopupVisible || popupType !== "createChannel") return null;

  return (
    <div className="create-channel-container">
      <div className="create-channel-content">
        <h2>Create channel</h2>
        <form className='create-channel-form' action="">
          <input
            type="text"
            placeholder="Enter a channel name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter the description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="dropdown-wrapper" ref={dropdownRef}>
            <div className='dropdown-wrapper-input'>
              <input
                type="text"
                placeholder="Select channel participants..."
                value={searchInput}
                onFocus={() => setDropdownOpen(true)}
                onChange={handleSearchChange}
              />
              <LuChevronsUpDown />
            </div>

            {dropdownOpen && filteredUsers.length > 0 && (
              <div style={{position: "relative"}}>
                <div className="dropdown-menu">
                  {filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      className="dropdown-item"
                      onClick={() => addParticipant(user)}
                    >
                      <img src={user.profilePic} alt="pic" />
                      {user.username}
                    </div>
                  ))}
                  {loading ? <CircularProgress color="inherit" size="40px"/> : null}
                </div>
              </div>
            )}
          </div>

          <div style={{display: "flex", flexDirection: "column"}}>
            <label htmlFor="avatar">Choose channel icon:</label>
            <input style={{background: "none", padding: "15px 5px"}} type="file" id="avatar" name="avatar" accept="image/*" onChange={(e) => setIcon(e.target.files[0])}/>
          </div>

          <div className='selected-participants-text'>
            <MdGroups /> 
            <span>Selected Participants</span>
          </div>

          <div className="selected-participants">
            {participants.map((user) => (
              <div key={user._id} className="participant">
                <img src={user.profilePic} alt={user.username} />
                {user.username}
                <IoCloseCircle className='remove-participant' onClick={() => removeParticipant(user)}/>
              </div>
            ))}
          </div>

          <div className='create-grp-btn-container'>
            <button onClick={closePopup}>
              Close 
            </button>
            <button onClick={handleSubmit} style={{backgroundColor: "#5271ff"}} disabled={load}>
              {load ? <CircularProgress color="inherit" size="20px"/> : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChannel;
