import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useDeleteForUser = () => {
    const [loading, setLoading] = useState(false);
    const { setMessages, selectedConversation} = useConversation();

    const deleteForUser = async () => {

        setLoading(true);

        const isChannel = selectedConversation?.isChannel ? "true" : "false";
        
        try {
            const res = await fetch(`/api/messages/delete-for-user/${selectedConversation._id}?isChannel=${isChannel}`, {
                method: "POST",
            });
    
            const data = await res.json();
    
            if (data.error) {
                throw new Error(data.error);
            }
    
            setMessages([]);
    
            toast.success("Conversation deleted successfully");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    

    return { deleteForUser, loading };
};

export default useDeleteForUser;
