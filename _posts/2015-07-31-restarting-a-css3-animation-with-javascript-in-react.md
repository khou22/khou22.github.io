---
layout: post
title: "Restarting a CSS3 Animation with Javascript in React"
author: "Kevin Hou"
date: 2015-07-31 21:07:45
description: ""
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: Programming
tags: [css, css3, javascript, html]
featured: "no"
---
I've been working on animation in my project at Salesforce.com and I came across a challenge with animation. It's very easy to trigger animation using react props and states, but reseting animations are a different beast. In non-React Javascript, the solution would be:

{% highlight javascript %}
document.getElementById("tagID").classList.remove("animationClass")
document.getElementById("tagID").classList.add("animationClass")
{% endhighlight %}
 
This would essentially just remove the class and then re-add it, effectively creating a "new" animation and reseting the cycle. However, React outsmarts this and doesn't recognize the toggled class. To overcome this obstacle use a setTimeout to delay adding the class. After it has been removed for a few milliseconds, re-add it. Example:

{% highlight javascript %}
document.getElementById("tagID").classList.remove("animationClass")
setTimeout(function() {document.getElementById("tagID").classList.add("animationClass");}, 50);
{% endhighlight %}
 
This will outsmart react into thinking the animation was indeed removed. It will reset the animation before you start it again. Hope this helps!