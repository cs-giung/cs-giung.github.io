---
title: "The hardware lottery"
date: "2020"
author: "Sara Hooker"
category: "Notes & Scribbles"
type: "excerpt"
description: "The performance of an algorithm is fundamentally intertwined with the hardware and software it runs on."
sources:
  - title: "The Hardware Lottery (2020, arXiv:2009.06489v2)"
    url: "https://cs-giung.github.io/the-hardware-lottery.pdf"
---

*Selected excerpts from the 2020 essay; omissions are marked with […].*

What follows is part position paper and part historical review. This essay introduces the term hardware lottery to describe when a research idea wins because it is compatible with available software and hardware and not because the idea is superior to alternative research directions. We argue that choices about software and hardware have often played a decisive role in deciding the winners and losers in early computer science history.

[…]

In many ways, hardware is catching up to the present state of machine learning research. Hardware is only economically viable if the lifetime of the use case lasts more than three years (Dean, 2020). Betting on ideas which have longevity is a key consideration for hardware developers. Thus, co-design effort has focused almost entirely on optimizing an older generation of models with known commercial use cases. For example, matrix multiplies are a safe target to optimize for because they are here to stay — anchored by the widespread use and adoption of deep neural networks in production systems. Allowing for unstructured sparsity and weight specific quantization are also safe targets because there is wide consensus that these will enable higher levels of compression.

[…]

While specialization makes deep neural networks more efficient, it also makes it far more costly to stray from accepted building blocks. It prompts the question of how much researchers will implicitly overfit to ideas that operationalize well on available hardware rather than take a risk on ideas that are not currently feasible? What are the failures we still don’t have the hardware and software to see as a success?

[…]

Scientific progress occurs when there is a confluence of factors which allows the scientist to overcome the "stickyness" of the existing paradigm. The speed at which paradigm shifts have happened in AI research have been disproportionately determined by the degree of alignment between hardware, software and algorithm. Thus, any attempt to avoid hardware lotteries must be concerned with making it cheaper and less time-consuming to explore different hardware-software-algorithm combinations.
