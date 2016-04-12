var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var canvas2 = document.getElementById("myCanvas2");
var ctx2 = canvas2.getContext("2d");

var idxX=document.getElementById("idxX");
var idxY=document.getElementById("idxY");
var idxZ=document.getElementById("idxZ");

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
    function(x,y){ return(sin(Pi*x)*sin(Pi*y)); },
    function(x,y){ return(cos(Pi*x)*cos(Pi*y)); },
    function(x,y){ return(cos(Pi*x)*sin(Pi*y)); },
    function(x,y){ return(cos(2*Pi*x)*cos(2*Pi*y)*0.5); },
    function(x,y){ return(sin(Pi*x)*y); },
    function(x,y){ return(cos(Pi*(x*x+y*y))); },
    function(x,y){ return(sin(Pi*(x*x+y*y))); }, 
    function(x,y){ return(sin(Pi*(x*x+y*y))); },
];

var fx, fy, fz; // functions: R x R -> R

var setFunctions= function(){
    fx=funcTab[idxX.value];
    fy=funcTab[idxY.value];
    fz=funcTab[idxZ.value];
};




// perspective with eyex shift for stereoscopy 

var perspective= function(eyex, eyez, screen_z, x,z)
{
    return( eyex+(screen_z-eyez)*(x-eyex)/(z-eyez) );
}


// (x,y) rotated by angle is ( xrotate(x,y, angle), yrotate(x,y, angle) )

var xrotate= function (x,y, angle)
{
    return(x*cos(angle)-y*sin(angle));
}

var yrotate= function (x,y, angle)
{
    return(y*cos(angle)+x*sin(angle));
}

// screen parameters: screen displays the rectangle [rminx,rmaxx] x [rminy,rmaxy] of R x R
var rpixel=0.005; // size of pixel
var rminx=-rpixel*ctx.canvas.width/2; 
var rmaxx= rpixel*ctx.canvas.width/2;
var rminy=-rpixel*ctx.canvas.height/2;
var rmaxy= rpixel*ctx.canvas.height/2;


// (rx(ctx,x), ry(ctx,y)) is the pixel corresponding to (x,y) on ctx.canvas
 
var rx= function (ctx, x )
{
    return (x-rminx)/(rmaxx-rminx)*(ctx.canvas.width);
}

var ry= function (ctx, y )
{
    return ctx.canvas.height-(y-rminy)/(rmaxy-rminy)*(ctx.canvas.height);
}


// draw single pixel as a very little rectangle ;-)

var rputpixel= function(ctx, x,y)
{
    if(rminx<=x && x<rmaxx && rminy<=y && y<rmaxy) ctx.fillRect(rx(ctx,x),ry(ctx,y),1,1);
}



var Xd= 0, Yd= 1, Zd= 2; // dimmensions

// parameters for stereoscopy
var eyeDistance=7;
var leftEye=[-eyeDistance/2, 0, 40];
var rightEye=[eyeDistance/2, 0, 40];

var screen_z= 0.0;

var rightColor="rgb(0,0,255)";
var leftColor ="rgb(127,0,0)";


// we are drawing image of a function f: [xmin,xmax] x [ymin,ymax] -> R x R x R,
// where f(x,y)= ( fx(x,y), fy(x,y), fz(x,y) )

var xmin=-1;
var xmax= 1;
var ymin=-1;
var ymax= 1;


// the image of the function is rotated horizontaly by ALPHA and verticaly by BETA  

var ALPHA =(Pi/6);
var BETA = -(Pi/6);


// precision of the graph 

var stepX=0.04;
var stepY=0.04;


// drawing perspective for one eye

var draw=function(ctx, colorString, eye)
{ 
    var x,y;
    var ffx, ffy, ffz, fffx, fffy, fffz;
    ctx.fillStyle =colorString;

    for(x=xmin; x<xmax; x+=stepX)
    {
	for(y=ymin; y<ymax; y+=stepY)
	{
            fffx=fx(x,y); fffy=fy(x,y); ffz= fz(x,y);
	    
	    /* horizontal rotation by ALPHA */
            ffx= xrotate(fffx, ffz, ALPHA);
            fffz= yrotate(fffx, ffz, ALPHA);

	    /* vertical  rotation by BETA */
            ffz=  xrotate(fffz, fffy, BETA);
            ffy=  yrotate(fffz, fffy, BETA);
	    
            rputpixel( ctx,
		       perspective( eye[Xd],eye[Zd], screen_z, ffx, ffz),
                       perspective( eye[Yd],eye[Zd], screen_z, ffy, ffz)
                     );
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
    draw(ctx, leftColor, leftEye );
    clearScreen(ctx2, "rgb(0,0,0)");
    draw(ctx2, rightColor, rightEye );
    ctx.globalCompositeOperation="lighter";
    ctx.drawImage(ctx2.canvas, 0,0);
}


var keyDownCallback=function (e){
    e.preventDefault(); // prevents browser from interpreting the keys for other tasks
    const rotStep = Math.PI / 36; // 5 degrees 
    var code= e.which || e.keyCode;
    switch(code)
    {
    case 38: // up
    case 73: // I
        BETA+=rotStep;
	break;
    case 40: // down
    case 75: // K
        BETA-=rotStep;
	break;
    case 37: // left
    case 74:// J
	ALPHA+=rotStep;
	break;
    case 39:// right
    case 76: // L
	ALPHA-=rotStep;
	break;
    case 86: // V
	if( stepX >= 0.04 ) {
	    stepX=stepY=0.02
	} else {
	    stepX=stepY=0.04
	}
	break;

    case 77: // M
	if( leftEye[0] == 0) {
	    leftEye[0] = -eyeDistance/2;
	    rightEye[0] = eyeDistance/2;
	} else {
	    leftEye[0] = rightEye[0] = 0;
	}
	break;

    case 13: // Enter
	setFunctions();
	break;
    case 32: // Space
	ALPHA=0;
	BETA=0;
	break;
    case 9: // Tab
    case 69: // E
	var tmp=  rightColor;
	rightColor=leftColor;
        leftColor=tmp;
	break;

    };
    redraw();
};


onload= function(){
    idxX.value=1;
    idxX.min=0;
    idxX.max= funcTab.length-1;

    idxY.value=5;
    idxY.min=0;
    idxY.max= funcTab.length-1;

    idxZ.value=2;
    idxZ.min=0;
    idxZ.max= funcTab.length-1;

    setFunctions();

    redraw(); // initial redraw
    onkeydown=keyDownCallback; // set initial callback
}
