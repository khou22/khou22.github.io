---
title: "Clearing Timeouts and Intervals Before They Trigger"
author: "Kevin Hou"
date: 2015-07-31 21:10:15
description: "Clearing Timeouts and Intervals Before They Trigger"
image: "/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [javascript]
featured: false
---
I've been working a lot with time and animation and one of the things that I had to overcome was preventing an existing timeout from triggering. I had already declared a timeout with setTimeout, but I wanted to cancel it midway.
My solution was to first declare an empty variable at the top of my React code. This line goes even before you create your class:

```javascript
var myTimeout;

module.exports = React.createClass({
  ...
});
```

Next, I set my interval equal to a global variable like so:
```javascript
myTimeout = setTimeout(functionName, 500);
```

My interval is now set to 'myTimeout' and because I declared this variable globally, it can be accessed at any scope. If I want to cancel my timeout before it has triggered I use the clearTimeout function:
```javascript
clearTimeout(myTimeout);
```
That's it! It's really simple. This works with intervals as well. Simply set the inveral globally using the same method as described above and clear the interval with clearInterval(myInterval).

Hope this helps!
