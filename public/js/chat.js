var socket = io();
var messages = document.getElementById("messages");
// import randomWords from 'random-words'


(function() {
  $("form").submit(function(e) {
    let li = document.createElement("li");
    e.preventDefault(); // prevents page reloading

    const data = {
      sender: username,
      message: $("#message").val()
    }

    socket.emit("chat message", data);

    messages.appendChild(li).append($("#message").val());
    let span = document.createElement("span");
    messages.appendChild(span).append("by " + data.sender + ": " + "just now");

    $("#message").val("");
    $("#messages").animate({scrollTop:$("#messages")[0].scrollHeight}, 300)

    return false;
  });

  socket.on("received", data => {

    console.log(data);

    let li = document.createElement("li");
    let span = document.createElement("span");
    var messages = document.getElementById("messages");
    messages.appendChild(li).append(data.message);
    messages.appendChild(span).append("by " + data.sender + ": " + "just now");
    console.log("Hello bingo!");
    $("#messages").animate({scrollTop:$("#messages")[0].scrollHeight}, 300)

  });
})();


// fetching initial chat messages from the database
(function() {
  fetch("/chats")
    .then(data => {
      return data.json();
    })
    .then(json => {
      json.map(data => {
        let li = document.createElement("li");
        let span = document.createElement("span");
        messages.appendChild(li).append(data.message);
        messages
          .appendChild(span)
          .append("by " + data.sender + ": " + formatTimeAgo(data.createdAt));
      });
      $("#messages").animate({scrollTop:$("#messages")[0].scrollHeight}, 1500)
    });
  })();


const date = Date.now()
console.log(date)
const dateString = `${date}`
console.log(dateString)

const randomNums = dateString.slice(dateString.length-5)

let username
//is typing...

socket.on('newUser', name => {
  username = `${name}_${randomNums}`
  socket.emit('userAdded', username)
  console.log('username', username, 'has entered')
})

let messageInput = document.getElementById("message");
let typing = document.getElementById("typing");

//isTyping event
messageInput.addEventListener("keypress", () => {
  // console.log(username)
  socket.emit("typing", { user: username, message: "is typing..." });
});

socket.on("notifyTyping", data => {
  typing.innerText = data.user + " " + data.message;
  console.log( 'notifyTyping', data.user + data.message);
});

//stop typing
messageInput.addEventListener("keyup", () => {
  socket.emit("stopTyping", "");
});

socket.on("notifyStopTyping", () => {
  typing.innerText = "";
});
