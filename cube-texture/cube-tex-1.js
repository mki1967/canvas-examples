var html; // HTML objects

var htmlInit= function() {
    html={};
    html.html=document.querySelector('#htmlId');

    html.message= document.querySelector('#message');
    html.canvasZPlus= document.querySelector('#canvasZPlus');
    html.canvasZMinus= document.querySelector('#canvasZMinus');

    html.canvasXPlus= document.querySelector('#canvasXPlus');
    html.canvasXMinus= document.querySelector('#canvasXMinus');

    html.canvasYPlus= document.querySelector('#canvasYPlus');
    html.canvasYMinus= document.querySelector('#canvasYMinus');
};



window.onload= function(){
    htmlInit();
    var r=Math.floor( Math.random()* fun.length );
    var g=Math.floor( Math.random()* fun.length );
    var b=Math.floor( Math.random()* fun.length );

    // r=g=b=fun.length-1; // test
    // g=fun.length-1; // test

    html.message.innerHTML+=" [r,g,b]="+JSON.stringify([r,g,b]);

    fillCanvas(html.canvasZPlus, createFunctionRGB( fun[r], fun[g], fun[b], xyzZPlus ) );
    fillCanvas(html.canvasZMinus, createFunctionRGB( fun[r], fun[g], fun[b], xyzZMinus ) );

    fillCanvas(html.canvasXPlus, createFunctionRGB( fun[r], fun[g], fun[b],  xyzXPlus ) );
    fillCanvas(html.canvasXMinus, createFunctionRGB( fun[r], fun[g], fun[b], xyzXMinus ) );

    fillCanvas(html.canvasYPlus, createFunctionRGB( fun[r], fun[g], fun[b], xyzYPlus) );
    fillCanvas(html.canvasYMinus, createFunctionRGB( fun[r], fun[g], fun[b], xyzYMinus) );
    // fillCanvasUpsideDown(html.canvasYMinus, createFunctionRGB( fun[r], fun[g], fun[b], xyzYMinus) ); // test
}
