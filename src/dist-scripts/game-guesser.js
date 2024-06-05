import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:3000");

const roomName = localStorage.getItem("roomName");
const username = localStorage.getItem("username");
let numberToGuess;

socket.on("connect", () => {
    console.log("Połączono")
    socket.emit("joinGame", roomName);
});

socket.on("startGuess", (number) => {
    numberToGuess = number;

    document.body.innerHTML = `
        <div>HOST CI PODAŁ LICZBĘ DO ZGADNIĘCIA W ZAKRESIE OD 0 DO 100</div>
        <input type="number" min="0" max="100" id="input">
        <button id="button">Zgaduj</button>
        <div id="output"></div>
    `;

    const button = document.getElementById("button");
    const input = document.getElementById("input");
    const output = document.getElementById("output");
    let attempts = 0;

    button.onclick = () => {
        attempts++;

        if(Number(input.value) > numberToGuess)
        {
            output.textContent = "ZA DUZO!";
        }
        else if(Number(input.value) < numberToGuess)
        {
            output.textContent = "ZA MALO!";
        }
        else {
            output.textContent = "UDAŁO CI SIĘ ZGADNĄĆ ZA "+attempts+" RAZEM!";
            socket.emit("endGame", attempts, username, roomName);
        }
    }
});