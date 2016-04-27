var bgColor=[ 0.0, 0.0, 1.0, 1.0 ];

var gridLines=[];
var gridLinesColor=[0.5, 0.5, 0.5, 1.0];
var gridDepth=0.5;

var points=[];
var pointColor= [0.0, 0.0, 0.0, 1.0];
var pointDepth=0.5; 

var edgeLines=[];
var edgeColor= [0.0, 0.0, 0.0, 1.0];
var edgeDepth= 0.0;



var pushLine= function( x1, y1, x2, y2, lines) {
    lines.push(x1);
    lines.push(y1);
    lines.push(x2);
    lines.push(y2);
};


var pushPixel= function( x, y, pixels){
    pixels.push(x);
    pixels.push(y);
};


/* push  line segments of the m x n grid to lines */
var pushGrid= function( m, n, lines ){
    for(var x=0; x<m; x++)
	pushLine( x,0, x,n, lines);
    for(var y=0; y<n; y++)
	pushLine( 0,y, m,y, lines);
};

/* push graph of the function fun: {a, ..., b-1} -> R */
var pushGraph= function(fun, a,b, pixels){
    for(var x=a; x<b; x++)
	pushPixel( x,fun(x), pixels);
};


var vShaderSrc=""+
    "attribute vec2 aPosition;\n"+
    "uniform float depth;\n"+
    "void main()\n"+
    "{\n"+
    "    gl_Position = vec4(aPosition,depth, 1.0);\n"+
    "}\n";



var fShaderSrc=""+
    "precision mediump float;\n"+
    "uniform vec4 color;\n"+
    "void main()\n"+
    "{\n"+
    "    gl_FragColor = color;\n"+
    "}\n";





var makeShaderProgram= function(gl, vertexShaderSource, fragmentShaderSource){
    /* Parameters:
       gl - WebGL context
       vertexShaderSource, fragmentShaderSource - strings with source codes of the shaders
    */

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(vertexShader));
        return null;
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(fragmentShader));
        return null;
    }

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("Could not initialise shaders");
        return null;
    }
    
    // SUCCESS
    return shaderProgram;
};


/* Float32Arrays */
var gridFloat32Array;
var pointsFloat32Array;

var prepareFloat32Arrays=function(k){
    n= 1<<k;
    revBitsGraph(k);// computes gridLines and pixels
    gridFloat32Array=new Float32array(gridLines);
    pixelsFloat32Array=new Float32array(pixels);
}




/* reverse of k lowest bits */
var  revBits=function(k, x) {
    var y= (x&1);
    for(var i=1; i<k; i++){
	y= y<<1;
	x= x>>1;
	y= (y | (x&1));
    }
    return y;
}


/* prepare graph of revBits(k,x) */
var revBitsGraph= function(k)
{
    var fun= function(x) {return revBits(k,x) };
    var n=(1<<k);
    pushGrid(n,n, gridLines);
    pushGraph(fun, 0,n, pixels);
}



var redraw=function(){
    gl.clearColor( bgColor[0],  bgColor[1], bgColor[2], bgColor[3]);
    gl.enable(gl.DEPTH_TEST);
    // gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.finish();
}

onWindowResize = function () {
    var wth = parseInt(window.innerWidth)-10;
    var hth = parseInt(window.innerHeight)-10;
    // html.canvasGL.setAttribute("width", ''+wth);
    // html.canvasGL.setAttribute("height", ''+hth);
    gl.canvas.setAttribute("width", ''+wth);
    gl.canvas.setAttribute("height", ''+hth);
    gl.viewportWidth = wth;
    gl.viewportHeight = hth;
    gl.viewport(0,0,wth,hth);
    redraw();
};




window.onload= function(){
    var canvasGL=document.querySelector('#canvasGL');
    gl = canvasGL.getContext("webgl");
    shaderProgram=makeShaderProgram(gl, vShaderSrc, fShaderSrc);
    onWindowResize();
    window.onresize=onWindowResize;
}

