require "lib/publisher"

pub =  Publisher.new('turf-live')
pub.publish("/chat/salon", {:text => "hello world"}) #, :id => 'salon', :event_type => 'chat'})
# pub.publish("/chat/paddocks", {:text => "salut les paddocks"}) #, :id => 'paddocks', :event_type => 'chat'})
# pub.publish("/chat/paddocks", {:text => "salut les potaux"}) #, :id => 'paddocks', :event_type => 'chat'})
# (1..100).each do |i|
#   pub.publish("/chat/paddocks", {:text => "yo yo yo #{Time.now}"}) #, :id => 'paddocks', :event_type => 'chat'})
#   sleep(60)
# end
cotes = [6.0, 27.0, 32.0, 4.4]
# (1..100).each do 
#   cote = rand(4)
#   variation = (rand(40).to_f - 20.0)/10.0
#   p variation
#   if cotes[cote] + variation > 1.9
#     cotes[cote] += variation 
#   end
#   pub.publish("/cote/#{cote+5}", {:cote => cotes[cote]})
#   sleep(2)
# end

pub.publish("/game/41590", { :race_id => 41590,
                            :rc => 'R2C6',
                            :heure => "14:50",
                            :runners => [{:number => 8, :partant_id => 5, :cote => 3.0}, 
                                          {:number => 11, :partant_id => 6, :cote => 25 }, 
                                          {:number => 9, :partant_id => 7, :cote => 29 }, 
                                          {:number => 4, :partant_id => 8, :cote => 4.0}]
                          })
