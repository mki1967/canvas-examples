
var html=null;
var gl=null;



/* shaders */
var vertexShader=null;
var fragmentShader=null;
/* shader program */
var shaderProgram=null;

/* vertex attributes locations */
var position=null;

/* uniform variables locations */
var projection=null;
var view=null;
var skybox=null;



/* input vertices of cube triangles */
var xPlusFloat32Array= new Float32Array( [
	+1, +1, +1,
	+1, -1, +1,
	+1, -1, -1,
	+1, +1, -1,
]);
var xMinusFloat32Array= new Float32Array( [
	-1, +1, -1,
        -1, -1, -1,
        -1, -1, +1,
        -1, +1, +1,
]);

var yPlusFloat32Array= new Float32Array( [
        -1,  1, -1,
	-1,  1, +1,
	+1,  1, +1,
        +1,  1, -1,
]);
var yMinusFloat32Array= new Float32Array( [
        -1, -1, +1,
        -1, -1, -1,
	+1, -1, -1,
        +1, -1, +1,
]);

var zPlusFloat32Array= new Float32Array( [
        -1, +1,  1,
        -1, -1,  1,
	+1, -1,  1,
	+1, +1,  1,
]);
var zMinusFloat32Array= new Float32Array( [
	+1, +1, -1,
	+1, -1, -1,
	-1, -1, -1,
	-1, +1, -1,
]);


var arrayBuffer=null;

/* texture parameters */
// var textureId=null;
// var textureUnit=0; // default

var vertexShaderSource=""+
    "attribute vec3 aPosition;\n"+
    "varying vec3 TexCoords;\n"+
    "uniform mat4 projection;\n"+
    "uniform mat4 rotation;\n"+
    "uniform vec3 move;\n"+
    "void main()\n"+
    "{\n"+
    "    vec4 pos = rotation * vec4(aPosition, 1.0) + vec4(move, 0.0);\n"+
    "    gl_Position =  projection * pos;\n"+
    "    TexCoords = aPosition ;\n"+
    "}\n";

var fragmentShaderSource=""+
    "precision mediump float;\n"+
    "varying vec3 TexCoords;\n"+
    "uniform samplerCube skybox;\n"+
    "void main()\n"+
    "{\n"+
    "    gl_FragColor = textureCube(skybox, TexCoords);\n"+
    "}\n";

var makeShaderProgram= function(gl){
    /* Parameters:
       gl - WebGL context
    */

    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
	console.log(gl.getShaderInfoLog(vertexShader));
	return null;
    }

    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
	console.log(gl.getShaderInfoLog(fragmentShader));
	return null;
    }

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	console.log("Could not initialise shaders");
	return null;
    }
    
    gl.useProgram(shaderProgram);

    /* set vertex attributes locations */
    aPositionLocation=gl.getAttribLocation(shaderProgram, "aPosition");
   // aTexCoordsLocation=gl.getAttribLocation(shaderProgram, "aTexCoords");

    /* set uniform variables locations */
    projectionLocation=gl.getUniformLocation(shaderProgram, "projection");
    rotationLocation=gl.getUniformLocation(shaderProgram, "rotation");
    moveLocation=gl.getUniformLocation(shaderProgram, "move");
    // tex2DLocation=gl.getUniformLocation(shaderProgram, "tex2D");
    skyboxLocation=gl.getUniformLocation(shaderProgram, "skybox");

    /* load  data buffers */
    zMinusArrayBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, zMinusArrayBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, zMinusFloat32Array , gl.STATIC_DRAW );

    zPlusArrayBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, zPlusArrayBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, zPlusFloat32Array , gl.STATIC_DRAW );

    xMinusArrayBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, xMinusArrayBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, xMinusFloat32Array , gl.STATIC_DRAW );

    xPlusArrayBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, xPlusArrayBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, xPlusFloat32Array , gl.STATIC_DRAW );

    yMinusArrayBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, yMinusArrayBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, yMinusFloat32Array , gl.STATIC_DRAW );

    yPlusArrayBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, yPlusArrayBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, yPlusFloat32Array , gl.STATIC_DRAW );


    // SUCCESS
    return shaderProgram;
};

var drawBufferFace= function ( gl, rotation, move, projection, buffer) {
    /* Parameters:
       gl - WebGL context
       view, projection - gl matrices 4x4 (column major)
       textureUnit - integer from [0 ... gl.MAX_TEXTURE_IMAGE_UNITS]
    */
    gl.depthFunc(gl.LESS);

    gl.useProgram(shaderProgram);

    gl.uniformMatrix4fv(rotationLocation, false, rotation);
    gl.uniform3fv(moveLocation,  move  );
    gl.uniformMatrix4fv(projectionLocation, false, projection);
    
    gl.enableVertexAttribArray(aPositionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(aPositionLocation, 3, gl.FLOAT, false, 0, 0);


    gl.activeTexture(gl.TEXTURE0+sbx_textureUnit );
    gl.uniform1i(skyboxLocation, sbx_textureUnit );
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, sbx_textureId);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

var createTexture2D= function(gl){
    /* parameters:
       gl -  WebGL contex
       textureUnit - texture unit to which the texture should be bound
    */
    var textureId=gl.createTexture();
    // gl.activeTexture(gl.TEXTURE0+textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, textureId);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return textureId;
}

var loadTexture2DFromCanvas= function(gl, canvas, textureId){
    /* use after  makeShaderProgram(gl) */
    /* Parameters:
       gl - WebGL context
       canvas - container of the image
       textureId - ID returned by  createMyTexture2D
       textureUnit - texture unit to which the texture should be bound
    */
    // gl.activeTexture(gl.TEXTURE0+textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, textureId);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
};


var cubeFace; // array of cube face direction constants
var skyboxXYZ; // array of argument mappings for skybox functions



/**  Model-view and projection  matrices **/

const PROJECTION_Z_NEAR = 0.25;
const PROJECTION_Z_FAR = 300;
const PROJECTION_ZOOM_Y = 4.0;


const identityMatrix4= [
    [ 1,0,0,0 ],
    [ 0,1,0,0 ],
    [ 0,0,1,0 ],
    [ 0,0,0,1 ],
];


var rotationMatrix4= identityMatrix4;

var moveVector=[0,0,10];



var createProjectionMatrix4= function (gl, zNear, zFar, zoomY ) {
    /* arguments:
       gl - GL context
       zNear, zFar, zoomY - Y-frustum parameters 

       returns: 4x4 row-major order perspective matrix
    */
    var xx=  zoomY*gl.viewportHeight/gl.viewportWidth;
    var yy=  zoomY;
    var zz=  (zFar+zNear)/(zFar-zNear);
    var zw= 1;
    var wz= -2*zFar*zNear/(zFar-zNear);
    return [
	[ xx,  0,  0,  0],
	[  0, yy,  0,  0],
	[  0,  0, zz, wz],
	[  0,  0, zw,  0]
    ];
}




var glVector3 = function ( x,y,z ){
    return new Float32Array(x,y,z);
};


var glMatrix4 = function (  xx, yx, zx, wx,
			    xy, yy, zy, wy,
			    xz, yz, zz, wz,
			    xw, yw, zw, ww )
{
    // sequence of concatenated columns
    return new Float32Array( [ xx, xy, xz, xw,
                               yx, yy, yz, yw,
                               zx, zy, zz, zw,
                               wx, wy, wz, ww ] );
};

var glMatrix4FromMatrix= function( m ) {
    /* arguments:
       m - the 4x4 array with the matrix in row-major order 

       returns: sequence of elements in column-major order in Float32Array for GL
    */
    return glMatrix4( 
	m[0][0], m[0][1], m[0][2], m[0][3],
	m[1][0], m[1][1], m[1][2], m[1][3],
	m[2][0], m[2][1], m[2][2], m[2][3],
	m[3][0], m[3][1], m[3][2], m[3][3]
    );
};


var scalarProduct4 = function( v,w ) {
    return v[0]*w[0]+v[1]*w[1]+v[2]*w[2]+v[3]*w[3];
};

var matrix4Column = function( m, c ) {
    return [ m[0][c], m[1][c], m[2][c], m[3][c] ]; 
};

var matrix4Product = function( m1, m2){ 
    var sp = scalarProduct4;
    var col = matrix4Column;
    return [ 
	[ sp(m1[0], col(m2, 0)) , sp(m1[0], col(m2, 1)),  sp(m1[0], col(m2, 2)),  sp(m1[0], col(m2, 3)) ], 
	[ sp(m1[1], col(m2, 0)) , sp(m1[1], col(m2, 1)),  sp(m1[1], col(m2, 2)),  sp(m1[1], col(m2, 3)) ], 
	[ sp(m1[2], col(m2, 0)) , sp(m1[2], col(m2, 1)),  sp(m1[2], col(m2, 2)),  sp(m1[1], col(m2, 3)) ], 
	[ sp(m1[3], col(m2, 0)) , sp(m1[3], col(m2, 1)),  sp(m1[3], col(m2, 2)),  sp(m1[3], col(m2, 3)) ] 
    ];
};

var matrix4RotatedXZ= function(matrix, alpha ){
    var c = Math.cos( alpha );
    var s = Math.sin( alpha ); 
    var rot = [ [ c,  0, -s, 0 ],
		[ 0,  1,  0, 0 ],
		[ s,  0,  c, 0 ],
		[ 0,  0,  0, 1 ]
	      ];

    return matrix4Product( rot, matrix );
};

var matrix4RotatedYZ= function(matrix, alpha ){
    var c = Math.cos( alpha );
    var s = Math.sin( alpha ); 
    var rot = [ [ 1,  0,  0, 0 ],
		[ 0,  c, -s, 0 ],
		[ 0,  s,  c, 0 ], 
		[ 0,  0,  0, 1 ]
	      ];

    return matrix4Product( rot, matrix );
};



/* redraw variables */

var boxFaceTextures=[];

var redraw=function(){
    var projectionMatrix=glMatrix4FromMatrix( createProjectionMatrix4(gl,
								      PROJECTION_Z_NEAR, 
								      PROJECTION_Z_FAR,
								      PROJECTION_ZOOM_Y )
					    );
    var rotationMatrix=glMatrix4FromMatrix( rotationMatrix4 ); //tmp

    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawBufferFace( gl, rotationMatrix, moveVector, projectionMatrix, xPlusArrayBuffer );
    drawBufferFace( gl, rotationMatrix, moveVector, projectionMatrix, xMinusArrayBuffer );

    drawBufferFace( gl, rotationMatrix, moveVector, projectionMatrix, yPlusArrayBuffer );
    drawBufferFace( gl, rotationMatrix, moveVector, projectionMatrix, yMinusArrayBuffer );

    drawBufferFace( gl, rotationMatrix, moveVector, projectionMatrix, zPlusArrayBuffer );
    drawBufferFace( gl, rotationMatrix, moveVector, projectionMatrix, zMinusArrayBuffer );

    sbx_drawSkybox ( gl, 
		     rotationMatrix,
		     projectionMatrix
		   );
}

onWindowResize = function () {
    var wth = parseInt(window.innerWidth)-10;
    var hth = parseInt(window.innerHeight)-10;
    canvasGL.setAttribute("width", ''+wth);
    canvasGL.setAttribute("height", ''+hth);
    gl.viewportWidth = wth;
    gl.viewportHeight = hth;
    gl.viewport(0,0,wth,hth);
    redraw();
};




function onKeyDown(e){
    // var code=e.keyCode? e.keyCode : e.charCode;
    var code= e.which || e.keyCode;
    var alpha= Math.PI/32;
    switch(code)
    {
    case 38: // up
    case 73: // I
	rotationMatrix4=matrix4RotatedYZ(rotationMatrix4, alpha );
	break;
    case 40: // down
    case 75: // K
	rotationMatrix4=matrix4RotatedYZ(rotationMatrix4, -alpha );
	break;
    case 37: // left
    case 74:// J
	rotationMatrix4=matrix4RotatedXZ(rotationMatrix4, -alpha );
	break;
    case 39:// right
    case 76: // L
	rotationMatrix4=matrix4RotatedXZ(rotationMatrix4, alpha );
	break;
    case 70: // F
	moveVector[2]++;
	break;
    case 66: // B
    case 86: // V
	moveVector[2]--;
	break;
    case 78: // N
	sbx_renderRandomCube(gl);
	// onWindowResize();
	break;
    case 32: // space
	rotationMatrix4= identityMatrix4;
	break;
	/*
	  case 82: // R
	  case 81: // Q
	  case 69: // E
	  case 191: // ?
	  case 68: // D
	  case 13: // enter
	  case 187: // +
	  case 27: // escape
	  case 189: // -
	  case 86: // V
	  case 46: // Delete
	  case 51: // #
	  case 83: // S
	  case 65: // A
	  case 56: // *
	  case 88: // X
	  case 74: // J
	  break;
	*/
    }
    redraw();
}



window.onload= function(){
    html={};
    html.canvasGL=document.querySelector('#canvasGL');
    gl = canvasGL.getContext("webgl");



    cubeFace=[ 
	gl.TEXTURE_CUBE_MAP_POSITIVE_X,
	gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
	gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
	gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
	gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
	gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    ];
    
    skyboxXYZ= [ 
	sbx_xyzXPlus , sbx_xyzXMinus,
	sbx_xyzYPlus , sbx_xyzYMinus,
	sbx_xyzZPlus , sbx_xyzZMinus
    ];


    boxFaceTextures=[];

    makeShaderProgram(gl);
    sbx_makeShaderProgram(gl);
    // sbx_makeRenderTextureShaderProgram(gl);
    sbx_renderRandomCube(gl);
    onWindowResize();
    window.onresize= onWindowResize;
    window.onkeydown= onKeyDown;
}

