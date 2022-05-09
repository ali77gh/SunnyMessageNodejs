const WebSocket = require('ws');
const server = new WebSocket.Server({
  port: 8080
});

let sockets = [];
server.on('connection', function (socket) {
    sockets.push(socket);

    socket.on('message', function (msg) {
        onMessage(socket, msg);
    });

    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', function () {
        sockets = sockets.filter(s => s !== socket);
    });
});


function onMessage(socket,msg) {
    console.log(socket);
    console.log(msg);
}