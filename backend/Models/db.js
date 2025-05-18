const mongoose = require("mongoose");
const DB_NAME = "Project0";
const mongo_url = `${process.env.MONGODB_URI}/${DB_NAME}`;

mongoose
  .connect(mongo_url)
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error: ", err);
  });
