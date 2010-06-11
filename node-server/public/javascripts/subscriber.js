Array.prototype.hasKey = function(){ 
  for(i in this){ 
    if(i === arguments[0]) 
      return true; 
  }; 
  return false; 
};
// Event engine
// - transform the data in object
// - get the template corresponding to the channel
// - render the update html
// - update DOM subscribers
function handle_event(data, channels){
  var obj = JSON.parse(data);
  var channel = obj.channel.split("/"),
    event_type = channel[1],
		path = extract_channel_from_path(obj.channel),
    //id = "#"+event_type+"_"+channel[channel.length - 1],
    event_obj = window["_"+event_type], 
    rendered = Mustache.to_html(event_obj.template, obj),
		pre_chain = "')."+event_obj.action+"(rendered)";
	if (event_obj.callback != null){
		pre_chain += "."+event_obj.callback;
	}

	for(key in channels){
		if (RegExp("^"+key).test(path)){
			var ids = channels[key];
			for(var i =0;i < ids.length; i++) {
				eval("$('#"+ids[i]+pre_chain);
			}
		}
	}
};

// Extract channel from path
// - if path include integer ID then remove it
function extract_channel(ident){
	var parts = ident.split('_');
	if( isNaN( parseInt(parts[parts.length-1]) ) ) {
		return '/'+parts.join('/');
	} else {
		return '/'+parts.slice(0, -1).join('/');
	}
}

function extract_channel_from_path(path){
	var parts = path.split('/');
	if( isNaN( parseInt(parts[parts.length-1]) ) ) {
		return parts.join('/');
	} else {
		return parts.slice(0, -1).join('/');
	}
}

// initialize the socket and subscribe to channels
function subscribers(){
	var socket = new io.Socket('turf-live', {port: 8080}),
			channels = new Array();
	socket.connect();
	console.log("connected to socket.io");
	$(".subscriber").each(function(){
		var this_id = $(this).attr('id')
		console.log("subscriber element "+ this_id);
		channel = extract_channel(this_id);
		if (!(channels.hasKey(channel))){
			channels[channel] = [];
			socket.send({subscribe: channel});
		}
		channels[channel].push(this_id);
	});
	socket.addEvent('message', function(data){
			if(data === "keepalive"){
				console.log("keepalive");
			} else {
				handle_event(data, channels);
			}
	});
	socket.addEvent('disconnect', function(data){
			console.log("disconnected from socket.io");
			socket.connect();
			console.log("connected to socket.io");
	});
}

// initialize
$(function() {
	io.setPath('/javascripts/socket.io/');
  subscribers();
});
