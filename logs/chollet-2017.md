---
title: /logs/chollet-2017
layout: page
permalink: /logs/chollet-2017
---

## [Part 1. The limitations of deep learning (Francois Chollet, 2017)](https://blog.keras.io/the-limitations-of-deep-learning.html){:target="_blank"}

1. A deep learning model is _"just" a chain of simple, continuous geometric transformations_ mapping one vector space into another. All it can do is map one data manifold X into another manifold Y, assuming the existence of a learnable continuous transform from X to Y, and the availability of a dense sampling of X:Y to use as training data. So even though a deep learning model can be interpreted as a kind of program, inversely _most programs cannot be expressed as deep learning models_—for most tasks, either there exists no corresponding practically-sized deep neural network that solves the task, or even if there exists one, it may not be learnable, i.e. the corresponding geometric transform may be far too complex, or there may not be appropriate data available to learn it.
2. Deep learning models do not have any understanding of their input, at least not in any human sense. Our own understanding of images, sounds, and language, is grounded in our sensorimotor experience as humans—as embodied earthly creatures. Machine learning models have no access to such experiences and thus cannot _"understand"_ their inputs in any human-relatable way. By annotating large numbers of training examples to feed into our models, we get them to learn a geometric transform that maps data to human concepts on this specific set of examples, but this mapping is just a simplistic sketch of the original model in our minds, the one developed from our experience as embodied agents—it is like a dim image in a mirror.
3. Despite our progress on machine perception, we are still very far from human-level AI: our models can only perform _"local generalization"_, adapting to new situations that must stay very close from past data, while human cognition is capable of _"extreme generalization"_, quickly adapting to radically novel situations, or planning very for long-term future situations.

## [Part 2. The future of deep learning (Francois Chollet, 2017)](https://blog.keras.io/the-future-of-deep-learning.html){:target="_blank"}

1. Models will be more like programs, and will have capabilities that go far beyond the continuous geometric transformations of the input data that we currently work with. These programs will arguably be much closer to the abstract mental models that humans maintain about their surroundings and themselves, and they will be capable of _stronger generalization_ due to their rich algorithmic nature.
2. They will be _grown automatically_ rather than handcrafted by human engineers, using modular parts stored in a global library of reusable subroutines—a library evolved by learning high-performing models on thousands of previous tasks and datasets. As common problem-solving patterns are identified by the meta-learning system, they would be turned into a reusable subroutine—much like functions and classes in contemporary software engineering—and added to the global library. This achieves the capability for _abstraction_.
3. This global library and associated model-growing system will be able to achieve some form of human-like _"extreme generalization"_: given a new task, a new situation, the system would be able to assemble a new working model appropriate for the task using very little data, thanks to 1) rich program-like primitives that generalize well and 2) extensive experience with similar tasks. In the same way that humans can learn to play a complex new video game using very little play time because they have experience with many previous games, and because the models derived from this previous experience are abstract and program-like, rather than a basic mapping between stimuli and action.

## References

* Chollet, Francois (2017). _The limitations of deep learning_.  
  [https://blog.keras.io/the-limitations-of-deep-learning.html](https://blog.keras.io/the-limitations-of-deep-learning.html){:target="_blank"}
* Chollet, Francois (2017). _The future of deep learning_.  
  [https://blog.keras.io/the-future-of-deep-learning.html](https://blog.keras.io/the-future-of-deep-learning.html){:target="_blank"}
