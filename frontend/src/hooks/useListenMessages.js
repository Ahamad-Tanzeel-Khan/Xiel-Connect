import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3"

const useListenMessages = () => {
    const {socket} = useSocketContext();
    const {messages, setMessages, updateConversationLastMessage, setConversations, conversations, selectedConversation } = useConversation();

    useEffect(() => {
      socket?.on("newMessage", (newMessage) => {

        newMessage.shouldShake = true;
        const sound = new Audio(notificationSound);
        sound.play()
        if (selectedConversation && newMessage.chatRoom === selectedConversation?._id) {
          setMessages((messages || []).concat(newMessage));
          return;
        }

        useConversation.getState().incrementUnreadCount(newMessage.chatRoom);

        useConversation.getState().updateConversationLastMessage(newMessage);

        // updateConversationLastMessage(newMessage); 
      })



      socket?.on("conversationUpdate", ({ conversationId, lastMessage }) => {
        setConversations([
          ...conversations.map((conversation) =>
              conversation._id === conversationId
                  ? { ...conversation, lastMessage }
                  : conversation
          )
        ]);
      });
      

      socket?.on("messageDeleted", (deletedMessageId) => {
        setMessages([
          ...messages.filter((message) => message._id !== deletedMessageId)
        ]);
      });

      return () => {
        socket?.off("newMessage");
        socket?.off("messageDeleted");
        socket?.off("conversationUpdate");
      };
    }, [socket, setMessages, messages, updateConversationLastMessage, setConversations, conversations, selectedConversation ])
    
}

export default useListenMessages;