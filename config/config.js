const mongoose = require("mongoose");
function connectDb() {
    return mongoose
        .connect(process.env.MONGO_URL, {
            dbName: "weatherapp",
        })
        .then(() => {
            console.log("connected to mongoDb");
        })
        .catch((error) => {
            console.log("error connecting to mongoDb");
        });
}
module.exports = connectDb;
