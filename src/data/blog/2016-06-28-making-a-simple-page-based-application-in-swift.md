---
title: "Making a Simple Page Based Application in Swift"
author: "Kevin Hou"
date: 2016-06-28 15:10:08
description: "A quick tutorial on how to make a bare-bones page-based application in Xcode 7.3 using Swift."
tags: [coding, mobile, tutorial]
---

## Introduction

I’ve been starting to hunker down and learn the basics of Swift. Because my current project at work is to build an onboarding screen, there will likely be some sort of side scrolling element to it — similar to an iPhone homescreen. Because I knew no Swift-specific data structures, principles, etc. going into this, I was learning from the ground up. It was initially really challenging because I had no basic knowledge to go off of. The intent of this side project was to learn the fundamentals of Swift, especially how Views work.

Like all programmers, I googled my way through this project. This [tutorial](http://www.thorntech.com/2015/08/need-to-create-an-onboarding-flow-for-your-mobile-app-heres-how-to-do-it-using-uipageviewcontroller-in-swift/) turned out to be a gold mine, but there were plenty of visits to StackOverflow and Apple’s developer documentation.

## Tutorial

1. I started by creating a single view application. Instead of selecting the “Page-Based Application” template, I decided it would be best to start from scratch so that I could really understand the meat of what was going on. I created a simple landing page with a button that would connect to the “Pager” — the page view controller that houses all of the screens that would populate the side-scrolling view.

2. Next, create the “Pager” by dragging a “Page View Controller” next to the main “View Controller”. You also should create a file named “Pager.swift”, import the UIKit module, and create a UIPageViewController class like so:

    ```swift
    Import UIKit
    class Pager: UIPageViewController {

    }
    ```

3. Go to your Main.storyboard, select the Page View Controller, and using the options on the right side, set the class to “Pager.” This connects the storyboard pager view controller element to your Pager.swift code. Also ensure that the “Transition Style” is set to “Scroll.”

4. To reach the “Pager” in the user flow, right click (or control click) the button on the “View Controller” and drag it over the the “Pager.” This will generate a list of potential segue options. Segues are essentially roads between views. In this case, I went with a Show Detail (e.g. Replace) segue. If you build and run this application and press the button, you will be greeted by a blank screen. Don’t worry, we’ll now populate the pager screen.

5. Create two more swift files named “PageOne.swift” and “PageTwo.swift”. Create a view controller in each:

    ```swift
    import UIKit

    class PageOne: UIViewController {  // For the second page name it ‘PageTwo’
        override func viewDidLoad() {
            print("First page did load")
        }
    }
    ```

6. Create two view controllers in your Main.storyboard. They do not need to have a segue from any other page. Just change the class to PageOne or PageTwo so that they connect to your swift files. You should also change the Storyboard ID to match the class name for each View Controller.

7. Now, we will be working in the Pager.swift file to build the actual page-based functionality. In order to access the PageOne and PageTwo views, we create two shortcut functions that significantly condense our code in the future. Create these functions inside of your Pager class:

    ```swift
    func getPageOne() -> PageOne {
            // Retrieve the view
            return storyboard!.instantiateViewControllerWithIdentifier("PageOne") as! PageOne
        }

        func getPageTwo() -> PageTwo {
            // Retrieve page two
            return storyboard!.instantiateViewControllerWithIdentifier("PageTwo") as! PageTwo
        }
    ```

8. We want to set our default page to page one. In our viewDidLoad() function for the class Pager, set the first page to page one.

    ```swift
    // Loads the first page immediately after the pager loads
    setViewControllers([getPageOne()], direction: .Forward, animated: false, completion: nil)
    ```

9. To populate our pager, we must create an extension of the Pager with type: UIPageViewControllerDataSource. A Page View Controller relies on the dataSource to allow users to not only swipe between/access pages, but also to create the famous page control dots that iPhone users have grown accustomed to. Your Pager extension should look like this:

    ```swift
    extension Pager: UIPageViewControllerDataSource {

    }
    ```

10. To allow users to swipe, you must set up the prebuilt functions viewControllerAfterViewController and viewControllerBeforeViewController. It essentially recognizes which way you are scrolling to, and sets the new page. Add these two functions to your Pager extension:

    ```swift
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
    ```

11. Right below those functions, we want to create the page control dots:

    ```swift
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
    ```

12. Lastly, we want to connect the dataSource to the extension by calling:

    ```swift
    // Set dataSource: incorporates the pages
            dataSource = self // Refers to the Pager extension of type UIPageViewControllerDataSource
    ```

13. I also recommend setting a background color to the Pager so that the page control dots can be visible. Do this inside of your class Pager: UIPageViewController’s function viewDidLoad().

    ```swift
    view.backgroundColor = .lightGrayColor() // Set background color to white
    ```

## Source Files

Here are some of the key, completed source files (note: I named the Pager “OnboardingPager” instead of “Pager” as I stated in the tutorial):

- [ViewController.swift](https://khou22.github.io/media/blog/source-files/making-a-simple-page-based-application-swift/ViewController.swift)
- [OnboardingView.swift](https://khou22.github.io/media/blog/source-files/making-a-simple-page-based-application-swift/OnboardingView.swift)
- [PageOne.swift](https://khou22.github.io/media/blog/source-files/making-a-simple-page-based-application-swift/PageOne.swift)
- [PageTwo.swift](https://khou22.github.io/media/blog/source-files/making-a-simple-page-based-application-swift/PageTwo.swift)
