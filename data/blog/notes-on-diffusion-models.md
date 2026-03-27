---
title: "Notes on diffusion models"
date: "2026-03-20"
author: "Giung Nam"
category: "Notes & Scribbles"
description: ""
---

## Continuous Diffusion

For continuous data $\bm{x} \in \mathbb{R}^{K}$, the most basic choice for the forward process is a Gaussian distribution.
In DDPM, the forward process allows us to sample any latent state $\bm{z}_{t}$ directly from the data $\bm{z}_{0} = \bm{x}$, or transition between two intermediate steps $s<t$, as follows:
$$
\begin{align}
q(\bm{z}_{t} \mid \bm{z}_{0})
&= \mathcal{N}\left(
    \bm{z}_{t} ; \sqrt{\alpha_{t}} \bm{z}_{0}, (1-\alpha_{t})\bm{I}
\right), \\
q(\bm{z}_{t} \mid \bm{z}_{s})
&= \mathcal{N}\left(
    \bm{z}_{t} ; \sqrt{\alpha_{t \mid s}} \bm{z}_{s}, (1-\alpha_{t \mid s})\bm{I}
\right).
\end{align}
$$
where $\alpha_{t} \in [0, 1]$ is a strictly decreasing function in $t$ with $\alpha_{0} \approx 1$ and $\alpha_{1} \approx 0$, and $\alpha_{t \mid s} = \alpha_{t} / \alpha_{s}$.
The reverse posterior is then given by:
$$
\begin{align}\textstyle
q(\bm{z}_{s} \mid \bm{z}_{t}, \bm{z}_{0})
= \mathcal{N}\left(
    \bm{z}_{s} ; \frac{
        \sqrt{\alpha_{t \mid s}}(1-\alpha_{s})\bm{z}_{t} + \sqrt{\alpha_{s}}(1-\alpha_{t \mid s})\bm{z}_{0}
    }{1-\alpha_{t}}, \frac{(1-\alpha_{s})(1-\alpha_{t \mid s})}{1-\alpha_{t}}\bm{I}
\right).
\end{align}
$$

## Denoising Diffusion Implicit Model (DDIM)

DDIM introduces a hyperparameter $\sigma_{s}$ for the variance of the reverse posterior, generalizing the stochastic process while maintaining the same marginals $q(\bm{z}_{t} \mid \bm{z}_{0})$.
The reverse transition is defined by:
$$
\begin{align}\textstyle
q(\bm{z}_{s} \mid \bm{z}_{t}, \bm{z}_{0})
= \mathcal{N}\left(
    \bm{z}_{s} ;
    \sqrt{\alpha_{s}}\bm{z}_{0}
    + \sqrt{1 - \alpha_{s} - \sigma_{s}^{2}} \frac{
        \bm{z}_{t} - \sqrt{\alpha_{t}}\bm{z}_{0}
    }{\sqrt{1 - \alpha_{t}}},
    \sigma_{s}^{2}\bm{I}
\right).
\end{align}
$$
While setting $\sigma_{s}^{2} = \frac{(1-\alpha_{s})(1-\alpha_{t \mid s})}{(1-\alpha_{t})}$ recovers the standard reverse posterior, DDIM generally defines a non-Markovian forward process; the forward transition now depends on $\bm{z}_{0}$:
$$
\begin{align}\textstyle
q(\bm{z}_{t} \mid \bm{z}_{s}, \bm{z}_{0})
= \mathcal{N}\left(
    \bm{z}_{t} ;
    \sqrt{\alpha_{t}}\bm{z}_{0}
    + \sqrt{1-\alpha_{t}}\sqrt{1-\alpha_{s}-\sigma_{s}^{2}}\frac{\bm{z}_{s} - \sqrt{\alpha_{s}}\bm{z}_{0}}{1-\alpha_{s}},
    \frac{\sigma_{s}^{2}(1-\alpha_{t})}{1-\alpha_{s}} \bm{I}
\right).
\end{align}
$$
Using a neural network $\bm{x}_{\phi}(\bm{z}_{t}, t) \approx \bm{z}_{0}$, parameterized by $\phi$, the approximated reverse process $p_{\phi}(\bm{z}_{s} \mid \bm{z}_{t})$ can be written in the same form.
The discrete-time and continuous-time diffusion losses are given by:
$$
\begin{align}
\mathcal{L}(\phi ; \bm{z}_{0}, T)
&= \textstyle \mathbb{E}_{t \sim \{\frac{1}{T},\frac{2}{T},\dots,1\}} \mathbb{E}_{\bm{z}_{t} \sim q(\bm{z}_{t} \mid \bm{z}_{0})} \left[
    T D_{\text{KL}}\left( q(\bm{z}_{s} \mid \bm{z}_{t}, \bm{z}_{0}) \parallel p_{\phi}(\bm{z}_{s} \mid \bm{z}_{t}) \right)
\right] \\
&= \textstyle \mathbb{E}_{t \sim \{\frac{1}{T},\frac{2}{T},\dots,1\}} \mathbb{E}_{\bm{z}_{t} \sim q(\bm{z}_{t} \mid \bm{z}_{0})} \left[
    \frac{T}{2 \sigma_{s}^{2}} \left(
        \sqrt{\alpha_{s}} - \sqrt{\alpha_{t}}\sqrt{\frac{1 - \alpha_{s} - \sigma_{s}^{2}}{1-\alpha_{t}}}
    \right)^{2} \left\lVert
        \bm{z}_{0} - \bm{x}_{\phi}(\bm{z}_{t}, t)
    \right\rVert^{2}
\right], \\
\lim_{T \to \infty} \mathcal{L}(\phi ; \bm{z}_{0}, T)
&= \textstyle \mathbb{E}_{t \sim \mathcal{U}[0, 1]} \mathbb{E}_{\bm{z}_{t} \sim q(\bm{z}_{t} \mid \bm{z}_{0})} \left[
    \frac{1}{2\sigma_{t}^{2}} \left(
        \frac{\alpha_{t}^{\prime}}{2 \sqrt{\alpha_{t}} (1-\alpha_{t})} \left(
            \sqrt{\alpha_{t}} \sigma_{t}^{2} - \frac{1}{\sqrt{\alpha_{t}}}
        \right)
    \right)^{2} \left\lVert
        \bm{z}_{0} - \bm{x}_{\phi}(\bm{z}_{t}, t)
    \right\rVert^{2}
\right].
\end{align}
$$

### Continuous-time formulation (SDE, ODE)

DDIM injects noise on a discrete-time grid:
$$
\begin{align}\textstyle
\bm{z}_{t} = \sqrt{\alpha_{t}} \bm{z}_{0} + \sqrt{1 - \alpha_{t} - \sigma_{s}^{2}} \frac{\bm{z}_{s} - \sqrt{\alpha_{s}}\bm{z}_{0}}{\sqrt{1 - \alpha_{s}}} + \sigma_{s}\bm{\varepsilon},
\text{ where } \bm{\varepsilon} \sim \mathcal{N}(\bm{0}, \bm{I}).
\end{align}
$$
Transitioning to continuous-time involves reducing the time interval $\Delta t = t - s$ to an infinitesimal $\mathrm{d}t$, turning difference equations into differential equations.
By introducing $\bm{\varepsilon}_{s} = \frac{\bm{z}_{s} - \sqrt{\alpha_{s}} \bm{z}_{0}}{\sqrt{1 - \alpha_{s}}}$, $\beta_t = \frac{1 - \alpha_{t \mid s}}{\Delta t}$, and $\sigma_{s}^{2} = \frac{(1-\alpha_{s}) (1-\alpha_{t \mid s}) \eta^{2}}{(1-\alpha_{t})}$, the forward step and its approximation are given by:
$$
\begin{align}
\bm{z}_{t}
&\textstyle = \sqrt{1 - \beta_{t} \Delta t} \bm{z}_{s} + \left(
    \sqrt{1 - \alpha_{t} - \sigma_{s}^{2}} - \sqrt{1 - \beta_{t} \Delta t} \sqrt{1 - \alpha_{s} - \sigma_{s}^{2}}
\right) \bm{\varepsilon}_{s} + \eta \sqrt{\beta_{t} \Delta t} \bm{\varepsilon} \\
&\textstyle \approx \left(
    1 - \frac{1}{2} \beta_{t} \Delta t
\right) \bm{z}_{s} + \left(
    \frac{1 - \eta^{2}}{2 \sqrt{1 - \alpha_{s}}} \beta_{t} \Delta t
\right) \bm{\varepsilon}_{s} + \eta \sqrt{\beta_{t} \Delta t} \bm{\varepsilon}.
\end{align}
$$
Using the score-matching identity, $\bm{\varepsilon}_{s} = -\sqrt{1 - \alpha_{s}} \nabla_{\bm{z} = \bm{z}_{s}} \log{q(\bm{z} \mid \bm{z}_{0})}$, we obtain the increment:
$$
\begin{align}\textstyle
\bm{z}_{t} - \bm{z}_{t - \Delta t} \approx
-\frac{1}{2} \beta_{t} \Delta t \bm{z}_{t - \Delta t}
-\frac{1 - \eta^{2}}{2} \beta_{t} \Delta t \nabla_{\bm{z} = \bm{z}_{t - \Delta t}} \log{q(\bm{z}_{t - \Delta t} \mid \bm{z}_{0})}
+\eta \sqrt{\beta_{t} \Delta t} \bm{\varepsilon},
\end{align}
$$
which corresponds to the continuous-time SDE evolving forward and reverse in time, respectively:
$$
\begin{align}
\mathrm{d}\bm{z}(t) &\textstyle = \left[
    \bm{f}(\bm{z}(t), t) - \frac{1 - \eta^{2}}{2}g^{2}(t) \nabla_{\bm{z}_{t} = \bm{z}(t)} \log{q(\bm{z}_{t} \mid \bm{z}_{0})}
\right] \mathrm{d}t + \eta g(t) \mathrm{d}\bm{w}(t), \\
\mathrm{d}\bar{\bm{z}}(t) &\textstyle = \left[
    \bm{f}(\bar{\bm{z}}(t), t) - \frac{1 + \eta^{2}}{2} g^{2}(t) \nabla_{\bm{z}_{t} = \bar{\bm{z}}(t)} \log{q(\bm{z}_{t})}
\right] \mathrm{d}t + \eta g(t) \mathrm{d}\bar{\bm{w}}(t),
\end{align}
$$
where $\bm{f}(\bm{z}(t), t) = -\frac{1}{2} \beta_{t} \bm{z}(t)$is the drift coefficient, $g(t) = \sqrt{\beta_{t}}$ is the diffusion coefficient, and $\bm{w}(t)$ and $\bar{\bm{w}}(t) = \bm{w}(1-t) - \bm{w}(1)$ are standard Wiener processes in forward and reverse time, respectively.

__Remark.__
Here, $\eta = 0$ corresponds to the deterministic DDIM setup where $\sigma_{s} = 0$; the forward and reverse SDEs collapse into a single PF-ODE, establishing a unique, invertible path between the noise and the data.
On the other hand, $\eta=1$ corresponds to the stochastic DDPM setup.
It is worth noting that even in this stochastic regime, the reverse-time SDE does not inject arbitrary random noise; for $g(t) \neq 0$, the diffusion term remains strictly coupled with the score-driven drift term.

__Remark.__
Introducing a neural network for $\bm{\varepsilon}$-prediction, i.e., $\bm{\varepsilon}_{\phi}(\bm{z}_{t}, t) \approx \bm{\varepsilon}_{0}$, is more algebraically concise than $\bm{x}$-prediction in this formulation, as the $\bm{\varepsilon}$-prediction network directly yields the score function via the score-matching identity.
Indeed, it is standard practice for diffusion models to adopt an $\bm{\varepsilon}$-prediction strategy.

## Discrete Diffusion

For discrete data $\bm{x} \in \{0, 1\}^{K}$ represented as a one-hot vector, the most basic choice for the forward process is a Categorical distribution.
The forward process allows us to sample any latent state $\bm{z}_{t}$ directly from the data $\bm{z}_{0} = \bm{x}$, or transition between two intermediate steps $s<t$, as follows:
$$
\begin{align}
q(\bm{z}_{t} \mid \bm{z}_{0})
&= \mathrm{Cat}\left(
    \bm{z}_{t} ; \alpha_{t} \bm{z}_{0} + (1-\alpha_{t}) \bm{\pi}
\right), \\
q(\bm{z}_{t} \mid \bm{z}_{s})
&= \mathrm{Cat}\left(
    \bm{z}_{t} ; \alpha_{t \mid s} \bm{z}_{s} + (1-\alpha_{t \mid s}) \bm{\pi}
\right).
\end{align}
$$
where $\alpha_{t} \in [0, 1]$ is a strictly decreasing function in $t$ with $\alpha_{0} \approx 1$ and $\alpha_{1} \approx 0$, and $\alpha_{t \mid s} = \alpha_{t} / \alpha_{s}$.
The reverse posterior is then given by:
$$
\begin{align}\textstyle
q(\bm{z}_{s} \mid \bm{z}_{t}, \bm{z}_{0})
= \mathrm{Cat}\left(
    \bm{z}_{s} ; \frac{
        \left[
            \alpha_{t \mid s} \bm{z}_{t}
            + (1-\alpha_{t \mid s}) \langle \bm{z}_{t}, \bm{\pi} \rangle \bm{1}
        \right] \odot \left[ \alpha_{s} \bm{z}_{0} + (1-\alpha_{s}) \bm{\pi} \right]
    }{
        \alpha_{t} \langle \bm{z}_{t}, \bm{z}_{0} \rangle
        + (1-\alpha_{t}) \langle \bm{z}_{t}, \bm{\pi} \rangle
    }
\right).
\end{align}
$$

### Masked Diffusion Model (MDM)

MDM defines the $K^\text{th}$ category as a special `[MASK]` token, which serves as an absorbing state with a stationary distribution $\bm{\pi} = \bm{m} = [0,\dots,0,1]^\top$.
In the forward process, tokens either remain themselves or transition to the mask.
For $s < t$, the reverse posterior is given by:
$$
\begin{align}
q(\bm{z}_{s} \mid \bm{z}_{t}, \bm{z}_{0}) =
\begin{cases}
    \mathrm{Cat}\left( \bm{z}_{s} ; \bm{z}_{0} \right) & \bm{z}_{t} \neq \bm{m}, \\
    \mathrm{Cat}\left( \bm{z}_{s} ; \frac{(1-\alpha_{s})\bm{m} + (\alpha_{s} - \alpha_{t})\bm{z}_{0}}{1-\alpha_{t}} \right) & \bm{z}_{t} = \bm{m}.
\end{cases}
\end{align}
$$
Using a neural network $\bm{x}_{\phi}(\bm{z}_{t}, t) \approx \bm{z}_{0}$, parameterized by $\phi$ and ensured to be $\langle \bm{x}_{\phi}, \bm{m} \rangle = 0$, the approximated reverse process $p_{\phi}(\bm{z}_{s} \mid \bm{z}_{t})$ can be written in the same form.
The discrete-time and continuous-time diffusion losses are given by:
$$
\begin{align}
\mathcal{L}(\phi ; \bm{z}_{0}, T)
&=\textstyle \mathbb{E}_{t \sim \{\frac{1}{T},\frac{2}{T}\dots,1\}} \mathbb{E}_{\bm{z}_{t} \sim q(\bm{z}_{t} \mid \bm{z}_{0})} \left[
    T D_{\text{KL}}\left( q(\bm{z}_{s} \mid \bm{z}_{t}, \bm{z}_{0}) \parallel p_{\phi}(\bm{z}_{s} \mid \bm{z}_{t}) \right)
\right] \\
&=\textstyle \mathbb{E}_{t \sim \{\frac{1}{T},\frac{2}{T}\dots,1\}} \mathbb{E}_{\bm{z}_{t} \sim q(\bm{z}_{t} \mid \bm{z}_{0})} \left[
    \frac{T(\alpha_{t} - \alpha_{s})}{1 - \alpha_{t}} \log{\langle \bm{x}_{\phi}(\bm{z}_{t}, t), \bm{z}_{0} \rangle}
\right], \\
\lim_{T \to \infty} \mathcal{L}(\phi ; \bm{z}_{0}, T)
&=\textstyle \mathbb{E}_{t \sim \mathcal{U}[0, 1]} \mathbb{E}_{\bm{z}_{t} \sim q(\bm{z}_{t} \mid \bm{z}_{0})} \left[
    \frac{\alpha_{t}^\prime}{1 - \alpha_{t}} \log{\langle \bm{x}_{\phi}(\bm{z}_{t}, t), \bm{z}_{0} \rangle}
\right].
\end{align}
$$

### ReMasking Diffusion Model (ReMDM)

ReMDM introduces a hyperparameter $\sigma_{t}$ to MDM, enabling transitions to the mask during the reverse process and generalizing the stochastic process while maintaining the same marginals $q(\bm{z}_{t} \mid \bm{z}_{0})$.
The reverse transition is defined by:
$$
\begin{align}
q(\bm{z}_{s} \mid \bm{z}_{t}, \bm{z}_{0}) =
\begin{cases}
    \mathrm{Cat}\left(
        \bm{z}_{s} ; \sigma_{t} \bm{m} + (1 - \sigma_{t}) \bm{z}_{0}
    \right) & \bm{z}_{t} \neq \bm{m}, \\
    \mathrm{Cat}\left(
        \bm{z}_{s} ; \frac{(1 - \alpha_{s} - \sigma_{t}\alpha_{t}) \bm{m} + (\alpha_{s} - \alpha_{t} + \sigma_{t}\alpha_{t}) \bm{z}_{0}}{1-\alpha_{t}}
    \right) & \bm{z}_{t} = \bm{m}.
\end{cases}
\end{align}
$$
While setting $\sigma_{t} = 0$ recovers the reverse posterior of MDM, ReMDM generally defines a non-Markovian forward process; the forward transition now depends on $\bm{z}_{0}$:
$$
\begin{align}
q(\bm{z}_{t} \mid \bm{z}_{s}, \bm{z}_{0}) =
\begin{cases}
    \mathrm{Cat}\left(
        \bm{z}_{t} ; \frac{
            (1 - \sigma_{t}) \alpha_{t} \bm{z}_{0}
            + (\alpha_{s} - \alpha_{t} + \sigma_{t}\alpha_{t}) \bm{m}
        }{\alpha_{s}}
    \right) & \bm{z}_{s} \neq \bm{m}, \\
    \mathrm{Cat}\left(
        \bm{z}_{t} ; \frac{
            \sigma_{t} \alpha_{t} \bm{z}_{0}
            + (1 - \alpha_{s} - \sigma_{t} \alpha_{t})\bm{m}
        }{1-\alpha_{s}}
    \right) & \bm{z}_{s} = \bm{m}.
\end{cases}
\end{align}
$$
The discrete-time diffusion loss is given by:
$$
\begin{align}
\mathcal{L}(\phi ; \bm{z}_{0}, T)
&=\textstyle \mathbb{E}_{t \sim \{\frac{1}{T},\frac{2}{T}\dots,1\}} \mathbb{E}_{\bm{z}_{t} \sim q(\bm{z}_{t} \mid \bm{z}_{0})} \left[
    T D_{\text{KL}}\left( q(\bm{z}_{s} \mid \bm{z}_{t}, \bm{z}_{0}) \parallel p_{\phi}(\bm{z}_{s} \mid \bm{z}_{t}) \right)
\right] \\
&=\textstyle \mathbb{E}_{t \sim \{\frac{1}{T},\frac{2}{T}\dots,1\}} \mathbb{E}_{\bm{z}_{t} \sim q(\bm{z}_{t} \mid \bm{z}_{0})} \left[
    \frac{T(\alpha_{t} - \alpha_{s} - \sigma_{t}\alpha_{t})}{1 - \alpha_{t}} \log{\langle \bm{x}_{\phi}(\bm{z}_{t}, t), \bm{z}_{0} \rangle}
\right].
\end{align}
$$

### Uniform Diffusion Model (UDM)

UDM defines the stationary distribution as a uniform across all categories, $\bm{\pi} = \bm{1} / K$.
In this regime, the forward process allows a token to transition to any other category (including itself), eventually erasing all signal as it converges to uniform noise.
For $s < t$, the reverse posterior is given by:
$$
\begin{align}\textstyle
q(\bm{z}_{s} \mid \bm{z}_{t}, \bm{z}_{0}) =
\mathrm{Cat}\left(
    \bm{z}_{s} ; \frac{
        \left[
            K \alpha_{t \mid s} \bm{z}_{t} + (1 - \alpha_{t \mid s}) \bm{1}
        \right] \odot \left[ K \alpha_{s} \bm{z}_{0} + (1 - \alpha_{s}) \bm{1} \right]
    }{K \alpha_{t} \langle \bm{z}_{t}, \bm{z}_{0} \rangle + (1-\alpha_{t})}
\right).
\end{align}
$$
Using a neural network $\bm{x}_{\phi}(\bm{z}_{t}, t) \approx \bm{z}_{0}$, parameterized by $\phi$, the approximated reverse process can be written in the same form.
The continuous-time diffusion loss is given by:
$$
\begin{align}
\lim_{T \to \infty} \mathcal{L}(\phi ; \bm{z}_{0}, T)
&=\textstyle \lim_{T \to \infty} \mathbb{E}_{t \sim \{\frac{1}{T},\frac{2}{T}\dots,1\}} \mathbb{E}_{\bm{z}_{t} \sim q(\bm{z}_{t} \mid \bm{z}_{0})} \left[
    T D_{\text{KL}}\left( q(\bm{z}_{s} \mid \bm{z}_{t}, \bm{z}_{0}) \parallel p_{\phi}(\bm{z}_{s} \mid \bm{z}_{t}) \right)
\right] \\
&=\textstyle \mathbb{E}_{t \sim \mathcal{U}[0, 1]} \mathbb{E}_{\bm{z}_{t} \sim q(\bm{z}_{t} \mid \bm{z}_{0})} \left[
    \frac{\alpha_{t}^{\prime}}{K \alpha_{t}} \left[
        \frac{K}{\bar{\bm{x}}^{(i)}}
        - \frac{K}{\bar{\bm{x}}_{\phi}^{(i)}}
        - \sum_{j \text{ s.t. } \bm{z}_{t}^{(j)} = 0} \left(
            \frac{\bar{\bm{x}}^{(j)}}{\bar{\bm{x}}^{(i)}}
            \log{\frac{\bar{\bm{x}}_{\phi}^{(i)} \bar{\bm{x}}^{(j)}}{\bar{\bm{x}}_{\phi}^{(j)} \bar{\bm{x}}^{(i)}}}
        \right)
    \right]
\right],
\end{align}
$$
where $\bar{\bm{x}}^{(i)} = K \alpha_{t} \bm{z}_{0}^{(i)} + (1 - \alpha_{t})$, $\bar{\bm{x}}_{\phi}^{(i)} = K \alpha_{t} \bm{x}_{\phi}^{(i)}(\bm{z}_{t}, t) + (1 - \alpha_{t})$, and $i = \argmax_{j \in [K]} \bm{z}_{t}^{(j)}$.

### Continuous-time formulation (CTMC)

Markovian discrete diffusion models randomly transit states on a discrete-time grid:
$$
\begin{align}
\bm{z}_{t} = (1 - b_{t}) \bm{z}_{s} + b_{t} \bm{v}_{t},
\text{ where } b_{t} \sim \mathrm{Bern}(1 - \alpha_{t \mid s}) \text{ and } \bm{v}_{t} \sim \mathrm{Cat}(\bm{\pi}).
\end{align}
$$
Transitioning to continuous-time involves reducing the time interval $\Delta t = t - s$ to an infinitesimal $\mathrm{d}t$, turning difference equations into differential equations.
By introducing $\beta_{t} = \frac{1 - \alpha_{t \mid s}}{\Delta t}$, the transition probability matrix is:
$$
\begin{align}
\bm{P}(s, t) = (1 - \beta_{t} \Delta t) \bm{I} + \beta_{t} \Delta t \bm{\pi} \bm{1}^\top.
\end{align}
$$
As the state remains unchanged over zero time, i.e., $\bm{P}(s, s) = \bm{I}$, we obtain the increment:
$$
\begin{align}
\bm{P}(s, t) - \bm{P}(s, s)
= \beta_{t} \Delta t \left( \bm{\pi}\bm{1}^\top - \bm{I} \right),
\end{align}
$$
which corresponds to the continuous-time CTMC evolving forward in time with the transition-rate matrix:
$$
\begin{align}
\bm{Q}(t) = \beta_{t} (\bm{\pi}\bm{1}^\top - \bm{I}).
\end{align}
$$
The forward evolution of the marginal probability distribution $\bm{q}(t) = \alpha_{t} \bm{z}_{0} + (1 - \alpha_{t}) \bm{\pi}$ is governed by the Kolmogorov forward equation:
$$
\begin{align}\textstyle
\dot{\bm{q}}(t) = \bm{Q}(t) \bm{q}(t).
\end{align}
$$

The relationship between the forward rate matrix $\bm{Q}(t)$ and the reverse rate matrix $\bar{\bm{Q}}(t)$ is governed by the entry-wise probability balance:
$$
\begin{align}
\bar{Q}_{ij}(t) = Q_{ji}(t) \frac{q_{j}(t)}{q_{i}(t)}.
\end{align}
$$

## Reward-tilted Diffusion

The ultimate goal of a diffusion model is to generate samples following the data distribution $q(\bm{z}_{0})$.
However, in many applications, we seek samples under a specific reward function $r$.
To this end, we define the reward-tilted distribution by reweighting the original density with an exponential reward term:
$$
\begin{align}\textstyle
q_{r}(\bm{z}_{0}) \propto q(\bm{z}_{0}) \exp{\left( \beta r(\bm{z}_{0}) \right)}.
\end{align}
$$

### Guidance and search methods

In continuous diffusion, steering toward high reward can be achieved by modifying the score function.
If we define an intermediate reward-tilted density $q^{r}(\bm{z}_{t}) \propto q(\bm{z}_{t}) \exp{\left( \beta r_{t}(\bm{z}_{t}) \right)}$ by assuming an intermediate reward function $r_{t}$, its score is given by:
$$
\begin{align}\textstyle
\nabla_{\bm{z}_{t}} \log{q^{r}(\bm{z}_{t})}
= \nabla_{\bm{z}_{t}} \log{q(\bm{z}_{t})} + \beta \nabla_{\bm{z}_{t}} r_{t}(\bm{z}_{t}),
\end{align}
$$
which suggests that adding a steering term (the gradient of the intermediate reward) to the original score function effectively guides the reverse process toward the reward-tilted distribution.
However, an explicit intermediate reward $r_{t}$ is rarely available, as most rewards are only defined for the clean data at $t=0$.
To address this, one can define $r_{t}$ as the expected tilted reward conditioned on the current noisy state:
$$
\begin{align}\textstyle
r_{t}(\bm{z}_{t}) := \frac{1}{\beta} \log{\mathbb{E}_{\bm{z}_{0} \sim q(\cdot \mid \bm{z}_{t})} \left[ \exp{\left( \beta r(\bm{z}_{0}) \right)} \right]}.
\end{align}
$$

In discrete diffusion, where gradients are unavailable, we instead tilt the transition rates of the CTMC.
The reverse evolution of the reward-tilted process is governed by a modified reverse rate matrix $\bar{\bm{Q}}^{r}(t)$, where the transition rate from state $i$ to state $j$ is defined via Doob's $h$-transform:
$$
\begin{align}\textstyle
\bar{Q}^{r}_{ij}(t) = \bar{Q}_{ij}(t) \frac{h(j,t)}{h(i,t)},
\text{ where } h(\bm{z}_{t},t) := \exp{\left( \beta r_{t}(\bm{z}_{t}) \right)}.
\end{align}
$$

### SMC methods

While local guidance (gradients or $h$-transforms) provides a point-wise steering mechanism, SMC methods offer a robust search strategy applicable to both continuous and discrete diffusions.
Using the reverse transition of the original diffusion process as the proposal distribution, SMC evolves a population of $M$ particles via:
$$
\begin{align}\textstyle
\text{(Sampling)} &\quad \forall m \in [M] : \bm{z}_{s}^{m} \sim p(\bm{z}_{s} \mid \bm{z}_{t}^{m}), \\
\text{(Resampling)} &\quad \forall m \in [M] : \bm{z}_{s}^{m} \gets \bm{z}_{s}^{m^{\prime}},
    \text{ where } m^\prime \sim \mathrm{Cat}\left( \left\{ \bar{G}(\bm{z}_{t}^{i}, \bm{z}_{s}^{i}) \right\}_{i=1}^{M} \right),
\end{align}
$$
where the unnormalized and normalized incremental weights respectively are:
$$
\begin{align}\textstyle
G(\bm{z}_{t}, \bm{z}_{s}) = \frac{h(\bm{z}_{s}, s)}{h(\bm{z}_{t}, t)}, \quad
\bar{G}(\bm{z}_{t}^{i}, \bm{z}_{s}^{i}) = \frac{G(\bm{z}_{t}^{i}, \bm{z}_{s}^{i})}{\sum_{j=1}^{M}G(\bm{z}_{t}^{j}, \bm{z}_{s}^{j}) }.
\end{align}
$$

