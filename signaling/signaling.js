const room_manager = require('./room_manager')

const WebSocket = require('ws');
const validate = require('./validation');
const config = require('../common/config');


//see configs here:
// https://github.com/websockets/ws/blob/master/doc/ws.md#websocketsenddata-options-callback
const server = new WebSocket.Server({
  port: config.signalingPort,
  maxPayload: 1024 * 10, // 10KiB and default is 100MiB 104857600
  backlog: 10000 // number of pending sockets
});

server.on('connection', function (socket) {

    socket.on('message', function (msg) {
        onMessage(socket, msg);
    });

    socket.on('close', function () {
        room_manager.leftAll(socket);
        room_manager.removeSocket(socket);
    });
});

/**
 @param {WebSocket} socket
 @param {string} msg
*/
function onMessage(socket, msg) {
    var body = JSON.parse(msg.toString())

    if(!validate(body)) return;

    switch(body["action"]){
        case "join":
            room_manager.joinRooms(socket, body["rooms"])
            break

        case "publish":
            room_manager.publish(socket, body["room_id"], body["data"])
            break

        // TODO action 'left'
    }
}