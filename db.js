const mongoose = require("mongoose");

const mongoUri =
  "mongodb+srv://sayanmondal:sayan2003@cluster0.2ocm9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const connectToMongo = () => {
  mongoose.connect(mongoUri, () => {
    console.log("MongoDb connected successfully!");
  });
};

module.exports = connectToMongo
