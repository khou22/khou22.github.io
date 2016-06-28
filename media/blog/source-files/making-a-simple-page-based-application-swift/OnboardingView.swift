//
//  OnboardingView.swift
//  SwiftOnboardingPractice
//
//  Created by Breathometer on 6/28/16.
//  Copyright © 2016 KevinHou. All rights reserved.
//

import Foundation
import UIKit

class OnboardingPager: UIPageViewController {
    
    func getPageOne() -> PageOne {
        // Retrieve the view
        return storyboard!.instantiateViewControllerWithIdentifier("PageOne") as! PageOne
    }
    
    func getPageTwo() -> PageTwo {
        // Retrieve page two
        return storyboard!.instantiateViewControllerWithIdentifier("PageTwo") as! PageTwo
    }
    
    override func viewDidLoad() {
        print("View did load")
        
        // Loads the first page immediately after the pager loads
        setViewControllers([getPageOne()], direction: .Forward, animated: false, completion: nil)
        
        // Set dataSource: incorporates the pages
        dataSource = self // Refers to the OnboardingPager extension of type UIPageViewControllerDataSource

        view.backgroundColor = .lightGrayColor() // Set background color to white
    }
}

extension OnboardingPager: UIPageViewControllerDataSource {
    
    // ********* Sets up the page flow *********
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
    
    // ********* Sets up the page control dots *********
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
}