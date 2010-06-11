Simple PubSub
=============

The aim of this framework is to provide a very simple pubsub system (thinking of Bayeux) for real time web updates (push):

- a ruby publisher (other can be developed)
- a node hub receiving updates (no store)
- a client receiving update it subscribed to
- web part live update, automatically mapped from the channel and with embedded micro templates.
 
 
Publisher: publisher.rb
=========

The publisher is very simple, sending information with json. Only one publisher can publish on any channel. In the original project, there is only one publisher providing any channel. 

<pre><code>require 'lib/publisher'
pub =  Publisher.new('localhost')
pub.publish("/path/to/channel", {:text => "hello world"})</code></pre>
 
Hub: server.js
====
 
The node server is based on [socket.io](http://github.com/LearnBoost/Socket.IO-node) module. Managing subscription and broadcasting. Also has a keepalive hack to maintain websocket. Currently uses port 8080 for websocket, waiting for http proxy to fully support websocket (nginx) 

This is the master piece of the mechanism. Manages websocket clients and also subscription. Listening to the publisher, it will dispatch the messages to subscribers.

Subscriber engine (browser client)
==================================

The client part uses [socket.io](http://github.com/LearnBoost/Socket.IO) for data transport and then send data to a small engine. A very simple engine, mapping subscribed channel with a [mustache-js](http://github.com/janl/mustache.js/) template, and providing javascript objects.

Auto subscription:

Each element of your webpage with _subscriber_ css class will be subscribed to the channel corresponding to its _id_ minus the integer if you need to identify this element with an integer. The subscribed channel will be mapped from the _id_:

<pre> main_name_1234 => /main/name </pre>

template: for each event type (root of channel) you have to write a javascript object with the attribute template (mustache.js) and optionnally the html method and a callback.

Nested channel (TODO)
==============

/event/sub_event*/id

TODO
====

- client keepalive / reconnect
- don't duplicate subscriptions
- use authentication on some channels
- nested channels (server)

