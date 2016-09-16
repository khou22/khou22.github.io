---
layout: post
title: "Swift TableView Basics: How to Create and Populate Tables"
author: "Kevin Hou"
date: 2016-07-22 10:46:44
description: "A quick, bare-bones introduction to Table Views in Swift."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: programming
tags: [ios, swift, apps, xcode]
featured: "no"
---
<h3 class="post-subheader">Project Objectives</h3>
I was instructed to integrate HealthKit information — specifically pulling steps data — into Breathometer's upcoming app. I'm realitively new to Swift having only started a month ago, so this project was a way for me to get more familiar with the language and IDE. My task was to pull the data from HealhtKit then populate a table within a page of the app. This data could then be used for visualizations, analysis, etc. Here are my main learning goals for this project:
<ol>
  <li>Learn how to integrate with HealthKit and pull data from a “3rd party” source (<a href="http://khou22.github.io/programming/2016/07/22/introduction-to-healthkit-reading-steps-weight-height-and-more.html" target="_blank">see last post</a>)</li>
  <li>Learn the fundamentals of table views, populating views, etc. so that I can develop a better understanding of Swift frontend</li>
</ol>
<br class="post-line-break">

<h3 class="post-subheader">Setting Up the Table</h3>
Create a table view property
<br class="post-line-break">
{% highlight swift %}
@IBOutlet weak var tableView: UITableView! // Connect to the storyboard element
{% endhighlight %}

<br class="post-line-break">
Initialize the class and connect it to the storyboard.
{% highlight swift %}
class ViewController: UIViewController, UITableViewDelegate, UITableViewDataSource { ... }
{% endhighlight %}
<br class="post-line-break">
Setup different UITableView properties
{% highlight swift %}
// Imperative
func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return 0
}

// Imperative
func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
    return UITableViewCell()
}

func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
    // Triggered when you select the row at indexPath
}
{% endhighlight %}
<br class="post-line-break">
<b>Connect dataSource and delegate</b><br>
You must also link the table view dataSource and delegate to the view controller like so: <br>
<img src="./../../../../media/blog/images/Swift_Table_Views.png" width="100%">

<br class="post-line-break">
<b>Register Cell Class</b><br>
In the view controller/tableviewdelegate/datasource class, you must register the class for the table view:
{% highlight swift %}
override func viewDidLoad() {
    super.viewDidLoad()

    self.tableView.registerClass(UITableViewCell.self, forCellReuseIdentifier: "cell")
//    tableView.setup(scrollable: false) // Turn off scrolling
}
{% endhighlight %}

<h3 class="post-subheader">Adding Data to Display</h3>
First step is to declare the data. In this case we’re going to use dummy data:
{% highlight swift %}
var items: [String] = ["Hello", "World", "Swift"]
{% endhighlight %}
<br class="post-line-break">
Using this data, we can now set the number of rows in our table view by calling the function:
{% highlight swift %}
func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return items.count
}
{% endhighlight %}
<br class="post-line-break">
<b>Create the Cell</b><br>
{% highlight swift %}
func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
    var cell:UITableViewCell = self.tableView.dequeueReusableCellWithIdentifier("cell") as UITableViewCell

    cell.textLabel?.text = self.items[indexPath.row]

    return cell
}
{% endhighlight %}
<br class="post-line-break">
<b>Handling Cell Selection</b><br>
{% highlight swift %}
func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
    println("You selected cell #\(indexPath.row)!")
}
{% endhighlight %}
<br class="post-line-break">
<b>Final code</b><br>
{% highlight swift %}
class ViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    @IBOutlet
    var tableView: UITableView
    var items: [String] = ["We", "Heart", "Swift"]

    override func viewDidLoad() {
        super.viewDidLoad()

        self.tableView.registerClass(UITableViewCell.self, forCellReuseIdentifier: "cell")
    }


    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.items.count;
    }

    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        var cell:UITableViewCell = self.tableView.dequeueReusableCellWithIdentifier("cell") as UITableViewCell

        cell.textLabel?.text = self.items[indexPath.row]

        return cell
    }

    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        println("You selected cell #\(indexPath.row)!")
    }
}
{% endhighlight %}
<br class="post-line-break">
<h3 class="post-subheader">Custom Cell Layout</h3>
By default, all table view cells have the text label and detail label values. To create a custom cell with more than just those two labels, follow these steps:
<br class="post-line-break">
Drag a Table View Cell onto your UITableView. This will automatically generate a cell labeled “Prototype” that contains a nested content view. Treat this content view as any other view and drag UI elements like text fields, images, etc. onto the content view.
<br class="post-line-break">
Now, create a new Swift file for the UITableViewCell class to connect your Table View Cell to some code. Initialize the class like so:
<br class="post-line-break">
{% highlight swift %}
class StepsCell: UITableViewCell {
    // IB Outlets go here:

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
}
{% endhighlight %}
<br class="post-line-break">
Hook up the UI elements in the content view with IBOutlets in your UITableViewCell class. It’s identical to how you would do this for any other view controller. You can add constraints, stack views, etc. Just treat the content view as you would a blank view controller.
<br class="post-line-break">
Now to access those UI elements in your main Table View Controller, you must use the “dequeueReusableCellWithIdentifier” command. Dequeue basically describes the manner in which data loads and unloads. If you imagine the scrolling items as a wheel, as the topmost item disappears, it reappears on the bottom. The table view is endlessly recycling the same x number of cells. This is a good approach for memory management especially when dealing with 100+ cells. Once you’ve stored the cell, you can then modify the various UI elements and return the cell to populate the table view.
<br class="post-line-break">
{% highlight swift %}
func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
    var cell = self.tableView.dequeueReusableCellWithIdentifier("StepsCell")! as! StepsCell // Same identifier as class name
    cell.dateLabel.text = "January \(indexPath)"
    cell.textLabel?.text = String(indexPath)
    return cell
}
{% endhighlight %}

<h3 class="post-subheader">Other Helpful Topics</h3>
For populating table views with data from asynchronous requests, it can be helpful to reload your table view once you know all your data is complete
{% highlight swift %}
// Reload in main queue
dispatch_async(dispatch_get_main_queue(), { () -> Void in
    self.tableView.reloadData() // Reload
})
{% endhighlight %}

<br class="post-line-break">
Tutorial from: <a href="https://www.weheartswift.com/how-to-make-a-simple-table-view-with-ios-8-and-swift/" target="_blank">https://www.weheartswift.com/how-to-make-a-simple-table-view-with-ios-8-and-swift/</a>
