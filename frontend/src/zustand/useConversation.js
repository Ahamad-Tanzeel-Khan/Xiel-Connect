import { create } from "zustand";

// Helper function to load unread counts from localStorage           
const loadUnreadCounts = () => {
  const storedCounts = localStorage.getItem("unreadCounts");
  return storedCounts ? JSON.parse(storedCounts) : {};
};

// Helper function to save unread counts to localStorage
const saveUnreadCounts = (unreadCounts) => {
  localStorage.setItem("unreadCounts", JSON.stringify(unreadCounts));
};

const useConversation = create((set) => ({
  selectedConversation: null,
  conversations: [],
  setConversations: (conversations) => set({ conversations: Array.isArray(conversations) ? conversations : [] }),
  channels: [],
  setChannels: (channels) => set({ channels }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  unreadCounts: loadUnreadCounts(), // Load initial unreadCounts from localStorage
  favoriteConversations: [], // Initialize as an empty array
  setFavoriteConversations: (favorites) => set({ favoriteConversations: favorites }),

  setSelectedConversation: (chat, selectedElement) => set((state) => {
    if (!chat) return { selectedConversation: null };

    const updatedUnreadCounts = { ...state.unreadCounts };

    // Ensure unread messages are only marked read if in the correct section
    const isChannel = chat.isChannel || false;
    if ((selectedElement === 'chat' && !isChannel) || (selectedElement === 'channels' && isChannel)) {
      updatedUnreadCounts[chat._id] = 0; // Reset unread count
    }

    return { selectedConversation: chat, unreadCounts: updatedUnreadCounts };
  }),

  incrementUnreadCount: (conversationId, messageId) =>
    set((state) => {
      const { selectedConversation, unreadCounts, lastIncrementedMessage } = state;
  
      // If the conversation is open, do nothing
      if (selectedConversation && selectedConversation._id === conversationId) {
        return {}; // No change needed
      }
  
      const updatedUnreadCounts = { ...unreadCounts };
  
      // Prevent incrementing multiple times for the same message
      if (lastIncrementedMessage !== messageId) {
        updatedUnreadCounts[conversationId] = (updatedUnreadCounts[conversationId] || 0) + 1;
  
        // Save updated unread counts to localStorage
        saveUnreadCounts(updatedUnreadCounts);
  
        return { unreadCounts: updatedUnreadCounts, lastIncrementedMessage: messageId };
      }
  
      return {}; // No update if the message was already counted
    }),
  

  clearUnreadCount: (conversationId) =>
    set((state) => {
      const updatedUnreadCounts = { ...state.unreadCounts };
      updatedUnreadCounts[conversationId] = 0;

      // Save updated unread counts to localStorage
      saveUnreadCounts(updatedUnreadCounts);

      return { unreadCounts: updatedUnreadCounts };
    }),

  toggleFavoriteConversation: (conversationId) => set((state) => {
    const favoriteConversations = state.favoriteConversations || []; // Ensure it's an array
    const isFavorite = favoriteConversations.includes(conversationId);
    const updatedFavorites = isFavorite
      ? favoriteConversations.filter(id => id !== conversationId)
      : [...favoriteConversations, conversationId];
    
    return { favoriteConversations: updatedFavorites };
  }),

  updateConversationLastMessage: (newMessage) =>
    set((state) => {
      const updatedConversations = state.conversations
        .map((conversation) =>
          conversation._id === newMessage.chatRoom
            ? {
                ...conversation,
                lastMessage: {
                  _id: newMessage._id,
                  text: newMessage.message,
                  timestamp: new Date(),
                },
              }
            : conversation
        )
        .sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp));

      return { conversations: updatedConversations };
    }),
}));

export default useConversation;
