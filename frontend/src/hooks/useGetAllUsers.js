import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetAllUsers = () => {
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const getAllUsers = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/users");
				const data = await res.json();
				if (data.error) {
					throw new Error(data.error);
				}
				setUsers(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getAllUsers();
	}, []);

	return { loading, users };
};
export default useGetAllUsers;