const express = require("express");
const {newUser, getAll, getUser, updateUser, deleteUser, getUserById, getUserByName, updateUserById, updateUserByName, deleteUserById, deleteUserByName} = require("../controller/user.controller");

const userRoute = express.Router();

userRoute.route("/user").post(newUser) //create new user
userRoute.route("/user").get(getAll) //retrieve all users
userRoute.route("/user/:id").get(getUserById) //retrieve user by id 
userRoute.route("/users").get(getUserByName) //retrieve user by name
userRoute.route("/user/update/:id").put(updateUserById) //update user informtion by id 
userRoute.route("/user/update").put(updateUserByName) //update user informtion by name 
userRoute.route("/user/delete/:id").delete(deleteUserById) //delete user by id 
userRoute.route("/user/delete").delete(deleteUserByName) //delete user by name 

module.exports = userRoute;