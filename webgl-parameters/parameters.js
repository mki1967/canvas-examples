
var html;

var htmlInit= function() {
    html={};
    html.html=document.querySelector('#htmlId');
    html.canvas= document.querySelector('#canvasId');
    html.divMessages= document.querySelector('#divMessages');
};

var gl;

window.onload= function(){
    htmlInit();
    gl = html.canvas.getContext("experimental-webgl");
    html.divMessages.innerHTML="<h3>Parameter values:</h3>\n";
    html.divMessages.innerHTML+="<ul>\n";
    html.divMessages.innerHTML+="<li>"+"MAX_VIEWPORT_DIMS"+" = "+JSON.stringify(gl.getParameter(gl.MAX_VIEWPORT_DIMS))+"</li>\n";
    html.divMessages.innerHTML+="<li>"+"MAX_VARYING_VECTORS"+" = "+JSON.stringify(gl.getParameter(gl.MAX_VARYING_VECTORS))+"</li>\n";

    html.divMessages.innerHTML+="<li>"+"MAX_VERTEX_ATTRIBS"+" = "+JSON.stringify(gl.getParameter(gl.MAX_VERTEX_ATTRIBS))+"</li>\n";
    html.divMessages.innerHTML+="<li>"+"MAX_VERTEX_TEXTURE_IMAGE_UNITS"+" = "+JSON.stringify(gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS))+"</li>\n";
    html.divMessages.innerHTML+="<li>"+"MAX_VERTEX_UNIFORM_VECTORS"+" = "+JSON.stringify(gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS))+"</li>\n";

    html.divMessages.innerHTML+="<li>"+"MAX_COMBINED_TEXTURE_IMAGE_UNITS"+" = "+JSON.stringify(gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS))+"</li>\n";
    html.divMessages.innerHTML+="<li>"+"MAX_TEXTURE_IMAGE_UNITS"+" = "+JSON.stringify(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS))+"</li>\n";

    html.divMessages.innerHTML+="<li>"+"MAX_CUBE_MAP_TEXTURE_SIZE"+" = "+JSON.stringify(gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE))+"</li>\n";
    html.divMessages.innerHTML+="<li>"+"MAX_TEXTURE_SIZE"+" = "+JSON.stringify(gl.getParameter(gl.MAX_TEXTURE_SIZE))+"</li>\n";
    html.divMessages.innerHTML+="<li>"+"MAX_RENDERBUFFER_SIZE"+" = "+JSON.stringify(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE))+"</li>\n";

    html.divMessages.innerHTML+="<li>"+"ALIASED_POINT_SIZE_RANGE"+" = "+JSON.stringify(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE))+"</li>\n";
    html.divMessages.innerHTML+="<li>"+"ALIASED_LINE_WIDTH_RANGE"+" = "+JSON.stringify(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE))+"</li>\n";
/*
    html.divMessages.innerHTML+="<li>"+""+" = "+JSON.stringify(gl.getParameter(gl.))+"</li>\n";
*/
    html.divMessages.innerHTML+="</ul>\n";
};
