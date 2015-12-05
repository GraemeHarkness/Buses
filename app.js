!function (window, canvas) {
    'use strict';

    var busImage = new Image();
    var stopImage = new Image();
    var buses = [];
    var stops = [];

    var Bus = function (x, y) {
        var speed = 1;
        var stuckAtLights = false;
        var currentStop = null;

        var tick = function () {
            if (!stuckAtLights) {
                x += speed;
            }

            if (currentStop !== null) {
                speed = 0;
                currentStop.removeWaitingPassenger();
                if (currentStop.nPassengersWaiting() <= 0) {  // we don't have to wait next time
                    departedStop();
                }
            } else {  // between bus stops
                speed = 1;
            }

            if (x >= 1600) {
                x -= 1600;
            }
        };

        var arrivedAtStop = function (stop) {
            stop.setBusCurrentlyStopped(true);
            currentStop = stop;
        };

        var departedStop = function () {
            currentStop.setBusCurrentlyStopped(false);
            currentStop = null;
        };

        var boundingBox = function () {
            var toReturn = {};
            toReturn.xmin = x - 10;
            toReturn.xmax = x + 42;
            toReturn.ymin = y - 10;
            toReturn.ymax = y + 32;
            return toReturn;
        };

        var click = function () {
            stuckAtLights = !stuckAtLights;
            console.log("Bus clicked.  Stuck : " + stuckAtLights);
        };

        var draw = function (ctx) {
            ctx.drawImage(busImage, x - 3.5, y + 3.5);
            if (x > 1500) {
                ctx.drawImage(busImage, x - 3.5 - 1600, y + 3.5);
            }
        };

        return {
            x: function () {
                return x;
            },
            draw: draw,
            click: click,
            tick: tick,
            arrivedAtStop: arrivedAtStop,
            boundingBox: boundingBox
        };
    };

    var Stop = function (x, y) {
        var nPassengersWaiting = 100.0;
        var arrivalRate = 0.2;
        var busCurrentlyStopped = false;

        var tick = function () {
            nPassengersWaiting += arrivalRate;
        };

        var click = function () {
            if (arrivalRate < 0.3) {
                arrivalRate += 0.2;
            } else {
                arrivalRate = 0.2;
            }
        };

        var boundingBox = function () {
            var toReturn = {};
            toReturn.xmin = x - 30;
            toReturn.xmax = x + 62;
            toReturn.ymin = y;
            toReturn.ymax = y + 100;
            return toReturn;
        };

        var draw = function (ctx) {
            var seed = x;
            for (var i = 0; i < nPassengersWaiting; i += 10) {
                var tmp = Math.sin(seed++) * 10000;
                var randomInZeroToOne = tmp - Math.floor(tmp);
                var xOffset = (randomInZeroToOne - 0.5) * 20;
                ctx.drawImage(stopImage, x + xOffset, y + i / 2);
            }
        };

        return {
            x: function () {
                return x;
            },
            isBusCurrentlyStopped: function () {
                return busCurrentlyStopped;
            },
            setBusCurrentlyStopped: function (b) {
                busCurrentlyStopped = b;
            },
            nPassengersWaiting: function () {
                return nPassengersWaiting;
            },
            removeWaitingPassenger: function () {
                nPassengersWaiting -= 1;
            },
            tick: tick,
            click: click,
            boundingBox: boundingBox,
            draw: draw
        }
    };


    var draw = function () {
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
                if (possiblyArrivingBus.x() === stopWithPossibleBus.x() && !stopWithPossibleBus.isBusCurrentlyStopped()) {
                    possiblyArrivingBus.arrivedAtStop(stopWithPossibleBus);
                }
            }
        }

        window.requestAnimationFrame(draw);
    };

    var inside = function (x, y, bbox) {
        if (x > bbox.xmax) return false;
        if (x < bbox.xmin) return false;
        if (y > bbox.ymax) return false;
        //noinspection RedundantIfStatementJS
        if (y < bbox.ymin) return false;
        return true;
    };

    canvas.addEventListener("mousedown", function (event) {
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
    }, false);

    busImage.src = 'smallBus.png';
    stopImage.src = 'person.png';
    for (var busInitIndex = 0; busInitIndex < 1600; busInitIndex += 400) {
        buses.push(Bus(busInitIndex, 150));
    }

    for (var stopsInitIndex = 200; stopsInitIndex < 1600; stopsInitIndex += 400) {
        stops.push(Stop(stopsInitIndex, 200));
    }
    window.requestAnimationFrame(draw);


}(window, document.getElementById('tutorial'));