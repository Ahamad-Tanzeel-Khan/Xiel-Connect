import { useState } from "react"
import toast from "react-hot-toast";

const useCreateChannel = () => {

    const [load, setLoad] = useState(false);

    const createChannel = async({name, description, participants, icon}) => {

        const success = handleInputErrors({name, description});
        if (!success) {
            return
        }

        setLoad(true);

        const formData = new FormData();
        if (icon) formData.append("mediaFile", icon);
    
        let iconUrl = "";
        if (icon) {
            try {
                const uploadRes = await fetch("/api/upload", {
                    method: 'POST',
                    body: formData,
                });
                const uploadData = await uploadRes.json();
                if (uploadData.url) {
                    iconUrl = uploadData.url;
                }
            } catch (uploadError) {
                console.error("File upload error:", uploadError);
                toast.error("Failed to upload icon.");
            }
        }
    
        try {
            const res = await fetch("/api/channel/create", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description, participants, icon: iconUrl }),
            });
    
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            toast.success("Channel created successfully");
        } catch (error) {
            toast.error(error.message);
        } finally{
            setLoad(false);
        }
    };
    
    return {load, createChannel};
}

export default useCreateChannel;

function handleInputErrors({name, description}) {
    if (!name) {
        toast.error(`Please enter a name`);
        return false;
    }

    if (name.length < 4) {
        toast.error('Channel name must be at least 4 characters');
        return false;
    }
    else if (description.length >= 300) {
        toast.error('Description length must be less than 300 words');
        return false;
    }
    return true;
}