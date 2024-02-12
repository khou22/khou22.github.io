---
title: "Uber Scheduler: Calling Ubers Alarm Clock Style"
author: "Kevin Hou"
date: 2016-04-21 22:43:30
description: "Overview, reflection, etc. on building the Uber Scheduler at my first hackathon. It won first overall!"
tags: [hackathon, coding, web, design]
---

This past week, a group of friends and I attended a hackathon, MenloHacks — an MLH (Major League Hackathon) sponsored event. This was my first hackathon and was also for one of my two partners. Our group of 3 high schoolers built an Uber scheduling app for both iOS and Android. Our app would essentially allow users to schedule uber rides ahead of time at a set date/time. Another core segment of our app was the recurring schedule component: an alarm-clock-style feature that could automatically call you an Uber on specific weekdays (i.e. every Monday, Wednesday, and Friday at 5:45 PM). We were able to complete our product within the allotted 24 hour time period. We even had time to build another project - a Google Chrome extension that censors your vulgar GitHub commits (see Execute Order 66). I worked as the primary front end engineer and also designed the UI/UX from scratch.

We built our app in Ionic using AngularJS for the front end and Python for our Google Cloud Engine backend. We wanted to have discipline when building the app so we concentrated on maintaining good coding practices such as commenting code, building in a scalable fashion, as well as programming code that was organized and efficient. Due to the nature of Google Cloud Engine, our app is potentially scalable to millions of users.

### Design

Scroll down for images of my designs.

This was one of my first times designing an app from ground zero. Often times I would design pages as I went or only design a single component. Because I realized the importance of the role of UX/UI design in app development, I decided to take the time to plan each page out down to the pixel. While the rest of my group coded the backend on Google Cloud Engine, I spent about 5 hours working with Sketch to come up with a simple and streamlined user flow as well as a beautiful UI. I even mocked up different variations and iterated upon my designs.

I used Google Material Design as inspiration and a starting block because we enjoyed its styling methodology. While many of our components were variations of existing components (a small percentage were directly copied), some of the icons and components were of my own creation that I designed to mimic the overall Material Design feel.

### Building the App

After spending about a quarter of the 24 hours designing, I began to transition to building the front end. One of my group members had already built a somewhat functional landing page, so I set about building the other pages. I found it significantly easier to build the front end when I had an accurate design to go off of. In fact, the time I saved likely outweighed the 6 or so hours it took to create the designs.

I created Angular services for everything relating to global variables or functions. By doing this from the beginning, it made my group member's job of connecting the front end to the backend significantly easier. I used some open source Angular packages that sped up the coding process. the two packages I used were for the date selection modal and for the time selection modal. They can be found here:

1. Time Picker Modal: [https://github.com/rajeshwarpatlolla/ionic-timepicker](https://github.com/rajeshwarpatlolla/ionic-timepicker)
2. Date Picker Modal: [https://github.com/rajeshwarpatlolla/ionic-datepicker](https://github.com/rajeshwarpatlolla/ionic-datepicker)

Overall, the development process went very smoothly and our group worked together well. Because this was my first hackathon, I was both happy and pleasantly surprised when we were chosen as the best overall hack that day.

### What's Next?

We're all pretty excited about the app and we feel it has a lot of potential. We are currently polishing up the front end and working on authorizing our app with Uber. The app has many bugs (as expected) that we're hoping to clear up so that we can begin user testing at our high school. We hope to release it on the app store soon. In the long term, we think our app could integrate with other ride-sharing services, such as Lyft, and automatically request from the service with the cheapest rate, fastest pickup time, etc. Stay tuned!

### External Links

Go to our [Devpost project page](http://devpost.com/software/uber-scheduler) to see what we submitted for the Hackathon. It contains screenshots, a narrative of our build, and more.

For our complete source code see our [GitHub Repo](https://github.com/AlexFine/MenloHacks).

### Design Mockups (Created with Sketch)

I created multiple designs and iterated on previous versions. Due to the 24 hour time restriction, I only created two major versions. Below are some designs that show the evolution of the app design. I used Sketch to create the designs.

#### Version 1

![Uber Scheduler screenshot Kevin Hou project rough draft v1](https://khou22.github.io/media/projects/uberScheduler/design-mockups/home-screen.png)
![Uber Scheduler screenshot Kevin Hou project time picker v1](https://khou22.github.io/media/projects/uberScheduler/design-mockups/time-picker-v1.png)
![Uber Scheduler screenshot Kevin Hou project general tab v1](https://khou22.github.io/media/projects/uberScheduler/design-mockups/general-tab-v1.png)

#### Version 2 (Final Designs)

![Uber Scheduler screenshot Kevin Hou project home screen](https://khou22.github.io/media/projects/uberScheduler/screenshots/home-screen.png)
![Uber Scheduler screenshot Kevin Hou project location](https://khou22.github.io/media/projects/uberScheduler/design-mockups/location-tab.png)
![Uber Scheduler screenshot Kevin Hou project time](https://khou22.github.io/media/projects/uberScheduler/design-mockups/time-picker-v2.png)
![Uber Scheduler screenshot Kevin Hou project general usage](https://khou22.github.io/media/projects/uberScheduler/design-mockups/general-tab-v2.png)

### App Screenshots (Working MVP)

![Uber Scheduler screenshot Kevin Hou project home screen](https://khou22.github.io/media/projects/uberScheduler/screenshots/home-screen.png)
![Uber Scheduler screenshot Kevin Hou project general settings](https://khou22.github.io/media/projects/uberScheduler/screenshots/general-settings.png)
![Uber Scheduler screenshot Kevin Hou project schedule configuration](https://khou22.github.io/media/projects/uberScheduler/screenshots/schedule-configuration.png)
![Uber Scheduler screenshot Kevin Hou project fare estimate](https://khou22.github.io/media/projects/uberScheduler/screenshots/fare-estimate.png)
