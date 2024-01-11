---
layout: post
title: "Swift Tips and Tricks July 2016: Extensions, Structures, and Outlet Collections"
author: "Kevin Hou"
date: 2016-07-20 11:05:04
description: "An overview of some of the major topics I learned in the past week or so: extensions, structures, and outlet collections. I had to use these a lot in my project for work and I figured I would share."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: ios
tags: [swift, xcode, tutorial, sourceCode]
featured: "no"
---
<h3 class="post-subheader">Extensions</h3>
Extensions are a great way of creating custom, and most importantly, global, functions attached to certain variable types. For example, a good example of this is when you want to use a UIColor derived from a hex value as opposed to an rgb value. Another (less useful) example is if you want to create a function that deletes the second letter of a string or returns the number of 2’s in a number. These types of functions can be accomplished through extensions. They essentially allow for custom functions and properties, but their real strenth is that they’re global. They’re lightweight and make your code very readable. Here is the hex example and usage:
<br class="post-line-break">
<b>Declaration</b>
{% highlight swift %}
extension Int { // Can attach it to any Int value
    func hexToColor() -> UIColor {
        let netHex = self // ‘self’ refers to the value the function is attached to
        let red = Float((netHex >> 16) & 0xff)
        let green = Float((netHex >> 8) & 0xff)
        let blue = Float(netHex & 0xff)
        return UIColor(colorLiteralRed: red / 255.0, green: green / 255.0, blue: blue / 255.0, alpha: 1.0)
    }
}
{% endhighlight %}
<br class="post-line-break">
<b>Usage:</b>
{% highlight swift %}
let backgroundColor: UIColor = 0x222222.hexToColor()
{% endhighlight %}

<br class="post-line-break">
<h3 class="post-subheader">Structures</h3>
Structures operate similarly to extensions in the sense that they’re globally accessible. They allow the user to create global functions and variables, but unlike extensions, they do not have to be attached to a specific variable type. It is simply called by the name of the structure and the ensuing variable/function name. Here is a simple example:
<br class="post-line-break">
<b>Declaration</b>
{% highlight swift %}
struct MyData {
    static var exampleVal: string = “Hello world”
    static func greet(name: string) {
        print(“Hello \(name)”)
    }
}
{% endhighlight %}
<br class="post-line-break">
<b>Usage:</b>
{% highlight swift %}
let val = MyData.exampleVal // Hello World
let name = “Kevin” // Kevin
MyData.greet(name) // Hello Kevin
{% endhighlight %}

<br class="post-line-break">
<h3 class="post-subheader">Preventing Code-Breaking Typos with Structures</h3>
A common, and easily preventable, mistake in coding is to misspell image names, file paths, and other strings that could break your code. My coworker taught me this simple trick using structures to diminish the likelihood that this would happen. Essentially, you create a structure called “Images” or “FileNames” that contains all the file name strings. Instead of typing out the string every time, which can result in typos, call the variable within the structure that contains that specific file name. This way, all the strings are in one place and can easily be checked for misspellings. Here’s an example of the situation described above:
<br class="post-line-break">
<b>Declaration</b>
{% highlight swift %}
struct Images {
    // It can be useful to line them up in columns
    static let onboardingBackgroundImg  = "onboarding-background-img"
    static let filledPlotPoint                         = "filled-plot-point"
}
{% endhighlight %}
<br class="post-line-break">
<b>Usage:</b>
{% highlight swift %}
let exampleImage = UIImageView() // Initialize the image view
exampleImage.image = UIImage(named: Images.onboardingBackgroundImg) // Set the image
{% endhighlight %}

<br class="post-line-break">
<h3 class="post-subheader">Outlet Collections</h3>
This is a small feature in Xcode that helps you refactor your code, making it look cleaner and more readable. In the app I was building, I had five UIImageViews that I essentially treated the same — mass editing their properties. Initially, it took five lines of code, one for each image, to modify them. As an experienced coder, this felt wrong and looked wrong. The lines were basically all the same except for the names of the variables. I discovered you could group different storyboard elements together in an outlet collection — an array of UI elements. Now I could cycle through the array using a ‘for’ loop and easily make mass edits. Here’s an example:
<br class="post-line-break">
<b>Declaration</b>
{% highlight swift %}
@IBOutlet var flyingIcons: [UIImageView]! // Right-click and drag from this outlet to the UIImageView you would like to include in this array
{% endhighlight %}
<br class="post-line-break">
<b>Usage</b>
{% highlight swift %}
for icon in flyingIcons {
            icon.alpha = 0.75
        }
}
{% endhighlight %}
