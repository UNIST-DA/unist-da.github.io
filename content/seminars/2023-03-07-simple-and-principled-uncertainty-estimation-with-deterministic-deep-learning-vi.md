---
date: 2023-03-07
title: Simple and Principled Uncertainty Estimation with Deterministic Deep Learning via Distance Awareness (NeurIPS 2020)
category: Paper Review
presenter: SeungSu Kam
url: https://www.notion.so/e6456123f01840a7b13250e9b5521805
keywords: DeepLearning, Uncertainty Estimation
---

# Selected Paper


## Title: Simple and Principled Uncertainty Estimation with Deterministic Deep Learning via Distance Awareness


Part of [Advances in Neural Information Processing Systems 33 (NeurIPS 2020)](https://proceedings.neurips.cc/paper/2020)


## Abstract: 


Bayesian neural networks (BNN) and deep ensembles are principled approaches to estimate the predictive uncertainty of a deep learning model. However their practicality in real-time, industrial-scale applications are limited due to their heavy memory and inference cost. This motivates us to study principled approaches to high-quality uncertainty estimation that require only a single deep neural network (DNN). By formalizing the uncertainty quantification as a minimax learning problem, we first identify input distance awareness, i.e., the model’s ability to quantify the distance of a testing example from the training data in the input space, as a necessary condition for a DNN to achieve high-quality (i.e., minimax optimal) uncertainty estimation. We then propose Spectral-normalized Neural Gaussian Process (SNGP), a simple method that improves the distance-awareness ability of modern DNNs, by adding a weight normalization step during training and replacing the output layer. On a suite of vision and language understanding tasks and on modern architectures (Wide-ResNet and BERT), SNGP is competitive with deep ensembles in prediction, calibration and out-of-domain detection, and outperforms the other single-model approaches.

- 딥러닝 방법에서 기존 방법들(MC-Dropout, Ensemble)보다 빠르고 정확한 predictive uncertainty을 추정하는 방법 제안
- Predictive uncertainty을 minimax learninig problem으로 정량화하여 input distance awareness 정의
- 단일 심층 신경망에 간단한 방법(=SNGP(Spectral-normalized Neural Gaussian Process))를 도입함으로써 빠르고 정확한 예측과 OOD 탐지 구현

## Link



[📄 자료 링크 ↗](https://proceedings.neurips.cc/paper/2020/hash/543e83748234f7cbab21aa0ade66565f-Abstract.html)



# Paper Review


## Preliminary


### Uncertainty Estimation

- Estimate indicators of how confident about predictions

### Minimax

- Decision Rules to Minimize Worst-Case Losses

### Gaussian Process

- **Gaussian process**  is a stochastic process  (a collection of random variables indexed by time or space), such that every finite collection of those random variables has a multivariate normal distribution.


$$
f(\mathbf{x}) \sim \mathcal{G P}\left(\mu(\mathbf{x}), k\left(\mathbf{x}, \mathbf{x}^{\prime}\right)\right)
$$



## Introduction


![](/assets/seminars/simple-and-principled-uncertainty-estimation-with-deterministic-deep-learning-vi/0.png)

- In real-world applications (ie. object recognition in autonomous driving, domain-specific chatbot service, it is important to bulid efficient methods that reliably quantify a deep neural network (DNN)’s predictive uncertainty.
- When OOD data inputs model then performance can be arbitrarily bad.
- Motivate methods that are aware of the distance between an input test example and previously seen training examples, so they can return a uniform distribution over output labels if the input is too far from the training set.

**⇒ Gaussian Process**


But it is usually necessary to perform some form of **feature extraction** or **dimensionality reduction** using a DNN in **high-dimensional machine learning problem**


**Ideally, the hidden representation of a DNN should reflect a meaningful distance in the data manifold, this is often not guaranteed for common deep learning models.**


Propose simple solution: 

- Adding _spectral normalization_ to the weights in each (residual) layer

⇒ “distance aware” property is preserved

- Change output layer into Gaussian Process using Laplace approximation to the random feature expansion of the GP

⇒ model posterior that can be learned scalably and in closed-form


# **Distance Awareness**


**Notation**

- Data-generation distribution $p^*(y \mid \mathbf{x})$ where $y \in$\{1, \ldots, K\}$ is the space of $K$-class labels,$\mathbf{x} \in \mathscr{X} \subset \mathbb{R}^d$ is the input data manifold equipped
- The full data-generating distribution


$$
p^*(y \mid \mathbf{x})= p^*\left(y, \mathbf{x} \in \mathscr{X}_{\text {IND }} \mid \mathbf{x}\right) \quad+\quad p^*\left(y, \mathbf{x} \notin \mathscr{X}_{\text {IND }} \mid \mathbf{x}\right) \\=p^*\left(y \mid \mathbf{x}, \mathbf{x} \in \mathscr{X}_{\mathrm{IND}}\right) * p^*\left(\mathbf{x} \in \mathscr{X}_{\mathrm{IND}}\right)+p^*\left(y \mid \mathbf{x}, \mathbf{x} \notin \mathscr{X}_{\mathrm{IND}}\right) * p^*\left(\mathbf{x} \notin \mathscr{X}_{\mathrm{IND}}\right)
$$



the model only learns the in-domain distribution, so does not have knowledge about out-of-distribution. 


⇒ **However, during testing, the model needs to construct a predictive distribution p(y|x) for the entire input space.**


## Uncertainty Estimation as a Minimax Learning Problem


To formulate the uncertainty estimation as a learning problem under **p*(y|x)**, we need to define a loss function to measure a model p(y|x)’s quality of predictive uncertainty.

- Expected Calibration Error (ECE)
    - $C(p, p^*)=E\left[\left|E\left(y^*=\hat{y} \mid \hat{p}=p\right)-p\right|\right]$
    - measures the difference in expectation between the model’s predictive confidence (e.g., the maximum probability score) and its actual accuracy

⇒ECE is not suitable as a loss function, since it is not uniquely minimized at p = p*

- Proper scoring rules
    - uniquely minimized by the true distribution p = p*
    - Proper scoring rules are related to ECE in that it is an upper bound of the calibration error by the classic calibration-refinement decomposition
    - so, minimizing a proper scoring rule implies minimizing the calibration error of the model
    - $\inf _{p \in \mathscr{P}} S\left(p, p^*\right)=\inf _{p \in \mathscr{P}} E_{\mathbf{x} \in \mathscr{X}}\left[s\left(p, p^* \mid \mathbf{x}\right)\right]$
    - s = log-loss and Brier score

⇒ Directly minimizing Uncertainty Risk Minimization problem  over the entire input space X is not possible even with infinite amounts of data. Because of OOD data which is not learned by the model and  p* IND, p* OOD are not assumed to similar.

- Minimax Uncertainty Risk:
    - minimize the worst-case risk with respect to all possible p* ∈ $\mathscr{P}^*$
    - $\inf _{p \in \mathscr{P}}\left[\sup _{p^* \in \mathscr{P}^*} S\left(p, p^*\right)\right]$
- Solution to the minimax problem
    - $p(y \mid \mathbf{x})=p\left(y \mid \mathbf{x}, \mathbf{x} \in \mathscr{X}_{\text {IND }}\right) * p^*\left(\mathbf{x} \in \mathscr{X}_{\mathrm{IND}}\right)+p_{\text {uniform }}\left(y \mid \mathbf{x}, \mathbf{x} \notin \mathscr{X}_{\mathrm{IND}}\right) * p^*\left(\mathbf{x} \notin \mathscr{X}_{\mathrm{IND}}\right)$
    - if an input point is in the training data domain, trust the model, otherwise use a uniform prediction
    - In light of Equation, a key capacity for a deep learning model to reliably estimate predictive uncertainty is its ability to quantify, either explicitly or implicitly, the domain probability $p(x ∈ X_{IND})$

## Input Distance Awareness as a Necessary Condition


![](/assets/seminars/simple-and-principled-uncertainty-estimation-with-deterministic-deep-learning-vi/1.png)


⇒ A classic model that satisfies the _distance-awareness_ property is a Gaussian process (GP) with a radial basis function (RBF) kernel.


GP predictive uncertainty can be expressed by the posterior variance  
$u(\mathbf{x}^*)=\operatorname{var}(g(\mathbf{x}^*))=1-\mathbf{k}^{* \top} \mathbf{V} \mathbf{k}^*$ _for_ $\mathbf{k}_i^*=\exp \left(-\frac{1}{2 l}\left\|\mathbf{x}^\mathbf{x}_i\right\|X^2\right)$ _and_ $\mathbf{V}_{N \times N}$ _a fixed matrix determined by data. Then_ $u(\mathbf{x}^*)$ increases as  $\mathbf{x}^*$ moves further away from $X_{IND}$.


⇒ However, this property is not guaranteed for a typical deep learning model


model computes confidence for a $\mathbf{x}^*$ **based not on its distance from the training data** $X_{IND}$**,** but **based on its distance from the decision boundaries**


![](/assets/seminars/simple-and-principled-uncertainty-estimation-with-deterministic-deep-learning-vi/2.png)


## **Two Conditions for Input Distance Awareness in Deep Learning**



DNN $\operatorname{logit}(\mathbf{x})=g \circ h(\mathbf{x})$ can be made input distance aware via a combination of two conditions:

1. Make the output layer $g$ distance aware, so it outputs an uncertainty metric reflecting distance in the hidden space $\left\|h(\mathbf{x})-h\left(\mathbf{x}^{\prime}\right)\right\|_H$ (in practice, this can be achieved by using a GP with a shift-invariant kernel as the output layer)
2. Make the hidden mapping distance preserving, so that the distance in the hidden space $\left\|h(\mathbf{x})-h\left(\mathbf{x}^{\prime}\right)\right\|_H$ has a meaningful correspondence to the distance $\left\|\mathbf{x}-\mathbf{x}^{\prime}\right\|_X$ in the data manifold.

# Proposed method


## SNGP (A Simple Approach to Distance-aware Deep Learning)


_Spectral-normalized Neural Gaussian Process (SNGP)_

- **making the output layer** _**distance aware**_
- **making the hidden layers** _**distance preserving**_

### **Distance-aware Output Layer via Laplace-approximated Neural Gaussian Process**

- SNGP replaces the typical dense output layer with a Gaussian process (GP) with an RBF kernel, whose posterior variance at $x^∗$ is characterized by its _L_2  distance from the training data in the hidden space
- given $N$ training samples $\mathscr{D}=$\left\{y_i, \mathbf{x}i\right\}_{i=1}^N$
- denoting $h_i=h\left(\mathbf{x}_i\right)$_,_
- _the Gaussian-process output layer_ $g{N \times 1}=\left[g\left(h_1\right), \ldots, g\left(h_N\right)\right]^{\top}$ follows a multivariate normal distribution a priori:


$$
g_{N \times 1} \sim M V N\left(\mathbf{0}_{N \times 1}, \mathbf{K}_{N \times N}\right) \text {, where } \mathbf{K}_{i, j}=\exp \left(-\left\|h_i-h_j\right\|_2^2 / 2\right) \text {, }
$$



**Computing the exact Gaussian process posterior for a large-scale classification task is
both analytically intractable and computationally expensive.**


⇒ Using **Laplace approximation** to the random Fourier feature (RFF) expansion of the GP posterior


This approach makes closed-form posterior that is end-to-end trainable with the rest of the neural network, and empirically leads to an improved quality in estimating the posterior uncertainty.


**Deploying a low-rank approximation to the kernel matrix** $K = ΦΦ^T$ **using random features**



$$
g_{N \times 1} \sim M V N\left(\mathbf{0}_{N \times 1}, \Phi \Phi_{N \times N}^{\top}\right),\\ \quad where \quad \Phi_{i, D_L \times 1}=\sqrt{2 / D_L} * \cos \left(-\mathbf{W}_L h_i+\mathbf{b}_L\right)
$$



where $h_i=h\left(\mathbf{x}_i\right)$ _is the hidden representation in the penultimate layer with dimension_ $D_{L-1} $. 


$\Phi_i$ is the final layer with dimension $D_L$, 


it contains $\mathbf{W}_{L, D_L \times D_{L-1}}$ a fixed weight matrix whose entries are sampled i.i.d. from $N(0,1)$


$\mathbf{b}_{L, D_L \times 1}$ a fixed bias term whose entries are sampled i.i.d. from $\operatorname{Uniform}(0,2 \pi)$. 


As a result, for the $k^{t h}$ logit, the **RFF approximation to the GP prior** can be written as a neural network layer with fixed hidden weights $\mathbf{W}$ and learnable output weights $\beta_k$ :



$$
g_k\left(h_i\right)=\sqrt{2 / D_L} * \cos \left(-\mathbf{W}_L h_i+\mathbf{b}_L\right)^{\top} \beta_k, \quad \\ with \ prior \quad \beta_{k, D_L \times 1} \sim N\left(0, \mathbf{I}_{D_L \times D_L}\right)
$$



conditional on $h, \beta=\left\{\beta_k\right\}_{k=1}^k$ is the only learnable parameter in the model.


we choose the Laplace method due to its simplicity and the fact that its posterior variance has a convenient closed form.


 Laplace posterior for GP under the RFF approximation is



$$
\beta_k \mid \mathscr{D} \sim M V N\left(\hat{\beta}_k, \hat{\Sigma}_k\right), \\ where \quad \hat{\Sigma}_k^{-1}=\mathbf{I}+\sum_{i=1}^N \hat{p}_{i, k}\left(1-\hat{p}_{i, k}\right) \Phi_i \Phi_i^{\top}.
$$



### Distance-preserving Hidden Mapping via Spectral Normalization


Modern deep learning models (e.g., ResNets, Transformers) are commonly composed of residual blocks, i.e., $h(\mathbf{x})=h_{L-1} \circ \cdots \circ h_2 \circ h_1(\mathbf{x})$ where $h_l(\mathbf{x})=\mathbf{x}+g_l(\mathbf{x})$.


![](/assets/seminars/simple-and-principled-uncertainty-estimation-with-deterministic-deep-learning-vi/3.png)


 Simple method to ensure $h$ is distance preserving


: by bounding the Lipschitz constants of all nonlinear residual mappings $\left\{g_l\right\}_{l=1}^{L-1}$ to be less than 1 


![](/assets/seminars/simple-and-principled-uncertainty-estimation-with-deterministic-deep-learning-vi/4.png)


upper Lipschitz bound:


robustness of a deep network, which prevents the hidden representations _h_(**x**) from being overly sensitive to the semantically meaningless perturbations in the pixel space.


the lower Lipschitz bound:


prevents the hidden representation from being unnecessarily invariant to the semantically meaningful changes in the input manifold


Consequently, to ensure the hidden mapping $h$ is distance preserving, it is sufficient to ensure that the weight matrices for the nonlinear residual block $g_l(\mathbf{x})=\sigma\left(\mathbf{W}_l \mathbf{x}+\mathbf{b}l\right)$ _to have spectral norm (i.e., the largest singular value) less than 1 ,_


Briefly, at every training step, the SN method first estimate the spectral norm $\hat{\lambda} \approx\left\|\mathbf{W}_l\right\|_2$ using the power iteration method , and then normalizes the weights as:



$$
\mathbf{W}_l= \begin{cases}c * \mathbf{W}_l / \hat{\lambda} & \text { if } c<\hat{\lambda} \\ \mathbf{W}_l & \text { otherwise }\end{cases}
$$



where c is hyperparameter used to adjust the exact spectral norm upper bound on $||W_{l}||_2$


![](/assets/seminars/simple-and-principled-uncertainty-estimation-with-deterministic-deep-learning-vi/5.png)


# Experiments & Results


## Competing Methods


![](/assets/seminars/simple-and-principled-uncertainty-estimation-with-deterministic-deep-learning-vi/6.png)


## (i) Train CIFAR-10 and CIFAR-100 Test Clean CIFAR, Corrupted CIFAR-C, OOD SVHN, CIFAR-100, CIFAR-10


![](/assets/seminars/simple-and-principled-uncertainty-estimation-with-deterministic-deep-learning-vi/7.png)


![](/assets/seminars/simple-and-principled-uncertainty-estimation-with-deterministic-deep-learning-vi/8.png)


## (ii) Detecting Out-of-Scope Intent in Conversational Language Understanding


![](/assets/seminars/simple-and-principled-uncertainty-estimation-with-deterministic-deep-learning-vi/9.png)


# Conclusion

- We propose SNGP, a simple approach to improve a single deterministic DNN’s ability in predictive uncertainty estimation, only adding spectral normalization to the hidden mapping, and replacing the dense output layer with a random feature layer that approximates a GP
- We theoretically motivate _input distance awareness_, the key design principle behind SNGP, via a learning-theoretic analysis of the uncertainty estimation problem.
- On a suite of vision and language understanding tasks and on modern architectures (ResNet and BERT), SNGP is competitive with a deep ensemble in prediction, calibration and out-of-domain detection, and outperforms other single-model approaches.

# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.


![](/assets/seminars/simple-and-principled-uncertainty-estimation-with-deterministic-deep-learning-vi/10.png)
