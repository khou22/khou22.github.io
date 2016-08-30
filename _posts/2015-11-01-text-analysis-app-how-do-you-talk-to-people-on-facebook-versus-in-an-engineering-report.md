---
layout: post
title: "Text Analysis App: How Do You Talk To People on Facebook Versus In An Engineering Report?"
author: "Kevin Hou"
date: 2015-11-01 14:23:08
description: "I programmed an app to analyze the user's text for patterns, word choice, writing level, etc. It's still being developed, but the basic functionality works. Give it a try! You might learn something about yourself. It works with any '.txt' file or with your Facebook message user data."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: programming
tags: [apps, javascript, reactjs, html, css, node-js]
featured: "no"
---

A couple weeks ago I downloaded by my <a href="https://www.facebook.com/help/131112897028467/">Facebook user data</a>. By law, Facebook is required to package and send you your raw Facebook data...including every message you've ever sent.

<br />

It was shocking how much personal information was available at my finger tips just from my Facebook profile. I was intrigued that all my Facebook messages were in once place. I decided to program an app that would sort through my messages and pick out the messages that I send. I also added in the ability to read simple text files such as my essays, emails, etc. The app can be found here:

<br />

<a href="http://khou22.github.io/blog/apps/text-analysis" target="_blank"><b>Text-Analysis App</b></a>

<hr />

I created options to:
<ul>
  <li>FIlter out other people's messages to isolate your own data</li>
  <li>Filter out messages only between you and specific person(s)</li>
</ul>

<br />

Because it's first semester senior year (college apps are in full swing) I haven't had as much time as I'd like to work on this app. I've spent about a week on it and I'm currently working on adding new features. Right now it works for any text file and any Facebook message file (detailed instructions in the app).

<br />

I've learned so much in the past couple week while programming this app, the most significant being memory management. I'm dealing with millions of lines of user data (my message file was a whopping 30 mb of pure text) and my computer has crashed a lot under the strain. I've managed to fix most of the issues and it's so interesting learning how to efficiently go through such massive amounts of data without overloading the browser. One of the neat options I added in was a 'big data' option. If checked it will filter out any word that doesn't occur over the specified number of times, therefore decreasing the load on the browser.

<br />

I encourage you to give it a try! You might learn something neat about the way you speak. I'll be adding more analysis in the coming weeks including <a href="#" data-toggle="tooltip" title="See the Flesch-Kincaid Grade Level formula">writing grade level</a> (according to US standards), readability, emotional state, etc. It'll be interesting!

If you have any suggestions or comments feel free to <a href="mailto:kevin.ch.hou@gmail.com">let me know</a>!
