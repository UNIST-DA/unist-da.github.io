---
date: 2023-07-28
title: SWAD: Domain Generalization by Seeking Flat Minima (NeurIPS 2021)
category: Paper Review
presenter: Byungkook Koo
url: https://www.notion.so/cc8ceca546ec49bb87d3bcf99db31c7e
keywords: Domain Generalization, optimization
---

## Link



[📄 자료 링크 ↗](https://proceedings.neurips.cc/paper_files/paper/2021/hash/bcb41ccdc4363c6848a1d760f26c28a0-Abstract.html)



## Abstract


Domain generalization (DG) methods aim to achieve generalizability to an unseen target domain by using only training data from the source domains. Although a variety of DG methods have been proposed, a recent study shows that under a fair evaluation protocol, called DomainBed, the simple empirical risk minimization (ERM) approach works comparable to or even outperforms previous methods. Unfortunately, simply **solving ERM on a complex, non-convex** loss function can easily lead to **sub-optimal generalizability** by seeking **sharp minima**. In this paper, we theoretically show that finding flat minima results in a smaller domain generalization gap. We also propose a simple yet effective method, named _**Stochastic Weight Averaging Densely (SWAD)**_, to find flat minima. SWAD finds flatter minima and suffers less from overfitting than does the vanilla SWA by a dense and overfit-aware stochastic weight sampling strategy. SWAD shows state-of-the-art performances on five DG benchmarks, namely PACS, VLCS, OfficeHome, TerraIncognita, and DomainNet, with consistent and large margins of +1.6% averagely on out-of-domain accuracy. We also compare SWAD with conventional generalization methods, such as data augmentation and consistency regularization methods, to verify that the remarkable performance improvements are originated from by seeking flat minima, not from better in-domain generalizability. Last but not least, SWAD is **readily adaptable to existing DG methods** without modification; the combination of SWAD and an existing DG method further improves DG performances.


### 4-line Summary

- 기존 ERM은 복잡하고, non-convex loss에서 sub-optimal generalizability를 가짐(sharp minima)
- Flat minima를 찾는 것으로 Domain Generalization task에서 성능 향상을 이룰 수 있음
- SWA flat-minima solver와 overfit-aware logic을 결합한 SWAD를 제안함
- SWAD만 사용해도 SOTA 달성이 가능하며, 기존 DG approach와 결합하여 더더욱 성능 향상이 가능함

## Introduction

- Independent and identically distributed (**i.i.d**.) condition may not hold in real-world scenarios
    - Training and the test data distribution may differ significantly by _**distribution shifts**_.
    - Adverse weather, day-to-night shifts, texture, and so on

        → Practical system should require _**generalizability**_ to distribution shift

- Domain generalization (DG) aims to learn a robust model to domain shift

![Domain Generalization](/assets/seminars/swad-domain-generalization-by-seeking-flat-minima-neurips-2021/0.png)


![previous SOTAs](/assets/seminars/swad-domain-generalization-by-seeking-flat-minima-neurips-2021/1.png)


→ Simple empirical risk minimization (ERM) approach works comparably or even outperforms the previous attempts(Domainbed)

- Minimizing the empirical loss on a complex and non-convex loss landscape is typically not sufficient to arrive at a good generalization
    - Seeking flat minima will lead to robustness against the loss landscape shift between training and test datasets(SWA)
- Introduce a ‘_dense and overfit-aware stochastic weight sampling strategy_’ based on theoretical observation
    - Formulate a robust risk minimization (RRM) problem
    - Theoretically show that the generalization gap of DG is upper bounded by RRM
- Proposed Stochastic Weight Averaging Densely (SWAD) finds flatter minima than the vanilla SWA does, resulting in **better generalization to unseen domains**

### Contribution

- Introducing flatness into DG, and showing remarkably outperforming performances against existing DG methods
- **Combining** SWAD and previous SOTA, we even achieve 0.4pp improvements against the vanilla SWAD results
- Show that **flatness-aware method**s are only effective methods to both in-domain and out-of-domain generalization

## A Theoretical Relationship between Flatness and Domain Generalization


Notation

- Source domain $\mathcal{D}:=\left\{\mathcal{D}_{i}\right\}_{i}^{I}$ consisting of $\left(x_{j}^{i}, y_{j}^{i}\right)_{j=1}^{n} \sim \mathcal{D}_{i}$
- Target domain $\mathcal{T}:=\left\{\mathcal{T}_{i}\right\}_{i}^{T}$
- loss $\ell: \mathcal{Y} \times \mathcal{Y} \rightarrow[0, c]$ such that  $\ell\left(y_{1}, y_{2}\right)=0 \iff (y_{1}=y_{2})$
- model parameter $\theta$

Empirical risk



$$
\hat{\mathcal{E}}_{\mathcal{D}}(\theta):=\frac{1}{I n} \sum_{i=1}^{I} \sum_{j=1}^{n} \ell\left(f\left(x^{i} ; \theta\right), y^{i}\right)
$$



Robust empirical risk



$$
\hat{\mathcal{E}}_{\mathcal{D}}^{\gamma}(\theta):=\max _{\|\Delta\| \leq \gamma} \hat{\mathcal{E}}_{\mathcal{D}}(\theta+\Delta)
$$



![relationship b/w empirical & robust risk](/assets/seminars/swad-domain-generalization-by-seeking-flat-minima-neurips-2021/2.png)


![loss surface / neighborhoods of params. with radius r = blue ball](/assets/seminars/swad-domain-generalization-by-seeking-flat-minima-neurips-2021/3.png)


**Theorem 1** (minimizing robust empirical loss → generalization performances in test domain)

- $ \operatorname{diam}(\Theta):=\sup _{\theta, \theta^{\prime} \in \Theta}\left\|\theta-\theta^{\prime}\right\|_{2}, N:=\left\lceil(\operatorname{diam}(\Theta) / \gamma)^{d}\right\rceil$


$$
\mathcal{E}_{\mathcal{T}}(\theta)<\hat{\mathcal{E}}_{\mathcal{D}}^{\gamma}(\theta)+\frac{1}{2 I} \sum_{i=1}^{I} \operatorname{Div}\left(\mathcal{D}_{i}, \mathcal{T}\right)+\max _{k \in[1, N]} \sqrt{\frac{v_{k} \ln \left(m / v_{k}\right)+\ln (N / \delta)}{m}}
$$



**Theorem 2 (**minimizing robust empirical loss → DG gap**)**

    - Optimal solution of the RRM)  $\hat{\theta}^{\gamma}:=\arg \min _{\theta}\hat{\mathcal{E}}_{\mathcal{D}}^{\gamma}(\theta)$


$$
\begin{aligned}\mathcal{E}_{\mathcal{T}}\left(\hat{\theta}^{\gamma}\right)-\min _{\theta^{\prime}} \mathcal{E}_{\mathcal{T}}\left(\theta^{\prime}\right) \leq & \hat{\mathcal{E}}_{\mathcal{D}}^{\gamma}\left(\hat{\theta}^{\gamma}\right)-\min _{\theta^{\prime \prime}} \hat{\mathcal{E}}_{\mathcal{D}}\left(\theta^{\prime \prime}\right)+\frac{1}{I} \sum_{i=1}^{I} \operatorname{Div}\left(\mathcal{D}_{i}, \mathcal{T}\right) \\& +\max _{k \in[1, N]} \sqrt{\frac{v_{k} \ln \left(m / v_{k}\right)+\ln (2 N / \delta)}{m}}+\sqrt{\frac{v \ln (m / v)+\ln (2 / \delta)}{m}}\end{aligned}
$$


- Choose a proper γ, the optimal solution of the RRM will find a point near a flat optimum of ERM

⇒ seeking **flatter minima** will lead to a better domain generalization gap.


## SWAD: Domain Generalization by Seeking Flat Minima


### A baseline method: stochastic weight averaging

- Stochastic Weight Averaging (SWA) is a widely used flatness-aware solver
- It simply samples and averages several weights after the model is converged
- They empirically showed that SWA finds flatter minima than SGD

![](/assets/seminars/swad-domain-generalization-by-seeking-flat-minima-neurips-2021/4.png)


![](/assets/seminars/swad-domain-generalization-by-seeking-flat-minima-neurips-2021/5.png)


### Dense and overfit-aware stochastic weight sampling strategy


![](/assets/seminars/swad-domain-generalization-by-seeking-flat-minima-neurips-2021/6.png)


**Dense sampling strategy**

- SWA averages a few weights by sampling for every K epochs, results in an inaccurate approximation of flat minima
- Common DG benchmark protocol uses relatively **small training epochs**

⇒ Need to gather sufficiently enough stochastic weights


**Overfit-aware sampling scheduling**

- ERM approach is rapidly reached to a local optimum only within a few epochs, and easily suffers from the overfitting issue(relatively in small-scale dataset)
- Directly applying the vanilla SWA will suffer from the overfitting issue by **averaging sub-optimal solutions**

⇒ Need to omit the sub-optimal solutions for SWA


**In SWAD…**

- Dense strategy samples weights from every iteration, instead of K epochs interval
    - Range: [iter. at local optimum, iter. ends]
- Overfit-aware strategy stops sampling before overfitting
    - Threshold: local optimum * [1.2, 1.3]

### Empirical analysis of SWAD and flatness


**Local flatness analysis**

- Empirically investigate local flatness of solutions from flatness-aware solvers
- Local flatness: $\mathcal{F}_{\gamma}(\theta)=\mathbb{E}_{\left\|\theta^{\prime}\right\|=\|\theta\|+\gamma}\left[\mathcal{E}\left(\theta^{\prime}\right)-\mathcal{E}(\theta)\right]$

    → Flat minima will have smaller changes of loss value within its neighborhoods than sharp
    minima

- Results are summarized as follows: SWAD > SWA > SAM > ERM

![Average train flatness / Average test flatness](/assets/seminars/swad-domain-generalization-by-seeking-flat-minima-neurips-2021/7.png)


**Loss surface visualization** 


![Cross mark: averaged point of three weights(2500, 3500, 4500 iter. during training)](/assets/seminars/swad-domain-generalization-by-seeking-flat-minima-neurips-2021/8.png)

- Averaged weight is located in a flatter region
- Averaged weight is more robust to domain shift than stochastic weight

## Experiments


### Comparison with domain generalization methods

- Compare SWAD in fair comparison protocol, DomainBed

![Performance comparison / metric: Out-of-domain accuracies for each domain and their average](/assets/seminars/swad-domain-generalization-by-seeking-flat-minima-neurips-2021/9.png)


### Comparison with conventional generalization methods

- Conventional generalization methods usually do not work well for out-of-domain generalization

![Comparison between generalization methods on PACS](/assets/seminars/swad-domain-generalization-by-seeking-flat-minima-neurips-2021/10.png)


### Combinations with other methods

- SWAD does not need any modification on training objectives or model architecture
    - **Universally applicable** to any other methods
- **CORAL + SWAD** show the best performances with both incorporating different advantages of utilizing domain labels and seeking flat minima

![Combination of SWAD and other methods](/assets/seminars/swad-domain-generalization-by-seeking-flat-minima-neurips-2021/11.png)


### Ablation study


![](/assets/seminars/swad-domain-generalization-by-seeking-flat-minima-neurips-2021/12.png)

- SWAD improves both in-domain and out-of-domain performances
- ablating dense or overfit-aware sampling strategy
    - in-domain performance drop is subtle
    - out-of-domain performance drop is relatively large

### Exploring the other applications: ImageNet robustness


![](/assets/seminars/swad-domain-generalization-by-seeking-flat-minima-neurips-2021/13.png)

- ImageNet-C: measures the robustness against common corruptions
- BGC: manipulates images by combining the foregrounds and backgrounds, and measures whether the model predicts a **consistent prediction** with any manipulated image
- ImageNet-R: collects very different domain images of ImageNet

## Limitations

- Confidence error in Theorem 1

    **Theorem 1** (minimizing robust empirical loss → generalization performances in test domain)


    
$$
\mathcal{E}_{\mathcal{T}}(\theta)<\hat{\mathcal{E}}_{\mathcal{D}}^{\gamma}(\theta)+\frac{1}{2 I} \sum_{i=1}^{I} \operatorname{Div}\left(\mathcal{D}_{i}, \mathcal{T}\right)+\max _{k \in[1, N]} \sqrt{\frac{v_{k} \ln \left(m / v_{k}\right)+\ln (N / \delta)}{m}}
$$
    

    - Confidence bound diverges to infinity when $\gamma$ goes to zero
    - Caused by the looseness of the union bound
- Not a perfect and theoretically guaranteed solver for flat minima, but a heuristic approximation with empirical benefits
    - Even if a better flatness-aware optimization method is proposed, our theoretical contribution still holds: **showing the relationship between flat minima and DG**
- Does not strongly utilize domain-specific information

    → if one can consider both flatness and domain discrepancy, better domain generalization can be achievable


## Conclusion

- Introduce the concept of flatness into domain generalization & propose SWAD to capture flatter minima
- SWAD achieves state-of-the-art performances with large margin
- Show even better results by minimizing both robust risk and domain divergence

### Appendix


![](/assets/seminars/swad-domain-generalization-by-seeking-flat-minima-neurips-2021/14.png)

- lemma proof 시, $\gamma / 2$로 radius를 정의하고 넘어감

    → 그래서, N 정의 시 diameter 기준으로 하는 것으로 추정됨


# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
