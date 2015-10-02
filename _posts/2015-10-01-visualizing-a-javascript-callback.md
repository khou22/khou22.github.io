---
layout: post
title: "Visualizing a Javascript Callback"
author: "Kevin Hou"
date: 2015-10-01 18:26:42
description: "A cool web app that visually demonstrates how browsers execute Javascript's call stacks/event loops/callbacks."
category: Programming
tags: [Javascript]
featured: "no"
---
Ever wondered what technical sounding words like "asyncrhonis" or "event-loops" meant? It took me a while to figure out all the complicated terminology associated with code execution, but basically these words all relate to the order in which lines of code are run.

<br />

I came across a neat web app that one of my LinkedIn connections posted called <a href="http://latentflip.com/loupe/?code=JC5vbignYnV0dG9uJywgJ2NsaWNrJywgZnVuY3Rpb24gb25DbGljaygpIHsKICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gdGltZXIoKSB7CiAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjbGlja2VkIHRoZSBidXR0b24hJyk7ICAgIAogICAgfSwgMjAwMCk7Cn0pOwoKY29uc29sZS5sb2coIkhpISIpOwoKc2V0VGltZW91dChmdW5jdGlvbiB0aW1lb3V0KCkgewogICAgY29uc29sZS5sb2coIkNsaWNrIHRoZSBidXR0b24hIik7Cn0sIDUwMDApOwoKY29uc29sZS5sb2coIldlbGNvbWUgdG8gbG91cGUuIik7!!!" target="_blank">Loupe</a>. According to their website, <i>"Loupe is a little visualisation to help you understand how JavaScript's call stack/event loop/callback queue interact with each other."</i>

<br />

Here is a brief overview of the concept:
<iframe width="560" height="315" src="https://www.youtube.com/embed/8aGhZQkoFbQ" frameborder="0" allowfullscreen></iframe>

<br />

If you are at all curious or just want a new perspective on things, I encourage you check out <a href="http://latentflip.com/loupe/?code=JC5vbignYnV0dG9uJywgJ2NsaWNrJywgZnVuY3Rpb24gb25DbGljaygpIHsKICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gdGltZXIoKSB7CiAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjbGlja2VkIHRoZSBidXR0b24hJyk7ICAgIAogICAgfSwgMjAwMCk7Cn0pOwoKY29uc29sZS5sb2coIkhpISIpOwoKc2V0VGltZW91dChmdW5jdGlvbiB0aW1lb3V0KCkgewogICAgY29uc29sZS5sb2coIkNsaWNrIHRoZSBidXR0b24hIik7Cn0sIDUwMDApOwoKY29uc29sZS5sb2coIldlbGNvbWUgdG8gbG91cGUuIik7!!!" target="_blank">Loupe</a>!