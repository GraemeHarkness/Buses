var sun = new Image();
var moon = new Image();
var earth = new Image();

function Bus( index, xi, yi ) {
    this.index = index;
    this.x = xi;
    this.y = yi;
    this.tick = function() {

       this.x += 1;
       if ( this.x >= 300 ) {
         this.x = 0;
       }
    }
};

function Stop( index, x, y ) {
  this.index = index;
  this.nWaiting = 4;
}

var buses = [ new Bus( 0, 0, 150 ), new Bus( 1, 100, 150 ) ];
//var bus = new Bus(0,150);

function init(){
  sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
  moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
  earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
  window.requestAnimationFrame(draw);
}

function draw() {
  var canvas = document.getElementById('tutorial');
  var ctx = canvas.getContext('2d');

  //ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0,0,800,300); // clear canvas

  //ctx.fillStyle = 'rgba(0,0,0,0.4)';
  //ctx.strokeStyle = 'rgba(0,153,255,0.4)';

  for (var i = 0 ; i < buses.length ; ++i ) { 
    var bus = buses[i];

    ctx.save();
    ctx.translate(bus.x, bus.y);
    ctx.drawImage(moon, -3.5, 3.5);
    ctx.restore();
    bus.tick();
  }

  // ctx.save();
  // ctx.translate(150,150);

  // // Earth
  // var time = new Date();
  // ctx.rotate( ((2*Math.PI)/60)*time.getSeconds() + ((2*Math.PI)/60000)*time.getMilliseconds() );
  // console.log(time.getTime());
  // ctx.translate(105,0);
  // ctx.fillRect(0,-12,50,24); // Shadow
  // ctx.drawImage(earth,-12,-12);

  // // Moon
  // ctx.save();
  // ctx.rotate( ((2*Math.PI)/6)*time.getSeconds() + ((2*Math.PI)/6000)*time.getMilliseconds() );
  // ctx.translate(0,28.5);
  // ctx.drawImage(moon,-3.5,-3.5);
  // ctx.restore();

  // ctx.restore();
  
  // ctx.beginPath();
  // ctx.arc(150,150,105,0,Math.PI*2,false); // Earth orbit
  // ctx.stroke();
 
  // ctx.drawImage(sun,0,0,300,300);

  window.requestAnimationFrame(draw);
}

init();
