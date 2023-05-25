---
title: /logs/karpathy-2017
layout: page
permalink: /logs/karpathy-2017
---

## [Neural networks are Software 2.0 (Andrej Karpathy, 2017)](https://medium.com/@karpathy/software-2-0-a64152b37c35){:target="_blank"}

1. I sometimes see people refer to neural networks as just _"another tool in your machine learning toolbox"_. They have some pros and cons, they work here or there, and sometimes you can use them to win Kaggle competitions. Unfortunately, this interpretation completely misses the forest for the trees. Neural networks are not just another classifier, they represent the beginning of _a fundamental shift in how we write software_. They are __*Software 2.0*__.
2. The "classical stack" of __*Software 1.0*__ is what we're all familiar with — it is written in languages such as Python, C++, etc. It consists of explicit instructions to the computer written by a programmer. By writing each line of code, the programmer identifies a specific point in program space with some desirable behavior. In contrast, __*Software 2.0*__ is to specify some goal on the behavior of a desirable program (e.g., “satisfy a dataset of input output pairs of examples”, or “win a game of Go”), write a rough skeleton of the code (e.g. a neural net architecture), that identifies a subset of program space to search, and use the computational resources at our disposal to search this space for a program that works.
3. It turns out that a large portion of real-world problems have the property that it is significantly easier to collect the data (or more generally, identify a desirable behavior) than to explicitly write the program. In these cases, the programmers will split into two teams. The 2.0 programmers manually curate, maintain, massage, clean and label datasets; each labeled example literally programs the final system because the dataset gets compiled into Software 2.0 code via the optimization. Meanwhile, the 1.0 programmers maintain the surrounding tools, analytics, visualizations, labeling interfaces, infrastructure, and the training code.

## [Neural networks are NOT the universal solution (Dogan Ulus, 2017)](https://medium.com/@doganulus/i-think-this-post-makes-an-old-mistake-7b26519c0742){:target="_blank"}

I think this post makes an old mistake. This mistake is the dream of the universal homogeneous solution.

In the beginning of the last century, a handful of great minds had the same mistake. They wanted the Mathematics 2.0, which would be entirely based on Logic, until Godel was managed to show the impossibility. The early AI repeated the mistake. The formal verification too. They all failed in their original goal of the universal homogeneous solution. But provided many good solutions that we can mix with others.

So probably there is no homogeneous solution for any sufficiently complex phenomenon but what can we do? Well, I’d say that the only solution is to mix suitable solutions at every level. For example, in a neural network, you have to mix different types of layers. In a driving controller, you have to mix different types of neural networks. Then, in a software, you have to mix usual stored-programs and neural networks.

My conclusion: Neural networks are NOT the universal solution. They are and will be a solution among others for software and other problems. So we need to design neural networks to work with other solutions, not to eradicate.

## References

* Karpathy, Andrej (2017). _Software 2.0_.  
  [https://medium.com/@karpathy/software-2-0-a64152b37c35](https://medium.com/@karpathy/software-2-0-a64152b37c35){:target="_blank"}
* Ulus, Dogan (2017). _Comment on the post_.  
  [https://medium.com/@doganulus/i-think-this-post-makes-an-old-mistake-7b26519c0742](https://medium.com/@doganulus/i-think-this-post-makes-an-old-mistake-7b26519c0742){:target="_blank"}
