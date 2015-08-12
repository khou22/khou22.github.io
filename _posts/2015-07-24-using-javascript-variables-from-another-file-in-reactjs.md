---
layout: post
title: "Using Javascript Variables From Another File in ReactJS"
author: "Kevin Hou"
date:   2015-07-24 11:48:41
description: "How to import variables from another Javascript file"
category: programming
tags: [javascript, reactjs]
---
The project I've been working on requires data entry that isn't always easy to organize if they are kept locally in my React code. I've been declaring my data as a getInitialState() which is both inconvienient and messy. To work around this, I'm keeping my data in a seperate Javascript file called "file.js."

I keep my data in a JSON format, but as a string:

{% highlight javascript %}
var text = "Hello world!"; //In file.js
{% endhighlight %}

Below this line, I must export this variable so that it can be imported in the React code:

{% highlight javascript %}
module.exports = {data: text} //In file.js
{% endhighlight %}

I store my string as an object called "data." I then import the contents of "file.js" in my main "App.jsx" file:

{% highlight javascript %}
import file from './file.js'; //In App.jsx
{% endhighlight %}

The contents of the object I exported in the other file is being stored as the variable "file" here. I can then convert the contents of "file" to an object:

{% highlight javascript %}
var str = file.data; //"data" is the object within "file"
{% endhighlight %}

Convert this into a usable Javascript object:

{% highlight javascript %}
var finalData = JSON.parse(str);
{% endhighlight %}

Your string, "Hello world!", is now stored within the variable finalData.

Hope this helps!