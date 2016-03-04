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

The entire Python setup was surprisingly easy. I had never programmed in Python before and only knew that it was good for backend scripts. I really wanted to expand my coding knowledge so I decided to take up Python. Here are some useful "projects" that got me going:
<ul>
  <li>Web Scraping</li>
  <li>Simple math formulas</li>
  <li>Using cool modules</li>
  <li>Calling API's like iTunes and YouTube</li>
  <li>Encoding and decoding JSON data</li>
  <li>Downloading files and making a progress bar</li>
</ul>


# Dynamic Progress Bar
This project helped me gain a better understanding of how Python can communicate with the user via the Terminal interface.
Reference: <a href="http://stackoverflow.com/questions/3173320/text-progress-bar-in-the-console">http://stackoverflow.com/questions/3173320/text-progress-bar-in-the-console</a>
{% highlight python %}
for i in range(100):
    time.sleep(1)
    sys.stdout.write("\r%d%%" % i)
    sys.stdout.flush()
{% endhighlight %}

# Constructing and Interpreting JSON data
This was great way for me to learn how Python data structures worked. It helped me gain a good foundation in simple variable types as well as how to communicate between different programming languages. For example, Javascript often sends data in the form of a JSON object. By doing this project I was able to pass data from my Javascript into my Python script and vice versa.
Reference: <a href="https://docs.python.org/2/library/json.html">https://docs.python.org/2/library/json.html</a>
