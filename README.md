# ws-broadcast
Broadcast messages from a client to every other connected clients (without echoing to the sender)  
The messages can be clustered in "rooms" by using different `/path` (see "Handles room" below)

### Install
```sh
npm i -g ws-broadcast
```

You can now start a `ws-broacast` or `wsb` in your any shell.


### Usage
```sh
ws-broadcast
```

This will start an `express` Web server and a `WebSocket` server on default `0.0.0.0:3000`  

### Change port
If you want to change the **default port** use:
```sh
PORT=9090 ws-broadcast
```

### Handles rooms
You can split clients into groups by connecting them to a different path  
You just have to append a `/path` to the server url:

`ws://localhost:9001/myRoom`

By doing so, clients will only be able to communicate with other clients from the same room.  
There is no way for clients to communicate with other rooms.

### Docker image
You can also start a `ws-broadcast` using Docker:
```sh
docker run -d maxleiko/ws-broadcast
```
