---
layout: post
title: "Uber Scheduler: Calling Ubers Alarm Clock Style"
author: "Kevin Hou"
date: 2016-04-21 22:43:30
description: "Overview, reflection, etc. on building the Uber Scheduler at my first hackathon. It won first overall!"
category: Programming
tags: []
featured: "yes"
---
This past week, a group of friend and I attended a hackathon, MenloHacks ñ an MLH (Major League Hackathon) sponsored event. This was my first hackathon and was also for one of my two partners. Our group of 3 high schoolers built an Uber scheduling app for both iOS and Android. Our app would essentially allow users to schedule uber rides ahead of time at a set date/time. Another core segment of our app was the recurring schedule component: an alarm-clock-style feature that could automatically call you an Uber on specific weekdays (i.e. every Monday, Wednesday, and Friday at 5:45 PM). We were able to complete our product within the allotted 24 hour time period. We even had time to build another project - a Google Chrome extension that censors your vulgar GitHub commits (see <a href="#">Execute Order 66</a>). I worked as the primary front end engineer and also designed the UI/UX from scratch.
<br class="post-line-break">
We built our app in Ionic using AngularJS for the front end and Python for our Google Cloud Engine backend. We wanted to have discipline when building the app so we concentrated on maintaining good coding practices such as commenting code, building in a scalable fashion, as well as programming code that was organized and efficient. Due to the nature of Google Cloud Engine, our app is potentially scalable to millions of users.
<br class="post-line-break">
<h3 class="post-subheader">Design</h3>
This was one of my first times designing an app from ground zero. Often times I would design pages as I went or only design a single component. Because I realized the importance of the role of UX/UI design in app development, I decided to take the time to plan each page out down to the pixel. While the rest of my group coded the backend on Google Cloud Engineine, I spent about 5 hours working with Sketch to come up with a simple and streamlined user flow as well as a beautiful UI. I even mocked up different variations and iterated upon my designs.
<br class="post-line-break">
I used Google Material Design as inspiration and a starting block because we enjoyed its styling methodology. While many of our components were variations of existing components (a small percentage were directly copied), some of the icons and components were of my own creation that I designed to mimic the overall Material Design feel.
<br class="post-line-break">
<h3 class="post-subheader">Building the App</h3>
After spending about a quarter of the 24 hours designing, I began to transition to building the front end. One of my group members had already built a somewhat functional landing page, so I set about building the other pages. I found it significantly easier to build the front end when I had an accurate design to go off of. In fact, the time I saved likely outweighed the 6 or so hours it took to create the designs.
<br class="post-line-break">
I created Angular services for everything relating to global variables or functions. By doing this from the beginning, it made my group member's job of connecting the front end to the backend significantly easier. I used some open source Angular packages that sped up the coding process. the two packages I used were for the date selection modal and for the time selection modal. They can be found here:
<ol>
  <li>Time Picker Modal: <a href="https://github.com/rajeshwarpatlolla/ionic-timepicker" target="_blank">https://github.com/rajeshwarpatlolla/ionic-timepicker</li>
  <li>Date Picker Modal: <a href="https://github.com/rajeshwarpatlolla/ionic-datepicker" target="_blank">https://github.com/rajeshwarpatlolla/ionic-datepicker</a></li>
</ol>
<br class="post-line-break">
Overall, the development process went very smoothly and our group worked together well. Because this was my first hackathon, I was both happy and pleasantly surprised when we were chosen as the best overall hack that day.
<br class="post-line-break">
<h3 class="post-subheader">External Links:</h3>
Go to our <a href="http://devpost.com/software/uber-scheduler">Devpost project page</a> to see what we submitted for the Hackathon.
<br class="post-line-break">
For our complete source code see our <a href="https://github.com/AlexFine/MenloHacks">GitHub Repo</a>.
