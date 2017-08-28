---
layout: post
title: "ES6 Tips and Tricks June 2017: Webpack Loaders, Regexes, and DNS Configuration"
author: "Kevin Hou"
date: 2017-07-31 16:50:16
description: "A somewhat random assortment of things I've learned and felt worth noting including how to do a local DNA override, using SVGs in Webpack, how to retrieve the current directory path in-line, and more."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: web
tags: [es6, javascript]
featured: "yes"
---
<h3 class="post-subheader">Using Raw Files with Webpack</h3>
There are some files that are best used when imported as their raw contents. This includes, but is not limited to file extensions like: `.svg`, `.md`, and `.txt`. For these situations, you must use the `raw-loader` in your `webpack.config` file:  
{% highlight javascript %}
// Load markdown as raw text
...
{
    test: /\.md/,
    exclude: /node_modules/,
    loader: 'raw-loader'
}
...
{% endhighlight %}

Using an `.svg` file in React:<br>
{% highlight javascript %}
import svgData from './image.svg';

/* React render() */
<span className="loading" dangerouslySetInnerHTML={{ __html: svgData }} />
{% endhighlight %}

<h3 class="post-subheader">Cleaning up Log Statements</h3>
Developers use `console.log` statements religiously — it's the best way of debugging and tracking a browser or computer's path through the code. One problem that arises is that `console.log` statements are accidentally left in, which doesn't reflect well if the log statements are clearly debuggers, or simply left in commented out. When deploying to production, `console.log` statements should be removed. Because they permeate every corner of the project, I've found it's easiest to remove them using regexes: Find & Replace. Here are the regexes for finding all lines with `console.log` statements:  
{% highlight javascript %}
// Commented out statements
"\n *\/\/ console\.log\(.*\)"

// Active statements
"\n *console\.log\(.*\)"

// Commented out or still active
"\n *\/?\/? console\.log\(.*\)"
{% endhighlight %}

<h3 class="post-subheader">Common Regex Statements</h3>
I've started using regexes (regular expressions) more and more in my projects — specifically in Javascript — and I've found them very elegant and fun to use. I learned them briefly in class at school, but never really implemented them in full. My [hackathon project](https://devpost.com/software/sofly-scanner) did use a bit of natural language processing, however, it wasn't to a huge scale. We mostly stuck to date and location parsing.
<br class="post-line-break">
Here's a simple email validation regex match statement in Javascript:  
{% highlight javascript %}
const validQuery = 'email@test.com';
const invalidQuery = 'I am not an email address';

// Email regex from: https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
// Notice: uses '/' instead of quotes
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

console.log(emailRegex.test(validQuery)); // true
console.log(emailRegex.test(invalidQuery)); // false
{% endhighlight %}

<h3 class="post-subheader">Getting the Current Directory in Javascript</h3>
It's really important that you use a reliable path resolving system when configuring your web apps. Packages like `ExpressJS` and `Webpack` rely on file paths to build and serve up your app so it's essential that the way you get your current directory is reliable. There are a handful of ways of getting your current directory and navigating through it:  
__Getting Directory__:  
1. Default: `__dirname // Often global — can simply access by calling this variable`  
2. Using environment variables: `const __dirname = process.env.PWD;`


__Navigating Files__:  
Use the `path` library:

{% highlight javascript %}
const path = require('path');
path.join(__dirname, './client/dist') // Resolves the file path
{% endhighlight %}

<h3 class="post-subheader">Modifying Local DNS</h3>
Computers can easily be configured to change the Domain Name System (DNS). What this means is that you can override and map certain IP addresses to different URL names. For example, at work, I develop on my own Dev Box — a section of a computer somewhere that hosts my files. Because Moat has hundreds of these, it's not economical to buy a domain name for each box. Instead, they are left unnamed and can only be accessed from the browser using their public IP address. When I'm modifying code, I hook into their private IP addresses. Instead of typing in the exact IP address every time you want to view your code, which is long and can easily be butchered, you can modify your local DNS and map that specific IP address to a human-readable URL.
<br class="post-line-break">
Navigate to `/etc/` (`$ cd /etc/`) — notice it is prepended using a forward-slash, indiciating it is in the base directory. Next, open `hosts` using VI, VIM, NANO, or any other text editor. Now modify that file using the following structure.  
{% highlight javascript %}
<IP Address>    <URL 1> ... <URL N>
12.345.67.89    admin.test.com
01.234.56.78    test1.com test2.com
{% endhighlight %}

<h3 class="post-subheader">Common IP Ranges</h3>
Private IPv4 address spaces ([Source](https://en.wikipedia.org/wiki/Private_network))

| RFC1918 name |  IP address range              | Mask bits |
| ------------ |:------------------------------:| ---------:|
| 24-bit block |  10.0.0.0 - 10.255.255.25      | 8 bits    |
| 20-bit block |  172.16.0.0 – 172.31.255.255   | 12 bits   |
| 16-bit block |  192.168.0.0 – 192.168.255.255 | 16 bits   |
