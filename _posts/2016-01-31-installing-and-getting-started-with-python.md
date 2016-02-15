---
layout: post
title: "Installing and Getting Started with Python"
author: "Kevin Hou"
date: 2016-01-31 13:44:44
description: "Setting up Python on my own computer."
category: Programming
tags: [python]
featured: "no"
---
# Downloading and Installing Python
First download Python from the <a href="https://www.python.org/downloads/">Python website</a>. After installing, you can install other helpful tools including <a href="https://bootstrap.pypa.io/get-pip.py">Pip</a>. Save the file as a Python file (extension: ".py") and navigate to the file in your terminal. Run the Python script using your terminal to install:

{% highlight bash %}
$ python get-pip.py
{% endhighlight %}
so
In order to install globally you may to run a "sudo" install:
{% highlight bash %}
$ sudo python get-pip.py
{% endhighlight %}

# Installing Python Modules
{% highlight bash %}
$ sudo pip install requests
{% endhighlight %}
