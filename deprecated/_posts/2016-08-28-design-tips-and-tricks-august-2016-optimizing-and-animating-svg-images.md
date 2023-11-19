---
layout: post
title: "Design Tips and Tricks August 2016: Optimizing and Animating SVG Images"
author: "Kevin Hou"
date: 2016-08-28 18:46:35
description: "My notes from an online seminar I tuned into that describes how to create and animate SVG images."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: design
tags: [graphicDesign, userExperience, userInterface, tutorial]
featured: "no"
---
<h3 class="post-subheader">Overview</h3>
<ul>
  <li>Codepen is useful for rapid SVG development</li>
  <li>SVG's are really just markdown and can be manipulated as a chunk/contained element, or individual shapes</li>
</ul>

<h3 class="post-subheader">Good Practices</h3>
<ul>
  <li>Good practice to name your shapes different things in Sketch — prevents styling issues if some had the same IDs</li>
  <li>Good practice to ungroup the SVG</li>
  <li>SVG doesn't really use shadows — generally stay away from them</li>
  <li>SVG's support consistent radiuses, but do not support individual points having different radius's in the same shape. If you want this, you have to flatten the shape into a path</li>
</ul>

<h3 class="post-subheader">Optimizing SVGs</h3>
<ul>
  <li>Sketch and other vector generators generate a lot of extraneous text. Use SVGEditor online to optimize SVGs and remove the extra Sketch attributes, round decimal points to make the file smaller. Can also get rid of the artboard page tag.</li>
  <li>Group elements in the SVG a <g> element so that you can apply classes</li>
</ul>

<h3 class="post-subheader">Types of Animations</h3>
<ul>
  <li>Can modify the SVG however you’d like using CSS — 2D transform, scale, rotate, skew (shears them), motion path (moving along a non-linear path), morphing (changing the actual shape itself. Same shape, but different appearance), line drawing (can draw closed SVG paths), clipping and masking</li>
  <br>
  <li>Most basic: animate styling</li>
  <li>Advanced: filters, effects, distortions</li>
  <br>
  <li>Looping animations, constantly doing its own thing</li>
  <li>Dynamic, animating based on some parameter</li>
  <li>Interaction, animate based on interaction — so delightful</li>
</ul>

<h3 class="post-subheader">Design Tips</h3>
<ul>
  <li>Avoid the technical limitations, forget the CSS, etc.</li>
  <li>What would it make you love?</li>
  <li>What is attention grabbing?</li>
  <li>What’s a clean subtle way of animating something?</li>
</ul>

<h3 class="post-subheader">Animating Using CSS</h3>
<ul>
  <li>Create animations using CSS</li>
  <li>Good practice to make the container really big initially so that nothing ever gets cropped</li>
  <li>Change the SVG tag ID to classes. So it’s better compatible with CSS.</li>
  <li>Good to put this in the beginning so you can see what’s going on:
    {% highlight css %}
    svg {
      transform-origin: top left;
      transform: scale(2);
    }
    {% endhighlight %}
  </li>
  <br>
  <li>When rotating: transform: rotate(27deg), remember SVGs have their own coordinate system. Make sure you set transform-origin: center. Transform-origin is a very finicky system. It’s best to use:
    {% highlight css %}
    transform-origin: 50% 50% instead of transform-origin: center
    {% endhighlight %}
  </li>
  <li>If you want to transform around a specific point, set the transform-origin to that point. Best practice to use pixels so that older browsers can understand it.</li>
  <br>
  <li>Can group elements together in css by doing:
    {% highlight css %}
      class1, class2, class3 {
        ...
      }
    {% endhighlight %}
  </li>
</ul>

<b>Ways of Applying Animations</b>
<li>Use the transition: 1s; property to animate a hover style change. You can also use Javascript to apply a class if you don’t wanna use the hover state. Can use @keyframes</li>
<br>
<li>Makes animations very easy so that you’re just declaring the default style and the end style on hover. CSS automatically animates the transition.</li>
<br>
<li>Create custom timing functions using cubic-bezier.com</li>
<li>Transition: .8s cubic-bezier(.85, .02, .3, .82);</li>

<h3 class="post-subheader">Resources</h3>
Video tutorial: <a href="https://www.creativelive.com/courses/icon-design-with-sketch-peter-nowell#class-info" target="_blank">https://www.creativelive.com/courses/icon-design-with-sketch-peter-nowell#class-info</a><br>
Simple example: <a href="https://codepen.io/pnowell/pen/wMYjZN" target="_blank">https://codepen.io/pnowell/pen/wMYjZN</a><br>
<br>
<b>Complex examples:</b><br>
Many complex types of animations: <a href="https://codepen.io/pnowell/pen/QyZVro" target="_blank">https://codepen.io/pnowell/pen/QyZVro</a><br>
Line drawing animations: <a href="https://css-tricks.com/svg-line-animation-works/" target="_blank">https://css-tricks.com/svg-line-animation-works/</a><br>
Morphing: <a href="http://codepen.io/chriscoyier/pen/DpFfE" target="_blank">http://codepen.io/chriscoyier/pen/DpFfE</a><br>
<br>
<b>Tools mentioned:</b><br>
<a href="cubic-bezier.com" target="_blank">cubic-bezier.com</a><br>
<a href="https://petercollingridge.appspot.com/svg-editor" target="_blank">https://petercollingridge.appspot.com/svg-editor</a><br>
<br>
<b>Animations in Swift</b><br>
Tangential side note: How to create a really cool Uber-style splash screen animation on iOS: <a href="https://www.raywenderlich.com/133224/how-to-create-an-uber-splash-screen?utm_campaign=iOS+Dev+Weekly" target="_blank">https://www.raywenderlich.com/133224/how-to-create-an-uber-splash-screen?utm_campaign=iOS+Dev+Weekly</a>
