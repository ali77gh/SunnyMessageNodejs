const error = require('../common/error');


/**
 * @param {object} packet 
 * @param {WebSocket} packet 
 * @returns {boolean} 
 */
function joinValidation(socket, packet){

    if(!Array.isArray(packet["rooms"])){
        error(socket, "put array in 'rooms'")
        return false;
    }

    for (var element of packet["rooms"]){
        if(typeof(element)!== 'string'){
            error(socket, "array element should be string uuid")
            return false
        }
    }

    return true
}


/**
 * @param {object} packet 
 * @param {WebSocket} packet 
 * @returns {boolean} 
 */
function publishValidation(socket, packet){

    if(typeof(packet["room_id"]) != 'string'){
        error(socket, "room_id should be string")
        return false
    }

    if(typeof(packet["data"]) != 'object'){
        error(socket, "data should be object")
        return false
    }


    return true
}

/**
 * @param {WebSocket} socket 
 * @param {object} packet 
 * @returns {boolean} 
 */
function validate(socket, packet){

    switch(packet["action"]){
        case undefined:
            error(socket, "provide \"action\" on body")
            return false

        case "join":
            return joinValidation(socket, packet)

        case "publish":
            return publishValidation(socket, packet)
        
        default:
            error(socket, "action not supported")
            return false

    }
}

module.exports = validate;