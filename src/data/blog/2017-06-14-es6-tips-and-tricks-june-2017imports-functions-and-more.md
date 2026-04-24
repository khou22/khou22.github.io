---
title: "ES6 Tips and Tricks June 2017: Imports, Functions, and More"
author: "Kevin Hou"
date: 2017-06-14 17:50:35
description: "An ongoing blog post of useful ES6 notes that I come across throughout June."
image: "https://khou22.github.io/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [javascript, es6]
---
I am writing this blog post because I am, again, using ES6 for my internship. I was first exposed to this variation of Javascript during my very first internship at Salesforce back in Summer 2015. It feels like a long time ago and I've come a _long_ way since then. I am approaching ES6 with new awareness and sharper critical thinking. I felt it was useful to document some of the neat tricks I found with ES6 during my first month of my internship at Moat. A lot of this is partially review — a chance for me to shake the rust off and really solidify my skills in ES6.

### Concatenation
One strange thing that I've noticed is that some ES6 linters do not allow you to concatenate Strings using the normal '+' operation. They also don't allow you use double quotes and force you to stick to single quotes when hard coding Strings. I'm not entirely sure why this is the case and I haven't had time to look it up yet, but I think it has something to do with the way the compiler transforms the ES6 into static ES5 files for the browser. My guess is that the compiler needs to use double quotes and doesn't want the code to mess with its compile scripts/process. Anyways, here's a new way you can concatenate:
```javascript
const id = '154'; // Notice the single quotes

// When concatenating, use the "\`" quotation mark (normally shares the same key as the '~')
// This works with any String convertible data type
const link = `/data_table?id=${id}`; // Result: "/data_table?id=154"
```

### Updating a Few Properties in an Object
This will allow you to return a deep copy of your object without having to write out every single property value. It's really useful when you're updating a state in React or Redux.
```javascript
return {
    ...previousState,
    propertyToUpdate: !previousState.propertyToUpdate
};
```

### Event Handler
I came across this useful tidbit when using the [React-Select](https://github.com/JedWatson/react-select) library for my project at work. It is an open source, purely React dropdown list that I would definitely recommend to anyone in need of a dropdown. I was attempting to customize the main component and found a property called arrorRender with the usage description: "Renders a custom drop-down arrow to be shown in the right-hand side of the select: arrowRenderer({ onMouseDown, isOpen })" I'm familiar with event handlers, but I had never seen this style of documentation before. What this means, is that the arrowRenderer is a function that returns a DOM node to be used in place of the default arrow icon. The function takes an object input with the properties onMouseDown and isOpen so that there can be more complex renderings. Here was my rendering function:
```javascript
// Custom dropdown icon for React-Select
arrowRenderer(event) {
    const dropdownArrow = '/path/to/image'; // Dropdown arrow
    const searchIcon = '/path/to/image'; // Magnifying glass
    const imgURL = event.isOpen ? searchIcon : dropdownArrow; // Determine which to use
    return (
        <span>
            <img src={imgURL} width="100%" role="presentation" />
        </span>
    );
}
```
In this function, I am using the isOpen state to choose which image icon to render in the select input. You may not have seen this notation before and it's definitely useful to remember.

Another useful event handler is the 'input' tag's built in onBlur() event that triggers when the user removes focus from the input element. Like the onFocus() handler, onBlur() can be assigned to a custom function.
```javascript
// The event handler function
const update = () => {
    console.log('I've been triggered');
}
```
```html
<!-- The HTML -->
<input type="text" autoComplete="off" autoCorrect="off" spellCheck="false" className="select2-input" onFocus={update} onBlur={update} />
```

### Preserving 'this' When Using React Props
In ES6, 'this' is not generally preserved which leads to some difficult workarounds when passing functions from one component to its children. Luckily, there is a technique that can be generally applicable to most situations that solves this issue. Many linters prevent the use of '.bind(this)' so that is off the table. However, the block statement function ensures that 'this' pertains to the right scope. It is especially useful when you have to pass variables in as inputs. Here is an ES6 React example of this:
```javascript
import React, { Component } from 'react';

class SomeComponent extends Component {
    clicked(input) {
        // 'this' refers to the component rather than the window
        this.setState({
            someState: input
        });
    }

    render() {
        return (
            <div>
                Good Example
                <button id="button" onClick={() => this.clicked(input)}>I work</button>

                This won't preserve 'this' and your component will crash
                <button id="button" onClick={this.clicked(input)}>
            </div>
        );
    }
}
```
