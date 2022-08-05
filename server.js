const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
  process.env.DATABASE_URL.replace("<password>", process.env.DB_PASSWORD),
  () => {
    console.log("database successfully connected.");
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  console.log(`Listening on port ${PORT}`);
});
