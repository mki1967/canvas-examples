
mki3d={};

window.onload= function(){
    mki3d.html.initObjects();
    mki3d.gl.initGL( mki3d.html.canvas );
    window.onresize= mki3d.callback.onWindowResize;
    mki3d.html.button1.onclick = mki3d.callback.onButton1;
    mki3d.callback.onWindowResize(); 
};

mki3d.gl={};

mki3d.gl.initGL= function(canvas) {
    var gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    mki3d.gl.context = gl;
};

mki3d.redraw = function() {
    var gl = mki3d.gl.context;
    var bg = mki3d.data.background;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clearColor(bg[0], bg[1], bg[2], bg[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};


mki3d.html={};

mki3d.html.initObjects= function() {
    mki3d.html.html=document.querySelector('#htmlId');
    mki3d.html.canvas= document.querySelector('#canvasId');
    mki3d.html.button1= document.querySelector('#button1');
    mki3d.html.js1= document.querySelector('#js1');
    mki3d.html.vs1= document.querySelector('#vs1');
    mki3d.html.fs1= document.querySelector('#fs1');
    console.log(mki3d.html.js1);
    console.log(mki3d.html.vs1.innerText);
    console.log(mki3d.html.fs1.innerText);


};


mki3d.callback={};

mki3d.callback.onWindowResize = function () {
    var wth = parseInt(window.innerWidth)-10;
    var hth = parseInt(window.innerHeight)-10;
    var canvas = mki3d.html.canvas;
    var gl = mki3d.gl.context;
    canvas.setAttribute("width", ''+wth);
    canvas.setAttribute("height", ''+hth);
    gl.viewportWidth = wth;
    gl.viewportHeight = hth;
    gl.viewport(0,0,wth,hth);
    mki3d.redraw();
};

mki3d.callback.onButton1 = function () {
    mki3d.data.background[0]=Math.random();
    mki3d.data.background[1]=Math.random();
    mki3d.data.background[2]=Math.random();
    mki3d.redraw();
}

mki3d.data = {};

mki3d.data.background = [ 0.0, 0.0, 0.0, 1.0 ];
