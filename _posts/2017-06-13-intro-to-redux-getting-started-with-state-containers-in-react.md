---
layout: post
title: "Intro to Redux: Getting Started with State Containers in React"
author: "Kevin Hou"
date: 2017-06-13 10:26:07
description: "A quick overview of Redux, its benefits, and how it integrates with React"
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: Programming
tags: [reactjs]
featured: "no"
---
# Overview of Redux
Redux is a way of keeping all states consolidated in one master, global javascript object (called a Redux tree) and accessed using a store. In order to understand the basics, it is important to recognize the difference between pure and impure functions. Pure functions have no observable side effects on the database or server; in fact, the return values depend solely on the values of the arguments. If you put in the same arguments, you should get the exact same output every time. An impure function does not do this. It may modify the DOM or change a database.<br>
*Sidenote: You can deep freeze your input variable to ensure that your function is pure*
<br class="post-line-break">
State changes will result in a callback called the reducer function. It is imperative that this function be a pure function and it must return a new object, _not a reference to the input_. In most cases, you do not need to recreate the entire object. You can keep the references to the objects properties, but the master reference must be different — just change the variable(s) that need to be changed.<br>
*Sidenote: You can use an expect(...).toEqual(...) to debug in Javascript. They act like Java assertion statements*
<br class="post-line-break">
It is also important that the reducer functions consider all possible inputs of an action. By convention, undefined inputs will return the initial statement. A reducer accepts a state and an action. In the following implementation, here are a few important redux API's to keep in mind:
* store = createStore(instanceVarToUpdate) lets Redux know which instance to watch
* store.getState() → get value of variable
* store.subscribe(() => { … }); // Callback when variable changes — does not run during the initial state
* store.dispatch() → A function call that triggers an action manually
<br class="post-line-break">

# Implementation
There are a few main pieces when implementing Redux with ReactJS. It centers around the 'store' or class that controls the global instance variables. In this explanation, we will use a simple counter as the example store. It simply tracks a number and has two API endpoint actions: increment by one, decrement by one.

First, we must write out a simple React component so that we have something to connect our redux store to. Install the React NPM package so that we can use the framework.
{% highlight bash %}
$ npm install --save react
{% endhighlight %}
Now we must create the controller (written in ES6).
{% highlight javascript %}
import React from "react"; // Import the React NPM package

// React Component
export default class Counter extends React.Component {
  render() { // Rendering function
    return (
      <div>
        <h1>Counter: {this.props.value}</h1>
        <button onClick={this.props.onIncrement}>Add</button>
        <button onClick={this.props.onDecrement}>Subtract</button>
      </div>
    );
  }
};
{% endhighlight %}
As we will see later, we will pass in the value of the counter and two functions (increment and decrement) from the store we will eventually create.
<br class="post-line-break">
<br class="post-line-break">
To set up our store, we must first install redux and use the --save option to include it in our package.json:
{% highlight bash %}
$ npm install --save redux
{% endhighlight %}
<br class="post-line-break">
<br class="post-line-break">
Now we must write the code for the store itself. The store is actually an object type generated running the createStore() function in the redux package on a class. The code is included below. Notice how the function accepts an action and does not actually modify the state — it is a **pure** function. In this example, the state is the value of the counter and it is initially set to 0. It is written in ES6.
{% highlight javascript %}
// counterStore.js
import { createStore } from "redux"; // Get the createStore export

// Setup the Redux instance
const counter = (state = 0, action) => { // Initially at 0
  console.log(action.type); // Feedback
  switch (action.type) { // Use a switch to determine what action to take
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

// Use the function above as the callback and generate a store type
const store = createStore(counter);

// Export the store so that it can used in other files
export default store;
{% endhighlight %}
<br class="post-line-break">
<br class="post-line-break">
Next, we will link the store with our React class so that it can dynamically update the frontend. We include the store as a local variable in the file using the require() statement:
{% highlight javascript %}
import store from "./counterStore";
{% endhighlight %}
_Side Note: In ES6, you can include exports from other JS files using brackets or no brackets. If there is a default export statement in the file, you do not have to use brackets and any import statement will simply load the default export as the variable name you specified. If you do not have a default export, want to access a number of different exports, or want to access a specific export, you must use the brackets and use the exact name of the export. ([citation](https://stackoverflow.com/questions/36795819/when-should-i-use-curly-braces-for-es6-import/36796281))_
<br class="post-line-break">
Now we will create a rendering function, using ReactDOM to inject our HTML into the DOM.
{% highlight javascript %}
require("./style.css"); // Include CSS stylesheet
import React from "react"; // Include React
import ReactDom from "react-dom"; // ReactDOM to load our component into the page

import Counter from "./content"; // Get our Counter React component
import store from "./counterStore"; // Don't use brackets because it is the default export

// Render function so that we can set it as a callback every time the store variable instance is modified
// We are also passing in the counter value and increment/decrement functions
// The component is rendered in the element with the id: 'main'
const render = () => {
  ReactDom.render(
    <Counter
      value = { store.getState() }
      onIncrement = { () =>
        store.dispatch({ type: 'INCREMENT' })
      }
      onDecrement = { () =>
        store.dispatch({ type: 'DECREMENT' })
      }
      />,
    document.getElementById('main')
  )
}

// Subscribe to the live updates
// This will run the function 'render' every time the store encounters a change
store.subscribe(render);

// Call it once manually to push it into the DOM because it will only render on a change
// If we don't manually call it, there can be no changes to put it in the dom in the first place
render();
{% endhighlight %}
<br class="post-line-break">
<br class="post-line-break">
# Closing Comments
Hope you were able to follow this brief tutorial! It is loosely based on the free course on egghead.io on <a href="http://webpack.github.io/docs/tutorials/getting-started/" target="\_blank">Redux and React</a>. The full code can be found <a href="https://github.com/khou22/NodeJSPractice/tree/master/Redux" target="\_blank">on my GitHub</a>.
