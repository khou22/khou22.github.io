---
layout: post
title: "Quick, Short If/Then Statement"
author: "Kevin Hou"
date:   2015-07-21 14:32:00
description: "A quicker and faster way of writing if/then statements in javascript."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: web
tags: [javascript]
featured: "no"
---
As a lot of you guys know, a proper if/then statement looks like this:

{% highlight javascript %}
if (condition) {
  ...
} else {
  ...
}
{% endhighlight %}

Or something along those lines. If you want to set a value for a variable, it can take at least 6 lines of code. In a long file, adding 6 lines of code every time you want to set a variable based on an if-statement can make your code very messy. For example, to set a simple yes/no off of a boolean takes this:

{% highlight javascript %}
var str = "";
if (condition) {
  str = "yes";
} else {
  str = "no";
}
{% endhighlight %}

An <b>efficient, concise</b> alternative is to use this format condenses this code into one line:

{% highlight javascript %}
var str = condition == true ? "yes" : "no";
{% endhighlight %}

This is a very simple, easy trick to greatly increase the readabitlity of your code. Instead of having an incredibely long file with lots of short lines, you can work horizontally and make use of your horizontal realistate.

This method is particularly useful when you need many if-statements in a row. Hope this help!
