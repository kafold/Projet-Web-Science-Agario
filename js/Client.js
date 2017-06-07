var socket;

var establishConnectionToServer = function () {
    socket = io.connect();

    // on connection to server, ask for user's name with an anonymous callback
    socket.on('connect', function(){
        // call the server-side function 'adduser' and send one parameter (value of prompt)
        socket.emit('adduser', USERNAME,{
            BALLS_ARRAY: BALLS_ARRAY,
            PLAYERS_ARRAY: PLAYERS_ARRAY
        });
    });

    // listener, whenever the server emits 'updatechat', this updates the chat body
    socket.on('updatechat', function (username, data) {
        var chatMessage = "<b>" + username + ":</b> " + data + "<br>";
        conversation.innerHTML += chatMessage;
    });

    // TODO Remove method
    // just one player moved
    socket.on('updatepos', function (username, newPos) {
        //updatePlayerNewPos(newPos);
    });

    // listener, whenever the server emits 'updateusers', this updates the username list
    socket.on('updateusers', function(listOfUsers, arrays) {
        users.innerHTML = "";
        BALLS_ARRAY = arrays.BALLS_ARRAY;
        PLAYERS_ARRAY = arrays.PLAYERS_ARRAY;
        for(var name in listOfUsers) {
            var userLineOfHTML = '<div>' + name + '</div>';
            users.innerHTML += userLineOfHTML;
        }
    });

    // update the whole list of players, useful when a player
    // connects or disconnects, we must update the whole list
    socket.on('updatePlayers', function(listOfplayers) {
        updatePlayers(listOfplayers);
    });
};

function updatePlayers(listOfPlayers){
    PLAYERS_ARRAY = listOfPlayers
}

// sends the chat message to the server
function sendMessage() {
    var message = data.value;
    data.value = "";
    // tell server to execute 'sendchat' and send along one parameter
    socket.emit('sendchat', message);
}