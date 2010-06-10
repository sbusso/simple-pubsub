Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

Array.prototype.hasKey = function(){ 
  for(i in this){ 
    if(i === arguments[0]) 
      return true; 
  }; 
  return false; 
};
