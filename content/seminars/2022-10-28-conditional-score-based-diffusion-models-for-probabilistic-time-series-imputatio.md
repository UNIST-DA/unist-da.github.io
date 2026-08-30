---
date: 2022-10-28
title: Conditional score-based diffusion models for probabilistic time series imputation (NeurIPS 2021)
category: Lab Seminar
presenter: YongKyung Oh
url: https://www.notion.so/6cd9b6c0b23b4640bfe57ea80c782c1f
keywords: Generative Model, Diffusion Model
---

# Selected Paper


## Title: CSDI: Conditional score-based diffusion models for probabilistic time series imputation.


## Abstract: 


The imputation of missing values in time series has many applications in healthcare and finance. While autoregressive models are natural candidates for time series imputation, score-based diffusion models have recently outperformed existing counterparts including autoregressive models in many tasks such as image generation and audio synthesis, and would be promising for time series imputation. In this paper, we propose Conditional Score-based Diffusion models for Imputation (CSDI), a novel time series imputation method that utilizes score-based diffusion models conditioned on observed data. <u>Unlike existing score-based approaches, the conditional diffusion model is explicitly trained for imputation and can exploit correlations between observed values.</u> On healthcare and environmental data, CSDI improves by 40-65% over existing probabilistic imputation methods on popular performance metrics. In addition, deterministic imputation by CSDI reduces the error by 5-20% compared to the state-of-the-art deterministic imputation methods. <u>Furthermore, CSDI can also be applied to time series interpolation and probabilistic forecasting, and is competitive with existing baselines.</u>


## Link


Tashiro, Y., Song, J., Song, Y., & Ermon, S. (2021). CSDI: Conditional score-based diffusion models for probabilistic time series imputation. Advances in Neural Information Processing Systems, 34, 24804-24816.



[📄 자료 링크 ↗](https://proceedings.neurips.cc/paper/2021/file/cfe8504bda37b575c70ee1a8276f3486-Paper.pdf)



# Motivation


![](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/0.png)



[📄 링크 ↗](https://github.com/CompVis/stable-diffusion)



![](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/1.png)



[📄 자료 링크 ↗](https://huggingface.co/spaces/stabilityai/stable-diffusion)



![](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/2.png)



[📄 자료 링크 ↗](https://lilianweng.github.io/posts/2021-07-11-diffusion-models/)




[📄 자료 링크 ↗](https://www.vanillabug.com/posts/sde/#tldr)



**CVPR 2022 Tutorial:** Denoising Diffusion-based Generative Modeling: Foundations and Applications



[📄 자료 링크 ↗](https://cvpr2022-tutorial-diffusion-models.github.io/)



# Diffusion model


Yang, L., Zhang, Z., Song, Y., Hong, S., Xu, R., Zhao, Y., ... & Yang, M. H. (2022). Diffusion models: A comprehensive survey of methods and applications. _arXiv preprint arXiv:2209.00796_



[📄 자료 링크 ↗](https://arxiv.org/pdf/2209.00796.pdf)



![](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/3.png)


Diffusion models are a family of probabilistic generative models that progressively destruct data by injecting noise, then learn to reverse this process for sample generation. We present the intuition of diffusion models in Fig. 2. Current research on diffusion models is mostly based on three predominant formulations: 

- <u>denoising diffusion probabilistic models (DDPMs)</u>
- score-based generative models (SGMs)
- stochastic differential equations (Score SDEs)

## Denoising Diffusion Probabilistic Models (DDPMs)


A denoising diffusion probabilistic model (DDPM) makes use of two Markov chains: <u>a forward chain that perturbs data to noise</u>, and <u>a reverse chain that converts noise back to data</u>. The former is typically hand-designed with the goal to transform any data distribution into a simple prior distribution (e.g., standard Gaussian), while the latter Markov chain reverses the former by learning transition kernels parameterized by deep neural networks.


![The Markov chain of forward (reverse) diffusion process of generating a sample by slowly adding or removing noise. (Image source: Ho et al. 2020  with a few additional annotations by Lilian Weng)](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/4.png)


Formally, given a data distribution $\mathbf{x}_0 \sim q(\mathbf{x}_0)$, the forward Markov process generates a sequence of random variables $\mathbf{x}_1, \mathbf{x}_2 \dots \mathbf{x}_T$ with transition kernel $q(\mathbf{x}_t \mid\mathbf{x}_{t-1})$. Using the chain rule of probability and the Markov property, we can factorize the joint distribution of $\mathbf{x}_1, \mathbf{x}_2 \dots \mathbf{x}_T$ conditioned on $\mathbf{x}_0$, denoted as $q(\mathbf{x}_1, \ldots, \mathbf{x}_T\mid\mathbf{x}_0)$, into



$$
q(\mathbf{x}_1, \ldots, \mathbf{x}_T\mid\mathbf{x}_0) = \prod_{t=1}^{T} q(\mathbf{x}_t\mid\mathbf{x}_{t-1})
$$



In DDPMs, we handcraft the transition kernel $q(\mathbf{x}_t \mid \mathbf{x}_{t-1})$ to incrementally transform the data distribution $q(\mathbf{x}_0)$ into a tractable prior distribution.


One typical design for the transition kernel is Gaussian perturbation, and the most common choice for the transition kernel is



$$
q(\mathbf{x}_t\mid\mathbf{x}_{t-1}) = \mathcal{N}(\mathbf{x}_t; \sqrt{1-\beta_t} \mathbf{x}_{t-1}, \beta_t \mathbf{I})
$$



where $\beta_t \in (0,1)$ is a hyperparameter chosen ahead of model training.


Specifically, with $\alpha_t \coloneqq 1 - \beta_t$ and $\bar{\alpha}_t \coloneqq \prod_{s=0}^{t} \alpha_s$, we have



$$
q(\mathbf{x}_t\mid\mathbf{x}_0) = \mathcal{N}(\mathbf{x}_t; \sqrt{\bar{\alpha}_t} \mathbf{x}_0, (1-\bar{\alpha}_t) \mathbf{I})
$$



Given $\mathbf x_0$, we can easily obtain a sample of $\mathbf{x}_t$ by sampling a Gaussian vector $\epsilon \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$ and applying the transformation



$$
\mathbf{x}_t =\sqrt{\bar{\alpha}_t} \mathbf{x}_0 + \sqrt{1-\bar{\alpha}_t}
$$



When $\bar{\alpha}_T \approx 0$, $\mathbf{x}_{T}$ is almost Gaussian in distribution, so we have 



$$
q(\mathbf x_T) \coloneqq \int q(\mathbf x_T \mid \mathbf x_0) q(\mathbf x_0) \textrm{d} \mathbf x_0 \approx \mathcal{N}(\mathbf x_T; \mathbf{0}, \mathbf{I})
$$



Intuitively speaking, this forward process slowly injects noise to data until all structures are lost. For generating new data samples, DDPMs start by first generating an unstructured noise vector from the prior distribution (which is typically trivial to obtain), then gradually remove noise therein by running a learnable Markov chain in the reverse time direction.


Specifically, the reverse Markov chain is parameterized by a prior distribution $p(\mathbf x_T) = \mathcal{N}(\mathbf x_T; \mathbf{0}, \mathbf{I})$ and a learnable transition kernel $p_\theta(\mathbf{x}_{t-1}\mid\mathbf{x}_t)$_._ We choose the prior distribution $p(\mathbf x_T) = \mathcal{N}(\mathbf x_T; \mathbf 0, \mathbf I)$ because the forward process is constructed such that $q(\mathbf x_T) \approx \mathcal{N}(\mathbf x_T; \mathbf{0}, \mathbf{I})$. The learnable transition kernel $p_\theta(\mathbf{x}_{t-1}\mid\mathbf{x}_t)$ takes the form of



$$
p_\theta(\mathbf x_{t-1}\mid\mathbf x_t) = \mathcal{N}(\mathbf x_{t-1}; \mu_{\theta}(\mathbf x_t, t), \Sigma_{\theta}(\mathbf x_t, t))
$$



where $\theta$ denotes model parameters, and the mean $\mu_{\theta}(\mathbf x_t, t)$ and variance $\Sigma_{\theta}(\mathbf x_t, t)$ are parameterized by deep neural networks. With this reverse Markov chain in hand, we can generate a data sample $\mathbf x_0$ by first sampling a noise vector $\mathbf x_T \sim p(\mathbf x_T)$, then iteratively sampling from the learnable transition kernel $\mathbf x_{t-1} \sim p_\theta(\mathbf x_{t-1} \mid \mathbf x_t)$ until $t = 1$.


![An example of training a diffusion model for modeling a 2D swiss roll data. (Image source: Sohl-Dickstein et al., 2015)](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/5.png)


Key to the success of this sampling process is training the reverse Markov chain to match the actual time reversal of the forward Markov chain. That is, we have to adjust the parameter $\theta$ so that the joint distribution of the reverse Markov chain $p_\theta(\mathbf x_0, \mathbf x_1, \cdots, \mathbf x_T)\coloneqq p(\mathbf x_T)\prod_{t=1}^T p_\theta(\mathbf x_{t-1}\mid\mathbf x_t)$ closely approximates that of the forward process $q(\mathbf x_0, \mathbf x_1, \cdots, \mathbf x_T) \coloneqq q(\mathbf x_0) \prod_{t=1}^T q(\mathbf x_t \mid \mathbf x_{t-1})$. This is achieved by minimizing the Kullback-Leibler (KL) divergence between these two:



$$
\begin{aligned}
&\operatorname{KL}(q(\mathbf x_0, \mathbf x_1, \cdots, \mathbf x_T) \mid\mid p_\theta(\mathbf x_0, \mathbf x_1, \cdots, \mathbf x_T))\\
\stackrel{(i)}{=} &-\mathbb{E}_{q(\mathbf x_0, \mathbf x_1, \cdots, \mathbf x_T)}[\log p_\theta(\mathbf x_0, \mathbf x_1, \cdots, \mathbf x_T)] + \text{const}\\
\stackrel{(ii)}{=} & \underbrace{\mathbb{E}_{q(\mathbf x_0, \mathbf x_1, \cdots, \mathbf x_T)}\bigg[ -\log p(\mathbf x_T) - \sum_{t=1}^T \log \frac{p_\theta(\mathbf x_{t-1}\mid\mathbf x_t)}{q(\mathbf x_t\mid\mathbf x_{t-1})} \bigg]}_{\coloneqq -L_{\textrm{VLB}}(\mathbf x_0)} + \text{const} \\
\stackrel{(iii)}{\geq} & \mathbb{E}[{-\log p_\theta(\mathbf x_0)}] + \text{const},
\end{aligned}
$$



where (i) is from the definition of KL divergence, (ii) is from the fact that $q(\mathbf x_0, \mathbf x_1, \cdots, \mathbf x_T)$ and $p_\theta(\mathbf x_0, \mathbf x_1, \cdots, \mathbf x_T)$ are both products of distributions, and (iii) is from Jensen's inequality. The first term in (ii) is the variational lower bound (VLB) of the log-likelihood of the data $\mathbf x_0$, a common objective for training probabilistic generative models. We use $\text{const}$ to symbolize a constant that does not depend on the model parameter $\theta$ and hence does not affect optimization. 


The objective of DDPM training is to maximize the VLB (or equivalently, minimizing the negative VLB), which is particularly easy to optimize because it is a sum of independent terms, and can thus be estimated efficiently by Monte Carlo sampling and optimized effectively by stochastic optimization.


Ho et al. (2020) propose to reweight various terms in $L_\textrm{VLB}$ for better sample quality and noticed an important equivalence between the resulting loss function and the training objective for noise-conditional score networks (NCSNs), one type of **score-based generative models**, in Song and Ermon (2019). The loss in Ho et al. (2020) takes the form of



$$
\mathbb{E}_{t \sim \mathcal{U}\llbracket 1,T \rrbracket, \mathbf x_0 \sim q(\mathbf x_0), \epsilon \sim \mathcal{N}(\mathbf{0},\mathbf{I})}[{ \lambda(t)  \left\| \epsilon - \epsilon_\theta(\mathbf{x}_t, t) \right\|^2}]
$$



where $\lambda(t)$ is a positive weighting function, $\mathbf x_t$ is computed from $\mathbf x_0$ and Gaussian vector $\epsilon$, $\mathcal{U}\llbracket 1, T \rrbracket$ is a uniform distribution over the set $\{1, 2, \cdots, T\}$, and $\epsilon_{\theta}$ is a deep neural network with parameter $\theta$ that predicts the noise vector $\epsilon$ given $\mathbf{x}_{t}$ and $t$. This objective reduces to loss function for a particular choice of the weighting function $\lambda(t)$, and has the same form as the loss of denoising score matching over multiple noise scales for training score-based generative models. 


# CSDI: Conditional Score-based Diffusion Models for
Probabilistic Time Series Imputation


![](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/6.png)


## Background

<details>
<summary>3.1 Multivariate time series imputation</summary>

![](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/7.png)


</details>

<details>
<summary>3.2 Denoising diffusion probabilistic models</summary>

![](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/8.png)


</details>

<details>
<summary>3.3 Imputation with diffusion models</summary>

![](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/9.png)


</details>


We focus on the conditional diffusion model with the reverse process in Eq.(5) and aim to model the conditional distribution $p(\mathbf{x}^{ta}_{t-1} \mid \mathbf{x}^{ta}_t ,\mathbf{x}^{to}_0)$ without approximations. Specifically, we extend the parameterization of DDPM in Eq.(3) to the conditional case. 


We define a conditional denoising function $\epsilon_\theta: (\mathcal{X}^{ta} \times \mathbb{R} \mid \mathcal{X}^{co})\rightarrow \mathcal{X}^{ta}$, which takes conditional observations $x_0^{co}$ as inputs.



$$
\mu_\theta (\mathbf{x}^{ta}_t, t \mid \mathbf{x}^{co}_0) = \mu^{DDPM} (\mathbf{x}^{ta}_t, t, \epsilon_\theta(\mathbf{x}^{ta}_t, t \mid \mathbf{x}^{co}_0))
$$




$$
\sigma_\theta (\mathbf{x}^{ta}_t, t \mid \mathbf{x}^{co}_0) = \sigma^{DDPM} (\mathbf{x}^{ta}_t, t)
$$



where $\mu^{DDPM}$ and $\sigma^{DDPM}$ are the functions in DDPM. 


**Training CSDI**



$$
\min_{\theta} \mathcal{L} (\theta) := \mathbb{E}_{\mathbf x_0 \sim q(\mathbf x_0), \epsilon \sim \mathcal{N}(\mathbf{0},\mathbf{I}), t}[{  \left\| \epsilon - \epsilon_\theta(\mathbf{x}^{ta}_t, t \mid \mathbf{x}^{co}_0) \right\|^2_2}]
$$



![](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/10.png)

<details>
<summary>Self-supervised Training CSDI</summary>

![](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/11.png)


</details>


**Choice of imputation targets in self-supervised learning**

1. ${\it Random}$ strategy: this strategy is used when we do not know about missing patterns, and randomly chooses a certain percentage of observed values as imputation targets. The percentage is sampled from $[0\%, 100\%]$ to adapt to various missing ratios in the test dataset.
2. ${\it Historical} $ strategy: this strategy exploits missing patterns in the training dataset. Given a training sample $\mathbf{x}_0$, we randomly draw another sample $\tilde{\mathbf{x}}_0$ from the training dataset. Then, we set the intersection of the observed indices of $\mathbf{x}_0$ and the missing indices of $\tilde{\mathbf{x}}_0$ as imputation targets.
The motivation of this strategy comes from structured missing patterns in the real world. For example, missing values often appear consecutively in time series data. When missing patterns in the training and test dataset are highly correlated, this strategy helps the model learn a good conditional distribution.
3. ${\it Mix}$ strategy: this strategy is the mix of the above two strategies. The historical strategy may lead to overfitting to missing patterns in the training dataset. The Mix strategy can benefit from generalization by the random strategy and structured missing patterns by the historical strategy.
4. ${\it Test}$ pattern strategy: when we know the missing patterns in the test dataset, we just set the patterns as imputation targets. For example, this strategy is used for time series forecasting, since the missing patterns in the test dataset are fixed to given future time points.

## Implementation of CSDI for time series imputation (skip)


![](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/12.png)


## Experiments


### continuous ranked probability score (CRPS)


![](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/13.png)



[📄 자료 링크 ↗](https://www.sciencedirect.com/science/article/pii/S2666546821000124)




[📄 자료 링크 ↗](https://www.lokad.com/continuous-ranked-probability-score)



A generalisation of Ranked Probability Score (RPS) is the Continuous Rank Probability Score (CRPSS) where the thresholds are continuous rather than discrete (see Nurmi, 2003; Jollife and Stephenson, 2003; Wilks, 2006). The Continuous Ranked Probability Score (CRPS) is a measure of how good forecasts are in matching observed outcomes.   Where:

- CRPS = 0 the forecast is wholly accurate;
- CRPS = 1 the forecast is wholly inaccurate.

CRPS is calculated by comparing the Cumulative Distribution Functions (CDF) for the forecast against a reference dataset (observations, or analyses, or climatology) over a given perio



[📄 자료 링크 ↗](https://confluence.ecmwf.int/display/FUG/12.B+Statistical+Concepts+-+Probabilistic+Data#id-12.BStatisticalConceptsProbabilisticData-ContinuousRankedProbabilityScores(CRPS))



### Results: time series imputation


Since the dataset has no ground-truth, we randomly choose $10/50/90\%$ of <u>observed values</u> as ground-truth on the test data.


**Results of probabilistic imputation**


![](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/14.png)


![](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/15.png)


**Results of deterministic imputation**


![](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/16.png)


### **Interpolation of irregularly sampled time series**


Since the dataset has no ground-truth, we randomly choose $10/50/90\%$ of ${\it time}$ points and use observed values at these time points as ground-truth on the test data. As the target choice strategy for training, we adopt the random strategy, which is adjusted for interpolation so that some ${\it time}$ points are sampled.


![](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/17.png)


### Time series Forecasting


We predict all features at future time steps using past time series. We use the same prediction steps as previous studies. For the target choice strategy, we adopt the ${\it Test}$ pattern strategy.


![](/assets/seminars/conditional-score-based-diffusion-models-for-probabilistic-time-series-imputatio/18.png)
