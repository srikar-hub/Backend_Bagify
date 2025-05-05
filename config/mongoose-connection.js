const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://koppunoorisrikar:MuMMy1234@cluster0.o4j2uh1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(function () {
    console.log("Connected Successfully");
  })
  .catch(function (err) {
    console.log(err);
  });
module.exports = mongoose.connection;
