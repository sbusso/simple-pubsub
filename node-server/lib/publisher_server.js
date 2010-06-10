var	sys = require("sys"),
	net = require("net"),
	io = require('./socket.io/lib/socket.io/client')
	
function broadcast(clients, data){
	for (var j = 0;j<clients.length;j++)
	{
	  clients[j].send(data);
	};
}

function extract_channel(path){
	var parts = path.split('/');
	if( isNaN( parseInt(parts[parts.length-1]) ) ) {
		return parts.join('/');
	} else {
		return parts.slice(0, -1).join('/');
	}
}

exports.createServer = function (channels) {
  return net.createServer(function(socket){
		//socket.setNoDelay(true);
	  socket.setEncoding("utf8");
		socket.addListener("connect", function(){
	    sys.debug("hello dear publisher\r\n");
		});
	  socket.addListener("data", function (data) {
			// manage Nagle buffer, multiple data sent once
			 var chunks = data.split('\\ufffd'),
	     count = chunks.length - 1; // last is "" or a partial packet
	    for(var i = 0; i < count; i++) {
				var chunk = chunks[i];
				var obj = JSON.parse(chunk);
				var clients = channels[extract_channel(obj.channel)];
				sys.debug("pub to channel "+extract_channel(obj.channel))
				if (clients){
					broadcast(clients, chunk);
				}
			};
	  });
	  socket.addListener("end", function () {
	    sys.debug("goodbye dear publisher\r\n");
	    socket.end();
	  });
	});
};