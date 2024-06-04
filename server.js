const io = require('socket.io')(process.env.PORT || 3000, {
    cors: { origin: "*" }
});

class Room {
    usersAccept = {};

    constructor(name, hostID) {
        this.name = name;
        this.users = [hostID];
        this.usersAccept[hostID] = false;
    }

    addUser(userID) {
        this.users.push(userID);
        this.usersAccept[userID] = false;
    }
}

const rooms = {};

io.on('connection', socket => {
   socket.on("hostGame", (roomName, username) => {
        socket.broadcast.emit("hostGame", roomName, username);
        socket.join(roomName);
        rooms[roomName] = new Room(roomName, socket.id);
   });

   socket.on("roomJoin", (roomName, username) => {
        if(rooms[roomName].users.length >= 2) return;

        socket.join(roomName);
        socket.to(roomName).emit("userJoinToRoom", username);
        rooms[roomName].addUser(socket.id);
        
   });

   socket.on("gameAccept",() => {
    console.log(rooms)
        rooms[Array.from(socket.rooms)[1]].usersAccept[socket.id] = true;
        console.log(rooms)
   });
});