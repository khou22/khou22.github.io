---
layout: post
title: "Swift Classes August 2017: Classes, Subclasses, and Protocols"
author: "Kevin Hou"
date: 2017-08-24 22:44:37
description: "The basics of classes and subclasses as well as a detailed tutorial on setting up your own custom protocols and delegates."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: Programming
tags: [ios]
featured: "yes"
---
# Swift Classes August 2017: Classes, Subclasses, and Protocols

### Classes
In this post, I will cover the basics of Swift classes, subclasses, and their protocols/delegates. Classes are a foundational piece of computer science and software development. They allow developers to create _instances_ of a certain type of object with pre-defined methods (functions) and instance variables (properties). For example, a class might be a `car` with an instance variable: `wheels = 4` and a method: `driveForward()`. Here is what it would look like in Swift 3:

``` swift
// Declaration
class Car {

    // Immutable and only accessible within this class
    // No initial value
    private let wheels: Int
    
    // Mutable and accessible outside of this class
    // Initial value 1
    public var passengers: Int = 1
    
    // Called when a new instance of "Car" is created
    init(wheels: Int) {
        self.wheels = wheels // Set instance variable
    }
    
    // Can be called on an instance of "Car"
    public func driveForward() -> void {
        ...
    }
}

// Usage
let porche: Car = Car(wheels: 4)
print(porche.passengers) // 1
porche.driveForward() // ...
```

All cars have wheels and they all the ability to drive forward — that is why these become part of the class. Classes are a way of standardizing objects that have similar properties, just different values. This method of creating classes is what allows for modular-code, an essential aspect of computing and engineering.


### Subclasses
Subclasses are a way of building on top of existing classes. For example, if we continue with our example of the class `Car`, a subclass could be `Tesla`. They share very similar properties, but Tesla's have key features that set them apart from cars. `Tesla` would inherit all the essential properties and methods from `Car`, but add on its own special components. Here is an example:

``` swift
class Tesla: Car { // Inherit "Car"
    public func charge() -> void {
        ...
    }
}
```

Any instance of Tesla would still have the same constructor and properties like `wheels` and `driveForward()`, but would include a new method `charge()` unique to instances of type `Tesla`.


### Protocols & Delegates
Protocols are a way of enforcing a parent or other class conforms to a set of methods. It's a somewhat complicated topic and it makes the most sense once you've worked with Swift for a little bit, but here are some easy example.  
<br class="post-line-break">
The easiest example of a protocol is when you create a sublcass of a `UIViewController`. By subclassing, you are adding on top of the existing class `UIViewController`. You are also given the option to override certain functions like `viewDidLoad()` and `viewDidLayoutSubviews()`. These methods are optional protocols in `UIViewController` made available to you because the delegate — what is responsible for satisfying the protocols — is set to the new subclass.  
<br class="post-line-break">
That's all very confusing, but here's a step by step on how they work and how to create your own class with protocols. It might clear up your confusion.  
<br class="post-line-break">
1. Create a class that has an event listener.

    ``` swift
    class SomeClass {
        private let button: UIButton = UIButton()
        
        ...
        
        private func buttonPressed() {
            print("I was pressed")
        }
    }
    ```
    
    This function, `buttonPressed()`, will be run every time the button is pressed. This begs the question, how will the `UIViewController` that contains an instance of `SomeClass` detect when the button was pressed? It can create an interval timer that checks every 1/10 of a second to see if the button state has changed, but that's neither efficient nor practical. Instead we must use a protocol.  
<br class="post-line-break">
2. Create a protocol.

    ``` swift
    protocol SomeDelegate: class {
        func buttonWasPressed(someValue: Int) // Passes back a parameter
        optional func buttonWasReleased() // Optional protocol
    }
    ```
    
    Notice the first protocol passes back a value. This is useful when you want the parent to be able to listen and track when a specific value has changed. You can simply trigger the protocol every time the value is changed and pass the value as the parameter. The second parameter doesn't take a paramter, but it is optional. This means that the parent class doesn't need to include `buttonWasReleased()` in order to conform to the protocol `SomeDelegate`.  
    <br class="post-line-break">
3. Establish the protocol as an instance variable named `delegate`.

    ``` swift
    class SomeClass {
        weak var delegate: SomeDelegate?
    }
    ```
<br class="post-line-break">
4. Call the appropriate protocol method in your class to trigger the listener.

    ``` swift
    class SomeClass {

        ...

        private func buttonPressed() {
            print("I was pressed")
            self.delegate.buttonWasPressed(someValue: 1)
        }
    }
    ```
    This new line triggers the protocol method `buttonWasPressed` and passes the value `1` up to the parent. Now we'll cover how to actually use this in your class.  
<br class="post-line-break">
5. In your `UIViewController` subclass, add the protocol as a class to conform to.

    ``` swift
    class SomeViewController: UIViewController, SomeDelegate {
        ...
    }
    ```
<br class="post-line-break">
6. Connect or create the instance of the class and attach `self` as the delegate. This will tell the protocol that this current class will conform to the protocol.

    ``` swift
    class SomeViewController: UIViewController, SomeDelegate {
        override func viewDidLoad() {
            super.viewDidLoad()
            let example: SomeClass = SomeClass()
            example.delegate = self
        }
    }
    ```
<br class="post-line-break">
7. Add the protocol as a function. If everything was set up correctly, the method should auto-complete.

    ``` swift
    class SomeViewController: UIViewController, SomeDelegate {
        
        ...
        
        func buttonWasPressed(someValue: Int) {
            print("Button was pressed with value: \(someValue)")
        }
    }
    ```
<br class="post-line-break">

That's it! Now every time the function `buttonPressed()` is run, it will run `buttonWasPressed()` in `SomeViewController` and pass a value. This is a great way of communicating between a child and parent when some event is triggered by the user.  
<br class="post-line-break">
Hope this tutorial helped! It's been a few months since I did any iOS dev (got caught up in a lot of web dev because of work) so I hope my explanations and code were clear and clean.

