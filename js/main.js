/*
 * Fog Window
 * By: Valentina and Armand (Two cool cats)
 * Credits: Headtrackr; https://github.com/auduno/headtrackr
 * Date: August 27, 2015
 */


$(document).ready(function(){

  // Check if the browser is Chrome
  // Headtrackr works best with Chrome
  var isChrome = !!window.chrome;
  // If browser is not Chrome, then show warning div
  if (!isChrome) {
    $('#notChrome').show();
    $('#introInfo').hide();
  }

  // Slowly fade the intro div page after circa 7 seconds
  $("#introInfo").delay(7000).fadeOut(9000);

  // Height of the user's window
  var clientHeight = document.documentElement.clientHeight;
  // Expanding the height of the video to hide the advertisments on the bottom (dynamically)
  $("iframe").css("margin-top", (clientHeight * -(0.076)));
  // Placing the facebook share button, taking into account the margin-top difference from line 18
  $("#shareFacebook").css("bottom", (clientHeight * (0.076)) - (clientHeight * 0.12) );

  // set up video and canvas elements needed
  var  isTracking = false,
       xCenter,
       yCenter,
       videoInput = document.getElementById('vid'),
       canvasInput = document.getElementById('compare'),
       canvasOverlay = document.getElementById('overlay'),
       fogCanvas = document.getElementById("pracImgCanvas"),
       overlayContext = canvasOverlay.getContext('2d'),
       globalFaceRatio;

  // set style for canvas for the headtrackr
  canvasOverlay.style.position = "absolute";
  canvasOverlay.style.top = '0px';
  canvasOverlay.style.zIndex = '100001';
  canvasOverlay.style.display = 'none';


  // This is where we will paint our 'fog'
  // Set the width to be Window width and height, so it fills the screen
  fogCanvas.width = document.documentElement.clientWidth;
  fogCanvas.height = document.documentElement.clientHeight;


  /* **************************** Face tracking setup **************************** */
  // Create a new headtrackr object
  var htracker = new headtrackr.Tracker({
      calcAngles : true,
      ui : false,
      headPosition : false
  });
  htracker.init(videoInput, canvasInput);
  htracker.start();

// TODO - maybe delete?
  var yMax = 0,
      yMin = 0,
      yCenterValues = [];

// Previous issue was not being able to paint fog on the entire height of the fogCanvas
// Solution was to creates a linear adjustment from the event.y to fill the height
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
  return offSetter;
  }

  document.addEventListener("facetrackingEvent", function( event ) {
    // This sets up the area where the green box will be drawn
    overlayContext.clearRect(0,0,320,240);

    if (event.detection == "CS") {
      
      // For each facetracking event received, draw a rectangle around tracked face on canvas
      // This was used for initial purposes to calculate the center of the mouth and was subsequently hidden
      overlayContext.translate(event.x, event.y);
      overlayContext.rotate(event.angle-(Math.PI/2));
      overlayContext.strokeStyle = "#00CC00";
      // This draws the coordinates of my mouth in a rectangle shape
      // In the middle of this box is where the middle of my mouth is
      overlayContext.strokeRect((-(event.width/3)) >> 0, (-(event.height/2) + 85) >> 0, ((event.width/5)+ 70), event.height/5);
      overlayContext.rotate((Math.PI/2)-event.angle);
      overlayContext.translate(-event.x, -event.y);

      // event.[width/height] is the face detected
      // Points to get the diagonal (midpoint of mouth x,y)
      var x1 = (-(event.width/3)) >> 0;
      var y1 = (-(event.height/2) + 85) >> 0;
      var x2 = ((event.width/5)+ 70);
      var y2 = (event.height/5);

      // Get center of green box based on coords of the diagonal
      // These values will be used to calculate where to blow fog
      xCenter = ((x1 +x2)/2) + event.x;
      yCenter = ((y1 + y2)/2) +  event.y;

      // Determining if your face is close to the screen
      var faceWidth = event.width,
          videoWidth = videoInput.width,
          face2canvasRatio = videoWidth/faceWidth;
          globalFaceRatio = face2canvasRatio;

      // If we are close to the screen -
      if(face2canvasRatio <= 2.4) {
        // pracImgCanvas refers to our fogCanvas (changing name for a different implementation)
        var pracImgCanvas = document.getElementById("pracImgCanvas"),
            pracImgContext = pracImgCanvas.getContext("2d"),
            pracImgWidth = pracImgCanvas.clientWidth,
            pracImgHeight = pracImgCanvas.clientHeight;

        pracImgContext.globalCompositeOperation = "lighten";

      // Converts the headtrackr imposed 320 X 240 dimensions of the overlay to fit the client dimensions
      xCenter = xCenter * (pracImgWidth / 320.0);
      // Line 220 calls the adjuster function from above to paint fog relevant to the y-axis
      var adjustment = adjuster(event.y);
      yCenter = yCenter * (pracImgHeight / 240.0) + adjustment;

      // To increase the size of the radius of the fog circles according to client size
      var windowRatioCorrection = pracImgWidth / 320.0;

      // These are the circles painted for each 'breathe'
      // Random values to space circles more organically
      // Transparency for color
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

        // Painting each circle to the page from its array above
        for(var i = 0; i < coords.length; i++) {
          pracImgContext.beginPath(); // Start the path
          // Orginally, painting was mirrored - line 245 flips the painting of x coordinate
          // pracImgWidth - coords[i][0] makes it go left when move head left and vice versa ...
          pracImgContext.arc(pracImgWidth-coords[i][0], coords[i][1], coords[i][2], 0, Math.PI*2, false);
          pracImgContext.closePath();
          pracImgContext.fillStyle = coords[i][3];
          pracImgContext.fill();
        }
      } // If statement for face2canvasratio
    } // This ends the if statement for event.detection
  });

  /* **************************** Erasing **************************** */
  document.addEventListener("mousemove", function(e){
    var lastMouseCoords;
    // Used for the finger erase to establish line coordinates
    if(isTracking === true) {
        var canvas = document.getElementById("pracImgCanvas");
        var pracImgContext = canvas.getContext("2d");
        var mouseX = e.clientX;
        var mouseY = e.clientY;
    }
  });

  document.addEventListener("mouseup", function(e) {
    // When you release 'finger' stop tracking to determine endpoint of line
    isTracking = false;
  });


  // Variables to track mouse.x + y coordinates to erase
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

    // Storing the coordinates of mouse movements to use later
  function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
  }

  // This does the erasing of the 'finger'
  function redraw(){
    pracImgContext.strokeStyle = "rgba(0,0,0,1)";
    pracImgContext.lineJoin = pracImgContext.lineCap = "round";
    pracImgContext.shadowBlur = 3;
    pracImgContext.shadowColor = "rgba(0,0,0,1)";
    pracImgContext.lineWidth =  windowRatioCorrection * 4;
    // Destination-out is like the erase property
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

  // Whenever we mousedown do 3 things:
  // Call addClick()
  // Call redraw()
  // Call clearFog()
  $('#pracImgCanvas').mousedown(function(e){
    var mouseX = e.pageX - this.offsetLeft,
        mouseY = e.pageY - this.offsetTop;

    isTracking = true;
    paint = true;
    addClick(e.pageX, e.pageY);
    redraw();

    // For the slow clearing...
    var timers = [],
        secondsStart = 1000,
        secondsInc = 20,
        reduceRadius = 0,
        opacityInc = 0.0;

    // create an array that the timer will check at a set interval
    // the array will have times in advance created by the Date() + some amount of seconds and the amount to decrease the radius
    // This method was used because of the way async works - it had prevented us from calling the clear fog function in a for loop
    for (var i = 0; i < 11; i++) {
      for(var j = (aa/2) ; j > 2; j = j - 1) {
        secondsStart += secondsInc
        timers.push([ new Date( ( new Date() ).getTime() + secondsStart ), j]);
      }
    }

    // set and run an interval that calls the clear fog
    timer = setInterval( clearFog, 20 );

    // This will slowly clear the whole canvas, as if the total fog was fading away into memory...
    function clearFog() {
        // check if times array is empty, when try and executes block of code, array will shift (dequeue)
      if( timers.length ) {
        // check if the first row is equal to or less than the current time ... run
        if ( parseInt( timers[0][0].getTime() / 1000 ) <= parseInt( new Date().getTime() / 1000 ) ) {
            // draw an arc with only an outline of destination-out that will erase with opacity
            pracImgContext.beginPath();
            pracImgContext.globalCompositeOperation = "destination-out";
            pracImgContext.lineWidth = 1;
            pracImgContext.globalAlpha = 0.036;
            pracImgContext.arc(aa/2, vp/2, timers[0][1], 0, 2*Math.PI);
            pracImgContext.stroke();
            // remove this row from the array so it will check the next date in the array
            timers.shift();
        }
      } else {
        // when array is empty, remove interval to stop the background process
        clearInterval( timer );
      }
    }
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
  }); 


}); // end!!!
