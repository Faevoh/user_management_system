const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();

const port  = process.env.PORT;
const database = process.env.DB;

const mongooseConnection = async() => {
    try {
        const db = await mongoose.connect(database);
        console.log("Mongoose Database is connected")

        // console.log(`Connected to MongoDB: ${db.connection.host}`);
        // console.log(`Database Name: ${db.connection.name}`);
    } catch (error) {
        console.log(`Database error: ${error}`)
    }
}
mongooseConnection();

app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
});