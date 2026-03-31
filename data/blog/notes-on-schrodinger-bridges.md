---
title: "Notes on Schrodinger bridges"
date: "2026-03-30"
author: "Giung Nam"
category: "Notes & Scribbles"
description: ""
---

### FPE and FKF

A controlled Ito process $(\bm{X}_{t}^{\bm{u}} \in \mathbb{R}^{d})_{t \in [0,T]}$ is defined as the solution to the SDE:
$$
\begin{align}
\mathrm{d}\bm{X}_{t}^{\bm{u}}
&= \left[ \bm{f}(\bm{X}_{t}^{\bm{u}}, t) + \sigma_{t}\bm{u}(\bm{X}_{t}^{\bm{u}}, t) \right] \mathrm{d}t + \sigma_{t}\mathrm{d}\bm{B}_{t},
\end{align}
$$
with the reference drift $\bm{f} : \mathbb{R}^{d} \times [0, T] \rightarrow \mathbb{R}^{d}$, the diffusion coefficient $\sigma_{t} : [0, T] \rightarrow \mathbb{R}_{\geq 0}$, and the control drift $\bm{u} : \mathbb{R}^{d} \times [0, T] \rightarrow \mathbb{R}^{d}$.
FPE provides a deterministic forward-time evolution of probability densities $p_{t}^{\bm{u}}$:
$$
\begin{align}\textstyle
\partial_{t} p_{t}^{\bm{u}}(\bm{x})
= -\nabla \cdot \left\{
    \left[
        \bm{f}(\bm{x}, t) + \sigma_{t} \bm{u}(\bm{x}, t)
    \right] p_{t}^{\bm{u}}(\bm{x})
\right\} + \frac{\sigma_{t}^{2}}{2} \Delta p_{t}^{\bm{u}}(\bm{x}).
\end{align}
$$
Conversely, FKE provides a deterministic backward-time evolution of expected costs $r^{\bm{u}}$:
$$
\begin{align}\textstyle
\partial_{t} r^{\bm{u}}(\bm{x}, t) + \langle
    \bm{f}(\bm{x}, t) + \sigma_{t} \bm{u}(\bm{x}, t),
    \nabla r^{\bm{u}}(\bm{x}, t)
\rangle + \frac{\sigma_{t}^{2}}{2} \Delta r^{\bm{u}}(\bm{x}, t) - c(\bm{x}, t) r^{\bm{u}}(\bm{x}, t) = 0,
\end{align}
$$
which, via FKF, represents the conditional expectation of future outcomes given the current state:
$$
\begin{align}\textstyle
r^{\bm{u}}(\bm{x}, t) = \mathbb{E} \left[
    \exp{\left( -\int_{t}^{T} c(\bm{X}_{s}^{\bm{u}}, s) \mathrm{d}s\right)} \Phi(\bm{X}_{T}^{\bm{u}}) \mid \bm{X}_{t}^{\bm{u}} = \bm{x}
\right],
\end{align}
$$
with the terminal constraint $r^{\bm{u}}(\bm{x}, T) = \Phi(\bm{x})$ and the running cost $c : \mathbb{R}^{d} \times [0,T] \rightarrow \mathbb{R}$.

### KL divergence

Let $\mathbb{P}^{\tilde{\bm{u}}}$ and $\mathbb{P}^{\bm{u}}$ be path measures on the space of continuous paths $C([0,T];\mathbb{R}^{d})$, induced by SDEs with the same reference drift $\bm{f}$ and diffusion coefficient $\sigma_{t}$, but governed by different controls $\tilde{\bm{u}}$ and $\bm{u}$.
Assuming absolute continuity $\mathbb{P}^{\tilde{\bm{u}}} \ll \mathbb{P}^{\bm{u}}$, the KL divergence of $\mathbb{P}^{\tilde{\bm{u}}}$ with respect to $\mathbb{P}^{\bm{u}}$ is given by:
$$
\begin{align}
D_{\text{KL}} \left(
    \mathbb{P}^{\tilde{\bm{u}}} \parallel \mathbb{P}^{\bm{u}}
\right)
&\textstyle = \mathbb{E}_{\bm{X}_{0:T}^{\tilde{\bm{u}}} \sim \mathbb{P}^{\tilde{\bm{u}}}} \left[
    \frac{1}{2} \int_{0}^{T} \left\lVert
        \tilde{\bm{u}}(\bm{X}_{t}^{\tilde{\bm{u}}}, t)
        - \bm{u}(\bm{X}_{t}^{\tilde{\bm{u}}}, t)
    \right\rVert^{2} \mathrm{d}t
\right], \\
&\textstyle = \int_{0}^{T} \int_{\mathbb{R}^{d}} \left[ \frac{1}{2} \left\lVert
    \tilde{\bm{u}}(\bm{x}, t) - \bm{u}(\bm{x}, t)
\right\rVert^{2} p_{t}^{\tilde{\bm{u}}}(\bm{x}) \right] \mathrm{d}\bm{x} \mathrm{d}t.
\end{align}
$$

### Dynamic SB

The dynamic SB formulation aims to determine the optimal control that minimally perturbs the reference dynamics while satisfying the initial and terminal marginal distribution constraints, $\bm{X}_{0} \sim \pi_{0}$ and $\bm{X}_{T} \sim \pi_{T}$:
$$
\begin{align}
\inf_{\bm{u}, p_{t}^{\bm{u}}}
& \textstyle \quad D_{\text{KL}}\left( \mathbb{P}^{\bm{u}} \parallel \mathbb{Q} \right) = \int_{0}^{T} \int_{\mathbb{R}^{d}} \left[
    \frac{1}{2} \left\lVert \bm{u}(\bm{x}, t) \right\rVert^{2} p_{t}^{\bm{u}}(\bm{x})
\right] \mathrm{d}\bm{x} \mathrm{d}t, \\
\text{s.t.}
& \textstyle \quad \partial_{t} p_{t}^{\bm{u}}(\bm{x})
= -\nabla \cdot \left\{
    \left[
        \bm{f}(\bm{x}, t) + \sigma_{t} \bm{u}(\bm{x}, t)
    \right] p_{t}^{\bm{u}}(\bm{x})
\right\} + \frac{\sigma_{t}^{2}}{2} \Delta p_{t}^{\bm{u}}(\bm{x}), p_{0}^{\bm{u}} = \pi_{0}, p_{T}^{\bm{u}} = \pi_{T}.
\end{align}
$$
As $\bm{u}$ and $p_{t}^{\bm{u}}$ are coupled by the FPE constraint, we reframe this as an unconstrained optimization problem by introducing a Lagrangian:
$$
\begin{align}\textstyle
\mathcal{L}(p_{t}^{\bm{u}}, \bm{u}, \psi_{t})
= \int_{0}^{T} \int_{\mathbb{R}^{d}} \left\{
    \frac{1}{2} \left\lVert \bm{u} \right\rVert^{2} p_{t}^{\bm{u}}
    + \psi_{t} \cdot \left[
        \partial_{t}p_{t}^{\bm{u}} + \nabla \cdot \left[ \left( \bm{f} + \sigma_{t}\bm{u} \right) p_{t}^{\bm{u}} \right] - \frac{\sigma_{t}^{2}}{2} \Delta p_{t}^{\bm{u}}
    \right]
\right\} \mathrm{d}\bm{x} \mathrm{d}t,
\end{align}
$$
which yields the optimal control $\bm{u}^{\ast}$ written in terms of the Lagrange multiplier $\psi_{t} : \mathbb{R}^{d} \rightarrow \mathbb{R}$:
$$
\begin{align}
\bm{u}^{\ast}(\bm{x}, t) = \sigma_{t} \nabla \psi_{t}(\bm{x}),
\end{align}
$$
and the minimizer $(\bm{u}^{\ast}, p_{t}^{\ast})$ as the solution to the HJB-FP system:
$$
\begin{align}
\begin{cases}
\partial_{t}\psi_{t} = -\frac{\sigma_{t}^{2}}{2} \left\lVert \nabla \psi_{t} \right\rVert^{2} - \langle \nabla \psi_{t}, \bm{f} \rangle - \frac{\sigma_{t}^{2}}{2} \Delta \psi_{t}, \\
\partial_{t}p_{t}^{\ast} = - \nabla \cdot \left[ \left( \bm{f} + \sigma_{t}^{2}\nabla\psi_{t} \right) p_{t}^{\ast} \right] + \frac{\sigma_{t}^{2}}{2} \Delta p_{t}^{\ast},
\end{cases}
\quad \text{s.t.} \quad p_{0}^{\ast} = \pi_{0}, p_{T}^{\ast} = \pi_{T}.
\end{align}
$$
Applying the change of variables $(\psi, p_{t}^{\ast}) \mapsto (\phi_{t}, \hat{\psi}_{t})$ defined as $\psi_{t}(\bm{x}) = \log{\phi_{t}(\bm{x})}$ and $p_{t}^{\ast}(\bm{x}) = \phi_{t}(\bm{x}) \hat{\phi}_{t}(\bm{x})$, i.e., Cole-Hopf transformation, transforms the non-linear HJB-FP system into the linear system for $(\phi_{t}, \hat{\phi}_{t})$:
$$
\begin{align}
\begin{cases}
\partial_{t}\phi_{t} = -\langle \nabla \phi_{t}, \bm{f} \rangle - \frac{\sigma_{t}^{2}}{2} \Delta \phi_{t}, \\
\partial_{t}\hat{\phi}_{t} = - \nabla \cdot (\hat{\phi}_{t} \bm{f}) + \frac{\sigma_{t}^{2}}{2} \Delta \hat{\phi}_{t},
\end{cases}
\quad \text{s.t.} \quad p_{0}^{\ast} = \phi_{0}\hat{\phi}_{0}, p_{T}^{\ast} = \phi_{T} \hat{\phi}_{T}.
\end{align}
$$
