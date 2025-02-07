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
                let userOrChannelId;
                const isChannel = selectedConversation?.isChannel ? "true" : "false";
                
                if (isChannel) {
                    userOrChannelId = selectedConversation._id;
                } else {
                    userOrChannelId = selectedConversation?.participants?.find(
                        (participant) => participant._id !== authUser._id
                    )._id;

                    if (!userOrChannelId) {
                        userOrChannelId = selectedConversation._id;
                    }
                }


                const res = await fetch(`/api/messages/${userOrChannelId}?isChannel=${isChannel}`);
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
    }, [selectedConversation?._id, setMessages, authUser._id, selectedConversation.isChannel, selectedConversation.participants]);

    return { messages, loading };
};

export default useGetMessages;