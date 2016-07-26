---
layout: post
title: "Swift Segmented Control Basics: How to Setup and Utilize Segmented Controls"
author: "Kevin Hou"
date: 2016-07-26 14:13:16
description: "A short tutorial on segmented controls in Swift as well as a brief explanation on why I write these blog posts."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: programming
tags: [ios, swift, apps, xcode]
featured: "no"
---
<h3 class="post-subheader">Introduction</h3>
I’m beginning to dive deeper and deeper into Swift and iOS development, but I came to the realization a couple days ago that my summer internship at Breathometer is already drawing to a close. My goal for the summer was to be able to develop my own apps from scratch by the time I leave. I’m slowly but surely gaining the confidence the and the technical prowess to be able to make more and more complex apps.
<br class="post-line-break">
I’ve already learned some of the key parts of most apps like views, outlets, structures, pagination, table views, animations, 3rd party integration, threading, push notifications, graphing, localization, and more. Another basic piece of any app is segmentation. Everyone’s used an app with the familiar segmented control bar — many of Apple’s stock apps use this component:
<br class="post-line-break"><img src="http://kintek.com.au/assets/UISegmentedControl_Button_iOS7.jpg" width="300px">
<br class="post-line-break">
<br class="post-line-break">
In this blog post, I will be covering the basics of segmented controls and how to use them within an app. Like I’ve mentioned in other blog posts, the intent of these posts is not only to instruct others, but also to help me internalize what I’ve learned and give me a place that I can reference later. I guess I’ll call it my “modern” notebook. So, without further ado, here are some of the key parts of segmented controls.
<br class="post-line-break">
<h3 class="post-subheader">Setup Storyboard</h3>
Drag a “Segmented Control” component into the main view and apply constraints if needed. Use the right sidebar options to name the different segmented buttons.
<br class="post-line-break">
<h3 class="post-subheader">Initiate the Segmented Control</h3>
Open up the Assistant editor and pull up the view’s View Controller. Ctrl click and drag to create an outlet (object, not action) for the segmented control component. Name it whatever you want (in this case we’ll call it “segmentedControl”) and use the type UISegmentedControl, storage weak.
<br class="post-line-break">
<h3 class="post-subheader">Adding Functionality</h3>
Using the same window setup, ctrl click and drag to create an outlet Action with the event: “Value Changed.” Again, give it a name (here I’ll be using “indexChanged”) and set type to UISegmentedControl and arguments to sender. This action function will be triggered every time the index is changed. In order to get the value it was changed to, you must call the “segmentedControl” object we created earlier and call the “selectedSegmentIndex.” Here’s an example:<br class="post-line-break">
{% highlight swift %}
@IBAction indexChanged(sender:UISegmentedControl) {
    switch segmentedControl.selectedSegmentIndex { // Get the selected index
        case 0:
            print(“Picked first segment”)
        case 1:
            print(“Picked second segment”)
        default:
            Break;
    }
}
{% endhighlight %}
<br class="post-line-break">
<br class="post-line-break">
That’s about all there is to it! They’re very simple and straightforward, but can be very useful and powerful in the right situation. I’ve noticed that a common use case is when you want to apply different filters onto data sets. In my project right now, I am segmenting data by time into “Week,” “Month,” and “Year.” Those three options serve as my segments and my UITableView updated every time my index changes. Other use cases include contact filtering, segmenting information into categories on the same view controller, etc. Hope you found this helpful!
<br class="post-line-break">
Tutorial primarily from: <a href="http://www.ioscreator.com/tutorials/segmented-control-tutorial-ios8-swift" target="_blank">http://www.ioscreator.com/tutorials/segmented-control-tutorial-ios8-swift</a>
