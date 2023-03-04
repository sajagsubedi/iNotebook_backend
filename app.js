require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const connectToDB = require("./db");
const port = process.env.PORT || 5000;
const cors = require("cors");
const mongoURl =process.env.Mongo_Url;

//middlewares
app.use(express.json());
app.use(cors());

//Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

//extra middlewares for error handling and route not found
app.use(require("./middleware/errorHandler"));
app.use(require("./middleware/not-found"));

//start function : to Connect to the database and then start app respectively
const start = async () => {
  await connectToDB(mongoURl);
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
};

//start function call
start();
