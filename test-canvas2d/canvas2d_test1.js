var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var red= function(x,y) {
    return Math.sin(x)*Math.sin(y);
}


var green= function(x,y) {
    return Math.sin(x)*Math.sin(y);
}

var blue= function(x,y) {
    return -Math.sin(x)*Math.sin(y);
}

var redRange=[-1,1];
var greenRange=[-1,1];
var blueRange=[-1,1];

var x,y, rx, ry, zRed, zGreen, zBlue;
var xRange=[-2*Math.PI,2*Math.PI];
var yRange=[-2*Math.PI,2*Math.PI];
var xStep= (xRange[1]-xRange[0])/ctx.canvas.width;
var yStep= (yRange[1]-yRange[0])/ctx.canvas.height;
for( x=0; x<ctx.canvas.width; x++)
    for( y=0; y<ctx.canvas.height; y++) {
	rx= xRange[0]+x*xStep;
	ry= yRange[0]+y*yStep;
	zRed= Math.floor(255*(red(rx,ry)-redRange[0])/(redRange[1]-redRange[0]));
	zGreen= Math.floor(255*(green(rx,ry)-greenRange[0])/(greenRange[1]-greenRange[0]));
	zBlue= Math.floor(255*(blue(rx,ry)-blueRange[0])/(blueRange[1]-blueRange[0]));
	ctx.fillStyle = "rgb("+zRed+","+zGreen+","+zBlue+")";

	ctx.fillRect(x,y,1,1);
    }
console.log(ctx);
