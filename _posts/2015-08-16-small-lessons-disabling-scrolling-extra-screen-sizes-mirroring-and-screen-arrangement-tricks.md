---
layout: post
title: "Small Lessons: Disabling Scrolling, Extra Screen Sizes, Mirroring and Screen Arrangement Tricks"
author: "Kevin Hou"
date: 2015-08-16 11:29:33
description: "Quick tips, tricks, and features for developers both from a technical standpoint and productivity standpoint."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: programming
tags: [css, osx]
featured: "no"
---
I've been dealing with some really weirdly-sized images for my project and this have given me all sorts of issues in terms of scaling, cropping, and scrolling. There are many instances where I don't have any content off the screen, but there is still a side scroll. I've tried inspecting my elements to see which part of my code is responsible for the extra white space, but to no avail. I settled with just disabling the side scroll for this app. Here's how you do it:

{% highlight css %}
Simply add this to your CSS:
html, body {
  max-width: 100%;
  overflow-x: hidden;
}
{% endhighlight %}
<hr />
Another cool little Mac OSX tip that I learned this week was how to show hidden screen sizes/aspect ratios for monitors. If you hook up your monitor and go to the display prefernces, you should only see a few possible screen sizes. There's a trick to get more specific resolutions. Simply hold option when clicking on "Scaled." It works like a charm!
<br />
<hr />
<br />
You can also choose to mirror a select screen by holding option and dragging a screen over another screen in display arrangement system preferences. For example, you can have a 3 display setup with your third display mirroring your second display. You can still use your second display as an additional monitor, but your third display will now be mirroring your second.
<br />
<br />
It's cool to see what holding option does when clicking! Wonder what else Apple has hidden from us using the "option" key...
