import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import Chat from '../../components/chat/Chat';
import Favorites from '../../components/favorites/Favorites';
import "./Home.css"
import MessagesContainer from '../../components/messages/MessagesContainer/MessagesContainer';
import BottomBar from '../../components/bottombar/BottomBar';
import UsersContainer from '../../components/users/UsersContainer';
import Channels from '../../components/channels/Channels';
import useListenMessages from '../../hooks/useListenMessages';
import { useSelectedElement } from '../../context/SelectedElement';
import CreateChannel from '../../components/channels/CreateChannel/CreateChannel';

const Home = () => {
  const { selectedElement } = useSelectedElement();
  useListenMessages(selectedElement);

  const renderElement = () => {
    switch (selectedElement) {
      case 'chat':
        return <Chat />;
      case 'favorites':
        return <Favorites />;
      case 'users':
        return <UsersContainer />;
      case 'channels':
        return <Channels />;
      default:
        return <Chat />;
    }
  };

  return (
    <div className="dashboard">
      <div className='sidebar-container'><Sidebar /></div>
      <div className="element-section">{renderElement()}</div>
      <div className="ongoing-conversation"> <MessagesContainer /> </div>
      <div className='bottombar-container'><BottomBar /></div>
      <div style={{position: 'absolute'}}><CreateChannel /></div>
    </div>
  )
}

export default Home