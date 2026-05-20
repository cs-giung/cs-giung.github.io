---
title: "Programming by prompting, prompting by poking"
date: "2026-05-20"
author: "Giung Nam"
category: "Posts"
description: "We have moved from typing syntax to stating intent."
---

## Programming by poking

> More like science. You grab this piece of library and you poke at it. You write programs that poke it and see what it does. And you say, 'Can I tweak it to do the thing I want?'  
> \- Gerry Sussman, [talk at the NYC Lisp meetup](https://vimeo.com/151465912#t=59m36s) (2016).

In the 1980s, software engineering was about building complex systems by combining small, perfectly understood mathematical parts.
But as the software ecosystem exploded, that era faded.
Developers found themselves spending most of their time reading massive manuals for opaque, third-party libraries.

As Sussman noted, software development evolved from a discipline of absolute mathematical control into an empirical, scientific game of experimenting with black boxes.
You rarely built from scratch anymore; you grabbed a massive open-source library, poked it to see how it reacted, and tweaked the code until it worked.

But are we still doing this by hand today?

## Programming by prompting

> From one gut feeling I derive much consolation: I suspect that machines to be programmed in our native tongues --be it Dutch, English, American, French, German, or Swahili-- are as damned difficult to make as they would be to use.  
> \- Edsger Dijkstra, ["On the foolishness of \"natural language programming\""](https://www.cs.utexas.edu/~EWD/ewd06xx/EWD667.PDF) (1978)

> The hottest new programming language is English  
> \- Andrej Karpathy, posted in [x.com](https://x.com/karpathy/status/1617979122625712128) (2023-01-25).

Fast forward to the 2020s, and the abstraction layer has climbed to unprecedented heights.
The barrier to entry is no longer memorizing rigid syntax, fighting a compiler, or even reading those massive library manuals.[^1]

With the rise of LLMs and AI coding tools, development has largely transformed into a continuous dialogue.
You simply articulate your intent in natural language, and the machine generates the boilerplate, the logic, and the architecture.
We have moved from typing syntax to stating intent.
Increasingly, developers are executing the act of programming simply by prompting.

> Is this much better than I could do by hand? Sure is.  
> \- Linus Torvalds, [torvalds/AudioNoise](https://github.com/torvalds/AudioNoise/commit/93a72563cba609a414297b558cb46ddd3ce9d6b5) (2026-01-08).

> For me personally it has been 100% for two+ months now, I don’t even make small edits by hand.  
> \- Boris Cherny, posted in [x.com](https://x.com/bcherny/status/2015979257038831967) (2026-01-27).

And just like that, programming is becoming prompting.

## Prompting by poking

Today, these two paradigms have collided.
We are no longer just poking static, deterministic open-source libraries.
We are dealing with an interactive, non-deterministic black box: the AI coding agent.[^2]

We don't always know the exact code required, so we poke the AI with a prompt.
We run the output, observe the cracks, and tweak our instructions.
_"No, don't use that outdated framework."_
_"There is an edge-case error here; analyze this specific file."_

This shift has inspired some brilliant satirical projects that highlight just how extreme this poking philosophy can be.
Take [abyesilyurt/vibesort](https://github.com/abyesilyurt/vibesort) and [Calvin-LL/is-even-ai](https://github.com/Calvin-LL/is-even-ai) for example.
Instead of writing a logically well-defined, transparent algorithm,[^3] they simply delegate everything to an LLM.
They pass along nothing but pure intent, and the AI actually spits out results that pass the main test cases.

Of course, this is a cartoonish exaggeration--an extreme caricature of what happens when we completely ignore the underlying implementation.
While structurally far from common agentic coding, which generates real source code rather than outsourcing execution to an API runtime, it perfectly mirrors the extreme end of the intent-only spectrum: after all, it did fulfill the user's intent to sort a list and check for an even number, didn't it?

## A deepness in the weights

> "There is only one important way that computers are anything like wise. They contain thousands of years of programs, and can run most of them. In a sense, they remember every slick trick that Humankind has ever devised."  
> Bret Trinli sniffed, "Along with all the nonsense."  
> \- Vernor Vinge, ["A Deepness in the Sky"](https://en.wikipedia.org/wiki/A_Deepness_in_the_Sky) (1999).

While delegating intent for a sorting algorithm is a fun joke, blindly applying _programming by prompting_ to real-world development is a recipe for disaster.
The modern LLM is exactly the machine Trinli describes; it has digested every slick trick, every elegant architectural pattern, and every deprecated, buggy, copy-pasted Stack Overflow answer ever devised.
It knows the genius, but it also knows all the nonsense.

> Despite the romance of spaceflight, the most common accidents were simply caused by ancient, misused programs finally getting their revenge.  
> \- Vernor Vinge, ["A Deepness in the Sky"](https://en.wikipedia.org/wiki/A_Deepness_in_the_Sky) (1999).

Today, those "ancient, misused programs" are the billions of lines of legacy code and obsolete paradigms buried deep within the LLM's weights.
When an AI can generate thousands of lines of code in seconds, technical debt accumulates at the speed of light.
If we blindly poke an AI for code and deploy it without understanding the underlying mechanics, we invite that revenge directly into our production pipelines.

> The best way to write secure and reliable applications. Write nothing; deploy nowhere.  
> \- Kelsey Hightower, ["kelseyhightower/nocode"](https://github.com/kelseyhightower/nocode) (2018).

But of course, we cannot simply write nothing.
And let's be honest: software engineering was hardly flawless even before AI coding tools came along.
The abyss of technical debt has always been there.
The only real difference today is that now, anyone can easily gaze into it.

## The Programmer-Archaeologist

At our core, we are still programming by poking.
The only difference is that prompting has inserted as the new interface between us and the computer.

> She paused, looked at Pham significantly. "It takes a smart and highly trained human being to look at what is available, to choose and modify the right programs, and then to interpret the results properly."  
> Pham was silent for a moment, thinking back to all the times the machines had not done what he really wanted.  
> \- Vernor Vinge, ["A Deepness in the Sky"](https://en.wikipedia.org/wiki/A_Deepness_in_the_Sky) (1999).

In Vinge's universe, the engineers who maintain impossibly layered, ancient systems are called "Programmer-Archaeologists."
Today, as we navigate the massive, opaque depths of LLM weights, we should embrace that exact identity.
We are still exploring the ruins of past paradigms and the sprawling archives of legacy code.

The shift is simply that these ruins now come with a friendly, brilliant librarian stationed at the front desk.
This AI guide makes the excavation far more convenient--it can instantly fetch the right tome, translate forgotten syntax, and synthesize thousands of fragmented forum answers into a single cohesive response.
But a librarian is ultimately just a guide.
They do not comprehend the unique, fragile architecture of your specific system, nor do they bear the consequences when that system collapses.

> Instead of regarding the obligation to use formal symbols as a burden, we should regard the convenience of using them as a privilege.  
> \- Edsger Dijkstra, ["On the foolishness of \"natural language programming\""](https://www.cs.utexas.edu/~EWD/ewd06xx/EWD667.PDF) (1978)

Dijkstra's remark reminds us that natural language intent is not a substitute for formal logic.
The AI can bring us the texts, summarize the chapters, and even enthusiastically draft the next page.
But ultimately, the librarian only points the way.
We are the ones who must exercise the privilege of formal reasoning, and we are the ones who must actually read the books.

[^1]: At a certain point in my career, I found myself often giving people the advice, "Please, just read the documentation."
[^2]: And usually, that advice just became an additional prompt: "Refer to this documentation."
[^3]: Well, to be fair, the famous is-even package falls into this category too.
