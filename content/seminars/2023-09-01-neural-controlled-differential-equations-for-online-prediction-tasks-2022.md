---
date: 2023-09-01
title: Neural Controlled Differential Equations for Online Prediction Tasks (2022)
category: Paper Review
presenter: SeungSu Kam
url: https://www.notion.so/4880a44028114a7484c7431eafb47dbd
keywords: Neural Differential Equation, Online Prediction
---

# Selected Paper


## Title: **Neural Controlled Differential Equations for Online Prediction Tasks (2022)**


## Abstract: 


Neural controlled differential equations (Neural CDEs) are a continuous-time ex- tension of recurrent neural networks (RNNs), achieving state-of-the-art (SOTA) performance at modelling functions of irregular time series. In order to interpret discrete data in continuous time, current implementations rely on non-causal in- terpolations of the data. This is fine when the whole time series is observed in advance, but means that Neural CDEs are not suitable for use in _online prediction tasks_, where predictions need to be made in real-time: a major use case for recurrent networks. Here, we show how this limitation may be rectified. First, we identify several theoretical conditions that interpolation schemes for Neural CDEs should satisfy, such as boundedness and uniqueness. Second, we use these to motivate the introduction of new schemes that address these conditions, offering in particular measurability (for online prediction), and smoothness (for speed). Third, we empirically benchmark our online Neural CDE model on three continuous monitoring tasks from the MIMIC-IV medical database: we demonstrate improved performance on all tasks against ODE benchmarks, and on two of the three tasks against SOTA non-ODE benchmarks.

- 불규칙한 시계열 모델링 중 SOTA 성능을 달성하는 CDE는 non-causal interpolations을 통해 데이터를 예측함
- 이러한 경우 전체 시계열이 관측되는 경우는 가능하지만 실시간으로 이루어져야 하는 온라인 예측 작업에는 적합하지 않음
- 본 논문은 이러한 한계를 해결하기 위해 interpolations schemes를 만족해야 하는 기존 이론적 조건과 새로운 schemes을 제공하고 MIMIC-IV에서 우수한 성능을 입증함

## Link



[📄 자료 링크 ↗](https://arxiv.org/abs/2106.11028)



# Paper Review


## Preliminary

- **Neural Ordinary Differential Equation**
    - Neural Ordinary Differential Equation (Neural ODE)은 인공신경망을 통해 state을 유추하는 것이 아닌 state의 미분값을 유추하여 ODE-Solver를 통해 function(신경망)을 근사함

        ![](/assets/seminars/neural-controlled-differential-equations-for-online-prediction-tasks-2022/0.png)

    - hidden state이 latent trajectory와 시간에 따라 변화하는 특징의 function을 나타냄
    - Neural ODE에서 제안하는 모델의 경우  RNN encoder의 경우 hidden state간의 변화가 없음

        ![A generative latent function time-series model in ODE](/assets/seminars/neural-controlled-differential-equations-for-online-prediction-tasks-2022/1.png)

- **Latent ODE**
    - Neural ODE에서 사용했던 RNN Encoder 구조에서 ODE-RNN Encoder 구조로 변경한 모델
    - RNN 에서의 hidden state 사이의 변화를 ODE로 풀어내 continous time latent function의 encoding 유도

    ![](/assets/seminars/neural-controlled-differential-equations-for-online-prediction-tasks-2022/2.png)

- **CDE (Neural Controlled Differential Equations for Irregular Time Series)**
    - Neural CDE 모델은 시계열 데이터를 연속적인 형태(path X = $X_\bold{x}$)로 변환한 후 이를 기반으로 데이터에 내재된 정보의 변화를 연속적으로 모델링
    - 여기서 시계열 데이터를 연속적인 형태로 변환하는 과정은 불연속적인(irregular or partially observed) 시계열 데이터를 처리하는데 매우 효과적

    ![](/assets/seminars/neural-controlled-differential-equations-for-online-prediction-tasks-2022/3.png)


# Introduction


Recent discoveries in **Neural Differential Equations** have provided an attractive methodology for dealing with **irregular time series.**


# Related Works


**Function Modeling**


ODE-Based

- **LatentODE** [Rubanova et al. (2019)]
- **GRU-ODE-Bayes** [De Brouwer et al. (2019)]
- **NJ-ODE** [Herrera et al. (2021)]

CDE-Based

- **NCDE** [Kidger et al. (2020)]
- **RDEs** [Morrill et al. (2021)]

**Time-series Modeling**


SDE-Based

    - **Neural JSDE** [Jia and Benson (2019)]
    - **Neural SDE** [Kidger et al. (2021b)]

**NDPs** [Norcliffe et al., (2021)]


[Chen et al., (2021b)]


physical systems

- **chemical kinetic modelling [**Kim et al., (2021)]
- **oscillatory dynamical systems** [Norcliffe et al., (2020)]
- **systems with switching behaviour** [Chen et al., (2021a)],
- **general scientific modelling** [Rackauckas et al., (2020).]

**Efficient modeling**


**MALI** [Zhuang et al. (2021)]


[Kidger et al. (2021a)]


### Neural ODE :



$$
y(0) = y_0, \qquad y(t) = y(0) + \int_0^t f_\theta(s, y(s)) \,d s.
$$



Neural ODE models suffer from the **initial value problem**, where they are overly dependent on initial conditions **due to the nature of differential equations**, and an improved model that learns the input data at each point in time is called **Neural CDE**.


### **Neural CDE** **:**

- introduced as the general continuous-time limit of arbitrary RNNs.
- demonstrate excellent empirical performance
- outperform at modelling functions of irregular time series in **offline prediction tasks**

**Limitations**

- cannot yet be used to learn and predict **in real-time** (where new data arrives during inference), due to the solution trajectory exhibiting **dependence on future data**.
- Neural ODE variants such as the ODE-RNN (Rubanova et al., 2019) can already handle **online processing**.

## **Neural CDE** **:**


Time series  $\bold{x}$: $\left\{\left((t_0, x_0), \dots,(t_n, x_n)\right)\right\}$ with $t_i \in \R$


$t_i $: observed timestamp


Let $f_{\theta_1}: \mathbb{R}^w \rightarrow \mathbb{R}^{w \times v}$ and $\zeta_{\theta_2}: \mathbb{R}^v \rightarrow \mathbb{R}^w$ be neural networks depending on learnable parameters $\theta_1, \theta_2$. 


$w $:  a hyperparameter that describes the size of the hidden state and corresponds to the **dimension of the information** propagated along the solution trajectory.


Let $X_\bold{x}$ as the control path, Neural CDE model is defined as the solution $z$ to



$$
\begin{equation}z\left(t_0\right)=\zeta_{\theta_2}\left(t_0, x_0\right), \quad z(t)=z\left(t_0\right)+\int_{t_0}^t f_{\theta_1}(z(s)) \frac{\mathrm{d} X_{\mathbf{x}}}{\mathrm{d} s} \mathrm{~d} s \quad \text { for } t \in\left(t_0, t_n\right]\end{equation}
$$



model can be interpreted and solved as an ordinary differential equation.


![](/assets/seminars/neural-controlled-differential-equations-for-online-prediction-tasks-2022/4.png)

- Current implementations take the map $\bold{x} $ **→** $X_\bold{x}$  to be either a **natural cubic spline or a linear interpolation** ([Kidger et al.](notion://www.notion.so/data-analytics-unist/4880a44028114a7484c7431eafb47dbd#_bookmark33), [2020](notion://www.notion.so/data-analytics-unist/4880a44028114a7484c7431eafb47dbd#_bookmark33); [Morrill et al.](notion://www.notion.so/data-analytics-unist/4880a44028114a7484c7431eafb47dbd#_bookmark42), [2021](notion://www.notion.so/data-analytics-unist/4880a44028114a7484c7431eafb47dbd#_bookmark42)), of which neither can be used in an online fashion. This is because predictions at time _ti_ depend on future, as-yet-unobserved, data at $ t > t_i.$

### Contributions

- Formalise the requirements for what it means to be a good Neural CDE control path: 
**adapted measurability, smoothness, boundedness, and uniqueness.**
- **Rectilinear control** and **cubic Hermite splines with backward differences** address the drawbacks of previously considered schemes.
- **Verify the empirical behaviour** of our new schemes for constructing control paths, and
**provide straightforward recommendations** into which scheme to use when.

# What makes a good control signal?


### Adapted measurability


$\mathcal{T}$ **−measurable**


$\mathcal{T}$-measurable Let $ \mathcal{T} \subseteq\left[t_0, t_n\right]$. We say that the Neural CDE solution $z(t)$ (of Equation (1)) is $\mathcal{T}$-measurable if for all $t \in \mathcal{T}$ we have that $z(t)$ is a function of only $\left(t_i, x_i\right)$ for those $t_i \in\left[t_0, t\right]$.


Continuously online


solution is $\mathcal{T}$-measurable for $\mathcal{T}=\left[t_0, t_n\right]$


Discretely online


 solution $z(t)$ is $\mathcal{T}$-measurable for $\mathcal{T}=\left\{t_0, \ldots, t_n\right\}$ (that is, at the observation times)


Offline


at least discretely online then we say it is offline.


**ODE-RNN** (Rubanova et al., 2019) **continuously online**


standard **RNNs**: **discretely online**


**Neural CDEs: offline.**


![](/assets/seminars/neural-controlled-differential-equations-for-online-prediction-tasks-2022/5.png)


### Smoothness

- To be able to apply numerical solvers to the integral in Equation (1) we require that the integrand be **sufficiently smooth**, and thus that the control be sufficiently smooth
- $\bold{X}_\bold{x}$ be piecewise **twice continuously differentiable** with bounded second derivative
- When using an adaptive solver and a control that is **piecewise smooth**, informed about the **jumps** between pieces
- numerically **expensive** procedure

### Boundedness

- $\bold{X}_\bold{x}$ should behave “reasonably”
- should not introduce any spurious oscillations or grow unboundedly from bounded data.
- let $\tau_i = t_{i+1} -t_i$ , Then we require that there exists some continuous $ω$


$$
\begin{equation}\left\|X_{\mathbf{x}}\right\|_{\infty}+\left\|\frac{\mathrm{d} X{\mathbf{x}}}{\mathrm{d} t}\right\|_{\infty}+\left|\frac{\mathrm{d} X{\mathbf{x}}}{\mathrm{d} t}\right|_{B V}<\omega\left(\max _i \tau_i, \min _i \tau_i, \max i\left|x_i\right|\right)\end{equation}
$$



_where_ $|\cdot|_{B V}$ denotes the bounded variation seminorm.


### Control signal uniqueness



$$
\begin{equation}\mathrm{x} \rightarrow X_{\mathbf{x}} \text { is injective with respect to } \mathcal{X} \text {. }\end{equation}
$$


- require every possible unique set of data to have a unique control path.
- If the dataset is regularly sampled, then (3) is immediately satisfied
- If the dataset is irregularly sampled, then this may fail. One way to recover (3) is **to include the
observational frequencies** $c_i$

    $\begin{aligned}
    & \mathbf{x}_1=\left(\left(t_0, x_0\right),\left(t_1, x_0\right)\right) \\
    & \mathbf{x}2=\left(\left(t_0, x_0\right),\left(t*, x_0\right),\left(t_1, x_0\right)\right)
    \end{aligned}$


    where $t_0 < t∗ < t_1.$ Clearly, as one has an additional observations, the two time series contain **different information**. 


    However, all interpolation schemes given in Section 3 result in the interpolation $X_\bold{x}(t) = (t, x_0)$ for $t ∈ [t_0, t_1].$


# Control signals for Neural CDEs


![](/assets/seminars/neural-controlled-differential-equations-for-online-prediction-tasks-2022/6.png)


### **Natural cubic splines**


![](/assets/seminars/neural-controlled-differential-equations-for-online-prediction-tasks-2022/7.png)

- were used in the original Neural CDE paper by Kidger et al. (2020).
- **requires the full time series** to be available prior to construction
- is sufficient, fast to integrate numerically

⇒ **Adapted measurability**


![](/assets/seminars/neural-controlled-differential-equations-for-online-prediction-tasks-2022/8.png)


### Linear control


![](/assets/seminars/neural-controlled-differential-equations-for-online-prediction-tasks-2022/9.png)

- linear interpolation between observations
- defines a discretely online control path, has the same online properties as an RNN.
- exists missing data then it cannot be used even discretely online,
    - $\bold{x} = ((t_0, x_0),(t_1, ∗),(t_2, x_2))
    $ with * denoting missing data
    - t cannot define an online solution at $t_1$

    ⇒ **Uniqueness, Smoothness** problem


![](/assets/seminars/neural-controlled-differential-equations-for-online-prediction-tasks-2022/10.png)


## Proposed method


### Cubic Hermite splines with backward differences


![](/assets/seminars/neural-controlled-differential-equations-for-online-prediction-tasks-2022/11.png)

- smooths the discontinuities in the linear control, while retaining the same online propertis.
- joining adjacent timepoints with a cubic spline where the additional degrees of freedom are used to smooth gradient discontinuities
- solves a single equation on each $[i, i + 1) $ piece independently.

**⇒ complemented linear control and Natural cubic splines.** But **Uniqueness Problem**


__________________________________________________________________________________________________________


Each of the previous schemes need to look at **least one time-step ahead to construct the control between time points**. This means they are not continuously online.


### Rectilinear control


![](/assets/seminars/neural-controlled-differential-equations-for-online-prediction-tasks-2022/12.png)

- To resolve this, we start by letting $\widetilde{x}_i$ _denote the forward fill of_ $x_i$ _with respect to the missing data_ $*$_._
- _We then let_ $X{\mathbf{x}}:[0,2 n] \rightarrow \mathbb{R}^v$ be piecewise linear such that $X_{\mathbf{x}}(2i)=\left(t_i, \widetilde{x}_i, c_i\right)$ _for_ $i \in\{0, \ldots, n\}$ _and_ $X_{\mathbf{x}}(2 i-1)=\left(t_{i+1}, \widetilde{x}_i, c_i\right)$ for $i \in\{1, \ldots, n\}$.
- updates the time and feature channels separately in **lead-lag fashion.**
    - channels are **not observed**, time is **increased**
    - When a channel is **observed**, then we **interpolate between channel values** with time held fixed.
- parameterisation is **twice as long** (with domain [0, 2n] rather than [0, n])
- correspondingly **many derivative discontinuities ⇒ longer to evaluate, and to train**

**→ Smoothness problem, Uniqueness Problem**


![](/assets/seminars/neural-controlled-differential-equations-for-online-prediction-tasks-2022/13.png)


# Experiments & Results


## Dataset


**Offline**

- Regularly Sampled Times Series
    - Classification
        - SpeechCommands (Accuracy)
        - CharacterTrajectories (Accuracy)
    - Prediction
        - BeijingPM2.5 (RMSE)
        - BeijingPM10 (RMSE)
- Irregularly Sampled Times Series
    - Classification
        - Mortality (AUC)
        - Sepsis (AUC)
    - Prediction
        - LOS (RMSE)

**Online**

- MIMIC-IV

## Competing Methods

- MIMIC-IV
    - **vanilla GRU**
    - **GRU-dt**
    - **GRU-dt-intensity**
    - **GRU-D**
    - **ODE-RNN**

## Offline Regularly Sampled Times Series Dataset


![NFEs column (Number of Function Evaluations per epoch)](/assets/seminars/neural-controlled-differential-equations-for-online-prediction-tasks-2022/14.png)


## Offline Irregularly Sampled Times Series Dataset


![](/assets/seminars/neural-controlled-differential-equations-for-online-prediction-tasks-2022/15.png)


## Online Prediction Task


![](/assets/seminars/neural-controlled-differential-equations-for-online-prediction-tasks-2022/16.png)


# Discussion & limitations


**Recommendations for the control signal**

1. If the problem is **online** and requires the solution to be **continuously online**

    ⇒ use **rectilinear** controls

2. If the problem is **online**, has **no missing data**, and requires the solution to be **discretely online**

    ⇒ use **cubic Hermite splines with backward differences****.**

3. If **speed** is of greater **importance** than accuracy

    ⇒ **natural cubic splines**

4. for **most cases**.

    ⇒ use **rectilinear** **or**  **cubic Hermite splines with backward differences.**


**Limitations**

- rectilinear controls: typically **slow**, and if trained with discretise-then-optimise techniques come with **high memory usage**.

# Conclusion

- **formalised the properties** that ideal Neural CDE control schemes
- identified **two new control schemes** that address issues with existing implementations, in particular with respect to **online predictions(****rectilinear)** **and speed(****cubic Hermite splines with backward differences)**
- provide recommendations regarding **which scheme to use when**
- **state-of-the-art performance** is demonstrated against similar ODE or RNN based approaches
