---
layout: post
title: "CSS Filters and Effects"
author: "Kevin Hou"
date: 2015-08-17 15:03:23
description: "How to use CSS3 animations to apply filters on images or divs."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: web
tags: [reactjs, css]
featured: "no"
---

Since most of the site (as of now) does not use Bootstrap as a default style tool, I've been doing a lot of custom CSS from scratch. My landing page is meant to mimic a sheet of glass with a semi-transparent background and border. Here's some quick and simple CSS that can turn any div into a piece of glass. I've found that it works well for modals and elements that you want to give an extra emphasis on:

{% highlight css %}
.glass {
  background-color: rgba(255, 255, 255, .2);
  border-bottom: 2px solid;
  border-bottom-color: #ccc;
  border-bottom-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}
{% endhighlight %}

This setup can easily be customized by changing the values of the background-color, border-color, etc. For example, my component background is not actually transparent white. My white text was a little too hard to see against the white background, so I changed it to have a tint of grey:
{% highlight css %}
background-color: rgba(100, 100, 100, .2);
{% endhighlight %}

<hr />

Another cool CSS3 trick is to apply filters on images. This is similar to iPhone filters or filters you would see on Instagram. Here's an example of a greyscale filter with a blur. I was originally planning on using this for my landing page, but I ended up scrapping the idea because I liked seeing the vibrant colors of my pictures, especially the woodworking ones.

Simply apply this to your CSS class:
{% highlight css %}
-webkit-filter: grayscale(0.5) blur(10px);
{% endhighlight %}

or as an inline style using ReactJS:
{% highlight javascript %}
var backgroundBlur = {
  WebkitFilter: 'grayscale(0.5) blur(7px)'
} //As an inline style - syntax
{% endhighlight %}

Hope this helps.
