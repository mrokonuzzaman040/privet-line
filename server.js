const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  const httpServer = http.createServer(server)
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  })

  io.on("connection", (socket) => {
    console.log("a user connected")

    socket.on("chat message", (msg) => {
      io.emit("chat message", msg)
    })

    socket.on("typing", (data) => {
      socket.broadcast.emit("typing", data)
    })

    socket.on("stop typing", (data) => {
      socket.broadcast.emit("stop typing", data)
    })

    socket.on("disconnect", () => {
      console.log("user disconnected")
    })
  })

  server.all("*", (req, res) => {
    return handle(req, res)
  })

  httpServer.listen(3000, (err) => {
    if (err) throw err
    console.log("> Ready on http://localhost:3000")
  })
})

