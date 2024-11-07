import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetConversations = () => {
    const [loading, setLoading] = useState(false);
    const { setConversations } = useConversation();

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/conversations");
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setConversations(data); // Set Zustand state
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        getConversations();
    }, [setConversations]);

    return { loading };
};
export default useGetConversations;
