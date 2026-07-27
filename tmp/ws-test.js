const io = require("socket.io-client");

const socket = io("http://localhost:3002", {
 
});

const DRIVER_ID = "6a66d1f4123443371b023194";
const RIDE_ID = "6a66d244123443371b02319f"; 

socket.on("connect", () => {
  console.log("✅ WebSocket Connected! ID:", socket.id);

  socket.emit("driver:register", { driverId: DRIVER_ID });
  console.log("📤 Sent: driver:register");

  socket.emit("ride:join", { rideId: RIDE_ID });
  console.log("📤 Sent: ride:join");
});

socket.on("connect_error", (err) => {
  console.log("❌ Connection Error:", err.message);
});

socket.on("ride:offer", (data) => {
  console.log("📩 Received ride:offer →", JSON.stringify(data, null, 2));
});

socket.on("ride:accepted", (data) => {
  console.log("📩 Received ride:accepted →", data);
});

socket.on("ride:status", (data) => {
  console.log("📩 Received ride:status →", data);
});

socket.on("ride:completed", (data) => {
  console.log("📩 Received ride:completed →", data);
});

socket.on("ride:cancelled", (data) => {
  console.log("📩 Received ride:cancelled →", data);
});

socket.on("ride:expired", (data) => {
  console.log("📩 Received ride:expired →", data);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected");
});

setTimeout(() => {
  socket.emit("driver:location", {
    driverId: DRIVER_ID,
    rideId: RIDE_ID,
    lat: 24.861,
    lng: 67.0015,
  });
  console.log("📤 Sent: driver:location update");
}, 2000);
