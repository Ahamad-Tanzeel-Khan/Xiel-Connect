import React, { useState } from 'react'
import { IoSearchSharp } from 'react-icons/io5';

const SearchGroups = () => {
    const [search, setSearch] = useState("");
    return (
        <form style={{display: "flex", alignItems: "center"}}>
                <button type='submit' style={{border: "none", backgroundColor: "#36404a", padding: "10px 5px 10px 15px", borderRadius: "3px 0px 0px 3px"}}>
                    <IoSearchSharp style={{height: "1.4rem", width: "1.4rem", color: "#a6b0cf"}}/>
                </button>
                <input
                    style={{border: "none", outline: "none", backgroundColor: "#36404a", color: "#a6b0cf", padding: "15px", borderRadius: "0 3px 3px 0", width: "100%"}}
                    type='text'
                    placeholder='Search groups'
                    className='input input-bordered rounded-full'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </form>
    )
}

export default SearchGroups