import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";

const useMarkAsRead = () => {
    const { clearUnreadCount } = useConversation();

    const markAsRead = async (conversationId, isChannel) => {
        try {


            const res = await fetch("/api/messages/markAsRead", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId, isChannel })
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            clearUnreadCount(conversationId);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return { markAsRead };
};

export default useMarkAsRead;
