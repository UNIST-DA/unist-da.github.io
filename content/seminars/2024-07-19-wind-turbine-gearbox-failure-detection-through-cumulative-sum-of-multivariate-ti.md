---
date: 2024-07-19
title: Wind Turbine Gearbox Failure Detection Through Cumulative Sum of Multivariate Time Series Data (Front. Energy Res. 2022)
category: Paper Review
presenter: 강태원
url: https://www.notion.so/f30971eb69e84bb2b790a481a66dea71
keywords: Anomaly Detection, Time-series anomaly detection
---

# Introduction

- 본 논문은 statistical learning-based approaches 사용
    - Supervised Learning : 적절한 Label 데이터 필요, label 기준 설정*하기 힘들며 imbalanced함

        * how many and which data points should be labeled arise?

    - Unsupervised Learning : 데이터의 구조나 패턴을 사용하여 이상 징후를 탐지
    - Semi - supervised Learning : 정상 운전 조건 데이터 사용 학습, 미래 관찰을 통한 이상 탐지
- 본 논문 제안 CUSUM 방법은 샘플 포인트를 시간에 따라 누적해 작은 변화를 효과적으로 탐지
- 주요 데이터 : SCADA, failure logs, vibration, status log 등
    - SCADA(Supervisiory Control and Data Acquisition system)

# Related works


### Geodesic Distance - Isomap 알고리즘


[se510002319p (ox.ac.uk)](https://www.robots.ox.ac.uk/~az/lectures/ml/tenenbaum-isomap-Science2000.pdf)

- Isomap : 매니폴드* 구조를 찾아내며, 고차원 데이터의 내재된 구조를 유지하며 저차원으로 축소하는 알고리즘
    - 매니폴드 : 저차원 공간 내에서의 저차원 곡면 또는 곡선
    - 고차원 데이터는 몇 개의 저차원 구조(매니폴드)로 이루어짐
- 고차원 공간에서의 non-linear 구조에 유용한 것은 Geodesic Distance이며, 이는 Isomap 알고리즘으로 산출 가능
    - 유클리드 거리 : 직선 거리를 측정하여 데이터 포인트 간의 직접적인 거리 표현
        - 고차원 공간에서 non-linear 구조를 가진 데이터의 geometrical 특징을 반영하지 못함
    - Statistical 거리 : Multivariate 데이터 분석에서 데이터 포인트 간의 유사성을 측정
        - 통계적 특성을 반영하나, non-linear 구조를 가진 데이터의 geometrical 특징 반영 불가
    - Geodesic 거리 : 두 점 사이의 최단 경로 거리로, 고차원 공간 및 non-linear 구조에 유용
        - non-linear 구조를 가진 데이터의 geometrical 특징 반영
        - 계산 과정이 복잡하다는 단점을 지니고 있어 MST와 같은 방법으로 근사화 계산

            ![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/0.png)

        1. **Construct neighborhood graph**
            - 두 점 $i, j$의 거리 $d_x(i,j)$ 측정으로 그래프 정의(유클리디안 거리, 도메인 거리 측정)
                - $\epsilon$ - Isomap : 두 점 사이 거리가 특정 상수 $\epsilon$보다 작으면 이웃으로 정의
                - K - Isomap : 각 점에서 가장 가까운 K개의 점을 이웃으로 정의
        2. **Shortest paths 계산**
            - 두 점 $i,j$ 연결 시 : $d_G(i,j)$로 셋팅, 비 연결 시 : $d_G(i,j)$ 무한대 초기화
                - Floyd-Warshall 알고리즘을 통한 최단 경로 계산$(k = 1,2,…,N)$

                    
                $$
                    d_G(i,j) = \text{min} (d_G(i,j), d_G(i,k) + d_G(k,j))
                    $$
                    

                - 최단 경로 행렬 생성 : $D_g = {d_G(i,j)}$
        3. **Construct** $d$**-dimensional embedding**
            - $D_G$에 대한 $\tau$ 연산으로 $\tau(D_G)$ 계산 : $S$ 행렬에 대한 $H$ 곱으로 중심화 거리 계산

                
            $$
                \tau(D) = -\frac{1}{2}HSH,\text{ } S_{ij} = D^2_{ij},\text{ }  H_{ij} = \delta_{ ij} - \frac{1}{N}
                $$
                

            - 고유값 분해 : $\tau(D_G)$ 행렬을 고유값 $\lambda_p$와 고유 벡터 $v_p$로 분해
            - 각 데이터 포인트 $i$에 대해 d-차원의 좌표 $y_i$를 $y_i = \sqrt(\lambda_p)v_p^i$로 embedding

![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/1.png)

- Isomap 알고리즘을 통한 embedding 결과 예시

    A. 비선형 매니폴드 상 두 개의 임의의 점에 대해 유클리드 거리와 지오데식 거리의 상이함 제시


    B. Isomap의 1 단계, 주변 K개의 이웃들과 연결하는 그래프 생성(최단 경로 계산의 기초)


    C. 파란선 : embedding 결과 최단 직선 거리, 빨간선 : 지오데식 거리로 비선형 구조의 최단 경로

    - 데이터의 내재된 비선형 구조를 반영한 거리 계산으로, 데이터 구조의 정확성 상향

### CUSUM(Cumulative sum)


[Energies | Free Full-Text | A CUSUM-Based Approach for Condition Monitoring and Fault Diagnosis of Wind Turbines (mdpi.com)](https://www.mdpi.com/1996-1073/14/11/3236)

- 목적 : 시계열$(Xt, t=1,2,…,k)$ 내 변경점이 없다는 가설 $H_0$, 변경점이 있다는 $H_a$중 선택

![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/2.png)


### Step 1 : 다중 linear regression model 형성(정상 데이터 활용)

    - linear regression : $y_t = x_t\beta_t + \epsilon_t$ , $\beta_t$ : regression 계수, $\epsilon_t$ : model의 오차 / 노이즈

### Step 2 : 매개변수 구성의 Test

    - Significance level $\alpha$(유의 수준) 설정 : 운영자 임의의 설정(0.01, **0.05**, 0.1 등)
    - 귀무 가설$(H_0)$ : 시스템의 정상, 대립 가설$(H_a)$ : 시스템 비정상 가능성(변경점) 중 선택
        - 시계열 데이터 $X_t$는 독립이며, 확률 밀도 함수 $p_\theta(x)$ 확률 분포를 산출
        - 변화가 생긴 시점 $t_c$에 대해 변화 전 $\theta = \theta_0$, 변화 후 $ \theta = \theta_1$로 설정 시

            
        $$
            p_{H_0}(\tilde{\mathbf{x}}) = p_{H_0}(x_1,...,x_k) = \prod_{t=1}^{t_c} p_{\theta_0}(x_t)\text{ }\text{ }\text{ }\text{ }\text{ }\text{ }\text{ }(1)
            $$
            


            
        $$
            p_{H_a}(\tilde{\mathbf{x}}) = p_{H_a}(x_1,...,x_k) = \prod_{t=1}^{t_c} p_{\theta_0}(x_t)\prod_{t=t_c+1}^{k} p_{\theta_1}(x_t)\text{ }\text{ }\text{ }\text{ }\text{ }\text{ }\text{ }(2)
            $$
            

    - 개별 LLR $s(n)$은 가설 분포 $p_{\theta_1}$와 $p_{\theta_0}$ 간 LLR로, 현재 관측값 $x_n$이 두 가설 중 가까움 평가
    - 누적합 $S(k)$ : 시점 $k$까지의 개별 LLR $s(n)$의 합
        - 대부분의 경우는 정상일 가능성이 높음에 따라, $s(n)$은 대부분 음수

        
    $$
        s(n) = \text{log}\frac{p_{\theta_1}(x_n)}{p_{\theta_0}(x_n)}, \text{ }S(k) = \sum^k_{n=1}s(n)\text{ }\text{ }\text{ }\text{ }\text{ }\text{ }\text{ }(3)
        $$
        

    - $G(k)$, CUSUM Score : $S(k)$에서 최소 누적합 $\underset{1 \leq t \leq k}{\min} S(t)$ 뺀 값(현재 시점까지 변동 측정)
        - $\underset{1 \leq t \leq k}{\min} S(t)$ = $m(k)$ : $s(n)$이 양수로 바뀌기 직전(비정상 상태가 발생하기 직전)의 값
        - $m(k)$는 누적합의 최소값이고 항상 $m(k) ≤ m(k-1)$이 성립되므로, $G(k) ≥0$

        
    $$
        G(k) = S(k) -m(k)\text{ }\text{ }\text{ }\text{ }\text{ }\text{ }\text{ }(4)
        $$
        

    - Case1) 변경 시점이 없는 경우 : 정상 지속

    ![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/3.png)

    - Case2) 변경 시점이 있는 경우 : 비정상 발생이며, 패턴이 변화하는 직전 값 $m(k)$가 유지됨

    ![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/4.png)


### Step 3 : 선택한 매개 변수 구성을 사용한 CUSUM test

    - 재귀형 CUSUM : 이전 시점의 $G(k-1)$에 현재 시점 LLR $s(k)$를 더한 값과 0 중 큰 값 택

    
$$
    G(k) = \text{max}(G(k-1) + s(k), 0)
    $$
    

<details>
<summary>$G(k-1) + s(k) > 0 :$ $G(k)$</summary>

$G(k-1) + s(k) = S(k-1)-m(k-1)+s(k)$


                                $= S(k) - m(k-1) $


                                $= S(k) - m(k) + m(k) -m(k-1)$


if $m(k) < m(k-1)$, $m(k) = S(k)$


                                $= m(k) - m(k) +m(k) -m(k-1)$


                                $= m(k) -m(k-1) <0$


이는 처음 과정 $G(k-1) + s(k)>0$ 이라는 가정과 모순됨.


if $m(k) = m(k-1)$


$G(k-1) +s(k) = S(k) -m(k) $ $= G(k)$


</details>

<details>
<summary>$G(k-1) + s(k)≤ 0 : $ $0$</summary>

$G(k) = S(k) -m(k)$


           $= S(k) - S(k-1) + S(k-1) -m(k-1) +m(k-1) -m(k)$


           $= G(k-1)+s(k)+m(k-1) -m(k)$


if $m(k) = m(k-1)$ 


$G(k) = G(k-1) + s(k)≤0$, $0≤G(k) $이라는 사실에 의해 $G(k) = 0$


if $m(k) < m(k-1)$


$m(k) = S(k)$가 되어 $G(k) = S(k) - m(k) = 0$


</details>


### Step 4 : Test 통계의 sequence의 threshold($h$) 초과 여부 확인

    - $G(k)$ < $h$ : 정상 작동을 의미하며 Step 3에서 모니터링 지속
    - $G(k)$ > $h$ : 이상점 경고 발생
        - $G(k) > h$, 즉 $S(t) > m(t) + h$

    ![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/5.png)


    ```javascript
    import numpy as np
    import matplotlib.pyplot as plt
    
    class CUSUM:
        def __init__(self, delta, h=None):
            self.delta = delta
            self.h = h
            self.G_list = None
            self.S_list = None
            self.G_min_idx = None
            self.cpd_idx = None
            self.alarm_idx = None
            
        def mean(self, x, k):
            if k == 0:
                return x[k]
            return np.mean(x[:k])
        
        def var(self, x, k):
            return np.var(x[:k])
        
        def get_s_unknown(self, x, k, mu1, delta, sigma):
            temp = (delta/sigma)*(x[k] - mu1 - 0.5*delta)
            return temp
        
        def find_change_point(self, signal):
            G_list = []
            S_list = []
            G = 0
            S = 0
            delta = self.delta
            alarm_triggered = False
            
            for k in range(len(signal)):
                if k == 0: ## 초기값
                    sigma = 1
                    mu1 = 0
                else: ## 평균과 분산 추정
                    mu1 = self.mean(signal, k+1)
                    sigma = self.var(signal, k+1)
                s = self.get_s_unknown(signal, k, mu1, delta, sigma) ## 개별 로그 우도비(s(n))
                G = np.max([G+s, 0]) ## CUSUM : G(k) = (max(G(k-1)) + s(k),0)
                S = S + s ## 개별 로그 우도비 누적합 S(k)
                G_list.append(G)
                S_list.append(S)
                
                if self.h is not None and G > self.h and not alarm_triggered:
                    self.alarm_idx = k
                    alarm_triggered = True
                
            self.G_list = G_list
            self.S_list = S_list
            if self.h is not None:
                ## 일반화 우도비(G(k))가 h를 넘어가는 인덱스
                self.G_min_idx = np.min(np.where(np.array(G_list) > self.h)[0])
                target_S_list = S_list[:self.G_min_idx] ## 인덱스 범위 제한
                self.cpd_idx = target_S_list.index(min(target_S_list)) ## 개별 로그 우도비 누적합이 최소가 되는 인덱스
            return self
    
    plt.rcParams['axes.unicode_minus'] = False
    
    np.random.seed(100)
    before_size = 1000
    after_size = 200
    
    time_series = np.concatenate([np.random.randn(before_size), np.random.randn(after_size)+1])
    
    # CUSUM 적용
    delta = 1.5
    osc = CUSUM(delta=delta, h=20).find_change_point(time_series)
    
    fig = plt.figure(figsize=(15, 6))
    fig.set_facecolor('white')
    ax = fig.add_subplot()
    ax.scatter(range(len(time_series)), osc.G_list)
    ax.set_title('CUSUM Scores')
    ax.set_xlabel('Index')
    ax.set_ylabel('CUSUM Score')
    
    if osc.cpd_idx is not None:
        ax.axvline(x=osc.cpd_idx, color='red', linestyle='--', label=f'Change Point at {osc.cpd_idx}')
    if osc.alarm_idx is not None:
        ax.axvline(x=osc.alarm_idx, color='blue', linestyle='--', label=f'Alarm at {osc.alarm_idx}')
        print(f"Alarm triggered at index: {osc.alarm_idx}")
        ax.legend()
    else:
        print("No change point detected")
    
    plt.show()
    
    print(f"Change point detected at index: {osc.cpd_idx}")
    ```


    ![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/6.png)


### MST(Minimum spanning tree)

- 정의 : 특정 그래프의 spanning tree 중 가장 최소의 weight을 가지는 spanning tree(신장 트리)
- 각 Edge 길이를 계산한 다음, 가장 긴 edge를 anomaly로 간주하는 방법으로 anomaly detecting
    - spanning tree : 모든 노드를 포함하면서 사이클이 존재하지 않는 최소 연결 부분 그래프
    - 그래프 G = (V, E), V = E + 1, 고유한 값이 아닐 가능성 존재  * V : 꼭짓점
        - MST 1 : E(e-f), MST 2 : E(c-e)로 변하더라도 MST 값은 같음

![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/7.png)


```javascript
Generic-MST(G, w)   ## G : 그래프, w : weight
A = ∅  ## A : 선택된 edge의 집합
while A does not form a spanning tree
	do find an edge(u,v) that is safe for A   ## (u, v) : 두 꼭짓점 u, v를 잇는 엣지
		  A = A ⋃ {(u,v)}
return A
```


  * safe : set A에 edge (u,v)를 포함해도 set A가 여전히 MST의 subset임을 표현, 즉 MST에 포함


```javascript
import numpy as np
import matplotlib.pyplot as plt
from scipy.sparse.csgraph import minimum_spanning_tree
from sklearn.metrics import pairwise_distances
from mpl_toolkits.mplot3d import Axes3D

# 3차원 데이터 생성
np.random.seed(42)
data = np.random.rand(100, 3)  # 100개의 3차원 데이터

# 쌍별 거리 계산
dist_matrix = pairwise_distances(data)

# MST 생성
mst = minimum_spanning_tree(dist_matrix).toarray()

# MST 총 가중치 계산
mst_total_weight = np.sum(mst[mst > 0])
print("MST Total Weight:", mst_total_weight)

# 이상치 탐지 (가장 긴 간선 5개 찾기)
edge_weights = mst[mst > 0]
sorted_indices = np.argsort(edge_weights)[-5:]
anomalous_edges = []
for idx in sorted_indices:
    anomalous_edges.append(np.where(mst == edge_weights[idx]))

fig = plt.figure(figsize=(10, 10))
ax = fig.add_subplot(111, projection='3d')
for i in range(len(data)):
    for j in range(i + 1, len(data)):
        if mst[i, j] != 0 or mst[j, i] != 0:  # MST의 간선 그리기
            if any((i in edge[0] and j in edge[1]) or (j in edge[0] and i in edge[1]) for edge in anomalous_edges):
                ax.plot([data[i, 0], data[j, 0]], [data[i, 1], data[j, 1]], [data[i, 2], data[j, 2]], 'r-', lw=2)
            else:
                ax.plot([data[i, 0], data[j, 0]], [data[i, 1], data[j, 1]], [data[i, 2], data[j, 2]], 'b-', lw=1)

ax.scatter(data[:, 0], data[:, 1], data[:, 2], c='g', marker='o')
ax.set_title("Minimum Spanning Tree (MST) in 3D with Anomalous Edges")
ax.set_xlabel("X-axis")
ax.set_ylabel("Y-axis")
ax.set_zlabel("Z-axis")
plt.show()
```


![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/8.png)


### LoMST(Local Minimum spanning tree)


[Unsupervised Anomaly Detection Based on Minimum Spanning Tree Approximated Distance Measures and its Application to Hydropower Turbines | IEEE Journals & Magazine | IEEE Xplore](https://ieeexplore.ieee.org/abstract/document/8408517)

- MST의 개별적인 지역적 이상 탐지 한계점을 보완하기 위한 방법(세밀한 이상 탐지)
    - MST : 전체 데이터 집합을 사용하여 구축하여, 전역 이상점수 계산에 용이
    - LoMST : 데이터 포인트 이웃들(k-NN)로 구축하여, 개별 데이터 포인트 이상점수 계산에 용이
        - Ex) In Fig 4, K = 6일 경우 $W_{N0} = E_{01}+E_{02}+E_{03}+E_{04}+E_{05}+E_{06}$
            - MST는 노란색, 초록색, 파란색, 주황색의 지점 전역의 이상점수 계산

                ![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/9.png)


### Algorithm


![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/10.png)

- Stage 1 : Steps for identifying distant anomalous observations
    - 모든 데이터 포인트에 대해 유클리드 거리 계산 및 MST 구축, Edge(E) 구성
    - Edge의 평균($\mu$), 표준 편차($\sigma$) 계산, 임계값 설정($\sigma$, 사용자 지정)
    - 가장 긴 Edge($L_0$)를 찾고, 길이가 $\mu + q·\sigma$ 초과 시 MST에서 제거
    - $L_o$ 제거, MST를 두 그룹으로 분리 후, 밀집도 낮은 그룹($O_1$)을 이상 클러스터로 간주하여 제거, 이를 반복

![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/11.png)

- Stage 2 : Steps for Identifying Local Anomalous Observations
    - 각 데이터 포인트에 대해 k-최근접 이웃(k-NN)을 산출
    - **LoMST 구축: k-NN을 통한 로컬 MST(LoMST)를 구축, 각 포인트에 대한 LoMST 점수 계산**
    - 이상값 판별: LoMST 점수를 기준으로 로컬 이상값 판별($O_2$)
- 최종 Total Observations,  $TO = O_1\text{ } \text{U}\text{ } O_2$

```javascript
import numpy as np
import matplotlib.pyplot as plt
from scipy.sparse.csgraph import minimum_spanning_tree
from sklearn.metrics import pairwise_distances
from sklearn.neighbors import NearestNeighbors
from mpl_toolkits.mplot3d import Axes3D

# 3차원 데이터 생성
np.random.seed(42)
data = np.random.rand(100, 3)  # 100개의 3차원 데이터

# 쌍별 거리 계산
dist_matrix = pairwise_distances(data)

# MST 생성
mst = minimum_spanning_tree(dist_matrix).toarray()

# MST 총 가중치 계산
mst_total_weight = np.sum(mst[mst > 0])
print("MST Total Weight:", mst_total_weight)

# 단계 1: 글로벌 이상치 식별 및 제거
def identify_and_remove_global_anomalies(data, mst, k=2):
    edge_weights = mst[mst > 0]
    sorted_indices = np.argsort(edge_weights)[-k:]  # 가장 긴 k개의 간선
    anomalous_edges = []
    for idx in sorted_indices:
        anomalous_edges.append(np.where(mst == edge_weights[idx]))
    
    # 가장 긴 간선을 제거하여 서브트리로 분리
    for edge in anomalous_edges:
        mst[edge[0], edge[1]] = 0
        mst[edge[1], edge[0]] = 0
    
    return mst, anomalous_edges

# MST 업데이트
mst, global_anomalous_edges = identify_and_remove_global_anomalies(data, mst, k=2)

# 단계 2: 로컬 이상치 식별
def identify_local_anomalies(data, k=2, n=2):
    neighbors_model = NearestNeighbors(n_neighbors=k).fit(data)
    n_samples = data.shape[0]
    T = []
    
    for ri in range(n_samples):
        Ni = neighbors_model.kneighbors([data[ri]], return_distance=False)[0]
        
        # 로컬 MST 생성
        local_dist_matrix = pairwise_distances(data[Ni])
        local_mst = minimum_spanning_tree(local_dist_matrix).toarray()
        Wri = np.sum(local_mst[local_mst > 0])
        
        # Ni의 로컬 MST의 총 길이의 평균 계산
        WNi_list = []
        for j in Ni:
            local_neighbors = neighbors_model.kneighbors([data[j]], return_distance=False)[0]
            local_neighbors_dist_matrix = pairwise_distances(data[local_neighbors])
            local_neighbors_mst = minimum_spanning_tree(local_neighbors_dist_matrix).toarray()
            WNi_list.append(np.sum(local_neighbors_mst[local_neighbors_mst > 0]))
        
        WNi = np.mean(WNi_list)
        
        # LoMST 점수 계산
        Ti = Wri - WNi
        T.append(Ti)
    
    # 점수 정규화
    T = (T - np.min(T)) / (np.max(T) - np.min(T))
    
    # 상위 n개의 점수를 이상치로 식별
    local_anomalies = np.argsort(T)[-n:]
    
    return local_anomalies

# 로컬 이상치 식별
local_anomalies = identify_local_anomalies(data, k=2, n=2)
print("Local Anomalies:", local_anomalies)

# MST 및 이상치 시각화
def plot_mst_with_anomalies(data, mst, global_anomalous_edges, local_anomalies):
    fig = plt.figure(figsize=(12, 12))
    ax = fig.add_subplot(111, projection='3d')
    
    # MST의 간선 그리기
    for i in range(len(data)):
        for j in range(i + 1, len(data)):
            if mst[i, j] != 0 or mst[j, i] != 0:
                ax.plot([data[i, 0], data[j, 0]], [data[i, 1], data[j, 1]], [data[i, 2], data[j, 2]], 'b-', lw=1)
    
    # 글로벌 이상치 간선 그리기
    for edge in global_anomalous_edges:
        i, j = edge[0][0], edge[1][0]
        ax.plot([data[i, 0], data[j, 0]], [data[i, 1], data[j, 1]], [data[i, 2], data[j, 2]], 'r-', lw=2)
    
    # 데이터 포인트 시각화
    colors = ['r' if i in local_anomalies else 'g' for i in range(len(data))]
    sizes = [100 if i in local_anomalies else 20 for i in range(len(data))]
    ax.scatter(data[:, 0], data[:, 1], data[:, 2], c=colors, s=sizes, marker='o')
    ax.set_title("LoMST")
    ax.set_xlabel("X-axis")
    ax.set_ylabel("Y-axis")
    ax.set_zlabel("Z-axis")
    plt.show()

# MST 및 이상치 시각화
plot_mst_with_anomalies(data, mst, global_anomalous_edges, local_anomalies)
```


![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/12.png)


![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/13.png)


# Data

- 5개 풍력 터빈에서 약 2년 간 SCADA, 구성 요소 온도, 회전 부품 속도 등 수집(10분 단위)
- 총 데이터 : 521,784행 83열 중 상태 변수에 대해 분석 사용
    - 열 : 환경 변수(풍속, 외기 온도, 풍향 등), **상태 변수(구성 요소 온도, 회전 부품 속도 등)**
- 데이터 분할 : 80% 훈련, 20% 테스트로 기간에 따른 배분(2016.1~2017.8, 2017.9~2017.12)
- Fault data : 총 28개의 고장 기록 보유

    ![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/14.png)

    - 논문에서 Link한 사이트에서는 Data를 받을 수 없으며, 다른 경로로 받았을 시 데이터 상이함

# Method


![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/15.png)

<details>
<summary>**1. What is used as the anomaly score?**</summary>
- 터빈 데이터 vector : $X_{m\times p}$ (m : 데이터 포인트 522k, p : 총 83개의 열 중 9개열)
- Anomaly Score : LoMST 기법을 사용하여 계산
- CUSUM 및 LoMST를 사용하여 프로세스 평균의 변화를 탐지(multivariate data 특성)

    
$$
    C_t = \text{max}(0, C_{t-1}+[{x_t} - \mu_0 - K]), \text{ } K : 오프셋
    $$
    

    - $C_t$가 Control Limit $H$를 초과할 시 alarm 발생
    - $K$ : 프로세스의 작은 변화에 민감하지 않도록 설정된 값, 거짓 경보를 줄이는 역할
        - 운영자가 이상 점수의 확률 분포를 기반으로 시각적 판단을 통해 결정

</details>

<details>
<summary>**2~3. How long to Accumulate and Set the Offset?**</summary>


$$
C_t = \text{max}(0, C_{t-1}+[z_t - K])
$$


- 증상 누적(Accumulation)과 오프셋($K$)을 설정하는 방법에 대해 설명
- 풍력 터빈 고장 탐지는 단순한 평균 이동보다 복잡하기 때문에, 기존 CUSUM이 부적합
    - $z_t$(다변량 이상 점수) : 기존 CUSUM의 $x_t - \mu_0$ 다변량 데이터로 변환한 값(LoMST) 사용
- 명시적으로 누적 창 크기($W$)를 설정, 오프셋($K$)은 이상 점수의 확률 분포를 기반으로 선택
    - $W$ : 생성 클러스터 수, 클러스터 간 구분 가능성, 고장 예측에 대한 유효성 등 고려 설정
        - 훈련 데이터를 사용하여 두 연속 anomaly point 사이 시간 설정

        ![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/16.png)

    - 파란선 : 자연스러운 변동 수준으로, 이는 일반적으로 정규 분포의 형태를 보임
    - 빨간선 : 실제 이상 부분으로 긴 꼬리가 나타남
    - Offset $K$의 역할 : 점선으로 표시된 Offset $K$(0.3)을 기준으로 이상 유무를 판단

</details>

<details>
<summary>**4. How to set the control limit?**</summary>
- Fault log에서 failure time을 태그하여 훈련 데이터를 사용해 control limit을 최적화
- Failure detection을 금전적 이득, 손실과 연결하는 utility 함수를 사용
1. **True Positive(TP) : early warning에 따른 잠재적 절감액**

    
$$
    TP_{saving} = \sum_{i=1,...,\text{TP}_\#}(R_{cost}-M_{cost})(\frac{\Delta t_i}{60})
    $$
    

    - $\text{TP}_\#$ : TP 수, $R_{cost}$ : 교체 비용, $M_{cost}$ : 유지보수 비용, $\Delta t_i$ : 고장 시간 전 경고 발행 
    일수, 60 : 고장 발생 60일 전이 최대 절감액을 달성할 수 있는 시점으로 가정
1. **False Negative(FN) 및 False Positive(FP) : miss detection 및 false detection 시 발생 비용**

    
$$
    FN_{cost} = \#\text{FN} \times R_{cost}, \text{ } FP_{cost} = \#\text{FP}\times I_{cost}
    $$
    

    - $\#\text{FN}$ : FN 수, $\#\text{FP}$ : FP 수, $I_{cost}$ : 검사 비용
1. **최종 함수 : 모든 절감액과 비용 요소를 통합하여** $U(H)$**의 값을 최대화하는 것이 목표**

    
$$
    U(H) = TP_{saving} - FN_{cost}-FP_{cost}, \text{ }\max_H U(H)
    $$
    

    - $H$ : Control limit이자 Threshold

</details>


# Additional Remarks


![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/17.png)


A. LoMST를 이용한 Anomaly Score 계산으로 Anomaly Score 분포 시각화


B. Offset($K$)를 적용한 결과로 Offset을 초과하는 빨간 부분추출


C. 누적 Anomaly Score의 accumulation and tracking, 초록색 선은 실제 기어 박스 failure 시점


D. Control limit($H$)을 추가하여 warning을 설정

    - Offset(0.3) : Train을 통한 Anomaly Score 분포 기반으로 시각적 판단을 통해 설정
    - W(7일) : Anomaly symptom이 일시적이지 않고 일정 기간 동안 지속되는 지의 결과로 도출
    - Control limit(8) : 유틸리티 함수 바탕으로 산출한 값

# Results, Method Evaluation


![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/18.png)


![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/19.png)

- Proposed method를 통해 4건의 기어박스 failure에 대해 early detection이 가능
    - 평균 early warning : 55일, Control limit : 8, Alarm - To - Failure 최대치는 89일

![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/20.png)

- Common / Individual control limit(threshold) 사용 시 데이터를 비교
- Common control limit을 사용했을 시, TP, FP, FN, Saving 모두 좋은 결과가 나옴
    - 이는 터빈 간의 데이터 일관성 저하 및 터빈 간 호환성이 떨어짐에 따른 결과로 유추됨

![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/21.png)

- Proposed method(CUSUM-LoMST)와 다른 method 비교 시, TP, FP, FN, saving 모두 우수
- 일부는 (-) 금액이 발생함으로써, Miss / Fail detection으로 경제적 손실이 발생했다는 의미

# Code


[Code for "Wind Turbine Gearbox Failure Detection Through Cumulative Sum of Multivariate Time Series Data" (zenodo.org)](https://zenodo.org/records/7150177)


```javascript
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import MinMaxScaler
from scipy.spatial.distance import pdist, squareform
from scipy.sparse.csgraph import minimum_spanning_tree
import matplotlib.pyplot as plt
import os

os.chdir(r'C:\Users\20235383\ppp\taewon1\7150177\Test\data')

EDP_test = pd.read_csv('wind-farm-1-signals-testing.csv', sep=',')
EDP_train = pd.read_csv('wind-farm-1-signals-training.csv', sep=',')

# 'Timestamp'를 datetime 형식으로 변환
EDP_test['Timestamp'] = pd.to_datetime(EDP_test['Timestamp'], errors='coerce').dt.tz_localize(None)
EDP_train['Timestamp'] = pd.to_datetime(EDP_train['Timestamp'], errors='coerce').dt.tz_localize(None)

# 잘못된 타임스탬프 제거
EDP_test = EDP_test.dropna(subset=['Timestamp'])
EDP_train = EDP_train.dropna(subset=['Timestamp'])

def create_hourly_avg(data, turbines):
    data_list = [data[data['Turbine_ID'] == turb] for turb in turbines]
    hourly_avg = pd.DataFrame()
    
    for i, data in enumerate(data_list):
        data = data.copy()
        data['day_hour'] = data['Timestamp'].dt.floor('H')
        date_time = data['day_hour'].drop_duplicates()
        n = len(date_time)
        row = len(hourly_avg)
        
        temp_df = pd.DataFrame({
            'Turbine_ID': [turbines[i]] * n,
            'Timestamp': date_time.values
        })
        
        for col in data.columns[3:]:
            grouped = data.groupby('day_hour')[col].mean().reset_index(drop=True)
            temp_df[col] = grouped.values
        
        hourly_avg = pd.concat([hourly_avg, temp_df], ignore_index=True)
    
    return hourly_avg

turbines = ["T01", "T06", "T07", "T11"]
Hour_test = create_hourly_avg(EDP_test, turbines)
Hour_train = create_hourly_avg(EDP_train, turbines)

col_gbx = ["Turbine_ID", "Timestamp"] + list(EDP_train.columns[3:9])

combined_data = pd.concat([Hour_train, Hour_test]).sort_values('Timestamp')
data = combined_data[col_gbx].dropna()

# 타임스탬프 범위 확인
print("Combined Timestamp range:", data['Timestamp'].min(), data['Timestamp'].max())
print("Train Timestamp range:", Hour_train['Timestamp'].min(), Hour_train['Timestamp'].max())
print("Test Timestamp range:", Hour_test['Timestamp'].min(), Hour_test['Timestamp'].max())
print("Anomaly Timestamp range:", data['Timestamp'].min(), data['Timestamp'].max())

# LoMST
def normalize(data):
    scaler = MinMaxScaler(feature_range=(0, 1))
    return scaler.fit_transform(data)

def dino_mst(matrix):
    mst = minimum_spanning_tree(matrix)
    return mst.toarray()

def OnlineLoMST_test(data, k, xcol, train_row):
    d = train_row
    dat = data[:, xcol]
    train = dat[:d, :]
    train = normalize(train)
    k = k

    buffer_dat = train
    nbrs = NearestNeighbors(n_neighbors=k, algorithm='auto').fit(buffer_dat)
    distances, indices = nbrs.kneighbors(buffer_dat)
    sumhist = np.zeros(d)
    compare = np.zeros(d)
    outlier_score = np.zeros(d)

    for i in range(d):
        m = squareform(pdist(buffer_dat[np.concatenate(([i], indices[i])), :]))
        mat = dino_mst(m)
        m[mat == 0] = 0
        sumhist[i] = np.sum(m)

    for i in range(d):
        compare[i] = sumhist[i] - np.mean(sumhist[indices[i]])
    outlier_score = (compare - np.min(compare)) / (np.max(compare) - np.min(compare))

    for j in range(d, len(data)):
        buffer_dat = normalize(dat[:j + 1, :])
        q = buffer_dat[j, :].reshape(1, -1)
        nbrs = NearestNeighbors(n_neighbors=k, algorithm='auto').fit(buffer_dat[:-1, :])
        distances, indices = nbrs.kneighbors(q)
        indices = indices.flatten()
        m = squareform(pdist(buffer_dat[np.concatenate(([j], indices)), :]))
        mat = dino_mst(m)
        m[mat == 0] = 0
        sumhist = np.append(sumhist, np.sum(m))
        compare = np.append(compare, sumhist[j] - np.mean(sumhist[indices]))
        outlier_score = np.append(outlier_score, (compare[j] - np.min(compare)) / (np.max(compare) - np.min(compare)))

    final = pd.DataFrame({'obs': np.arange(1, len(data) + 1), 'compare': compare, 'Outlier_Score': outlier_score})
    result = {'summary': final, 'sumhist': sumhist}
    return result

# 데이터 배열로 변환
data_values = data[col_gbx[2:]].values
train_row = int(len(data) * 0.8)  # train_row 80%

# LoMST 테스트 실행
result = OnlineLoMST_test(data_values, k=8, xcol=list(range(len(col_gbx) - 2)), train_row=train_row)
result_df = result['summary']

result_df['Turbine_ID'] = combined_data['Turbine_ID'].values
result_df['Timestamp'] = combined_data['Timestamp'].values

# W, offset, H 설정
W, offset, H = 7, 0.15, 8

plt.figure()
result_df['Outlier_Score'].plot(kind='density', color='red')
plt.axvline(x=offset, color='k', linestyle='--', label=f'offset = {offset}')
plt.legend()
plt.show()

# 클러스터링 및 누적 점수 계산
def calculate_cumulative_scores(result_df, turbines, W, offset, H):
    cluster_result = []
    
    for turb in turbines:
        mydata = result_df[result_df['Turbine_ID'] == turb]
        mydata = mydata[mydata['Outlier_Score'] >= offset].sort_values('Timestamp')
        mydata['diff_hrs'] = mydata['Timestamp'].diff().dt.total_seconds().div(3600).fillna(0)
        
        cluster_data = mydata.copy()
        cluster_data['7Days'] = (cluster_data['diff_hrs'] > (24 * W)).cumsum()
        cluster_data['Cum_Score'] = cluster_data.groupby('7Days')['Outlier_Score'].cumsum()
        
        cluster_result.append(cluster_data)
    
    return cluster_result

cluster_result = calculate_cumulative_scores(result_df, turbines, W, offset, H)

for i, turb in enumerate(turbines):
    cluster_result[i].to_csv(f"cusum_{turb}.csv", index=False)

# 검출 시간 계산
fail_2016 = pd.read_csv("htw-failures-2016.csv", sep=",")
fail_2017 = pd.read_csv("htw-failures-2017.csv", sep=",")
failures = pd.concat([fail_2016, fail_2017])
failures = failures[failures['Component'] == 'GEARBOX']
failures['Timestamp'] = pd.to_datetime(failures['Timestamp']).dt.tz_localize(None)

lead_times = []

for i, turb in enumerate(turbines):
    failure_records = failures[failures['Turbine_ID'] == turb]
    if not failure_records.empty:
        detection_idx = np.where(cluster_result[i]['Cum_Score'] > H)[0]
        if detection_idx.size > 0:
            detection_time = cluster_result[i]['Timestamp'].iloc[detection_idx[0]]
            failure_times = pd.to_datetime(failure_records['Timestamp'])
            # 고장 시간 중에서 탐지 시간 이후의 첫 번째 고장 시간 산출
            relevant_failure_time = failure_times[failure_times > detection_time].min()
            if pd.notnull(relevant_failure_time):
                lead_time = (relevant_failure_time - detection_time).days
                lead_times.append(lead_time)
                print(f"Turbine {turb}: Lead time is {lead_time} days")
            else:
                lead_times.append(None)
                print(f"Turbine {turb}: No relevant failure record found after detection")
        else:
            lead_times.append(None)
            print(f"Turbine {turb}: No detection found")
    else:
        lead_times.append(None)
        print(f"Turbine {turb}: No failure record found")

print("Lead times:", lead_times)

# 이상 점수 시각화
for turb in turbines:
    plt.figure(figsize=(10, 6))
    plt.title(f"Outlier Scores for Turbine {turb}")
    turb_data = result_df[result_df['Turbine_ID'] == turb]
    plt.plot(turb_data['Timestamp'], turb_data['Outlier_Score'], label='Outlier Score')
    plt.axhline(y=offset, color='r', linestyle='--', label='Offset Threshold')
    plt.legend()
    plt.xlabel('Timestamp')
    plt.ylabel('Outlier Score')
    plt.show()

# 누적 점수 시각화
for turb, cluster_data in zip(turbines, cluster_result):
    plt.figure(figsize=(10, 6))
    plt.title(f"Cumulative Scores for Turbine {turb}")
    plt.plot(cluster_data['Timestamp'], cluster_data['Cum_Score'], label='Cumulative Score')
    plt.axhline(y=H, color='r', linestyle='--', label='Threshold H')
    plt.legend()
    plt.xlabel('Timestamp')
    plt.ylabel('Cumulative Score')
    plt.show()
```


![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/22.png)


![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/23.png)


![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/24.png)


![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/25.png)


![](/assets/seminars/wind-turbine-gearbox-failure-detection-through-cumulative-sum-of-multivariate-ti/26.png)
