var bgColor=[ 1.0, 1.0, 1.0, 1.0 ];

var gridLines=[];
var gridLinesColor=[0.5, 0.5, 0.5, 1.0];
var gridDepth=0.5;

var points=[];
var pointColor= [0.0, 0.0, 0.0, 1.0];
var pointDepth=0.5; 

var edgeLines=[];
var edgeColor= [0.0, 0.0, 0.0, 1.0];
var edgeDepth= 0.0;



var pushLine= function( x1, y1, x2, y2, lines) {
    lines.push(x1);
    lines.push(y1);
    lines.push(x2);
    lines.push(y2);
};


var pushPixel= function( x, y, pixels){
    pixels.push(x);
    pixels.push(y);
};


/* push  line segments of the m x n grid to lines */
var pushGrid= function( m, n, lines ){
    for(var x=0; x<m; x++)
	pushLine( x,0, x,n, lines);
    for(var y=0; y<n, y++)
	pushLine( 0,y, m,y, lines);
};

/* push graph of the function fun: {a, ..., b-1} -> R */
var pushGraph= function(fun, a,b, pixels){
    for(var x=a; x<b; x++)
	pushPixel( x,fun(x), pixels);
};



/* reverse of k lowest bits */
var  revBits=funcion(k, x) {
    var y= (x&1);
    for(var i=1; i<k; i++){
	y= y<<1;
	x= x>>1;
	y= (y | (x&1));
    }
    return y;
}


/* prepare graph of revBits(k,x) */
var revBitsGraph= function(k)
{
    var fun= function(x) {return revBits(k,x) };
    var n=(1<<k);
    pushGrid(n,n, gridLines);
    pushGraph(fun, 0,n, pixels);
}

