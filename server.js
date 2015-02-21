var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var port = process.env.PORT || 8081;
var fs = require('fs');

app.listen(port);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var webIo = io.of('/web');
var arduinoIo = io.of('/arduino');
var arduino = {
  status: 'offline'
};

webIo.on('connection', function(socket) {
  socket
    .on('up', function() {
      arduinoIo.emit('move', {dir: 'up'});
    })
    .on('down', function() {
      arduinoIo.emit('move', {dir: 'down'});
    })
    .on('board', function() {
      socket.emit('board', arduino); // to the web client that made the request
      socket.broadcast.emit('board', arduino); // to every web client
    });
});

arduinoIo.on('connection', function(socket) {
  socket
    .on('board', function(data) {
      arduino = data;
      webIo.emit('board', arduino);
    })
    .on('disconnect', function() {
      arduino.status = 'offline';
      webIo.emit('board', arduino);
    });
});
