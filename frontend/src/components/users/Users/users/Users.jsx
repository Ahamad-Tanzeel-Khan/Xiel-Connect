import React from 'react'
import { CircularProgress } from '@mui/material';
import User from '../user/User';
import useGetAllUsers from '../../../../hooks/useGetAllUsers';


const AllUsers = () => {
    const { loading, users } = useGetAllUsers();
    const loadingStyle = loading ? {display: "flex", alignItems: "center", justifyContent: "center"} : {}
    return (
      <div className='conversations-container'>
        <div className='conversations-tiles' style={loadingStyle}>
          {users.map((user, idx) => (
            <User
              key={user._id}
              user={user}
              lastIdx = {idx === users.length - 1}
            />
          ))}
          {loading ? <CircularProgress color="inherit" size="40px"/> : null}
        </div>
      </div>
    )
}

export default AllUsers