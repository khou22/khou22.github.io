---
layout: post
title: "Common React Issue - Button Clicks"
author: "Kevin Hou"
date:   2015-07-16 13:10:57
description: ""
category: Programming
tags: [salesforce, reactjs, javavscript]
featured: "no"
---
I've started to get the hang of <b>React</b> and <b>ES6</b>, but it's only been three weeks and there are of course tons and tons of things I haven't learned yet. I'll go over a couple of things that I think anyone starting to learn React could benefit from. In this blog post I'll go over Button Clicks.
 
React works differently from plain old Vanilla Javascript in a couple of ways. One of which is the modular structure of the code. Each module has functions within it that can be accessed only by that specific module.
 
You might be encountering a couple errors:
<ol>
  <li>onClick function triggering when button loads</li>
  <li>The onClick function doesn't recognize the function its supposed to trigger</li>
  <li>The function refreshes the page</li>
  <li>You can't pass parameters into the function</li>
</ol>
See the corresponding number below for potential solutions and explanations.

<hr />
<br />

<h4>1. Prevent onClick from automatically running</h4>
The reason it automatically runs is because you are triggering the function when referencing it. Your code may look like this:

{% highlight javascript %}
<button onClick={this.buttonClick()}>Button</button>
{% endhighlight %}

The parentheses indicate that the function should be executed. When the page loads, it sees the parenthesis and runs the corresponding function. To fix the issue, simply remove the parenthesis. To pass parameters in, see the section below.

<h4>2. Force onClick to recognize function</h4>
Use
{% highlight javascript %}.bind(this){% endhighlight %}
at the end of
{% highlight javascript %}{this.buttonClick}{% endhighlight %}
See example below.
 
<h4>3. Prevent Auto-Refresh</h4>
Simply use the: preventDefault() function

{% highlight javascript %}
module.exports = React.createClass({
  buttonClick(e) {
    e.preventDefault(); //Prevents auto refresh
  },
  render() {
    return(
      <button onClick={this.buttonClick.bind(this)}>Button</button>
    )
  }
});
{% endhighlight %}
 
 
<h4>4. Passing Parameters</h4>
Add the parameters in the .bind(this) as seen below

{% highlight javascript %}
module.exports = React.createClass({
  buttonClick(num) {
    console.log(num);
  },
  render() {
    return(
      <button onClick={this.buttonClick.bind(this, num)}>Button</button>
    )
  }
});
{% endhighlight %}