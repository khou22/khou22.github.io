---
layout: post
title: "Xcode Best Practices July 2016: Troubleshooting, Pull Requests, and More"
author: "Kevin Hou"
date: 2016-07-20 11:30:53
description: "A few coding best practices that I learned in the past couple of weeks from my manager and mentor. These are primarily Xcode-oriented but can easily be applied to other languages and IDE's"
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: Programming
tags: [ios, swift, apps, xcode]
featured: "yes"
---
<h3 class="post-subheader">Troubleshooting Xcode</h3>
Xcode can be a great IDE with powerful tools like autocompletion, but sometimes it does have a tendency to “break.” Errors that pertain to linking are often examples of Xcode glitching out and temporarily self-imploding. These issues can be solved by following these steps:
<ol>
  <li>Clean: Command + Shift + K</li>
  <li>Deep Clean: Command + Option + Shift + K</li>
  <li>Delete derived data: These are like Xcode’s caches and builds. Each project has a derived data file. To wipe these clean, go to your finder. Hold option, click “Go” in the taskbar, and select “Library.” Next, go to Developer/Xcode/DerivedData/. Select all the files within that folder and delete them by moving them to the trash.</li>
  <li>Quit Xcode</li>
  <li>(Attempt to) rebuild your project</li>
</ol>

<br class="post-line-break">
<h3 class="post-subheader">Pull Requests</h3>
Git and other version control systems can be confusing things. I, along with most of the developers I know, use GitHub for version control and collaboration on projects. I use GitHub on the daily (I have almost a 300 day commit streak on GitHub right now) and am still intimidated by pull requests. From what I understand, they’re essentially clean ways of merging two branches and grouping commits together.
<br class="post-line-break">
When working in groups settings, this is incredibly useful both in a developer sense and a moderator sense. The code is branched so it does not accidentally break the master branch (good when you’re updated a popularly used repo or working on a group project). Usually pull requests are significant features or builds. All commit made during a pull request are also grouped together and can easily be reviewed all together by the person who is reviewing the pull request. On GitHub, you can comment on pull requests do other discussion-based actions until the code meets satisfaction and can be integrated into the main branch.

<br class="post-line-break">
<h3 class="post-subheader">Using Structures for Global Constants</h3>
In addition to using structures to store file names as I mentioned in an <a href="http://khou22.github.io/programming/2016/07/20/swift-tips-and-tricks-july-2016-extensions-structures-and-outlet-collections.html" target="_blank">earlier blog post</a>, it is good practice to create a file, usually named "Constants.swift", containing global structures to store values. These constants are usually accessed by multiple view controllers and make it easier to standardize. It's similar to the difference between CSS and SASS. In CSS, you must re-type the values every time, but in SASS you can create and use variables. It makes modifying values much, much easier. Here is an example of standardized colors:
<br class="post-line-break">
<b>Declaration</b>
{% highlight swift %}
struct Colors {
    static let mainColor     = UIColor(red: 225.0/255.0, green: 105.0/255.0, blue: 15.0/255.0, alpha: 1.0)
    static let darkGrey       = UIColor(red: 100.0/255.0, green: 100.0/255.0, blue: 100.0/255.0, alpha: 1.0)
    static let grey              = UIColor(red: 230.0/255.0, green: 230.0/255.0, blue: 230.0/255.0, alpha: 1.0)
    static let lightGrey       = UIColor(red: 207.0/255.0, green: 207.0/255.0, blue: 207.0/255.0, alpha: 1.0)
}
{% endhighlight %}
<br class="post-line-break">
<b>Usage</b><br>
Instead of typing in the same RGB values every instance you need a specific color, you can simply call:
{% highlight swift %}
let backgroundColor = Colors.mainColor
// It's very easy to change an entire projects theme color simply by modifying a single value in the Constants.swift file
{% endhighlight %}
<br class="post-line-break">
<b>Other Application</b><br>
Other useful things to store in structures in the Constants.swift file include: screen size (SCREEN_WIDTH = UIScreen.main().bounds.size.width), device types, file names, image names, API keys, storyboard IDs, segue IDs, and any other global constants. It's good practice to do this and I encourage you to try it out. It'll make your life signficantly easier in the long run.

<br class="post-line-break">
<h3 class="post-subheader">Commenting on Code and Readability</h3>
Commenting code is one of those practices that is well known, yet not well performed. It’s incredibly important in both personal and team settings. While most people at least understand the necessity, fewer strive for code readability. It is better practice to write readable code with fewer comments using function names, variable names, etc. than to write confusing code with paragraphs of comments. If you've ever looked at my code, I am obviously guilty of this and I think the majority of developers could be more conscious about it.
<br class="post-line-break">
Code readability also includes <a href="https://en.wikipedia.org/wiki/Code_refactoring" target="_blank">code refactoring</a> — the process of a restructuring existing code but not changing it's actual function. To a user, refactoring code should go unnoticed with the exception of maybe load times, speed, etc. It is important to make sure your code is concise as well as well commented and readable. Avoid hard coding and use "for" loops when you can. Another element of this (I'm not sure if this is technically considered refactoring because it's not so much resturcting) is to remove all print statements and breakpoints once the specific feature is completed and working properly.

<br class="post-line-break">
<h3 class="post-subheader">Cocoapods</h3>
Cocoapods are good and bad depending on who you are. For those that don’t know, cocoapods are libraries built by third parties that you can integrate in your Xcode project with minimal difficulty. They’re similar to Node packages, Python modules, etc.
<br class="post-line-break">
When developing web apps, I love using libraries, especially Node packages; however, there is a danger in using third party code. Even though it makes your life much easier, in the long run, it could break your app or website. For example, one developer broke thousands of projects by changing 11 lines in their package. It’s a hilariously <a href="http://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/" target="_blank">realistic and daunting story</a> that could apply to your app, but in a smaller scale.
<br class="post-line-break">
The reason why some are opposed to Cocoapods (including one of my coworkers), is exactly that. If you have too many third party libraries, one mess up could break your project and it would be an ordeal to sift through hundreds of libraries and thousands of files in order to find what was responsible for bringing down your app.
<br class="post-line-break">
In my opinion, I think you should strike a balance. Cocoapods and other package managers are very useful and take a lot of the heavy lifting out of tasks for developers, but at the same time it’s dangerous to become ultra-reliant on them. You do not want your precious project to be held up entirely by code that you don’t have control over.
<br class="post-line-break">
<br class="post-line-break">
I hope you found this post useful. I’m learning a lot about Xcode and especially about how to work in teams. There’s always room for growth and everyone can get better at it. Talk to you in the next one!
