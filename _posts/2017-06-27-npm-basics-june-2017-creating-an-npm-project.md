---
layout: post
title: "NPM Basics June 2017: Creating an NPM Project"
author: "Kevin Hou"
date: 2017-06-27 10:17:34
description: ""
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: Programming
tags: []
featured: "no"
---
# Create an NPM Environment
First, you need to create an NPM environment for your library so that NPM knows what dependencies and scripts are associated with the library. Run:
{% highlight bash %}
npm init
{% endhighlight %}
Follow the instructions and it'll attempt to create a proper package.json for your project.

# Installing Dependencies
{% highlight bash %}
npm install --save react-redux
{% endhighlight %}

# Useful Dev Tools
Linter: Check for coding errors — saves a trip to the browser (Airbnb's linter is useful)
Webpack: For building and compiling JSX, ES6, etc. It will create static site with the option to serve it up locally on the localhost.

# Use GitHub Repo as the Public NPM Package
{% highlight bash %}
npm i git://github.com/user/project.git#commit-ish --save
{% endhighlight %}

File structure of GitHub repo if you want to use it as a public package:
library-name/
    demo/
    dist/
    src/
