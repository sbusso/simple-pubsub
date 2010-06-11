var	sys = require("sys"),
	net = require("net"),
	io = require('./socket.io/lib/socket.io/client')
	
function broadcast(clients, data){
	for (var j = 0;j<clients.length;j++)
	{
		//sys.debug("send:"+clients[j].sessionId);
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

function hasBroadcast(id, clientsList){
	for(var n =0;n < clientsList.length; n++) {
		if(id == clientsList[n].sessionId){
			return true;
		}
	}
	return false;
}

exports.createServer = function (channels) {
  return net.createServer(function(socket){
		//socket.setNoDelay(true);
	  socket.setEncoding("utf8");
		socket.addListener("connect", function(){
	    sys.debug("hello publisher\r\n");
		});
	  socket.addListener("data", function (data) {
			// manage Nagle buffer, multiple data sent once
			var chunks = data.split('\\ufffd'),
	      count = chunks.length - 1; // last is "" or a partial packet
	    for(var i = 0; i < count; i++) {
				var chunk = chunks[i];
					obj = JSON.parse(chunk),
					path =  extract_channel(obj.channel);
					//channelKeys = keys(channels);
					var clients = new Array();
				for(key in channels){

					if (RegExp("^"+key).test(path)){
						sys.debug("key ok:"+key);
						var subscribers = channels[key];
						for(var k=0;k<subscribers.length;k++){
							if(!hasBroadcast(subscribers[k].sessionId, clients)){
								clients.push(subscribers[k]);
							}
						}
					}
				}
				broadcast(clients, chunk);
			}
	  });
	  socket.addListener("end", function () {
	    sys.debug("goodbye publisher\r\n");
	    socket.end();
	  });
	});
};