---
title: "NodeJS Basics - Setting Up A Local Web Server"
author: "Kevin Hou"
date: 2015-10-25 21:16:28
description: "Quick start guide of the Javascript runtime environment, Node.js, and its basic functionalities."
image: "https://khou22.github.io/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [nodejs, javascript]
featured: false
---
I'm starting a new project with a group of kids to program a plagiarism app for my school. After debating between PHP and Node.js, we decided to use Node.js as our primary ecosystem. After a bit of research and a couple of YouTube videos, I set up my own simple web server. My repository can be found [here](https://github.com/khou22/NodeJSPractice).

Here are the basics:
- Node.js in a nutshell runs Javascript locally from your terminal
- It takes Chrome’s V8 engine and uses it on the client side rather than attaching it to an HTML document (Javascript doesn’t have ‘document’ or ‘window’)
- Node.js can easily create a local server to compile, build, and emulate your web-based code

I worked briefly with Node.js over the summer at Salesforce.com when I was a UX Engineer, but I had never truly dove into the compiler I was using. I was under a lot of time pressure and was behind the learning curve, so I simply accepted what came out of it.

It's all coming back to me now and I'm realizing that I actually *do* understand a great deal of what's going on. Here are some basics that I used over the summer that people should know:

### Node.js and NPM
Node.js also built NPM - Node Package Manager - which is the default package manager for Node.js. It is responsible for downloading, importing, and including open-source packages, or libraries if you will. These packages are largely user-contributed and can be downloaded and included like so:

### Terminal
```bash
$: npm install [packageName]
```

### Javascript
```javascript
var package = require([packageName]); //Includes the package content as an object
```

Packages are a super easy way to install predefined functions that can do common things. They're incredibly simple and easy to pick up.

You *never* want to include packages themselves in repositories. They take up space and are simply non-essentials. Because of the nature of open-sourced code, packages are mostly all available online to be installed by anyone. To share dependencies, you need to create a 'package.json' file — a file that specifies which packages should be included.

To create the 'package.json' file type, type (in Terminal):
```bash
$: npm init
```

To log a dependency in the 'package.json':
```bash
$: npm install [packageName] -S
```

If you wish to install all the packages specified in the 'package.json' file, simply type:
```bash
$: npm install
```
This will install all the required modules. This sytem makes sharing code incredibly elegant and easy!

### Including Other JS Files in Your Code
It's very easy to include other Javascript files in your code. In fact, it's almsot identical to including a package dependency. Simply include:
```javascript
var m2 = require("./module2"); //Assumes js file
```

Must export your data in module2 otherwise it just reads an empty object:
```javascript
//In module2.js
var a = 10;
module.export.data = a; //Will export an object
//To access in other JS files, a will be stored as data.a
```

### Creating a Simple Local Web Server

It's very easy to start your own web server to run compiled code. It's great for prototypes and running web apps locally. Here's a simple web server that highlights the basic functionality:
```javascript
var server = http.createServer(function(request, response) {
  //Every time server hears something at port 3000, will respond with this:
  console.log("Got a request"); //Returns in the terminal
  response.write("Hi"); //Sends the window content. The browser will display "Hi"
  response.end();
});

server.listen(3000); //Specifies the port at which it will be served
```

Hope this helps! I'll be updating my site with various Node.js content and updates on the Plargiism App. In the meantime, if you have any questions feel free to [reach out](mailto:kevin.ch.hou@gmail.com)
