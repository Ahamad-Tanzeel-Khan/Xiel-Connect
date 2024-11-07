import { useState } from "react";
import toast from "react-hot-toast";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";
import "./SearchInput.css"


const SearchInput = () => {
	const [search, setSearch] = useState("");
	const {setSelectedConversation, conversations} = useConversation();
	const {authUser} = useAuthContext();

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!search) return ;
		if (search.length < 3) {
			return toast.error('Search term must be 3 characters long');
		}

		const userId = authUser._id;

		const conversation = conversations.filter((c) => 
			c.participants.some((participant) => 
				participant._id.toString() !== userId.toString() &&
				participant.username.toLowerCase().includes(search.toLowerCase())
			)
		);

		console.log(authUser.fullname);
		
		
		if (conversation.length > 0) {
            setSelectedConversation(conversation[0]);
            setSearch("");
        } else {
            toast.error("No such user found!");
        }
	}
	return (
		<form className="chat-search-form" onSubmit={handleSubmit} >
			<button type='submit' className="chat-search-btn" >
				<IoSearchSharp />
			</button>
			<input
				type='text'
				placeholder='Search users'
				className='input input-bordered rounded-full'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
		</form>
	);
};
export default SearchInput;