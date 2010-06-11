Simple PubSub
=============

The aim of this framework is to provide a very simple pubsub system for real time web updates (push):

- a ruby publisher sending objects to a channel
- a node hub receiving updates (no storage) and dispatching data
- a client receiving subscribed updates
- web part update, automatically mapped from the channel and using embedded micro templates.
 
 
Publisher: publisher.rb
=========

The publisher is very simple, sending information with json. One publisher can publish on any channel. In the original attempt, there is only one publisher, the main app. 

<pre><code>require 'lib/publisher'
pub =  Publisher.new('localhost')
pub.publish("/path/to/channel", {:text => "hello world"})</code></pre>
 
Hub: server.js
====
 
This is the master piece of the mechanism. The node server is based on [socket.io](http://github.com/LearnBoost/Socket.IO-node) module. Manages websocket clients and also subscription. Listening to the publisher, it will dispatch the messages to subscribers. Also has a keepalive hack to maintain websocket. Currently uses port 8080, waiting for http proxy to fully support websocket (nginx) 

 

Subscriber engine (browser client)
==================================

The client part uses [socket.io](http://github.com/LearnBoost/Socket.IO) for data transport and then send data to a small engine. A very simple engine, mapping subscribed channel with a [mustache-js](http://github.com/janl/mustache.js/) template, and providing javascript objects.

Auto subscription:

Each element of your webpage with _subscriber_ css class will subscribe to the channel corresponding to its _id_ (minus the integer if you need to identify this element with an integer): _main_name_1234_ will subscribe to the _/main/name_ channel.

Template: 

For each event type (root of channel) you have to write a javascript object with the attribute template (mustache.js) and optionnally the html method and a callback.

Nested channel (TODO)
==============

/event/sub_event*/id

TODO
====

- client keepalive / reconnect
- don't duplicate subscriptions
- use authentication on some channels
- nested channels (server)

