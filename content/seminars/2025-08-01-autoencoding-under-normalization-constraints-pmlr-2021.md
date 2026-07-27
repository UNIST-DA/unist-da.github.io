---
date: 2025-08-01
title: Autoencoding Under Normalization Constraints (PMLR, 2021)
category: Paper Review
presenter: SeungSu Kam
url: https://www.notion.so/23f046396f7e8014b2e5e4d83e1f3c27
keywords: Anomaly Detection, Autoencoder
---

# Selected Paper 


## Title: 


Yoon, Sangwoong, Yung-Kyun Noh, and Frank Park. "Autoencoding under normalization constraints." _International Conference on Machine Learning_. PMLR, 2021.




## Abstract: 


Likelihood is a standard estimate for outlier detection. The specific role of the normalization constraint is to ensure that the out-of-distribution (OOD) regime has a small likelihood when samples are learned using maximum likelihood. Because autoencoders do not possess such a process of normalization, they often fail to recognize outliers even when they are obviously OOD. We propose the Normalized Autoencoder (NAE), a normalized probabilistic model constructed from an autoencoder. The probability density of NAE is defined using the reconstruction error of an autoencoder, which is differently defined in the conventional energy-based model. In our model, normalization is enforced by suppressing the reconstruction of negative samples, significantly improving the outlier detection performance. Our experimental results confirm the efficacy of NAE, both in detecting outliers and in generating in-distribution samples.


## Link



[📄 자료 링크 ↗](https://proceedings.mlr.press/v139/yoon21c.html)



# Preliminary


### AutoEncoder

- neural networks trained to reconstruct an input datum $\mathbf{x}$

![](/assets/seminars/autoencoding-under-normalization-constraints-pmlr-2021/0.png)



$$
\begin{aligned}L_{\mathrm{AE}} & =\mathbb{E}_{\mathbf{x} \sim p(\mathbf{x})}\left[l_\theta(\mathbf{x})\right], \\\nabla_\theta L_{\mathrm{AE}} & =\mathbb{E}_{\mathbf{x} \sim p(\mathbf{x})}\left[\nabla_\theta l_\theta(\mathbf{x})\right],\end{aligned}
$$




$$
l_\theta(\mathbf{x})=\operatorname{dist}\left(\mathbf{x}, f_d\left(f_e(\mathbf{x})\right)\right)
$$



> 💡 Autoencoder reconstruction error **is not a likelihood of a datum**,   
> ⇒  minimization of the reconstruction error **does not correspond to the maximization of the likelihood.**


### Energy-Based Model(EBM)


![](/assets/seminars/autoencoding-under-normalization-constraints-pmlr-2021/1.png)

- models for a normalized probability distribution
- represents a probability distribution through the unnormalized negative log probability, also called the energy function $E_θ(x)$ ( $\theta$=model parameter)


$$
p_\theta(\mathbf{x})=\frac{1}{\Omega_\theta} \exp \left(-E_\theta(\mathbf{x}) / T\right)
$$


- $\Omega $: normalization constant


$$
\Omega_\theta=\int_{\mathcal{X}} \exp \left(-E_\theta(\mathbf{x}) / T\right) \mathrm{d} \mathbf{x}<\infty
$$



⇒ It is hard to calculate the $\Omega$, when  $x$ is high dimensional.


> 💡 Maximum likelihood learning can still be performed without the explicit evaluation of $Ω_θ$.


최대우도 학습(maximum likelihood learning)으로 $\Omega$를 명시적으로 계산하지 않고도 수행



$$
\begin{aligned}& \mathbb{E}_{\mathbf{x} \sim p(\mathbf{x})}\left[-\nabla_\theta \log p_\theta(\mathbf{x})\right] \\= & \mathbb{E}_{\mathbf{x} \sim p(\mathbf{x})}\left[\nabla_\theta E_\theta(\mathbf{x})\right] / T+\nabla_\theta \log \Omega_\theta \\= & \mathbb{E}_{\mathbf{x} \sim p(\mathbf{x})}\left[\nabla_\theta E_\theta(\mathbf{x})\right] / T-\mathbb{E}_{\mathbf{x}^{\prime} \sim p_\theta(\mathbf{x})}\left[\nabla_\theta E_\theta\left(\mathbf{x}^{\prime}\right)\right] / T\end{aligned}
$$



Taking the logarithm, and Differentiating with respect to $\theta$ :



$$
\log p_\theta(x) = -\frac{1}{T} E_\theta(x) - \log \Omega_\theta \\


\nabla_\theta \log p_\theta(x) = -\frac{1}{T} \nabla_\theta E_\theta(x) - \nabla_\theta \log \Omega_\theta
\\
- \nabla_\theta \log p_\theta(x) = \frac{1}{T} \nabla_\theta E_\theta(x) + \nabla_\theta \log \Omega_\theta
$$




$$
\begin{equation}\mathbb{E}_{x \sim p(x)} \left[ - \nabla_\theta \log p_\theta(x) \right]= \mathbb{E}_{x \sim p(x)} \left[ \frac{1}{T} \nabla_\theta E_\theta(x) \right] + \nabla_\theta \log \Omega_\theta \tag{6}\end{equation}
$$



Differentiate the log partition function:



$$
\nabla_\theta \log \Omega_\theta = \frac{1}{\Omega_\theta} \nabla_\theta \Omega_\theta= \frac{1}{\Omega_\theta} \int \left( -\frac{1}{T} \nabla_\theta E_\theta(x) \right) \exp\left(-\frac{E_\theta(x)}{T}\right) dx
$$



Recognizing the integrand as $p_\theta(x)$ we have:
 



$$
\nabla_\theta \log \Omega_\theta = - \int \frac{1}{T} \nabla_\theta E_\theta(x) \cdot p_\theta(x) dx = - \mathbb{E}_{x' \sim p_\theta(x)} \left[ \frac{1}{T} \nabla_\theta E_\theta(x') \right]
$$



Substituting back into Equation (6), we arrive at the final gradient expression:



$$
\begin{equation}\mathbb{E}_{x \sim p(x)} \left[ - \nabla_\theta \log p_\theta(x) \right] = \mathbb{E}_{x \sim p(x)} \left[ \frac{1}{T} \nabla_\theta E_\theta(x) \right] - \mathbb{E}_{x' \sim p_\theta(x)} \left[ \frac{1}{T} \nabla_\theta E_\theta(x') \right] \tag{7}\end{equation}
$$


- $\nabla_\theta \log \Omega_\theta $ is is evaluated from the energy gradients of samples $x'$ generated from the model in Eq. (7).
- samples from $p_\theta(x)$ are called **negative samples (= 모델이 만든 데이터)**

> 💡 **In Eq. (7), the first term decreases the energy of the training data, or “positive” samples**  
> **the second term increases the energy of the generated samples, or “negative” samples**  
>   
> Training converges when $p_θ(x) $ becomes identical to $p(x)$


### How to generate negative sample? Langevin Monte Carlo (LMC)

- starting point $x_0$ is drawn from a noise distribution $p_0(x)$,  typically a Gaussian or uniform distribution.


$$
\begin{equation}x_{t+1} = x_t + \lambda_x \nabla_x \log p_\theta(x_t) + \sigma_x \epsilon_t\quad \text{where } \epsilon_t \sim \mathcal{N}(0, I)\tag{8}\end{equation}
$$


- $∇_x \log p_θ(x) = −∇_xE(x)/T$,  the step size can be seen as adjusting the temperature T

> 💡 Langevin Monte Carlo updates a sample by following the **gradient toward higher probability regions** while **adding noise.**


# Paper Review


### Outlier Detection/ Out-of-Distribution Detection

- It lies in the $\rho$-sublevel set of a data density


$$
\{x|p(x) ≤ ρ\}
$$



확률 밀도p(x)가 ρ보다 작거나 같은 입력들의 집합

> **This paper focus on** $   
> \rho =0$  
> **⇒**  outlier is defined as an input from the outside of the data distribution’s support

### Autoencoder-based Outlier Detection

- Outlier detection occurs when  $l_θ(x) > τ$,  where $\tau$ is a threshold
- **However, if outlier reconstruction happens, it is possible that** $p(x^∗) ≤ ρ, $ **but**  $l_θ(x^∗) < τ$

## Motivation


### Autoencoder Failure

- An autoencoder (Rumelhart et al., 1986) is a neural network **trained to reconstruct samples from a training data distribution.**
- reconstruction is expected to be poor for inputs that deviate significantly from the training data, **autoencoders are widely used in outlier detection**

> 💡 **However, AEs have been known to reconstruct outliers consistently across a wide range of experimental settings ⇒ outlier reconstruction**


![](/assets/seminars/autoencoding-under-normalization-constraints-pmlr-2021/2.png)


### Normalized probabilistic model

- must assign a total probability of 1
- maximum likelihood training naturally pushes the **model to place more probability on the data** — and **less on out-of-distribution regions**.

**⇒ likelihood is widely used as a predictor for outlier detection**


### Normalized Autoencoder (NAE)

- defines a probabilistic model from an autoencoder
- **reconstruction error is reinterpreted as an energy function**
- maximum likelihood training naturally suppresses outlier reconstruction by enforcing normalization.
- uses **on-manifold initialization (OMI)**, which initializes the MCMC chain on the decoder-defined manifold of an autoencoder.

### Contribution

1. Novel generative model constructed from an autoencoder
2. OMI, a sampling strategy tailored for NAE;
3. NAE is highly effective for outlier detection and can perform other generative tasks

## Related Works


    ###  Several attempts to formulate a probabilistic model from an autoencoder

    - **VAE**
        - uses a latent variable model by introducing a prior distribution $p(z)$
    - **GPND(Pidhorskyi et al., 2018)**
        - models probability density by factorizing into on- and off-manifold components

    **⇒ requires a precise prior distribution**

    - **M-flow(Brehmer & Cranmer, 2020)**
        - defines a probability density on the decoder manifold

    ⇒ does not assign a likelihood to off-manifold data

    - **DAE(Denoising Autoencoder)**
        - models a density by learning the gradient of log-density
    - **MemAE(Gong et al., 2019)**
        - memorizes training data to prevent outlier reconstruction

    **⇒ model’s generalization ability is also limited**


    ### Autoencoder using energy

    - EBGAN(Zhao et al., 2016)

    ⇒ does not utilize Gibbs distribution formulation to model a distribution

    - DSEBM(Zhao et al., 2016)
        - reconstruction is interpreted as the gradient of log-density

## Methods


### NAE

- normalized **probabilistic model** defined from an **autoencoder**
- The probability density of NAE $p_θ(x)$ is defined as a Gibbs distribution (Eq. (4))


$$
E_\theta(\mathbf{x}) = l_\theta(\mathbf{x}) \\
p_\theta(\mathbf{x})=\frac{1}{\Omega_\theta} \exp \left(-l_\theta(\mathbf{x}) / T\right)
$$



NAE is trained to maximize the likelihood of data



$$
\mathbb{E}_{\mathbf{x} \sim p(\mathbf{x})}\left[- \log p_\theta(\mathbf{x})\right] =  \mathbb{E}_{\mathbf{x} \sim p(\mathbf{x})}\left[l_\theta(\mathbf{x})\right] / T+ \log \Omega_\theta
$$



The gradient for the negative log-likelihood



$$
\mathbb{E}_{\mathbf{x} \sim p(\mathbf{x})}\left[-\nabla_\theta \log p_\theta(\mathbf{x})\right] =  \mathbb{E}_{\mathbf{x} \sim p(\mathbf{x})}\left[\nabla_\theta l_\theta(\mathbf{x})\right] / T-\mathbb{E}_{\mathbf{x}^{\prime} \sim p_\theta(\mathbf{x})}\left[\nabla_\theta l\left(\mathbf{x}^{\prime}\right)\right] / T
$$



> 💡 each gradient step **decreases** the reconstruction error of training data $\mathbf{x}$,   
> while **increasing** the reconstruction error of negative samples $\mathbf{x}'$′ generated from $p_θ(x)$.



$$
L 
= \underbrace{L_{AE} + L_{reg}}_{\text{Conventional AE}}
= \underbrace{L_{AE} + T\,\log \Omega_{\theta}}_{\text{NAE}}
$$



⇒ Normalization as Regularization


### Suppression of Outlier Reconstruction

- When sampling is successful, **negative samples may lie in high-density regions of** $p_θ(x)$**, where the reconstruction error is low**

⇒ The gradient of the negative log-likelihood increases the reconstruction loss of negative samples


## How to get negative sample? 

- **MCMC**

⇒ is computationally expensive

- **Constrastive Divergence  (CD-k; Hinton (2002))**
    - first initializing a Markov chain of MCMC **at a training data point**
    - then proceeding k steps(=1)

⇒ is not able to suppress a **spuriously high mode** in the model density $p_θ(x)$

- **Persistent CD (PCD; Tieleman (2008))**
    - negative sample generated from MCMC in the **previous training iteration (no restart)**

⇒ highly correlated to each other in mini-batch only cover a subset of density modes

- **PCD restart (Du & Mordatch, 2019; Grathwohl et al., 2020)**
    - sample from the **noise distribution** $p_0(\mathbf{x})$ with a small probability

⇒ simply learns a **flow** that maps $p_0(\mathbf{x})$ to $p(x)$


    ![](/assets/seminars/autoencoding-under-normalization-constraints-pmlr-2021/3.png)


### **On-manifold Initialization(OMI)**

- **initialize** a MCMC chain from a **high-density region of** $p_θ(\mathbf{x})$
- well-trained autoencoder, a point with high $p_θ(\mathbf{x})$, will lie near the **decoder manifold**
- **Not all points** in decoder manifold have high $p_θ(\mathbf{x})$

> 💡 Finding a good $\mathbf{z}$ that produces a high quality $\mathbf{x}$


![](/assets/seminars/autoencoding-under-normalization-constraints-pmlr-2021/4.png)


⇒ Using energy based model, we run a **preliminary MCMC** (=latent chain) in the latent space Z



$$
\begin{aligned}q_\theta(\mathbf{z}) & =\frac{1}{\Psi_\theta} \exp \left(-H_\theta(\mathbf{z}) / T_{\mathbf{z}}\right) \\H_\theta(\mathbf{z}) & =E_\theta\left(f_d(\mathbf{z})\right)\end{aligned}
$$



Latent-space Langevin dynamics: move $\mathbf{z}$ in the direction that lowers $H_\theta(\mathbf{z})$



$$
\mathbf{z}_{t+1}=\mathbf{z}_t+\lambda_{\mathbf{z}} \nabla_{\mathbf{z}} \log q_\theta\left(\mathbf{z}_t\right)+\sigma_{\mathbf{z}} \epsilon_t,
$$



## Experiments


### 2D Density Estimation


![](/assets/seminars/autoencoding-under-normalization-constraints-pmlr-2021/5.png)

- An autoencoder **assigns high densities on regions between Gaussian modes**
- For the overcomplete case, autoencoder almost becomes the identity map

### Outlier Detection

- is trained only using **inlier data**
- discriminate **outliers from inliers** during test phase
- **One class** is set as the **outlier** class and **the rest as the inlier class**

![](/assets/seminars/autoencoding-under-normalization-constraints-pmlr-2021/6.png)


![](/assets/seminars/autoencoding-under-normalization-constraints-pmlr-2021/7.png)


### OOD Detection

- The samples from **different datasets** are used as the **outlier class**

![](/assets/seminars/autoencoding-under-normalization-constraints-pmlr-2021/8.png)


![](/assets/seminars/autoencoding-under-normalization-constraints-pmlr-2021/9.png)


## Conclusion

- novel interpretation of the reconstruction error as an energy function
- shows impressive OOD detection performance

**Key differences from conventional energy-based models (EBMs)**

- naturally incorporate the manifold hypothesis into a model (autoencoder)
- can be pre-trained as a conventional autoencoder
- by using OMI, leads to a more accurate density estimate

### Demo



[📄 자료 ↗](https://swyoon.github.io/outlier-reconstruction/)



# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
