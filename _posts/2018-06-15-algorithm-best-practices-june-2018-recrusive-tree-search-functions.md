---
layout: post
title: "Algorithm Best Practices June 2018&#58 Recrusive Tree Search Functions"
author: "Kevin Hou"
date: 2018-06-15 11:22:18
description: "A tutorial on some best practices for designing recursive functions."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: programming
tags: [python, sourceCode]
featured: "no"
---
# Introduction to Recurssion
Recursive functions can be a massive headache for all developers involved if the code is not properly documented, formatted, and abstracted. For those that don't know, a recursive function is a function that calls itself. The University of Wisconsin Madison defines it as follows:

> A recursive function (DEF) is a function which either calls itself or is in a potential cycle of function calls. As the definition specifies, there are two types of recursive functions. Consider a function which calls itself: we call this type of recursion immediate recursion.
> 
> — [University of Wisconsin - Madison](http://pages.cs.wisc.edu/~calvin/cs110/RECURSION.html)

Recursive functions can do a variety of neat things and replicate a lot of nature's phenemenons such as fractals.
<img src="https://cdn-images-1.medium.com/max/1600/1*XgBEkiVz9Dbl4EwenofHmA.jpeg" width="50%">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/SierpinskiTriangle.svg/220px-SierpinskiTriangle.svg.png" width="49%">

# Challenges
Code that can run itself can lead to a whole host of issues. The most common is a "stack overflow". This is when a recurssive function calls itself over and over, never terminating, and pushes its function calls onto the "[call stack](https://en.wikipedia.org/wiki/Call_stack)" until the computer can't handle it anymore and shuts down - hence a "stack overflow." This is one of the many easy traps of recurssive programming.

Furthermore, recurssive code is difficult to read, especially if you're not the one who wrote it. Without proper code etiquite, it can get incredibely confusing.

# Solution and Modularization
The solution to these problems is to a) write code that works b) document your code. In this section, I'll show you a technique I learned from my coworker, Brian Lonsdorf, that clearly abstracts the different pieces of recurssion into modular, isolated functions. This not only helps keep the code organized, but combined with the correct commenting, can result in clear and concise code.

The code below was written in Python 3 and demonstrates a simple depth-first search using an accumulator object that is pass-by-reference. The coolest parts about this code in my opinion was the implementation of a visitor function and an accumulator. Using these methods, handling data and performing the main logic is clearly compartmentalized. This ensures the main recursive logic isn't affected by your logic and prevents bugs (like stack overflows) from occuring.

``` python
# Python 3
# Kevin Hou (khou22.com)

# The condition function that determines if a node has child nodes
# This ensures the code terminates eventually
def hasChildren(node):
    return len(node['children']) > 0

# Visitor function
# This function is called on every node the search function visits
# This is where your main logic should go
def visitor(element, accumulator):

    # In this situation, we're simply checking if it's a leaf and storing it in our accumulator if it is
    if ~hasChildren(element): # Check if it's a leaf node
        accumulator.append(element) # Add to accumulator if leaf

# The recursive function that calls itself
# Searches a node, applies a visitor function, and searches each child node
def searchChildren(node, visitor):
    visitor(node) # Visitor function

    # Recrusively search if possible
    if hasChildren(element):
        children = element['children'] # Get child nodes
        list(map(lambda child: searchChildren(child, visitor), children)) # Search each child node
            
# Get all SLDS components
def getLeaves(tree):
    accumulator = [] # Pass-by-reference accumulator object
    
    # Initial search call with visitor function
    searchChildren(tree, lambda element: visitor(element, accumulator))
```

