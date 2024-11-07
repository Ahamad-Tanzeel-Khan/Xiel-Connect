import React from 'react'
import SearchInput from '../search-input/SearchInput';
import AllUsers from './Users/users/Users';

const UsersContainer= () => {
    console.log("Users");
  return (
    <div className='chats-conatiner'>
      <div className="chats-title">All Users</div>
      <SearchInput />
      <AllUsers />
    </div>
  )
}

export default UsersContainer;