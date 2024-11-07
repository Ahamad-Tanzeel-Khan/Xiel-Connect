import React, { useState } from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import Chat from '../../components/chat/Chat';
import Favorites from '../../components/favorites/Favorites';
import Groups from '../../components/groups/Groups';
import "./Home.css"
import MessagesContainer from '../../components/messages/MessagesContainer/MessagesContainer';
import BottomBar from '../../components/bottombar/BottomBar';
import UsersContainer from '../../components/users/UsersContainer';

const Home = () => {
  const [selectedElement, setSelectedElement] = useState('chat');

  const renderElement = () => {
    switch (selectedElement) {
      case 'chat':
        return <Chat />;
      case 'favorites':
        return <Favorites />;
      case 'groups':
        return <Groups />;
      case 'users':
        return <UsersContainer />;
      default:
        return <Chat />;
    }
  };

  return (
    <div className="dashboard">
      <div className='sidebar-container'><Sidebar onSelect={setSelectedElement} /></div>
      <div className="element-section">{renderElement()}</div>
      <div className="ongoing-conversation"> <MessagesContainer /> </div>
      <div className='bottombar-container'><BottomBar onSelect={setSelectedElement} /></div>
    </div>
  )
}

export default Home