import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation, updateConversationLastMessage } = useConversation();
    const { authUser } = useAuthContext();

    const sendMessage = async (message, file) => {
        setLoading(true);
        try {
            let mediaUrl = "";
            let mediaType = "";
            let originalFileName = "";

            if (file) {
                const formData = new FormData();
                formData.append('mediaFile', file); 
                
                const uploadRes = await fetch(`/api/upload`, {
                    method: "POST",
                    body: formData,
                });
                
                const uploadData = await uploadRes.json();
                if (uploadData.error) {
                    throw new Error(uploadData.error);
                }

                mediaUrl = uploadData.url;
                mediaType = file.type.split("/")[0];
                originalFileName = file.name;
            }

            if (!selectedConversation) {
                throw new Error("No selected conversation.");
            }

            let chatRoomType;
            let userOrChannelId;

            if (selectedConversation.isChannel) {

                userOrChannelId = selectedConversation._id
                chatRoomType = "channel"

            } else {

                userOrChannelId = selectedConversation?.participants?.find(
                    participant => participant._id !== authUser._id
                )?._id || selectedConversation._id;

                chatRoomType = "conversation"
            }



            if (!userOrChannelId) {
                userOrChannelId = selectedConversation._id
                chatRoomType = "channel"
            }
            
            const messageRes = await fetch(`/api/messages/send/${userOrChannelId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message,
                    mediaUrl,
                    mediaType,
                    originalFileName,
                    chatRoomType
                }),
            });

            const messageData = await messageRes.json();
            if (!messageRes.ok) {
                throw new Error(messageData.error || "Failed to send message");
            }

            setMessages([...messages, messageData]);

            updateConversationLastMessage(messageData);
            

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading };
};

export default useSendMessage;
