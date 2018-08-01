//Ref: https://dzone.com/articles/creating-a-chat-application-in-node-js-with-expres

var express = require("express");

var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var app = express();

var conString = "mongodb://localhost:27017/meanapp";

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

var Chats = mongoose.model("Chats", {
  name: String,
  chat: String
});

mongoose.connect(
  conString,
  { useMongoClient: true },
  err => {
    console.log("Database connection", err);
  }
);

app.get("/chats", (req, res) => {
  console.log("get chats");
  Chats.find({}, (error, chats) => {
    res.send(chats);
  });
});

app.post("/chats", async (req, res) => {
  try {
    var chat = new Chats(req.body);

    await chat.save();

    res.sendStatus(200);

    //Emit the event

    io.emit("chat", req.body);
  } catch (error) {
    res.sendStatus(500);

    console.error(error);
  }
});

// app.listen(3020, () => {
//   console.log("Well done, now I am listening...");
// });

var http = require("http").Server(app);

var io = require("socket.io")(http);

io.on("connection", socket => {
  console.log("Socket is connected...");
});

var server = http.listen(3020, () => {
  console.log("Well done, now I am listening on ", server.address().port);
});
