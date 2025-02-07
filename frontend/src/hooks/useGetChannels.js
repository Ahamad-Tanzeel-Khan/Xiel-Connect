import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetChannels = () => {
    const [loading, setLoading] = useState(false);
    const { setChannels } = useConversation();

    useEffect(() => {
        const getChannels = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/channel/get");
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setChannels(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        getChannels();
    }, [setChannels]);

    return { loading };
};
export default useGetChannels;
