---
date: 2024-06-21
title: QuantTree: Histograms for Change Detection in Multivariate Data Streams (ICML 2018)
category: Paper Review
presenter: Jae Hun Cho
url: https://www.notion.so/21e6ef86765544c6acc2591fe3b38c42
keywords: Change Detection
---

## **QuantTree: Histograms for Change Detection in Multivariate Data Streams**



[📄 자료 링크 ↗](https://proceedings.mlr.press/v80/boracchi18a.html)



## Abstract


We address the problem of detecting distribution changes in multivariate data streams by means of histograms. Histograms are very general and flexible models, which have been relatively ignored in the change-detection literature as they often require a number of bins that grows unfeasibly with the data dimension. We present QuantTree, a recursive binary splitting scheme that adaptively defines the histogram bins to ease the detection of any distribution change. Our design scheme implies that i) we can easily control the overall number of bins and ii) the bin probabilities do not depend on the distribution of stationary data. This latter is a very relevant aspect in change detection, since thresholds of tests statistics based on these histograms (e.g., the Pearson statistic or the total variation) can be numerically computed from univariate and synthetically generated data, yet guaranteeing a controlled false positive rate. Our experiments show that the proposed histograms are very effective in detecting changes in high dimensional data streams, and that the resulting thresholds can effectively control the false positive rate, even when the number of training samples is relatively small.


## Introduction


**Change detection**

- Data stream에서 데이터 생성 분포 변화를 감지하는 문제

![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/0.png)

- 주로 비지도 방식으로 다뤄짐
    - Change에 대한 예측할 수 없음
    - Trainint set은 오직 stationary data으로만 이루어져 있음
        - stationary data : 시간의 경과에 따라 통계적 특성이 변하지 않는 데이터
- **신속한 detection과 FPR 제어하는 것이 목표로 두고 있음**
    - FPR 제어를 통해 effective monitoring과 reliable performance를 가지는지 확인

**3가지 주요 구성 요소**

1. stationary data의 분포 ($𝜙_0$)으로 학습된 모델
2. Test data (ex: $\phi_1$)와 학습된 모델의 conformance(일치도)를 평가하는 테스트 통계량($\mathcal{T}$)
3. $𝜙_0$의 변화를 감지하기 위해 $\mathcal{T}$ 를 모니터링하는 decision rule

![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/1.png)


**초기 변화 감지 (Change Detection)**


단변량 데이터 스트림 모니터링:

- Statistical Process Control (SPC)를 통해 단변량 데이터 스트림을 모니터링
- Classification 문제: 변화는 concept drift로 알려져 있으며, supervised data에서 연속적인 classification error를 모니터링

⇒ Multivariate 고려하지 못하는 한계점을 가지고 있음


기존 다변량 변화 감지 테스트

- PCA 기반 방법론: 데이터의 차원을 축소하여 단변량 스트림 모니터링과 유사하게 처리
- 모델 학습 및 우도(likelihood) 계산:
    - Training set에 맞게 likelihood를 계산하여 모델을 학습
    - **한계**: $\mathcal{T}$가 $𝜙_0$에 의존하며, detection rule이 heuristic이 되어 FPR를 제대로 제어할 수 없음
- 히스토그램 기반 접근법
    - 밀도를 설명하는 자연스러운 후보: 분포 간 비교에 기반한 모니터링 가능
    - 기존에는 데이터 크기에 따라 필요한 bin 수가 증가하는 문제가 있음

        해결 방안

            - Kqd-tree:
                - 모든 partitioning에 최소한의 훈련 샘플 수와 최소 크기를 보장
                - 지나치게 작은 또는 큰 partition 방지

다변향 데이터 모니터링 시 문제점

- 다변량 데이터 모니터링 시 $𝜙_0$**에 의존하지 않고** data를 정확하게 설명하는 밀도 모델과 테스트 통계량을 찾기 어려움
- 이는 실제 모니터링 문제에서는 data stream distribution을 알 수 없기 때문에 기존 방법론들이 심각한 한계를 가짐

⇒ 이를 극복하기 위한 효율적인 change detection 방법론을 제안하고 있음


QuantTree : 재귀적 이진 분할을 통해 데이터을 나누어 히스토그램을 생성 및 각 빈의 빈 확률을 계산

- 히스토그램에 대해 정의된 통계량의 분포가 $𝜙_0$에 의존하지 않음
- 통계량을 계산할 때 실제 데이터를 사용하지 않고도 정확한 임계값을 설정할 수 있음
- 실험 결과
    - High dimentional stream에서 few sample에서도 좋은 성능을 발휘
    - 기존 방법론보다 더 나은 FPR control이 가능

## Problem Formulation


**Change detection in multivariate data streams**

- 변화가 발생하기 전, 모니터링하는 stream의 데이터 $x \in \mathbb{R}^d$는 continuous random vector인 $X_0$의 독립적이고 동일한 분포(i.i.d.)를 가짐
- 해당 vector의 pdf인  $\phi_0$ 는 알 수 없음. $X \subseteq \mathbb{R}^d$
- $N$개의 Training set $TR = \{x_i \in X, i = 1, \ldots, N\}$  (즉, $x_i \sim \phi_0$).

**Histograms**


$h = \{(S_k, \hat\pi_k\}_{k=1, \ldots, K}$

- $K$_개의 부분 집합_  $S_k \subseteq X$ : $\bigcup_{k=1}^{K} S_k = \mathbb{R}^d$이며, $j \neq i$인 경우 $S_j \cap S_i = \emptyset$
- $\hat\pi_k$ : $\phi_0$에서 생성된 데이터가 $S_k$에 속할 확률
    - $\hat\pi_k = \frac{L_k}{N}$ ($S_k$에 속하는 훈련 샘플의 수인 $L_k$)

**Batch-wise Monitoring**


$W = \{x_1, \ldots, x_\nu\}$ : $\nu$ 개 의 샘플로 구성된 배치


Change 감지 : $TR$에서 학습된 histogram $h$와 $W$의 data가 일치하는지 평가하는  hypothesis test (HT)를 진행



$$
H_0: W \sim \phi_0 \quad \text{vs} \quad H_1: W \sim \phi_1 \neq \phi_0
$$


- $\phi_1$ 은 알 수 없는 사후 변화 분포를 의미
- HT은 히스토그램 $h$ 를 기준으로 정의된 통계량 $T_h$에 기반 (예시 : Pearson 통계량)
    - 통계량  $T_h$는 $\{y_k\}_{k=1, \ldots, K}$에 따라 달라짐
        - $y_k$ : $W$에서 $S_k$에 속하는 샘플 수

    
$$
    T_h(W) = T_h(y_1, \ldots, y_K) > \tau
    $$
    

    - $\tau \in \mathbb{R}$ : False Positive Rate (FPR)를 제어하는 임계값

**Goals**

1. 변화 감지 목적을 위해 훈련 세트 $TR$에서 히스토그램 $h$를 학습
2. 주어진 테스트 통계량 $T_h$와 **FPR 값** $\alpha$에 대해, 다음을 만족하는 임계값 $\tau$를 정의

    
$$
    P_{\phi_0}(T_h(W) > \tau) \leq \alpha
    $$
    

- $P_{\phi_0}$는 $W$가 $\phi_0$에서 생성된 샘플을 포함한다는 가설 하에서의 확률

## The QuantTree Algorithm


**QuantTree 알고리즘**

- $\mathbf{X}$를 재귀적으로 이진 분할하여 히스토그램 $h$ 를 정의하는 알고리즘

![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/2.png)

- QuantTree 알고리즘은 주어진 개수 ($K$) 만큼 부분 집합으로 $TR$를 분할 : $S_k$
- 히스토그램 구성에 변동성을 추가하기 위해 $i$와 $\gamma$는 무작위로 선택

이러한 과정을 통해 QuantTree는 데이터의 분포를 효과적으로 반영하는 히스토그램을 구성


![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/3.png)


```python
def _build_partitioning(self, data):
    data = reshape_data(data)
    if len(data.shape) > 2:
        data = data.reshape(-1, data.shape[-1])
    ndata, ndim = data.shape
    nbin = len(self.pi_values)

    self.ndata_training = ndata
    self.dim = ndim

    # Each leaf is characterized by 4 numbers:
    # 1) the dimension of the split that generates the leaf,
    # 2) the lower bound of the leaf,
    # 3) the upper bound of the leaf,
    # 4) the cut direction
    self.leaves = np.ones(shape=(4, nbin))

    # set the limits of the available space in each dimension
    limits = np.ones((2, ndim))
    limits[0, :] = -np.inf
    limits[1, :] = np.inf

    # all samples are available
    available = [True] * ndata

    # iteratively generate the leaves
    for i_leaf in range(nbin - 1):
        # select a random components
        i_dim = np.random.randint(ndim)
        x_tilde = data[available, i_dim]

        # find the indices of the available samples
        # idx = [i for i in range(len(available)) if available[i]]
        idx = np.where(available)[0]
        N_tilde = len(idx)

        # sort the samples
        # idx_sorted = sorted(range(len(x_tilde)), key=x_tilde.__getitem__)
        # x_tilde.sort()
        idx_sorted = np.argsort(x_tilde)
        x_tilde = x_tilde[idx_sorted]

        # compute p_tilde
        p_tilde = self.pi_values[i_leaf] / (1 - np.sum(self.pi_values[0:i_leaf]))
        L = int(np.round(p_tilde * N_tilde))

        # define the leaf
        if np.random.choice([True, False]):
            self.leaves[:, i_leaf] = [i_dim, limits[0, i_dim], x_tilde[L - 1], -1]
            limits[0, i_dim] = x_tilde[L - 1]
            idx_sorted = idx_sorted[0:L]
        else:
            self.leaves[:, i_leaf] = [i_dim, x_tilde[-L], limits[1, i_dim], 1]
            limits[1, i_dim] = x_tilde[-L]
            idx_sorted = idx_sorted[-L:]

        # remove the sample in the leaf from the available samples
        for i in idx_sorted:
            available[idx[i]] = False

    # define the last leaf with the remaining samples
    i_dim = np.random.randint(ndim)
    self.leaves[:, -1] = [i_dim, limits[0, i_dim], limits[1, i_dim], 0]
```


**Computation of Distribution-Free Test Statistics**


Theorem 1. Let $\mathcal{T}_{h}(\cdot)$ _be defined as in (3) over the histogram_ $h$ _computed by QuantTree. When_ $W \sim \phi_{0}$, the distribution of $\mathcal{T}_{h}(W)$ _depends only on_ $\nu, N$ _and_ $\left\{\pi_{k}\right\}_{k}$.

- 통계량 $\mathcal{T}_{h}(W)$_의 분포_
    - 배치의 샘플 수 $\nu$, Training set sample 수 $N$ _및 각 빈의 확률_ $\{\pi_{k}\}_{k}$_에만 의존_
    - $\phi_{0}$와 데이터 차원 $d$에 독립적
- 선택된 분포 $\psi_{0}$에서 합성 데이터를 생성하고, 원하는 FPR $\alpha$를 만족하는 임계값 $\tau$를 추정
- $\psi_{0}$ : uniform distribution $U(0,1)$로 설정

⇒계산 비용이 작고, 임계값 추정의 정확도를 높이는 역할을 함


![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/4.png)

- $\psi_{0}$에서 $N$개의 샘플을 추출하여 $B$개의 훈련 세트를 만듦
- 각 훈련 세트에 대해 QuantTree를 사용하여 히스토그램을 계산
- 각 히스토그램에 대해 원본 데이터 $\phi_{0}$에서 $\nu$ 포인트 batch 생성 및 각 배치에 대해 통계량을 계산
- **임계값** $\tau$ **추정**:
    - 생성된 통계량 값들의 집합 $T_{B}=\left\{t_{1}, \ldots, t_{B}\right\}$에서 경험적 분포의 $1-\alpha$ 분위로 임계값 $\tau$를 추정

        
    $$
        \tau = \min \left\{t \in T_{B}: \#\left\{v \in T_{B}: v>t\right\} \leq \alpha B\right\}
        $$
        

    - $\#A$는 집합 $A$의 원소 개수
    - $T_B$의 $1-α$ 분위에 해당하는 값을 계산하여 임계값 $τ$를 결정

```python
def compute_threshold(self, alpha: float):
        stats = self.estimate_quanttree_sim()
        thresholds = np.unique(stats)
        ecdf = np.array([np.sum(stats <= cstat) / stats.shape[0] for cstat in thresholds])
        return thresholds[np.sum(ecdf <= 1-alpha)]
```


```python
def estimate_quanttree_sim(self):
        partitioning = QuantTreeUnivariatePartitioning(self.pi_values)
        y = self.pi_values * self.nu

        stats = np.zeros(self.nbatch)
        for i_batch in range(self.nbatch):
            data = np.random.uniform(0, 1, self.N)
            batch = np.random.uniform(0, 1, self.nu)
						# quantTree에서 histogram을 계산하는 코드
            partitioning.build_partitioning(data) 
            y_hat = partitioning.get_bin_counts(batch)

            if self.statistic_name == 'pearson':
                stats[i_batch] = np.sum(np.abs(y - y_hat) ** 2 / y)
            elif self.statistic_name == 'tv':
                stats[i_batch] = 0.5 * np.sum(np.abs(y - y_hat))
            else:
                ValueError('Statistic not supported')

        return stats
```


**Considered Statistics**

- Pearson 통계량과 총 변동(total variation) 통계량 사용

1. Pearson 통계량



$$
\mathcal{T}_{h}^{P}(W) = \sum_{k=1}^{K} \frac{\left(y_{k}-\nu \pi_{k}\right)^{2}}{\nu \pi_{k}}
$$



2. 총 변동 통계량



$$
\mathcal{T}_{h}^{T V}(W) = \frac{1}{2} \sum_{k=1}^{K}\left|y_{k}-\nu \pi_{k}\right|
$$


- $y_{k}$는 배치 $W$에서 $S_{k}$ 빈에 속하는 샘플의 수를 의미

**Computational Remarks**

- QuantTree의 계산 비용은 데이터 차원 $d$와 상관없음
    - Algorithm 1의 6 번 $\text{Sort}(\left\{z_{n}\right\})$와 관계가 있음
- Bin의 수 $K$는 사전에 정의되며, 데이터 차원 $d$가 증가해도 K가 증가하지 않아 기존 histogram 방법론 보다 더 효율적임

## Theoretical Analysis


Theorem 1. Let $\mathcal{T}_{h}(\cdot)$ _be defined as in (3) over the histogram_ $h$ _computed by QuantTree. When_ $W \sim \phi_{0}$, the distribution of $\mathcal{T}_{h}(W)$ _depends only on_ $\nu, N$ _and_ $\left\{\pi_{k}\right\}_{k}$.

- 통계량 $\mathcal{T}_{h}(W)$_의 분포기_ $\phi_{0}$에 의존하지 않는 이론적 설명

$\phi_{0}$ 에서 각 빈 $S_{k}$의 실제 확률의 분포에 대한 3 가지 명제



$$
\begin{equation*}
p_{k}=P=P_{\phi_{0}}\left(S_{k}\right) \tag{8}
\end{equation*}
$$


- $P$ : 부분 집합 $S_k$가 $\phi_0$에서 생성될 확률

QuantTree가 항상 left tail 에 대해 분할한다고 가정하고 시작


⇒ Algorithm 1의 8번째 줄에서 $\gamma=0$으로 가정 ($\gamma \sim \operatorname{Bernoulli(0.5)}$ 에서도 성립)


![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/5.png)

1. 먼저, 임의의 데이터 포인트 $x$의 $i$번째 구성 요소 $[x]_i$_를_ $z$_로 정의하고, 이_ $z$_를_ $x_1$, ..., $x_M$의 $M$개의 정렬된 구성 요소로 나타냄
2. 그 다음, $L$이 ${1, ..., M}$에 속하는 경우에 집합 $Q_{i, L}$을 정의
3. 위 집합은 $D$ 내의 모든 $x$에 대해 $[x]_i ≤ z_(L)$를 만족하는 $x$의 집합

⇒ 확률 변수 $p$는  $\text{Beta} (L, M-L+1)$ 분포를 따름


Proof : 


$p$ : uniform disbtribution의 순서 통계량(order statistic)



$$
\begin{align*}
p & =P_{\mathbf{X}}\left(Q_{i, L}\right)=P_{\mathbf{X}}\left(\mathbf{x} \in \mathbb{R}^{d}:[\mathbf{x}]_{i} \leq z_{(L)}\right)  \tag{10}\\
& =P_{Z}\left(z \in \mathbb{R}: z \leq z_{(L)}\right)
\end{align*}
$$


- $F_{Z}$ : $Z$의 누적 분포 함수(cumulative distribution function)
- $U=F_{Z}^{-1}(Z)$ 및 $\ u_{n}=F_{Z}^{-1}\left(z_{n}\right)\ ( n=1, \ldots, M\ )$을 정의


$$
\begin{equation*}
F_{Z}^{-1}(z)=\inf \left\{t \in \mathbb{R}: F_{Z}(t)>z\right\} \tag{11}
\end{equation*}
$$


- $F_{Z}^{-1}(\cdot)$는 단조 증가 함수이므로 순서를 유지,  $\left\{u_{n}\right\}$의 $L$-번째 정렬된 값은 $u_{(L)}=F_{Z}^{-1}\left(z_{(L)}\right)$로 계산


$$
\begin{align*}
p & =P_{Z}\left(z \in \mathbb{R}: z \leq z_{(L)}\right)=  \tag{12}\\
& =P_{U}\left(u \in[0,1]: u \leq u_{(L)}\right)=F_{U}\left(u_{(L)}\right)=u_{(L)}
\end{align*}
$$



⇒ $p$는 균등 분포의 $L$-번째 순서 통계량임을 알 수 있으며, 이는 $\text{Beta} (L, M-L+1)$ 분포를 따릅


$p_{k}, k \geq 2$**의 분포를 유도**


    
$$
    \begin{equation*}
    P_{S_{1}}(\mathbf{x} \in A)=P_{\phi_{0}}\left(\mathbf{x} \in A \mid \mathbf{x} \notin S_{1}\right) \tag{13}
    \end{equation*}
    $$
    


 ⇒ $\widetilde{p}_{2}=P_{S_{1}}\left(S_{2}\right)$는 $Beta \left(L_{2}, N_{2}-L_{2}+1\right)$ 분포를 따름 ($N_{2}=N-N_{1}$)


이 과정을 반복하여 모든 확률 변수 $\widetilde{p}_{k}, k=1, \ldots, K$에 대해 다음과 같이 정의



$$
\begin{equation*}
\widetilde{p}_{k}=P_{\bigcup_{j=1}^{k-1} S_{j}}\left(S_{k}\right) \tag{14}
\end{equation*}
$$



이는 $Beta \left(L_{k}, N_{k}-L_{k}+1\right)$ 분포를 따름 ($N_{k}=N-\sum_{j=1}^{k-1} N_{j}$)


![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/6.png)


**Proof**



$$
\begin{align*}
& p_{k}=P_{\phi_{0}}\left(\mathbf{x} \in S_{k}\right) \\
& \quad=P_{\phi_{0}}\left(\mathbf{x} \in S_{k} \mid \mathbf{x} \notin \cup_{j=1}^{k-1} S_{j}\right) \cdot P_{\phi_{0}}\left(\mathbf{x} \notin \cup_{j=1}^{k-1} S_{j}\right) \\
& \quad+P_{\phi_{0}}\left(\mathbf{x} \in S_{k} \mid \mathbf{x} \in \cup_{j=1}^{k-1} S_{j}\right) \cdot P_{\phi_{0}}\left(\mathbf{x} \in \cup_{j=1}^{k-1} S_{j}\right) 
 \\
& \quad=P_{\phi_{0}}\left(\mathbf{x} \in S_{k} \mid \mathbf{x} \notin \cup_{j=1}^{k-1} S_{j}\right) \cdot P_{\phi_{0}}\left(\mathbf{x} \notin \cup_{j=1}^{k-1} S_{j}\right)
&= \widetilde{p}_{k} \cdot (1-\sum_{j=1}^{k-1} p_{j})
\tag{16}
\end{align*}
$$


- QuantTree에 의해 정의된 집합 $\left\{S_{k}\right\}$는 서로 교차하지 않으므로, $S_{k}$와 $\bigcup_{j=1}^{k-1} S_{j}$도 교차하지 않음
- $\widetilde{p}_{k}=P_{\phi_{0}}(\mathbf{x} \in S_{k} \mid \mathbf{x} \notin \bigcup_{j=1}^{k-1} S_{j})$ 와 $P_{\phi_{0}}\left(\mathbf{x} \notin \bigcup_{j=1}^{k-1} S_{j}\right)=1-\sum_{j=1}^{k-1} p_{j}$
- $k = 1$일 때,  $p_1 = \widetilde{p}_1$
- $k = 2$일 때, $p_2 = \widetilde{p}_2 \cdot (1 - p_1)$
- $k = 3$ 일 때, $p_3 = \widetilde{p}_3 \cdot (1 - p_1 - p_2)$

    
$$
    \begin{align*}p_3 &= \widetilde{p}_3 \cdot \left(1 - p_1 - \widetilde{p}_2 \cdot (1 - p_1)\right) 
     \\ &= \widetilde{p}_3 \cdot \left(1 - p_1 - \widetilde{p}_2 + \widetilde{p}_2 p_1\right)
     \\ &= \widetilde{p}_3 \cdot \left((1 - p_1)(1 - \widetilde{p}_2)\right) \\ &= \widetilde{p}_3 \cdot \left((1 - \widetilde{p}_1)(1 - \widetilde{p}_2)\right)\end{align*}
    $$
    


![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/7.png)


**Proof :**  $\widetilde{p}_{k}$_가_ $\widetilde{p}_{j}\  (j = 1, \ldots, k-1)$ 와 독립적임을 보여줌



$$
P_{\phi_{0}}\left(\widetilde{p}_{k} \leq t_{k} \mid \widetilde{p}_{j}=t_{j}, j=1, \ldots, k-1\right) = P_{\phi_{0}}\left(\widetilde{p}_{k} \leq t_{k}\right)
$$


- $k$번째 반복에서 QuantTree는 무작위로 차원 $i_{k}$를 선택하고, 남은 $N_{k}$ point의 $i_{k}$ 구성 요소의 $L_{k}$번째 순서 통계량에 따라 분할
    - $\left\{z_{n}=\left[\mathbf{x}_{n}\right]_{i_{k}}, n=1, \ldots, N\right\}$의 정렬된 $i_{k}$ 구성 요소 시퀀스에서 분할점의 위치  $\widetilde{L}_{k}$_로 정의_
    - $\widetilde{L}_{k}$의 값은 $\mathbf{x}_{1}, \ldots, \mathbf{x}_{N}$의 realizations에 따라 달라지며, $\left\{L_{k}, \ldots, M_{k}\right\}$ 범위 내의 확률 변수
    - 첫 번째 반복에서는 $L_{1}=\widetilde{L}_{1}$_이지만, 그 이후에는 두 값이 다를 수 있음_
- 명제 1의 증명과 같이, $Z=[\mathbf{X}]_{i_{k}}$의 누적 분포 함수 $F_{Z}$를 나타내고, $U=F_{Z}^{-1}(Z)$를 정의하며, 이는 $[0,1]$에서 균등 분포를 따름


$$
\begin{align*}
\widetilde{p}_{k}= & P_{\bigcup_{j=1}^{k-1} S_{j}}\left(z \leq z_{\left(\widetilde{L}_{k}\right)}\right)=P_{\bigcup_{j=1}^{k-1} S_{j}}\left(u \leq u_{\left(\widetilde{L}_{k}\right)}\right)= \\
& =F_{U}\left(u_{\left(\widetilde{L}_{k}\right)}\right)=u_{\left(\widetilde{L}_{k}\right)} \tag{19}
\end{align*}
$$


- 간단한 표기를 위해 이후의 설명에서는 $(j=1, \ldots, k-1)$ 표현을 생략
- $\{\widetilde{L}_k=a\}, $a \in\{L_k, \ldots, M_k\}$


$$
\begin{align*}
& P_{\phi_{0}}\left(\widetilde{p}_{k} \leq t_{k} \mid \widetilde{p}_{j}=t_{j}\right)=P_{\phi_{0}}\left(u_{\left(\widetilde{L}_{k}\right)} \leq t_{k} \mid \widetilde{p}_{j}=t_{j}\right)= \\
& =\sum_{a=L_{k}}^{M_{k}} P_{\phi_{0}}\left(u_{\left(\widetilde{L}_{k}\right)} \leq t_{k} \mid \widetilde{L}_{k}=a, \widetilde{p}_{j}=t_{j}\right) \cdot P_{\phi_{0}}\left(\widetilde{L}_{k}=a\right) \\
& =\sum_{a=L_{k}}^{M_{k}} P_{\phi_{0}}\left(u_{(a)} \leq t_{k} \mid \widetilde{p}_{j}=t_{j}\right) \cdot P_{\phi_{0}}\left(\widetilde{L}_{k}=a\right) \tag{20}
\end{align*}
$$



$u_{(a)}$의 분포 (균등분포)가 $\widetilde{p}_{j}$_에 의존하지 않으므로,_ $P_{\phi_{0}}\left(u_{(a)} \leq t_{k} \mid \widetilde{p}_{j}=t_{j}\right)=P_{\phi_{0}}\left(u_{(a)} \leq t_{k}\right)$



$$
\begin{align*}
& P_{\phi_{0}}\left(\widetilde{p}_{k} \leq t_{k} \mid \widetilde{p}_{j}=t_{j}\right)= \\
& =\sum_{a=L_{k}}^{M_{k}} P_{\phi_{0}}\left(u_{(a)} \leq t_{k}\right) \cdot P_{\phi_{0}}\left(\widetilde{L}_{k}=a\right) \\
& =\sum_{a=L_{k}}^{M_{k}} P_{\phi_{0}}\left(u_{\left(\widetilde{L}_{k}\right)} \leq t_{k} \mid \widetilde{L}_{k}=a\right) \cdot P_{\phi_{0}}\left(\widetilde{L}_{k}=a\right) \\
& =P_{\phi_{0}}\left(u_{\left(\widetilde{L}_{k}\right)} \leq t_{k}\right)=P_{\phi_{0}}\left(\widetilde{p}_{k} \leq t_{k}\right) \tag{21}
\end{align*}
$$



**정리 1의 증명**. 

- 임의의 정상 분포 $\phi_{0}$에 대해, $p_{1}, \ldots, p_{K}$에 조건부
    - random vector $\left[y_{1}, \ldots, y_{K}\right]$는 $\left(\nu, p_{1}, \ldots, p_{K}\right)$ 매개변수를 가지는 다항 분포를 따름
- 명제 3에서 각 $p_{k}$는 독립적인 Beta 분포의 곱으로 표현되고 $\left\{L_{k}\right\}$에만 의존하며, $\phi_{0}$와 독립

⇒ 따라서 $\left\{y_{k}\right\}$의 함수인 통계량 $\mathcal{T}_{h}$_는_ $\nu$_,_ $N$ _및_ $\left\{\pi_{k}\right\}$에만 의존


## Experiments


QuantTree를 기반으로 한 변화 감지 테스트의 장점 평가

- 알고리즘 2에서 제공하는 임계값이 비대칭 결과나 부트스트랩에 기반한 대안보다 FPR을 더 잘 제어함
- QuantTree가 제공하는 균일 밀도 분할 히스토그램 기반의 HT가 다른 방식보다 더 높은 검출력 제공
<details>
<summary>**합성 데이터셋**:</summary>
- 사용 차원: $d \in \{2, 8, 32, 64\}$
- 생성된 데이터: 250 쌍의 가우시안 $(\phi_0, \phi_1)$
    - $\phi_0$: 무작위로 정의된 공분산
    - $\phi_1 = \phi_0(Q \cdot +v)$: 대칭 Kullback-Leibler 발산 $sKL(\phi_0, \phi_1) = 1$을 갖도록 회전 변환
- CCM 프레임워크를 통해 모든 변화의 크기를 동일하게 보장

</details>

<details>
<summary>**실제 데이터셋**:</summary>
- 사용 데이터셋:
    - MiniBooNE particle identification ("particle", $d = 50$)
    - Physicochemical Properties of Protein Tertiary Structure ("protein", $d = 9$)
    - Sensorless Drive Diagnosis ("sensorless", $d = 48$)
    - Credit Card Fraud Detection ("credit", $d = 29$)
- 데이터 전처리:
    - 데이터셋 표준화
    - "particle"과 "sensorless" 구성 요소에 미세한 노이즈 $\eta \sim N(0, 0.001)$ 추가
- 실험: 각 데이터셋에서 무작위로 $TR$을 선택하고, 무작위로 정규 분포에서 변화를 정의하여 150번의 변화 시뮬레이션

</details>

- **Pearson Distribution Free / TV Distribution Free**:
    - 알고리즘 2를 사용하여 Pearson 통계량 $T_P^h$와 총 변동 $T_{TV}^h$ 통계량에 대한 임계값 계산
- **Pearson Asymptotic**:
    - $T_P^h$에 대한 임계값은 $\chi^2$ 적합도 검정에서 제공
- **TV Bootstrap**:
    - $T_{TV}^h$에 대한 임계값은 $TR$을 부트스트랩하여 경험적으로 계산
- **Voronoi**:
    - $\{S_k\}_k$가 $TR$에서 무작위로 선택된 중심 주위의 Voronoi 셀로 정의된 히스토그램을 사용
    - $T_{TV}^h$ 계산 및 부트스트랩으로 임계값 추정
- **Density Tree**:
    - 최대 정보 이득 기준에 의해 $\phi_0$를 근사하는 이진 트리
    - 부트스트랩으로 경험적으로 계산된 임계값을 사용하여 $T_{TV}^h$ 사용
- **Parametric**:
    - 파라메트릭 밀도 모델 기반 HT
    - $TR$에 가우시안 밀도를 맞추고 각 배치 $W$의 로그-우도를 계산하여 t-검정을 통해 변화를 감지

![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/8.png)


![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/9.png)


![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/10.png)


![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/11.png)


![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/12.png)


![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/13.png)

- 합성 데이터셋에서 QuantTree 기반의 방법이 밀도 트리 및 Voronoi보다 더 좋은 성능을 보임

![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/14.png)


![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/15.png)


![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/16.png)


![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/17.png)

- 실제 데이터셋에서도 균일 밀도 히스토그램이 다른 방법보다 더 높은 성능을 보임
- High dimentional stream에서 (few sample으로도) 좋은 성능을 발휘
- QuantTree 기반 방법이 다른 방법들 보다 더 좋은 FPR control이 가능

## Conclusion


In this paper we have presented QuantTree, an algorithm to build histograms for change detection through a recursive binary splitting of the input space. Our theoretical analysis allows a characterization of the probability of each bin defined by QuantTree and shows that this probability is independent from the distribution $\phi_0$ of stationary data. This implies that statistics defined over such histograms are non parametric and thresholds can be estimated through numerical simulation on synthetically generated data. Experiments show that our thresholds (estimated using samples drawn from a univariate uniform distribution) enable a better control of the FPR than asymptotic ones or those estimated by bootstrap, which is no longer necessary when using such histograms. Ongoing work investigates how to mitigate the impact of test statistics assuming a limited number of discrete values, asymptotic results for histograms generated by QuantTree, and extensions to sequential monitoring schemes.

- 입력 공간의 재귀적 이진 분할을 통해 히스토그램을 구축하는 QuantTree 알고리즘을 제시
- 이 히스토그램은 비모수 통계를 정의하고 임계치는 합성 데이터를 통해 추정 가능
- High dimentional stream에서 few sample로 test할 때에도 좋은 성능을 발휘
- QuantTree 기반 방법이 다른 방법들 보다 더 좋은 FPR control이 가능

# Code


Reproduce 결과


![](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/18.png)


![Pearson Dist. Free](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/19.png)


![TV Dist. Free](/assets/seminars/quanttree-histograms-for-change-detection-in-multivariate-data-streams-icml-2018/20.png)


```python
import os
import pickle
import warnings
from typing import Union

import numpy as np
from numpy.random import dirichlet
from scipy.stats import mvn

from quanttree.core import Partitioning, reshape_data, ThresholdStrategy, Histogram
from quanttree.utils import pkg_folder
```


### QuantTree Model


```python
class QuantTree(Histogram):
    """
    Implementation of the QuantTree change detection method

    ...

    Attributes
    ----------
    partitioning : QuantTreePartitioning
        underlying input space partitioning by means of the QuantTree algorithm
    statistic : Statistic
        statistic object
    statistic_name : str
        string representing the adopted statistic
    pi_values : np.ndarray
        bin probabilities
    nu : int
        number of samples per batch
    alpha : float
        target False Positive Rate (FPR)
    threshold_strat : ThresholdStrategy
        object handling thresholds (depends on threshold_method)
    ndata_training : int
        number of training points (computed on train)
    threshold : float
        detection threshold (computed on train)
    """

    def __init__(self, pi_values, transformation_type, statistic_name, nu, alpha):
        """
        Parameters
        ----------
        pi_values : int or sequence of float
            If pi_values is int, it is the number of bins in the histogram, to be constructed with uniform probabilities.
            If pi_values is a sequence of float, it is the probability of each histogram bin, and the number of bins is
            simply the length of the sequence

        transformation_type :  {"none", "pca"}
            Transformation to be applied as preprocessing to the data.

        statistic_name : {"pearson", "tv"}
            Statistic employed by the method.

        nu : int
            Number of samples per batch in the considered batch-wise monitoring.

        alpha : float
            Desired percentage of false positives. The computation of the detection threshold depends on this value.
        """
        qtree = QuantTreePartitioning(pi_values=pi_values, transformation_type=transformation_type)
        super().__init__(partitioning=qtree, statistic_name=statistic_name)

        # qtree = QuantTreePartitioning(pi_values=pi_values, transformation_type=transformation_type)
        self.nu = nu
        self.alpha = alpha

        # More data that will be updated at training time
        self.ndata_training = None
        self.threshold = None
        self.threshold_strat = None

    def train_model(self, data, do_thresholds=True):
        # data.shape == (ndata_training, dim)
        assert (len(data.shape) == 2)

        self.partitioning.build_partitioning(data)  # Build the QuantTree histogram
        self.estimate_probabilities(data)  # Compute the actual pi_values
        self.set_statistic()  # Set the statistic function according to pi_values

        # Compute the threshold
        self.ndata_training = data.shape[0]

        if do_thresholds:
            self.compute_threshold()

    def compute_threshold(self):
        self.threshold_strat = QuantTreeThresholdStrategy(nu=self.nu,
                                                          ndata_training=self.ndata_training,
                                                          pi_values=self.pi_values,
                                                          statistic_name=self.statistic_name)

        self.threshold = self.threshold_strat.get_threshold(alpha=self.alpha)
```


**Computation threshold**


```python
class QuantTreeThresholdStrategy(ThresholdStrategy):
    def __init__(self, nu: int = 0, ndata_training: int = 0, pi_values: Union[int, np.ndarray] = 2,
                 nbatch=100000, statistic_name: str = 'pearson'):
        super().__init__()
        self.N = ndata_training
        self.nu = nu
        self.statistic_name = statistic_name

        pi_values = np.array(pi_values)
        if pi_values.size == 1:
            self.K = pi_values
            self.pi_values = np.ones(self.K) / self.K
            self.is_unif = True
        else:
            self.pi_values = pi_values
            self.K = len(self.pi_values)
            if np.var(pi_values) < 1e-20:
                self.is_unif = True
            else:
                self.is_unif = False

        self.nbatch = nbatch
        self.thresholds_path = os.path.join(pkg_folder(), "thresholds", "quanttree_thresholds", "all_distr_quanttree.pkl")
        if not os.path.exists(self.thresholds_path):
            raise FileNotFoundError(f"Cannot find QuantTree thresholds file {self.thresholds_path}.")

    def get_threshold(self, alpha: float):
        if self.is_unif:
            with open(self.thresholds_path, 'rb') as f:
                all_thresholds = pickle.load(f)
            tkey = (self.statistic_name, self.K, self.N, self.nu)
            if tkey not in all_thresholds:
                print("[WARNING] Thresholds for this setting not found. Computing new thresholds...")
                warnings.warn("Contact diego.stucchi@polimi.it or giacomo.boracchi@polimi.it for an optimized version of the threshold computation.")
                return self.compute_threshold(alpha=alpha)
            else:
                thresholds, ecdf = all_thresholds[tkey]
                return thresholds[np.sum(ecdf <= 1 - alpha)]
        else:
            warnings.warn(
                "Thresholds are pre-computed only for uniform bin probabilities. See README.md at https://github.com/diegocarrera89/quantTree for more info.")
            warnings.warn(
                "Contact diego.stucchi@polimi.it or giacomo.boracchi@polimi.it for an optimized version of the threshold computation.")
            return self.compute_threshold(alpha=alpha)

    def add_threshold(self):
        raise NotImplementedError("Threshold computation not implemented. See README.md at https://github.com/diegocarrera89/quantTree for more info.")

    def estimate_quanttree_sim(self):
        partitioning = QuantTreeUnivariatePartitioning(self.pi_values)
        y = self.pi_values * self.nu

        stats = np.zeros(self.nbatch)
        for i_batch in range(self.nbatch):
            data = np.random.uniform(0, 1, self.N)
            batch = np.random.uniform(0, 1, self.nu)

            partitioning.build_partitioning(data)
            y_hat = partitioning.get_bin_counts(batch)

            if self.statistic_name == 'pearson':
                stats[i_batch] = np.sum(np.abs(y - y_hat) ** 2 / y)
            elif self.statistic_name == 'tv':
                stats[i_batch] = 0.5 * np.sum(np.abs(y - y_hat))
            else:
                ValueError('Statistic not supported')

        return stats

    def compute_threshold(self, alpha: float):
        stats = self.estimate_quanttree_sim()
        thresholds = np.unique(stats)
        ecdf = np.array([np.sum(stats <= cstat) / stats.shape[0] for cstat in thresholds])
        return thresholds[np.sum(ecdf <= 1-alpha)]
```


QuantTree partitioning


```python
class QuantTreeUnivariatePartitioning(QuantTreePartitioning):

    def __init__(self, pi_values):
        super().__init__(pi_values)

    def _build_partitioning(self, data):
        data = np.array(data).squeeze()

        ndata = len(data)
        self.ndata_training = ndata

        # Old version (compactly)
        # L = np.cumsum(np.round(self.pi_values * ndata)).astype(int) - 1

        # Updated version
        N = self.pi_values * ndata
        L = np.floor(N).astype(int)
        R = ndata - L.sum()
        if R > 0:
            L[np.argsort(N - L)[-R:]] += 1
        L = np.cumsum(L) - 1

        x = np.sort(data)

        self.leaves = np.concatenate(([-np.inf], x[L[:-1]], [np.inf]))

    def _find_bin(self, data):
        data = np.array(data).squeeze()
        if len(data.shape) == 0:
            data = [data]
        data = data.reshape(-1, 1)
        leaf = np.sum(data > self.leaves, axis=1) - 1

        return leaf
```


```python
# Partitioning
class QuantTreePartitioning(Partitioning):

    def __init__(self, pi_values: Union[int, list, np.ndarray] = 2, transformation_type: str = 'none'):
        pi_values = np.array(pi_values)
        if pi_values.size == 1:
            nbin = pi_values
            self.pi_values = np.ones(nbin) / nbin
            self.is_unif = True
        else:
            self.pi_values = np.array(pi_values)
            if len(np.unique(pi_values)) == 1:
                self.is_unif = True
            else:
                self.is_unif = False
            nbin = len(pi_values)

        super().__init__(nbin, transformation_type)
        self.leaves: np.ndarray = np.array([])  # MOD
        self.ndata_training = []
        self.dim = None

    def _build_partitioning(self, data):
        data = reshape_data(data)
        if len(data.shape) > 2:
            data = data.reshape(-1, data.shape[-1])
        ndata, ndim = data.shape
        nbin = len(self.pi_values)

        self.ndata_training = ndata
        self.dim = ndim

        # Each leaf is characterized by 4 numbers:
        # 1) the dimension of the split that generates the leaf,
        # 2) the lower bound of the leaf,
        # 3) the upper bound of the leaf,
        # 4) the cut direction
        self.leaves = np.ones(shape=(4, nbin))

        # set the limits of the available space in each dimension
        limits = np.ones((2, ndim))
        limits[0, :] = -np.inf
        limits[1, :] = np.inf

        # all samples are available
        available = [True] * ndata

        # iteratively generate the leaves
        for i_leaf in range(nbin - 1):
            # select a random components
            i_dim = np.random.randint(ndim)
            x_tilde = data[available, i_dim]

            # find the indices of the available samples
            # idx = [i for i in range(len(available)) if available[i]]
            idx = np.where(available)[0]
            N_tilde = len(idx)

            # sort the samples
            # idx_sorted = sorted(range(len(x_tilde)), key=x_tilde.__getitem__)
            # x_tilde.sort()
            idx_sorted = np.argsort(x_tilde)
            x_tilde = x_tilde[idx_sorted]

            # compute p_tilde
            p_tilde = self.pi_values[i_leaf] / (1 - np.sum(self.pi_values[0:i_leaf]))
            L = int(np.round(p_tilde * N_tilde))

            # define the leaf
            if np.random.choice([True, False]):
                self.leaves[:, i_leaf] = [i_dim, limits[0, i_dim], x_tilde[L - 1], -1]
                limits[0, i_dim] = x_tilde[L - 1]
                idx_sorted = idx_sorted[0:L]
            else:
                self.leaves[:, i_leaf] = [i_dim, x_tilde[-L], limits[1, i_dim], 1]
                limits[1, i_dim] = x_tilde[-L]
                idx_sorted = idx_sorted[-L:]

            # remove the sample in the leaf from the available samples
            for i in idx_sorted:
                available[idx[i]] = False

        # define the last leaf with the remaining samples
        i_dim = np.random.randint(ndim)
        self.leaves[:, -1] = [i_dim, limits[0, i_dim], limits[1, i_dim], 0]

    def _find_bin(self, data):
        # Expected data shape: ([nbatches], nu, dim)
        if len(data.shape) == 2:
            nbatches = 1
            nu, dim = data.shape
        else:
            nbatches, nu, dim = data.shape

        npoints = nbatches * nu
        data = data.reshape((npoints, dim))
        leaves = np.ones(npoints).astype(int) * (self.nbin - 1)
        avidxs = np.arange(npoints)
        for i_leaf in range(self.nbin - 1):
            ldim = self.leaves[0, i_leaf].astype(int)
            x_tilde = data[avidxs, ldim]
            # Get the indexes of the points falling in bin[i_leaf]
            if self.leaves[3, i_leaf] == -1:
                binidxs = np.where((self.leaves[1, i_leaf] < x_tilde) & (x_tilde <= self.leaves[2, i_leaf]))
            elif self.leaves[3, i_leaf] == 1:
                binidxs = np.where((self.leaves[1, i_leaf] <= x_tilde) & (x_tilde < self.leaves[2, i_leaf]))
            else:
                binidxs = np.where((self.leaves[1, i_leaf] < x_tilde) & (x_tilde < self.leaves[2, i_leaf]))

            # Update
            leaves[avidxs[binidxs]] = i_leaf
            avidxs = np.delete(avidxs, binidxs, 0)
            if len(avidxs) == 0:
                break

        # the squeeze function is to ensure that 2-dimensional inputs have 2-dimensional outputs
        return leaves.reshape((nbatches, nu)).squeeze()

    def _get_bin_counts(self, data):
        # data: ([nbathces], nu, dim)
        # bins: ([nbatches], nu)
        # bin_counts: ([nbatches], K)
        bins = self._find_bin(data)
        if len(bins.shape) == 1:
            bins = bins.reshape((1,) + bins.shape)
        # bin_counts = np.array([np.bincount(babin, minlength=self.nbin) for babin in bins])
        return np.array([np.bincount(babin, minlength=self.nbin) for babin in bins]).squeeze()

    def get_leaves_box(self):
        nleaves = self.leaves.shape[1]
        dim = self.dim
        box = np.ndarray(shape=(2, dim, nleaves))

        box[0, :, :] = -np.inf
        box[1, :, :] = np.inf

        for i_leaf in range(nleaves):
            dim_split = int(self.leaves[0, i_leaf])
            # controllo se lo split e' stato fatto prendendo la coda destra o sinistra
            is_lower_split = box[0, dim_split, i_leaf] == self.leaves[1, i_leaf]

            # calcolo il box
            box[0, dim_split, i_leaf] = self.leaves[1, i_leaf]
            box[1, dim_split, i_leaf] = self.leaves[2, i_leaf]

            # aggiorno i limiti dei box successivi
            if is_lower_split:
                box[0, dim_split, i_leaf + 1:] = box[1, dim_split, i_leaf]
            else:
                box[1, dim_split, i_leaf + 1:] = box[0, dim_split, i_leaf]

        return box

    def compute_gaussian_probabilities(self, gauss):
        box = self.get_leaves_box()
        p0 = np.zeros(self.nbin)
        for i_K in range(self.nbin):
            lower = np.squeeze(box[0, :, i_K])
            upper = np.squeeze(box[1, :, i_K])
            value, _ = mvn.mvnun(lower, upper, gauss[0], gauss[1])
            p0[i_K] = value
        return p0
```
