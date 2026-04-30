---
title: "Persist Data: Storing Values Locally Using Swift"
author: "Kevin Hou"
date: 2016-07-25 11:09:16
description: "A short tutorial on how to read and write persist data — data that is stored between app sessions."
image: "/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: [swift, xcode, tutorial, sourceCode]
featured: false
---
### Overview

One of the benefits of iOS development that I wasn’t entirely used to being a web developer, is the ability to store data locally. Apple allows apps to store data on the device in the form of [persist data](https://developer.apple.com/library/ios/referencelibrary/GettingStarted/DevelopiOSAppsSwift/Lesson10.html). Persist data can be read between app sessions and is only deleted when you remove the app from the device. This information is one of the many things the uninstall app prompt is referring to when it asks if you would like to delete the app and all its data. It is primarily used for small things like strings, boolean, integers, etc. and not for serious things like images (for that, you should use [core data](https://developer.apple.com/library/watchos/documentation/Cocoa/Conceptual/CoreData/index.html)).

Reading and writing persist data is remarkably simple, but this blog post contains some tips that will prevent crashes and improve your coding structure. There are three basic elements to persist data: keys, writing, and reading.

### Keys

Keys are string phrases or words that reference a specific value or set of values in persist data. Information is stored with a key reference and can be retrieved and written using that same key. These keys are incredibly important and any typo can quickly cause bugs or crashes in your app. As highlighted in my [blog post](/blog/2016-07-20-swift-tips-and-tricks-july-2016-extensions-structures-and-outlet-collections) in the “Preventing Code-Breaking Typos with Structures” section, it is best practice to include keys as constants in a structure. This will ensure that your keys are all only explicitly typed out in one place. It makes debugging significantly easier. Here is what your keys structure will look like when storing persist data:

```swift
struct Keys {
    static let calorieGoal              = "calorieGoal"
}
```

### Writing

NSUserDefaults (aka Persist Data) are stored using the `NSUserDefaults.standardUserDefaults()` initializer. Instead of calling this every time you wish to use persist data, it’s easier to simply create another structure within your `Constants.swift` file containing the following:

```swift
struct Constants {
    static let defaults = NSUserDefaults.standardUserDefaults()
}
```

Now, instead of writing `NSUserDefaults.standardUserDefaults()` every time, you can simply type `Constants.defaults`.

To write data locally into persist data, simply use this command:

```swift
let value = 2000 // Dummy data
Constants.defaults.setInteger(value, forKey: Keys.calorieGoal) // Writing an integer value for a key
```

### Reading

Reading data is also very simple, but there is one thing to keep in mind. If you have no written any data yet, attempting to read that nil value will result in a crash. It’s good practice to add a conditional before retrieving your persist data to prevent such conundrums from occurring. The code is shown here:

```swift
if (Constants.defaults.objectForKey(Keys.calorieGoal) != nil) { // Ensure the data exists
    caloriesGoal = Constants.defaults.integerForKey(Keys.calorieGoal) // Reading data for key
}
```

That’s pretty much all there is to it. Now you can store data between app sessions! Hope you found this helpful.
