const io = require('socket.io')(process.env.PORT || 3000, {
    cors: { origin: "*" }
});

class Room {
    usersAccept = {};

    constructor(name, hostID, hostUsername) {
        this.name = name;
        this.hostUsername = hostUsername;
        this.users = [hostID];
        this.usersAccept[hostID] = false;
    }

    addUser(userID) {
        this.users.push(userID);
        this.usersAccept[userID] = false;
    }

    acceptStatus() {
        let acceptAll = true;
        Object.values(this.usersAccept).forEach(acceptState => {
            if(acceptState == false) {
                acceptAll = false;
                return;
            }
        });
        
        return acceptAll;
    }
}

class Game {
    host = '';
    guesser = '';
    hostUsername = '';
    guesserUsername = '';
}

const games = [];
const rooms = {};

io.on('connection', socket => {
   socket.on("hostGame", (roomName, hostUsername) => {
        socket.broadcast.emit("hostGame", roomName, hostUsername);
        socket.join(roomName);
        rooms[roomName] = new Room(roomName, socket.id, hostUsername);
   });

   socket.on("roomJoin", (roomName, username) => {
        if(rooms[roomName].users.length >= 2) return;

        socket.join(roomName);
        socket.to(roomName).emit("userJoinToRoom", username);
        rooms[roomName].addUser(socket.id);
        
   });

   socket.on("gameAccept",() => {
        let index = Array.from(socket.rooms)[1];
        rooms[index].usersAccept[socket.id] = true;
        if(rooms[index].acceptStatus() === true) {
            io.to(rooms[index].users[0]).emit("startGameHost");
            io.to(rooms[index].users[1]).emit("startGameGuesser");

            delete rooms[index];
            games.push(new Game);
        }
   });

   socket.on("getRoomsList",() => {
        socket.emit("sendRoomsList", rooms)
   });

   //GAME

   socket.on("joinGame", (roomName) => {   
        socket.join(roomName);
   });

   socket.on("startGame", (number, roomName) => {
        socket.to(roomName).emit("startGuess", number);
   })

   socket.on("endGame", (attempts, username, roomName) => {
        socket.to(roomName).emit("endGuess", attempts, username);
   });
});