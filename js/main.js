$(document).ready(function(){

  var isChrome = !!window.chrome;

  if (!isChrome) {
    $('#notChrome').show();
    $('#introInfo').hide();
  }
  // Hide the intro div page
  $("#introInfo").delay(7000).fadeOut(9000);

  $("iframe").css("margin-top", (document.documentElement.clientHeight * -(0.076)))

  // set up video and canvas elements needed

  var  isTracking = false,
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
  // IN FRONT
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

  var yMax = 0,
      yMin = 0,
      yCenterValues = [];

  htracker.init(videoInput, canvasInput);
  htracker.start();

  function adjuster(x) {
    var offSetter = -(fogCanvas.height / 2),
        adjustby = (fogCanvas.height / 15);
  switch (true) {
    case (x < (fogCanvas.height / 5.6)):
      offSetter += (1 * adjustby);
      break;
    case (x < (fogCanvas.height / 5.469)):
      offSetter += (2 * adjustby);
      break;
    case (x < (fogCanvas.height / 5.344)):
      offSetter += (3 * adjustby);
      break;
    case (x < (fogCanvas.height / 5.224)):
      offSetter += (4 * adjustby);
      break;
    case (x < (fogCanvas.height / 5.0)):
      offSetter += (5 * adjustby);
      break;
    case (x < (fogCanvas.height / 4.895)):
      offSetter += (6 * adjustby);
      break;
    case (x < (fogCanvas.height / 4.795)):
      offSetter += (7 * adjustby);
      break;
    case (x < (fogCanvas.height / 4.698)):
      offSetter += (8 * adjustby);
      break;
    case (x < (fogCanvas.height / 4.605)):
      offSetter += (9 * adjustby);
      break;
    case (x < (fogCanvas.height / 4.516)):
      offSetter += (10 * adjustby);
      break;
    case (x < (fogCanvas.height / 4.430)):
      offSetter += (11 * adjustby);
      break;
    case (x < (fogCanvas.height / 4.348)):
      offSetter += (12 * adjustby);
      break;
    case (x < (fogCanvas.height / 4.268)):
      offSetter += (13 * adjustby);
      break;
    case (x < (fogCanvas.height / 4.192 )):
      offSetter += (14 * adjustby);
      break;
    case (x < (fogCanvas.height / 4.217)):
      offSetter = 0;
      break;
    case (x < (fogCanvas.height / 4.118 )):
      offSetter += (15 * adjustby);
      break;
    case (x < (fogCanvas.height / 4.046)):
      offSetter += (16 * adjustby);
      break;
    case (x < (fogCanvas.height / 3.977)):
      offSetter += (17 * adjustby);
      break;
    case (x < (fogCanvas.height / 3.911)):
      offSetter += (18 * adjustby);
      break;
    case (x < (fogCanvas.height / 3.846)):
      offSetter += (19 * adjustby);
      break;
    case (x < (fogCanvas.height / 3.784)):
      offSetter += (20 * adjustby);
      break;
    case (x < (fogCanvas.height / 3.723)):
      offSetter += (21 * adjustby);
      break;
    case (x < (fogCanvas.height / 3.665 )):
      offSetter += (22 * adjustby);
      break;
    case (x < (fogCanvas.height / 3.608)):
      offSetter += (23 * adjustby);
      break;
    case (x < (fogCanvas.height / 3.553)):
      offSetter += (24 * adjustby);
      break;
    case (x < (fogCanvas.height / 3.500)):
      offSetter += (25 * adjustby);
      break;
    case (x < (fogCanvas.height / 3.448)):
        offSetter += (26 * adjustby);
        break;
    case (x < (fogCanvas.height / 3.398)):
        offSetter += (27 * adjustby);
        break;
    case (x < (fogCanvas.height / 3.349)):
        offSetter += (28 * adjustby);
        break;
    case (x < (fogCanvas.height / 3.302)):
        offSetter += (29 * adjustby);
        break;
    case (x < (fogCanvas.height / 3.256)):
        offSetter += (30 * adjustby);
        break;
    default:
      offSetter = (fogCanvas.height / 2.3);
  }
  //console.log("the offsetter " + offSetter);
  return offSetter;
  }

  // for each facetracking event received draw rectangle around tracked face on canvas
  document.addEventListener("facetrackingEvent", function( event ) {
    // clear canvas
    overlayContext.clearRect(0,0,320,240);

    if (event.detection == "CS") {

      //This is the green box that represents the mouth, -AA
      overlayContext.translate(event.x, event.y);
      overlayContext.rotate(event.angle-(Math.PI/2));
      overlayContext.strokeStyle = "#00CC00";
      // This draws the coordinates of my mouth in a rectangle shape
      // In the middle of this box is where the middle of my mouth is
      overlayContext.strokeRect((-(event.width/3)) >> 0, (-(event.height/2) + 85) >> 0, ((event.width/5)+ 70), event.height/5);
      overlayContext.rotate((Math.PI/2)-event.angle);
      overlayContext.translate(-event.x, -event.y);

      // event.[width/height] is the face detected
      // points to get the diagonal
      var x1 = (-(event.width/3)) >> 0;
      var y1 = (-(event.height/2) + 85) >> 0;
      var x2 = ((event.width/5)+ 70);
      var y2 = (event.height/5);

      // try changing event.x to event.width: THIS WORKED!!
      // get center of green box based on coords of the diagonal, -AA
      xCenter = ((x1 +x2)/2) + event.x;
      yCenter = ((y1 + y2)/2) +  event.y;
      // console.log("The event y" + event.y);
      // console.log("yCenter unadjusted" + yCenter);
      // yCenterValues.push(yCenter);
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
      var adjustment = adjuster(event.y);
      //yCenter = yCenter * (pracImgHeight / 240.0) + adjustment;
      yCenter = yCenter * (pracImgHeight / 240.0) + adjustment;
      //console.log("yCenter adjusted " + yCenter);

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
          //console.log(coords[i][0]);
          // draws each circle in the coords array
          pracImgContext.beginPath(); // Start the path
          // pracImgWidth - coords[i][0] makes it go left when move head left and vice versa ... before went oppisite
          pracImgContext.arc(pracImgWidth-coords[i][0], coords[i][1], coords[i][2], 0, Math.PI*2, false);
          pracImgContext.closePath();
          pracImgContext.fillStyle = coords[i][3];
          pracImgContext.fill();
        }
      } // If statement for face2canvasratio
    } // This ends the if statement for event.detection
  });

  // document.addEventListener("mousedown", function(e){
  //
  //       // console.log("This is the max yCenter" + yMax);
  //       // console.log("This is the min yCenter" + yMin);
  //       // console.dir(yCenterValues);
  //       //console.log(fogCanvas.height);
  //
  // });

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
    windowRatioCorrection = pracImgWidth / 320.0,
    aa = pracImgCanvas.clientWidth,
    vp = pracImgCanvas.clientHeight;

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

    isTracking = true;
    paint = true;
    addClick(e.pageX, e.pageY);
    redraw();
    //
    // For the slow clearing...
    var timers = [],
    secondsStart = 1000,
    secondsInc = 20,
    reduceRadius = 0,
    opacityInc = 0.0;


    for (var i = 0; i < 11; i++) {
      for(var j = (aa/2) ; j > 2; j = j - 1) {
        secondsStart += secondsInc
        timers.push([ new Date( ( new Date() ).getTime() + secondsStart ), j]);
      }
    }

    timer = setInterval( clearFog, 20 );

    // function that clears canvas
    function clearFog() {
        // check if times array is empty, when try and executes block of code, array will shifted (dequeue)
        if( timers.length ) {
            // check if the first row is equal to the current time
            if ( parseInt( timers[0][0].getTime() / 1000 ) <= parseInt( new Date().getTime() / 1000 ) ) {
                // draw a arc with only an outline of destination-out that ~erase
                // make globalAlpha gradually less (higher, boundry 1)
                //pracImgContext.scale(1, 1); // trying to make an ellipse
                pracImgContext.beginPath();
                pracImgContext.globalCompositeOperation = "destination-out";
                pracImgContext.lineWidth = 1;
                pracImgContext.globalAlpha = 0.026;
                pracImgContext.arc(aa/2, vp/2, timers[0][1], 0, 2*Math.PI);
                pracImgContext.stroke();
                // remove from array
                timers.shift();
            }
        } else {
            // when array is empty, remove interval
            clearInterval( timer );
            //pracImgContext.scale(1,1);
        }
    }

    //
  });

  $('#pracImgCanvas').mousemove(function(e){
    if(paint){
      addClick(e.pageX, e.pageY, true);
      redraw();
    }
  });

  $('#pracImgCanvas').mouseup(function(e){
    paint = false;
    // This makes it so you don't reveal old drawings
    clickX = [];
    clickY = [];
    clickDrag = [];
    // End slow clearing
  }); // End mouseup

/** COLT THIS IS FOR YOU!!!!
  * This is mock data that they for loop that makes the array outputs
  * The numbers are different than the current for loop
*/
// var timers = [
//     [new Date( ( new Date() ).getTime() + 1000), 10, 0.2],
//     [new Date( ( new Date() ).getTime() + 1200),10, 0.25],
//     [new Date( ( new Date() ).getTime() + 1400),10, 0.3],
//     [new Date( ( new Date() ).getTime() + 1600),10, 0.35],
//     [new Date( ( new Date() ).getTime() + 1800),10, 0.4],
//     [new Date( ( new Date() ).getTime() + 2000),10, 0.45],
//     [new Date( ( new Date() ).getTime() + 2200),10, 0.5],
//     [new Date( ( new Date() ).getTime() + 2400),10, 0.55],
//     [new Date( ( new Date() ).getTime() + 2600), 10, 0.6],
//     [new Date( ( new Date() ).getTime() + 2800),10, 0.65],
//     [new Date( ( new Date() ).getTime() + 3000),10, 0.7],
//     [new Date( ( new Date() ).getTime() + 3200),10, 0.75],
//     [new Date( ( new Date() ).getTime() + 3400),10, 0.8],
//     [new Date( ( new Date() ).getTime() + 3600),10, 0.85],
//     [new Date( ( new Date() ).getTime() + 3800),10, 0.9],
//     [new Date( ( new Date() ).getTime() + 4000),10, 0.95],
//     [new Date( ( new Date() ).getTime() + 4200),20, 0.1],
//     [new Date( ( new Date() ).getTime() + 18000),20, 0.2],
//     [new Date( ( new Date() ).getTime() + 19000),20, 0.3],
//     [new Date( ( new Date() ).getTime() + 20000),20, 0.4],
//     [new Date( ( new Date() ).getTime() + 21000),20, 0.5],
//     [new Date( ( new Date() ).getTime() + 22000),20, 0.6],
//     [new Date( ( new Date() ).getTime() + 23000),20, 0.8],
//     [new Date( ( new Date() ).getTime() + 24000),20, 0.9],
// ]

}); // end
