---
title: "Introduction to Services in AngularJS"
author: "Kevin Hou"
date: 2016-03-13 23:30:29
description: "How to create and use services and factories in AngularJS"
image: "/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [ionic, javascript, angularjs]
featured: false
archived: true
---

### What Are Services?

In a nutshell, services are a way of making functions and variables global. They can be injected as dependencies in any controller and its functions/variables can be accessible across controllers.

### Creating the Service

1. Create service file
   ```javascript
   angular.module("moduleName", ["ionic", "ngCordova"])
     .factory("serviceFunction", function() {
       var testVariable = "Kevin"
       return function() {
         console.log(testVariable)
       };
     })
     .factory("serviceVariable", function() {
       var testVariable = "Kevin"
       return testVariable
     })
   ```

2. Make sure the names are consistent

3. Add "geocoding" (the module name) to the module’s dependency
   ```javascript
   angular.module("scheduledRidesCtrl", ["ui.bootstrap", "geocoding"])
   ```
   The way I explained this to a friend is basically using the "ui.bootstrap" analogy. Bootstrap in its most basic form is a a compilation of CSS styling and Javascript for functionality. When we include the "ui.bootstrap" dependency, we are essentially including that Javascript file to be used in this controller. It's not different when we create our own services. A service is basically a group of Javascript functions. If the services is included as a dependency, it will load all those Javascript functions and make them available to use in that controller. It's a good way of selectively loading specific Javascript files so that not all of your Javascript files have to load for every page.

4. Include the name of the service function in the controller’s function(…, …)
   ```javascript
   .controller("scheduledRidesCtrl", function ($scope, $ionicPopup, $timeout, serviceFunction, serviceVariable) {

   }
   ```

5. Can now use the functions and variables in any controller that you included the dependency for. Simply call:
   ```javascript
     serviceFunction(); // Runs the service function
     console.log(serviceVariable); // Uses the service variable as a regular variable
   ```
