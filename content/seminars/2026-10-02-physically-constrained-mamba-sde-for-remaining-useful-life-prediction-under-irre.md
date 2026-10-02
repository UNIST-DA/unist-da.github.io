---
date: 2026-10-02
title: Physically-Constrained Mamba-SDE for Remaining Useful Life Prediction under Irregular Observations
category: Lab Seminar
presenter: SeungSu Kam
url: https://www.notion.so/3ea046396f7e8086b298c0007fdef429
keywords: Neural Differential Equation, Irregular time series, RUL
---

# Selected Paper


## Title: Physically-Constrained Mamba-SDE for Remaining Useful Life Prediction under Irregular Observations (Zhuang, Deyu, et al., KDD, 2026)


## Abstract: 


Accurate Remaining Useful Life prediction is critical for industrial predictive maintenance. However, real-world deployment is challenging due to the irregular nature of sensor observations, characterized by asynchronous sampling, burst missingness, and temporal jitter. Compounding this issue, purely data-driven models often generate physically implausible degradation trajectories that violate the irreversible nature of damage accumulation. To address this, we propose PC-MambaSDE, a unified continuous-time framework for robust RUL prediction under irregular observations. Specifically, we design a Mask-Aware Continuous Mamba Encoder that explicitly leverages observation masks to extract context-rich control signals. Furthermore, we introduce a Physics-Guided Latent SDE with parametrically rectified hybrid drift, superimposing a global physical bias to enforce monotonic degradation even amid severe observation gaps. Additionally, we formulate RUL prediction as a boundary value problem via a Terminal Degradation Penalty, which decouples a Health Index dimension and applies a penalty loss to guide trajectories toward the failure state. Theoretically, we prove that our variational objective is mathematically equivalent to minimizing the KL divergence via Girsanov's theorem, and we guarantee the global asymptotic stability of the learned dynamics through Lyapunov analysis. To enable rigorous evaluation, we develop a Hybrid Irregularity Generation Scheme that simulates realistic industrial imperfections. Extensive experiments on public benchmarks demonstrate that PC-MambaSDE significantly outperforms state-of-the-art methods, particularly under extreme observation scarcity, validating the efficacy of embedding physical priors into continuous-time latent dynamics. Our code is available at [https://github.com/KylinToeFish/PC-MambaSDE](https://github.com/KylinToeFish/PC-MambaSDE).


## Link



[📄 자료 링크 ↗](https://dl.acm.org/doi/10.1145/3770855.3817877)



Physically-Constrained ~~Mamba~~-SDE for Remaining Useful Life Prediction ~~under Irregular Observations~~


⇒ PC-SDE RUL


# Paper Review


# What is Remaining Useful Life Prediction?


![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/0.png)


![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/1.png)


![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/2.png)


## **What do they have in common? ⇒ If you keep using it, it will** _**break**_


![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/3.png)


### Fix or repair it before it breaks. **But what is the current status?** **(=Remaining Useful Life)**


> ## 💡 But in the real world, **we do not always observe the system continuously.**


# Real-world Problem: Irregular Observations


### Ideal Condition


Most conventional RUL models assume that sensor measurements are:


![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/4.png)

- densely observed
- regularly sampled
- synchronized across sensors

### Real Industrial Condition


In practice, observations can be:


![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/5.png)

- asynchronous across sensors
- randomly missing
- missing for long consecutive intervals
- affected by temporal jitter and noise

## Key Question

> How can we **predict RUL** when **observations are sparse, irregular, and unreliable?**

# Why Existing RUL Models Struggle


## **1. Data-Driven RUL Prediction**


![CNN](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/6.png)


![LSTM](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/7.png)


![Attention](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/8.png)


Traditional RUL models have evolved from:


```plain text
CNN → LSTM/GRU → Attention-based Models
```


### Strength


**Good at extracting degradation patterns from multivariate sensor data.**


### Limitation


Most assume **dense and regularly sampled observations**.


When data are irregular:


```plain text
Irregular Data
      ↓

Interpolation / Imputation

      ↓
RUL Model
```


> 💡 The paper argues that this **“impute-then-predict”** strategy may introduce bias, especially under severe data scarcity.


## 2. Modeling Irregular Time Series


Continuous-time models provide a natural solution.


![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/9.png)


![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/10.png)



$$
dZ_t=f(Z_t,t)dt+\sigma dW_t
$$



Examples:

- Neural ODE
- Neural CDE
- Latent SDE
- GRU-ODE-Bayes
- ACSSM

### Strength


Naturally handles irregularly sampled observations **without explicit interpolation.**


### Remaining Problem


These models are still mostly **data-driven latent dynamics**.


The paper argues that they do not explicitly guarantee physically plausible degradation behavior.

> **Irregular-time modeling is solved, but degradation physics is still missing.**

## Continuous-Time ≠ Physically Meaningful


A flexible Latent SDE can evolve continuously during missing intervals.


But the trajectory may become physically **implausible**.


![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/11.png)


![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/12.png)


![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/13.png)


The paper specifically highlights:

- oscillatory degradation
- stagnation
- unrealistic recovery
- failure to converge toward a failure state
> “Standard Latent SDEs operate as ‘black-box’ generative models lacking the physical constraints inherent to mechanical degradation.”

### Core Idea


When observations disappear,



$$
\text{the model should rely more on degradation prior}
$$



rather than arbitrary extrapolation.


## 3. State Space Models and Mamba


Mamba provides an efficient way to model long sensor sequences.


### Why Mamba?

- captures long-range dependencies
- linear sequence complexity
- naturally connected to state-space modeling

### **Limitation**

- Standard Mamba assumes a conventional sequence representation
- Does not explicitly exploit observation masks / informative missingness

# Research Gap


Existing approaches solve different parts of the problem.


| Method          | Irregular Time | Uncertainty | Physical Constraint |
| --------------- | -------------- | ----------- | ------------------- |
| CNN / LSTM      | Limited        | Limited     | ✗                   |
| Neural ODE      | ✓              | Limited     | ✗                   |
| Latent SDE      | ✓              | ✓           | ✗                   |
| Mamba           | Limited        | Limited     | ✗                   |
| **PC-MambaSDE** | **✓**          | **✓**       | **✓**               |


# PC-MambaSDE Overview


Fomultation: health state of a system



$$
dZ_t=f(Z_t,t)dt+\sigma dW_t
$$


- $Z_t$: the underlying health/degradation state of the machine that is not directly observable
- $f(Z_t,t)$: the drift function describing how the degradation state evolves over time
- $dW_t$: stochastic/random variation in the degradation process

The model has three key components:


> ### 💡 1. Mask-Aware Mamba  
>   
> Extract degradation information from sparse observations.


> ### 💡 2. Physics-Guided Latent SDE  
>   
> Model continuous stochastic degradation.


> ### 💡 3. Terminal Degradation Constraint  
>   
> Encourage the latent trajectory toward a failure state.


![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/14.png)


# Mask-Aware Mamba Encoder


![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/15.png)


Augmented Embedding



$$
\mathbf{X}_{emb} = LayerNorm(Linear([x_{\tau_i}\oplus m_{\tau_i}]))
$$


- Concatenates **sensor values** with their **observation masks**.
- Allows the model to distinguish a truly observed value from a missing value.

Mamba Sequence Modeling



$$
\mathbf{H}_{seq} = Φ_{Mamba}(\mathbf{X}_{emb})
$$


- Mamba captures **long-range temporal dependencies** from the observed sequence.
- It produces a latent representation that summarizes the degradation history.

Latent Filling and Recurrent Smoothing.



$$
\mathbf{H} _{fill} [t ] = \mathbf{H}_{seq}[τ (t )] \\
\mathbf{u}_\phi(t) = GRU(\mathbf{H}_{fill})
$$


- **Latent Filling:** propagates the most recent valid latent state across missing intervals.
- **GRU Smoothing:** smooths discontinuities and converts the latent sequence into the control signal ($u_\phi(t)$).

```plain text
Sensor + Mask
     ↓
   Mamba
     ↓
Latent Filling
     ↓
    GRU
     ↓
  uφ(t)
```


> ### 💡 Important Point  
>   
> - Mamba does **not** directly predict RUL.  
>   
> - It provides observational information to guide the SDE dynamics.


# Physics-Guided Latent SDE


The Mask-Aware Mamba Encoder produces a **control signal**



$$
u_\phi(t)
$$



from **irregular observations.**


The next question is:

> **How should the latent degradation state evolve continuously over time?**

![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/16.png)


The proposed latent dynamics are:



$$
dZ_t = [A(t)Z_t  + Bu_\phi(t) + b_{phy} ]dt + \sigma dW_t
$$



Each term has a different role:



$$
\underbrace{A(t)Z_t}:{System\ Dynamics}+\underbrace{Bu_\phi(t)}:{Data\ Control}+\underbrace{b_{phy}}:{Physical\ Bias}+\underbrace{\sigma dW_t}:{Uncertainty}
$$


- **System Dynamics** $(A(t)Z_t)$**:** models the intrinsic evolution of the latent system state.
- **Data Control** $(Bu_\phi(t))$**:** adjusts the trajectory using information extracted from observed sensor data.
- **Physical Bias** $(b_{phy})$**:** introduces a persistent degradation direction.
- **Diffusion** $(\sigma dW_t)$**:** captures stochastic uncertainty in the degradation process.

### Main Concept


```plain text
More Observations
      ↓
More Data-Driven Adaptation

Fewer Observations
      ↓
More Physics-Guided Evolution
```

> 💡 **Key Idea**
>
> The latent trajectory is determined jointly by **system dynamics, observed data, physical prior, and stochastic uncertainty**.
>
>

---


## Basis-Decomposed Drift Construction (Stable)



$$
A_{\text{neural}}(t)Z_t
$$



This represents the **internal system dynamics**.


### Why Not Learn A(t) Directly?


If A(t) is completely unconstrained, the learned dynamics may become **unstable**. ⇒ may **diverge**


During long observation gaps:


```plain text
No observations
      ↓
Unstable A(t)
      ↓
Latent trajectory may 
diverge
```


To avoid this, paper construct it from a set of **stable basis matrices.**


---


### Step 1. Stable Basis Dynamics



$$
A^{(1)}_{basis}, A^{(2)}_{basis}, \ldots, A^{(K)}_{basis} \\
A_{\text{basis}}^{(k)}
=
-\left(
\exp(D_{\text{basis}}^{(k)})
+
\epsilon I
\right)
$$



Each basis represents a possible system dynamic regime.


The authors parameterize these matrices to maintain stable dynamics.


---


### Step 2. Mamba Determines the Mixture


The **control signal** $u_\phi(t)$ generates mixing coefficients:



$$
\alpha(t) = Softmax \left( Linear_{coeff}(u_\phi(t)) \right)
$$



with



$$
\alpha_k(t)\ge0, \qquad \sum_{k=1}^{K}\alpha_k(t)=1
$$



---


### Step 3. Construct the Time-Varying Drift



$$
A_{\text{neural}}(t) = \sum_{k=1}^{K} \alpha_k(t) A^{(k)}_{basis}
$$


> 
>
> $A_{\text{neural}}(t)$ determines **how the system evolves**, while Mamba dynamically selects the appropriate mixture of stable dynamics.
>
>

The paper constructs $A_{\text{neural}}(t)$ as a convex combination of basis matrices and provides a Lyapunov-based stability argument for this design.


### Theorem & Proof


    ![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/17.png)


    > 💡 Each basis matrix $A_k$ is constrained to be stable(**negative definite**), and the common Lyapunov function decreases for every basis. Therefore, their Softmax-weighted convex combination $A(t)$ also remains stable, preventing the latent state from diverging.


## Mamba Control Has Two Roles (system dynamics & data control)


An important point is that



$$
u_\phi(t)
$$



is used in **two different ways**.


### Role 1. Select the System Dynamics



$$
u_\phi(t) \rightarrow \alpha_k(t) \rightarrow A_{\text{neural}}(t)
$$



The observed sensor history determines which latent dynamics are appropriate.


### Role 2. Directly Control the SDE



$$
Bu_\phi(t)
$$



The same observational information **directly adjusts the latent trajectory.**


### Therefore


```plain text
┌→ αk(t) → A_neural(t)
Mamba → uφ(t) ─────┤
                   └→ Buφ(t)
```


The first path changes **how the system evolves**.


The second path changes **where the trajectory should move based on current observations**.

> 
>
> Mamba’s output actively controls both the **dynamic regime** and the **trajectory correction**.
>
>

---


## Decoupled State Space (How to represent degradation state)


A standard latent SDE treats **all latent dimensions equally.**


However, not every latent variable in a machine **should behave monotonically.**


**For example:**

- temperature may increase or decrease
- vibration may fluctuate
- operating conditions may change
- but cumulative degradation should generally progress toward failure

Therefore, the model separates the latent state into:



$$
Z_t = \begin{bmatrix} z_t^{(h)}\\ \mathbf{z}_t^{(d)} \end{bmatrix}
$$



### Health Index



$$
z_t^{(h)} \in \mathbb{R}
$$



A single latent dimension explicitly assigned to represent **cumulative degradation**.


### Dynamic Latent State



$$
\mathbf{z}_t^{(d)} \in \mathbb{R}^{d-1}
$$



Represents other complex and potentially non-monotonic system dynamics.


$z_t^{(h)}$: Health Index → **degradation** 


$z_t^{d}$: Dynamics → **fluctuations**


### Why Is This Necessary?


Without this separation, it is unclear **which latent dimension should obey degradation physics**.


The decoupled state allows the model to apply degradation constraints specifically to $z_t^{(h)}$, while keeping the remaining latent dimensions flexible.

> 💡 **Key Idea**
>
> **Separate “health degradation” from other system variations before imposing physical constraints.**
>
>

The paper describes $z_t^{(h)}$ as a **virtual sensor** for the unobservable degradation state.


## Parametric Drift Rectification (How to make degradation?)



$$
dZ_t = [A(t)Z_t  + Bu_\phi(t) + b_{phy} ]dt + \sigma dW_t
$$



Stable latent dynamics **do not** necessarily **guarantee progression toward failure**.


To introduce a **persistent degradation** tendency, the model adds:



$$
\mathbf{b}_{phy}
=
[-|\lambda_{base}|,\,0,\,\ldots,\,0]^T
=
\begin{bmatrix}
-|\lambda_{base}| \\
0 \\
\vdots \\
0
\end{bmatrix}
$$



Only the **Health Index dimension** receives the negative bias.


### Health Index Dynamics



$$
dz_t^{(h)}
=
\left(
a_h(t)^T z_t^{(d)}
+
[B u_\phi(t)]_0
-
|\lambda_{base}|
\right)dt
+
\sigma dW_t^{(h)}
$$


- $a_h(t)^Tz_t^{(d)}$: internal system dynamics
- $[Bu_\phi(t)]_0$: data-driven correction
- $-|\lambda_{base}|$: persistent degradation bias
- $\sigma dW_t^{(h)}$: stochastic uncertainty
> 
>
> **Data adapt the trajectory,** while the physical bias provides a **default degradation direction—especially when observations are sparse.**
>
>

---


---


# Variational Objective via Girsanov Theorem (How to train the model?)


The next question is:

> **How can the model use observational information while remaining close to the physical degradation prior?**

> 💡 **Use the physical prior** as much as possible, and introduce **neural control only when needed to explain the observations.**


### Physical Prior


Without data-driven control: let path measure $\mathbb{P}$



$$
( A(t)Z_t + b_{phy}  )dt + \sigma dW_t
$$



This represents the model's **default degradation dynamics**.


---


### Data-Controlled Posterior


With observational information: let path measure $\mathbb{Q_{\phi}}$



$$
(A(t)Z_t + b_{phy} + Bu_\phi(t) )dt + \sigma dW_t
$$



The difference between the two processes is:



$$
Bu_\phi(t)
$$



which represents the **data-driven intervention**.


---


### ELBO Objective


The model maximizes:



$$
L_{ELBO} = 
\mathbb{E}_{\mathbb{Q}\phi}
\left[
\sum_{i=1}^{N}
\log p
\left(
x_{\tau_i}
\mid
Z_{\tau_i}
\right)
\right] - KL(\mathbb{Q}_\phi || \mathbb{P})
$$


- **Likelihood:** explain the observed sensor data
- **KL term:** prevent excessive deviation from the physical prior

---


### From KL Divergence to Control Energy


The prior and posterior have the same diffusion term, but their drift functions differ by:



$$
f_\phi(Z_t,t)-f_{prior}(Z_t) = Bu_\phi(t)
$$



**Applying Girsanov's theorem**, the path-wise KL divergence between the two processes can be expressed using their drift difference:



$$
KL(Q_\phi \| P) = \mathbb{E}_{Q_\phi} \left[ \int_0^T \frac{1}{2\sigma^2} \left\| f_\phi(Z_t,t) - f_{prior}(Z_t) \right\|_2^2 dt \right]
$$



Since



$$
f_\phi(Z_t,t)-f_{prior}(Z_t) = Bu_\phi(t),
$$



the deviation from the physical prior is determined by the **neural control**.


---


### Why Girsanov's Theorem?


Girsanov's theorem relates the path distributions of two diffusion processes that share the same diffusion but have different drift functions.


In this model:



$$
P \quad \overset{Bu_\phi(t)}{\longrightarrow} \quad Q_\phi
$$



For simplicity, the paper assumes $\sigma = I$ or equivalently absorbs $\sigma^{-1}$ into the control term.


Under this simplification, Girsanov's theorem gives:



$$
KL(Q_\phi\|P) = \mathbb{E}_{Q_\phi} \left[ \int_0^T (Bu_\phi(t))^T dW_t^{Q} + \frac{1}{2} \int_0^T \|Bu_\phi(t)\|_2^2dt \right]
$$



The stochastic integral is a martingale and therefore has zero expectation:



$$
\mathbb{E}_{Q_\phi} \left[ \int_0^T (Bu_\phi(t))^T dW_t^{Q} \right] = 0
$$



Therefore,



$$
KL(Q_\phi\|P) = \mathbb{E}_{Q_\phi} \left[ \int_0^T \frac{1}{2} \|Bu_\phi(t)\|_2^2dt \right]
$$



This is interpreted as the **control energy**.

> 
>
> Girsanov's theorem converts the difference between the **physical prior** and the **data-controlled posterior** into the energy required by the neural control.
>
>
> Larger neural intervention $\rightarrow$ larger deviation from the physical prior $\rightarrow$ larger KL penalty.
>
>

---


> 💡 > **The physical prior provides the default dynamics, while the neural control intervenes only when observational evidence requires correction.**


# Hybrid Decoding with Terminal Penalty


### How to connect latent degradation to RUL?


The learned SDE trajectory alone does not guarantee that the Health Index is directly useful for RUL prediction.


Therefore, the model adds three objectives.


### 1. Terminal Degradation Penalty



$$
\mathcal{L}_{Penalty} = \left\| z_T^{(h)} - y_{norm} \right\|_2^2
$$



Aligns the terminal Health Index with the normalized RUL target.


---


### 2. Monotonicity Regularization



$$
\mathcal{L}_{Mono} = \frac{1}{N} \sum_{i=0}^{N-1} ReLU \left( z_{\tau_{i+1}}^{(h)} - z_{\tau_i}^{(h)} \right)
$$



Penalizes upward changes in the Health Index.


---


### 3. Auxiliary RUL Regression



$$
\hat{y}_{reg} = MLP_{dec}(Z_T)
$$




$$
\mathcal{L}_{Reg} = \left\| \hat{y}_{reg} - y_{RUL} \right\|_2^2
$$



Directly predicts RUL from the terminal latent state.


---


## Total Objective



$$
\mathcal{L}_{Total} = -\mathcal{L}_{ELBO} + \gamma_1\mathcal{L}_{Penalty} + \gamma_2\mathcal{L}_{Mono} + \gamma_3\mathcal{L}_{Reg}
$$


> 
>
> **The model jointly learns the stochastic trajectory, enforces degradation consistency, and directly predicts RUL.**
>
>

# Experiments


## Experimental Setup


### Datasets

- **C-MAPSS**: FD001–FD004
- **N-CMAPSS**: cycle-aggregated run-to-failure trajectories

### Irregularity Generation


The paper introduces **Hybrid Irregularity Generation Scheme (HIGS)** to simulate realistic industrial imperfections:

- Asynchronous Sensor **Dropout → randomly remove individual sensor observations**
- Structural **Burst Missingness → remove consecutive observation segments**
- Temporal **Jitter → perturb timestamps to create non-uniform sampling**
- **State-Dependent Noise → increase sensor noise as degradation progresses**

### Baselines


**Discrete-Time Models**

- LSTM + GP
- LSTM + MPACE
- Sparse MFMLP
- PSR

**Continuous-Time Models**

- Latent ODE
- Latent SDE
- ACSSM

# Results


![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/18.png)


![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/19.png)

- Reproudce Results (model validation problem)

| Dataset | 50%       | 50% paper | 70%       | 70% paper | 90%       | 90% paper |
| ------- | --------- | --------- | --------- | --------- | --------- | --------- |
| FD001   | **14.07** | 16.68     | **15.23** | 18.24     | **18.12** | 19.43     |
| FD002   | **16.37** | 18.55     | **17.09** | 18.87     | **19.40** | 20.24     |
| FD003   | **13.83** | 17.90     | **15.03** | 18.42     | **16.92** | 20.01     |
| FD004   | **15.49** | 17.11     | **16.93** | 19.22     | —         | 22.18     |


## **Microscopic Model Analysis**


![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/20.png)


> 💡 - During missing intervals, the physical prior guides the trajectory; when data return, the model recalibrates using observations.


## **Macroscopic Model Analysis**


![](/assets/seminars/physically-constrained-mamba-sde-for-remaining-useful-life-prediction-under-irre/21.png)


> 💡 - The learned Health Index shows a smooth, approximately monotonic degradation trend that follows the ground-truth degradation progression.  
>   
> - learned latent representation captures different degradation stages.


# Conclusion


### Main Contributions

1. **Mask-Aware Mamba**
    - extracts control signals from irregular observations
2. **Physics-Guided Latent SDE**
    - models continuous stochastic degradation
    - stabilizes latent dynamics
    - introduces a degradation direction
3. **Hybrid Decoding**
    - connects the Health Index trajectory to RUL prediction

# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
