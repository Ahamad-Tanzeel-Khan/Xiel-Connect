import { create } from "zustand";

const useConversation = create((set) => ({
    selectedConversation: null,
    conversations: [],
    setConversations: (conversations) => set({ conversations }),
    messages: [],
    setMessages: (messages) => set({ messages }),
    unreadCounts: {},
    favoriteConversations: [], 
    setFavoriteConversations: (favorites) => set({ favoriteConversations: favorites }),

    setSelectedConversation: (conversation) =>
        set((state) => {
            const updatedUnreadCounts = { ...state.unreadCounts };
            if (conversation) {
                updatedUnreadCounts[conversation._id] = 0;
            }
            return { selectedConversation: conversation, unreadCounts: updatedUnreadCounts };
        }),

    incrementUnreadCount: (conversationId) =>
        set((state) => {
            const updatedUnreadCounts = { ...state.unreadCounts };
            updatedUnreadCounts[conversationId] = (updatedUnreadCounts[conversationId] || 0) + 1;
            return { unreadCounts: updatedUnreadCounts };
        }),

    clearUnreadCount: (conversationId) =>
        set((state) => {
            const updatedUnreadCounts = { ...state.unreadCounts };
            updatedUnreadCounts[conversationId] = 0;
            return { unreadCounts: updatedUnreadCounts };
        }),

    toggleFavoriteConversation: (conversationId) => set((state) => {
        const isFavorite = state.favoriteConversations.includes(conversationId);
        const updatedFavorites = isFavorite
            ? state.favoriteConversations.filter(id => id !== conversationId)
            : [...state.favoriteConversations, conversationId];
        
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
