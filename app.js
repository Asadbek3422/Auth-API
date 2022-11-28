const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user.routes");

const PORT = config.get("port");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/auth", userRouter);

async function start() {
  try {
    await mongoose.connect(config.get("dbURI")).then(
      () => console.log("Bazaga ulandi"),
      (error) => {
        console.log("Bazaga ulanishda xatolik!", error);
      }
    );
    app.listen(PORT, () =>
      console.log(`Example app listening on port ${PORT}!`)
    );
  } catch (error) {
    console.log("Serverda xatolik!", error);
  }
}

start();
