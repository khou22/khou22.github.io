---
layout: post
title: "Swift Core Data Basics: Storing App Data"
author: "Kevin Hou"
date: 2016-10-31 21:07:17
description: "A basic overview of Core Data in Swift and Xcode featuring a short example to help you get started."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: ios
tags: [ios, swift, apps, xcode]
featured: "no"
---
Core Data is an important component of many complex apps. An app’s lifecycle is a complicated topic, but data management can be articulated as such: When you kill an app (or shut down your phone), any data that isn’t designed to persist between sessions will be deleted. The solution is to either use persist data with NSUserDefaults or by using Apple’s Core Data. Again, Core Data is another incredibly complex topic, but this blog post should give you the necessary tools to start using it.
<br class="post-line-break">
<h3 class="post-subheader">Setting Up Core Data</h3>
First, create a page based application and check the Core Data options. This will initialize a Core Data stack in the AppDelegate.swift file as well as create a .xcdatamodeld file in your project’s parent folder. The heart of Core Data lives in this .xcdatamodeld file. Selecting the file will expose a powerful Xcode editor for creating entity types that you can use to store data between app sessions. You can double click the entity name to change its label and add attributes, relationships, and fetched properties. Here’s an overview of these three vocabulary words:<br>
<b>Entity</b> — specifies the name of the things you are creating. If you are creating a Core Data structure to store different people, the entity would be “People”<br>
<b>Attributes</b> — defines characteristics of an entity. If you again use the analogy of people, the attributes would be age, birthdate, etc.<br>
<b>Relationships</b> — connections between multiple entities. They can be “to-many” or “to-one.” For example, an employer would have a “to-many” relationship with his or her employees whereas an employer would have a “to-one” relationship with his/her boss.<br>
<br class="post-line-break">
The Core Data editor is relatively intuitive. Create an entity by pressing the “Add Entity” button in the bottom left and add attributes and relationships using the corresponding plus buttons. Like objects and classes, the entity name is uppercase whereas attributes are camel case.
<br class="post-line-break">
<h3 class="post-subheader">Saving to Core Data</h3>
Import the CoreData module in whichever file your view controller lives in. Core Data objects are returned as a variety of object types, but the most basic is a “NSManagedObject.” Below is an example of how you would retrieve Core Data:
{% highlight swift %}
// Entity: “Person”
// Attribute: “name”
var people = [NSManagedObject]()
let person = people[i]
let name = person.valueForKey("name") as? String // Xcode doesn’t know what type the value is
{% endhighlight %}
<br class="post-line-break">
<h3 class="post-subheader">Writing to Core Data</h3>
This function is how to save a “name” String attribute to an entity, “Person.”
{% highlight swift %}
func saveName(name: String) {
  let appDelegate = UIApplication.sharedApplication().delegate as! AppDelegate // Access the app delegate in order to save to Core Data
  let managedContext = appDelegate.managedObjectContext // Get managed object context

  let entity = NSEntityDescription.entityForName("Person", inManagedObjectContext: managedContext) // Identify the entity

  // Create a new instance of Core Data and store temporary on the managedContext
  let person = NSManagedObject(entity: entity!, insertIntoManagedObjectContext: managedContext)

  person.setValue(name, forKey: "name") // Set an attribute

  do {
      try managedContext.save() // Save the temporary data to Core Data
      people.append(person) // Also add to local data so don't have to be constantly reading Core Data
  } catch let error as NSError {
      print("Could not save \(error), \(error.userInfo)")
  }
}
{% endhighlight %}


<br class="post-line-break">
<h3 class="post-subheader">Reading Core Data</h3>
{% highlight swift %}
let appDelegate = UIApplication.sharedApplication().delegate as! AppDelegate // Get App Delegate
let managedContext = appDelegate.managedObjectContext // Get the managed object context

let fetchRequest = NSFetchRequest(entityName: "Person") // Get the entity objects from Core Data

do {
    let results = try managedContext.executeFetchRequest(fetchRequest) // Fetch results
    people = results as! [NSManagedObject] // Store locally
} catch let error as NSError { // Catch errors
    print("Could not fetch \(error), \(error.userInfo)")
}
{% endhighlight %}
<br class="post-line-break">
Those are the basics to Core Data! This is obviously a very simple example, but it’s integral to anyone learning to build iOS apps.
