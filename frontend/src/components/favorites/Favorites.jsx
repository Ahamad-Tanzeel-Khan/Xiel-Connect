import React from 'react'
import SearchInput from '../search-input/SearchInput';
import Conversations from '../conversations/Conversations';
import useGetFavorites from '../../hooks/useGetFavorites';

const Favorites = () => {
    const {users, loading} = useGetFavorites();

  return (
    <div className='chats-conatiner'>
      <div className="chats-title">Favorites</div>
      <SearchInput />
      <Conversations conversations={users} loading={loading}/>
    </div>
  )
}

export default Favorites