const express = require( "express" )
const http = require( "http" )
const { Server } = require( "socket.io" )

const app = express()
// @ts-ignore
const server = http.createServer( app )
const io = new Server( server, {
  cors: {
    origin: "http://localhost:3000",
    methods: [ "GET", "POST" ],
  },
} )

io.on( "connection", ( socket ) => {
  console.log( "a user connected" )

  socket.on( "chat message", ( msg ) => {
    io.emit( "chat message", msg )
  } )

  socket.on( "call signal", ( data ) => {
    socket.broadcast.emit( "call signal", data )
  } )

  socket.on( "disconnect", () => {
    console.log( "user disconnected" )
  } )
} )

server.listen( 3001, () => {
  console.log( "listening on *:3001" )
} )

