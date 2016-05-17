
/*
todo
-  fix the offset of caption and axisLabels based on size of font. Or else leave caption and axis labels up to user?
- what happens to event listeners when simpleplots are refreshed? add a way to just update data?
*/

var simpleplot = function (canvas, arr, customOptions) {

  var canvasHoverObjects = [];   // keep track of drawn objects
  var arrString = [];
  var ctx=canvas.getContext('2d');

  var defaultOptions = {
    plotType : '',
    font: 'bold 14px Arial',
    //xAxisLabel : null,
    //yAxisLabel : null,
    xStart: 10,
    yStart: canvas.height-10,
    width: canvas.width-20,
    height: canvas.height-20,
    numPoints: arr.length,
    displayAxes:false,
    axes : {
      color : '#888',
      thickness : 2
    },
    displayCaption : false,
    caption : {
      text : '',
      color : '#888'
    },
    displayPoints : true,
    points : {
      color: '#0c0',
      radius : 6
    },
    displayLines : true,
    lines : {
      color: '#888',
      thickness: 6
    },
    displayValues:false,
    values : {
      color : '#444',
      formatValuesFunction : undefined
    },
    enableTargetLine : false,
    target : {
      value : undefined,
      lineColor : '#444',
      lineWidth : 2,
      colorOverTarget : '#0c0',
      colorUnderTarget : '#f00',
      formatTargetValueFunction : undefined
    },
    enableHover : true,
    hover : {
      color:'yellow',
      formatHoverInfoFunction : undefined
    }
  };

	var options = {};

  var init = function () {
    // merge user options into default options
		for (var o in defaultOptions) {
			if (defaultOptions.hasOwnProperty(o)) {
				options[o] = customOptions && typeof(customOptions[o]) !== 'undefined' ? customOptions[o] : defaultOptions[o];
				if (typeof(options[o]) === 'function') {
					options[o] = options[o].bind(this);
				}
			}
		}

    var T = options.width/options.numPoints; // step size x in pixels
    var x = options.xStart;
    var y = options.yStart;
    var w = options.width;
    var h = options.height;
    if (options.font != undefined) ctx.font = options.font;

    ctx.lineJoin = 'round';
    // Plot axes
    if (options.displayAxes) {
      ctx.strokeStyle = options.axes.color;
      ctx.lineWidth = options.axes.thickness;
      ctx.beginPath();
      ctx.moveTo(options.xStart,options.yStart-h);
      ctx.lineTo(options.xStart,options.yStart);
      ctx.lineTo(options.xStart + w, options.yStart);
      ctx.stroke();
    }
    if (options.target.value === undefined) {
      options.enableTargetLine = false;
    }
    // Scale the array to the plot height
    var max = Math.max.apply(Math,arr);
    if (options.enableTargetLine && options.target.value > max) {
      max = options.target.value;
    }
    var min = 0;
    var arrScaled = [];
    for (var i=0; i < arr.length; i++) {
      arrScaled[i] = (h*(arr[i]-min)/(max-min));
    }
    // Draw caption
    if (options.displayCaption) {
      ctx.fillStyle = options.caption.color;
      ctx.fillText(options.caption.text,options.xStart,options.yStart+10);
    }
    // Build text to display
    for (i = 0; i < arr.length; i++) {
      if (typeof(options.values.formatValuesFunction) == "function") {
        arrString[i] = options.values.formatValuesFunction(arr[i])
      }
      else {
        arrString[i] = arr[i].toString();
      }
    }
    // Plot data
    ctx.strokeStyle = options.lines.color;
    ctx.lineWidth = options.lines.thickness;
    ctx.beginPath();
    ctx.moveTo(options.xStart +T*0,  y - arrScaled[0]);
    // Plot lines
    if (options.displayLines) {
      for (i = 0; i < arr.length; i++) {
        if (options.plotType.indexOf("bar")>=0)
          ctx.moveTo(options.xStart +T*i,  y); // draw line from y-axis (bar chart)
        ctx.lineTo(options.xStart +T*i,  y - arrScaled[i]); // draw line from last data point to this data point
        ctx.stroke();
        if(options.displayValues) {
          ctx.fillStyle = options.values.color;
          if (options.plotType.indexOf("bar")>=0)
            ctx.fillText(arrString[i],options.xStart+T*i-options.lines.thickness/2,y - arrScaled[i]);
          else
            ctx.fillText(arrString[i],options.xStart+T*i+options.points.radius,y - arrScaled[i]);
          ctx.fill();
        }
      }
    }
    // plot data points
    if (options.displayPoints) {
      for (i = 0; i < arr.length; i++) {
        if (options.enableTargetLine){
          if (arr[i] > options.target.value) {
            ctx.fillStyle = options.target.colorOverTarget;
          }
          else {
            ctx.fillStyle = options.target.colorUnderTarget;
          }
        }
        else {
          ctx.fillStyle = options.points.color;
        }
        ctx.moveTo(options.xStart +T*i+options.points.radius,  y - arrScaled[i]);
        ctx.beginPath();
        ctx.arc(options.xStart+T*i,  y - arrScaled[i], options.points.radius, 0, 2 * Math.PI);
        ctx.fill();
        // build up array of drawn objects with position and value information
        if (typeof(options.hover.formatHoverInfoFunction) == "function") {
          var hoverText = options.hover.formatHoverInfoFunction(i,arr[i]);
        }
        else {
          var hoverText = "x="+i+", y="+arrString[i]
        }
        canvasHoverObjects[i] = {x:options.xStart+T*i, y:y-arrScaled[i], w:options.points.radius, h:options.points.radius, value:hoverText}
      }
    }
    if (options.enableTargetLine) {
      var scaledTargetValue = (h*(options.target.value-min)/(max-min));
      ctx.strokeStyle = options.target.lineColor;
      ctx.lineWidth = options.target.lineWidth;
      ctx.moveTo(options.xStart,  y - scaledTargetValue);
      ctx.lineTo(options.xStart + w,  y - scaledTargetValue);
      if (typeof(options.target.formatTargetValueFunction) == "function") {
        var targetValueString = options.target.formatTargetValueFunction(options.target.value);
      }
      else {
        var targetValueString = options.target.value;
      }
      ctx.fillStyle = options.values.color;
      ctx.fillText(targetValueString, options.xStart + w - 30,  y - scaledTargetValue - 10);
      ctx.stroke();
    }
    // add event listener for mouse hover over data points
    if (options.enableHover){
      var imageOriginal = ctx.getImageData(0,0,canvas.width, canvas.height);
      canvas.addEventListener("mousemove", function (event) {
        if (canvasHoverObjects == null)
          return;
        var cursorOnObject = false;
        for (var i=0; i<canvasHoverObjects.length; i++)
        {
          if (event.layerX > (canvasHoverObjects[i].x-canvasHoverObjects[i].w) && event.layerX < (canvasHoverObjects[i].x + canvasHoverObjects[i].w))
          {
            if (event.layerY > (canvasHoverObjects[i].y-canvasHoverObjects[i].h) && event.layerY < (canvasHoverObjects[i].y + canvasHoverObjects[i].h))
            {
              cursorOnObject = true;
              ctx.putImageData(imageOriginal,0,0);
              ctx.fillStyle = options.values.color;
              ctx.fillText(canvasHoverObjects[i].value,canvasHoverObjects[i].x,canvasHoverObjects[i].y-10);
              ctx.fillStyle = options.hover.color;
              ctx.beginPath();
              ctx.moveTo(canvasHoverObjects[i].x, canvasHoverObjects[i].y);
              ctx.arc(canvasHoverObjects[i].x, canvasHoverObjects[i].y, canvasHoverObjects[i].w, 0, 2 * Math.PI); // draw circle
              ctx.fill();
            }
          }
        }
        if (cursorOnObject == false)
          ctx.putImageData(imageOriginal,0,0);
      });
    }
  }
  init();
}
