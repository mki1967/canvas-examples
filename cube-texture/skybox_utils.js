
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
    if(len==0) return [0,0,0]; // normalized zero vector :-(
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

var sbx_xyzYPlus  = [0,2,4];
var sbx_xyzYMinus = [0,5,1];

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

