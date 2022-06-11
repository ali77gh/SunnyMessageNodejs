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

console.log("signaling server is up on port " + config.signalingPort);

server.on('connection', function (socket) {

    socket["socketId"] = (Math.random() + 1).toString(36).substring(2)

    console.log(`connection: ${socket.address}`);
    socket.on('message', function (msg) {
        console.log(`msg: ${msg}`);
        try{
            onMessage(socket, msg);
        }catch(e){
            console.log(`err: ${e}`);
        }
    });

    socket.on('close', function () {
        console.log(`disconnect: ${socket.address}`);
        try{
            room_manager.leftAll(socket);
        } catch(e) {
            console.log(`err: ${e}`);
        }
    });
});

/**
 @param {WebSocket} socket
 @param {string} msg
*/
function onMessage(socket, msg) {
    var body = JSON.parse(msg.toString())

    if(!validate(socket,body)) return;

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