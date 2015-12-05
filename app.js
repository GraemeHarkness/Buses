!function (window, canvas) {
    'use strict';
    var busImage = new Image();
    var stopImage = new Image();

    function Bus(xi, yi) {
        this.x = xi;
        this.y = yi;
        this.speed = 1;
        this.stuckAtLights = false;
        this.atAStop = false;
        this.currentStop = null;

        this.tick = function () {
            if (!this.stuckAtLights) {
                this.x += this.speed;
            }

            if (this.currentStop !== null) {
                this.speed = 0;
                this.currentStop.nPassengersWaiting -= 1;
                if (this.currentStop.nPassengersWaiting <= 0) {  // we don't have to wait next time
                    this.departedStop();
                }
            } else {  // between bus stops
                this.speed = 1;
            }

            if (this.x >= 1600) {
                this.x -= 1600;
            }
        };

        this.arrivedAtStop = function (stop) {
            stop.busCurrentlyStopped = true;
            this.currentStop = stop;
        };

        this.departedStop = function () {
            this.currentStop.busCurrentlyStopped = false;
            this.currentStop = null;
        };

        this.boundingBox = function () {
            var toReturn = {};
            toReturn.xmin = this.x - 10;
            toReturn.xmax = this.x + 42;
            toReturn.ymin = this.y - 10;
            toReturn.ymax = this.y + 32;
            return toReturn;
        };

        this.click = function () {
            this.stuckAtLights = !this.stuckAtLights;
            console.log("Bus clicked.  Stuck : " + this.stuckAtLights);
        };

        this.draw = function (ctx) {
            ctx.drawImage(busImage, this.x - 3.5, this.y + 3.5);
            if (this.x > 1500) {
                ctx.drawImage(busImage, this.x - 3.5 - 1600, this.y + 3.5);
            }
        }
    }

    function Stop(index, x, y) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.nPassengersWaiting = 100.0;
        this.arrivalRate = 0.2;
        this.busCurrentlyStopped = false;

        this.tick = function () {
            this.nPassengersWaiting += this.arrivalRate;
        };

        this.click = function () {
            if (this.arrivalRate < 0.3) {
                this.arrivalRate += 0.2;
            } else {
                this.arrivalRate = 0.2;
            }
        };

        this.boundingBox = function () {
            var toReturn = {};
            toReturn.xmin = this.x - 30;
            toReturn.xmax = this.x + 62;
            toReturn.ymin = this.y;
            toReturn.ymax = this.y + 100;
            return toReturn;
        };

        this.draw = function (ctx) {
            var seed = this.x;
            for (var i = 0; i < this.nPassengersWaiting; i += 10) {
                var tmp = Math.sin(seed++) * 10000;
                var randomInZeroToOne = tmp - Math.floor(tmp);
                var xOffset = (randomInZeroToOne - 0.5) * 20;
                ctx.drawImage(stopImage, this.x + xOffset, this.y + i / 2);
            }
        }
    }

    var buses = [];
    var stops = [];

    function init() {
        canvas.addEventListener("mousedown", handleMouseDown, false);

        busImage.src = 'smallBus.png';
        stopImage.src = 'person.png';
        for (var busInitIndex = 0; busInitIndex < 1600; busInitIndex += 400) {
            buses.push(new Bus(busInitIndex, 150));
        }

        var stopIndex = 0;
        for (var stopsInitIndex = 200; stopsInitIndex < 1600; stopsInitIndex += 400) {
            stops.push(new Stop(stopIndex++, stopsInitIndex, 200));
        }
        window.requestAnimationFrame(draw);
    }

    function draw() {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 1600, 800);

        // Update buses and draw them
        for (var busDrawIndex = 0; busDrawIndex < buses.length; ++busDrawIndex) {
            var bus = buses[busDrawIndex];
            bus.draw(ctx);
            bus.tick();
        }

        // Update bus stops and draw them
        for (var stopIndex = 0; stopIndex < stops.length; ++stopIndex) {
            var stop = stops[stopIndex];
            stop.draw(ctx);
            stop.tick();
        }

        // Check for buses arriving at stops
        for (var busArrivalIndex = 0; busArrivalIndex < buses.length; ++busArrivalIndex) {
            var possiblyArrivingBus = buses[busArrivalIndex];
            for (var j = 0; j < stops.length; ++j) {
                var stopWithPossibleBus = stops[j];
                if (possiblyArrivingBus.x === stopWithPossibleBus.x && !stopWithPossibleBus.busCurrentlyStopped) {
                    possiblyArrivingBus.arrivedAtStop(stopWithPossibleBus);
                }
            }
        }

        window.requestAnimationFrame(draw);
    }

    function handleMouseDown(event) {
        var xClicked = event.x;
        var yClicked = event.y;
        xClicked -= canvas.offsetLeft;
        yClicked -= canvas.offsetTop;

        // Find which stop the click is within, if any
        for (var stopClickIndex = 0; stopClickIndex < stops.length; ++stopClickIndex) {
            var stop = stops[stopClickIndex];
            if (inside(xClicked, yClicked, stop.boundingBox())) {
                stop.click();
            }
        }

        // Find which bus the click is within, if any
        for (var busClickIndex = 0; busClickIndex < buses.length; ++busClickIndex) {
            var bus = buses[busClickIndex];
            if (inside(xClicked, yClicked, bus.boundingBox())) {
                bus.click();
            }
        }
    }

    function inside(x, y, bbox) {
        if (x > bbox.xmax) return false;
        if (x < bbox.xmin) return false;
        if (y > bbox.ymax) return false;
        //noinspection RedundantIfStatementJS
        if (y < bbox.ymin) return false;
        return true;
    }

    init();
}(window, document.getElementById('tutorial'));