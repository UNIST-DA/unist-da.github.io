---
date: 2025-05-30
title: ANOMALY TRANSFORMER: TIME SERIES ANOMALY DETECTION WITH ASSOCIATION DISCREPANCY (ICLR 2022 Spotlight)
category: Paper Review
presenter: SeungSu Kam
url: https://www.notion.so/1ff046396f7e80a091fad7ac557a98ac
keywords: Time-series anomaly detection, Transformer
---

# Selected Paper


## Title: ANOMALY TRANSFORMER: TIME SERIES ANOMALY DETECTION WITH ASSOCIATION DISCREPANCY (ICLR 2022 Spotlight)


## Abstract: 


Unsupervised detection of anomaly points in time series is a challenging problem, which requires the model to derive a distinguishable criterion. Previous methods tackle the problem mainly through learning pointwise representation or pairwise association, however, neither is sufficient to reason about the intricate dynamics. Recently, Transformers have shown great power in unified modeling of pointwise representation and pairwise association, and we find that the self-attention weight distribution of each time point can embody rich association with the whole series. Our key observation is that due to the rarity of anomalies, it is extremely difficult to build nontrivial associations from abnormal points to the whole series, thereby, the anomalies’ associations shall mainly concentrate on their adjacent time points. This adjacent-concentration bias implies an association-based criterion inherently distinguishable between normal and abnormal points, which we highlight through the Association Discrepancy. Technically, we propose the Anomaly Transformer with a new Anomaly-Attention mechanism to compute the association discrepancy. A minimax strategy is devised to amplify the normal-abnormal distinguishability of the association discrepancy. The Anomaly Transformer achieves state-of-theart results on six unsupervised time series anomaly detection benchmarks of three applications: service monitoring, space & earth exploration, and water treatment.

- 시계열 이상 탐지는 뚜렷한 이상 기준이 필요하지만, 기존의 pointwise 방식만으로는 복잡한 동역학을 설명하기 어려움
- 논문에서 제안하는 anomaly Transformer는 self-attention을 이용해 각 시점과 전체 시계열 간의 연관성을 학습하고, 이상 시점이 인접 시점에만 집중된다는 편향을 기반으로 **Association Discrepancy**를 정의하여 이상치를 탐지함
- Minimax 전략과 Anomaly-Attention 메커니즘을 통해 정상·이상 구분력을 강화하며, 6개의 비지도 벤치마크에서 state-of-the-art 성능을 달성함

## Link



[📄 자료 링크 ↗](https://arxiv.org/pdf/2110.02642)



[https://arxiv.org/pdf/2110.02642](https://arxiv.org/pdf/2110.02642)


# Paper Review


## What is time-series Anomaly Detection?


![](/assets/seminars/anomaly-transformer-time-series-anomaly-detection-with-association-discrepancy-i/0.png)


## Why Unsupervised Time-series Anomaly Detection?

- Real-world systems always work in a continuous way

Anomalies 

- are usually rare and
- hidden by vast normal points
- labeling costs is hard and expensive

**⇒ focus on time series anomaly detection under the unsupervised setting.**


### Unsupervised Time-series Anomaly Detection Limitation (Point-wise)

- is less informative for complex temporal patterns
- making anomalies less distinguishable ( dominated by normal time points)
- cannot provide a comprehensive description of the temporal context. (point by point**)**

**⇒ explicit association modeling can handle this!**


![](/assets/seminars/anomaly-transformer-time-series-anomaly-detection-with-association-discrepancy-i/1.png)


**Limitation**

- Clustering, Density Estimation:
    - do not consider the temporal information
    - are difficult to generalize to unseen real scenarios
- Subsequence
    - cannot capture the fine-grained temporal association between each time point and the whole series
- Graph:
    - single time point, which is insufficient for complex temporal patterns

## Methods


### Overall Architecture


![](/assets/seminars/anomaly-transformer-time-series-anomaly-detection-with-association-discrepancy-i/2.png)


![](/assets/seminars/anomaly-transformer-time-series-anomaly-detection-with-association-discrepancy-i/3.png)



$$
\begin{aligned}& \mathcal{Z}^l=\text { Layer-Norm }\left(\text { Anomaly-Attention }\left(\mathcal{X}^{l-1}\right)+\mathcal{X}^{l-1}\right) \\& \mathcal{X}^l=\text { Layer-Norm }\left(\text { Feed-Forward }\left(\mathcal{Z}^l\right)+\mathcal{Z}^l\right)\end{aligned}
$$



### Anomaly Attention


![](/assets/seminars/anomaly-transformer-time-series-anomaly-detection-with-association-discrepancy-i/4.png)



$$
\text{Initialization}: \mathcal{Q}, \mathcal{K}, \mathcal{V}, \sigma=\mathcal{X}^{l-1} W_{\mathcal{Q}}^l, \mathcal{X}^{l-1} W_{\mathcal{K}}^l, \mathcal{X}^{l-1} W_{\mathcal{V}}^l, \mathcal{X}^{l-1} W_\sigma^l
$$



### Prior-Association


:  a learnable **Gaussian kernel** to calculate the prior with respect to the relative temporal distance


⇒ pay more attention to the **adjacent horizon** constitutionally



$$
\text{Prior-Association}: \mathcal{P}^l=\operatorname{Rescale}\left(\left[\frac{1}{\sqrt{2 \pi} \sigma_i} \exp \left(-\frac{|j-i|^2}{2 \sigma_i^2}\right)\right]_{i, j \in\{1, \cdots, N\}}\right)
$$




$$
\begin{equation}G\left(|j-i| ; \sigma_i\right)=\frac{1}{\sqrt{2 \pi} \sigma_i} \exp \left(-\frac{|j-i|^2}{2 \sigma_i^2}\right)\end{equation}
$$



### Series-Association


: Similar to self-attention,  learns  the associations from raw series


⇒ pay more attention to **whole horizon** 



$$
\text{Series-Association}: \mathcal{S}^l=\operatorname{Softmax}\left(\frac{\mathcal{Q} \mathcal{K}^{\mathrm{T}}}{\sqrt{d_{\text {model }}}}\right)
$$




$$
\text{Reconstruction}: \widehat{\mathcal{Z}}^l=\mathcal{S}^l \mathcal{V},
$$



### Association Discrepancy



$$
\begin{equation}\operatorname{AssDis}(\mathcal{P}, \mathcal{S} ; \mathcal{X})=\left[\frac{1}{L} \sum_{l=1}^L\left(\operatorname{KL}\left(\mathcal{P}_{i,:}^l \| \mathcal{S}_{i,:}^l\right)+\operatorname{KL}\left(\mathcal{S}_{i,:}^l \| \mathcal{P}_{i,:}^l\right)\right)\right]_{i=1, \cdots, N}\end{equation}
$$



Anomaly → smaller AssDis


Normal → bigger AssDis


### MinMax Strategy



$$
\begin{equation}\mathcal{L}_{\text {Total }}(\widehat{\mathcal{X}}, \mathcal{P}, \mathcal{S}, \lambda ; \mathcal{X})=\|\mathcal{X}-\widehat{\mathcal{X}}\|_{\mathrm{F}}^2-\lambda \times\|\operatorname{AssDis}(\mathcal{P}, \mathcal{S} ; \mathcal{X})\|_1\end{equation}
$$



![](/assets/seminars/anomaly-transformer-time-series-anomaly-detection-with-association-discrepancy-i/5.png)


**Why choose the MinMax Strategy?**

- If only maximize KL → sigma = 0 ⇒ Meaningless


Minimize the Prior **toward** the Series  ⇒ Make the prior stable



Maximize the Series **away from** the Prior ⇒ Make the series distinguishable



```python
for u in range(len(prior)):
    # KL(P || S) + KL(S || P)
    series_loss += mean(KL(S, P.detach())) + mean(KL(P.detach(), S))
    prior_loss  += mean(KL(P, S.detach())) + mean(KL(S.detach(), P))
    
loss1 = rec_loss - self.k * series_loss  ## Maximize Step

loss2 = rec_loss + self.k * prior_loss   ## Minimize Step
```


### Anomaly Score



$$
\begin{equation}\operatorname{AnomalyScore}(\mathcal{X})=\operatorname{Softmax}(-\operatorname{AssDis}(\mathcal{P}, \mathcal{S} ; \mathcal{X})) \odot\left[\left\|\mathcal{X}_{i,:}-\widehat{\mathcal{X}}_{i,:}\right\|_2^2\right]_{i=1, \cdots, N}\end{equation}
$$



## Experiments


![](/assets/seminars/anomaly-transformer-time-series-anomaly-detection-with-association-discrepancy-i/6.png)

- Deep models that consider the **temporal information** outperform the **general anomaly detection model (Deep SVDD, DAGMM)**

### Ablation study


![](/assets/seminars/anomaly-transformer-time-series-anomaly-detection-with-association-discrepancy-i/7.png)


### MODEL ANALYSIS


![](/assets/seminars/anomaly-transformer-time-series-anomaly-detection-with-association-discrepancy-i/8.png)


### Reproduce Results


|      | Precision | Recall | F1 score |
| ---- | --------- | ------ | -------- |
| SMD  | 0.8912    | 0.9307 | 0.9105   |
| MSL  | 0.9216    | 0.9690 | 0.9447   |
| SMAP | 0.9368    | 0.9954 | 0.9652   |
| PSM  | 0.9730    | 0.9768 | 0.9748   |


# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.



$$
\vec{z}
$$
