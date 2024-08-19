const express = require("express");
const userRoute = require("./route/user.route")

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(userRoute)

app.get("/", (req, res) => {
    res.status(200).send("Welcome to A Simple User Management System API")
});

module.exports = app;