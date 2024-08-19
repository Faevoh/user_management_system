const userModel = require("../model/user.model");

exports.newUser = async(req, res) => {
    try {
        const {firstName, lastName, email, stack} = req.body;
        if (!firstName || !firstName.trim()){
            return res.status(422).json({
                message: "First name is required"
            });
        }
        if (!lastName || !lastName.trim()){
            return res.status(422).json({
                message: "Last name is required"
            });
        }
        if (!email || !email.trim()){
            return res.status(422).json({
                message: "Email is required"
            });
        }
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)){
            return res.status(422).json({
                message: "Check email and input correct email address"
            });
        }
        const checkMail = await userModel.findOne({email: email})
        if (checkMail){
            return res.status(422).json({
                message: "User with email already exists"
            });
        }
        if (!stack || !stack.trim()){
            return res.status(422).json({
                message: "Tech stack is required"
            });
        }

        const userData = {firstName, lastName, email, stack};
        const createUser = await new userModel(userData);
        createUser.save();

        res.status(201).json({
            message: "New User Created",
            data: createUser
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while creating user",
            error: error.message
        })
    }
};

exports.getAll = async(req, res) => {
    try {
        const allUsers = await userModel.find();
        return res.status(200).json({
            message: `${allUsers.length} users`,
            data: allUsers
        })
    } catch (error) {
        res.status(500).json({
            message: "Encounted an error while fetching users",
            error: error.message
        });
    }
};

exports.getUserById = async(req, res) => {
    try {
        const id = req.params.id;
        if(!id){
            return res.status(404).json({
                message: "params is missing user's id"
            });
        }
        const singleUser = await userModel.findById(id);

        if(!singleUser){
            return res.status(404).json({
                message: "User doesn't exist"
            });
        }else{
            return res.status(200).json({
                data: singleUser
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Encounted an error while fetching user",
            error: error.message
        });
    }
};

exports.getUserByName = async(req, res) => {
    try {
        const {firstName} = req.query
        if(!firstName){
            return res.status(404).json({
                message: "params is missing user's first name"
            });
        }
        const singleUser = await userModel.findOne({firstName: firstName});

        if(!singleUser){
            return res.status(404).json({
                message: "User doesn't exist"
            });
        }else{
            return res.status(200).json({
                data: singleUser
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Encounted an error while fetching user",
            error: error.message
        });
    }
};

exports.updateUserById = async(req, res) => {
    try {
        const id = req.params.id;
        if(!id){
            return res.status(404).json({
                message: "params is missing user's id"
            });
        }

        const findUser = await userModel.findById(id);
        if(!findUser){
            return res.status(404).json({
                message: "User doesn't exist"
            });
        }

        const data = req.body;
        const userInfo = await userModel.findByIdAndUpdate(id, data, {new: true});

        return res.status(200).json({
            message: "User updated successfully",
            data: userInfo
        });
    } catch (error) {
        res.status(500).json({
            message: "Encounted an error while updating user",
            error: error.message
        });
    }
};

exports.updateUserByName = async(req, res) => {
    try {
        const {firstName} = req.query;
        if(!firstName){
            return res.status(404).json({
                message: "params is missing user's first name"
            });
        }

        const findUser = await userModel.findOne({firstName: firstName});
        if(!findUser){
            return res.status(404).json({
                message: "User doesn't exist"
            });
        }

        const data = req.body;
        const userInfo = await userModel.findOneAndUpdate({firstName: firstName}, data, {new: true});

        return res.status(200).json({
            message: "User updated successfully",
            data: userInfo
        });
    } catch (error) {
        res.status(500).json({
            message: "Encounted an error while updating user",
            error: error.message
        });
    }
};

exports.deleteUserById = async(req, res) => {
    try {
        const id = req.params.id;
        if(!id){
            return res.status(404).json({
                message: "params is missing user's id"
            });
        }

        const findUser = await userModel.findById(id);
        if(!findUser){
            return res.status(404).json({
                message: "User doesn't exist"
            });
        }
        const userInfo = await userModel.findByIdAndDelete(id);

        return res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Encounted an error while deleting user",
            error: error.message
        });
    }
};

exports.deleteUserByName = async(req, res) => {
    try {
        const {firstName} = req.query;
        if(!firstName){
            return res.status(404).json({
                message: "params is missing user's id"
            });
        }

        const findUser = await userModel.findOne({firstName: firstName});
        if(!findUser){
            return res.status(404).json({
                message: "User doesn't exist"
            });
        }
        const userInfo = await userModel.deleteOne({firstName: firstName});

        return res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Encounted an error while deleting user",
            error: error.message
        });
    }
};