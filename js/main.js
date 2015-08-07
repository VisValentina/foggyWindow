$(document).ready(function(){
  // set up video and canvas elements needed

  var isTracking = false,
       xCenter,
       yCenter,
       videoInput = document.getElementById('vid'),
       canvasInput = document.getElementById('compare'),
       canvasOverlay = document.getElementById('overlay'),
       overlayContext = canvasOverlay.getContext('2d'),
       globalFaceRatio;

  // set style for canvas for the headtrackr
  canvasOverlay.style.position = "absolute";
  canvasOverlay.style.top = '0px';
  canvasOverlay.style.zIndex = '100001';
  canvasOverlay.style.display = 'none';

  // lab experiment by VP and AA
  // set the pracImgCanvas to the window width and height, cross fingers ... please work!!!
  // get the pracImgCanvas element
  var fogCanvas = document.getElementById("pracImgCanvas");
  // set the width of it to be window width and height
  fogCanvas.width = document.documentElement.clientWidth;
  fogCanvas.height = document.documentElement.clientHeight;

  // the face tracking setup
  var htracker = new headtrackr.Tracker({
    calcAngles : true,
    ui : false,
    headPosition : false
  });

  htracker.init(videoInput, canvasInput);
  htracker.start();

  // for each facetracking event received draw rectangle around tracked face on canvas
  document.addEventListener("facetrackingEvent", function( event ) {
    // clear canvas
    overlayContext.clearRect(0,0,320,240);
    if (event.detection == "CS") {
      overlayContext.translate(event.x, event.y);
      overlayContext.rotate(event.angle-(Math.PI/2));
      overlayContext.strokeStyle = "#00CC00";
      // This draws the coordinates of my mouth in a rectangle shape
      // In the middle of this box is where the middle of my mouth is
      overlayContext.strokeRect((-(event.width/3)) >> 0, (-(event.height/2) + 85) >> 0, ((event.width/5)+ 70), event.height/5);
      overlayContext.rotate((Math.PI/2)-event.angle);
      overlayContext.translate(-event.x, -event.y);


      var x1 = (-(event.width/3)) >> 0;
      var y1 = (-(event.height/2) + 85) >> 0;
      var x2 = ((event.width/5)+ 70);
      var y2 = (event.height/5);

      // instead of add event.x & y, subtract: DIDN'T WORK
      // try changing event.x to event.width: THIS WORKED!!
      xCenter = ((x1 +x2)/2) + event.x;
      yCenter = ((y1 + y2)/2) + event.y;


    // This determines if my face is close to the screen
    var faceWidth = event.width,
        videoWidth = videoInput.width,
        face2canvasRatio = videoWidth/faceWidth;
        globalFaceRatio = face2canvasRatio;

    if(face2canvasRatio <= 2.4) {
      var pracImgCanvas = document.getElementById("pracImgCanvas");
      var pracImgContext = pracImgCanvas.getContext("2d");
      pracImgContext.globalCompositeOperation = "lighten";
      var pracImgWidth = pracImgCanvas.clientWidth;
      var pracImgHeight = pracImgCanvas.clientHeight;
      // to adjust the painting of the fog from the dimensions of the overlay to the pracImgCanvas
      xCenter = xCenter * (pracImgWidth / 320.0);
      yCenter = yCenter * (pracImgHeight / 240.0);

      // to increase the size of the radius of the fog circles
      var windowRatioCorrection = pracImgWidth / 320.0;

      // V needs to fiddle to get the circles correctly spaced
      var coords = [
        [(xCenter - (20  * windowRatioCorrection)), (yCenter - (10 * windowRatioCorrection)), (20 * windowRatioCorrection), "rgba(209,210,210,.07)"],
        [(xCenter - (30 * windowRatioCorrection)), (yCenter - (25 * windowRatioCorrection)), (10 * windowRatioCorrection), "rgba(209,210,210,.04)"],
        [(xCenter - (5 * windowRatioCorrection)), (yCenter - (5 * windowRatioCorrection)), (5 * windowRatioCorrection), "rgba(209,210,210,.03)"],
        [(xCenter - (35 * windowRatioCorrection)), (yCenter), (15 * windowRatioCorrection), "rgba(209,210,210,.05)"],
        [(xCenter), (yCenter), (12 * windowRatioCorrection), "rgba(209,210,210,.03)"],
        [(xCenter), (yCenter - (10 * windowRatioCorrection)), (5 * windowRatioCorrection), "rgba(209,210,210,.03)"],
        [(xCenter + (20 * windowRatioCorrection)), (yCenter - (40 * windowRatioCorrection)), (4 * windowRatioCorrection), "rgba(209,210,210,.03)"],
        [(xCenter - (20 * windowRatioCorrection)), (yCenter - (30 * windowRatioCorrection)), (12 * windowRatioCorrection), "rgba(209,210,210,.02)"]
        ];
        for(var i = 0; i < coords.length; i++) {
          console.log(coords[i][0]);
          pracImgContext.beginPath(); // Start the path
          pracImgContext.arc(pracImgWidth-coords[i][0], coords[i][1], coords[i][2], 0, Math.PI*2, false);
            pracImgContext.closePath();
            pracImgContext.fillStyle = coords[i][3];
            pracImgContext.fill();
        }
      } // If statement for face2canvasratio
    } // This ends the if statement for event.detection
  });

  document.addEventListener("mousedown", function(e){
        isTracking = true;
      });

  document.addEventListener("mousemove", function(e){
    var lastMouseCoords;
    if(isTracking === true) {
        var canvas = document.getElementById("pracImgCanvas");
        var pracImgContext = canvas.getContext("2d");
        var mouseX = e.clientX;
        var mouseY = e.clientY;
    }
  });

  document.addEventListener("mouseup", function(e) {
    isTracking = false;
  });

// click event handling

// variables to track x and y mouse coordinates to erase
var clickX = [],
    clickY = [],
    clickDrag = [],
    paint,
    pracImgCanvas = document.getElementById("pracImgCanvas"),
    pracImgContext = pracImgCanvas.getContext("2d"),
    pracImgWidth = pracImgCanvas.clientWidth,
    windowRatioCorrection = pracImgWidth / 320.0;

  // blue circle is st stub to test erasing
  // pracImgContext.beginPath();
  // pracImgContext.arc(100, 75, 50 , 0, 2*Math.PI);
  // pracImgContext.fillStyle = "blue";
  // pracImgContext.fill();

  function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
  }

  function redraw(){
    pracImgContext.strokeStyle = "rgba(0,0,0,1)";
    pracImgContext.lineJoin = pracImgContext.lineCap = "round";
    pracImgContext.shadowBlur = 3;
    pracImgContext.shadowColor = "rgba(0,0,0,1)";
    pracImgContext.lineWidth =  windowRatioCorrection * 4;
    pracImgContext.globalCompositeOperation = "destination-out";
    

    for(var i=0; i < clickX.length; i++) {
      pracImgContext.beginPath();
      if(clickDrag[i] && i){
        pracImgContext.moveTo(clickX[i-1], clickY[i-1]);
       } else {
         pracImgContext.moveTo(clickX[i]-1, clickY[i]);
       }
       pracImgContext.lineTo(clickX[i], clickY[i]);
       pracImgContext.closePath();
        pracImgContext.stroke();
    }
  }

  $('#pracImgCanvas').mousedown(function(e){
    var mouseX = e.pageX - this.offsetLeft,
        mouseY = e.pageY - this.offsetTop;

    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
  });

  $('#pracImgCanvas').mousemove(function(e){
    if(paint){
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
      redraw();
    }
  });

  $('#pracImgCanvas').mouseup(function(e){
    paint = false;
    // This makes it so you don't reveal old drawings
    clickX = [];
    clickY = [];
    clickDrag = [];
  });

  // $('#pracImgCanvas').mouseleave(function(e){
  //   paint = false;
  // });

}); // end