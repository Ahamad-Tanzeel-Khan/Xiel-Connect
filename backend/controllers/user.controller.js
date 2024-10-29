import User from "../models/user.model.js";

export const getUserForProfile = async(req, res) => {
    try {

        const loggedInUserId = req.user._id;

        const filteredUsers = await User.findOne({_id: loggedInUserId});

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.error("Error in getUserForProfile controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}