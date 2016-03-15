---
layout: post
title: "Introduction to Services in AngularJS"
author: "Kevin Hou"
date: 2016-03-13 23:30:29
description: "How to create and use services and factories in AngularJS"
category: Programming
tags: []
featured: "no"
---
**Blog post in progress**

<ol>
  <li>
    Create service file
    {% highlight javascript %}
    angular.module(‘moduleName’, ['ionic', 'ngCordova'])
      .factory(‘serviceFunction’, function() {
        var testVariable = "Kevin"
        return function() {
          console.log(testVariable)
        };
      })
      .factory(‘serviceVariable’, function() {
        var testVariable = "Kevin"
        return testVariable
      })
    {% endhighlight %}
  </li>

  <li>
    Make sure the names are consistent
  </li>

  <li>
    Add ‘moduleName’ to the module’s dependancy
    {% highlight javascript %}
    angular.module('scheduledRidesCtrl', ['ui.bootstrap', 'geocoding'])
    {% endhighlight %}
  </li>

  <li>
    Include the name of the service function in the controller’s function(…, …)
    {% highlight javascript %}
    .controller('scheduledRidesCtrl', function ($scope, $ionicPopup, $timeout, serviceFunction, serviceVariable) {

    }
    {% endhighlight %}
  </li>

  <li>Can now use the functions and variables in any controller that you included the dependency for. Simply call:
    {% highlight javascript %}
    serviceFunction(); // Runs the service function
    console.log(serviceVariable); // Uses the service variable as a regular variable
    {% endhighlight %}
  </li>
</ol>
