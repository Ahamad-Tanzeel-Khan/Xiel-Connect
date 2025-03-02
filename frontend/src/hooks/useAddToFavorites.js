import { useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";

const useAddToFavorites = () => {
    const [loading, setLoading] = useState(false);
    const { selectedConversation, toggleFavoriteConversation } = useConversation();

    const addToFavorites = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/favorites/add-or-remove/${selectedConversation._id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    isChannel : selectedConversation.isChannel
                }),
            });

            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            toast.success(data.message);
            toggleFavoriteConversation(selectedConversation._id); // Update Zustand locally

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, addToFavorites };
};

export default useAddToFavorites;
