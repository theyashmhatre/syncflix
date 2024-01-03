const express = require("express");
const app = express();
const path = require('path');
const PORT = process.env.PORT || 4000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

async function getCount(roomID) {
  const sockets = await io.in(roomID).fetchSockets();
  let users = [];

  for (const socket of sockets) {
    users.push(socket.data);
  }
  io.to(roomID).emit("connections_updated", users);
}

function secondsToTime(e) {
  const h = Math.floor(e / 3600).toString().padStart(2, '0'),
    m = Math.floor(e % 3600 / 60).toString().padStart(2, '0'),
    s = Math.floor(e % 60).toString().padStart(2, '0');

  return h + ':' + m + ':' + s;
  //return `${h}:${m}:${s}`;
}

io.on('connection', (socket) => {
  console.log(`a user connected ${socket.id}`);

  socket.on('message', (msg) => {
    io.emit("message", msg.msg);
  });

  socket.on("join_room", async ({ roomID, data }) => {
    socket.data = data
    socket.join(roomID);
    console.log(`User with ID: ${socket.id} joined room: ${roomID}`);
    await getCount(roomID);
  });

  socket.on("connections_updated", async ({ roomID, id }) => {
    io.in(id).socketsLeave(roomID);
    await getCount(roomID)
  })

  socket.on("remove_user", async ({ roomID, id, adminID, adminName, removedUsername }) => {
    console.log(roomID, id, adminName, removedUsername, "remove_user");
    io.in(id).socketsLeave(roomID);
    await getCount(roomID);
    io.sockets.in(roomID).emit("room message", { message: `${adminName} removed ${removedUsername}.`, id: adminID, userData: removedUsername, type: 'remove' });
    io.sockets.in(id).emit("removed")
  })

  socket.on("make_admin", async ({ newAdminEmail, adminID, roomID, admin, newAdmin }) => {
    const sockets = await io.in(roomID).fetchSockets();

    Object.keys(sockets).forEach(key => {
      let value = sockets[key]["data"]["email"];
      if (value === newAdminEmail) {
        sockets[parseInt(key)].data.isAdmin = true;
      }
    });
    await getCount(roomID);
    if (adminID) {
      io.sockets.in(roomID).emit("room message", { message: `${admin} made ${newAdmin} an admin.`, id: adminID, userData: newAdmin, type: 'update' });
    }
  })

  socket.on("remove_admin", async ({ removedAdminEmail, adminID, roomID, admin, removedAdmin }) => {
    console.log("remove_admin", { removedAdminEmail, roomID, admin, removedAdmin });
    const sockets = await io.in(roomID).fetchSockets();

    Object.keys(sockets).forEach(key => {
      let value = sockets[key]["data"]["email"];
      if (value === removedAdminEmail) {
        sockets[parseInt(key)].data.isAdmin = false;
      }
    });
    await getCount(roomID);
    io.sockets.in(roomID).emit("room message", { message: `${admin} removed ${removedAdmin} as an admin.`, id: adminID, userData: removedAdmin, type: 'update' });
  })

  socket.on('disconnect', async (roomID) => {
    console.log('A disconnection has been made')
  })

  socket.on("disconnecting", () => {
    console.log(socket.rooms, socket.id, "disconnecting"); // the Set contains at least the socket ID
  });

  socket.on("room message", async ({ room, message, userData, type }) => {
    socket.to(room).emit("room message", { message: message, id: socket.id, userData: userData, type: type });
  })

  socket.on("private msg", ({ private_user, message }) => {
    socket.to(private_user).emit("private msg", message);
  })

  socket.on("play", ({ room, time, userData, type }) => {
    const message = `${userData.name} played`
    socket.to(room).emit("play", time, message, userData, type);
    console.log("play", room, time)
  })
  socket.on("pause", ({ room, time, userData, type }) => {
    const message = `${userData.name} paused`
    socket.to(room).emit("pause", time, message, userData, type);
    console.log("pause", room, time)
  })
  socket.on("seekdone", async ({ room, time, userData, type }) => {
    const message = `${userData.name} seeked to ${secondsToTime(time)}`
    socket.to(room).emit("seekdone", time, message, userData, type);
    let roomUsers = await io.in("help").fetchSockets()
    console.log(roomUsers);
    roomUsers.forEach((obj) => {
      console.log(obj.id);
    });
  })

  socket.on("ratechange", ({ room, rate, userData, type }) => {
    const message = `${userData.name} changed playback speed to ${rate}`
    socket.to(room).emit("ratechange", rate, message, userData, type);
  })

  socket.on("ended", ({ room, time }) => {
    socket.to(room).emit("ended", time);
    console.log("ended", room, time)
  })
});


app.get("/wake-up", (req, res) => res.json("👌"));

app.use('*', (req, res) => {
  res.status(404).json({ msg: 'Not Found' });
});

server.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));