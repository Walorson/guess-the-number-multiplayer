import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:3000");
const nicknameDiv = document.getElementById("nickname");
const hostBtn = document.getElementById("host-button");
let username = "";
let nicknamesList = ["TAZOSY", "SPERMOLUD", "FLOATING", "NOVEMBER", "WIESŁAW", "SZYNKA", "FOREVER", "PYSIEK", "KASZTAN", "KURWIAK", "SZEWCZON"];

socket.on("connect", () => {
    const rand = Math.floor(Math.random()*11);
    username = nicknamesList[rand];
    nicknameDiv.innerHTML = `Witaj <i><b>${username}</b></i>!`;
});

const roomsDiv = document.getElementById("rooms");
function addNewRoom(name) 
{
    roomsDiv.innerHTML += `<div class="room"><b>${name} <i>1/2</i></b><button class="join">Join</button></div>`;
}

function hostGame() 
{
    const roomName = username+"'s room";
    socket.emit("hostGame", roomName, username);

    hideRoomList();
    createText("OCZEKIWANIE NA GRACZA!");
}

hostBtn.addEventListener("click", hostGame)

socket.on("hostGame", (roomName, hostUsername) => {
    addNewRoom(roomName);
    document.querySelector(".join").onclick = () => 
    { 
        socket.emit("roomJoin", roomName, username);

        hideRoomList();
        createText(`Dołączyłeś do <b>${hostUsername}</b>`);
        createAcceptButton();
    }
}); 

socket.on("userJoinToRoom", (username) => {
    createText(`<b>${username}</b> dołączył do gry! YEEEAH`);
    createAcceptButton();
})

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