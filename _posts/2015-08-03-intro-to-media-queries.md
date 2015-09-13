---
layout: post
title: "Intro to Media Queries"
author: "Kevin Hou"
date: 2015-08-03 14:17:25
description: "A quick overview of media queries"
category: Programming
tags: [css, html]
featured: "no"
---
I just met with Brandon, from the UX Engineering department, to figure out font sizing using media queries. Media queries are essentially ways of setting thresholds within the CSS to change fonts, widths, etc. based off a given criteria.
<br />
<br />
Here's an example I used:
{% highlight CSS %}
@media (min-width: 640px) {
    font-size: 1.1rem;
};
   @media (min-width: 1024px) {
    font-size: 1.3rem;
};
{% endhighlight %}

The code above essentially takes in a criteria, in this case the width, and changes the font size accordingly. It triggers the CSS nested within the media query and applies it if the criteria is met. This block of code goes within the class like so:

{% highlight CSS %}
.className {
  ...
  @media (...) {
    ...
  }
}
{% endhighlight %}

This is very helpful when dealing with mobile, desktop, tablet, etc. users.