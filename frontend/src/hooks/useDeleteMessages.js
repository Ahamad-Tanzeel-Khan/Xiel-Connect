import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useDeleteMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages} = useConversation();

    const deleteMessage = async (messageId) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/messages/delete/${messageId}`, {
                method: "DELETE"
            });
    
            const data = await res.json();
    
            if (data.error) {
                throw new Error(data.error);
            }

            const updatedMessages = messages.filter(message => message._id !== messageId);
            setMessages(updatedMessages);
    
            toast.success("Message deleted successfully");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { deleteMessage, loading };
};

export default useDeleteMessage;
