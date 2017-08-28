---
layout: post
title: "Introduction to HealthKit: Reading Steps, Weight, Height, and More"
author: "Kevin Hou"
date: 2016-07-22 09:48:15
description: "An overview of the fundamental basics in the HealthKit API and some more complex examples to get you started."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: ios
tags: [ios, swift, apps, xcode]
featured: "no"
---
<h3 class="post-subheader">Project Objectives</h3>
I was instructed to integrate HealthKit information — specifically pulling steps data — into Breathometer's upcoming app. I'm realitively new to Swift having only started a month ago, so this project was a way for me to get more familiar with the language and IDE. My task was to pull the data from HealhtKit then populate a table within a page of the app. This data could then be used for visualizations, analysis, etc. Here are my main learning goals for this project:
<ol>
  <li>Learn how to integrate with HealthKit and pull data from a “3rd party” source (not really a 3rd party but it's an API all the same)</li>
  <li>Learn the fundamentals of table views, populating views, etc. so that I can develop a better understanding of Swift frontend (<a href="http://khou22.github.io/programming/2016/07/22/swift-tableview-basics-how-to-create-and-populate-tables.html" target="_blank">see next post</a>)</li>
</ol>

<br class="post-line-break">
<h3 class="post-subheader">Authorizing and Integrating with HealthKit</h3>
Nested within the authorizeHealthKit function:
{% highlight swift %}
func authorizeHealthKit(completion: ((success:Bool, error:NSError!) -> Void)!) {
}
{% endhighlight %}
<br class="post-line-break">
<b>Get Healthkit information to read</b>
{% highlight swift %}
let healthKitTypesToRead = NSSet(objects:
  HKObjectType.characteristicTypeForIdentifier(HKCharacteristicTypeIdentifierDateOfBirth)!, HKObjectType.characteristicTypeForIdentifier(HKCharacteristicTypeIdentifierBiologicalSex)!,
  HKObjectType.quantityTypeForIdentifier(HKQuantityTypeIdentifierHeight)!,
  HKObjectType.quantityTypeForIdentifier(HKQuantityTypeIdentifierBodyMass)!
)
{% endhighlight %}
<br class="post-line-break">
<b>Healthkit information to write</b>
{% highlight swift %}
let healthKitTypesToWrite = NSSet(objects:
            HKObjectType.quantityTypeForIdentifier(HKQuantityTypeIdentifierBodyMass)!
        )
{% endhighlight %}
<br class="post-line-break">
To actually get data from healthkit, create a function within the class. This one, for example, gets your birthdate from health kit:
<br>
{% highlight swift %}
func getBirthdateFromHealthKit() -> AnyObject {
        var birthdate: AnyObject!
        do {
            birthdate = try healthKitStore.dateOfBirth()
        } catch {
            print("No birthday listed, or permission denied")
            birthdate = "Not Set"
        }

        return birthdate
    }
{% endhighlight %}
<br class="post-line-break">
<h3 class="post-subheader">More complex example</h3>
Pulls steps from Healthkit (x number of days) and show it in a table view by creating a new function within the HealthKitManager class.
<br class="post-line-break">
Returning steps by per day for x number of days:
{% highlight swift %}
func readStepsByDay(sinceDaysAgo: Int, completion: (([HKQuantitySample]!, NSError!) -> Void)!) {
        let type: HKQuantityType = HKQuantityType.quantityTypeForIdentifier(HKQuantityTypeIdentifierStepCount)!
        let currentDate = NSDate().dateWithoutTime() // Get current date

        var stepData: [HKQuantitySample] = []

        for daysAgo in 1...sinceDaysAgo {
            let startDate: NSDate = currentDate.daysAgo(daysAgo) // Set start date
            let endDate: NSDate = currentDate.daysAgo(daysAgo - 1) // Next day
            let predicate = HKQuery.predicateForSamplesWithStartDate(startDate, endDate: endDate, options: .None) // Set parameters
            // Getting all step counts within that day
            let sampleQuery = HKStatisticsQuery(quantityType: type, quantitySamplePredicate: predicate, options: [.CumulativeSum], completionHandler: { (sampleQuery, result, error ) -> Void in

                if let queryError = error {
                    completion(nil, queryError) // End the master function
                    print("Completion nil")
                    return
                }
                if completion != nil {
                    // Create KHQuantitySample for this day
                    let units = HKUnit.countUnit()
                    var quantity: HKQuantity = HKQuantity(unit: units, doubleValue: 0.0)
                    if let value = result?.sumQuantity()?.doubleValueForUnit(HKUnit.countUnit()) {
                        quantity = HKQuantity(unit: units, doubleValue: value)
                    }
                    let currentData = HKQuantitySample(type: HKQuantityType.quantityTypeForIdentifier(HKQuantityTypeIdentifierStepCount)!, quantity: quantity, startDate: startDate, endDate: endDate) // Initiate HKQuantitySample
                    stepData.append(currentData) // Add data to array

                    if stepData.count == sinceDaysAgo { // If got all data
                        // If all days are properly fetched -> return [HKQuanitity] sample to master function
                        stepData.sortInPlace({ // Sort by time
                            $0.0.startDate.timeIntervalSinceNow > $0.1.startDate.timeIntervalSinceNow
                        })
                        completion(stepData, nil) // Return error free
                    }
                }
            })

            self.healthKitStore.executeQuery(sampleQuery) // Fire the call
        }
    }
{% endhighlight %}
<br class="post-line-break">
<b>Extensions Used</b>
{% highlight swift %}
extension NSDate {
    func daysAgo(daysAgo: Int) -> NSDate {
        let result = -24 * 60 * 60 * Double(daysAgo)
        return self.dateByAddingTimeInterval(result)
    }

    func dateWithoutTime() -> NSDate {
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateStyle = .MediumStyle // Doesn't include time component
        let dateToPrint: NSString = dateFormatter.stringFromDate(self) as NSString // Format into medium style string
        let dateNoTime = dateFormatter.dateFromString(dateToPrint as String) // Get a date from midnight that day
        return dateNoTime!
    }
}
{% endhighlight %}
<br class="post-line-break">
<b>Usage:</b>
{% highlight swift %}
HealthKitManager().readStepsByDay(100, completion: { (mostRecentSteps, error) in

            // Catch error
            if( error != nil ) {
                print("Error reading weight from HealthKit Store: \(error.localizedDescription)") // Feedback
                return // End function
            }

            for dayCount in mostRecentSteps {
                print(dayCount.quantity.doubleValueForUnit(HKUnit.countUnit()))
            }
        })
{% endhighlight %}
