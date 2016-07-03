---
layout: post
title: "Clearing Timeouts and Intervals Before They Trigger"
author: "Kevin Hou"
date: 2015-07-31 21:10:15
description: ""
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: Programming
tags: [javascript]
featured: "no"
---
I've been working a lot with time and animation and one of the things that I had to overcome was preventing an existing timeout from triggering. I had already declared a timeout with setTimeout, but I wanted to cancel it midway.
<br />
<br />
My solution was to first declare an empty variable at the top of my React code. This line goes even before you create your class:

{% highlight JavaScript %}
var myTimeout;

module.export = React. createClass({
  ...
});
{% endhighlight %}
 
Next, I set my interval equal to a global variable like so:
{% highlight JavaScript %}
myTimeout = setTimeout(functionName(), 500);
{% endhighlight %}

My interval is now set to 'myTimeout' and because I declared this variable globally, it can be accessed at any scope. If I want to cancel my timeout before it has triggered I use the clearTimeout function:
{% highlight JavaScript %}
clearTimeout(myTimeout);
{% endhighlight %}
<br />
That's it! It's really simple. This works with intervals as well. Simply set the inveral globally using the same method as described above and clear the interval with clearInterval(myInterval).
 
Hope this helps!