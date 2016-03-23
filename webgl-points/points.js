
/* SHADER PROGRAM */
/* vertex shader source code */
var vertexShaderSrc= ""+
    "attribute vec4 aVertexPosition; \n"+
    "uniform vec3 uMove; \n"+
    "void main( void ) { \n"+
    "  gl_PointSize=4.0; \n"+
    "  gl_Position= aVertexPosition+ vec4( uMove, 0); \n"+
    "} \n";

/* fragment shader source code */
var fragmentShaderSrc= ""+
    "precision mediump float; \n"+ 
    "uniform vec3 uColorRGB; \n"+ 
    "void main( void ) { \n"+
    "  gl_FragColor = vec4( uColorRGB, 1.0 ); \n"+
    "} \n";


/* SHADER PROGRAM 2 */
/* vertex shader source code */
var vertexShaderSrc2= ""+
    "attribute vec4 aVertexPosition; \n"+
    "uniform vec3 uMove; \n"+
    "varying vec3 vColorRGB; \n"+
    "void main( void ) { \n"+
    "  gl_PointSize=6.0; \n"+
    "  gl_Position= aVertexPosition+ vec4( uMove, 0); \n"+
    "  vColorRGB=  (vec3(1.0,1.0,1.0) + gl_Position.rgb)*0.5; \n"+
    "} \n";

/* fragment shader source code */
var fragmentShaderSrc2= ""+
    "precision mediump float; \n"+ 
    "varying vec3 vColorRGB; \n"+ 
    "void main( void ) { \n"+
    "  gl_FragColor = vec4(vColorRGB, 1.0); \n"+
    "} \n";




var gl; // GL context
var glObjects; // references to various GL objects
var html; // HTML objects
var data; // user data

var glInit= function(canvas) {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    glObjects={}; 

    /* create executable shader program */
    glObjects.shaderProgram=compileAndLinkShaderProgram( gl, vertexShaderSrc, fragmentShaderSrc );
    /* attributes */
    glObjects.aVertexPositionLocation = gl.getAttribLocation(glObjects.shaderProgram, "aVertexPosition");
    /* uniform variables */
    glObjects.uMoveLocation = gl.getUniformLocation(glObjects.shaderProgram, "uMove");
    glObjects.uColorRGBLocation = gl.getUniformLocation(glObjects.shaderProgram, "uColorRGB");

    /* create executable shader program 2 */
    glObjects.shaderProgram2=compileAndLinkShaderProgram( gl, vertexShaderSrc2, fragmentShaderSrc2 );
    /* attributes */
    glObjects.aVertexPositionLocation2 = gl.getAttribLocation(glObjects.shaderProgram2, "aVertexPosition");
    gl.enableVertexAttribArray(glObjects.aVertexPositionLocation2);
    /* uniform variables */
    glObjects.uMoveLocation2 = gl.getUniformLocation(glObjects.shaderProgram2, "uMove");

};

var dataInit=function() {
    data={};
    data.NUMBER_OF_VERTICES=1000;
    data.background = [ 0.0, 0.0, 0.0, 1.0 ];

    data.vertexPositions1= functionPlot(f1);
    glObjects.bufferId1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glObjects.bufferId1 );
    gl.bufferData(gl.ARRAY_BUFFER, data.vertexPositions1 , gl.STATIC_DRAW );
    data.move1=[0, 0.0, 0.0];   
    data.colorRGB1=[0.0, 1.0, 0.0]; 
    
    data.vertexPositions2= functionPlot(f2);
    glObjects.bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glObjects.bufferId2 );
    gl.bufferData(gl.ARRAY_BUFFER, data.vertexPositions2 , gl.STATIC_DRAW );
    data.move2=[0, -0.1, -0.1];   
    data.colorRGB2=[0.0, 1.0, 1.0];   

    data.vertexPositions3= new Float32Array( [ -0.5, 0.0, 
					       0.0, 0.5, 
					       0.5, 0.0, 
					       0.0, -0.5
					     ] );
    glObjects.bufferId3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glObjects.bufferId3 );
    gl.bufferData(gl.ARRAY_BUFFER, data.vertexPositions3 , gl.STATIC_DRAW );

}; 

var redraw = function() {
    var bg = data.background;

    /* prepare clean screen */
    gl.clearColor(bg[0], bg[1], bg[2], bg[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    /* draw object 1 */
    gl.useProgram( glObjects.shaderProgram );
    gl.enableVertexAttribArray(glObjects.aVertexPositionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, glObjects.bufferId1 ); /* refer to the buffer */
    gl.vertexAttribPointer(glObjects.aVertexPositionLocation, 2 /* 2 floats per vertex */, gl.FLOAT, false, 0 /* stride */, 0 /*offset */);
    gl.uniform3fv( glObjects.uMoveLocation, data.move1 );
    gl.uniform3fv( glObjects.uColorRGBLocation, data.colorRGB1 );
    gl.drawArrays(gl.POINTS, 0 /* offset */, data.NUMBER_OF_VERTICES);

    /* draw object 2 */
    gl.useProgram( glObjects.shaderProgram2 );
    gl.uniform3fv( glObjects.uMoveLocation2, data.move2 );
    // gl.uniform3fv( glObjects.uColorRGBLocation, data.colorRGB2 );
    gl.bindBuffer(gl.ARRAY_BUFFER, glObjects.bufferId2 ); /* refer to the buffer */
    gl.enableVertexAttribArray(glObjects.aVertexPositionLocation);
    gl.vertexAttribPointer(glObjects.aVertexPositionLocation, 2 /* 2 floats per vertex */, gl.FLOAT, false, 0 /* stride */, 0 /*offset */);
    gl.drawArrays(gl.POINTS, 0 /* offset */, data.NUMBER_OF_VERTICES);

    /* draw object 3 */
    gl.bindBuffer(gl.ARRAY_BUFFER, glObjects.bufferId3 ); /* refer to the buffer */
    gl.enableVertexAttribArray(glObjects.aVertexPositionLocation);
    gl.vertexAttribPointer(glObjects.aVertexPositionLocation, 2 /* 2 floats per vertex */, gl.FLOAT, false, 0 /* stride */, 0 /*offset */);
    gl.drawArrays(gl.TRIANGLE_FAN, 0 /* offset */, 4);

};



/* some functions: [-1,1] -> R */
var f1= function( x ) {
    return Math.sin(x*Math.PI);
};

var f2= function( x ) {
    return Math.cos(x*Math.PI);
};

/* create Float32Array with vertex (x,y) coordinates */
var functionPlot= function( f ){
    var stepX= 2.0/data.NUMBER_OF_VERTICES;
    var x=-1.0;
    var vArray=[];
    var i;
    for(i=0; i<data.NUMBER_OF_VERTICES; i++){
	y=f(x);
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
    html.span1= document.querySelector('#span1');
};



/* create executable shader program */
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

var callbackOnKeyDown =function (e){
    const step = 0.02;
    var code= e.which || e.keyCode;
    switch(code)
    {
    case 38: // up
    case 73: // I
        data.move2[1]+=step;
	break;
    case 40: // down
    case 75: // K
        data.move2[1]-=step;
	break;
    case 37: // left
    case 74:// J
        data.move2[0]-=step;
	break;
    case 39:// right
    case 76: // L
        data.move2[0]+=step;
	break;
    case 70: // F
        data.move2[2]+=step;
	break;
    case 66: // B
        data.move2[2]-=step;
	break;
    }
    html.span1.innerHTML=" move2 = "+ JSON.stringify(data.move2);
    redraw();
}

window.onload= function(){
    htmlInit();
    glInit( html.canvas );
    dataInit();

    window.onresize= callbackOnWindowResize;
    html.button1.onclick = callbackOnButton1;
    callbackOnWindowResize(); 
    window.onkeydown=callbackOnKeyDown;
};
