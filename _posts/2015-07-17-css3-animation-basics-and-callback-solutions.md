---
layout: post
title: "CSS3 Animation Basics and Callback Solutions"
author: "Kevin Hou"
date:   2015-07-17 14:07:02
description: ""
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: Programming
tags: [css, css3, html, reactjs, javascript]
featured: "no"
---
I've been working wtih CSS3 animations lately, primarily to add motion and excitement to my project. I've played around with them and I've figured out the basics with entrances, exits, transitions, scaling, etc. The method that I've been doing is essentially using a state as a boolean. If a button is clicked, the state is toggled and the animation class is added onto the div container. It looks something like this (most of this code is courtesy of Seimith Suth):
 
React Code:
{% highlight javascript %}
module.exports = React.createClass({
  getInitialState() {
    return {
      animate: false
    }
  },
  buttonClick() {
    console.log(this.state)
    this.setState({
      animate: !this.state.animate
    })
  },
  render() {
    var className = this.state.animate ? "bump" : "";
    return (
      <div>
        <button onClick={this.buttonClick.bind(this)}>Button</button>
        <div className="animation">
          <div className={"truck " + className}>
            <img src="http://gearscrm.com/wp-content/uploads/2015/04/Summer-release-logo.png" />
          </div>
        </div>
      </div>
    )
  }
});
{% endhighlight %}

Sass (SCSS):
{% highlight css %}
@-webkit-keyframes bounce {
  0% {
    -webkit-transform: translateX(0px);
  }
  30% {
    -webkit-transform: translateX(50px);
  }
  60% {
    -webkit-transform: translateX(-45px);
  }
}
 
.animation {
  display: flex;
  position: fixed;
  /*top: 50%;
  left: 45%;*/
}
.animation .truck {
  width: 50px;
  height: 50px;
  opacity: 1;
  transform: scale(1);
  box-shadow: none;
  transition: all 300ms ease-in-out;
}
 
.animation .bump {
  /*Need webkit for codepen here for some reason*/
  -webkit-animation-name: bounce;
  -webkit-animation-iteration-count: 1;
  -webkit-animation-duration: 800ms;
}
{% endhighlight %}
 
The problem with this, is that the button simply toggles between true false. There is no ellegant way to set the state back to false after the animation is done. However, there are some alternatives:
 
1. In my opinion, the easier solution would be simply to use a setTimeout function to automatically run a function that sets the state as false after a given amount of time. SImply set the interval to be equal to or longer than the animation and it should work. Simple!
 
2. The second way is to use jQuery. I'm no expert on jQuery so I'll let Google do the work for me. I know a lot of people were posting about it so I figured there is a solution.
 
Hope this helped!