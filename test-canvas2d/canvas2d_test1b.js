var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var idxX=document.getElementById("idxX");
var idxY=document.getElementById("idxY");

var sin=Math.sin;
var cos=Math.cos;
var log=Math.log;
var Pi=Math.PI;

var funcTab=[
    function(x,y){ return(0);},
    function(x,y){ return(x); },
    function(x,y){ return(y); },
    function(x,y){ return(sin(Pi*x)); },
    function(x,y){ return(cos(Pi*x)); },
    function(x,y){ return(y*sin(Pi*x)); },
    function(x,y){ return(y*cos(Pi*x)); },
    function(x,y){ return(sin(Pi*x)*sin(Pi*y)); },
    function(x,y){ return(cos(Pi*x)*cos(Pi*y)); },
    function(x,y){ return(cos(Pi*x)*sin(Pi*y)); },
    function(x,y){ return(cos(2*Pi*x)*cos(2*Pi*y)*0.5); },
    function(x,y){ return(sin(Pi*x)*y); },
    function(x,y){ return(cos(Pi*(x*x+y*y))); },
    function(x,y){ return(sin(Pi*(x*x+y*y))); }, 
    function(x,y){ return(sin(Pi*(x*x+y*y))); },
];

var fx, fy; // functions: R x R -> R

var setFunctions= function(){
    fx=funcTab[idxX.value];
    fy=funcTab[idxY.value];
};


// screen parameters: screen displays the rectangle [rminx,rmaxx] x [rminy,rmaxy] of R x R
var rminx=-1; 
var rmaxx= 1;
var rminy=-1;
var rmaxy= 1;


// (rx(ctx,x), ry(ctx,y)) is the pixel corresponding to (x,y) on ctx.canvas

var rx= function (ctx, x ){
    return (x-rminx)/(rmaxx-rminx)*(ctx.canvas.width);
}

var ry= function (ctx, y ){
    return ctx.canvas.height-(y-rminy)/(rmaxy-rminy)*(ctx.canvas.height);
}


// draw single pixel as a very little rectangle ;-)

var rputpixel= function(ctx, x,y)
{
    if(rminx<=x && x<rmaxx && rminy<=y && y<rmaxy) ctx.fillRect(rx(ctx,x),ry(ctx,y),1,1);
}

// foreground and background colors

var fgColor="rgb(255,255,255)";
var bgColor="rgb(0,0,0)";


// we are drawing image of a function f: [xmin,xmax] x [ymin,ymax] -> R x R,
// where f(x,y)= ( fx(x,y), fy(x,y) )

var xmin=-1;
var xmax= 1;
var ymin=-1;
var ymax= 1;

// precision of the graph 

var stepX=0.01;
var stepY=0.01;


// drawing

var draw=function(ctx, colorString) { 
    var x,y;
    ctx.fillStyle =colorString;

    for(x=xmin; x<xmax; x+=stepX) {
	for(y=ymin; y<ymax; y+=stepY) {
            rputpixel( ctx, fx(x,y), fy(x,y) );
	}
    }
}

var clearScreen= function(ctx, bgColorString) {
    ctx.globalCompositeOperation="source-over";
    ctx.fillStyle=bgColorString;
    ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height );
}


var redraw= function() {
    clearScreen(ctx, "rgb(0,0,0)");
    draw(ctx, fgColor);
}


var keyDownCallback=function (e){
    e.preventDefault(); // prevents browser from interpreting the keys for other tasks
    var code= e.which || e.keyCode;
    switch(code)
    {
    case 13: // Enter
	setFunctions();
	break;
    };
    redraw();
};


onload= function(){
    idxX.value=6;
    idxX.min=0;
    idxX.max= funcTab.length-1;

    idxY.value=5;
    idxY.min=0;
    idxY.max= funcTab.length-1;

    setFunctions();

    redraw(); // initial redraw
    onkeydown=keyDownCallback; // set initial callback
}
