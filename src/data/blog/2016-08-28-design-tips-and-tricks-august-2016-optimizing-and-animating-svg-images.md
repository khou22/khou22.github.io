---
title: "Design Tips and Tricks August 2016: Optimizing and Animating SVG Images"
author: "Kevin Hou"
date: 2016-08-28 18:46:35
description: "My notes from an online seminar I tuned into that describes how to create and animate SVG images."
image: "/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [graphicDesign, userExperience, userInterface, tutorial]
featured: false
---
### Overview

- Codepen is useful for rapid SVG development
- SVG's are really just markdown and can be manipulated as a chunk/contained element, or individual shapes

### Good Practices

- Good practice to name your shapes different things in Sketch — prevents styling issues if some had the same IDs
- Good practice to ungroup the SVG
- SVG doesn't really use shadows — generally stay away from them
- SVG's support consistent radiuses, but do not support individual points having different radius's in the same shape. If you want this, you have to flatten the shape into a path

### Optimizing SVGs

- Sketch and other vector generators generate a lot of extraneous text. Use SVGEditor online to optimize SVGs and remove the extra Sketch attributes, round decimal points to make the file smaller. Can also get rid of the artboard page tag.
- Group elements in the SVG in a `<g>` element so that you can apply classes

### Types of Animations

- Can modify the SVG however you’d like using CSS — 2D transform, scale, rotate, skew (shears them), motion path (moving along a non-linear path), morphing (changing the actual shape itself. Same shape, but different appearance), line drawing (can draw closed SVG paths), clipping and masking
- Most basic: animate styling
- Advanced: filters, effects, distortions
- Looping animations, constantly doing its own thing
- Dynamic, animating based on some parameter
- Interaction, animate based on interaction — so delightful

### Design Tips

- Avoid the technical limitations, forget the CSS, etc.
- What would it make you love?
- What is attention grabbing?
- What’s a clean subtle way of animating something?

### Animating Using CSS

- Create animations using CSS
- Good practice to make the container really big initially so that nothing ever gets cropped
- Change the SVG tag ID to classes. So it’s better compatible with CSS.
- Good to put this in the beginning so you can see what’s going on:
  ```css
  svg {
    transform-origin: top left;
    transform: scale(2);
  }
  ```
- When rotating: transform: rotate(27deg), remember SVGs have their own coordinate system. Make sure you set transform-origin: center. Transform-origin is a very finicky system. It’s best to use:
  ```css
  transform-origin: 50% 50% instead of transform-origin: center
  ```
- If you want to transform around a specific point, set the transform-origin to that point. Best practice to use pixels so that older browsers can understand it.
- Can group elements together in css by doing:
  ```css
    class1, class2, class3 {
      ...
    }
  ```

**Ways of Applying Animations**

- Use the transition: 1s; property to animate a hover style change. You can also use Javascript to apply a class if you don’t wanna use the hover state. Can use @keyframes
- Makes animations very easy so that you’re just declaring the default style and the end style on hover. CSS automatically animates the transition.
- Create custom timing functions using cubic-bezier.com
- Transition: .8s cubic-bezier(.85, .02, .3, .82);

### Resources

Video tutorial: <https://www.creativelive.com/courses/icon-design-with-sketch-peter-nowell#class-info>  
Simple example: <https://codepen.io/pnowell/pen/wMYjZN>  

**Complex examples:**  
Many complex types of animations: <https://codepen.io/pnowell/pen/QyZVro>  
Line drawing animations: <https://css-tricks.com/svg-line-animation-works/>  
Morphing: <http://codepen.io/chriscoyier/pen/DpFfE>  

**Tools mentioned:**  
<https://cubic-bezier.com>  
<https://petercollingridge.appspot.com/svg-editor>  

**Animations in Swift**  
Tangential side note: How to create a really cool Uber-style splash screen animation on iOS: <https://www.raywenderlich.com/133224/how-to-create-an-uber-splash-screen?utm_campaign=iOS+Dev+Weekly>
