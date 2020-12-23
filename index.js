const express = require('express');
const cookieParser = require('cookie-parser');

// initialize
const app = express();

require('dotenv').config();
require('./DBConfig');

// routes
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api', userRoute);
app.use('/api', authRoute);

// socket config
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('refresh', () => {
    io.emit('refreshPage', {});
  });
});

// server
server.listen(process.env.PORT || 3500, (err) => {
  if (err) return console.log(err);

  console.log(`Server live on port: ${process.env.PORT}`);
});
