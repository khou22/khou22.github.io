---
layout: post
title: "React Redux Tutorial: Building Your Own Web App"
author: "Kevin Hou"
date: 2017-08-29 21:16:59
description: "An introduction into React-Redux — a framework for building web applications. This tutorial is implemented with ES6 and Webpack."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: web
tags: [reactjs, redux, javascript, es6, tutorial, sourceCode]
featured: "yes"
---
## Introduction
Redux has been making a strong appearance recently in the world of web development. In a nutshell, it is essentially a way of keeping and consolidating props outside of the React components. The goal is to eliminate the need for local states and use the React components for purely rendering and small minor helper functions. The creators of Redux set out to tackle the challenge many developers faced, myself included, of passing properties between many components.

I've been working with React since it's birth for about 3 years now and I've been a huge fan ever since. I started using Redux this past summer at Moat (Now Oracle as of August 1st) and it's been a great addition to my skillset and productivity because of the ways in which it improves large-scale React web apps.

In this post, I will cover the basics of React/Redux as well as its benefits. Redux works by using React components, containers, actions, and reducers. Reducers receive action dispatches and update the Redux state. All Redux state changes must be routed through the reducer. Additionally, all actions must be connected to components through containers. Component can only update the local state by triggering actions. In short, reducers sit on top of the state, actions triggers reducers, containers connect components with states as well as actions, and components display client-facing components.

## Overview

### Typical file structure:
```
client/src/  
+-- Actions  
|   +-- Section1Actions.js
|   +-- Section2Actions.js
+-- Components  
|   +-- Section1
|   |   +-- Components1.jsx  
|   |   +-- Components2.jsx  
|   +-- Section2  
|   |   +-- Components3.jsx  
|   |   +-- Components4.jsx  
+-- Constants  
|   +-- MainActionTypes.js  
|   +-- OtherConstants.js  
+-- Containers  
|   +-- EntryContainer.js  
|   +-- Section1Container.js  
|   +-- Section2Container.js  
+-- Reducers  
|   +-- Section1Reducer.js  
|   +-- Section2Reducer.js  
|   +-- index.js  
+-- Styles  
|   +-- main.scss  
|   +-- Section1Styles.scss  
|   +-- Section2Styles.scss  
+-- ConfigureStore.js.  
+-- index.js  
```

### Dependencies
```
react
react-dom
react-redux
redux
redux-logger
redux-thunk
```

# Boilerplate Code

## 1. Entry-Point

``` javascript
// client/src/index.js

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

// This imports a redux store that we will get into next
import store from './ConfigureStore.js';

// I've found it helpful to use a generic entry container that houses subsequent containers
import Entry from './Containers/EntryContainer';

// Can call actions on render which can be helpful for fetch requests
import { someAction } from './Actions/MainActions';

// Import styleguide (optional) that doesn't correspond to a specific component
import './Styles/main.scss'; // Get styleguide

store.dispatch(fetchRepos()); // Fetch the fe-component repos

render(
	// Must wrap with the provider and store
    <Provider store={store}>
        <Entry />
    </Provider>,

    // The target in the DOM you are rendering to
    // This will be in the client/dist/index.html
    document.getElementById('main')
);
```

## 2. Configuring the Store
``` javascript
// client/src/ConfigureStore.js

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger'; // For debugging in the console

import mainReducer from './Reducers'; // Import the reducer (client/src/Reducers/index.js)

// Thunk middleware is used to allow functions to be passed as actions
const middlewares = [thunkMiddleware];

// If debug mode is on, log state changes and actions to the console
const debuggerMode = false; // Can also be determined by process.ENV variables
if (debuggerMode) {
    const loggerMiddleware = createLogger();
    middlewares.push(loggerMiddleware); // Add middleware
}

// Creates store that handles the complete state tree of app
// This is exported and used by the provider
export default createStore(mainReducer, applyMiddleware(...middlewares));
```

## 3. Creating a Component
Components are the purely frontend, client-side rendering piece of the puzzle. They should have limited logic and mainly act as pure functions. They are connected to containers which feed them props, but for now we will simply be creating a component with property requirements.

__Pure Functional Component (Just Rendering)__

``` javascript
// client/src/Components/<folder-name>/<component-name>.jsx

import React from 'react';
import PropTypes from 'prop-types'; // For enforcing prop types

import '../../Styles/<component-name>.scss'; // Import the corresponding stylesheet

const ComponentName = (props) => (
	<div>
		{props.message}
   </div>
);

// Declare which props are what type and if they are optional
ComponentName.propTypes = {
	message: PropTypes.string.isRequired,
	someObject: PropTypes.shape({
		name: PropTypes.string.isRequired,
		age: PropTypes.number,
		numbers: PropTypes.arrayOf(PropTypes.number).isRequired,
	}), // Not required
};

export default ComponentName;
```

__More Logic-Heavy Component__

``` javascript
// client/src/Components/<folder-name>/<component-name>.jsx
import React, { Component } from 'react'; // Must import the Component class type

import '../../Styles/<component-name>.scss'; // Import sass file for this component

class Loading extends Component {
	constructor(props) { // Can now use other functions
		super(props);
		...
	}

	randomFunction(input) {
		...
	}

	render() {
		return (
  			<div>
          	{this.props.message}
          </div>
       )
   }
}

ComponentName.propTypes = {
	...
};

export default ComponentName;
```

## 4. Action Types
All actions must dispatch an object that dictates to a reducer what it should do. The way the reducer registers what type of logic to carry out is by a unique `action.type`. These are stored in the `Constants/MainActionTypes.js` file. It looks something like this:

``` javascript
// client/src/Constants/MainActionTypes.js

// Loading Actions
export const REQUEST_SENT = 'REQUEST_SENT';
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS';

// API Actions
...
```

## 5. Reducers
Reducers respond to actions when they dispatch a return object. These objects are picked up by the reducers and some logic is carried out that can update the state. Reducer functionality should be kept at a minimum and it is very important that they remain pure-functions — that is, they only rely on input, no other information, for calculating an output. A reducer looks like this:

``` javascript
// client/src/Reducers/SomeReducer.js

// This gives you access to the action types we created in step 4
import * as types from '../Constants/MainActionTypes';

const initialState = {
    someValue: true, // Default initial state for this variable
};

const someReducer = (state = initialState, action) => {
	// The app can decide what to do based on the action type
	// The return object for this function will be the new state
   switch (action.type) {
       case types.SOME_ACTION_TYPE:
           return {
               ...state,
               someValue: false,
           };
       default: // Default, no state change
           return state;
   };
   return state;
};

export default someReducer;
```

The reducers are then consolidated into one file in the `Reducers/index.js` file:

``` javascript
// client/src/Reducers/index.js

import { combineReducers } from 'redux';

// Import all the reducers
import someReducer from './someReducer';
...
import anotherReducer from './anotherReducer';

// Export for use in the entry index.js file
export default combineReducers({
	// 'name' refers to the name of the reducer you will use to access the variables associated with it
    name: someReducer,
    ...
    another: anotherReducer,
});
```

## 6. Actions
Actions are like any function except that the only thing that really matters is their return object. Actions are dispatched (thanks to `redux-thunk`) and their return objects are what the reducers receive and interpret; therefore, it is imperitive that the action return has `type` value associated with it. We will set them using the `MainActionTypes.js` constants we wrote earlier so that there are no typos. Actions are generally referenced in the container and attached to a component as a prop as we'll see in step 7.

__Standard action:__

``` javascript
// client/src/Actions/mainActions.js

import 'whatwg-fetch'; // Fetch requests
import * as types from '../Constants/MainActionTypes';

export const updatingVariables = (val) => ({
    type: types.SOME_ACTION,
    name: val,
});
```

__Sample async fetch-request:__

``` javascript
// client/src/Actions/mainActions.js

import 'whatwg-fetch'; // Fetch requests
import * as types from '../Constants/MainActionTypes';

export const fetchJSON = () => {
	const url = '...';

   // Returning a promise allows you to use the 'dispatch' function in the child scope
   return (dispatch) => {
       dispatch(requestSent(url)); // Actions can dispatch other actions

		// Return the contents of the fetch promise
		return fetch(url, { // See watwg-fetch for docs
           credentials: 'same-origin', // If same origin
       }).then(response => response.json()) // Parse response
       .then(json => {
           console.log('Received data');
           dispatch(receivedData(json));
           return json; // Return it as a promise — will be the result of the original action
           // Example:
           //	 this.props.fetchJSON().then((response) { ... }).catch((error) { ...});
       })
       .catch(error => { // Catch any errors
           dispatch(actionError(error));
       });
   };
};
```

## 7. Containers
Containers put steps 3-5 together and lets you package the component, reducer, and constants all together. Containers connect the actions, redux state values, and reducers to the components as props. When you want to render the contents of the container, you include the `<ContainerName />` as opposed to its child `<ComponentName />`.

``` javascript
// client/src/Containers/someContainer.js

import { connect } from 'react-redux';

// Get the component
import SomeComponent from '../Components/SomeComponent';

// Import actions you'd like to make usable to a component
import { someAction } from '../Actions/MainActions';

// Map the redux states to props
const mapStateToProps = (state) => ({
	// 'name' is the name of the reducer you specified in step 5 in the file:
	// client/src/Reducers/index.js
   someValue: state.name.someValue,
});

// Map actions to props
const mapDispatchToProps = (dispatch) => ({
	viewComponent: (input) => (
        dispatch(someAction(input))
   ),
});

// Connects your component to the store using the previously defined functions
export default connect(
    mapStateToProps, // Add the states
    mapDispatchToProps // Add the actions
)(SomeComponent); // Connect them to the component
```

To use the container, simply include it like so:

``` javascript
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SomeContainer from '../Containers/SomeContainer'; // Get container

class Entry extends Component {
	constructor(props) {
   		super(props);
		...
   }

   render() {
      	return (
           <div>
               <SomeContainer />
           </div>
       )
   }
}

Entry.propTypes = {
	...
};

export default Entry;

```


# Conclusion
If you put all those pieces together you should end up with your first, boilerplate React/Redux application! It's a really useful tool and a great addition to any stack — especially those that already use React. I will be working with this stack very shortly on a personal project as well as some business projects so I'll be sure to keep you all updated on what I'll continue to learn!
