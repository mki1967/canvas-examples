var html; // HTML objects

var htmlInit= function() {
    html={};
    html.html=document.querySelector('#htmlId');
    html.canvasZPlus= document.querySelector('#canvasZMinus');
    html.canvasZMinus= document.querySelector('#canvasZPlus');
};

/* assume that x,y,z in [-1 ... 1] */

/* functions returning values in [-1 ... 1] */
var fun= [ 
    function( x,y,z ) {
	return Math.Sin( x * Math.PI * 4 );
    },

    function( x,y,z ) {
	return Math.Sin( z * Math.PI * 4 );
    },

    function( x,y,z ) {
	return Math.Sin( y * Math.PI * 4 );
    }
];

var shiftAndScale= function( value ){
    /* transform range [-1..1] to [0..255] */
    value+=1;
    value*= 255/2;
    return value;
}



var vectorScale = function(v, sx, sy, sz ) {
    v[0]*= sx;
    v[1]*= sy;
    v[2]*= sz;
};

/* some algebra ... */

var scalarProduct= function( v, w ) {
    return v[0]*w[0]+v[1]*w[1]+v[2]*w[2];
};

var vectorLength = function (a) {
    return Math.sqrt(scalarProduct(a,a));
};

var vectorNormalized = function (v) { 
    var len= vectorLength(v);
    if(len==0) return [0,0,0]; // normalized zero vector :-(
    var vn= [v[0], v[1], v[2]] ; //  clone of vector v
    var s =1/len; 
    var vectorScale(vn,  s,s,s);
    return vn;
};



/* screen operations */
var putPixel= function(ctx, x,y, rgb){
    ctx.fillStyle = "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
    ctx.fillRect(x,y,1,1);
}

var fillCanvas= function(canvas, fRGB){
    /* fRGB - function of (h,v,depth) - returns vector [r,g,b] in [0 ... 255]^3 */
    
    var ctx=canvas.getContext("2d");
    var maxHorizontal= ctx.width/2;
    var maxVertical  = ctx.height/2;
    var depth= ctx.width/2;
    var h,v,x,y,z;
    for(h = -maxHorizontal; h < maxHorizontal; h++)
	for(v = -maxVertical; v < maxVertical; v++ ) {
	    putPixel(ctx, fRGB(h,v,depth));
	}
}
