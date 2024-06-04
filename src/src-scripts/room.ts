import { io } from "socket.io-client";
const socket = io("http://127.0.0.1:3000");
socket.on("connect",() => {
    const nick: string = prompt("Wpisz swój pseudonim")
})

const roomsDiv = document.getElementById("rooms");

function addNewRoom(name: string): void 
{
    roomsDiv.innerHTML += `<div class="room"><b>${name} <i>1/2</i></b><button>Join</button></div>`;
}