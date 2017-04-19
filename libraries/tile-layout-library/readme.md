/**************************************************************
* Name: Kevin Hou
* License: MIT
**************************************************************/

# Usage

## Include head
This library relies on ReactJS and Jquery so you must first include these in your <head>:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/JSXTransformer.js"></script>

<!-- Jquery -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
```

## Add grid data
This library accepts a JS object of this format:
```javascript
// Must be named 'gridData'
var gridData = {
  columns: 5, // Number of columns
  textColor: "white", // Tile text color
  data: [ // All tile data
    {
      title: "Title", // Title
      subtitle: "Subtitle...", // Subtitle
      description: "Lorem ipsum dolor sit amet...",
      image: "image.png", // Tile background image
      link: "#", // Link when click
      size: "1", // Number of horizontal blocks this tile will take up
      category: {
        label: "Category",
        color: "#FFFFFF"
      }
    },
    ... // Rest of tiles
  ]
};
```

You can either include a data.js file if you have a lot of data:
```html
<script src="data.js"></script>
```
or you can embed them in the <script> tag:
```html
<script>

</script>
```

## Include grid
It is important the gridData comes *before* you include the second script tag.
```html
<script src="data.js"></script>
<div id="grid"></div>
<script type="text/jsx;harmoney-true" src="tile-layout-library/main.js"></script>
```
