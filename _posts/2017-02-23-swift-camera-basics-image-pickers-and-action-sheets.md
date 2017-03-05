---
layout: post
title: "Swift Camera Basics: Image Pickers and Action Sheets"
author: "Kevin Hou"
date: 2017-02-23 20:53:36
description: "An over on implementing camera selection and action sheets in Swift."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: Programming
tags: [ios, swift]
featured: "no"
---
I am designing and implementing a profile screen into Breathometer’s new app and one of the key components of many profile screens is a profile picture. I’m continuing to add to my toolbox of Swift skills so I set about learning how to get pictures from either the camera app or phone’s photo library.
<br class="post-line-break"><br>
We need to build some basic frontend components so that we can have control over our code:
ImageView: A view that our image from the camera/photo library will populate
Button: To control when we want to upload the image
<br class="post-line-break">
<h3 class="post-subheader">Setup View Controller Class</h3>
In order to use photos from the device, you must use the UIImagePickerControllerDelegate and the UINavigationControllerDelegate. These will give you the necessary functions to be able to retrieve your first image. The UIImagePickerControllerDelegate is responsible for initiating an image picker controller which then piggybacks with the UINavigationControllerDelegate that allows you to present the image picker using presentViewController() and dismissViewControllerAnimated(). Your view controller class should look like this:<br>
{% highlight swift %}
class ProfileScreen: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
}
{% endhighlight %}

<h3 class="post-subheader">Connect Storyboard to Code</h3>
Create an outlet for the imageView and an action outlet for the button:
{% highlight swift %}
@IBOutlet weak var profilePictureImageView: UIImageView! // Image view we want to display the image in
@IBAction func selectProfilePicture(sender: AnyObject) {
}
{% endhighlight %}

<h3 class="post-subheader">Setup Image Picker</h3>
Initialize the UIImagePickerController under the UIImageView outlet we created earlier:
{% highlight swift %}
let imagePicker = UIImagePickerController() // Initialize an image picker view controller type
{% endhighlight %}

Now we can create a function that will serve up the image picker. It accepts a sourceType as an input so that the image picker knows whether to show the actual camera interface or the photo library interface. There are three main parts in displaying an image picker: editing, source type, and presenting. Source type can be from the camera, the camera roll, or the photo library. The presentation component is what actually presents the imagePicker controller.
{% highlight swift %}
func pickImage(sourceType: UIImagePickerControllerSourceType) {
  imagePicker.allowsEditing = false // Prevent editing

  // Three sources: .PhotoLibrary, .Camera, .SavedPhotosAlbum
  self.imagePicker.sourceType = sourceType // Type of image selection

  // Presenting image picker view controller on top of stack
  self.presentViewController(self.imagePicker, animated: true, completion: {
      print("Opening image picker view controller")
  })
}
{% endhighlight %}

<h3 class="post-subheader">Create Action Sheet</h3>
We want the user to be able to specify if they want to use their camera or the photo library to select an image. We give them this option by creating an action sheet. An action sheet looks like this:<br>
<img class="iPhone-screenshots-medium" src="https://developer.apple.com/ios/human-interface-guidelines/images/action_sheets_2x.png" />

Because we want this action sheet to appear when the button is pressed, we place this bit of code in the action outlet. The code is straightforward and intuitive:
{% highlight swift %}
let imageSourcePicker = UIAlertController(title: "Select Profile Picture", message: "Please select an image picker method", preferredStyle: .ActionSheet) // Initialize action sheet type

let cameraAction = UIAlertAction(title: "Take a picture", style: .Default, handler: { action in
    self.pickImage(.Camera) // Presents picker
})

let cameraRoll = UIAlertAction(title: "Choose from camera roll", style: .Default, handler: { action in
    self.pickImage(.PhotoLibrary) // Presents picker
})

// Add actions
imageSourcePicker.addAction(cameraAction)
imageSourcePicker.addAction(cameraRoll)

presentViewController(imageSourcePicker, animated: true, completion: nil)
{% endhighlight %}

<h3 class="post-subheader">Setup the UIImagePickerControllerDelegate Methods</h3>
We must set the imagePicker delegate to self in viewDidLoad():
{% highlight swift %}
imagePicker.delegate = self // States that this view controller will also handle the events
{% endhighlight %}

Now we can write the methods. There are two image picker functions are essential:
{% highlight swift %}
imagePickerController(picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : AnyObject])
{% endhighlight %}
This function is triggered when you return a valid image. The selected image is passed in as part of the info object.

{% highlight swift %}
func imagePickerController(picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : AnyObject]) {
  if let pickedImage = info[UIImagePickerControllerOriginalImage] as? UIImage {
    // If returned a valid image
    profilePictureImageView.contentMode = .ScaleAspectFit // Set content setting
    profilePictureImageView.image = pickedImage // Set image
  }

  // Dismiss the image picker controller
  dismissViewControllerAnimated(true, completion: {
    print("Dismissed image picker controller")
  })
}


imagePickerControllerDidCancel(picker: UIImagePickerController)
This is triggered when the image selection flow is cancelled
func imagePickerControllerDidCancel(picker: UIImagePickerController) {
  // Dismiss the image picker controller
  dismissViewControllerAnimated(true, completion: {
    print("Cancelled image picker flow")
  })
}
{% endhighlight %}

<h3 class="post-subheader">Final Code:</h3>
The complete source code looks like this:
{% highlight swift %}
//  Created by Kevin
//  Copyright © 2016 KevinHou. All rights reserved.
//

import Foundation
import UIKit

class ProfileScreen: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {

    // Image picker controller delegate allows you to select an image from the camera or the photo library
    // Navigation controller delegate allows image picker to appear and dissapear like a normal view controller

    @IBOutlet weak var profilePictureImageView: UIImageView! // Image view we want to display the image in

    let imagePicker = UIImagePickerController() // Initialize an image picker view controller type

    override func viewDidLoad() {
        super.viewDidLoad()

        imagePicker.delegate = self // States that this view controller will also handle the events
    }

    @IBAction func selectProfilePicture(sender: AnyObject) {

        let imageSourcePicker = UIAlertController(title: "Select Profile Picture", message: "Please select an image picker method", preferredStyle: .ActionSheet) // Initialize action sheet type

        let cameraAction = UIAlertAction(title: "Take a picture", style: .Default, handler: { action in
            self.pickImage(.Camera) // Presents picker
        })

        let cameraRoll = UIAlertAction(title: "Choose from camera roll", style: .Default, handler: { action in
            self.pickImage(.PhotoLibrary) // Presents picker
        })

        // Add actions
        imageSourcePicker.addAction(cameraAction)
        imageSourcePicker.addAction(cameraRoll)

        presentViewController(imageSourcePicker, animated: true, completion: nil)

    }

    func pickImage(sourceType: UIImagePickerControllerSourceType) {
        imagePicker.allowsEditing = false // Prevent editing

        // Three sources: .PhotoLibrary, .Camera, .SavedPhotosAlbum
        self.imagePicker.sourceType = sourceType // Type of image selection

        // Presenting image picker view controller on top of stack
        self.presentViewController(self.imagePicker, animated: true, completion: {
            print("Opening image picker view controller")
        })
    }


    // MARK: - UIImagePickerControllerDelegate Methods

    func imagePickerController(picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : AnyObject]) {
        if let pickedImage = info[UIImagePickerControllerOriginalImage] as? UIImage {
            // If returned a valid image
            profilePictureImageView.contentMode = .ScaleAspectFit // Set content setting
            profilePictureImageView.image = pickedImage // Set image
        }

        // Dismiss the image picker view controller
        dismissViewControllerAnimated(true, completion: {
            print("Dismissed image picker view controller")
        })
    }

    func imagePickerControllerDidCancel(picker: UIImagePickerController) {
        // Dismiss the image picker view controller
        dismissViewControllerAnimated(true, completion: {
            print("Cancelled: Dismissed image picker view controller")
        })
    }

}
{% endhighlight %}

Hope you found this helpful! You can find the source code on <a href="https://github.com/khou22/Swift-App-Templates/blob/master/SampleTabProject/SampleTabProject/ProfileScreen.swift" target="_blank">GitHub</a>.

<h3 class="post-subheader">Another Example of an Action Sheet</h3>
Here's another example of two different types of action sheets in case the first example was difficult to grasp.
{% highlight swift %}
Text Input Dialogue:
// Create text modal for adding an event name prediction
let newCategoryAlert = UIAlertController(title: "Enter Location", message: "Manually add a location suggestion", preferredStyle: .alert)

// Add text field item
newCategoryAlert.addTextField { (textField) in
    textField.text = "" // No placeholder
    textField.autocapitalizationType = UITextAutocapitalizationType.words // Capitalization rules
}

// Add cancel action
newCategoryAlert.addAction(UIAlertAction(title: "Cancel", style: .default, handler: nil)) // No action if cancelled

// Add submit action
newCategoryAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: { [weak newCategoryAlert] (_) in
    // Get text field content
    let textField = newCategoryAlert?.textFields![0] // Force unwrapping because we know it exists

    self.currentCategory.locationFreq[(textField?.text)!] = 0 // New event name frequency entry with frequency of 0

    // Update category data with new markov model
    DataManager.updateOneCategory(with: self.currentCategory, index: self.selectedIndex)

    // Refresh the table view on this page
    self.refreshData()
}))

self.present(newCategoryAlert, animated: true, completion: nil) // Present the alert

// Regular Action Sheet
let actionSheet = UIAlertController(title: "Reset Predictions", message: "Are you sure you want to reset predictions? This cannot be undone.", preferredStyle: .actionSheet) // Create alert action sheet

// Create actions
let resetAction: UIAlertAction = UIAlertAction(title: "Reset Predictions", style: .default, handler: { (alert: UIAlertAction!) -> Void in
    // User pressed reset all predictions
    print("Reseting predictions")
    self.currentCategory = Category(name: self.currentCategory.name, eventNameFreq: [ : ], locationFreq: [ : ]) // Reset predictions data
    DataManager.updateOneCategory(with: self.currentCategory, index: self.selectedIndex)
})
let cancelAction: UIAlertAction = UIAlertAction(title: "Cancel", style: .cancel, handler: { (alert: UIAlertAction!) -> Void in
    // User pressed cancel
})

// Add actions
actionSheet.addAction(resetAction)
actionSheet.addAction(cancelAction)

self.present(actionSheet, animated: true, completion: nil) // Present action sheet to user

{% endhighlight %}

Hope you found this helpful!
