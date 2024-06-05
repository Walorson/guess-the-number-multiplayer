import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:3000");

const button = document.getElementById("button");
const number = document.getElementById("number");
const roomName = localStorage.getItem("roomName");
const username = localStorage.getItem("username");

socket.on("connect", () => {
    console.log("Połączono")
    socket.emit("joinGame", roomName);
});

button.addEventListener("click", () => {
    socket.emit("startGame", Number(number.value), roomName);
});

socket.on("endGuess", (attempts, guesserUsername) => {
    console.log("KURWA")
    document.write(`Twój przeciwnik <b>${guesserUsername}</b> zgadł za ${attempts} razem!`);
});