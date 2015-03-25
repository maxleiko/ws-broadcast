# ws-broadcast
Broadcast messages from a client to every other connected client (without echoing to the sender)  

### Handles rooms
You can split clients into groups by connecting them to a different path
You just have to append a `/path` to the server url:

ws://localhost:9001/myRoom
