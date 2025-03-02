import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";
import "./SearchInput.css";
import { useSelectedElement } from "../../context/SelectedElement";

const SearchInput = ({ conversations }) => {
  const [search, setSearch] = useState("");
  const { setSelectedConversation } = useConversation();
  const { authUser } = useAuthContext();
  const { selectedElement } = useSelectedElement();

  let placeholderText = "Search users";
  if (selectedElement === "channels") {
    placeholderText = "Search channels";
  } else if (selectedElement === "chat") {
    placeholderText = "Search chats";
  } else if (selectedElement === "favorites") {
    placeholderText = "Search favorites";
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search term must be 3 characters long");
    }
    const userId = authUser._id;
    let results = [];

    if (selectedElement === "users") {
      // For Users SECTION
      results = conversations.filter((item) =>
        item.username && item.username.toLowerCase().includes(search.toLowerCase())
      );
    } else if (selectedElement === "channels") {
      // For Channels Section
      results = conversations.filter((channel) =>
        channel.name && channel.name.toLowerCase().includes(search.toLowerCase())
      );
    }  else if (selectedElement === "chat" || selectedElement === "favorites") {
      // For Chat Section
      results = conversations.filter((conv) => {
        if (conv.participants && Array.isArray(conv.participants)) {
          return conv.participants.some(
            (participant) =>
              participant._id.toString() !== userId.toString() &&
              participant.username &&
              participant.username.toLowerCase().includes(search.toLowerCase())
          );
        }
        return false;
      });
    }

    if (results.length > 0) {
      setSelectedConversation(results[0]);
      setSearch("");
    } else {
      toast.error("No user found!");
    }
  };

  return (
    <form className="chat-search-form" onSubmit={handleSubmit}>
      <button type="submit" className="chat-search-btn">
        <IoSearchSharp />
      </button>
      <input
        type="text"
        placeholder={placeholderText}
        className="input input-bordered rounded-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  );
};

export default SearchInput;
