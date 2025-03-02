import React from 'react'
import SearchInput from '../search-input/SearchInput';
import Conversations from '../conversations/Conversations';
import useGetAllUsers from '../../hooks/useGetAllUsers';

const UsersContainer= () => {
  const { loading, users } = useGetAllUsers();

  console.log(users);
  

  return (
    <div className='chats-conatiner'>
      <div className="chats-title">All Users</div>
      <SearchInput conversations={users}/>
      <Conversations conversations={users} loading={loading}/>
    </div>
  )
}

export default UsersContainer;