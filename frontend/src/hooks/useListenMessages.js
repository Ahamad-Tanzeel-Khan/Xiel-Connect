import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";
import { useSelectedElement } from "../context/SelectedElement";

const useListenMessages = () => { // Accept selectedElement to track section
    const { socket } = useSocketContext();
    const { messages, setMessages, updateConversationLastMessage, setConversations, conversations, selectedConversation, channels, setChannels } = useConversation();
    const {selectedElement} = useSelectedElement();

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            newMessage.shouldShake = true;
            const playSound = () => {
                const sound = new Audio(notificationSound);
                sound.play().catch((error) => {
                    console.log("Audio playback prevented:", error);
                    // Store a flag in localStorage to retry sound later
                    localStorage.setItem("playSoundOnNextInteraction", "true");
                });
            };

            // Attempt to play sound
            playSound();

            // If the user clicks anywhere on the page, retry the sound
            const handleUserInteraction = () => {
                if (localStorage.getItem("playSoundOnNextInteraction") === "true") {
                    playSound();
                    localStorage.removeItem("playSoundOnNextInteraction");
                    document.removeEventListener("click", handleUserInteraction);
                }
            };  

            document.addEventListener("click", handleUserInteraction);

            const isChannel = newMessage.chatRoomType === "channel";

            // Check if the message is for the currently selected conversation
            if (selectedConversation && newMessage.chatRoom === selectedConversation?._id) {
                // Ensure the message is being read in the correct section
                if ((selectedElement === 'chat' && !isChannel) || (selectedElement === 'channels' && isChannel) || (selectedElement === 'users' && !isChannel)) {
                    setMessages((messages || []).concat(newMessage));
                    return;
                }
            }

            // If the user is NOT in the correct section, increment unread count instead
            useConversation.getState().incrementUnreadCount(newMessage.chatRoom, newMessage._id);

            useConversation.getState().updateConversationLastMessage(newMessage);
        });

        

        socket?.on("conversationUpdate", ({ conversationId, lastMessage, chatRoomType }) => {

            if (chatRoomType === 'channel') {
                setChannels([
                    ...channels.map((conversation) =>
                        conversation._id === conversationId
                            ? { ...conversation, lastMessage }
                            : conversation
                    )
                ]);
            } else {
                setConversations([
                    ...conversations.map((conversation) =>
                        conversation._id === conversationId
                            ? { ...conversation, lastMessage }
                            : conversation
                    )
                ]);
            }

            console.log("Update work kr rha h", chatRoomType);
            
        });
        

        socket?.on("messageDeleted", (deletedMessageId) => {
            setMessages([
                ...messages.filter((message) => message._id !== deletedMessageId)
            ]);
        });

        socket?.on("newConversation", (newConversation) => {
            // Update Zustand state directly to avoid stale closure issues:
            useConversation.setState((state) => {
              if (!state.conversations.some((c) => c._id === newConversation._id)) {
                const updatedConversations = [...state.conversations, newConversation];
                console.log("Updated conversations:", updatedConversations);
                return { conversations: updatedConversations };
              }
              return {};
            });
      
            // Optionally, play a notification sound:
            const playSound = () => {
              const sound = new Audio(notificationSound);
              sound.play().catch((error) => {
                console.log("Audio playback prevented:", error);
                localStorage.setItem("playSoundOnNextInteraction", "true");
              });
            };
            playSound();
        });

        socket?.on("newChannel", (newChannel) => {
            console.log("Received new channel:", newChannel);
            // Update Zustand state directly to avoid stale closure issues:
            useConversation.setState((state) => {
              if (!state.channels.some((c) => c._id === newChannel._id)) {
                const updatedChannels = [...state.channels, newChannel];
                console.log("Updated channels:", updatedChannels);
                return { channels: updatedChannels };
              }
              return {};
            });
        });

        return () => {
            socket?.off("newMessage");
            socket?.off("messageDeleted");
            socket?.off("conversationUpdate");
            socket?.off("newConversation");
            socket?.off("newChannel");
        };
    }, [socket, setMessages, messages, updateConversationLastMessage, setConversations, conversations, selectedConversation, selectedElement, channels, setChannels]);

};

export default useListenMessages;
