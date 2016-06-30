---
layout: post
title: "WWDC 2016: Advances in UIKit Animations and Transitions"
author: "Kevin Hou"
date: 2016-06-29 16:50:49
description: ""
category:
tags: []
featured: "no"
---
Video (must be played in Safari): [https://developer.apple.com/videos/play/wwdc2016/216/](https://developer.apple.com/videos/play/wwdc2016/216/)

* New animations with UIKit in iOS 10
* Create natural, smooth feeling, responsive animations

<h3 class="post-subheader">Interpolation and Pacing</h3>

* Dotted = actual position

* Solid = final/goal position

* Timing function:

    * Linear

    * Ease in

    * Ease out

    * Ease in and out

* Springs:

    * Overshoot the value and come back to the goal position

    * It affects the pacing of the animation

* iOS 8 (WWDC 2014) introduced interruptible animations

    * If you interrupt an animation, the object no longer jumps or switches velocities so abruptly

* UIVIewPropertyAnimator new features in iOS 10

    * Interruptible animations

    * Scrubbable animations

    * Reversible animations

    * Broad availability of timing functions (not just the usual four)

    * Rolling animations can be modified

<h3 class="post-subheader">Animations as Objects</h3>

* Can get the state and position of an animation at any point

    * state: .inactive, .active, .stopped

    * isRunning: true, false

    * isReversed: true, false

* Animations are now objects, not just API calls

    * That way you can store, modify, and get values from it

* Can also stop an animation: animator.stopAnimation (false)

    * Pass false in so that the object can stay right where it is in its path

    * Can do something with it later

    * If you pass in true, it still stays in its place, but the animation is over for all intensive purposes

* To scrub an animation:

    * animator.fractionComplete = fraction

    * Like the Interpolation library

    * The fractionComplete doesn’t involve time

        * So the timing function doesn’t affect it

        * The fractionComplete relates to the position

* Reversing animations brings an object back to its start position

    * Animation will be as if it never started → .start

* Can also add an animation that brings it back to its start position

    * But the animation will be complete → .end

* iOS 10 can set custom your own timing functions

    * UICubicTimingParameters(animationCurve: .linear) // For linear

    * UICubicTimingParameters(controlPoint1: CGPoint(x: 0.0, y: 1.0), controlPoint2: CGPoint(x: 1.0, y: 0.0)) // For custom timing curve

* Also changed UISpringTimingParameters

    * UISPringTimingParameters(mass: CGFloat, stiffness: CGFloat, damping: CGFloat, initialVelocity velocity: CGVector)

* Keyframe animations

    * Basically regular animations, but with multiple points

    * Example: Can add multiple x/y positions to an animation to create a complex path instead of just from point A to point B

        * Can do point A → B → C → … → Z
