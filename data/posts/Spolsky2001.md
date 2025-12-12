---
title: "Architecture astronauts"
date: "2001"
author: "Joel Spolsky"
---

[Don't let architecture astronauts scare you (Joel Spolsky, 2001)](https://www.joelonsoftware.com/2001/04/21/dont-let-architecture-astronauts-scare-you/)
---

When great thinkers think about problems, they start to see patterns. They look at the problem of people sending each other word-processor files, and then they look at the problem of people sending each other spreadsheets, and they realize that there's a general pattern: sending files. That's one level of abstraction already. Then they go up one more level: people send files, but web browsers also "send" requests for web pages. And when you think about it, calling a method on an object is like sending a message to an object! It's the same thing again! Those are all sending operations, so our clever thinker invents a new, higher, broader abstraction called messaging, but now it's getting really vague and nobody really knows what they're talking about any more. Blah.

When you go too far up, abstraction-wise, you run out of oxygen. Sometimes smart thinkers just don't know when to stop, and they create these absurd, all-encompassing, high-level pictures of the universe that are all good and fine, but don't actually mean anything at all.

These are the people I call Architecture Astronauts. It's very hard to get them to write code or design programs, because they won't stop thinking about Architecture. They're astronauts because they are above the oxygen level, I don't know how they're breathing. They tend to work for really big companies that can afford to have lots of unproductive people with really advanced degrees that don't contribute to the bottom line.

A recent example illustrates this. Your typical architecture astronaut will take a fact like "Napster is a peer-to-peer service for downloading music" and ignore everything but the architecture, thinking it's interesting because it's peer to peer, completely missing the point that it's interesting because you can type the name of a song and listen to it right away.

All they'll talk about is peer-to-peer this, that, and the other thing. Suddenly you have peer-to-peer conferences, peer-to-peer venture capital funds, and even peer-to-peer backlash with the imbecile business journalists dripping with glee as they copy each other's stories: "Peer To Peer: Dead!"

The Architecture Astronauts will say things like: "Can you imagine a program like Napster where you can download anything, not just songs?" Then they'll build applications like Groove that they think are more general than Napster, but which seem to have neglected that wee little feature that lets you type the name of a song and then listen to it — the feature we wanted in the first place. Talk about missing the point. If Napster wasn't peer-to-peer but it did let you type the name of a song and then listen to it, it would have been just as popular.