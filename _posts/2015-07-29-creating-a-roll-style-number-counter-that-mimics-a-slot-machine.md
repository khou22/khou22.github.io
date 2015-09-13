---
layout: post
title: "Creating a Roll Style Number Counter that Mimics a Slot Machine"
author: "Kevin Hou"
author: 2015-7-29 20:55:41
description: ""
category: Programming
tags: [javascript, reactjs]
featured: "yes"
---
I found a really cool way of making a number counter engaging. A co-worker at Salesforce, named Amy Lee, created a simple React component designed to mimic a slot machine. Instead of simply changing the number, the function "animates" the change and rolls up to that number. The cool thing about this is that it works for any number and it requires no CSS3 animation. It looks neat, especially with huge numbers!
 
Calling Component:
{% highlight html %}
<AnimatedNumber number={this.state.number} time={300} frameRate={20}/>
//Total time: 300ms
//One frame every 20 ms
{% endhighlight %}
 
Component:
{% highlight javascript %}
const AnimatedNumber = React.createClass({
  getInitialState() {
    return {
      number: this.props.number
    }
  },
  componentWillReceiveProps(props) {
    if (this.state.number !== props.number) { //If different number
      if (this._interval) { //If theres an interval
        clearInterval(this._interval) //Clear the existing interval
      }
      let framesLeft = this.props.time/this.props.frameRate; //Determine frame rate
      let increment = (props.number - this.state.number)/(framesLeft + 1); //Determine increment per frame
      this._interval = setInterval(() => {
        if (framesLeft > 0) { //If there are frames
          this.setState({ number: this.state.number + increment }); //Set new number
          framesLeft--; //Subtract a frame
        } else { //If done
          clearInterval(this._interval); //Clear the interval
          this._interval = null; //Set to null
          this.setState({ number: props.number }); //Set the final value to the exact value just in case
        }
      }, this.props.frameRate); //How often it repeats
    }
  },
  render() {
    return (
      <span>
        {Math.round(this.state.number)} //Round if you don't want a decimal
      </span>
    )
  }
});
{% endhighlight %}