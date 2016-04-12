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
    var fun=sbx_fun;

    var r=Math.floor( Math.random()* fun.length );
    var g=Math.floor( Math.random()* fun.length );
    var b=Math.floor( Math.random()* fun.length );

    // r=g=b=fun.length-1; // test
    // g=fun.length-1; // test


    html.message.innerHTML+=" [r,g,b]="+JSON.stringify([r,g,b]);

    sbx_fillCanvas(html.canvasZPlus, sbx_createFunctionRGB( fun[r], fun[g], fun[b], sbx_xyzZPlus ) );
    sbx_fillCanvas(html.canvasZMinus, sbx_createFunctionRGB( fun[r], fun[g], fun[b], sbx_xyzZMinus ) );

    sbx_fillCanvas(html.canvasXPlus, sbx_createFunctionRGB( fun[r], fun[g], fun[b],  sbx_xyzXPlus ) );
    sbx_fillCanvas(html.canvasXMinus, sbx_createFunctionRGB( fun[r], fun[g], fun[b], sbx_xyzXMinus ) );

    sbx_fillCanvas(html.canvasYPlus, sbx_createFunctionRGB( fun[r], fun[g], fun[b], sbx_xyzYPlus) );
    sbx_fillCanvas(html.canvasYMinus, sbx_createFunctionRGB( fun[r], fun[g], fun[b], sbx_xyzYMinus) );
    // sbx_fillCanvasUpsideDown(html.canvasYMinus, sbx_createFunctionRGB( fun[r], fun[g], fun[b], xyzYMinus) ); // test
}
