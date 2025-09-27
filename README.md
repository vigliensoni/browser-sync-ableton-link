# Browser-sync-ableton-link


## Ableton Link Web Bridge

Synchronize tempo and beat phase between multiple **web browser clients** using [Ableton Link](https://www.ableton.com/link/) and a Node.js bridge.  

Open multiple browser windows and have them play clicks **in sync**, with tempo changes instantly applied across all instances.

---

## Features
- Synchronize **tempo (BPM)** and **phasor/beat phase** across browsers.
- Real-time distributed clock using Node.js + WebSockets.
- Clients schedule audio clicks with the **Web Audio API**.
- Downbeat is highlighted with a higher tone (880 Hz), other beats use a lower tone (440 Hz).
- Any client can change the global tempo, and all stay aligned.

---

### Installation and usage
```
npm init -y
npm install express ws abletonlink
node server.js
```

Open [http://localhost:3000/client.html](http://localhost:3000/client.html) 

Press **Start Audio** to enable sound. Open the same page in multiple browsers or devices on  local network to test synchronization.

---

## How It Works
- The Node.js server uses the `abletonlink` library to maintain a Link session at a given BPM.
- A simple global beat clock (`beatPosition`) runs continuously on the server.
- Every 50 ms, the server broadcasts the current BPM, beat index, and phase to all connected clients.
- Browser clients schedule audio clicks aligned to the next beat based on the server’s timing data.
- Changing the tempo in one client sends an update to the server, which propagates to all peers.

---

## File Overview
- `server.js`  
Node.js application that hosts the WebSocket server, Ableton Link session, and serves static files.

- `client.html`  
Browser client that connects to the server, schedules audio clicks in sync, and provides a simple BPM control.

---

## Usage Notes
- Make sure to allow audio playback in your browser (browsers require user interaction before sound can start).
- On other devices in the same network, replace `localhost` in `client.html` with your server’s LAN IP.
- The project currently provides basic synchronization. Advanced Link features (e.g., drift correction, start/stop transport) would require deeper integration with the Ableton Link SDK.

---

## License
MIT License



