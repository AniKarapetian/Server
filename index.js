const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const messages = JSON.parse(data);
    socket.emit('load_messages', messages);
  });

 
  socket.on('new_message', (message) => {
    fs.readFile('./db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const messages = JSON.parse(data);
      messages.push(message);

      fs.writeFile('./db.json', JSON.stringify(messages, null, 2), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        io.emit('new_message', message);
      });
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('game_over',(data)=>{
    io.emit('game_over', data);
  });

  socket.on('ask',(data)=>{
    io.emit('ask', data);
  });

  socket.on('answer',(data)=>{
    io.emit('answer', data);
  });


  socket.on('attack',(data)=>{
    io.emit('attack', data);
  });

  socket.on('check-attack',(data)=>{
    io.emit('check-attack', data);
  });
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
