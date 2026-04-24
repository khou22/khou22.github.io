---
title: "Setting a Background Image with HTML and CSS"
author: "Kevin Hou"
date: 2015-08-03 17:52:15
description: "Setting a Background Image with HTML and CSS"
image: "https://khou22.github.io/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [html, css]
featured: false
---
Here is how you set a background image to cover the entire screen using HTML and CSS. The image will adjust based on the size of your browser window. It's very useful and I figured I should make note of it here.


### HTML
```html
<div class="background">
</div>
```

### CSS
```css
.background {
    height: 100%;
    background-image: url("imageURL");
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;
    background-position: 50% 0%;
    position: relative;
    top: 0rem;
    bottom: 0rem;
    margin-top: 0rem;
}
```

The background-size trait is uniqe in that the values I used were either contain or cover. Cover will fill the entire div and will scale/zoom in order to accomplish that. Contain will fit the image to either the width or height, whichever is the limiting agent. The extra space will be filled with the background color.
