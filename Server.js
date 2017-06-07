function Server (portNumber) {
    // We need to use the express framework: have a real web servler that knows how to send mime types etc.
    this.express = require('express');
    this.app = null;
    this.http = null;
    this.server = null;
    this.io = null;
    // usernames which are currently connected to the chat
    this.usernames = {};
    this.listOfPlayers = {};
    var init = function () {
        // Init globals variables for each module required
        this.app = this.express();
        this.http = require('http');
        this.server = http.createServer(app);
        this.io = require('socket.io').listen(this.server);

        // launch the http server on given port
        this.server.listen(portNumber);

        // Indicate where static files are located. Without this, no external js file, no css...
        this.app.use(this.express.static(__dirname + '/'));


        // routing
        this.app.get('/', function (req, res) {
            res.sendfile(__dirname + '/simpleChat.html');
        });

        this.io.sockets.on('connection', function (socket) {

            // when the client emits 'sendchat', this listens and executes
            socket.on('sendchat', function (data) {
                // we tell the client to execute 'updatechat' with 2 parameters
                this.io.sockets.emit('updatechat', socket.username, data);
            });

            // when the client emits 'sendchat', this listens and executes
            socket.on('sendpos', function (newPos) {
                // we tell the client to execute 'updatepos' with 2 parameters
                //console.log("recu sendPos");
                socket.broadcast.emit('updatepos', socket.username, newPos);
            });

            // when the client emits 'adduser', this listens and executes
            socket.on('adduser', function (username) {
                // we store the username in the socket session for this client
                // the 'socket' variable is unique for each client connected,
                // so we can use it as a sort of HTTP session
                socket.username = username;
                // add the client's username to the global list
                // similar to usernames.michel = 'michel', usernames.toto = 'toto'
                this.usernames[username] = username;
                // echo to the current client that he is connecter
                socket.emit('updatechat', 'SERVER', 'you have connected');
                // echo to all client except current, that a new person has connected
                socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
                // tell all clients to update the list of users on the GUI
                io.sockets.emit('updateusers', this.usernames);

                // Create a new player and store his position too... for that
                // we have an object that is a "list of players" in that form
                // listOfPlayer = {'michel':{'x':0, 'y':0, 'v':0},
                // 							john:{'x':10, 'y':10, 'v':0}}
                // for this example we have x, y and v for speed... ?
                var player = {'x': 0, 'y': 0, 'v': 0}
                this.listOfPlayers[username] = player;
                io.sockets.emit('updatePlayers', this.listOfPlayers);
            });

            // when the user disconnects.. perform this
            socket.on('disconnect', function () {
                // remove the username from global usernames list
                delete this.usernames[socket.username];
                // update list of users in chat, client-side
                io.sockets.emit('updateusers', this.usernames);

                // Remove the player too
                delete this.listOfPlayers[socket.username];
                io.sockets.emit('updatePlayers', this.listOfPlayers);

                // echo globally that this client has left
                socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
            });
        });
    };

    return{
        init : init
    }
}