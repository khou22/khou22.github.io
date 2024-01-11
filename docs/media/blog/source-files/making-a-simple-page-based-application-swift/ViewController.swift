///
//  ViewController.swift
//  SwiftOnboardingPractice
//
//  Created by Breathometer on 6/23/16.
//  Copyright © 2016 KevinHou. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    // Objects
    @IBOutlet weak var SlimTitle: UILabel!
    @IBOutlet weak var ValueProp: UILabel!
    @IBOutlet weak var BreathometerLabel: UILabel!
    @IBOutlet weak var Graph: UIImageView!
    @IBOutlet weak var BeginButton: UIButton!
    
    // Constraints
    @IBOutlet weak var SlimTitleVerticalConstraint: NSLayoutConstraint!
    
    @IBAction func BeginOnboarding(sender: AnyObject) {
        print("Button pressed")
    }
    
    func runOpeningAnimation() {
        print("Opening animation running")
        self.Graph.alpha = 0 // Graph starts transparent
        self.BreathometerLabel.alpha = 0
        self.ValueProp.alpha = 0
        self.SlimTitleVerticalConstraint.constant = -80
        self.view.layoutIfNeeded()
        
        self.SlimTitleVerticalConstraint.constant = -200
        
        UIView.animateWithDuration(2.0, delay: 0, options: [.CurveEaseInOut], animations: ({
            
            self.view.layoutIfNeeded()
            
        }), completion: { (complete: Bool) in
            print("Opening animation complete")
            UIView.animateWithDuration(2.0, animations: ({
                self.Graph.alpha = 1 // Graph starts transparent
                self.BreathometerLabel.alpha = 1
                self.ValueProp.alpha = 1
            }))
        })
        
        // Recognize swipes
        let swipeDown = UISwipeGestureRecognizer(target: self, action: #selector(ViewController.respondToSwipeGesture(_:)))
        swipeDown.direction = UISwipeGestureRecognizerDirection.Down
        self.view.addGestureRecognizer(swipeDown)
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "SegueToOnboarding"
        {
            print("Seguing to the onboarding screens")
        }
    }
    
    
    func respondToSwipeGesture(gesture: UIGestureRecognizer) {
        if let swipeGesture = gesture as? UISwipeGestureRecognizer {
            switch swipeGesture.direction {
            case UISwipeGestureRecognizerDirection.Down:
                print("Swiped down")
            case UISwipeGestureRecognizerDirection.Up:
                print("Swiped up")
            default:
                break
            }
        }
    }
    
    override func viewDidAppear(animated: Bool) {
        // Run any animations here
        
        runOpeningAnimation()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

