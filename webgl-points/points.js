var vertexShaderSrc= ""+
    "attribute vec4 aVertexPosition; \n"+
    "void main( void ) { \n"+
    "  gl_PointSize=2.0; \n"+
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
    glObjects.shaderProgram=compileAndLinkShaderProgram( gl, vertexShaderSrc, fragmentShaderSrc );

    dataInit();

    gl.useProgram( glObjects.shaderProgram );
    window.onresize= callbackOnWindowResize;
    html.button1.onclick = callbackOnButton1;
    callbackOnWindowResize(); 
};

var gl; // GL context
var glObjects; // references to various GL objects
var html; // HTML objects
var data; // user data

var dataInit=function() {
    data={};
    data.NUMBER_OF_VERTICES=1000;
    data.background = [ 0.0, 0.0, 0.0, 1.0 ];
    data.vertexPositions= functionPlot();

    glObjects.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glObjects.bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, data.vertexPositions , gl.DYNAMIC_DRAW );   

    glObjects.aVertexPositionLocation = gl.getAttribLocation(glObjects.shaderProgram, "aVertexPosition");
};

var functionPlot= function(){
    var stepX= 2.0/data.NUMBER_OF_VERTICES;
    var x=-1.0;
    var vArray=[];
    var i;
    for(i=0; i<data.NUMBER_OF_VERTICES; i++){
	y=Math.sin(x*Math.PI);
	vArray.push(x);
	vArray.push(y);
	x+= stepX;
    }
    return new Float32Array( vArray );
}

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
    glObjects={}; 
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

    gl.bindBuffer(gl.ARRAY_BUFFER, glObjects.bufferId ); /* refer to the buffer */
    gl.vertexAttribPointer(glObjects.aVertexPositionLocation, 2 /* 2 floats per vertex */, gl.FLOAT, false, 0 /* stride */, 0 /*offset */);
    gl.enableVertexAttribArray(glObjects.aVertexPositionLocation);
    gl.drawArrays(gl.POINTS, 0 /* offset */, data.NUMBER_OF_VERTICES);
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

