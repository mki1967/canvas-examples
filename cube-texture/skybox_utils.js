/* assume that x,y,z in [-1 ... 1] */

/* functions with values in [-1 ... 1]^3 -> [-1 ... 1] */
var fun= [ 
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

var shiftAndScale= function( value ){
    /* transform range [-1..1] to [0..255] */
    value+=1;
    value*= 255/2;
    return Math.round(value);
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
    vectorScale(vn,  s,s,s);
    return vn;
};





/* screen operations */
var putPixel= function(ctx, x,y, rgb){
    ctx.fillStyle = "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
    ctx.fillRect(x,y,1,1);
}


var createFunctionRGB= function(fR,fG,fB, xyz) {
    /* returns function used in fillCanvas */
    /* xyz is used for selection and inversion of arguments x,y,z from [h, v, depth, -h,-v, -depth] */
    var t=shiftAndScale;
    return function(h,v,depth){ 
	var args=[h,v,depth, -h,-v,-depth];
	var vxyz=vectorNormalized([ args[xyz[0]], args[xyz[1]], args[xyz[2]] ]);
 	var x=vxyz[0];
	var y=vxyz[1];
	var z=vxyz[2];

	return [t(fR(x,y,z)), t(fG(x,y,z)), t(fB(x,y,z))];
    }
}

var xyzZPlus  = [0,1,2];
var xyzZMinus = [3,1,5];

var xyzXPlus  = [2,1,3];
var xyzXMinus = [5,1,0];

var xyzYPlus  = [0,2,4];
var xyzYMinus = [0,5,1];

var fillCanvas= function(canvas, fRGB){
    /* fRGB - function of (h,v,depth) - returns vector [r,g,b] in [0 ... 255]^3 */
    
    var ctx=canvas.getContext("2d");
    var maxHorizontal= canvas.width/2;
    var maxVertical  = canvas.height/2;
    var depth= canvas.width/2;
    var h,v,x,y,z;
    for(h = -maxHorizontal, ph=0; h < maxHorizontal; h++,ph++)
	for(v = -maxVertical,pv= canvas.height; v < maxVertical; v++,pv-- ) {
	    putPixel(ctx, ph,pv, fRGB(h,v,depth));
	}
}

var fillCanvasUpsideDown= function(canvas, fRGB){
    /* fRGB - function of (h,v,depth) - returns vector [r,g,b] in [0 ... 255]^3 */
    
    var ctx=canvas.getContext("2d");
    var maxHorizontal= canvas.width/2;
    var maxVertical  = canvas.height/2;
    var depth= canvas.width/2;
    var h,v,x,y,z;
    for(h = -maxHorizontal, ph=0; h < maxHorizontal; h++,ph++)
	for(v = -maxVertical,pv=0; v < maxVertical; v++,pv++ ) {
	    putPixel(ctx, ph,pv, fRGB(h,v,depth));
	}
}
