---
layout: post
title: "React: Passing Information from Child to Parent while Mapping JSON Data"
author: "Kevin Hou"
date:   2015-07-20 15:43:23
description: ""
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: Programming
tags: [reactjs, salesforce, javascript, html, es6]
featured: "no"
---
I've had a lot of issues in the past week trying to figure out how to pass information from the child component to the parent component while mapping JSON data.
 
Here's what it looks like to pass information from the child component to the parent component:
{% highlight javascript %}
module.exports = React.createClass({
  handleClick(number) {
    ... //This runs when the child component clicks. Parent component now has access to Child component variable, 'number'
  },
  render() {
    return (
      <Child handleClick={this.handleClick} />
    )
  }
});
 
const Child = React.createClass({
  render() {
    return (
      <button onClick={this.props.handleClick.bind(this, number)}>Click me</button>
  )
});
{% endhighlight %}
 
Here's what it looks like to map a JSON object:
{% highlight javascript %}
var contactNodes = this.props.contacts.map(function (contact) {
    var firstName = contact.firstName.toUpperCase();
    var lastName = contact.lastName.toUpperCase();
    var found = firstName.includes(str) + lastName.includes(str);
    return (
      <h1>{firstName} {lastName}</h1>
    );
  }
});
{% endhighlight %}
 
Unfortunately, it's difficult to combine these two things because when using "this.handleClick", "this" refers to the current object it is in. When you map data, "this" refers to contactNodes, not the component; therefore, you cannot refer to a function while mapping JSON data. I finally figured out a simple way around this issue. Instead of including all my HTML in the return while mapping, I used the map function to set states. Then I passed those states into the components in the regular render() function. This allowed me to use functions because the "this" would refer to the correct object.
 
Example:
{% highlight javascript %}
module.exports = React.createClass({
  getInitialState() {
    return {
      str: this.props.data.map(function (data) {return ( data.type )}),
    }
  },
  handleClick() {
    console.log("Click")
  },
  render() {
    return (
        <GameAnswerChoices handleClick={this.handleClick} string={this.state.str}/>
    );
  }
});
{% endhighlight %}