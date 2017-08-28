---
layout: post
title: "CSS Tips and Tricks August 2017: Flexbox"
author: "Kevin Hou"
date: 2017-08-22 18:47:59
description: "A brief introduction to the world of flexbox — a powerful layout and alignment tool."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: web
tags: [css]
featured: "no"
---
## Introduction
I've been starting to work with CSS flexbox for one of my projects at work that has some very sophisticated alignment, spacing, sizing, and positioning specifications. It's heavy in animations and must respond dynamically to window dimension changes. One of my co-workers advised that I try out flexbox since it specializes in these types of properties.

This post will cover the main properties and what they do. For more information, here are some useful resources:  
1. [Flexbox guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)  
2. [Gamification to learn flexbox](http://www.flexboxdefense.com/)  
3. [Challenges that were solved with flexbox](https://philipwalton.github.io/solved-by-flexbox/)  

## Parent Properties

### Allowing Flexbox Properties
You must first specify that the div should respond to flex CSS properties by setting `display: flex` in the parent.


### Axis & Cross-Axis:
http://www.flexboxdefense.com/images/flexbox-column-a0e8dc099b07e1cfd6eaa6da2525cf54.png

``` css
.container {
    flex-direction: row | row-reverse | column | column-reverse;
}
```

### justify-content (cross-axis/horizontal spacing)
The `justify-content` property is a fancy way of saying horizontal alignment. You can align `flex-start` (left), `center` (center), `flex-end` (right), `space-between` (space items evenly using their widths), or `space-around` (space all items so that they have equal space between them).

``` css
.container {
    justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
}
```

### align-items (across cross-axis/vertical spacing)
The `align-items` property allows you position a container's items across its cross-axis — basically meaning vertically. There are three possible values: `flex-start` (top), `flex-end` (bottom), and `center` (vertically in the middle).

``` css
.container {
    align-items: flex-start | flex-end | center | baseline | stretch;
}
```

### flex-wrap
Can determine whetehr or not the children are capable of wrapping.
``` css
.container{
    flex-wrap: nowrap | wrap | wrap-reverse; /* default nowrap */
}
```

## Child Properties

### order (order of items)
This can be set to display the children in an order different from when they appear. It accepts an interger value as its parameter and they are all relative — that is, they do not need to be sequential. Making the first component `-10` and the second component `0` has no difference from making the first component `1` and the second component `2`.

``` css
.item {
    order: $integer;
}
```

### flex/flex-grow/flex-shrink (proportion they scale to fill their container)
This property describes the item's ability to scale and fill the container. Like `order`, the numbers are all relative so having an item with `flex: 1` (or `flex-shrink`/`flex-grow` if you want to set them independelty) will scale half the size of an item of the same parent with `flex: 2`. Negative numbers are not allowed.

``` css
.item {
    flex: $number; /* default is 0 */
    flex-grow: $number;
    flex-shrink: $number;
}
```
