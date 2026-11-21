require("dotenv").config({ quite: true })
const express = require("express");
const connectDb = require("./src/config/database");
const app = express();
const port = process.env.PORT || 3000




connectDb()
app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})