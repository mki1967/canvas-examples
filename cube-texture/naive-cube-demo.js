/* redefinition of sbx_createFunctionRGB */

sbx_createFunctionRGB= function(fR,fG,fB, xyz) {
    /* returns function used in fillCanvas */
    /* xyz is used for selection and inversion of arguments x,y,z from [h, v, depth, -h,-v, -depth] */
    var t=sbx_shiftAndScale;
    return function(h,v,depth){
        var args=[h,v,depth, -h,-v,-depth];
        // var vxyz=sbx_vectorNormalized([ args[xyz[0]], args[xyz[1]], args[xyz[2]] ]);
        var vxyz=[ args[xyz[0]]/depth, args[xyz[1]]/depth, args[xyz[2]]/depth ];
        var x=vxyz[0];
        var y=vxyz[1];
        var z=vxyz[2];

        return [t(fR(x,y,z)), t(fG(x,y,z)), t(fB(x,y,z))];
    }
}

