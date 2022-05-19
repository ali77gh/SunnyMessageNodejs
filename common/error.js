const WebSocket = require('ws');

/**
 * @param {string} msg 
 * @param {WebSocket} msg 
 */
function error(socket, msg){
    socket.send(JSON.stringify({ action: "error", message: msg }))
    console.log(message);
}

module.exports = error;