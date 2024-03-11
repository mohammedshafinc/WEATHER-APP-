const express = require("express");
const cors = require("cors");
const connectDb = require("./config/config");
const { graphqlHTTP } = require('express-graphql');
const schema = require("./schema/schema");
require("dotenv").config();
const app = express();
app.use(cors());
// Parse URL-encoded bodies

const port = process.env.PORT;
console.log(port);

app.use(
    "/graphql",
    graphqlHTTP({
        schema,
        graphiql: true,
    })
);

connectDb()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on ${port}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to server:", error.message);
    });
