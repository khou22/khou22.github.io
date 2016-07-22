---
layout: post
title: "React Lifecycle Event: componentWillReceiveProps"
author: "Kevin Hou"
date: 2015-08-03 23:39:39
description: "An overview of one of ReactJS's useful lifecycle events: componentWillReceiveProps"
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: programming
tags: [reactjs]
featured: "no"
---
I discovered a pretty useful lifecycle event in React. I've typically only stuck to getInitialState, componentWillMount, and Render, but I jsut discovered componentWillReceiveProps.
<br/>
<br/>
This essentially gets called every time the component will receive a new or updated prop. This is really useful when you want to set a state equal to prop more than once in its lifecycle. The syntax is:
{% highlight javascript %}
componentWillReceiveProps(props) {
  ...
}
{% endhighlight %}
 
Try this out when you can! It's really useful.
