import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext"; 

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    const { authUser } = useAuthContext(); 

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                let userOrGroupId;
                let isGroup = selectedConversation.isGroup || false;
                
                if (isGroup) {
                    userOrGroupId = selectedConversation._id;
                } else {
                    userOrGroupId = selectedConversation?.participants?.find(
                        (participant) => participant._id !== authUser._id
                    )._id;

                    if (!userOrGroupId) {
                        userOrGroupId = selectedConversation._id;
                    }
                }

                const res = await fetch(`/api/messages/${userOrGroupId}?isGroup=${isGroup}`);
                const data = await res.json();

                if (data.error) throw new Error(data.error);
                setMessages(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (selectedConversation?._id) {
            getMessages();
        }
    }, [selectedConversation?._id, setMessages, authUser._id, selectedConversation.isGroup, selectedConversation.participants]);

    return { messages, loading };
};
export default useGetMessages;