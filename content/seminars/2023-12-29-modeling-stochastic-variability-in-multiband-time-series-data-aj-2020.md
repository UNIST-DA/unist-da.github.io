---
date: 2023-12-29
title: Modeling Stochastic Variability in Multiband Time-series Data (AJ, 2020)
category: Paper Review
presenter: SeungSu Kam
url: https://www.notion.so/6420828128be4a4caf5eaf1e1d69b424
keywords: Irregular time series, Time Modeling
---

# Selected Paper


_The Astronomical Journal,_ (2020)


## Title: Modeling Stochastic Variability in Multiband Time-series Data


## Abstract: 


In preparation for the era of time-domain astronomy with upcoming large-scale surveys, we propose a state-space representation of a multivariate damped random walk process as a tool to analyze irregularly-spaced multiﬁlter light curves with heteroscedastic measurement errors. We adopt a computationally efﬁcient and scalable Kalman ﬁltering approach to evaluate the likelihood function, leading to maximum _O_ (_k_3_n_) complexity, where _k_ is the number of available bands and _n_ is the number of unique observation times across the _k_ bands. This is a signiﬁcant computational advantage over a commonly used univariate Gaussian process that can stack up all multiband light curves in one vector with maximum _O_ (_k_3_n_3) complexity. Using such efﬁcient likelihood computation, we provide both maximum likelihood estimates and Bayesian posterior samples of the model parameters. Three numerical illustrations are presented: (i) analyzing simulated ﬁve-band light curves for a comparison with independent single- band ﬁts; (ii) analyzing ﬁve-band light curves of a quasar obtained from the Sloan Digital Sky Survey Stripe 82 to estimate short-term variability and timescale; (iii) analyzing gravitationally lensed _g_- and _r_-band light curves of Q0957+561 to infer the time delay. Two R packages, Rdrw and timedelay, are publicly available to ﬁt the proposed models.

- Propose a **state-space representation of a multivariate damped random walk process** as a tool to analyze **irregularly-spaced multiﬁlter light curves with heteroscedastic measurement errors**
- adopt a **Kalman ﬁltering** approach to evaluate the likelihood function, leading to maximum **O (k3n) complexity**
- provide both **maximum likelihood estimates** and **Bayesian posterior samples** of the model parameters.

## Link



[📄 자료 링크 ↗](https://iopscience.iop.org/article/10.3847/1538-3881/abc1e2/meta)



# Paper Review


## Preliminary

- General Regression

![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/0.png)


![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/1.png)

- **Gaussian Process**

![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/2.png)


GP:  목표 함수가 특정 형태를 갖는다고 가정하는 대신에 가우시안 프로세스 $f(\bold{x})$ 로 간주


구현 가능한 모든 함수에 대해 확률을 부여하는 접근 방법


![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/3.png)

- **State-space representation**

Markov chain을 기반으로 하는 시계열 모형, 실제 관측 가능한 observation 데이터와 hidden state data가 결합된 형태


$\bold{x}_t ∈R^p$ 는 각 시점의 hidden state vector로 관측 불가능


$\bold{y}_t ∈R^p $ 와 $\bold{u}_t ∈R^r$ 는 각각 observation vector, exogenous vector(외생변수)로 이들은 관측 가능한 데이터


**상태공간모형**


![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/4.png)

- **Kalman Filter**

상태-공간 모델(State-Space Model)에 기반 방법으로, 시스템의 현재 상태를 예측하고, 관측 데이터와 비교하여 최적의 상태 추정치를 계산


칼만 필터는 재귀적으로 동작, 칼만 필터는 바로 이전 시간에 추정한 값을 토대로 해서 현재의 값을 추정하며, 바로 이전 시간 외의 측정값이나 추정값은 사용하지 않음.


Two Stage:

1. prediction: 이전 시간에 추정된 상태에 대해, 그 상태에서 사용자 입력을 가했을 때 예상되는 측정값을 계산
2. update: 앞서 예측된 측정값과 실제 측정값을 토대로 현재의 상태를 추정
- **Random Walk Process**

![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/5.png)


$X_t$ 는 이전 time step 에서의 값 $X_{t-1}$ 에 noise $Z$가 더해진 값


Random sampling 과 다른점은 현재값이 이전값에 더해진다는것


# Introduction


In astronomy, **Gaussian process(GP)** is especially useful for analyzing **astronomical time-series data,** which have irregular observation cadences and heteroscedastic measurement errors.


However, multi-output GP is **not well known** in astronomy to modeling multiband time-series data.


Multi-output GP: Using covariance function to model dependence among multisource data.


⇒ It can take advantage of their **dependent structure** in making an **inference or a prediction**.


**This paper proposed state-space representation of a multivariate damped random walk process as a speciﬁc class of a multi- output GP.**


the proposal is a **multivariate generalization** of the work of **Kelly et al. (2009)** which is univariate version


![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/6.png)


![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/7.png)


![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/8.png)


# Related Works


**Univariate GP Modeling in astronomy**

- univariate GP with the Matérn(1/2) covariance function, Kelly et al. (2009)
- MacLeod et al. (2010),
- Kozłowski et al. (2010),
- Kim et al. (2012)
- Andrae et al. (2013)

⇒ investigate associations between model parameters and physical properties of quasars.


**Multivariate GP Modeling**

- multivariate Ornstein– Uhlenbeck process (Gardiner 2009; Singh et al. 2018)

Multivariate GP Modeling enables **more accurate inference** on such physically meaningful model parameters and also is essential for studying **stochastic variability**


⇒ when only one band is considered, it is challenging to extract information about short- term variability and timescale from **sparsely** observed single- band light


### Contributions

1. **continuous-time process in a state-space representation**, suitable for modeling **irregularly-spaced multiband time-series** data with **heteroscedastic measurement errors**
2. **not require the data** at each observation time to be a vector of the **same length**
3. **the lengths of multiﬁlter** light curves **do not need to be the same**
4. **Adopt a Kalman ﬁltering approach** for evaluating the resulting likelihood function with **maximum O (k3n)**

# Model Specification


### Univariate damped random walk process (Kelly et al. 2009)



$$
d X(t)=-\frac{1}{\tau}(X(t)-\mu) d t+\sigma d B(t),
$$




$X(t)$: the magnitude of an astronomical object at time $t \in \mathbb{R},$ 


$\tau$ : timescale of the process in days,


$\mu$ : long-term average magnitude of the process, 


$\sigma$ : short-term variability of the process on the magnitude scale


$B(t)$: the standard Brownian motion.


### Multivariate version of the damped random walk process (Gardiner 2009) 




$$
\begin{equation}
d \boldsymbol{X}(t)=-D_\tau^{-1}(\boldsymbol{X}(t)-\boldsymbol{\mu}) d t+D_\sigma d \boldsymbol{B}(t),
\end{equation}
$$



$\boldsymbol{X}(t)=\left\{X_1(t), \ldots, X_k(t)\right\}$:  vector of length $k$ that denotes magnitudes of the $k$ bands at time $t \in \mathbb{R}$, 


$D_\tau=\operatorname{diag}\left(\tau_1, \ldots, \tau_k\right)$ : $k \times k$ diagonal matrix whose diagonal elements are $k$ timescales with each $\tau_j$ representing the timescale of the $j$th band in days, 


$\boldsymbol{\mu} = \{\mu_1 \dots, \mu_k\}$ :  vector for long-term average magnitudes of $k$ bands


$D_\sigma=\operatorname{diag}\left(\sigma_1, \ldots, \sigma_k\right)$ $k \times k$ diagonal matrix whose diagonal elements are short-term variabilities (in magnitudes) of $k $ bands.


$\boldsymbol{B}(t) = \{B_1(t), \dots, B_k(t)\}$: a vector for $k$ standard Brownian motions whose pairwise correlations are modeled by correlation parameters $\rho_{jl} (1 \le j \le l \le k) $


**correlation parameters ⇒ 0 ⇒  singleband model**


![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/9.png)


The solution of the stochastic differential equation in (1) is Gaussian, Markovian, and stationary


i.e., given $\boldsymbol{X}(s)$ and for $t \geqslant s$,



$$
\begin{equation}
\boldsymbol{X}(t) \mid \boldsymbol{X}(s), \boldsymbol{\mu}, \boldsymbol{\sigma}, \boldsymbol{\tau}, \boldsymbol{\rho} \\
 \sim \operatorname{MVN}k\left(\boldsymbol{\mu}+e^{-(t-s) D\tau^{-1}}(\boldsymbol{X}(s)-\boldsymbol{\mu}), Q(t-s)\right),
\end{equation}
$$



$\operatorname{MVN}k(a, b)$: represents a $k$-dimensional multivariate Gaussian distribution with mean vector $a$ and covariance matrix $b$. 


$(j, l)$ _entry of the covariance matrix_ $Q(t-s)$ _is defined as_



$$
\begin{equation}q_{j l}=\frac{\sigma_j \sigma_l \rho_{j l} \tau_j \tau_l}{\tau_j+\tau_l}\left(1-e^{-(t-s) \frac{\tau_j+\tau_l}{\tau_j \tau l}}\right) .
\end{equation}
$$







**joint probability density function** of $\boldsymbol{X}(\boldsymbol{t})=\left\{\boldsymbol{X}\left(t_1\right), \ldots, \boldsymbol{X}\left(t_n\right)\right\}$




$$
\begin{equation}
\begin{aligned}
& f_1(\boldsymbol{X}(\boldsymbol{t}) \mid \boldsymbol{\mu}, \boldsymbol{\sigma}, \boldsymbol{\tau}, \boldsymbol{\rho}) \\
& =\prod_{i=1}^n f_2\left(\boldsymbol{X}\left(t_i\right) \mid \boldsymbol{X}\left(t_{i-1}\right), \boldsymbol{\mu}, \boldsymbol{\sigma}, \boldsymbol{\tau}, \boldsymbol{\rho}\right),
\end{aligned} 
\end{equation}
$$



$f_2$: the density function of the multivariate Gaussian distribution defined in (2),


$t_0=-\infty$, $i$ will be used to distinguish observation times $(i=1,2, \ldots, n)$.


The observed data $\boldsymbol{x} = \{x_1, \dots, x_n \} $ are multifilter light curves measured at irregularly-spaced observation times t with known measurement error standard deviations, $\boldsymbol{\delta} = \{\delta_1, \dots, \delta_n \}$.


$\boldsymbol{X}(\bold{t}) = \{\boldsymbol{X}({t_1}), \dots, \boldsymbol{X}({t_n}) \}$: latent multifilter light curves


$\boldsymbol{x} = \{x_1, \dots, x_n \}$: observed data are realizations of the latent multifilter light curves $\boldsymbol{X}(\bold{t})$



$$
\begin{equation}
\begin{aligned}
\boldsymbol{x}_i \mid \boldsymbol{X}\left(t_i\right) \sim \operatorname{MVN}{k_i}\left(\boldsymbol{X}^*\left(t_i\right), D_{\delta_i}^2\right)
\end{aligned} 
\end{equation}
$$



$\boldsymbol{X}^*(t_i)$ _: a subvector of_ $\boldsymbol{X}\left(t_i\right)$ _corresponding to the bands that are used to observe_ $\boldsymbol{x}_i$_._



_**J**_**oint probability density function of the observed data given the latent data**



$$
\begin{equation}
\begin{aligned}
h_1(\boldsymbol{x} \mid \boldsymbol{X}(\boldsymbol{t}))=\prod_{i=1}^n h_2\left(\boldsymbol{x}_i \mid \boldsymbol{X}\left(t_i\right)\right),
\end{aligned} 
\end{equation}
$$



$h_2$: the multivariate Gaussian density function defined in (5).


 


![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/10.png)

- The **conditional distributions of the latent magnitudes** in **the state level** are defined in **(2)**
- those of the **observed data** given the **latent magnitudes in the space level** are given in **(5)**

**Likelihood function of the model parameters with the latent process integrated out**



$$
\begin{equation}
\begin{aligned}
\begin{aligned}
& L(\boldsymbol{\mu}, \boldsymbol{\sigma}, \boldsymbol{\tau}, \boldsymbol{\rho}) \\
& =\int h_1(\boldsymbol{x} \mid \boldsymbol{X}(\boldsymbol{t})) f_1(\boldsymbol{X}(\boldsymbol{t}) \mid \boldsymbol{\mu}, \boldsymbol{\sigma}, \boldsymbol{\tau}, \boldsymbol{\rho}) d \boldsymbol{X}(\boldsymbol{t}) .
\end{aligned}
\end{aligned} 
\end{equation}
$$



# Computation of the Likelihood Function vai Kalman Filtering


Kalman filtering (Kalman 1960) 

- well-known technique to evaluate the **likelihood function** of a state-space model when **both state and space models are Gaussian.**

In (7), product of $n$ $k_i$-dimensional multivariate Gaussian densities $(i=1, \ldots, n)$ 
⇒$O\left(\sum_{i=1}^n k_i^3\right)$


Let $\mathcal{F}\left(t_i\right)$ denote the natural filtration at time $t_i, $
i.e., all of the information about the observed data available until time $t_i$.


### Prediction


Define the following predictive mean vector and covariance matrix at $t_{i-1}$



$$
\begin{equation}
\begin{aligned}
\boldsymbol{\mu}_{i \mid i-1} & =E\left(\boldsymbol{X}\left(t_i\right) \mid \mathcal{F}\left(t_{i-1}\right), \boldsymbol{\mu}, \boldsymbol{\sigma}, \boldsymbol{\tau}, \boldsymbol{\rho}\right) \\
& =\boldsymbol{\mu}+e^{-\Delta t_i D_\tau^{-1}}\left(\boldsymbol{\mu}_{i-1 \mid i-1}-\boldsymbol{\mu}\right), \\
\Sigma_{i \mid i-1} & =\operatorname{Cov}\left(\boldsymbol{X}\left(\mathrm{t}_i\right) \mid \mathcal{F}\left(\mathrm{t}_{i-1}\right), \boldsymbol{\mu}, \boldsymbol{\sigma}, \boldsymbol{\tau}, \boldsymbol{\rho}\right) \\
& =e^{-\Delta t_i D_\tau^{-1}\left(\Sigma_{i-1 \mid i-1}\right) e^{-\Delta t_i D_\tau^{-1}}+Q\left(\Delta t_i\right) .}
\end{aligned}
\end{equation}
$$



assume



$$
\boldsymbol{\mu}_{1 \mid 0}=\boldsymbol{\mu} \text { and } \Sigma_{1 \mid 0}=\left\{q_{j l}\right\}=\left\{\frac{\sigma_j \sigma_l \rho_{j l} \tau_j \tau_l}{\tau_j+\tau_l}\right\} .
$$



### Update


the updated mean vector and covariance matrix (after observing data at $t_i$)



$$
\begin{aligned}
\boldsymbol{\mu}_{i \mid i} & =E\left(\boldsymbol{X}\left(t_i\right) \mid \mathcal{F}\left(t_i\right), \boldsymbol{\mu}, \boldsymbol{\sigma}, \boldsymbol{\tau}, \boldsymbol{\rho}\right) \\
& =\boldsymbol{\mu}_{i \mid i-1}+\Sigma_{i \mid i-1}^*\left(\Sigma_{i \mid i-1}^{* *}+D_{\boldsymbol{\delta}_i}^2\right)^{-1}\left(\boldsymbol{x}_i-\boldsymbol{\mu}_{i \mid i-1}\right), \\
\Sigma_{i \mid i} & =\operatorname{Cov}\left(\boldsymbol{X}\left(\mathrm{t}_i\right) \mid \mathcal{F}\left(\mathrm{t}_i\right), \boldsymbol{\mu}, \boldsymbol{\sigma}, \boldsymbol{\tau}, \boldsymbol{\rho}\right) \\
& =\Sigma_{i \mid i-1}-\Sigma_{i \mid i-1}^*\left(\Sigma_{i \mid i-1}^{* *}+D_{\boldsymbol{\delta}_i}^2\right)^{-1} \Sigma_{i \mid i-1}^{* . .} .
\end{aligned}
$$



The notation $\Sigma_{i \mid i-1}^{* *}$ _:a submatrix of_ $\Sigma_{i \mid i-1}$ _restricted to the bands used for observing_ $\boldsymbol{x}_i$


Consequently, the likelihood function in (7) can be computed as follows:




$$
\begin{equation}
\begin{aligned}
L(\boldsymbol{\mu}, \boldsymbol{\sigma}, \boldsymbol{\tau}, \boldsymbol{\rho})=\prod_{i=1}^n p\left(\boldsymbol{x}_i \mid \mathcal{F}\left(t{i-1}\right), \boldsymbol{\mu}, \boldsymbol{\sigma}, \boldsymbol{\tau}, \boldsymbol{\rho}\right),
\end{aligned}
\end{equation}
$$




where $p$ is another multivariate Gaussian density of




$$
\begin{equation}
\begin{aligned}
& \boldsymbol{x}_i \mid \mathcal{F}\left(t{i-1}\right), \boldsymbol{\mu}, \boldsymbol{\sigma}, \boldsymbol{\tau}, \boldsymbol{\rho} \\
& \sim \operatorname{MVN}{k_i}\left(\boldsymbol{\mu}_{i \mid i-1}^{*}, \Sigma_{i \mid i-1}^{*, *}+D_{\delta_i}^2\right) .
\end{aligned}
\end{equation}
$$



# Baysian Inference



$$
\begin{equation}
\begin{aligned}
\begin{aligned}
\mu_j & \sim \operatorname{Unif}(-30,30), \tau_j \sim \operatorname{inv-Gamma}(1,1), \\
\rho_{j l} & \sim \operatorname{Unif}(-1,1), \quad \sigma_j^2 \sim \operatorname{inv-Gamma}(1, \mathrm{c}),
\end{aligned}
\end{aligned}
\end{equation}
$$



inv-Gamma $(a, b)$ : the inverse-Gamma distribution with shape parameter $a$ and scale parameter $b$. 


each long-term average magnitude $\mu_j$ is in a reasonably wide range between -30 and 30 . 


correlation parameters are between -1 and 1 by definition. 


Setting up an inverse $\operatorname{Gamma}(a, b)$ prior on an unknown parameter is considered as **setting up a soft lower bound**, $a /(b+1)$, of the unknown parameter (Section 4.2, Tak et al. 2018a).


$q$: **joint prior density function** of  $\mu, \sigma, \tau, \rho$


**Full posterior density function** $π$



$$
\begin{equation}
\begin{aligned}
\pi(\mu, \sigma, \tau, \rho \mid x) \propto L(\mu, \sigma, \tau, \rho) \times q(\mu, \sigma, \tau, \rho) .
\end{aligned}
\end{equation}
$$



We adopt a **Metropolis-Hastings within Gibbs sampler** (Tierney 1994) to draw (dependent) posterior samples from the full posterior distribution $\pi(\mu, \sigma, \tau, \rho \mid \boldsymbol{x})$. 


**Initial values of the model parameters are set to their maximum likelihood estimates.** Then, it sequentially updates each parameter given the observed data and all the other parameters at each iteration.



$$
\begin{aligned}
& Given \left(\theta_1^{(s-1)}, \theta_2^{(s-1)}, \theta_3^{(s-1)}\right), 
\newline &  
\text{sample }  \pi_1\left(\theta_1 \mid \theta_2^{(s-1)}, \theta_3^{(s-1)}, \boldsymbol{x}\right), \text{setting it to }\theta_1^{(s)},
\newline & \text{sample } \pi_2\left(\theta_2 \mid \theta_1^{(s)}, \theta_3^{(s-1)}, \boldsymbol{x}\right), \quad \text{setting it to } \theta_2^{(s)},
\newline & \text{sample }\pi_3\left(\theta_3 \mid \theta_1^{(s)}, \theta_2^{(s)}, \boldsymbol{x}\right), \quad \text{setting it to }  \theta_3^{(s)}.
\end{aligned}
$$



# Experiments & Results


## Experiments 1


### Dataset

- A Simulation Study on Five-band Light Curves

![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/11.png)


![Reproduced](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/12.png)


![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/13.png)


![Reproduced](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/14.png)


![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/15.png)


### Results

- A Simulation Study on Five-band Light Curves

![The outcomes of fitting multiband and single-band models on the simulated data](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/16.png)


![The marginal posterior distributions of the 10 cross-correlation parameters obtained by fitting the multiband model to the simulated data set](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/17.png)


![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/18.png)


![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/19.png)


⇒ 20x3 time series → 12min computation time


![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/20.png)


### Dataset

- Five-band Light Curves of an SDSS S82 Quasar

![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/21.png)


![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/22.png)


### Results

- Five-band Light Curves of an SDSS S82 Quasar

![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/23.png)


![](/assets/seminars/modeling-stochastic-variability-in-multiband-time-series-data-aj-2020/24.png)


# Discussion & limitations


**Contributions**

- can be applied to other subﬁelds of astronomy as well(ex, Photometric reverberation mapping)
- can be a parametric alternative to a widely used non-parametric cross-correlation method in multiband data analyses
- account for the _damped_ part
- better interpretability

**Limitations**

- Computational cost O(nk3)
- damped random walk process fails to describe the optical variability of a quasar on a very short timescale ⇒ **unclear** whether these limitations are equally applicable to a **multivariate case**
- Dependency on data quality in each band
