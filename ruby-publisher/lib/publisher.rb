require 'rubygems'
require 'json' # 'msgpack'
require 'socket'
#require 'eventmachine'
require 'pp'


class Publisher
  
  def initialize(addr = '127.0.0.1', port = 8081)
    @socket = TCPSocket.new(addr, port)
  end

  def publish(channel, opts)
    # EventMachine::run do
    #   EventMachine::connect(addr, port, Publisher).instance_eval(&block)
    # end
    request = {:channel => channel}.merge(opts).to_json+ '\ufffd'
    @socket.print request
  end
  
  def destroy
    @socket.close
  end
end
