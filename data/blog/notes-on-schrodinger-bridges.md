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

Let $\mathbb{P}^{\bm{u}}$ and $\mathbb{P}^{\tilde{\bm{u}}}$ be path measures on the space of continuous paths $C([0,T];\mathbb{R}^{d})$, induced by SDEs with the same reference drift $\bm{f}$ and diffusion coefficient $\sigma_{t}$, but governed by different controls $\bm{u}$ and $\tilde{\bm{u}}$.
Assuming absolute continuity $\mathbb{P}^{\bm{u}} \ll \mathbb{P}^{\tilde{\bm{u}}}$, the KL divergence of $\mathbb{P}^{\bm{u}}$ with respect to $\mathbb{P}^{\tilde{\bm{u}}}$ is given by:
$$
\begin{align}
D_{\text{KL}} \left(
    \mathbb{P}^{\bm{u}} \parallel \mathbb{P}^{\tilde{\bm{u}}}
\right)
&\textstyle = \mathbb{E}_{\bm{X}_{0:T}^{\bm{u}} \sim \mathbb{P}^{\bm{u}}} \left[
    \frac{1}{2} \int_{0}^{T} \left\lVert
        \bm{u}(\bm{X}_{t}^{\bm{u}}, t)
        - \tilde{\bm{u}}(\bm{X}_{t}^{\bm{u}}, t)
    \right\rVert^{2} \mathrm{d}t
\right], \\
&\textstyle = \int_{0}^{T} \int_{\mathbb{R}^{d}} \left[ \frac{1}{2} \left\lVert
    \bm{u}(\bm{x}, t) - \tilde{\bm{u}}(\bm{x}, t)
\right\rVert^{2} p_{t}^{\bm{u}}(\bm{x}) \right] \mathrm{d}\bm{x} \mathrm{d}t.
\end{align}
$$

### SOC

The SOC formulation aims to determine the optimal control that minimally perturbs the reference dynamics starting from $\pi_{0}$ while minimizing the expected cumulative cost and terminal cost:
$$
\begin{align}
\inf_{\bm{u}}
& \textstyle \quad D_{\text{KL}}\left(
    \mathbb{P}^{\bm{u}} \parallel \mathbb{P}^{\bm{0}}
\right) + \mathbb{E}_{\bm{X}_{0:T}^{\bm{u}} \sim \mathbb{P}^{\bm{u}}} \left[
    \int_{0}^{T} c(\bm{X}_{t}^{\bm{u}}, t) \mathrm{d}t + \Phi(\bm{X}_{T}^{\bm{u}})
\right], \\
\text{s.t.}
& \textstyle \quad \mathrm{d}\bm{X}_{t}^{\bm{u}} = \left[
    \bm{f}(\bm{X}_{t}^{\bm{u}}, t) + \sigma_{t} \bm{u}(\bm{X}_{t}^{\bm{u}}, t)
\right] \mathrm{d}t + \sigma_{t} \mathrm{d} \bm{B}_{t}, \bm{X}_{0}^{\bm{u}} \sim \pi_{0}.
\end{align}
$$
We define the value function $V_{t} : \mathbb{R}^{d} \rightarrow \mathbb{R}$ as the optimal cost-to-go from any fixed point $(\bm{x}, t)$:
$$
\begin{align}
V_{t}(\bm{x})
& \textstyle = \inf_{\bm{u}} \mathbb{E}_{\bm{X}_{t:T}^{\bm{u}} \sim \mathbb{P}^{\bm{u}}} \left[
    \int_{t}^{T} \left(
        \frac{1}{2}\left\lVert \bm{u}(\bm{X}_{s}^{\bm{u}}, s) \right\rVert^{2} + c(\bm{X}_{s}^{\bm{u}}, s)
    \right) \mathrm{d}s + \Phi(\bm{X}_{T}^{\bm{u}}) \mid \bm{X}_{t}^{\bm{u}} = \bm{x}
\right] \\
& \textstyle = \inf_{\bm{u}} \mathbb{E}_{\bm{X}_{t:T}^{\bm{u}} \sim \mathbb{P}^{\bm{u}}} \left[
    \int_{t}^{\tau} \left(
        \frac{1}{2}\left\lVert \bm{u}(\bm{X}_{s}^{\bm{u}}, s) \right\rVert^{2} + c(\bm{X}_{s}^{\bm{u}}, s)
    \right) \mathrm{d}s + V_{\tau}(\bm{X}_{\tau}^{\bm{u}}) \mid \bm{X}_{t}^{\bm{u}} = \bm{x}
\right],
\end{align}
$$
which solves the HJB equation:
$$
\begin{align}\textstyle
\partial_{t} V_{t}(\bm{x})
= - \left[
    \langle \bm{f}, \nabla V_{t} \rangle
    + \frac{\sigma_{t}^{2}}{2} \Delta V_{t}
\right] + \frac{\sigma_{t}^{2}}{2} \left\lVert \nabla V_{t} \right\rVert^{2} - c,
\quad\text{s.t.}\quad V_{T} = \Phi,
\end{align}
$$
and satisfies the backward-time evolution in the SDE:
$$
\begin{align}\textstyle
\mathrm{d}V_{t} = \left(
    \frac{\sigma_{t}^{2}}{2} \left\lVert
        \nabla V_{t}
    \right\rVert^{2} - c + \langle
        \sigma_{t} \bm{u}, \nabla V_{t}
    \rangle
\right) \mathrm{d}t + \nabla V_{t}^\top \sigma_{t} \mathrm{d}\bm{B}_{t}.
\end{align}
$$


Here, the optimal control $\bm{u}^{\ast}$ is written in terms of the value function:
$$
\begin{align}
\bm{u}^{\ast}(\bm{x}, t) = - \sigma_{t} \nabla V_{t}(\bm{x}).
\end{align}
$$

### DSB

The DSB formulation aims to determine the optimal pair of control and density that minimally perturbs the reference dynamics subject to initial and terminal marginal constraints:
$$
\begin{align}
\inf_{\bm{u}, p_{t}^{\bm{u}}}
& \textstyle \quad D_{\text{KL}}\left(
    \mathbb{P}^{\bm{u}} \parallel \mathbb{P}^{\bm{0}}
\right), \\
\text{s.t.}
& \textstyle \quad \mathrm{d}\bm{X}_{t}^{\bm{u}} = \left[
    \bm{f}(\bm{X}_{t}^{\bm{u}}, t) + \sigma_{t} \bm{u}(\bm{X}_{t}^{\bm{u}}, t)
\right] \mathrm{d}t + \sigma_{t} \mathrm{d} \bm{B}_{t}, \bm{X}_{0}^{\bm{u}} \sim \pi_{0}, \bm{X}_{T}^{\bm{u}} \sim \pi_{T}.
\end{align}
$$
We reframe this as an unconstrained optimization problem by introducing a Lagrangian with a Lagrange multiplier $\psi_{t} : \mathbb{R}^{d} \rightarrow \mathbb{R}$:
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
which yields the minimizer $(\bm{u}^{\ast}, p_{t}^{\ast})$ as the solution to the HJB-FP system:
$$
\begin{align}
\begin{cases}
\partial_{t}\psi_{t} = -\frac{\sigma_{t}^{2}}{2} \left\lVert \nabla \psi_{t} \right\rVert^{2} - \langle \nabla \psi_{t}, \bm{f} \rangle - \frac{\sigma_{t}^{2}}{2} \Delta \psi_{t}, \\
\partial_{t}p_{t}^{\ast} = - \nabla \cdot \left[ \left( \bm{f} + \sigma_{t}^{2}\nabla\psi_{t} \right) p_{t}^{\ast} \right] + \frac{\sigma_{t}^{2}}{2} \Delta p_{t}^{\ast},
\end{cases}
\quad \text{s.t.} \quad p_{0}^{\ast} = \pi_{0}, p_{T}^{\ast} = \pi_{T}.
\end{align}
$$
Here, the optimal control $\bm{u}^{\ast}$ is written in terms of the Lagrange multiplier:
$$
\begin{align}
\bm{u}^{\ast}(\bm{x}, t) = \sigma_{t} \nabla \psi_{t}(\bm{x}).
\end{align}
$$

### Hopf-Cole-transformed DSB

Applying the change of variables $(\psi_{t}, p_{t}^{\ast}) \mapsto (\phi_{t}, \hat{\phi}_{t})$, defined as $\psi_{t} = \log{\phi_{t}}$ and $p_{t}^{\ast} = \phi_{t}\hat{\phi}_{t}$, transforms the non-linear HJB-FP system into the linear system for a Schrodinger potential $(\phi_{t}, \hat{\phi}_{t})$:
$$
\begin{align}
\begin{cases}
\partial_{t}\phi_{t} = -\langle \nabla \phi_{t}, \bm{f} \rangle - \frac{\sigma_{t}^{2}}{2} \Delta \phi_{t}, \\
\partial_{t}\hat{\phi}_{t} = - \nabla \cdot (\hat{\phi}_{t} \bm{f}) + \frac{\sigma_{t}^{2}}{2} \Delta \hat{\phi}_{t},
\end{cases}
\quad \text{s.t.} \quad
\begin{cases}
p_{0}^{\ast} &= \phi_{0}\hat{\phi}_{0}, \\
p_{T}^{\ast} &= \phi_{T} \hat{\phi}_{T},
\end{cases}
\end{align}
$$
where the solution is given by:
$$
\begin{align}
\begin{cases}
\phi_{t}(\bm{x}) &= \int_{\mathbb{R}^{d}} \mathbb{P}_{T \mid t}^{\bm{0}}(\bm{y} \mid \bm{x}) \phi_{T}(\bm{y}) \mathrm{d}\bm{y}, \\
\hat{\phi}_{t}(\bm{x}) &= \int_{\mathbb{R}^{d}} \mathbb{P}_{t \mid 0}^{\bm{0}}(\bm{x} \mid \bm{y}) \hat{\phi}_{0}(\bm{y}) \mathrm{d}\bm{y},
\end{cases}
\quad \text{s.t.} \quad
\begin{cases}
\pi_{0}(\bm{x}) &= \phi_{0}(\bm{x}) \hat{\phi}_{0}(\bm{x}), \\
\pi_{T}(\bm{x}) &= \phi_{T}(\bm{x}) \hat{\phi}_{T}(\bm{x}).
\end{cases}
\end{align}
$$
Here, the optimal control $\bm{u}^{\ast}$ is written in the Schrodinger potential:
$$
\begin{align}
\bm{u}^{\ast}(\bm{x}, t) = \sigma_{t} \nabla \log{\phi_{t}(\bm{x})}.
\end{align}
$$

### SOC-formulated DSB

The DSB formulation can be interpreted as a specific instance of the SOC formulation with the followings:
$$
\begin{align}\textstyle
c(\bm{x},t)=0, \quad
V_{t}(\bm{x}) = -\log{\phi_{t}(\bm{x})}, \quad
\Phi(\bm{x}) = V_{T}(\bm{x}) = \log{\frac{\hat{\phi}_{T}(\bm{x})}{\pi_{T}(\bm{x})}}.
\end{align}
$$
Substituting these yields the SOC formulation equivalent to the DSB formulation:
$$
\begin{align}
\inf_{\bm{u}}
& \textstyle \quad D_{\text{KL}}\left(
    \mathbb{P}^{\bm{u}} \parallel \mathbb{P}^{\bm{0}}
\right) + \mathbb{E}_{\bm{X}_{0:T}^{\bm{u}} \sim \mathbb{P}^{\bm{u}}} \left[
    \log{\frac{\hat{\phi}_{T}(\bm{X}_{T}^{\bm{u}})}{\pi_{T}(\bm{X}_{T}^{\bm{u}})}}
\right], \\
\text{s.t.}
& \textstyle \quad \mathrm{d}\bm{X}_{t}^{\bm{u}} = \left[
    \bm{f}(\bm{X}_{t}^{\bm{u}}, t) + \sigma_{t} \bm{u}(\bm{X}_{t}^{\bm{u}}, t)
\right] \mathrm{d}t + \sigma_{t} \mathrm{d} \bm{B}_{t}, \bm{X}_{0}^{\bm{u}} \sim \pi_{0}.
\end{align}
$$

