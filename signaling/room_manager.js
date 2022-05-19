
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

    _joinRoom(socket, roomId) {
        let room = this.rooms[roomId];
        if (room === undefined) {
            // create
            room = [socket];

        } else if (room.length === 0) {
            // first user join
            room[0] = socket;

        } else if (room.length === 1) {
            // second user join
            room[1] = socket;

            var response = JSON.stringify({
                action: "online_status",
                room_id: roomId,
                is_online: true
            });
            room[0].send(response);
            room[1].send(response);

        } else {
            socket.send({ action: error, message: "room is full" })
        }
        this.sockets[socket].append(roomId);
    }

    _left(socket, roomsId) {
        var room = this.rooms[roomsId];
        var response = JSON.stringify({
            action: "online_status",
            room_id: roomId,
            is_online: false
        });
        
        if(room[0] == socket){
            room[1].send(response);
            room.pop(0);
        } else if(room[1] == socket){
            room[0].send(response);
            room.pop(1);
        }
    }

    removeSocket(socket){
        this.sockets[socket] = undefined;
    }

    publish(senderSocket, roomId, data){
        this.rooms[roomId].forEach((socket) => {
            if (socket !== senderSocket)
                socket.send(data);
        })
    }

    joinRooms(socket, roomsIds){
        roomsIds.forEach(roomId => {
            this.joinRoom(socket, roomId);
        });
    }

    leftAll(socket){
        this.sockets[socket].forEach(roomId => {
            this._left(socket, roomId);
        });
    }

}

module.exports = new RoomManager();