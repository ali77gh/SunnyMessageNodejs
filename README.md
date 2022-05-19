
# Signaling protocol information:
1. Protocol is standard websocket.(https://www.rfc-editor.org/rfc/rfc6455#section-5.5.2)[Web socket RFC]
2. URL is: ws://<SERVER_ADDRESS>:<SERVER_PORT> 
    or: wss://<SERVER_ADDRESS>:<SERVER_PORT> for websocket over tls
3. web socket body is json.

# Stun protocol information:
1. Protocol is standard Http.
2. body is json.

# Join to list of rooms:
client send this to join: 
~~~json
{
    "action":"join",
    "rooms":[
        "UUID_ROOM_1",
        "UUID_ROOM_2",
        "UUID_ROOM_3"
        .
        .
        .
    ]
}
~~~

# Listen for online status of your contact:
when online status change or first connect client will receive this:
~~~json
{
    "action":"online_status",
    "room_id":"UUID",
    "is_online":true
}
~~~

# publish message
clients can use this api to send data to each other
~~~json
{
    "action":"publish",
    "room_id":"UUID",
    "data": { }
}
~~~