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
<h3 class="post-subheader">Preventing Code-Breaking Typos</h3>
A common, and easily preventable, mistake in coding is to misspell image names, file paths, and other strings that could break your code. My coworker taught me this simple trick using structures to diminish the likelihood that this would happen. Essentially, you create a structure called “Images” or “FileNames” that contains all the file name strings. Instead of typing out the string every time, which can result in typos, call the variable within the structure that contains that specific file name. This way, all the strings are in one place and can easily be checked for misspellings. Here’s an example of the situation described above:
<br class="post-line-break">
<b>Declaration</b>
{% highlight swift %}
struct Images {
    static let onboardingBackgroundImg  = "onboarding-background-img"
    static let filledPlotPoint          = "filled-plot-point"
}
{% endhighlight %}
<br class="post-line-break">
<b>Usage:</b>
{% highlight swift %}
let exampleImage = UIImageView() // Initialize the image view
exampleImage.image = UIImage(named: Images.onboardingBackgroundImg) // Set the image
{% endhighlight %}

<br class="post-line-break">
<h3 class="post-subheader">Commenting on Code and Readability</h3>
Commenting code is one of those practices that is well known, yet not well performed. It’s incredibly important in both personal and team settings. While most people at least understand the necessity, fewer strive for code readability. It is better practice to write readable code with fewer comments using function names, variable names, etc. than to write confusing code with paragraphs of comments. I am obviously guilty of this and I think the majority of developers could be more conscious about it.

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
