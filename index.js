var ws      = require('websocket.io');
var https   = require('https');
var express = require('express'); 
var app     = express();
var fs      = require('fs');

var hostname = 'localhost';
var port     = 9021;
var url      = 'wss://' + hostname + ':' + port + '/';
var opts = {
  cert: fs.readFileSync('./server.crt'),
  key: fs.readFileSync('./server.key')
};

app.use(express.static(__dirname + "/public")); 
var ssl_server = https.createServer(opts, app);

var wss = ws.attach(ssl_server);
wss.on('connection', function(socket) {
  socket.on('message', function(data) {
    for (i = 0; i < wss.clientsCount; i++) {
      wss.clients[i].send(data);
    }
  }); 
});

ssl_server.listen(port, function() {
  console.log('Listening on ' + port);
});

