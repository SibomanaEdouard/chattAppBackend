
const express = require('express');
const app = express();
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const http = require('http');
const cors = require("cors");
const server = http.createServer(app) 
const {Server} = require('socket.io')
const socketio = new Server(server, {
  
  // cors:'http://localhost:150'//this may also works
  cors:'*'
})

app.use(cors());

// Handle new socket connections
socketio.on('connection', (socket) => {
  console.log(`User ${socket.id} just connected`);

  socket.on('disconnect', () => {
    console.log(`User  was disconnected`);
  });
});

app.use((req,res,next)=>{
  req.socketio=socketio;
  next();
})

// Other configurations
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Something went wrong: ' + error);
  });

// Routes
app.use('/sign', routes);

// Start the server
server.listen(5500, (error) => {
  if (error) throw error;
  console.log('Server is running');
});
module.exports=socketio;


 