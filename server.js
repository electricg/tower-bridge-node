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

io.on('connection', function(socket) {
  socket.on('up', function() {
    console.log('up');
    socket.broadcast.emit('move', {dir: 'up'});
  });

  socket.on('down', function() {
    console.log('down');
    socket.broadcast.emit('move', {dir: 'down'});
  });

  socket.on('board', function(data) {
    console.log('board ' + data.status);
    socket.broadcast.emit('board', data);
  });
});