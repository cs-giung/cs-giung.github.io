---
title: "Scribbles on series expansion"
date: "2026-03-20"
author: "Giung Nam"
category: "Notes & Scribbles"
description: ""
---

To approximate $f(x) = \left( 1 - x^{2} \right)^{\frac{1}{2}}$ near $x=1$, a standard Taylor series expansion centered at $x=1$ fails because $f^\prime(x)$ involves a term of $\left( 1 - x^{2} \right)^{-\frac{1}{2}}$, which is undefined at the boundary.
Instead, we utilize a Puiseux series, which allows for expansions involving fractional powers.

## Puiseux series

We begin by substituting $x = 1 - t$ into the function:
$$
\begin{align}\textstyle
f(1-t) = \sqrt{1 - (1 - t)^{2}} = \sqrt{2t - t^{2}} = \sqrt{2t} \left( 1 - \frac{t}{2} \right)^{\frac{1}{2}}.
\end{align}
$$
Using the generalized binomial theorem, $(1 + u)^{\alpha} = \sum_{n=0}^{\infty} \binom{\alpha}{n} u^{n}$ for $\lvert u \rvert < 1$, we expand it for $\lvert t \rvert < 2$:
$$
\begin{align}\textstyle
f(1 - t)
&=\textstyle \sqrt{2t} \left( 1 - \frac{t}{4} - \frac{t^{2}}{32} - \frac{t^{3}}{128} - \cdots \right) \\
&=\textstyle \sqrt{2} t^{\frac{1}{2}} - \frac{\sqrt{2}}{4}t^{\frac{3}{2}} - \frac{\sqrt{2}}{32}t^{\frac{5}{2}} - \frac{\sqrt{2}}{128}t^{\frac{7}{2}} - \cdots.
\end{align}
$$
The behavior of the function near the singularity depends on the direction of approach:
- For $x < 1$, the positive $t = 1 - x$ yields a strictly real-valued series:
$$
\begin{align}\textstyle
f(x) = \sqrt{2} (1-x)^{\frac{1}{2}} - \frac{\sqrt{2}}{4}(1-x)^{\frac{3}{2}} - \frac{\sqrt{2}}{32}(1-x)^{\frac{5}{2}} - \frac{\sqrt{2}}{128}(1-x)^{\frac{7}{2}} - \cdots.
\end{align}
$$
- For $x > 1$, letting $t = (x - 1)e^{i\pi}$, where $t^{\frac{1}{2}} = i (x-1)^{\frac{1}{2}}$, yields an imaginary-valued series:
$$
\begin{align}\textstyle
f(x) = i \left[
    \sqrt{2} (x-1)^{\frac{1}{2}} + \frac{\sqrt{2}}{4}(x-1)^{\frac{3}{2}} - \frac{\sqrt{2}}{32}(x-1)^{\frac{5}{2}} + \frac{\sqrt{2}}{128}(x-1)^{\frac{7}{2}} - \cdots
\right].
\end{align}
$$


