---
layout: post
title: "Making a Simple Page Based Application in Swift"
author: "Kevin Hou"
date: 2016-06-28 15:10:08
description: "A quick tutorial on how to make a bare-bones page-based application in Xcode 7.3 using Swift."
category: Programming
tags: [ios, swift]
featured: "yes"
---
<h3 class="post-subheader">Introduction</h3>
I’ve been starting to hunker down and learn the basics of Swift. Because my current project at work is to build an onboarding screen, there will likely be some sort of side scrolling element to it — similar to an iPhone homescreen. Because I knew no Swift-specific data structures, principles, etc. going into this, I was learning from the ground up. It was initially really challenging because I had no basic knowledge to go off of. The intent of this side project was to learn the fundamentals of Swift, especially how Views work.

<br class="post-line-break">

Like all programmers, I googled my way through this project. This <a href="http://www.thorntech.com/2015/08/need-to-create-an-onboarding-flow-for-your-mobile-app-heres-how-to-do-it-using-uipageviewcontroller-in-swift/" target="_blank">tutorial</a> turned out to be a gold mine, but there were plenty of visits to StackOverflow and Apple’s developer documentation.

<br class="post-line-break">
<h3 class="post-subheader">Tutorial</h3>

<ol>
<li class="blog-tutorial-step">I started by creating a single view application. Instead of selecting the “Page-Based Application” template, I decided it would be best to start from scratch so that I could really understand the meat of what was going on. I created a simple landing page with a button that would connect to the “Pager” — the page view controller that houses all of the screens that would populate the side-scrolling view.</li>

<li class="blog-tutorial-step">
Next, create the “Pager” by dragging a “Page View Controller” next to the main “View Controller”. You also should create a file named “Pager.swift”, import the UIKit module, and create a UIPageViewController class like so:
{% highlight swift %}
Import UIKit
class Pager: UIPageViewController {

}
{% endhighlight %}
</li>

<li class="blog-tutorial-step">
Go to your Main.storyboard, select the Page View Controller, and using the options on the right side, set the class to “Pager.” This connects the storyboard pager view controller element to your Pager.swift code. Also ensure that the “Transition Style” is set to “Scroll.”</li>

<li class="blog-tutorial-step">
To reach the “Pager” in the user flow, right click (or control click) the button on the “View Controller” and drag it over the the “Pager.” This will generate a list of potential segue options. Segues are essentially roads between views. In this case, I went with a Show Detail (e.g. Replace) segue. If you build and run this application and press the button, you will be greeted by a blank screen. Don’t worry, we’ll now populate the pager screen.</li>

<li class="blog-tutorial-step">
Create two more swift files named “PageOne.swift” and “PageTwo.swift”. Create a view controller in each:
{% highlight swift %}
import UIKit

class PageOne: UIViewController {  // For the second page name it ‘PageTwo’
    override func viewDidLoad() {
        print("First page did load")
    }
}
{% endhighlight %}
</li>

<li class="blog-tutorial-step">
Create two view controllers in your Main.storyboard. They do not need to have a segue from any other page. Just change the class to PageOne or PageTwo so that they connect to your swift files. You should also change the Storyboard ID to match the class name for each View Controller.</li>

<li class="blog-tutorial-step">
Now, we will be working in the Pager.swift file to build the actual page-based functionality. In order to access the PageOne and PageTwo views, we create two shortcut functions that significantly condense our code in the future. Create these functions inside of your Pager class:
{% highlight swift %}
func getPageOne() -> PageOne {
        // Retrieve the view
        return storyboard!.instantiateViewControllerWithIdentifier("PageOne") as! PageOne
    }

    func getPageTwo() -> PageTwo {
        // Retrieve page two
        return storyboard!.instantiateViewControllerWithIdentifier("PageTwo") as! PageTwo
    }
{% endhighlight %}
</li>

<li class="blog-tutorial-step">
We want to set our default page to page one. In our viewDidLoad() function for the class Pager, set the first page to page one.
{% highlight swift %}
// Loads the first page immediately after the pager loads
setViewControllers([getPageOne()], direction: .Forward, animated: false, completion: nil)
{% endhighlight %}
</li>

<li class="blog-tutorial-step">
To populate our pager, we must create an extension of the Pager with type: UIPageViewControllerDataSource. A Page View Controller relies on the dataSource to allow users to not only swipe between/access pages, but also to create the famous page control dots that iPhone users have grown accustomed to. Your Pager extension should look like this:
{% highlight swift %}
extension Pager: UIPageViewControllerDataSource {

}
{% endhighlight %}
</li>

<li class="blog-tutorial-step">
To allow users to swipe, you must set up the prebuilt functions viewControllerAfterViewController and viewControllerBeforeViewController. It essentially recognizes which way you are scrolling to, and sets the new page. Add these two functions to your Pager extension:
{% highlight swift %}
func pageViewController(pageViewController: UIPageViewController, viewControllerAfterViewController viewController: UIViewController) -> UIViewController? {
        // Swiping forward

        if viewController.isKindOfClass(PageOne) { // If you're on page one
            // We want to swipe to page two
            return getPageTwo()
        } else { // If on page two
            // End of all pages
            return nil
        }
    }

func pageViewController(pageViewController: UIPageViewController, viewControllerBeforeViewController viewController: UIViewController) -> UIViewController? {
        // Swiping backward

        if viewController.isKindOfClass(PageTwo) {
            // If on page two, can swipe back to page one
            return getPageOne()
        } else {
            // If on the first page, can't swipe back
            return nil
        }
    }
{% endhighlight %}
</li>

<li class="blog-tutorial-step">
Right below those functions, we want to create the page control dots:
{% highlight swift %}
    func presentationCountForPageViewController(pageViewController: UIPageViewController) -> Int {
        // The number of dots in the page control dots
        return 2
    }

    func presentationIndexForPageViewController(pageViewController: UIPageViewController) -> Int {
        // On the first dot when you first load the OnboardingPager
        // Swift automatically handles switching pages and updating the page control dots
        // Updates when setViewControllers is called
        return 0
    }
{% endhighlight %}
</li>

<li class="blog-tutorial-step">
Lastly, we want to connect the dataSource to the extension by calling:
{% highlight swift %}
// Set dataSource: incorporates the pages
        dataSource = self // Refers to the Pager extension of type UIPageViewControllerDataSource
{% endhighlight %}
</li>

<li class="blog-tutorial-step">
I also recommend setting a background color to the Pager so that the page control dots can be visible. Do this inside of your class Pager: UIPageViewController’s function viewDidLoad().
{% highlight swift %}
view.backgroundColor = .lightGrayColor() // Set background color to white
{% endhighlight %}
</li>
</ol>

<h3 class="post-subheader">Source Files</h3>
Here are some of the key, completed source files (note: I named the Pager “OnboardingPager” instead of “Pager” as I stated in the tutorial):
<ul>
  <li><a href="./../../../../media/blog/source-files/making-a-simple-page-based-application-swift/ViewController.swift" download>ViewController.swift</a></li>
  <li><a href="./../../../../media/blog/source-files/making-a-simple-page-based-application-swift/OnboardingView.swift" download>OnboardingView.swift</a></li>
  <li><a href="./../../../../media/blog/source-files/making-a-simple-page-based-application-swift/PageOne.swift" download>PageOne.swift</a></li>
  <li><a href="./../../../../media/blog/source-files/making-a-simple-page-based-application-swift/PageTwo.swift" download>PageTwo.swift</a></li>
</ul>
