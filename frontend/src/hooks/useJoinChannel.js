import { useState } from "react"
import toast from "react-hot-toast";

const useJoinChannel = () => {

    const [load, setLoad] = useState(false);

    const joinChannel = async({inviteCode}) => {

        const success = handleInputErrors({inviteCode});
        if (!success) {
            return
        }

        setLoad(true);

        console.log(inviteCode);
        

        try {
            const res = await fetch(`/api/channel/join/${inviteCode}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                // body: JSON.stringify({ inviteCode }),
            });
    
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            // toast.success("Channel created successfully");
        } catch (error) {
            toast.error(error.message);
        } finally{
            setLoad(false);
        }
    };
    
    return {load, joinChannel};
}

export default useJoinChannel;

function handleInputErrors({inviteCode}) {
    if (!inviteCode) {
        toast.error(`Please enter a code`);
        return false;
    }
    return true;
}