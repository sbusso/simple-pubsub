function handle_event(data){
  var obj = JSON.parse(data);
  var channel = obj.channel.split("/"),
    event_type = channel[1],
    id = "#"+event_type+"_"+channel[channel.length - 1],
    event_obj = window["_"+event_type], 
    rendered = Mustache.to_html(event_obj.template, obj);
		var chain = "$(id)."+event_obj.action+"(rendered)"
		if (event_obj.callback != null){
			chain += "."+event_obj.callback;
		}
    eval(chain);
};

function extract_channel(ident){
	var parts = ident.split('_');
	if( isNaN( parseInt(parts[parts.length-1]) ) ) {
		return '/'+parts.join('/');
	} else {
		return '/'+parts.slice(0, -1).join('/');
	}
}

function subscribers(){
	var socket = new io.Socket('turf-live', {port: 8080});
	socket.connect();
	console.log("connected to socket.io");
	socket.addEvent('message', function(data){
			if(data === "keepalive"){
				console.log("keepalive");
			} else {
				handle_event(data);
			}
	});
	$(".subscriber").each(function(){
		console.log("subscriber element "+$(this).attr('id'));
		socket.send({subscribe: extract_channel($(this).attr('id'))});
	});
	socket.addEvent('disconnect', function(data){
			console.log("disconnected from socket.io");
			socket.connect();
			console.log("connected to socket.io");
	});
}

$(function() {
	io.setPath('/javascripts/socket.io/');
  subscribers();
});
