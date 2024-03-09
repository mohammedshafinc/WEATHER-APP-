const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDb = require("./config/config");
const user = require("./routes/userRoute");

require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

const port = process.env.PORT;

app.use("/", user);

connectDb()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on ${port}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to server:", error.message);
    });
