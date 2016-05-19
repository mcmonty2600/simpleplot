## simpleplot
Javascript module to create simple plots. Optionally add a threshold line; points above the threshold can be colored differently than below. This is useful if you want to indicate which datapoints reach a certain target level (e.g., how many push-ups you performed per day)

Sample implemenations: http://mcmonty2600.github.io/simpleplot/

### Details

Create a simple data plot by passing in a canvas element and an array of numbers. 
```
<script>
  data = [2,3,5,4,1,8,7]];
  simpleplot(c3, data);
</script>
```
### Configuration 

Each simpleplot can be customized by passing in configuration parameters to overwrite default values.

| Parameter | Default | Description |
| ------------- | ------------- | ------------- |
| plotType | '' | A string to describe plot type. Currently only 'bar' and '' (default) are supported |
| font     | 'bold 14px Arial' | font string |
| xStart   | 10               | x start location with respect to canvas element |
| yStart   | canvas.height-10 | y start location with respect to canvas element |
| width    | canvas.width-20  | width in pixels  |
| numPoints | array length |
| displayAxes | false  |


| height   | integer | canvas.height-20 | height in pixels |
