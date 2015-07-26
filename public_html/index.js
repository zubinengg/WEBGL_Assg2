
var canvas;
var gl;

var maxNumVertices  = 10000;
var index = 0;

var cIndex = 0;

var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

var t;
var draw = false;
var numLineSegments = 0;
var numIndices = [];
numIndices[0] = 0;
var start = [0];

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Color menu
    var colorMenu = document.getElementById("mymenu");
    
    colorMenu.addEventListener("click", function() {
       cIndex = colorMenu.selectedIndex;
    });
    
    

    
    canvas.addEventListener("mousedown", function(event){
	draw = true;
	console.log("mousedown "+canvas.width+" x "+canvas.height);
    } );
    canvas.addEventListener("mouseup", function(event){
	draw = false;
	numLineSegments++;
	numIndices[numLineSegments] = 0;
	start[numLineSegments] = index;
	render();
    });
    canvas.addEventListener("mousemove", function(event){
	if (draw) {
	    var x = -1+2*event.clientX/canvas.width 
	    var y = -1+2*(canvas.height-event.clientY)/canvas.height;
	    t = vec2(x,y);
	    //console.log("x="+x+" y="+y);
	    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId);
	    gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));

	    t = vec4(colors[cIndex]);

	    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId);
	    gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));

	    numIndices[numLineSegments]++;
	    index++;
	    render();
	}
    });

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    var cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    //render();
}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );

    for(var i = 0; i<=numLineSegments; i++) {
        gl.drawArrays( gl.LINE_STRIP, start[i], numIndices[i] );
    }
    //window.requestAnimFrame(render);

}
