var pixVertexShaderSrc=""+
    "attribute vec2 aPosition;\n"+
    "uniform vec2 move;\n"+
    "void main()\n"+
    "{\n"+
    "    gl_Position = vec4(aPosition+move, 0.0, 1.0);\n"+
    "}\n";

var pixFragmentShaderSrc=""+
    "precision mediump float;\n"+
    "void main()\n"+
    "{\n"+
    "    float d= floor( mod(gl_FragCoord.x+gl_FragCoord.y, 2.0) );\n"+ // gl_FragCoord - współrzędne piksli na ekranie
    "    if( d>0.5 ) discard;\n"+
    "    gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );\n"+
    "}\n";

var pixFragmentShaderSrc2=""+
    "precision mediump float;\n"+
    "uniform vec3 color;\n"+
    "void main()\n"+
    "{\n"+
    "    gl_FragColor = vec4( color, 1.0 );\n"+
    "}\n";


var makeShaderProgram= function(gl, vertexShaderSource, fragmentShaderSource){
    /* Parameters:
       gl - WebGL context
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



window.onload= function(){
    var  canvasGL=document.querySelector('#canvasGL');
    gl = canvasGL.getContext("webgl", { stencil: true } );
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([ -1, -1, 
				     -1,  1, 
				      1,  1,
				      1, -1] ) , gl.STATIC_DRAW ); // load object's shape

    bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2 );
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([ -1,  0, 
				      0,  1, 
				      1,  0,
				      0, -1] ) , gl.STATIC_DRAW ); // load object's shape
    

    shaderProgram= makeShaderProgram(gl, pixVertexShaderSrc , pixFragmentShaderSrc )
    aPositionLocation = gl.getAttribLocation(shaderProgram, "aPosition");

    shaderProgram2= makeShaderProgram(gl, pixVertexShaderSrc , pixFragmentShaderSrc2 )
    aPositionLocation2 = gl.getAttribLocation(shaderProgram2, "aPosition");
    colorLocation2 = gl.getUniformLocation(shaderProgram2, "color")
    moveLocation2 = gl.getUniformLocation(shaderProgram2, "move")

    // prepare the stencil buffer

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.STENCIL_TEST);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clearStencil(0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT );
    
    gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE );
    gl.stencilMask(255); // enable modification of stencil buffer    
    gl.stencilFunc(gl.ALWAYS, 1, 255);
    

    gl.useProgram( shaderProgram );
    gl.enableVertexAttribArray(aPositionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId ); /* refer to the buffer */
    gl.vertexAttribPointer(aPositionLocation, 2 /* floatsPerVertex */, gl.FLOAT, false, 0 /* stride */, 0 /*offset */);
    gl.drawArrays(gl.TRIANGLE_FAN, 0 /* offset */, 4 /*NumberOfVertices */);


    /// draw through stencil

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.GL_LESS);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // draw through reference pixels 1
    gl.stencilFunc(gl.EQUAL, 1, 255); 

    gl.stencilMask(0); // disable modification of stencil buffer

    gl.useProgram( shaderProgram2 );
    gl.uniform3f(colorLocation2, 1, 0, 0)
    gl.uniform2f(moveLocation2, 0.25, 0.25, 0)
    gl.enableVertexAttribArray(aPositionLocation2);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2 ); /* refer to the buffer */
    gl.vertexAttribPointer(aPositionLocation2, 2 /* floatsPerVertex */, gl.FLOAT, false, 0 /* stride */, 0 /*offset */);
    gl.drawArrays(gl.TRIANGLE_FAN, 0 /* offset */, 4 /*NumberOfVertices */);

    // draw through reference pixels 0
    gl.stencilFunc(gl.EQUAL, 0, 255); 

    gl.stencilMask(0); // disable modification of stencil buffer
    
    gl.useProgram( shaderProgram2 );
    gl.uniform3f(colorLocation2, 0, 0, 1)
    gl.uniform2f(moveLocation2, -0.25, -0.25, 0)
    gl.enableVertexAttribArray(aPositionLocation2);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2 ); /* refer to the buffer */
    gl.vertexAttribPointer(aPositionLocation2, 2 /* floatsPerVertex */, gl.FLOAT, false, 0 /* stride */, 0 /*offset */);
    gl.drawArrays(gl.TRIANGLE_FAN, 0 /* offset */, 4 /*NumberOfVertices */);
 
}    
