import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";

const useGetFavorites = () => {
    const [loading, setLoading] = useState(false);
    const { setFavoriteConversations } = useConversation();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getFavorites = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/favorites/get");
                const data = await res.json();
                
                if (data.error) {
                    throw new Error(data.error);
                }
                setUsers(data);
                setFavoriteConversations(data.map((conv) => conv._id)); 
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        getFavorites();
    }, [setFavoriteConversations]);

    return { loading, users };
};

export default useGetFavorites;
