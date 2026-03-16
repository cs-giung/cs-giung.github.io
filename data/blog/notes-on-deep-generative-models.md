---
title: "Notes on deep generative models"
date: "2026-03-16"
author: "Giung Nam"
description: "(WIP)"
---

## Deep Generative Models (DGMs)

> Deep generative models (DGMs) are neural networks that learn a probability distribution over high-dimensional data (e.g., images, text, audio) so they can generate new examples that resemble the dataset.  
> \- Lai et al., ["The Principles of Diffusion Models"](https://arxiv.org/abs/2510.21890) (2025)

The goal is to construct a statistical model $p_{\phi}$ (a deep neural network parameterized by $\phi$) such that drawing a sample $x \sim p_{\phi}$ is indistinguishable from drawing a sample $x \sim p_{\text{data}}$.
To achieve this, we typically minimize a divergence measure, $\phi^{\ast} = \argmin_{\phi} D(Q_{\text{data}}, p_{\phi})$, while keeping the following in mind:
- The paramount goal is the "efficient generation" of new samples; being able to compute the exact density is often secondary or even unnecessary.
- We rely on "a finite set of samples" from the true distribution rather than the distribution itself; the divergence must be estimable using only these available samples.

> While both generative modeling and sampling involve approximating a target distribution, they differ fundamentally in terms of the information available. In generative modeling, one has access to samples, whereas in sampling, we only have access to a pointwise oracle and no samples.  
> \- Shen et al., ["Sequential Controlled Langevin Diffusions"](https://arxiv.org/abs/2412.07081) (2024)

Ultimately, "efficient generation" remains the guiding principle of any DGM; the ability to estimate and optimize the divergence is a natural, practical prerequisite that arises during the training process.[^1]
Furthermore, it is crucial to emphasize the phrase "from a finite dataset of samples," as it highlights a fundamental distinction of DGMs in the information available compared to classical sampling setups:

[^1]: Indeed, the divergence is not always explicitly computed.

### Energy-Based Models (EBMs)

EBMs define the distribution via an energy function $E_{\phi}(x)$:
$$
\begin{align}\textstyle
p_{\phi}(x) = \frac{1}{Z(\phi)} \exp{(-E_{\phi}(x))},
\quad\text{where } Z(\phi) = \int \exp{(-E_{\phi}(x))} \mathrm{d}x.
\end{align}
$$
EBMs are typically trained with MLE.
However, this approach struggles with the intractable partition function $Z$, prompting the development of alternative training methods such as contrastive divergence or score matching.
Additionally, sampling from EBMs often requires computationally intensive MCMC methods.

### Autoregressive Models (ARMs)

ARMs factorize the distribution into a product of conditional probabilities using the chain rule:
$$ 
\begin{align}\textstyle
p_{\phi}(x) = \prod_{l=1}^{L} p_{\phi}(x_{l} \mid x_{<l}),
\quad\text{where } x = (x_{1},\dots,x_{L}) \text{ and } x_{<l} = (x_{1},\dots,x_{l-1}).
\end{align}
$$
ARMs are typically trained with MLE, without struggling with global normalization, as each term is inherently normalized (e.g., via softmax for discrete or parameterized Gaussian for continuous variables).
Although their sequential nature limits sampling speed and flexibility, these models remain foundational in likelihood-based generative modeling and are key approaches in modern research, especially for LLMs.

### Variational Autoencoders (VAEs)

VAEs model the distribution by introducing a latent variable $z$:
$$
\begin{align}\textstyle
p_{\phi}(x) = \int p_{\phi}(x \mid z) p(z) \mathrm{d}z,
\end{align}
$$
with a decoder $p_{\phi}(x \mid z)$ and a prior distribution $p(z)$.
VAEs are typically trained by maximizing the ELBO, a lower bound on $\log{p_{\phi}(x)}$, utilizing an encoder $p_{\theta}(z \mid x)$ to approximate the intractable posterior $p(z \mid x)$.
VAEs enable efficient data generation by sampling from the prior $p(z)$ and decoding it into $x$.

### Generative Adversarial Networks (GANs)

GANs implicitly model the distribution by introducing a latent noise $z$ with a deterministic generator $G_{\phi}$:
$$
\begin{align}\textstyle
p_{\phi}(x) = \int p_{\phi}(x \mid z) p(z) \mathrm{d}z,
\text{ where } p_{\phi}(x \mid z) = \delta(x - G_{\phi}(z)).
\end{align}
$$
GANs are trained in a likelihood-free manner by employing an adversarial game between the generator $G_{\phi}$ and a discriminator $D_{\omega}$.
This process is typically formulated as a minimax objective, where $D_{\omega}$ is trained to distinguish real data from generated samples, while $G_{\phi}$ is trained to produce samples that fool the discriminator.

### Normalizing Flows (NFs)

NFs model the distribution by transforming a simple base distribution $p(z)$ through a sequence of invertible and differentiable mappings $f_{\phi}$, using the change of variables formula:
$$
\begin{align}\textstyle
p_{\phi}(x) = p(z) \cdot \left\lvert \operatorname{det}\frac{\partial f_{\phi}^{-1}(x)}{\partial x} \right\rvert,
\text{ where } z = f_{\phi}^{-1}(x).
\end{align}
$$
NFs are typically trained with MLE because the log-likelihood is exact and tractable.
While NFs allow for exact density estimation and efficient one-pass sampling, their architectural design is constrained by the need for invertibility and a computationally efficient Jacobian determinant.

### Diffusion Models (DMs)

DMs model the distribution by reversing a progressive noise injection process:
$$
\begin{align}\textstyle
p_{\phi}(x) = \int p(z_{T}) \prod_{t=1}^{T} p_{\phi}(z_{t-1} \mid z_{t}) \mathrm{d}z_{1:T},
\end{align}
$$
where a fixed forward process $q(z_{t} \mid z_{t-1})$ transforms data $x = z_{0}$ into Gaussian noise $z_{T}$, and a learnable reverse process $p_{\phi}(z_{t-1} \mid z_{t})$ iteratively remove noise.
DMs are typically trained by maximizing the ELBO, often simplified to a MSE objective that predicts the noise added at each timestep $t$.
