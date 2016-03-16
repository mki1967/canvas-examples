var vertexShaderSrc= ""+
    "attribute vec4 aVertexPosition; \n"+
    "void main( void ) { \n"+
    "  gl_PointSize=5.0; \n"+
    "  gl_Position= aVertexPosition; \n"+
    "} \n";

var fragmentShaderSrc= ""+
    "precision mediump float; \n"+
    "void main( void ) { \n"+
    "  gl_FragColor = vec4(1.0,1.0,1.0,1.0); \n"+
    "} \n";



window.onload= function(){
    htmlInit();
    glInit( html.canvas );
    dataInit();
    var shaderProgram=compileAndLinkShaderProgram( gl, vertexShaderSrc, fragmentShaderSrc );
    gl.useProgram(shaderProgram);
    window.onresize= callbackOnWindowResize;
    html.button1.onclick = callbackOnButton1;
    callbackOnWindowResize(); 
};

var gl; // GL context
var html; // HTML objects
var data; // user data

var dataInit=function() {
    data={};
    data.background = [ 0.0, 0.0, 0.0, 1.0 ];
};

var htmlInit= function() {
    html={};
    html.html=document.querySelector('#htmlId');
    html.canvas= document.querySelector('#canvasId');
    html.button1= document.querySelector('#button1');
};


var glInit= function(canvas) {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
};

var compileAndLinkShaderProgram=function ( gl, vertexShaderSource, fragmentShaderSource ){
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
	console.log(gl.getShaderInfoLog(vertexShader));
	console.log(gl);
	return null;
    }

    var fragmentShader =gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
	console.log(gl.getShaderInfoLog(fragmentShader));
	console.log(gl);
	return null;
    }

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	console.log("Could not initialise shaders");
	console.log(gl);
	return null;
    }
    // SUCCESS 
    return shaderProgram;
};

var redraw = function() {
    var bg = data.background;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clearColor(bg[0], bg[1], bg[2], bg[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
};





var callbackOnWindowResize = function () {
    var wth = parseInt(window.innerWidth)-10;
    var hth = parseInt(window.innerHeight)-10;
    var canvas = html.canvas;
    canvas.setAttribute("width", ''+wth);
    canvas.setAttribute("height", ''+hth);
    gl.viewportWidth = wth;
    gl.viewportHeight = hth;
    gl.viewport(0,0,wth,hth);
    redraw();
};

var callbackOnButton1 = function () {
    data.background[0]=Math.random();
    data.background[1]=Math.random();
    data.background[2]=Math.random();
    redraw();
};

