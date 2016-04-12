/*
  skybox creator by mki1967@gmail.com

  use three selected functions from sbx_fun for RGB components
*/

/* sbx_ - prefix for objects of this library */

/* Table of functions with values in [-1 ... 1]^3 -> [-1 ... 1] */
var sbx_fun= [
    function( x,y,z ) {
	return x;
    },

    function( x,y,z ) {
	return y;
    },

    function( x,y,z ) {
	return z;
    },

    function( x,y,z ) {
	return Math.sin( x * Math.PI * 4 );
    },

    function( x,y,z ) {
	return Math.sin( z * Math.PI * 4 );
    },

    function( x,y,z ) {
	return Math.sin( y * Math.PI * 4 );
    },

    function( x,y,z ) {
	return Math.cos( x * Math.PI * 4 );
    },

    function( x,y,z ) {
	return Math.cos( z * Math.PI * 4 );
    },

    function( x,y,z ) {
	return Math.cos( y * Math.PI * 4 );
    },

    function( x,y,z ) {
	return Math.sin( x * Math.PI * 4 )*Math.cos( y * Math.PI * 4 );
    },

    function( x,y,z ) {
	return Math.sin( x * Math.PI * 4 )*Math.cos( z * Math.PI * 4 );
    }
];

var sbx_shiftAndScale= function( value ){
    /* transform range [-1..1] to [0..255] */
    value+=1;
    value*= 255/2;
    return Math.round(value);
}



var sbx_vectorScale = function(v, sx, sy, sz ) {
    v[0]*= sx;
    v[1]*= sy;
    v[2]*= sz;
};

/* some algebra ... */

var sbx_scalarProduct= function( v, w ) {
    return v[0]*w[0]+v[1]*w[1]+v[2]*w[2];
};

var sbx_vectorLength = function (a) {
    return Math.sqrt(sbx_scalarProduct(a,a));
};

var sbx_vectorNormalized = function (v) {
    var len= sbx_vectorLength(v);
    if(len === 0.0) return [0,0,0]; // normalized zero vector :-(
    var vn= [v[0], v[1], v[2]] ; //  clone of vector v
    var s =1/len;
    sbx_vectorScale(vn,  s,s,s);
    return vn;
};





/* screen operations */
var sbx_putPixel= function(ctx, x,y, rgb){
    ctx.fillStyle = "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
    ctx.fillRect(x,y,1,1);
}


var sbx_createFunctionRGB= function(fR,fG,fB, xyz) {
    /* returns function used in fillCanvas */
    /* xyz is used for selection and inversion of arguments x,y,z from [h, v, depth, -h,-v, -depth] */
    var t=sbx_shiftAndScale;
    return function(h,v,depth){
	var args=[h,v,depth, -h,-v,-depth];
	var vxyz=sbx_vectorNormalized([ args[xyz[0]], args[xyz[1]], args[xyz[2]] ]);
	var x=vxyz[0];
	var y=vxyz[1];
	var z=vxyz[2];

	return [t(fR(x,y,z)), t(fG(x,y,z)), t(fB(x,y,z))];
    }
}

var sbx_xyzZPlus  = [0,1,2];
var sbx_xyzZMinus = [3,1,5];

var sbx_xyzXPlus  = [2,1,3];
var sbx_xyzXMinus = [5,1,0];
/*
  var sbx_xyzYPlus  = [0,2,4];
  var sbx_xyzYMinus = [0,5,1];
*/

var sbx_xyzYMinus  = [0,2,4];
var sbx_xyzYPlus = [0,5,1];

var sbx_fillCanvas= function(canvas, fRGB){
    /* fRGB - function of (h,v,depth) - returns vector [r,g,b] in [0 ... 255]^3 */
    
    var ctx=canvas.getContext("2d");
    var maxHorizontal= canvas.width/2;
    var maxVertical  = canvas.height/2;
    var depth= canvas.width/2;
    var h,v,x,y,z;
    for(h = -maxHorizontal, ph=0; h < maxHorizontal; h++,ph++)
	for(v = -maxVertical,pv= canvas.height; v < maxVertical; v++,pv-- ) {
	    sbx_putPixel(ctx, ph,pv, fRGB(h,v,depth));
	}
}

var sbx_fillCanvasUpsideDown= function(canvas, fRGB){
    /* fRGB - function of (h,v,depth) - returns vector [r,g,b] in [0 ... 255]^3 */
    
    var ctx=canvas.getContext("2d");
    var maxHorizontal= canvas.width/2;
    var maxVertical  = canvas.height/2;
    var depth= canvas.width/2;
    var h,v,x,y,z;
    for(h = -maxHorizontal, ph=0; h < maxHorizontal; h++,ph++)
	for(v = -maxVertical,pv=0; v < maxVertical; v++,pv++ ) {
	    sbx_putPixel(ctx, ph,pv, fRGB(h,v,depth));
	}
}


/* shaders - see: http://learnopengl.com/#!Advanced-OpenGL/Cubemaps */

var sbx_vertexShaderSource=""+
    "attribute vec3 position;\n"+
    "varying vec3 TexCoords;\n"+
    "uniform mat4 projection;\n"+
    "uniform mat4 view;\n"+
    "void main()\n"+
    "{\n"+
    "    vec4 pos = projection * view * vec4(position, 1.0);\n"+
    "    gl_Position = pos.xyww;\n"+
    //    "    gl_Position = vec4(pos.xy, 1.0,1.0);\n"+
    "    TexCoords = position;\n"+
    "}\n";

var sbx_fragmentShaderSource=""+
    "precision mediump float;\n"+
    "varying vec3 TexCoords;\n"+
    "uniform samplerCube skybox;\n"+
    "void main()\n"+
    "{\n"+
    "    gl_FragColor = textureCube(skybox, TexCoords);\n"+
    //    "    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n"+
    "}\n";


/* shaders */
var sbx_vertexShader=null;
var sbx_fragmentShader=null;
/* shader program */
var sbx_shaderProgram=null;

/* vertex attributes locations */
var sbx_position=null;

/* uniform variables locations */
var sbx_projection=null;
var sbx_view=null;
var sbx_skybox=null;



/* input vertices of cube triangles */
var sbx_Float32Array= new Float32Array( [
	-1,  1, -1,
	-1, -1, -1,
	+1, -1, -1,
	+1, -1, -1,
	+1,  1, -1,
        -1,  1, -1,
	-1, -1,  1,
        -1, -1, -1,
        -1,  1, -1,
        -1,  1, -1,
        -1,  1,  1,
        -1, -1,  1,
	+1, -1, -1,
	+1, -1,  1,
	+1,  1,  1,
	+1,  1,  1,
	+1,  1, -1,
	+1, -1, -1,
        -1, -1,  1,
        -1,  1,  1,
	+1,  1,  1,
	+1,  1,  1,
	+1, -1,  1,
        -1, -1,  1,
        -1,  1, -1,
	+1,  1, -1,
	+1,  1,  1,
	+1,  1,  1,
        -1,  1,  1,
        -1,  1, -1,
        -1, -1, -1,
        -1, -1,  1,
	+1, -1, -1,
	+1, -1, -1,
        -1, -1,  1,
	+1, -1,  1
]);

var sbx_arrayBuffer=null;

/* texture parameters */
var sbx_textureId=null;
var sbx_textureUnit=0; // default

var sbx_makeShaderProgram= function(gl){
    /* Parameters:
       gl - WebGL context
    */

    sbx_vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(sbx_vertexShader, sbx_vertexShaderSource);
    gl.compileShader(sbx_vertexShader);
    if (!gl.getShaderParameter(sbx_vertexShader, gl.COMPILE_STATUS)) {
	console.log(gl.getShaderInfoLog(sbx_vertexShader));
	return null;
    }

    sbx_fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(sbx_fragmentShader, sbx_fragmentShaderSource);
    gl.compileShader(sbx_fragmentShader);
    if (!gl.getShaderParameter(sbx_fragmentShader, gl.COMPILE_STATUS)) {
	console.log(gl.getShaderInfoLog(sbx_fragmentShader));
	return null;
    }

    sbx_shaderProgram = gl.createProgram();
    gl.attachShader(sbx_shaderProgram, sbx_vertexShader);
    gl.attachShader(sbx_shaderProgram, sbx_fragmentShader);
    gl.linkProgram(sbx_shaderProgram);
    if (!gl.getProgramParameter(sbx_shaderProgram, gl.LINK_STATUS)) {
	console.log("Could not initialise shaders");
	return null;
    }
    
    gl.useProgram(sbx_shaderProgram);

    /* set vertex attributes locations */
    sbx_position=gl.getAttribLocation(sbx_shaderProgram, "position");

    /* set uniform variables locations */
    sbx_projection=gl.getUniformLocation(sbx_shaderProgram, "projection");
    sbx_view=gl.getUniformLocation(sbx_shaderProgram, "view");
    sbx_skybox=gl.getUniformLocation(sbx_shaderProgram, "skybox");

    /* load buffer data */
    sbx_arrayBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sbx_arrayBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, sbx_Float32Array , gl.STATIC_DRAW );

    /* create texture ID and set texture parameters */
    sbx_textureId=gl.createTexture();
    gl.activeTexture(gl.TEXTURE0+sbx_textureUnit);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, sbx_textureId);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

    // SUCCESS
    return sbx_shaderProgram;
};

var sbx_loadCubeFaceFromCanvas= function(gl, canvas, cubeFace){
    /* use after  sbx_makeShaderProgram(gl) */
    /* Parameters:
       gl - WebGL context
       canvas - container of the image
       cubeFace - one of: gl.TEXTURE_CUBE_MAP_POSITIVE_X, ...
    */
    gl.activeTexture(gl.TEXTURE0+sbx_textureUnit);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, sbx_textureId);
    gl.texImage2D( cubeFace, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
};


var sbx_drawSkybox= function ( gl, view, projection ) {
    /* use after drawing the scene */
    /* Parameters:
       gl - WebGL context
       view, projection - gl matrices 4x4 (column major)
       textureUnit - integer from [0 ... gl.MAX_TEXTURE_IMAGE_UNITS]
    */
    gl.depthFunc(gl.LEQUAL);

    gl.useProgram(sbx_shaderProgram);

    gl.uniformMatrix4fv(sbx_view, false, view);
    gl.uniformMatrix4fv(sbx_projection, false, projection);
    
    gl.enableVertexAttribArray(sbx_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, sbx_arrayBuffer);
    gl.vertexAttribPointer(sbx_position, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0+sbx_textureUnit );
    gl.uniform1i(sbx_skybox, sbx_textureUnit );
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, sbx_textureId);

    //  gl.drawArrays(gl.TRIANGLES, 0, sbx_Float32Array.length/3 );
    gl.drawArrays(gl.TRIANGLES, 0, 36);
    gl.depthFunc(gl.LESS);
}
