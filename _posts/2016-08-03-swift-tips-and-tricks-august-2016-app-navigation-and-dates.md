---
layout: post
title: "Swift Tips and Tricks August 2016: App Navigation and Dates"
author: "Kevin Hou"
date: 2016-08-03 13:45:22
description: "A blog post covering some useful extensions and commands relating to code-based view controller navigation and date types."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: ios
tags: [ios, swift, apps, xcode]
featured: "no"
---
<h3 class="post-subheader">Dates</h3>
Dates can be pretty difficult to deal with sometimes simply because they’re technically numbers, but at the same time you have to worry about localization, converting to strings, etc. In the project I was working on for my summer internship, I had to deal with a lot of date-related algorithms so I came up with three functions that I figured could be useful to others. These three are in my NSDate extension so calling them is very simple
<br class="post-line-break">
<b>Removing the time from a date so that all dates are from midnight that day.</b><br>
{% highlight swift %}
func dateWithoutTime() -> NSDate {
  let dateFormatter = NSDateFormatter()
  dateFormatter.dateStyle = .MediumStyle // Doesn't include time component
  let dateToPrint: NSString = dateFormatter.stringFromDate(self) as NSString // Format into medium style string
  let dateNoTime = dateFormatter.dateFromString(dateToPrint as String) // Get a date from midnight that day
  return dateNoTime!
}
{% endhighlight %}
<br>
Usage:<br>
{% highlight swift %}
let currentDateNoTime = NSDate().dateWithoutTime()
{% endhighlight %}
<br class="post-line-break">
<b>Returning the date from “x” days ago:</b><br>
{% highlight swift %}
func daysAgo(daysAgo: Int) -> NSDate {
  let result = -24 * 60 * 60 * Double(daysAgo)
  return self.dateByAddingTimeInterval(result)
}
{% endhighlight %}
<br>
Usage:<br>
{% highlight swift %}
let sevenDaysAgo = NSDate().daysAgo(7)
{% endhighlight %}
<br class="post-line-break">
<b>Sort an array by time:</b><b>
{% highlight swift %}
// recentSample is an array of HKQuantitySamples with the property: startDate
recentSample?.sortInPlace({
  $0.0.startDate.timeIntervalSinceNow > $0.1.startDate.timeIntervalSinceNow // Sort by time
})
{% endhighlight %}

<br class="post-line-break">
<h3 class="post-subheader">View Navigation</h3>
Navigation between different screens in your app can be confusing, with many different options, methods, and structure to choose from. There are four main types of navigation:
<ul>
  <li>Modal UIViewController — this is the simplest and most straightforward solution. It simply presents another view controller over the previous.</li>
  <li>UIPageControl — this is the familiar side swiping style in which multiple views are presented side-by-side and can be accessed by swiping left or right. I covered the basics in an old <a href="http://khou22.github.io/programming/2016/06/28/making-a-simple-page-based-application-in-swift.html" target="_blank">blog post</a></li>
  <li>UITabBarController — this is the structure of many multi-page, multi-sectioned apps like Facebook, Instagram, Photos, Music, and Twitter. They allow you to have multiple sections in your app and provide you with a simple, intuitive way of navigating via a tool bar.</li>
  <li>Custom — you really have to know what you’re doing if you want to create a custom navigation controller. It can be great for certain use cases, but it’s real pain if you’re collaborating with others because nothing is standardized.</li>
</ul>
<br class="post-line-break">
A quick, one-line command that has been very useful in my work so far is:<br>
{% highlight swift %}
self.navigationController?.popViewControllerAnimated(true)
{% endhighlight %}
<br class="post-line-break">
It essentially takes the user back to the previous screen. I don’t swear to know exactly what’s going on behind the scenes, but I think this works because of the way Apple organizes views. Views are arranged in a stack with the topmost being visible. This view is then “popped” and removed — revealing the view beneath that. That’s the general idea and this command is very versatile and widely-used. For more on view controllers, I found this site very useful: <a href="https://makeapppie.com/2014/09/15/swift-swift-programmatic-navigation-view-controllers-in-swift/" target="_blank">https://makeapppie.com/2014/09/15/swift-swift-programmatic-navigation-view-controllers-in-swift/</a>.
<br class="post-line-break">
One last trick I learned with view controllers is how to pass information from one to another. A good example is to think about the Amazon app. When you browse for a product and finally click on one, you are taken to another page that reveals details about that specific product you chose. Obviously, they’re not going to make a new view controller for every single product — they’re simply using a template which they then populate according to the product details. They pass the product ID number from the browsing view controller to the detail view controller, then pull the detailed information from the server.
<br class="post-line-break">
In order to know which product you choose, the view controller you browsed in must pass some sort of ID to the detail view controller to indicate which product you chose. This type of interaction (passing information from the parent view controller to the child view controller) is very common and is very simple to do if you are navigating using segues.
<br class="post-line-break">
When segueing, the function exposes the upcoming view controller as a parameter called “segue”:
{% highlight swift %}
override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
  if (segue.identifier == "StepsToGraphSegue") {
    let destinationVC = segue.destinationViewController as! GraphScreen
    destinationVC.title = “Hello World”
  }
}
{% endhighlight %}
<br class="post-line-break">
The view controller we are segueing to is the “GraphScreen” and has the property, “title” as a String. Just before segueing, you can pass any data from the first view controller into the second by setting a variable in the second view controller. I would like to do a blog post exclusively on app navigation techniques in the future.
<br class="post-line-break">
I hope you found this blog post helpful! See you in the next one.
