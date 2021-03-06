require("./lib/array");
var sys = require("sys"),
	io = require('./lib/socket.io/lib/socket.io'),
	publisher = require("./lib/publisher_server"),
  host = '127.0.0.1';

// subscribers
var clients = [];
var channels = new Array;

// hub server
// ==========
// first create an http listener on port 8080
var http = require('http')
server = http.createServer(function(req, res){});
server.listen(8080);
// plug socket io
io_server = io.listen(server, {
	onClientConnect: function(client){
		sys.debug("client connected on socket.io");
	},
	// Receive a message = subscription
	onClientMessage: function(data, client){
		path = data['subscribe'];
		if (!(channels.hasKey(path))){
			channels[path] = [];
		}
		channels[path].push(client);
		sys.debug("client "+client.sessionId+" subscribe to "+path);
	},	
	// Client disconnected: remove from the list
	onClientDisconnect: function(client){
		sys.debug("client disconnected");
		// TODO: remove client from channels
	 	io_server.clients.remove(client.i);
	}
});

// keepalive hack
function keepAlive(){
	sys.debug("keepalive")
	for (var j = 0;j<io_server.clients.length;j++)
	{
		if (io_server.clients[j] != null){
	  	io_server.clients[j].send("keepalive");
		} else {
			io_server.clients.remove(j);
		}
	};
	setTimeout(function(){ keepAlive(); }, 90000);
}
keepAlive();

// publisher server
// ================
publisher.createServer(channels).listen(8081);