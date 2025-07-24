require("dotenv").config();
const app = require("./index");
const connectJERSEY_BACKENED = require("./config/jersey_backend");
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5050;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});
// Expose io on app for use in controllers
app.set('io', io);

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
  });
});

connectJERSEY_BACKENED()
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);  // Exit if DB connection fails
  });
