var pixVertexShaderSrc=""+
    "attribute vec2 aPosition;\n"+
    "void main()\n"+
    "{\n"+
    "    gl_Position = vec4(aPosition, 0.0, 1.0);\n"+
    "}\n";

var pixFragmentShaderSrc=""+
    "precision mediump float;\n"+
    "uniform sampler2D tex2D;\n"+
    "void main()\n"+
    "{\n"+
    "    float d= floor( mod(gl_FragCoord.x+gl_FragCoord.y, 2.0) );\n"+ // gl_FragCoord - współrzędne piksli na ekranie
    "    if( d>0.5 ) discard;\n"+
    "    gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );\n"+
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
    gl = canvasGL.getContext("webgl");
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([ -1, -1, 
				     -1,  1, 
				      1,  1,
				      1, -1] ) , gl.STATIC_DRAW ); // load object's shape
    

    shaderProgram= makeShaderProgram(gl, pixVertexShaderSrc , pixFragmentShaderSrc )
    aPositionLocation = gl.getAttribLocation(shaderProgram, "aPosition");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
    gl.useProgram( shaderProgram );
    gl.enableVertexAttribArray(aPositionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId ); /* refer to the buffer */
    gl.vertexAttribPointer(aPositionLocation, 2 /* floatsPerVertex */, gl.FLOAT, false, 0 /* stride */, 0 /*offset */);
    gl.drawArrays(gl.TRIANGLE_FAN, 0 /* offset */, 4 /*NumberOfVertices */);
}    
