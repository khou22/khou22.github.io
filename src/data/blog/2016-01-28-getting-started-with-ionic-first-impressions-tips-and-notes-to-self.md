---
title: "Getting Started with Ionic: First Impressions, Tips, and Notes to Self"
author: "Kevin Hou"
date: 2016-01-28 20:38:34
description: "Some useful commands for Ionic"
image: "/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [ionic]
featured: false
---

## Working on the Project
Open server:
```bash
dev_appserver.py Uber
```

## Run the Project
To run a project locally. This will automatically reload when a file is saved/modified.
```bash
ionic serve
```

To run in xcode simulator. This will automatically start the iPhone 6 simulator and run your app.
```bash
ionic run ios -l -c -s
```

To get it on "Ionic View" for my iPhone. This will upload your project to your online account and make it accessible via your iPhone "Ionic View" app.
```bash
ionic upload
```

## Opening the Project in Xcode
Open the xcode project on xcode. Will allow you to build and sync it to your device.
/Users/KevinHou/Documents/Programming/UberScheduler/UberScheduler/platforms/ios
Then click run

## Logging Into Ionic (Command Line)
To log in to Ionic. This will allow you to upload your app to Ionic view.
```bash
ionic login
```

## Starting a New Ionic Project
Good reference for starting a new Ionic project:
[Link](http://stackoverflow.com/questions/30518213/error-uploading-ionic-app)
