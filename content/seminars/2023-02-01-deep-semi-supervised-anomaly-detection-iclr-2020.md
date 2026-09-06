---
date: 2023-02-01
title: Deep Semi-Supervised Anomaly Detection (ICLR 2020)
category: Paper Review
presenter: SeungSu Kam
url: https://www.notion.so/57b52b9eac5540bca06ba1bbe2f51a91
keywords: Anomaly Detection, semi-supervised learning
---

# Selected Paper


## Title: Deep Semi-Supervised Anomaly Detection


**Ruff, L., Vandermeulen, R. A., Görnitz, N., Binder, A., Müller, E., Müller, K. R., & Kloft, M, ICLR 2020**


## Abstract: 


Deep approaches to anomaly detection have recently shown promising results over shallow methods on large and complex datasets. Typically anomaly detection is treated as an unsupervised learning problem. In practice however, one may have— in addition to a large set of unlabeled samples—access to a small pool of labeled samples, e.g. a subset verified by some domain expert as being normal or anoma- lous. Semi-supervised approaches to anomaly detection aim to utilize such labeled samples, but most proposed methods are limited to merely including labeled nor- mal samples. Only a few methods take advantage of labeled anomalies, with ex- isting deep approaches being domain-specific. In this work we present _Deep SAD_, an end-to-end deep methodology for general semi-supervised anomaly detection. We further introduce an information-theoretic framework for deep anomaly detec- tion based on the idea that the entropy of the latent distribution for normal data should be lower than the entropy of the anomalous distribution, which can serve as a theoretical interpretation for our method. In extensive experiments on MNIST, Fashion-MNIST, and CIFAR-10, along with other anomaly detection benchmark datasets, we demonstrate that our method is on par or outperforms shallow, hy- brid, and deep competitors, yielding appreciable performance improvements even when provided with only little labeled data.


## Link



[📄 자료 링크 ↗](https://arxiv.org/abs/1906.02694)


- Introduce Deep SAD, a generalization of the unsupervised Deep SVDD method (Ruff et al., 2018) to the semi-supervised AD setting.
- Present an information-theoretic framework for deep AD, which can serve as an interpretation of our Deep SAD method and similar approaches.
- Conduct extensive experiments in which we establish experimental scenarios for the general semi-supervised AD problem where we also introduce novel baselines.

# Review


## Preliminary


### SVDD

- SVDD는 기존에 Kernel을 통해 Feature space에서 정상 데이터를 둘러싸는 중신 c인 가장 작은 구를 찾고, 해당 경계면을 기반으로 이상치 탐지하는 모델

![](/assets/seminars/deep-semi-supervised-anomaly-detection-iclr-2020/0.png)


### Deep SVDD

- Deep SVDD는 기존에 Kernel을 기반으로한 SVDD와는 다르게 딥러닝을 기반으로 Feature space를 학습
- 해당 Feature space에서 정상 데이터를 둘러싸는 최적의 구 Center 찾음
- 이후 해당 경계면을 기반으로 이상치를 탐지

Notation:


$ \emptyset(\cdot ; \boldsymbol{w})$ : neural network with $L$ hidden layers, $\boldsymbol{W}^{\ell}$: weight of $\ell^{\text {th }}$ hidden layer


![](/assets/seminars/deep-semi-supervised-anomaly-detection-iclr-2020/1.png)


### One-Class Deep SVDD



$$
\min_{\boldsymbol{W}} +\frac{1}{\boldsymbol{n}} \sum_i \left\{\left\|\emptyset\left(x_i ; \mathcal{W}\right)-c\right\|^2\right\}+\frac{\lambda}{2} \sum{\ell}\left\|\boldsymbol{W}^{\ell}\right\|_{\boldsymbol{F}}^2
$$


- 1st term: 구의 중심과 데이터 point 사이의 거리를 최소화
- 2nd term: weight decay regularizer

Objective 최적화를 통해 $W$는 각 데이터 point를 구의 중심 $c$에 가깝게 mapping 하도록 학습


### Entrophy

- Entropy is defined as the randomness or measuring the disorder of the information being processed in Machine Learning.

![](/assets/seminars/deep-semi-supervised-anomaly-detection-iclr-2020/2.png)



$$
\mathcal{H}(X)=\mathbb{E}[I(X)]=\mathbb{E}[-\log p(X)]=-\int p(x) \log p(x)
$$



where $I$ is information content which means a basic quantity derived from the probability
 of a particular event  occurring from a random variabe. $I(X) = -\log p(X)$


### Mutual Information

- Measure of the mutual dependence  between the two probability  variables.
- The bigger the dependency of the two probability variables, the bigger the amount of mutual information.


$$
\mathcal{I}(X; Y)=D_{K L}(p(x, y) \| p(x) p(y))
$$



# Introduction

- In AD Method
    - Typically AD methods attempt to learn a “compact” description of the data in an unsupervised manner assuming that most of the samples are normal
    - Shallow unsupervised AD methods often require manual feature engineering to be effective on high-dimensional data and are limited in their scalability to large datasets. 
    ⇒ Developing novel deep approaches to unsupervised AD
- In the standard unsupervised AD setting
    - In many real-world applications one may also have access to some verified normal or anomalous samples in addition to the unlabeled data
    ⇒ Semi-supervised AD problem
- There are two different AD settings
    - The use of labeled normal samples but not labeled anomalies
    - Utilize labeled anomalies with clustering assumption , however anomalies are not necessarily similar to one another.

⇒ Semi-supervised AD approaches must find a compact description of the normal class while also correctly discriminating the labeled anomalies


![](/assets/seminars/deep-semi-supervised-anomaly-detection-iclr-2020/3.png)


### AN INFORMATION-THEORETIC VIEW ON DEEP ANOMALY DETECTION

- _In Information Bottleneck principle_

Supervised deep learning seeks to minimize the mutual information $\mathcal{I}(X ; Z)$ between the input $X$ and the latent representation $Z$ while maximizing the mutual information $\mathcal{I}(Z ; Y)$ between $Z$ and the classification task $Y$,



$$
\min _{p(z \mid x)} \quad \mathcal{I}(X ; Z)-\alpha \mathcal{I}(Z ; Y)
$$



where $p(z\mid x)$ is modeled by a deep network and the hyperparameter $α$ > 0 controls the trade-off between compression (i.e., complexity) and classification accuracy.

- _In the Infomax principle_

In Unsupervised deep learning, the objective of Infomax is to maximize the mutual information $\mathcal{I}(X ; Z)$ between the data $X$ and its latent representation $Z$ :




$$
\max _{p(z \mid x)} \mathcal{I}(X ; Z)+\beta \mathcal{R}(Z)
$$




This is typically done under some additional constraint or regularization $\mathcal{R}(Z)$ on the representation $Z$ with hyperparameter $\beta>0$ to obtain statistical properties desired for some specific downstream task.


In Deep SAD build upon _Infomax principle_[ ](notion://www.notion.so/unistda/DEEP-SEMI-SUPERVISED-ANOMALY-DETECTION-21bc4bf678fa449e99d3cdc20d328377#_bookmark2)to motivate a deep method for general semi-supervised AD, where we include the label information _Y_ through a novel representation learning regularization objective $\mathcal{R}(Z) = \mathcal{R}(Z; Y )$ that is based on entropy.


# Methodology


## UNSUPERVISED DEEP SVDD AND ENTROPY MINIMIZATION

- Deep SVDD objective:


$$
\min _{\mathcal{W}} \frac{1}{n} \sum_{i=1}^n\left\|\phi\left(\boldsymbol{x}_i ; \mathcal{W}\right)-\boldsymbol{c}\right\|^2+\frac{\lambda}{2} \sum_{\ell=1}^L\left\|\boldsymbol{W}^{\ell}\right\|_F^2, \quad \lambda>0
$$


- Deep SVDD Score:


$$
s(\boldsymbol{x})=\|\phi(\boldsymbol{x} ; \mathcal{W})-\boldsymbol{c}\|
$$



**Deep SVDD may not only be interpreted in geometric terms as minimum volume estimation , but also in probabilistic terms as entropy minimization over the latent distribution.** 


For a latent random variable $Z$ with covariance $\Sigma$, $\operatorname{pdf} p(\boldsymbol{z})$, and support$ \mathcal{Z} \subseteq \mathbb{R}^d$, 




$$
\mathcal{H}(Z)=\mathbb{E}[-\log p(Z)]=-\int_{\mathcal{Z}} p(\boldsymbol{z}) \log p(\boldsymbol{z}) \mathrm{d} \boldsymbol{z} \leq \frac{1}{2} \log \left((2 \pi e)^d \operatorname{det} \Sigma\right),
$$





which holds with equality iff $Z$ is jointly Gaussian. Assuming the latent distribution $Z$ follows an isotropic Gaussian, $Z \sim N\left(\boldsymbol{\mu}, \sigma^2 I\right)$ with $\sigma>0$, we get




$$
\mathcal{H}(Z)=\frac{1}{2} \log \left((2 \pi e)^d \operatorname{det} \sigma^2 I\right)=\frac{1}{2} \log \left(\left(2 \pi e \sigma^2\right)^d \cdot 1\right)\\=\frac{d}{2}\left(1+\log \left(2 \pi \sigma^2\right)\right) \propto \log \sigma^2
$$



Deep SVDD objective is equivalent to minimizing the empirical variance and thus minimizes an upper bound on the entropy of a latent Gaussian.


⇒ We can interpret Deep SVDD as following the Infomax principle with the additional “compactness” objective that the latent distribution should have minimal entropy.


## Deep SAD

- $n$ unlabeled samples $\boldsymbol{x}_1, \ldots, \boldsymbol{x}_n \in \mathcal{X}$ with $\mathcal{X} \subseteq \mathbb{R}^D$,
- $m$ labeled samples $\left(\tilde{\boldsymbol{x}}_1, \tilde{y}_1\right), \ldots,\left(\tilde{\boldsymbol{x}}_m, \tilde{y}_m\right) \in \mathcal{X} \times \mathcal{Y}$
- $\mathcal{Y}=\{-1,+1\}$ where
- $\tilde{y}=+1$ denotes known normal samples
- $\tilde{y}=-1$ known anomalies.

**Define our Deep SAD objective as follows:**



$$
\min _{\mathcal{W}} \frac{1}{n+m} \sum_{i=1}^n\left\|\phi\left(\boldsymbol{x}_i ; \mathcal{W}\right)-\boldsymbol{c}\right\|^2+\frac{\eta}{n+m} \sum_{j=1}^m\left(\left\|\phi\left(\tilde{\boldsymbol{x}}_j ; \mathcal{W}\right)-\boldsymbol{c}\right\|^2\right)^{\tilde{y}_j}+\frac{\lambda}{2} \sum_{\ell=1}^L\left\|\boldsymbol{W}^{\ell}\right\|_F^2 .
$$



Hyperparameter _η >_ 0 which controls the balance between the labeled and the unlabeled term 

- _η >_ 1 puts more emphasis on the labeled data
- _η <_ 1 emphasizes the unlabeled data

Can express this interpretation in terms of Infomax principle with an entropy regularization objective on the latent distribution



$$
\max _{p(z \mid x)} \mathcal{I}(X ; Z)+\beta\left(\mathcal{H}\left(Z^{-}\right)-\mathcal{H}\left(Z^{+}\right)\right) .
$$



# Experiments & Results


## Competing Methods

- Shallow baselines
    - OC-SVM
    - SVDD with Gaussian kernel
- Deep baselines
    - SSAD RAW, Hybrid
    - Deep SVDD
    - Supervised model

## (i) Adding labeled anomalies

- **Increase** the ratio of **labeled training data** $γ_1$  = _m/_ (_n_ +_m_ ) by adding more and more **known anomalies** $ \tilde{x}_1, . . . , \tilde{x}_m$  with $\tilde{y}_j = -1$ to the training set.
- Training Data: Unlabeld (unpolluted), Labeld (anomalies one class)
- Test: 90 times(10 normal class X 9 anomaly class)

![](/assets/seminars/deep-semi-supervised-anomaly-detection-iclr-2020/4.png)


![](/assets/seminars/deep-semi-supervised-anomaly-detection-iclr-2020/5.png)

- In th

## (ii) Polluted training data


Test the **robustness** of the different methods to an increasing pollution ratio $γ_p$ of the **training set** with **unlabeled anomalies**

- Fix the ratio of labeled training samples at $γ_l$ = 0.05
- The detection performance of all methods decreases with increasing data pollution

![](/assets/seminars/deep-semi-supervised-anomaly-detection-iclr-2020/6.png)


![](/assets/seminars/deep-semi-supervised-anomaly-detection-iclr-2020/7.png)


## (iii) Number of known anomaly classes


**Increase** the **number of anomaly classes** $k_l$ included in the **labeled** part of the **training set**

- Fix the overall ratio of labeled training examples $γ_l $= 0.05
- Fit pollution ratio of $γ_p $= 0.1 for the unlabeled training data
- The more diverse the labeled anomalies in the training set, the better the detection performance becomes
- Supervised method is very sensitive to the number of anomaly classes

![](/assets/seminars/deep-semi-supervised-anomaly-detection-iclr-2020/8.png)


![](/assets/seminars/deep-semi-supervised-anomaly-detection-iclr-2020/9.png)


## SENSITIVITY ANALYSIS


Test the sensitivity of Deep SAD with respect to the hyperparameter $η $> 0

- Default, $γ_l $= 0.05, $γ_p$ = 0.1, and $k_l$ = 1
- Deep SAD is fairly robust against changes of the hyperparameter $η$

![](/assets/seminars/deep-semi-supervised-anomaly-detection-iclr-2020/10.png)


# Conclusion

- Our method is a generalization of the unsupervised Deep SVDD method (Ruff et al., 2018) to the semi-supervised setting.
- General semi- supervised anomaly detection should always be preferred whenever some labeled information on both normal samples or anomalies is available.
- Formulated an information-theoretic framework for deep anomaly detection based on the Infomax principle

# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
