import React from 'react'
import { TiGroup } from "react-icons/ti";

const NewGroup = () => {
  return (
    <div style={{display: "flex", alignItems: "center", flexDirection: "column" , justifyContent: "center", height: "100vh", width: "100%", backgroundColor: "#303841", gap: "50px"}}>
      <div style={{fontSize: "40px", display: "flex", color: "#efddc2", alignItems: "center", gap: "20px"}}>Create New Group <TiGroup /></div>
      <div style={{display: "flex", flexDirection: "column", padding: "50px", backgroundColor: "#262e35", borderRadius: "5px", gap: "20px"}}>
          <input type="text" placeholder='Enter group name' style={{border: "none", outline: "none", padding: "15px 20px", backgroundColor: "#36404a", color: "#a6b0cf", width: "400px", borderRadius: "5px"}}/>
          <button style={{padding: "10px 20px", borderRadius: "5px", border: "none", outline: "none", backgroundColor: "#7269ef", color: "#efddc2"}}>Create</button>
      </div>
    </div>
  )
}

export default NewGroup