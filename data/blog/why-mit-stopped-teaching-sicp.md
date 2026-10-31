---
title: "Why MIT stopped teaching SICP"
date: "2016"
author: "Yarden Katz & Ron Garret"
category: "Notes & Scribbles"
type: "excerpt"
description: "The \"analysis-by-synthesis\" view of SICP became irrelevant. Nowadays, we do programming by poking."
sources:
  - title: "Programming by poking: why MIT stopped teaching SCIP"
    url: "https://web.archive.org/web/20160504164044/http://www.posteriorscience.net/?p=206"
  - title: "Hacker News thread — Ron Garret"
    url: "https://news.ycombinator.com/item?id=11628080"
---

*Excerpts from Katz's account of Sussman's talk and Garret's comment in the Hacker News discussion. Omissions are marked with […].*

__Yarden Katz:__

In [this talk](https://vimeo.com/151465912#t=59m36s) at the NYC Lisp meetup, Gerry Sussman was asked why MIT stopped teaching the legendary 6.001 course, which was based on Sussman and Abelson's classic text [The Structure and Interpretation of Computer Programs (SICP)](https://mitpress.mit.edu/sicp). Sussman's answer was that: (1) he and Hal Abelson got tired of teaching it (having done it since the 1980s). So in 1997, they walked into the department head's office and said: "We quit. Figure out what to do." And more importantly, (2) that they felt that the SICP curriculum no longer prepared engineers for what engineering is like today. Sussman said that in the 80s and 90s, engineers built complex systems by combining simple and well-understood parts. The goal of SICP was to provide the abstraction language for reasoning about such systems.

Today, this is no longer the case. Sussman pointed out that engineers now routinely write code for complicated hardware that they don't fully understand (and often can't understand because of trade secrecy.) The same is true at the software level, since programming environments consist of gigantic libraries with enormous functionality. According to Sussman, his students spend most of their time reading manuals for these libraries to figure out how to stitch them together to get a job done. He said that programming today is "More like science. You grab this piece of library and you poke at it. You write programs that poke it and see what it does. And you say, 'Can I tweak it to do the thing I want?'". The "analysis-by-synthesis" view of SICP — where you build a larger system out of smaller, simple parts — became irrelevant. Nowadays, we do programming by poking.

[…]

Sussman admitted that the SICP curriculum was "more coherent" than what they have now and that they still don't know what the right curriculum should be.

The [full text](https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/index.html) of SICP is available online. The SICP [video lectures](https://ocw.mit.edu/courses/6-001-structure-and-interpretation-of-computer-programs-spring-2005/video_galleries/video-lectures/) by Sussman and Abelson from 1986 (given to HP) are also available.

---

__Ron Garret:__

> What should we consider fundamental?

[…]

AI, ML, and NLP and web design are application areas, not fundamentals. (You didn't list computer graphics, computer vision, robotics, embedded systems -- all applications, not fundamentals.)

[…]

What you *do* need is some amount of time spent on the idea that computer programs are mathematical objects which can be reasoned about mathematically. This is the part that the vast majority of people are missing nowadays, and it can be a little tricky to wrap your brain around at first. You need to understand what a fixed point is and why it matters.

[…]

You need some programming language theory. You need to know what a binding is, and that there are two types of bindings that matter: lexical and dynamic. You need to know what an environment is (a mapping between names and bindings) and how environments are chained. You need to know how evaluation and compilation are related, and the role that environments play in both processes. You need to know the difference between static and dynamic typing. You need to know how to compile a high-level language down to an RTL.

[…]