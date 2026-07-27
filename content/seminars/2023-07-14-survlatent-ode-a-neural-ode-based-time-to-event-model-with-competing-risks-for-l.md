---
date: 2023-07-14
title: SurvLatent ODE: A Neural ODE based time-to-event model with competing risks for longitudinal data improves cancer-associated Venous Thromboembolism (VTE) prediction (PMLR, 2022)
category: Paper Review
presenter: SeungSu Kam
url: https://www.notion.so/75b6db7c9ffb4064a7788dd1c2766a06
keywords: Survival Analysis, Neural Differential Equation
---

# Selected Paper


## Title: **SurvLatent ODE: A Neural ODE based time-to-event model with competing risks for longitudinal data improves cancer-associated Venous Thromboembolism (VTE) prediction (2022)**


## Abstract: 


Effective learning from electronic health records (EHR) data for prediction of clinical outcomes is often challenging because of features recorded at irregular timesteps and loss to follow-up as well as competing events such as death or disease progression. To that end, we propose a generative time-to-event model, SurvLatent ODE, which adopts an Ordinary Differential Equation-based Recurrent Neural Networks (ODE-RNN) as an encoder to effectively parameterize dynamics of latent states under irregularly sampled input data. Our model then utilizes the resulting latent embedding to flexibly estimate survival times for multiple competing events without specifying shapes of event-specific hazard function. We demonstrate competitive performance of our model on MIMIC-III, a freely-available longitudinal dataset collected from critical care units, on predicting hospital mortality as well as the data from the Dana-Farber Cancer Institute (DFCI) on predicting onset of Venous Thromboembolism (VTE), a life-threatening complication for patients with cancer, with death as a competing event. SurvLatent ODE outperforms the current clinical standard Khorana Risk scores for stratifying VTE risk groups, while providing clinically meaningful and interpretable latent representations.

- 헬스케어 분야에서 불규칙하게 측정된 추적 관찰, 다양한 질병으로 인한 사망 데이터로 인해 임상 결과 예측 어려움을 겪는데, 본 논문은 이를 해결하는 **ODE-RNN과 Surivival Analysis**를 결합한 **SurvLatent ODE**를 제안
- 본 논문에서 제안한 모델은 잠재 임베딩을 활용하여 **사망별 위험 함수의 형태를 지정하지 않고**도 여러 경쟁 질병 사망에 대한 생존 시간을 유연하게 추정
- MIMIC-III, DFCI 데이터셋에서 모두 월등한 성능을 보이며, **해석 가능한 잠재적 표현을 제공**

## Link



[📄 자료 링크 ↗](https://proceedings.mlr.press/v182/moon22a.html)



# Paper Review


## Preliminary

- **Survival Analaysis(생존 분석):**

생존 시간 자료를 분석하는 통계적 방법으로 “time-to-event” 데이터에 초점을 맞춤

    - 생존시간**:**
        - 어떤 정의 된 시점부터 관심 사건이 관측될 때까지의 시간
        - ex) 암환자의 수술 후 사망까지의 시간, OTT 구독 고객의 서비스 이탈시간
    - Time-to-event:
        - 특정 사건이 발생하기까지 걸리는 시간을 의미
    - Hazard function
        - 특정 이벤트가 t 시점에 따라 일어날 확률

            ![](/assets/seminars/survlatent-ode-a-neural-ode-based-time-to-event-model-with-competing-risks-for-l/0.png)


            ![](/assets/seminars/survlatent-ode-a-neural-ode-based-time-to-event-model-with-competing-risks-for-l/1.png)

    - Competing Risks
        - 환자가 동시에 위험에 처할 수 있는 여러 경쟁

            
        $$
            \lambda_k(t \mid X)=P(T=t, K=k \mid T \geq t, X),\newline where \space  k \in \mathcal{K}
            $$
            

- **Neural Ordinary Differential Equation**
    - Neural Ordinary Differential Equation (Neural ODE)은 인공신경망을 통해 state을 유추하는 것이 아닌 state의 미분값을 유추하여 ODE-Solver를 통해 function(신경망)을 근사함

        ![](/assets/seminars/survlatent-ode-a-neural-ode-based-time-to-event-model-with-competing-risks-for-l/2.png)

    - 본 논문에서는 Neural ODE을 사용하여 health trajectory을 모델링
    - hidden state이 환자의 latent health trajectory와 시간에 따라 변화하는 특징의 function을 나타냄
    - Neural ODE에서 제안하는 모델의 경우  RNN encoder의 경우 hidden state간의 변화가 없음

        ![A generative latent function time-series model in ODE](/assets/seminars/survlatent-ode-a-neural-ode-based-time-to-event-model-with-competing-risks-for-l/3.png)

- **Latent ODE**
    - Neural ODE에서 사용했던 RNN Encoder 구조에서 ODE-RNN Encoder 구조로 변경한 모델
    - RNN 에서의 hidden state 사이의 변화를 ODE로 풀어내 continous time latent function의 encoding 유도

    ![](/assets/seminars/survlatent-ode-a-neural-ode-based-time-to-event-model-with-competing-risks-for-l/4.png)


# Introduction


![](/assets/seminars/survlatent-ode-a-neural-ode-based-time-to-event-model-with-competing-risks-for-l/5.png)


![](/assets/seminars/survlatent-ode-a-neural-ode-based-time-to-event-model-with-competing-risks-for-l/6.png)


**However, most existing patient stratification tools still rely on simple, outcome-specific scoring systems that utilize a small number of static features**


Patients are treated over the course of multiple interactions ⇒ should relate the heterogeneous temporal evolution of clinical measurements to the clinical outcome


EHR Data

    - collected incidentally
    - irregular spacing of visits
    - loss to follow-up

⇒ the model should appropriately handle data, consider potential competing events or risks


### S**urvival analysis:**

- One widely utilized risk prediction framework
- models the lifetime of a patient until a failure event
- can directly model outcomes that are lost to follow-up (also known as right-censoring)

**Limitations**

- do not capture the evolution of time-varying features
- presented with missing measurements, may lead to ill-defined latent representation

To handle this missing measurements in multivariate time-series data

- GRU-D (deploying a decay mechanism on both input data and RNN hidden states for describing dynamics under missing observations)
- GP based

⇒ rely on parametric assumptions on the latent dynamics, specified by either exponential decay functions or GP kernel functions with a stationary property and may not necessarily describe true latent dynamics.

- **ODE based**

learns the latent dynamics using highly flexible neural network parameterized functions


model longitudinal data with missing values without strong parametric assumptions on the latent dynamics.


### SurvLatent ODE

- utilizes the Neural ODE framework to effectively learn temporal dynamics of the input representation under irregularly sampled measurements
- adopting a multi-task learning framework, allows the underlying mechanism of multiple events to be shared in the latent representation while utilizing a cause-specific decoder module to flexibly learn signals specific to each event from the shared latent representation

### SurvLatent ODE Contribution

- The first demonstration of the ODE-based variational autoencoder time-to-event model for longitudinal data
- Using a multi-task learning framework, gains significant improvements over conventional and recently published deep learning based survival models.
- Applied to the in-house dataset of Venous Thromboembolism (VTE) events, significantly outperforms current clinical standards, Khorana scores (Khorana et al., 2008)
- Provides insights into influential features for elevated VTE risks via interpretable latent representations.

# Related Works


![](/assets/seminars/survlatent-ode-a-neural-ode-based-time-to-event-model-with-competing-risks-for-l/7.png)


## Deep Learning in Survival Analysis


### DeepSurv, DSM, MATCH-Net, DMGP, DRSA


Learns complex, non-linear relationships using Neural Networks, CNN, Gaussian Process, RNN


Cons

- only consider **patients’ time static features at baseline**

## Deep Time-varying Survival Analysis


### RDSM


estimates conditional survival distribution through a **fixed mixture of parametric distributions** like Weibull or Log-Normal.


Cons 

- a parametric assumption on the underlying time-to- event process may lead to a model miss-specification and limit the flexibility of relating neural network-learned representations to the conditional survival estimates.
- handle single risk

### Dynamic-Deephit


utilizes a multi-task learning framework to estimate joint distribution of the first hitting time and competing events.


Cons

- **A key assumption of the model is that a patient experiences an event over the predefined finite time horizon with a probability of 1, which often does not hold in real data.**

⇒ 현재 Tips과제에서 문제가 되는 부분이기도함


When handling missing values, both models rely on population-level statistics (e.g. means) and/or missing data indicators (Lipton et al., 2016), which does not consider dynamics of underlying patient-specific health trajectory.


### Deep Survival Analysis & Nonparametrics and missingness


models where missing observations were handled by a shared latent process which models observed measurements as well as event times in a Bayesian framework.


Cons

- relied on strong exponential parametric assumption on the underlying data generating process
- not evaluated in the longitudinal setting

## Conventional time-to-event frameworks for competing risks


### Cause- specific Cox regression


enables estimation of covariates’ effects on the cumulative incidence function for the event of interest


### Fine-Gray Cox regression


captures effect of covariates on the cause-specific hazard function for each event, which denotes the instantaneous rate of the corresponding event occurrence for patients who are currently event free


Cons

- assume linear relationship between patients’ covariates and log of the relative hazard as well as proportional hazard where effects of covariates on the relative hazards remain constant over time.

## ODE-Based Survival Analysis


### Multi-state survival models


to estimate the Kolmogorov forward equations which then provides transition probabilities in a multi-state framework


### SODEN


models the distribution of survival time for a single event by learning the dynamics of the cumulative hazard function via neural networks.


Cons

- only considered the baseline data and left out informative signals from time-varying features

# Methods


## Notation & setting


Survival dataset $D$ with sample size $N$: $\left\{\left(t_i, k_i, \delta_i, \mathcal{X}_i\right)\right\}_{i=1}^N$


$t_i $: observed survival time


$k_i $: event type for sample $i$


$\delta_i $: indicates whether the event occurred for sample $i$


$C_i$: right censoring time of sample $i $


$\mathcal{K} = \{1, \dots,b\}$: $b$ mutually exclusive competing events


$\lambda_k\left(t \mid \mathcal{X}_i, Z_i^t\right)=P\left(T^r=t, K=k \mid T^r \geq t, \mathcal{X}_i, Z_i^t\right)$: discrete cause-specific hazard function


## Proposed method (SurvLatent ODE)


![Overview of the SurvLatent ODE architecture](/assets/seminars/survlatent-ode-a-neural-ode-based-time-to-event-model-with-competing-risks-for-l/8.png)



$$
\begin{equation}
\begin{aligned}
& q\left(z_0 \mid \mathcal{X}\right)=\mathcal{N}\left(\mu_{z_0}, \sigma_{z_0}\right) \\
& \mu_{z_0}, \sigma_{z_0}=u_v\left(\mathrm{ODE}-\mathrm{RNN}_{\theta, f_\gamma(\cdot)}(\mathcal{X})\right) \\
&
\end{aligned}
\end{equation}
$$



![Detailed model architecture of SurvLatent ODE.](/assets/seminars/survlatent-ode-a-neural-ode-based-time-to-event-model-with-competing-risks-for-l/9.png)


## Survival function estimation



$$
\begin{equation}\hat{S}\left(t \mid \mathcal{X}_i, Z_i^t\right)=\hat{S}\left(t \mid Z_i^t\right)=\hat{P}\left(T^r>t \mid Z_i^t\right)=\prod_{\tau_{i, l}<\tau \leq t}\left(1-\sum_{k=1}^b \hat{\lambda}_{i, k}^*(\tau)\right)\end{equation}
$$



where $τ_{i,l }$ is the latest measurement time for the patient.



$$
\hat{F}_k\left(t \mid Z_i^t\right)=\hat{P}\left(T^r \leq t, K=k \mid Z_i^t\right)=\sum_{\tau_{i, l}<\tau \leq t} \hat{P}\left(T^r=\tau, K=k \mid Z_i^t\right)=\sum_{\tau_{i, l}<\tau \leq t} \hat{\lambda}_{i, k}^*(\tau) \hat{S}\left(\tau-1 \mid Z_i^t\right) .
$$



: the estimated cause-specific cumulative incidence function


## Loss Functions



$$
\begin{equation}\operatorname{ELBO}(\mathcal{X} ; \Phi, \zeta)=\mathbb{E}_{q\left(z_0 \mid \mathcal{X} ; \Phi\right)}\left[\log \left(p\left(\mathcal{X} \mid z_0 ; \phi, \zeta\right)\right]-\operatorname{KL}\left[q\left(z_0 \mid \mathcal{X} ; \Phi\right) \| p\left(z_0\right)\right]\right.\end{equation}
$$



total survival likelihood $L_{surv}$, which enables handling of right-censored patients, is estimated as follows



$$
\begin{equation}
\begin{aligned}
L_{\text {surv }}(\mathcal{D} ; \Phi, \beta) & =\prod_{i \in \mathcal{D}} \hat{P}\left(T^r=t_i^r, K=k_i ; \Phi, \beta\right)^{\delta_i} \times \hat{P}\left(T^r>t_i^r ; \Phi, \beta\right)^{1-\delta_i} \\
& =\prod_{i \in \mathcal{D}}\left[\hat{\lambda}_{i, k}^*\left(t_i^r ; \Phi, \beta\right) \hat{S}\left(t_i^r-1 \mid X_i ; \Phi, \beta\right)\right]^{\delta_i} \times \hat{S}\left(t_i^r \mid X_i ; \Phi, \beta\right)^{1-\delta_i}
\end{aligned}
\end{equation}
$$



The total loss we want to minimize is



$$
\begin{equation}L_{\text {total }}(\mathcal{D} ; \Phi, \zeta, \beta)=-\operatorname{ELBO}(\mathcal{X} ; \Phi, \zeta)-\log \left(L_{\text {surv }}(\mathcal{D} ; \Phi, \beta)\right)\end{equation}
$$



# Experiments & Results


## Dataset

- MIMIC-III
    - publicly available longitudinal dataset of patients who were admitted to critical care units at the Beth Israel Deaconess Medical Center in Boston, Massachusetts
- Dana-Farber Cancer Institute (DFCI) dataset
    - Venous Thromboembolism (VTE) is a frequent, yet fatal complication in patients with active cancer, especially while they are receiving chemotherapy.

The main goal of this experiment was to develop a risk stratification framework for cancer-related VTE by accurately estimating the time to VTE event in the presence of a competing risk for death as well as missing measurements and loss to follow-ups.


## Evaluation

- **Time-dependent cumulative/dynamic AUC**
    - the probability that, given a pair of patients where one experienced the event of interest before t and the other is event-free at t, the model correctly ranks their risks of the event
- **Time-dependent Brier Score**
    - generalization of the conventional Brier score
    - measures the mean squared error at a given time point $t$

## Competing Methods

- Time to hospital mortality prediction (MIMIC-III)
    - **Surv VAE-RNN**
    - **Recurrent Deep Survival Machine (RDSM**)
    - **Dynamic-Deephit**
    - **Cox Proportional Hazard model (Cox PH)**

    ![](/assets/seminars/survlatent-ode-a-neural-ode-based-time-to-event-model-with-competing-risks-for-l/10.png)

- Time to VTE prediction with death as a competing event (DFCI data)
    - **Dynamic-Deephit**
    - **Khorana score**
    - **Cause-specific Cox model (CS Cox)**
    - **Fine-Gray Cox model (FG Cox)**

## Results on MIMIC-III


![](/assets/seminars/survlatent-ode-a-neural-ode-based-time-to-event-model-with-competing-risks-for-l/11.png)


![](/assets/seminars/survlatent-ode-a-neural-ode-based-time-to-event-model-with-competing-risks-for-l/12.png)


## Results on VTE


![](/assets/seminars/survlatent-ode-a-neural-ode-based-time-to-event-model-with-competing-risks-for-l/13.png)


![](/assets/seminars/survlatent-ode-a-neural-ode-based-time-to-event-model-with-competing-risks-for-l/14.png)


![](/assets/seminars/survlatent-ode-a-neural-ode-based-time-to-event-model-with-competing-risks-for-l/15.png)


# Conclusion

- We propose a full ODE-based variational autoencoder time-to-event framework for modeling longitudinal data combined with the flexible estimation of cause-specific hazard functions for multiple events without explicit parametric assumptions on event time distributions
- Our proposed method offers a promising deep-learning based time-to-event framework for risk predictions in healthcare scenarios where data irregularities such as missing measurements and loss to follow-up are very common.
- By learning complex non- linear relationships between time-varying features, our model makes accurate time-to-event predictions for a wider range of patients while effectively capturing heterogeneity of the VTE risk, including identifying low-risk patients in conventionally high-risk cancer types.
