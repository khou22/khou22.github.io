---
title: "TheaterJS: How to Add and Use Javascript Libraries"
author: "Kevin Hou"
date: 2015-11-29 21:17:51
description: "A simple tutorial on how to use Javascript libraries in your web apps. I will be using TheaterJS as an example library."
image: "https://khou22.github.io/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [javascript]
featured: false
---

I am working on getting some neat, open-source Javascript libraries ported into my website. I'm trying to teach myself how to incorporate the pleathorea of user contributed libraries into my site. Over the summer, I taught myself how to use NPM dependencies — elegeant packages of Javascript code that would perform preset functions. With the millions of NPM packages out there, I wanted to use it in my own site.

Unfortunately, I haven't been able to build a compiler that would allow me to use NPM dependencies in my code. I'm still interested in using other people's code in my apps so I've resorted to Javascript libraries. I came across a really cool one called [TheaterJS](https://github.com/Zhouzi/TheaterJS). Here's a quick [demo](http://codepen.io/Zhouzi/pen/JoRazP).

Turns out, the steps to import Javascript libraries are very straightforward and simple.

1. Download the [library](https://github.com/Zhouzi/TheaterJS/releases)
2. Move the file into your source code. It doesn't matter where.
3. Link the '.min.js' file in the `<head>` of your HTML file like so:

```html
<script src="path/to/library/TheaterJS-2.0.1/dist/theater.min.js"></script> <!-- TheaterJS -->
```

4. Now you can use the library by calling the functions defined in the documentation. TheaterJS mimics a human chat transcript. An actual demo can be found on my [landing page](http://khou22.github.io). Here's how to use TheaterJS's functions (this is the actual code I used on my landing page):

```javascript
theater
  .addActor('kevin', { speed: 0.6, accuracy: 0.7 })
  .addScene('kevin:Kevin Hou', 2000)
  .addScene('kevin:Welcome!', 1000)
  .addScene('kevin:Kevin Hou', 2000)
  .addScene(theater.replay.bind(theater))
```

Hope this helped!
