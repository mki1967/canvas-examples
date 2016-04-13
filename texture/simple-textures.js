var html=null;
var gl=null;

/* shaders */
var vertexShader=null;
var fragmentShader=null;
/* shader program */
var shaderProgram=null;

/* vertex attributes locations */
var aPositionLocation=null;
var aTexCoordsLocation=null;

/* uniforms locations */
var moveLocation=null;
var scaleLocation=null;
var scaleTexLocation=null;
var tex1Location=null; 
var tex2Location=null;

/* buffers */
var squareArrayBuffer=null; 
var texCoordsBuffer=null; 

/* textures */
var textureId1=null;
var textureId2=null;

var vertexShaderSource=""+
    "attribute vec3 aPosition;\n"+
    "attribute vec2 aTexCoords;\n"+
    "uniform vec3 move;\n"+
    "uniform vec3 scale;\n"+
    "uniform vec2 scaleTex;\n"+
    "varying vec2 TexCoords;\n"+
    "void main()\n"+
    "{\n"+
    "    gl_Position =  vec4(scale*aPosition+move, 1);\n"+
    "    TexCoords = scaleTex*aTexCoords;\n"+
    "}\n";

var fragmentShaderSource=""+
    "precision mediump float;\n"+
    "varying vec2 TexCoords;\n"+
    "uniform sampler2D tex1;\n"+
    "uniform sampler2D tex2;\n"+
    "void main()\n"+
    "{\n"+
    "    gl_FragColor = 0.5*texture2D(tex1, TexCoords) + 0.5*texture2D(tex2, TexCoords)  ;\n"+
    "}\n";


var  squareFloat32Array = new Float32Array( [
	-1, -1, 0,
	+1, -1, 0,
	+1, +1, 0,
	-1, +1, 0
]);

var texCoordsFloat32Array = new Float32Array( [
    0, 0,
    1, 0,
    1, 1,
    0, 1
]);



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
    aTexCoordsLocation=gl.getAttribLocation(shaderProgram, "aTexCoords");

    /* set uniform variables locations */
    moveLocation=gl.getUniformLocation(shaderProgram, "move");
    scaleLocation=gl.getUniformLocation(shaderProgram, "scale");
    scaleTexLocation=gl.getUniformLocation(shaderProgram, "scaleTex");
    tex1Location=gl.getUniformLocation(shaderProgram, "tex1");
    tex2Location=gl.getUniformLocation(shaderProgram, "tex2");


    /* load  data buffers */
    squareArrayBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareArrayBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, squareFloat32Array , gl.STATIC_DRAW );

    texCoordsBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, texCoordsFloat32Array , gl.STATIC_DRAW );


};


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
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    return textureId;
}

var loadTexture2DFromImg= function(gl, img, textureId){
    /* use after  makeShaderProgram(gl) */
    /* Parameters:
       gl - WebGL context
       img - container of the image
       textureId - ID returned by  createMyTexture2D
       textureUnit - texture unit to which the texture should be bound
    */
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); 
    gl.bindTexture(gl.TEXTURE_2D, textureId);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
};

var draw= function( gl, move3d, scale3d, scaleTex2d, texture1, texture2 ){
    gl.uniform3fv(moveLocation,  move3d  );
    gl.uniform3fv(scaleLocation, scale3d  );
    gl.uniform2fv(scaleTexLocation, scaleTex2d  );

    gl.activeTexture(gl.TEXTURE0+1 );
    gl.uniform1i(tex1Location, 1 );
    gl.bindTexture(gl.TEXTURE_2D, texture1);

    gl.activeTexture(gl.TEXTURE0+2 );
    gl.uniform1i(tex2Location, 2 );
    gl.bindTexture(gl.TEXTURE_2D, texture2);

    gl.enableVertexAttribArray(aPositionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareArrayBuffer);
    gl.vertexAttribPointer(aPositionLocation, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(aTexCoordsLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer);
    gl.vertexAttribPointer(aTexCoordsLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
} 

var redraw=function(){
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    /* draw( gl, move3d, scale3d, scaleTex2d, texture1, texture2 ) */
    draw( gl, [0, 0, 0], [0.2, 0.2, 1], [1,1], textureId1, textureId2 );
    draw( gl, [-1+0.3, -1+0.3, 0], [0.2, 0.2, 1], [3,3], textureId1, textureId1 );
    draw( gl, [1-0.3, 1-0.3, 0], [0.2, 0.2, 1], [2,2], textureId2, textureId2 );
    
};

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


window.onload= function(){
    html={};
    html.canvasGL=document.querySelector('#canvasGL');
    html.imgTex1=document.querySelector('#imgTex1');
    html.imgTex1=document.querySelector('#imgTex2');

    gl = canvasGL.getContext("webgl");

    makeShaderProgram(gl);

    textureId1=createTexture2D(gl);
    textureId2=createTexture2D(gl);

    loadTexture2DFromImg(gl, imgTex1, textureId1);
    loadTexture2DFromImg(gl, imgTex2, textureId2);

    onWindowResize();
    window.onresize= onWindowResize;
};

