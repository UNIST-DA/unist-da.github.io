---
date: 2023-07-03
title: Neural Flows: Efficient Alternative to Neural ODEs (NeurIPS 2021)
category: Paper Review
presenter: YongKyung Oh
url: https://www.notion.so/bc06c908cae541e9a9e9932388cc3054
keywords: Neural Differential Equation, Flow
---

# Selected Paper


## Title: **Neural Flows: Efficient Alternative to Neural ODEs**


## Abstract: 


Neural ordinary differential equations describe how values change in time. This is the reason why they gained importance in modeling sequential data, especially when the observations are made at irregular intervals. In this paper we propose an alternative by directly modeling the solution curves - the flow of an ODE - with a neural network. This immediately eliminates the need for expensive numerical solvers while still maintaining the modeling capability of neural ODEs. We propose several flow architectures suitable for different applications by establishing precise conditions on when a function defines a valid flow. Apart from computational efficiency, we also provide empirical evidence of favorable generalization performance via applications in time series modeling, forecasting, and density estimation.


## Link


Biloš, M., Sommer, J., Rangapuram, S. S., Januschowski, T., & Günnemann, S. (2021). Neural flows: Efficient alternative to neural ODEs. _Advances in neural information processing systems_, _34_, 21325-21337.



[📄 자료 링크 ↗](https://arxiv.org/pdf/2110.13040.pdf)




[📄 자료 링크 ↗](https://slideslive.com/38967396/neural-flows-efficient-alternative-to-neural-odes)



# Paper Review


## Research motivation


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/0.png)



[📄 자료 링크 ↗](https://arxiv.org/abs/2012.00168)



![Structure of vanilla RNNs](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/1.png)


![Motivation of Neural ODE](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/2.png)


![Overview of Neural Flows](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/3.png)


**Neural ODE**



$$
\begin{align*}
\bm{x}(t_1) &= \bm{x}(t_0) + \int_{t_0}^{t_1}  f(t, \bm{x}(t)) \textrm{d}t \\ 
&= \text{ODE-solve}(\bm{x}(t_0), f, t_0, t_1).
\end{align*}
$$



**Neural Flow**



$$
\begin{align*}
\bm{x}(t) &= F(t, \bm{x}_0), \\
\text{where }\dot{\bm{x}} &= f(t,\bm{x}(t)), \quad \bm{x}_0 = \bm{x}(0)
\end{align*}
$$



![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/4.png)


Let model $F : [0, T] \times \mathbb{R}^{d_z} \rightarrow \mathbb{R}^{d_z}$ be a smooth function satisfying: 


    (1) initial condition: $F(0, \bm{x}_0) = \bm{x}_0$


    (2) uniqueness of the solution given the initial value $\bm{x}_0$, $F(t, \cdot)$ is invertible $\forall t$


## Proposed flow models


### ODE as ResNet / Invertible neural network


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/5.png)


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/6.png)


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/7.png)



[📄 자료 링크 ↗](https://arxiv.org/pdf/1806.07366.pdf)




[📄 자료 링크 ↗](https://arxiv.org/pdf/1811.00995.pdf)




[📄 자료 링크 ↗](https://arxiv.org/pdf/2205.14612.pdf)



### ResNet flow


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/8.png)


### GRU flow


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/9.png)


### Coupling flow


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/10.png)


## * Normalizing flow in generative model


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/11.png)



[📄 자료 링크 ↗](https://lilianweng.github.io/posts/2021-07-11-diffusion-models/)




[📄 자료 링크 ↗](https://lilianweng.github.io/posts/2018-10-13-flow-models/)




[📄 자료 링크 ↗](https://www.vanillabug.com/posts/sde/#tldr)



## Continuous-time latent variable models


### Architecture


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/12.png)


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/13.png)



[📄 자료 링크 ↗](https://papers.nips.cc/paper_files/paper/2019/file/42a6845a557bef704ad8ac9cb4461d43-Paper.pdf)



### Smoothing


The given sequence of observations $(\bm{X}, \bm{t})$ is modeled with latent variables or states $(\bm{z}_1, \dots, \bm{z}_n) \sim \R^h$, such that $\bm{x}_i \sim p(\bm{x}_i | \bm{z}_i)$, conditionally independent of other $\bm{x}_j$. There is a predesignated prior state $\bm{z}_0$ at $t=0$ from which the latent state is assumed to evolve continuously. More precisely, if $z_{0}$ is a sample from the initial latent state $\bm{z}_0$, then a latent state sample at any future time step $t$ is given by $\smash{z_{t} = F(t, z_0)}$.


Since the exact inference on the initial state $\bm{z}_0$, $p(\bm{z}_0 | \bm{X}, \bm{t})$is intractable, we proceed by doing approximate inference following the variational auto-encoder approach. We use an LSTM-based neural flow encoder that processes$(\bm{X}, \bm{t})$ and outputs the approximate posterior parameters $\bm{\mu}$ and $\bm{\sigma}$ from the last state, $q(\bm{z}_0 | \bm{X}, \bm{t}) = \mathcal{N}(\bm{\mu}, \bm{\sigma})$. The decoder returns all $z_i$ deterministically at times $\bm{t}$ with $F(t, z_0)$, with initial condition $z_0 \sim q(\bm{z}_0 | \bm{X}, \bm{t})$. For the latent state at an arbitrary $t_i$, the target is generated according to the model $\bm{x}_i \sim p(\bm{x}_i | \bm{z}_i)$. Given $p(\bm{z}_0) = \mathcal{N}(\bm{0}, \bm{1})$, the overall model is trained by maximizing the evidence lower bound:



$$
\begin{align*}
\mathrm{ELBO} = \mathbb{E}_{z_0 \sim q_0(\bm{z}| \bm{X}, \bm{t}))}[\log p(\bm{X})] - \mathrm{KL}[q(\bm{z}_0 | \bm{X}, \bm{t}) || p(\bm{z}_0)].
\end{align*}
$$



Using continuous time models brings up multiple advantages, from handling irregular time points automatically to making predictions at any, and as many time points as required, allowing us to do reconstruction, missing value imputation and forecasting. This holds whether we use neural flows or ODEs, but our approach is more computationally efficient, which matters as we scale to bigger data.


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/14.png)



[📄 자료 링크 ↗](https://arxiv.org/pdf/2009.08295.pdf)



### Filtering


In contrast to the previous approach, we can alternatively do the inference in an online fashion at each of the observed time points, i.e., estimating the posterior $p(\bm{z}_i | \bm{x}_{1:i}, \bm{t}_{1:i})$ after seeing observations until the current time step $i$. This is known as filtering.


Here, the prediction for future time steps is done by evolving the posterior corresponding to the final observed time point $p(\bm{z}_n | \bm{X}, \bm{t})$ instead of the initial time point $p(\bm{z}_0 | \bm{X}, \bm{t})$, as was done in the smoothing approach.


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/15.png)



[📄 자료 링크 ↗](https://arxiv.org/pdf/2106.11028.pdf)



## Temporal point processes


<u>Sometimes temporal data is measured irregularly and the times at which we observe the events come from some underlying process modeled with temporal point processes (TPPs).</u> For example, we can use TPPs to model the times of messages between users. One example type of behavior we want to capture is excitation, e.g., observing one message increases the chance of seeing other soon after.


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/16.png)



[📄 자료 링크 ↗](https://arxiv.org/pdf/2104.03528.pdf)



A realization of a TPP on an interval $[0, T]$ is an increasing sequence of arrival times $\bm{t} = (t_1, \dots, t_n)$, $t_i \in [0, T]$, where $n$ is a random variable. The model is defined with an intensity function $\lambda(t)$ that tells us how many events we expect to see in some bounded area. The intensity has to be positive. We define the history $\mathcal{H}_{t_i}$ as the events that precede $t_i$, and further define the conditional intensity function $\lambda^*(t)$ which depends on history. For convenience, we can also work with inter-event times $\tau_i = t_i - t_{i-1}$, without losing generality. We train the model by maximizing the log-likelihood:



$$
\log p(\bm{t}) = \sum_i^n \log \lambda^{*}(t_i) - \int_0^T \lambda^{*}(s) \mathrm{d} s .
$$



Previous works used autoregressive models (e.g., RNNs) to represent the history with a fixed-size vector $\bm{h}_i$. The intensity function can correspond to a simple distribution or a mixture of distributions. Then the integral in Equation 8 can be computed exactly. Another possibility is modeling $\lambda(t)$ with an arbitrary neural network which requires Monte Carlo integration.


On the other hand, Jia and Benson propose a jump ODE model that evolves the hidden state $\bm{h}(t)$ with an ODE and updates the state with new observations, similar to LSTM-ODE. In this case, obtaining the hidden state and solving the integral in Equation 8 can be done in a single solver call.


### Marked point processes


Often, we are also interested in what type of an event happened at time point $t_i$. Thus, we can assign the observed type $\bm{x}_i$, also called mark, and model the arrival times and marks jointly: $p(\bm{t}, \bm{X}) = p(\bm{t}) p(\bm{X} | \bm{t})$. Written like this, we can keep the model for arrival times, and add a module that inputs the history $\bm{h}_i$ and the next time point $t_{i+1}$ and outputs the probabilities for each mark type. The special case of $\bm{x}_i \in \R^d$ is covered in the next section.


## Time-dependent density estimation


Normalizing flows (NFs) define densities with invertible transformations of random variables. That is, given a random variable $\bm{z} \sim q(\bm{z})$, $\bm{z} \in \R^d$ and an invertible function $F : \R^d \rightarrow \R^d$, we can compute the probability density function of $\bm{x} = F(\bm{z})$ with the change of variables formula: $\smash{p(\bm{x}) = q(\bm{z}) | \det J_F(\bm{z}) |^{-1}}$, where $J_F$ is the Jacobian of $F$. As we can see, it is important to define a function $F$ that is easily invertible and has a tractable determinant of the Jacobian. One example is the coupling NF, which we used to construct the coupling flow in Equation 6. Other tractable models include autoregressive and matrix factorization based NFs.


In contrast to this, , Chen et al. define the transformation with an ODE: $f(t, \bm{z}(t)) = \frac{\partial}{\partial t} \bm{z}(t)$. This allows them to define the instantaneous change in log-density as well as the continuous equivalent to the change of variables formula, giving rise to the continuous normalizing flow (CNF):



$$
\frac{\partial}{\partial t}\log p(\bm{z}(t)) = -\mathrm{tr}\left( \frac{\partial f}{\partial \bm{z}(t)} \right),\quad    \log p(\bm{x}) = \log q(\bm{z}(t_0)) - \int_{t_0}^{t_1} \mathrm{tr} \left( \frac{\partial f}{\partial \bm{z}(t)} \right) \rm{d} t,
$$



where $t_0 = 0$ and $t_1 = 1$ are usually fixed. The neural network $f$ can be arbitrary as long as it gives unique ODE solutions. This offers an advantage when we need special structure of $f$ that cannot be easily implemented with the discrete NFs, e.g., in physics we often require equivariant transformations. 


However, we are not interested in comparison between different normalizing flows for stationary densities, since flow endpoints $t_0$ and $t_1$ are always fixed; thus, our models would be reduced to the discrete NFs. Recently, Chen et al. demonstrated how CNFs can evolve the densities in continuous time, with varying $t_0$ and $t_1$, which proves useful for spatio-temporal data. We will show how to do the same with our coupling flow, something that has not been explored before.


### Spatio-temporal processes


Values $\bm{x}_i$ often correspond to locations of events, e.g., earthquakes or disease outbreaks. We use the temporal point processes from Section 3.2 to model $p(\bm{t})$, and are only left with the conditional density $p(\bm{X} | \bm{t})$. Chen et al propose several models for this, the first one being the time-varying CNF where $p(\bm{x}_i | t_i)$ is estimated by integrating Equation 9 from $t_0 = 0$ to observed $t_i$. Using our affine coupling flow as defined in Equation 6 we can write:



$$
p(\bm{x}_i | t_i) = q(F^{-1}(t_i, \bm{x}_i)) | \det J_{F^{-1}}(\bm{x}_i) |,
$$



where $q$ is the base density (defined with any NF) and the determinant is the product of the diagonal values of the Jacobian w.r.t.\ $\bm{x}_i$, which are simply $\exp$ terms from Equation 6. The density $p$ evolves with time, the same way as in the CNF model, but without using the solver or trace estimation. To generate new realizations at $t_i$, we first sample from $q$ to get $\bm{x}_0 \sim q(\bm{x}_0)$, then evaluate $F(t_i, \bm{x}_0)$.


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/17.png)



[📄 자료 링크 ↗](https://arxiv.org/pdf/2011.04583.pdf)



## Experiments


**Smoothing approach:** Activity, Physionet, and MuJoCo


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/18.png)


**Filtering approach (forecasting):** MIMIC-III, and MIMIC-IV


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/19.png)


**Temporal point processes:** MOOC, Reddit, and Wiki


Most of the TPP models consist of two parts: the encoder that processes the history, and the network that outputs the intensity. 1) whether having continuous state $\bm{h}(t)$ outperforms RNNs, and 2) if intertwining the hidden state evolution with the intensity outperforms other approaches. For this purpose we propose the following models based on continuous intensity and mixture distributions.


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/20.png)


**Spatial data:** Bikes, Covid, and EQ


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/21.png)


**Computation analysis**


![](/assets/seminars/neural-flows-efficient-alternative-to-neural-odes-neurips-2021/22.png)


## Discussion


In this paper we presented neural flows as an efficient alternative to neural ODEs. We retain all the
desirable properties of neural ODEs, without using numerical solvers. Our method outperforms the
ODE based models in time series modeling and density estimation, at a much smaller computation
cost. This brings the possibility to scale to larger datasets and models in the future.


**Limitations.** Defining a flow automatically defines an ODE, but since many ODEs do not have closed-form solutions, we cannot always find the exact flow corresponding to a particular ODE. This is usually not an issue since in most applications, such as those presented in Section 3, it is sufficient for both neural ODEs and neural flows to approximate an unknown dynamic. However, if we restrict ourselves to autonomous ODEs (fixed vector field in time), we cannot define a general neural flow that satisfies this condition. We further discuss this in Appendix A.6 and present a potential solution that involves a simple regularization.


**Future work.** In this work we designed neural flow models as invertible functions that satisfy initial
condition using simple dependence on time. Although these models already outperform neural ODEs, it would be interesting to see if there are other ways to define a neural flow, and whether these architectures can outperform the ones we proposed here. We applied our method to the main applications of neural ODEs: time series modeling and density estimation. In the future we hope to see neural flows adapted for other use cases as well. Investigating flows that define the higher order dynamics might also be of interest.
