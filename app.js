var busImage = new Image();
var stopImage = new Image();

function Bus( xi, yi ) {
    this.x = xi;
    this.y = yi;
    this.speed = 1;
    this.atAStop = false;
    this.currentStop = null;
    this.tick = function() {
      this.x += this.speed;
    
      if ( this.currentStop != null )  {
          this.speed = 0;   
          this.currentStop.nPassengersWaiting -= 1;
          if ( this.currentStop.nPassengersWaiting <= 0 ) {  // we don't have to wait next time
              this.departedStop();
          }
      } else {  // between bus stops
          this.speed = 1;
      }
      
      if ( this.x >= 1600 ) {
        this.x -= 1600;
      }
    }
    this.arrivedAtStop = function( stop ) {
        stop.busCurrentlyStopped = true;
        this.currentStop = stop;
    }
    this.departedStop = function() {
        this.currentStop.busCurrentlyStopped = false;
        this.currentStop = null;
    }
    
    this.draw = function ( ctx ) {
        ctx.drawImage(busImage, this.x-3.5, this.y+3.5);
        if (this.x>1500) {
            ctx.drawImage(busImage, this.x-3.5-1600, this.y+3.5);
        }
    }
};

function Stop( index, x, y ) {
  this.index = index;
  this.x = x;
  this.y = y;
  this.nPassengersWaiting = 100.0;
  this.busCurrentlyStopped = false;
  this.tick = function () {}
  this.draw = function ( ctx ) {
    for ( var i = 0 ; i < this.nPassengersWaiting ; i+=10 ) {
      ctx.drawImage(stopImage, this.x-3.5, this.y+i/2);
    }
  }
}

var buses = [];
var stops = [];

function init(){
  busImage.src = 'smallBus.png';
  stopImage.src = 'stop.png';
  for ( var x = 0 ; x < 1600 ; x+=400 ) {
      buses.push( new Bus( x, 150));
  }

  var stopIndex = 0;
  for ( var x = 200 ; x < 1600 ; x+=400 ) {
      stops.push( new Stop( stopIndex++, x, 200 ));
  }
  window.requestAnimationFrame(draw);
}

function draw() {
  var canvas = document.getElementById('tutorial');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,1600,800);

  // Update buses and draw them
  for (var i = 0 ; i < buses.length ; ++i ) { 
    var bus = buses[i];
    bus.draw(ctx);
    bus.tick();
  }

  // Update bus stops and draw them
  for (var i = 0 ; i < stops.length ; ++i ) { 
    var stop = stops[i];
    stop.draw(ctx);
    stop.tick();
  }
    
  // Check for buses arriving at stops
  for (var i = 0 ; i < buses.length ; ++i ) {
      var bus = buses[i];
      for ( var j = 0 ; j < stops.length ; ++j ) {
          var stop = stops[j];
          if ( bus.x === stop.x && !stop.busCurrentlyStopped ) {
              bus.arrivedAtStop( stop );
          }
      }
  }
    
  // Passengers arrive at stops
  for (var i = 0 ; i < stops.length ; ++i ) { 
    var stop = stops[i];
    stop.nPassengersWaiting += 0.2;
  }
    
  stops[1].nPassengersWaiting += 0.2;
  

  window.requestAnimationFrame(draw);
}

init();
