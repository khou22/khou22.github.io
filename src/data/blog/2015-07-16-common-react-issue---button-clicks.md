---
title: "Common React Issue - Button Clicks"
author: "Kevin Hou"
date:   2015-07-16 13:10:57
description: "Common React Issue - Button Clicks"
image: "/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [reactjs, javascript]
archived: true
---
*Historical Note: The code examples in this 2015 post target early React versions. They rely on the legacy `React.createClass` syntax and deprecated state initialization paradigms like `getInitialState` (both deprecated in version 15.5 and removed in 16.0). For modern applications, write functional components leveraging standard React Hooks such as `useState`.*

I've started to get the hang of **React** and **ES6**, but it's only been three weeks and there are of course tons and tons of things I haven't learned yet. I'll go over a couple of things that I think anyone starting to learn React could benefit from. In this blog post I'll go over Button Clicks.

React works differently from plain old Vanilla Javascript in a couple of ways. One of which is the modular structure of the code. Each module has functions within it that can be accessed only by that specific module.

You might be encountering a couple errors:

1. onClick function triggering when button loads
2. The onClick function doesn't recognize the function its supposed to trigger
3. The function refreshes the page
4. You can't pass parameters into the function
See the corresponding number below for potential solutions and explanations.

### 1. Prevent onClick from automatically running
The reason it automatically runs is because you are triggering the function when referencing it. Your code may look like this:

```javascript
<button onClick={this.buttonClick()}>Button</button>
```

The parentheses indicate that the function should be executed. When the page loads, it sees the parenthesis and runs the corresponding function. To fix the issue, simply remove the parenthesis. To pass parameters in, see the section below.

### 2. Force onClick to recognize function
Use `.bind(this)` at the end of `{this.buttonClick}`.
See example below.

### 3. Prevent Auto-Refresh
Simply use the: preventDefault() function

```javascript
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
```


### 4. Passing Parameters
Add the parameters in the .bind(this) as seen below

```javascript
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
```
