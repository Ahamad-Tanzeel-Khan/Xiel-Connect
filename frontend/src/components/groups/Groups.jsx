import React from 'react'
import SearchGroups from './SearchGroups/SearchGroups'
import GroupConversations from './GroupConversations/GroupConversations'
import {Link} from "react-router-dom"

const Groups = () => {
  

  return (
    <div style={{display: "flex", height: "100%", flexDirection: "column", gap: "20px"}}>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <div style={{color: "#eff2f7", fontSize: "23px"}}>Groups</div>
        <Link to={"/create-new-group"}> 
          <button style={{backgroundColor: "#5271ff", border: "none", outline: "none", color: "#d1f2f7", padding: "10px 20px", borderRadius: "5px", cursor: "pointer"}}>+ New </button>
        </Link>
      </div>
      <SearchGroups />
      <GroupConversations />
  </div>
  )
}

export default Groups