import { io } from "../_snowpack/pkg/socket.io-client.js";

const socket = io("https://guess-the-number-multiplayer.onrender.com/");
const nicknameDiv = document.getElementById("nickname");
const hostBtn = document.getElementById("host-button");

let username = "";
let nicknamesList = ["TAZOSY", "WiRUS", "FLOATING", "NOVEMBER", "WIESŁAW", "SZYNKA", "FOREVER", "PYSIEK", "KASZTAN", "KURWIAK", "SZEWCZON", "POST", "DIABEL", "AWEJNIAK"];

socket.on("connect", () => {
    const rand = Math.floor(Math.random()*11);
    username = nicknamesList[rand];
    nicknameDiv.innerHTML = `Witaj <i><b>${username}</b></i>!`;

    localStorage.setItem("username", username);
});

const roomsDiv = document.getElementById("rooms");
function addNewRoom(name, hostUsername) 
{
    roomsDiv.innerHTML += `<div class="room" data-hostUsername="${hostUsername}" data-roomName="${name}"><b>${name} <i>1/2</i></b><button>Join</button></div>`;
}

function hostGame() 
{
    const roomName = username+"'s room";
    socket.emit("hostGame", roomName, username);

    hideRoomList();
    createText("OCZEKIWANIE NA GRACZA!");

    localStorage.setItem("roomName", roomName);
}

hostBtn.addEventListener("click", hostGame)

socket.on("hostGame", (roomName, hostUsername) => 
{
    addNewRoom(roomName, hostUsername);
}); 

socket.on("userJoinToRoom", (username) => {
    createText(`<b>${username}</b> dołączył do gry! YEEEAH`);
    createAcceptButton();
})

function joinRoom(roomName, hostUsername)
{
    socket.emit("roomJoin", roomName, username);

    hideRoomList();
    createText(`Dołączyłeś do <b>${hostUsername}</b>`);
    createAcceptButton();

    localStorage.setItem("roomName", roomName);
}

function createAcceptButton() 
{
    let btn = document.createElement("button");
    btn.textContent = "Akceptacja";
    btn.onclick = () => {
        socket.emit("gameAccept");
    }
    document.body.append(btn);
}


function createText(text)
{
    let title = document.createElement("div");
    title.innerHTML = text;
    document.body.append(title);
}

function hideRoomList()
{
    roomsDiv.style.display = "none";
    hostBtn.style.display = "none";
}

let pingInterval;
let ping = 0;

function refreshRoomsList()
{
    socket.emit("getRoomsList");
    socket.emit("getPing");
    pingInterval = setInterval(() => { ping++; console.log("sex") }, 1);
}

socket.on("sendRoomsList", (roomsList) => {
    roomsDiv.innerHTML = "";
    Object.values(roomsList).forEach(room => {
        addNewRoom(room.name, room.hostUsername);
    });

    document.querySelectorAll(".room").forEach(room => {
        room.querySelector("button").onclick = () => {
            joinRoom(room.getAttribute("data-roomName"), room.getAttribute("data-hostUsername"));
        }
    });

    clearInterval(pingInterval);
    document.getElementById("ping").textContent = `Ping: ${ping}ms`;
    ping = 0;
});

setInterval(refreshRoomsList, 1500);

socket.on("startGameHost", () => {
    location.href = "./game-host.html";
});

socket.on("startGameGuesser", () => {
    location.href = "./game-guesser.html";
});