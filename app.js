//require the express module
const express = require("express");
const app = express();
const dateTime = require("simple-datetime-formater");
const bodyParser = require("body-parser");
const chatRouter = require("./route/chatroute");
const loginRouter = require("./route/loginRoute");

//require the http module
const http = require("http").Server(app);

// require the socket.io module
const io = require("socket.io");

const port = 5000;

//bodyparser middleware
app.use(bodyParser.json());

//routes
app.use("/chats", chatRouter);
app.use("/login", loginRouter);

//set the express.static middleware
app.use(express.static(__dirname + "/public"));

//integrating socketio
socket = io(http);

//database connection
const Chat = require("./models/Chat");
const connect = require("./dbconnect");

const randomWords = require('random-words');
let name


//setup event listener
socket.on("connection", socket => {

  name = randomWords()

  socket.emit('newUser', name)
  socket.on('userAdded', user => {
    name = user
    console.log("user", name, "connected");
  })


  socket.on("disconnect", function() {
    console.log("user", name, "disconnected");
  });

  //Someone is typing
  socket.on("typing", data => {
    console.log('typing', data)

    // const date = `${data.user}`
    
    // console.log('name', name, randomNums)

    socket.broadcast.emit("notifyTyping", {
      user: data.user,
      message: data.message
    });
  });

  //when soemone stops typing
  socket.on("stopTyping", () => {
    socket.broadcast.emit("notifyStopTyping");
  });

  socket.on("chat message", function(formData) {
    console.log("message: ", formData.msg);
    console.log("sender: ", formData.sender)



    //broadcast message to everyone in port:5000 except yourself.
    socket.broadcast.emit("received", formData );
    // socket.emit("received", formData );


    //save chat to the database
    connect.then(db => {
      console.log("connected correctly to the server");
      let chatMessage = new Chat(formData);

      chatMessage.save();
    });
  });
});

http.listen(port, () => {
  console.log("Running on Port: " + port);
});
