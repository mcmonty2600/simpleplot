## simpleplot
Javascript module to create simple plots. Optionally add a threshold line; points above the threshold can be colored differently than below.

Sample implemenations: http://mcmonty2600.github.io/simpleplot/

### Details

Create a simple data plot by passing in a canvas element and an array of numbers. 

<script>
  data = [2,3,5,4,1,8,7]];
  simpleplot(c3, data);
</script>

### Configuration 

Each simpleplot instance can be customized by passing in configuration parameters to overwrite default values.

| Config Option | Type | Default | Description |
| ------------- | ----------- | ------------- | ------------- |
| plotType | string | 'bar' | A string to describe plot type. Currently only 'bar' and 'default' are supported |
