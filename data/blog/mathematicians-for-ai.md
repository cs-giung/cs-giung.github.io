---
title: "Mathematicians for AI"
date: "2026-11-21"
author: "Giung Nam"
category: "Posts"
type: "article"
description: "It will be a great co-pilot."
---

## Calculemus!

> Hiervon wäre allerdings ein strenger Beweis zu wünschen; ich habe indess die Aufsuchung desselben nach einigen flüchtigen vergeblichen Versuchen vorläufig bei Seite gelassen, da er für den nächsten Zweck meiner Untersuchung entbehrlich schien.  
> \- Bernhard Riemann, [Ueber die Anzahl der Primzahlen unter einer gegebenen Grösse](https://www.claymath.org/wp-content/uploads/2023/04/riemann1859.pdf) (1859-11).

A lot has happened lately, and there's still a lot happening. Surely this isn't what Leibniz had in mind when he said _'Calculemus!'_ I don't know what to make of it. Connectionism, not symbolism?

## AI for mathematicians

> Tried out #ChatGPT today. It gives remarkably reasonable-sounding and relevant-looking responses to specialist queries (such as this one regarding the #RiemannHypothesis), even if on closer inspection there isn't any actual deep content.  
> \- Terence Tao, tooted in [mathstodon.xyz](https://mathstodon.xyz/@tao/109445735818439353) (2022-12).

Terence Tao has been trying out LLMs since the early days.[^1] As a non-expert, I figured the best I could do was pay attention to how an expert thought about them. Luckily for me, Tao has shared a lot of his thinking along the way, and I've enjoyed following it over the past few years.

> The 2023-level AI can already generate suggestive hints and promising leads to a working mathematician and participate actively in the decision-making process. When integrated with tools such as formal proof verifiers, internet search, and symbolic math packages, I expect, say, 2026-level AI, when used properly, will be a trustworthy co-author in mathematical research, and in many other fields as well.  
> \- Terence Tao, [Embracing change and resetting expectations](https://unlocked.microsoft.com/ai-anthology/terence-tao/) (2023-06).

> I have decided to finally get acquainted with the #Lean4 interactive proof system (using AI assistance as necessary to help me use it), [...] I plan to journal here my learning process, starting as someone who has not written a single line of Lean code before.  
> \- Terence Tao, tooted in [mathstodon.xyz](https://mathstodon.xyz/@tao/111206761117553482) (2023-10).

These were the GPT-4 days. Tao seems to have seen some promise in it, and the setup he envisioned looks familiar today.[^2]
What impressed me was that he didn't just lay out a vision. He got right to work learning the tools he'd need. I was reminded that he's a _living_ mathematician.

> Now, I think, the next cultural shift will be whether AI-generated proofs will be accepted. Right now, AI tools are not at the level where they can generate proofs to really advance mathematical problems. Maybe undergraduate-level homework assignments, they can kind of manage, but research mathematics, they’re not at that level yet. But at some point, we’re going to start seeing AI-assisted papers come out and there will be a debate.  
> \- Terence Tao, interviewed in [What Makes for 'Good' Mathematics?](https://www.quantamagazine.org/what-makes-for-good-mathematics-20240201/) (2024-02)

> Nevertheless, I see a role for these tools in drawing out a user's latent knowledge in a problem, simply by being a good listener and proposing reasonably relevant ideas that the user is expert enough to evaluate.  
> \- Terence Tao, [Machine assisted proof](https://terrytao.wordpress.com/wp-content/uploads/2024/03/machine-assisted-proof-notices.pdf) (2024-02)

> In the future, I expect AI tools to automate more of the tedious steps of proof formalization. Eventually, it may become faster to write a correct formal proof than a correct informal one!  
> \- Terence Tao, [Marton’s Polynomial Freiman-Ruzsa conjecture](https://terrytao.wordpress.com/wp-content/uploads/2024/04/pfr.pdf) (2024-04).

> I think in three years AI will become useful for mathematicians. It will be a great co-pilot.  
> \- Terence Tao, [AI Will Become Mathematicians' 'Co-Pilot'](https://www.scientificamerican.com/article/ai-will-become-mathematicians-co-pilot/) (2024-06).

Still in the GPT-4 days. Tao saw AI less as a researcher who could finish a proof and more as someone who could toss out ideas to explore (or as a handy tool for taking care of the tedious bits). Back then, I pictured researchers chatting casually. Not everything they said had to be right or useful. A word might remind someone of something they'd once known but since forgotten. Spark an idea. That sort of thing.

> The experience seemed roughly on par with trying to advise a mediocre, but not completely incompetent, (static simulation of a) graduate student. However, this was an improvement over previous models, whose capability was closer to an actually incompetent (static simulation of a) graduate student. It may only take one or two further iterations of improved capability (and integration with other tools, such as computer algebra packages and proof assistants) until the level of "(static simulation of a) competent graduate student" is reached, at which point I could see this tool being of significant use in research level tasks.  
> \- Terence Tao, tooted in [mathstodon.xyz](https://mathstodon.xyz/@tao/113132503432772494) (2024-09).

> I'm not super interested in duplicating the things that humans are already good at. It seems inefficient. I think at the frontier, we will always need humans and AI. They have complementary strengths. AI is very good at converting billions of pieces of data into one good answer. Humans are good at taking 10 observations and making really inspired guesses.  
> \- Terence Tao, interviewed in [We’re Entering Uncharted Territory for Math](https://www.theatlantic.com/technology/archive/2024/10/terence-tao-ai-interview/680153/) (2024-10).

Then came o1, and with it a shift toward scaling test-time compute. By then, the comparison was shifting to what a semi-expert or a graduate student could do.
Even then, AI wasn't seen as ready to make the kind of inspired guesses needed at the frontier of mathematical research.

> Perhaps the only thing that I was expecting to see at this point that has not yet materialized is significant contributions from modern AI tools. They are being used in a number of secondary ways in this project, for instance through tools such as Github copilot to speed up the writing of Lean proofs, the LaTeX blueprint, and other software code, and several of our visualization tools were also largely co-written using large language models such as Claude. However, for the core task of resolving implications, the more “good old-fashioned” automated theorem provers have so far proven superior.  
> \- Terence Tao, [The equational theories project: a brief tour](https://terrytao.wordpress.com/2024/10/12/the-equational-theories-project-a-brief-tour/) (2024-10)

That's not to say AI wasn't contributing to research. It was, but still in a supporting role: helping people sort out their thoughts, work with Lean, that sort of thing.

> Tao remarked, "These are extremely challenging. I think that in the near term basically the only way to solve them, short of having a real domain expert in the area, is by a combination of a semi-expert like a graduate student in a related field, maybe paired with some combination of a modern AI and lots of other algebra packages..." [...] Tao anticipated that the benchmark would "resist AIs for several years at least," noting that the problems require substantial domain expertise and that we currently lack sufficient relevant training data.  
> \- Terence Tao, remarked in [FrontierMath benchmark](https://arxiv.org/abs/2411.04872) (2024-11).

At the same time, we kept trying to stump AI with harder and harder exam questions. Almost as if we were putting it through boot camp before sending it to the research frontier.

Then came o3 in April 2025. Around the same time, I happened to attend a project meeting related to AI for mathematics.

> I think the conclusion to draw is that the optimal level of automation is actually somewhere strictly between 0% and 100% - enough automation at each scale to reduce the amount of tedious repetition of effort, but still enough of a "human in the loop" at each scale to review and fix local issues in order to allow the human to retain a sense of the structure of the task at all scales.  
> \- Terence Tao, tooted in [mathstodon.xyz](https://mathstodon.xyz/@tao/114501120421010793) (2025-05).

Even as the tools improved, Tao was finding reasons not to automate everything. The point wasn't just to produce a correct proof faster, but to retain a sense of how the mathematics fitted together.

In June, KAIST established its [Graduate School of AI for Math](https://ai4math.kaist.ac.kr/). Looking back, I find the timing interesting. AI was still largely a supporting tool in mathematical research, yet mathematicians were already building institutions around its potential. Perhaps they could see something coming. Or perhaps they simply knew they had better be ready for whatever came next.

> Recently, the application of AI tools to Erdos problems passed a milestone: an Erdos problem (#728) was solved more or less autonomously by AI (after some feedback from an initial attempt), in the spirit of the problem (as reconstructed by the Erdos problem website community), with the result (to the best of our knowledge) not replicated in existing literature (although similar results proven by similar methods were located).  
> \- Terence Tao, tooted in [mathstodon.xyz](https://mathstodon.xyz/@tao/115855840223258103) (2026-01).

I quoted this in my [previous post](/blog/blue-from-indigo/). Back then, I was wondering how the teacher's role might change once the student surpassed them. I thought I had some idea.[^3]

> A little bit surprised. [...] But I think it’s basically almost exactly the schedule. We are basically seeing AIs used on par with the contribution that I would expect a junior human co-author to make, especially one who’s very happy to do grunt work and work out a lot of tedious cases.  
> \- Terence Tao, interviewed in [The Edge of Mathematics](https://www.theatlantic.com/technology/2026/02/ai-math-terrance-tao/686107/) (2026-02)

So, more or less on schedule, the graduate student had become a junior co-author. Not quite an independent researcher, but certainly no longer just a sounding board or a mere assistant. Tao's prediction from 2023 was looking accurate. But the story didn't stop there.

# 2026-

_Hanc marginis exiguitas non caperet._

# Mathematicians for AI

> But the relative certainty I had in 2023 of predicting the next three years of development is gone now. The world is a far more unpredictable place, in so many dimensions, and pretty much anything is possible at this point. I'm not sure anyone is capable of any reliable forecasting beyond a year at best, currently.  
> \- Terence Tao, interviewed in [Interview: Terence Tao on AI](https://teorth.github.io/tao-web/ai-views-interview.html) (2026-07)

In February, Tao had looked back at his 2023 prediction and found it almost exactly on schedule. Only a few months later, he no longer felt confident making another prediction of the same kind.

> I believe that we are now entering a era of comparable turbulence in mathematics. This time, though, what is being stress-tested is not our foundational framework for mathematical truth, but rather the largely implicit framework of mathematical values and practices: what we consider a contribution to be, what we reward, what we regard as understood, and who — or what — we regard as having done the work.  
> \- Terence Tao, [Mathematics in the age of AI](https://arxiv.org/abs/2608.16753) (2026-08)

Something had shifted. Tao was no longer just asking what AI could do for mathematics, but what mathematics itself was for.

> My feelings on recent developments are very mixed and complex.  
> \- Terence Tao, [100+ reactions to 100+ solutions](https://proofsandprompts.com/2026/10/08/100-reactions-to-100-solutions/) (2026-10)

A lot has happened lately, and there's still a lot happening. I won't pretend to understand everything that has changed. But the tone of the discussion was becoming different. Earlier, the excitement had been about what AI might contribute to mathematics. Now, there was also anxiety about what mathematics might lose in the process.

> OpenAI did make a major breakthrough (on quasi-Riemann Hypothesis) the biggest advance on the subject in 50 years. [...] It’s not something I think any single mathematician alive would have come up with. [...] The AI companies clearly, I'm sure they secretly devoted much more time to the Riemann hypothesis than what they disclosed. And they couldn't touch it. I mean, something beyond current AI is needed. So maybe some combination of humans and AIs in 2050 or something will make a further progress. Who knows?  
> \- Terence Tao, [No More Heroes - Terence Tao Talks to Numberphile About AI](https://www.youtube.com/watch?v=bAnwMdfcMVw) (2026-10)

Who knows, indeed.

> Right. I think mathematicians of the future will be more interpreters of results, rather than just raw generators of results. We can mechanize results to a large extent, but to interpret them, we will need to do so in novel and very humanistic ways.  
> \- Terence Tao, interviewed in [Math 2.0](https://lareviewofbooks.org/article/terence-tao-six-math-essentials-ai-machine-learning/) (2026-11)

Calculemus! And then?

[^1]: Funny how the Riemann hypothesis shows up here.
[^2]: And funny that he picked 2026.
[^3]: Now I'm not so sure.
