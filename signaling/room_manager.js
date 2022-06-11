const WebSocket = require('ws');
const error = require('../common/error');

class RoomManager{

    constructor(){
        /*
            roomId: [socket1,socket2], // maximum two items
            roomId: [socket1,socket2],
            .
            .
            .
        */

        this.rooms = {}; // use hashmap for o(1) search
        /**
            socket: [roomId,roomId,...],
            socket: [roomId,roomId,...],
            .
            .
            .
        */
        this.sockets = {} // use hashmap for o(1) search
    }

    /**
     * @param {WebSocket} socket 
     * @param {string} roomId 
     */
    _joinRoom(socket, roomId) {
        let room = this.rooms[roomId];
        if (typeof(room) !== 'array') {
            // create
            this.rooms[roomId] = [socket];

        } else if (room.length === 0) {
            // first user join
            room.append(socket);

        } else if (room.length === 1) {
            // second user join
            room.append(socket);

            var response = JSON.stringify({
                action: "online_status",
                room_id: roomId,
                is_online: true
            });
            room[0].send(response);
            room[1].send(response);

        } else {
            error(socket,"room is full");
        }

    }

    /**
     * @param {WebSocket} socket 
     * @param {string} roomId 
     */
    _left(socket, roomId) {
        var room = this.rooms[roomId];
        if(room == undefined)
            return error(socket, "room not exist on left")
        
        if(room[0] == socket){
            room.shift(); // delete item from first of list
        } else if(room[1] == socket){
            room.pop(); // delete item from end of list
        }

        if(room.length == 0) return;

        room[0].send(JSON.stringify({
            action: "online_status",
            room_id: roomId,
            is_online: false
        }));
    }

    /**
     * @param {WebSocket} senderSocket 
     * @param {string} roomId 
     * @param {string} data 
     */
    publish(senderSocket, roomId, data){

        for(var socket of this.rooms[roomId]){
            if (socket !== senderSocket){
                socket.send(JSON.stringify(data));
                return
            }
        }
    }

    /**
     * @param {WebSocket} socket 
     * @param {Array<string>} roomsIds 
     */
    joinRooms(socket, roomsIds){
        roomsIds.forEach(roomId => {
            this._joinRoom(socket, roomId);
        });
        this.sockets[socket["socketId"]] = roomsIds;
        
        console.log("----sockets----")
        console.log(this.sockets)
        console.log("----rooms----")
        console.log(this.rooms)
        console.log("---------------")
    }

    /**
     * @param {WebSocket} socket 
     */
    leftAll(socket){
        this.sockets[socket["socketId"]].forEach(roomId => {
            this._left(socket, roomId);
        });
        delete this.sockets[socket["socketId"]];
        console.log("----sockets----")
        console.log(this.sockets)
        console.log("----rooms----")
        console.log(this.rooms)
        console.log("---------------")
    }

}

module.exports = new RoomManager();