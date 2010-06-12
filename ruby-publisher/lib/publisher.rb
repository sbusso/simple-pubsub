require 'rubygems'
require 'json' # 'msgpack'
require 'socket'
#require 'eventmachine'
require 'logger'

class Publisher
  
  attr :state
  
  def logger
    @logger ||= defined?(Rails) ? Rails.logger : Logger.new(STDOUT)
  end
  
  def initialize(addr = '127.0.0.1', port = 8081)
    @state = :disconnected
    begin
      @socket = TCPSocket.new(addr, port)
      @state = :connected
    rescue
      logger.debug "Publisher connexion failed"
    end
  end

  def publish(channel, opts)
    if connected?
      request = {:channel => channel}.merge(opts).to_json+ '\ufffd'
      begin
        @socket.print request
      rescue
        logger.debug "An error occured during publication"
      end
    else
      logger.debug "The publisher is not connected"
    end
  end
  
  def connected?
    return @state == :connected
  end
  
  def destroy
    @socket.close if connected?
  end
end
