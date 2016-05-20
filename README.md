## simpleplot
Javascript module to create simple interactive plots. 
Optionally add a threshold line; points above the threshold can be colored differently than below. This is useful if you want to indicate which datapoints reach a certain target level (e.g., how many push-ups you performed per day)

Sample implemenations: http://mcmonty2600.github.io/simpleplot/

### Screenshots

![image failed to load](screenshots/plot1.PNG "An example with two plot types superimposed on same canvas")
![image failed to load](screenshots/plot2.PNG "An example with a threshold line")

### Basic Example

In the simplest case, a data plot is created by passing in a canvas element and an array of numbers, without additional configuration parameters 
```
<script>
  data = [2,3,5,4,1,8,7]];
  simpleplot(c3, data);
</script>
```
![image failed to load](screenshots/plot_plain.PNG "basic plot without parameters and no canvas formatting")

### Configuration 

Each simpleplot istance can be customized by passing in configuration parameters to overwrite default values.

| Parameter | Default | Description |
| ------------- | ------------- | ------------- |
| plotType | '' | A string to describe plot type. Currently only 'bar' and '' (default) are supported |
| font     | 'bold 14px Arial' | font string |
| xStart   | 10               | x start location with respect to canvas element |
| yStart   | canvas.height-10 | y start location with respect to canvas element |
| width    | canvas.width-20  | width in pixels  |
| height   | canvas.height-20 | height in pixels |
| numPoints | array length | number of points to plot (can be greater than length of array) |
| axes | object | object with color and line thickness of axes, default: ```{enable : false, color : '#888', thickness : 2}``` |
| caption | object | object with text and text color, default: ```{enable : false, text : '', textColor : '#888'},``` |
| points | object | ```{enable : true, color: '#0c0', radius : 6}``` |
| lines | object | ```{enable : true, color: '#888', thickness: 6}``` |
| values | object | ```{enable : false, textColor : '#888', formatValuesFunction : undefined}``` |
