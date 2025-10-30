const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const path = require("path");
const AbletonLink = require("abletonlink");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// serve client.html at root
app.use(express.static(path.join(__dirname)));

// Ableton Link session (bpm=120, quantum=4, enabled=true)
const link = new AbletonLink(120, 4, true);

// Global beat clock
let beatPosition = 0;               // running beat count
let lastUpdate = Date.now() / 1000; // last wall-clock update

function updateClock() {
  const now = Date.now() / 1000;
  const delta = now - lastUpdate;
  lastUpdate = now;

  // advance beats based on bpm
  const secondsPerBeat = 60 / link.bpm;
  beatPosition += delta / secondsPerBeat;
  const phase = beatPosition % 4;

  return { beat: beatPosition, phase };
}

function broadcastState() {
  const { beat, phase } = updateClock();
  const msg = JSON.stringify({ bpm: link.bpm, beat, phase });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(msg);
  });
}

// broadcast state to clients
setInterval(broadcastState, 50); // update every 50ms

// allow clients to change tempo
wss.on("connection", (ws) => {
  console.log("Browser client connected");
  // immediately share the current clock with the newly connected client
  const { beat, phase } = updateClock();
  ws.send(JSON.stringify({ bpm: link.bpm, beat, phase }));

  ws.on("message", (msg) => {
    try {
      const { bpm } = JSON.parse(msg);
      if (typeof bpm === "number" && Number.isFinite(bpm) && bpm > 0) {
        link.bpm = bpm;
        console.log(`Tempo set to ${bpm}`);
        broadcastState(); // push the updated tempo to all peers right away
      }
    } catch (e) {
      console.error("Invalid message", e);
    }
  });
});

server.listen(3000, () => {
  console.log("Link bridge running at http://localhost:3000");
});
