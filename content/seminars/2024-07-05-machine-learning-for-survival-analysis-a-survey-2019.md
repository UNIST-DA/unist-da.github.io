---
date: 2024-07-05
title: Machine Learning for Survival Analysis: A Survey (2019)
category: Lab Seminar
presenter: Hyejin Cho
url: https://www.notion.so/de6084377bf84fc3bb66b345c658dbbe
keywords: Survival Analysis
---

Ping Wang, Yan Li, and Chandan K. Reddy. 2019. Machine Learning for Survival Analysis: A Survey. ACM Comput. Surv. 51, 6, Article 110 (November 2019), 36 pages. [https://doi.org/10.1145/3214306](https://doi.org/10.1145/3214306)


# Introduction 


**생존 분석(Survival Analysis) :** 특정 사건이 발생하기까지의 시간을 분석하는 통계학의 한 분야


주요 목표 :  '생존 시간' 또는 time-to-event' 데이터를 분석하여 특정 사건이 발생할 확률을 예측하거나 그 사건이 발생하기까지의 시간을 추정하는 것


⇒ **어떠한 event가 발생하기까지에 걸리는 시간**을 추정

- 시간 (time): 상대적인 개념으로의 시간. 즉, 분석하려는 대상을 관찰하기 시작한 시점으로부터 경과한 시간
- **검열, 중도절단(censoring)** 데이터는 생존 분석의 주요 도전 과제 중 하나.
    - 사건(예: 사망, 기계 고장 등)이 관찰되지 않은 데이터. 일부 데이터가 특정 시점 이후에는 관측되지 않거나 연구 기간 동안 사건이 발생하지 않는 경우를 의미함.
    - 생존 분석 데이터셋 내에서는 일반적으로 **event = 0**인 데이터 포인트를 **검열된 (censored)** 데이터로 간주.
    - 다시 말해, 사건이 발생하지 않은 것으로 기록된 모든 데이터는 검열된 데이터로 취급. 이는 사건이 발생했지만 그 시점이 정확히 알려지지 않은 경우와, 연구 또는 관찰 기간 동안 사건이 발생하지 않은 경우를 포함함.
- Machine Learning 알고리즘도 이러한 검열 데이터를 처리하고 다양한 실제 문제를 해결하기 위해 생존 분석에 적용되었음.

![](/assets/seminars/machine-learning-for-survival-analysis-a-survey-2019/0.png)

<details>
<summary>censoring 종류</summary>

### 1. 우측 검열 (Right Censoring)

- 특정 시간 동안 사건이 발생하지 않은 경우.
- 임상 연구에서 환자가 연구 종료 시점까지 생존해 있는 경우. 환자의 정확한 사망 시점을 모르는 상황.

### 2. 좌측 검열 (Left Censoring)

- 사건이 특정 시간 이전에 발생한 경우
- 어떤 질병의 감염 여부를 검사할 때, 감염이 특정 시점 이전에 발생했음을 알고 있지만, 정확한 시점을 모르는 경우

### 3. 구간 검열 (Interval Censoring)

- 사건이 두 시간 지점 사이의 어느 시점에서 발생한 경우
- 정기 검진에서 두 번의 방문 사이에 환자가 병에 걸렸음을 알지만, 정확한 시점을 모르는 경우

</details>

<details>
<summary>reason of censored data processing</summary>

데이터의 일부 정보가 불완전하게 제공


### 1. 정보 손실 방지


검열 데이터는 사건이 발생하지 않은 상태에서도 중요한 정보를 제공함.

- 환자가 생존 상태로 연구 기간이 끝났다고 해서 그 정보가 무의미한 것이 아님. 그 환자가 일정 기간 동안 생존했다는 정보는 모델링에 중요한 역할

### 2. 편향 방지


검열 데이터를 적절히 처리하지 않으면 분석 결과가 편향될 수 있음. 

- 검열 데이터를 단순히 제외하면 생존 시간이 짧은 데이터만 남게 되어 평균 생존 시간이 실제보다 짧게 추정될 수 있음. 이는 모델의 예측력과 정확성을 저하시킬 수 있음.

### 3. 전체 데이터 활용


검열 데이터를 포함하면 더 많은 데이터를 활용 가능. 이는 모델의 통계적 유의성을 높이고, 더 정확하고 신뢰성 있는 결과를 도출하는 데 도움이 됨.


### 4. 생존 함수와 위험 함수의 정확한 추정


검열 데이터를 포함하면 생존 함수와 위험 함수를 정확하게 추정할 수 있음. 생존 분석에서 중요한 목표는 시간에 따른 생존 확률과 위험률을 추정하는 것이므로, 검열 데이터를 포함하여 모델을 구축해야함


</details>


# Definition of Survival Analysis 



$$
y_i=\left\{\begin{array}{ll}T_i & \text { if } \delta_i=1 \\ C_i & \text { if } \delta_i=0\end{array}\right.
$$


- $y_i$: 인스턴스 i에 대해 관찰된 시간
- $T_i$:  인스턴스 i의 실제 생존 시간(survival time). 이벤트(예: 사망, 고장 등)가 발생한 시점
- $C_i$: 인스턴스 i의 검열 시간(censored time)
    - 관찰 기간 동안 이벤트가 발생하지 않았거나, 연구가 종료되거나, 추적이 중단된 시점을 의미
- $\delta_i$: 인스턴스 i의 이벤트 상태를 나타내는 이진 지표.
    - 이벤트가 발생한 경우 1, 그렇지 않으면 0

| 환자 | $T_i$ | $C_i$ | $\delta_i$ | $y_i$ |
| -- | ----- | ----- | ---------- | ----- |
| 1  | -     | 10    | 0          | 10    |
| 2  | -     | 12    | 0          | 12    |
| 3  | -     | 8     | 0          | 8     |
| 4  | 6     | -     | 1          | 6     |
| 5  | -     | 5     | 0          | 5     |
| 6  | 11    | -     | 1          | 11    |

- 1,2,3,5 는 이벤트 발생 X : $y_i = C_i$
- 4,6 은 이벤트 발생 O : $y_i = T_i$

### **생존 함수** $S(t)$ **:** 특정 시간 t 까지 생존할 확률. 



$$
S(t)=Pr(T ≥t)
$$



 시간이 지남에 따라 감소. 초기값 1에서 0에 가까워짐.

- T: 사건 발생 시간(생존 시간)
- Pr(T $\geq$ t) : 사건이 시간 t까지 발생하지 않을 확률

⇒  어떤 관찰 대상이 특정 기준 시간보다 더 늦게 사건이 발생하거나 일어나지 않을 확률


### Hazard Function $h(t)$ : 특정 시간 t에서 사건이 발생할 즉시 발생할 조건부 확률


시간이 t까지 생존한 조건 하에, 시간 t에서 이벤트가 발생할 확률 밀도



$$
h(t)=\lim _{\Delta t \rightarrow 0} \frac{\operatorname{Pr}(t \leq T<t+\Delta t \mid T \geq t)}{\Delta t} \\= \lim _{\Delta t \rightarrow 0} \frac{F(t+\Delta t)-F(t)}{\Delta t \cdot S(t)}=\frac{f(t)}{S(t)}
$$


- ${Pr}(t \leq T<t+\Delta t \mid T \geq t)$ : 시간 t 에서 $t+\Delta t$ 사이에 사건이 발생할 조건부 확률
    - 시간 t 까지 생존한 인스턴스가  t 에서 $t+\Delta t$ 사이에 사건을 경험할 확률
    - 특정 기간 t에 대상에 사건이 발생할 확률
- $\Delta t$ : 매우 작은 시간 간격. 작을수록, 해저드 함수는 더 정확하게 특정 시간 t에서의 즉시 위험도를 반영
- $f(t)$ : 특정 시간에 이벤트가 발생할 확률 밀도.


$$
h(t) = -\frac{d}{dt}[\ln{S(t)}]
$$



<u>⇒</u> $h(t)$ <u>는</u> $S(t)$ <u>의 로그를 시간에 따라 미분한 값의 음수를 취하여 구함.</u>


### cumulative hazard function H(t)  : 시간 0에서부터 시간 t까지의 hazard function 의 적분값. 



$$
S(t) = \exp(-H(t)) \\
H(t) = \int_0^th(u) du
$$


- 시간 t까지의 누적된 위험

   ⇒  t시점까지 사건이 발생할 확률을 모두 더한 것

- 생존 함수 S(t) : 이 누적 위험 함수의 음수 지수를 취한 값으로 계산 가능

### Relationships between the functions


![](/assets/seminars/machine-learning-for-survival-analysis-a-survey-2019/1.png)

- **생존 함수 S(t):** 특정 시간 t까지 생존할 확률. Fig 2에서 시간에 따라 감소하는 곡선으로 나타남.
- **누적 분포 함수 F(t)**: 특정 시간 t 이전에 이벤트가 발생할 확률.
    - Cumulative event probability function
    - $F(t)=1−S(t)$ 로 정의
- **밀도 함수 f(t)**: 특정 시간에 이벤트가 발생할 확률 밀도.
    - Death density function
    - $f(t)=\frac{d}{dt}F(t)$로 정의
- **해저드 함수 h(t)**: 시간 t에 이벤트가 발생할 즉시 위험도
    - Hazard function
    - $h(t)=\frac{f(t)}{S(t)}$
- **누적 해저드 함수 H(t)**: 시간 0에서 시간 t까지의 누적된 위험도
    - cumulative hazard function
    - $H(t)=∫_0^th(u) du$

> 💡 **즉, S(t), h(t), H(t) 중 하나를 알면 다른 두 개를 구할 수 있음.**

<details>
<summary>S(t), h(t), H(t) 관계</summary>
- 누적 위험 함수 H(t) 는 위험 함수를 시간에 대해 적분한 값

    $H(t)=∫_0^th(u)du$

- 반대로, 위험 함수는 누적 위험 함수를 시간에 대해 미분한 값
$h(t)=\frac{dH(t)}{dt}$
- 생존 함수 S(t) 는 누적 위험 함수 H(t) 의 지수 함수의 음수 값 
$S(t)=\exp⁡(−H(t))$
- 누적 위험 함수 H(t) 는 생존 함수 S(t) 의 음의 자연 로그
$H(t)=−\log⁡(S(t))$
- 생존 함수 S(t) 는 위험 함수 h(t) 를 시간에 대해 적분하여 계산한 누적 위험 함수H(t) 를 이용해 계산
$S(t)=\exp(−∫_0^th(u)du)$
- 위험 함수 h(t) 는 생존 함수와 사건 발생의 밀도 함수 f(t)의 비율로도 표현할 수 있음 
$h(t)=\frac{S(t)}{f(t)}$

</details>


# Survival Analysis Methods 

- 분포에 대한 가정, 유연성, 효율성 및 정밀성, 계산 복잡도 등의 차이를 가짐.

![](/assets/seminars/machine-learning-for-survival-analysis-a-survey-2019/2.png)

<details>
<summary>meaning of “complexity”</summary>

반모수 방법의 복잡성은 수학적, 계산적, 해석적 측면에서 발생합니다. 이러한 복잡성은 모델의 유연성과 효율성을 제공하는 동시에, 모델을 적용하고 해석하는 데 있어 추가적인 노력을 요구합니다.

- **수학적 복잡성**:
    - **모델 구조**: Cox 모델 자체는 비례 위험 가정을 포함하며, 이는 각 공변량이 생존 시간에 미치는 영향을 비율로 표현합니다. 이러한 모델 구조는 단순한 선형 회귀 모델보다 복잡합니다.
    - **비례 가정**: Cox 모델은 비례 위험 가정을 기반으로 하며, 이 가정을 검증하고 유지하는 것이 필요합니다. 이는 데이터의 시간 의존성을 검사하고 조정하는 추가 작업을 요구합니다.
    - **정규화 기법**: Lasso, Ridge, Elastic Net, OSCAR와 같은 정규화 기법을 적용할 때, 추가적인 최적화 문제가 발생합니다. 이러한 기법들은 공변량 간의 상관관계를 처리하거나 변수 선택 문제를 해결하기 위해 사용됩니다.
- **계산적 복잡성**:
    - **최적화 문제**: Cox 모델과 그 변형 모델들은 로그-우도 함수의 최적화를 통해 매개변수를 추정합니다. 이러한 최적화 문제는 대규모 데이터나 고차원 데이터에서 계산 비용이 많이 들 수 있습니다.
    - **추정 방법**: 반모수 방법은 모델 매개변수를 추정하기 위해 반복적인 계산을 필요로 합니다. 특히, 정규화 기법을 적용하면 최적화 과정이 더욱 복잡해집니다.
    - **시간 의존 공변량**: 시간에 따라 변하는 공변량을 포함하면 계산 복잡성이 증가합니다. 시간 의존 공변량을 처리하기 위해 추가적인 데이터 전처리와 모델링 노력이 필요합니다.
- **해석적 복잡성**:
    - **모델 결과 해석**: Cox 모델의 결과는 위험비(hazard ratio)로 표현되며, 이는 공변량의 변화가 생존 시간에 미치는 영향을 비율로 나타냅니다. 이러한 결과를 비전문가가 이해하기는 어려울 수 있습니다.
    - **상호작용 효과**: 여러 공변량 간의 상호작용 효과를 고려해야 할 때, 모델의 해석이 복잡해질 수 있습니다.
    - **잔차 분석**: 모델 적합성을 평가하기 위해 잔차 분석과 같은 추가적인 진단 절차가 필요합니다. 이러한 절차들은 모델의 신뢰성을 높이기 위해 필수적이지만, 해석과 적용에 있어 복잡성을 더합니다.

    ### 예제: Cox 비례 위험 모델의 복잡성

    - **모델 구조**: 기본적인 Cox 모델은 다음과 같은 형태로 표현됩니다: $h(t∣X)=h0(t)exp⁡(β1X1+β2X2+⋯+βpXp)h(t∣X)=h0(t)exp(β1X1+β2X2+⋯+βpXp)$
    - 여기서 $h(t∣X)$는 시간 t에서 공변량 X가 주어진 조건부 위험 함수이며, $h_0(t)$는 기준 위험 함수, β는 공변량에 대한 계수
    - 이 모델은 공변량이 생존 시간에 미치는 영향을 비율로 나타냅니다.
    - **정규화 기법**: 예를 들어, Lasso-Cox 모델은 다음과 같은 형태로 표현됩니다
    - $∑_{i=1}^n[δ_i(β^TX_i−log⁡∑_{j∈R_i}exp⁡(β^TX_j))]−λ∑_{k=1}^p∣β_k∣$
    - 여기서 λ는 정규화 파라미터이며, $∣βk∣$는 공변량 계수의 절대값.
    - 이 최적화 문제는 계산적으로 복잡하며, 최적의 λ 값을 찾기 위해 교차 검증과 같은 추가적인 작업이 필요

</details>


| 요약 | 비모수 방법 Non-Parametric     | 반모수 방법 Semi-Parametric        | 모수 방법 Parametric         |
| -- | ------------------------- | ----------------------------- | ------------------------ |
| 장점 | - 데이터 분포 가정 없고 유연하게 처리 가능 | - 분포 가정 없이 효율적, 고차원 데이터 처리 가능 | - 분포 가정 맞으면 효율적, 해석 용이   |
| 단점 | - 대량 데이터 필요, 분포 명확하지 않음   | - 계산 복잡, 해석 어려움               |  분포 가정 틀리면 성능 저하, 유연성 부족 |


---


## Non-Parametric

- **No Assumptions on Data Distribution**: 데이터에 특정 분포를 가정하지 않음.
- **Flexibility**: 기본 분포 가정을 요구하지 않으므로, 유연하게 데이터 모델링 가능
- **Simple Implementation**: 일반적으로 계산이 간단, 직관적
    - 데이터로부터 생존 확률이나 누적 위험을 직접적으로 계산

### **Common Techniques:**

- **Kaplan-Meier Estimator**: 관찰된 생존 시간 기반으로 생존 함수 추정
- **Nelson-Aalen Estimator**: Estimates the cumulative hazard function.
- **Life-Table**

**Advantages:**

- 생존 시간의 분포를 모를 때 유용
- Can handle censored data effectively.

**Disadvantages:**

- 만약 데이터가 특정 분포를 따르는 경우, parametric 방법보다 덜 효율적
- sample size 가 작을 때, 추정치가 정밀하지 않을 수 있음

### Kaplan-Meier estimator 를 통한 논문의 설명



$$
p(T_j) = \frac{r_j−d_j}{r_j}
$$



$p(T_j)$ : 시간 $T_j$ 에서 사건이 발생하지 않을 확률(생존할 확률)


$r_j$ : 시간 $T_j$ 에 사건이 발생할 위험이 있는 인스턴스의 수( $T_j$ 시점까지 생존한 인스턴스 수)


$d_j$ : 시간 $T_j$ 에 관찰된 사건의 수( $T_j$ 시점에 사건이 발생한 인스턴스 수) 


⇒ 사건이 발생할 위험이 있는 전체 인스턴스 중에서 사건이 발생하지 않은 인스턴스의 비율



$$
\hat{S}(t) = \prod_{j:T_j<t}p(T_j) = \prod_{j:T_j<t}(1-\frac{d_j}{r_j})
$$



특정 시간 t까지 생존할 누적 확률 : 각 시간  $T_j$ 에서의 조건부 생존 확률을 단계적으로 모두 곱한 값. 


사건이 발생하는 시간을 기준으로 데이터를 나누어 각 시간 구간에서의 생존 확률 계산, 이를 통해 전체 생존 곡선 추정

<details>
<summary>censored data processing</summary>
- **데이터 준비**:
    - $T_1<T_2<⋯<T_K$는 관찰된 사건 발생 시간의 집합. 여기서 N개의 인스턴스 중 K개의 사건 발생 시간이 관찰됩니다. 나머지 인스턴스는 검열된 데이터입니다.
    - 검열된 데이터는 사건 발생 시간이 관찰되지 않은 인스턴스를 의미
- **위험에 노출된 인스턴스 수 (**$r_j$**) 계산**:
    - 특정 사건 발생 시간 $T_j$에서 위험에 노출된 인스턴스 수 $r_j$는 $T_j$ 또는 그 이후에 사건이 발생하거나 검열된 인스턴스를 포함
    - 단순히 $r_j$를 이전 시간 $T_{j−1}$에서 위험에 노출된 인스턴스 수 $r_{j−1}$에서 사건 발생 수 $d_{j−1}$ 를 뺀 값으로 계산할 수 없습니다. 이는 검열된 데이터를 고려해야 하기 때문입니다.
    - 올바른 계산 방법은 다음과 같습니다:
    $r_j=r_{j−1}−d_{j−1}−c_{j−1}$  여기서 $c_{j−1}$는 $T_{j−1}$와 $T_j$ 사이에 검열된 인스턴스 수

</details>

<details>
<summary>code</summary>

```python
# Example data
data = {
    'duration': [5, 6, 6, 2.5, 4, 6, 8, 10, 7, 8],
    'event': [1, 0, 1, 1, 1, 1, 1, 0, 0, 1]
}
df = pd.DataFrame(data)

# Sort the data by duration
df = df.sort_values(by='duration')

# Initialize variables
n = len(df)
survival_prob = 1.0
survival_probs = []
times = []
hazard_probs = []
event_times = []
risk_set = n

# Calculate the survival probability, hazard probability at each time point
for i, row in df.iterrows():
    t_j = row['duration']
    d_j = row['event']
    r_j = risk_set
    p_t_j = (r_j - d_j) / r_j
    survival_prob *= p_t_j
    survival_probs.append(survival_prob)
    hazard_probs.append(d_j / r_j)
    event_times.append(t_j)
    risk_set -= d_j
    times.append(t_j)

# Convert to numpy arrays for calculations and plotting
survival_probs = np.array(survival_probs)
hazard_probs = np.array(hazard_probs)
event_times = np.array(event_times)

# Calculate f(t)
f_t = -np.diff(survival_probs, prepend=1)

# Calculate H(t)
H_t = np.cumsum(hazard_probs)
```


</details>


### Supplemental: Nelson-Aslen Estimator(Supplementary materials)


Nelson-Aalen 추정법은 각 사건 발생 시점에서 누적 위험 함수(CHF)를 추정한 다음, 이를 사용하여 생존 함수를 계산



$$
\hat{H}(t)=∑_{t_i\leq t}\frac{d_i}{r_i}
$$


- 각 사건 발생 시점에서 누적 위험 함수를 계산
- $r_j$는 사건이 발생할 위험에 노출된 인스턴스 수(시간 $t_i$ 에서 위험에 처한 사람들의 수)
- $d_j$는 사건 발생 수(사망자 수)


$$
\hat{S}(t)=\exp(−\hat{H}(t))
$$


- $\hat{H}(t)$ 를 활용해 S(t) 계산
- KM 보다 더 부드러운 생존 함수
- KM 이 각 사건 발생 시점에서 생존 확률이 갱신되고 그 외의 시간 구간에서 변화가 없는것에 비해, 시간에 따라 누적되는 위험을 반영, 연속적 변화를 반영함.

### Supplemental: Life Table Method


각 구간의 조건부 생존 확률을 사용하여 전체 생존 함수를 추정. 

- 그룹화된 생존 데이터에 KM(Kaplan-Meier) 방법을 적용
- 각 구간의 생존 확률은 구간 내 사망자 수와 생존자 수를 기반으로 계산.
- 검열된 사례가 있을 경우, 생존자 수를 조정
<details>
<summary>extra</summary>


$$
P_j=S\left(t_j\right)=P\left(T \geq t_j\right) \\p_j=P\left(T \geq t_j \mid T \geq t_{j-1}\right)=\frac{S\left(t_j\right)}{S\left(t_{j-1}\right)}=\frac{P_j}{P_{j-1}} \\q_j=P\left(t_{j-1} \leq T<t_j \mid T \geq t_{j-1}\right)=1-p_j
$$


- $P_j$ : 시간 $t_j$에서 생존할 확률
- 조건부 생존 확률 $p_j$ : 시간 $t_{j−1}$에서 생존한 사람들이 시간 $t_j$까지 생존할 조건부 확률
- 사망 확률 $q_j$ : 시간 $t_{j−1}$에서 시간 $t_j$ 사이에 사망할 확률

for $j=2, \ldots, J+1$. Thus, we have



$$
S\left(t_j\right)=p_j S\left(t_{j-1}\right)=\cdots=p_j p_{j-1} \cdots p_2 p_1 P_0=\prod_{i=1}^j p_i
$$


- $S(t_j)$: 시간 $t_j$에서의 생존 함수
- $P_0=P(T≥0)=1$: 초기 시점에서 생존 확률은 1

The problem becomes more complicated due to the fact that we do not know exactly when an event occurs during each time interval.
Thus,in the standard LT method, $r_j =r’_j−c_j/2$ is assumed to be the number of survivors on average half-way through the interval. This is appropriate if the censorings occur uniformly throughout the interval.


</details>

1. **구간 정의 :** $I_j=[t_j,t_{j+1}),j=0,1,…,J$
    - $t_0=0$
    - $t_{J+1}=∞$
    - $l_j=t_{j+1}−t_j$: 구간 $I_j$의 길이
- **구간 내 생존자, 검열된 사례, 사망자**
    - $r′_j$: j번째 구간의 시작 시 생존자 수
    - $c_j$: j번째 구간에서의 검열된 사례 수
    - $d_j$: j번째 구간 내의 사망자 수
1. **구간 내 생존 확률 추정 :  구간 내 사망자 수와 생존자 수를 사용**


$$
\hat{p}_j=1−\frac{d_j}{r_j}
$$


- $\hat{p}_j$: j번째 구간의 조건부 생존 확률
- $d_j$: j번째 구간 내의 사망자 수
- $r_j$: j번째 구간의 생존자 수 (보정된 값)
1. **생존 함수 추정 : 각 구간의 조건부 생존 확률을 곱하여 생존 확률을 추정**


$$
\hat{S}(t_j)=∏_{i:i<j}(1−\frac{d_i}{r_i}) = ∏_{i:i=1}^j\hat{p}_i
$$


- $\hat{S}(t_j)$ : 시간 $t_j$ 에서의 생존 함수

⇒ 아래와 같이 단순화


$\hat{S}(t_{j−1})$ * $p_j$ = $\hat{S}(t_{j−1})$ * $(1-\hat{q}_j)$ 



$$
\hat{S}(t_{mj}) =  \hat{S}(t_{j−1})(1−\hat{q}_j)
$$


1. **사망 밀도 함수 추정 : 구간의 생존 확률과 사망 확률을 사용하여 구간의 중간점에서 사망 밀도를 계산**


$$
\hat{f}(t_{mj})=\frac{\hat{S}(t_{j−1})\hat{q}_j}{b_j}
$$



j번째 구간의 중간점에서의 사망 밀도를 계산. j−1번째 구간의 생존 확률과 j번째 구간의 사망 확률을 곱한 값을 구간의 길이로 나눔.

- $\hat{f}(t_{mj})$: $t_{mj}$에서의 사망 밀도 함수. 특정 시간 $t_{mj}$ 에서 사망할 확률 밀도
- $t_{mj}$: 구간 $[t_{j−1},t_j)$의 중간점
- $b_j=t_j−t_{j−1}$: 구간의 길이
- $\hat{S}(t_{j−1})$: j−1번째 구간의 시작 시점에서의 생존 함수
- $\hat{q}_j$: j번째 구간의 사망 확률. $q_j =1−p_j$
1. **위험 함수 추정 : 구간의 사망 확률을 구간의 길이와 생존 확률로 나눠 위험 함수를 계산**
- j번째 구간의 중간점에서의 위험 함수를 계산. 구간의 사망 확률을 구간의 길이와 조건부 생존 확률로 나눔


$$
h(t) = \frac{f(t)}{S(t)}
$$




$$
\hat{h}(t_{mj})=\frac{\hat{f}(t_{mj})}{\hat{S}(t_{mj})} = \frac{\frac{\hat{S}(t_{j−1})\hat{q}_j}{b_j}}{\hat{S}(t_{j−1})(1−\hat{q}_j)} = \frac{\hat{q}_j}{b_j(1-\hat{q}_j)} \\= \frac{\hat{q}_j}{b_j(1-(1-\hat{p}_j))} = \frac{\hat{q}_j}{b_j\hat{p}_j }
$$



⇒ 생<u>명표 방법에서는 아래와 같이 단순화하여 사용</u>



$$
\hat{h}(t_{mj}) =\frac{2\hat{q}_j}{b_j(1+\hat{p}_j)}
$$


- $\hat{h}(t_{mj})$: $t_{mj}$에서의 위험 함수
- $\hat{q}_j$: j번째 구간의 사망 확률
- $b_j=t_j−t_{j−1}$: 구간의 길이
- $\hat{p}_j$: j번째 구간의 생존 확률
- 구간 내 중간점에서의 위험률을 더 정확하게 반영하기 위해 $2\hat{q}_j$를 사용

## Semi-Parametric

- **Partial Assumptions on Data Distribution**
    - Typically, they assume a specific form for part of the model but leave the rest unspecified.
    - 예를 들어, 공변량과 생존 시간 간의 관계를 선형 모델로 가정
    - 예를 들어, 기준 위험 함수 $h_0(t)$는 특정하지 않고, 데이터로부터 추정
- **Balance Between Flexibility and Structure**: 비모수 방법의 유연성과 모수(parametric) 구조를 결합. 고차원 데이터와 다중 공변량 처리 가능

### **Common Techniques:**

- **Cox Proportional Hazards Model**:
    - baseline hazard function는 명시하지 않음. 공변량(covariates) 함수만 명시
    - 기본적으로 사건 발생의 비율을 시간에 따라 비례하도록 가정하는 모델.
        - 생존 시간 데이터와 공변량 간의 관계를 분석하는 데 사용됨.
    - 다양한 정규화 방법을 통해 변수 선택과 모델 성능 향상을 도모
        - **Lasso-Cox**: L1 정규화를 적용하여 가중치의 절대값 합을 최소화. 변수 선택 및 모델 성능 향상
        - **Ridge-Cox**: L2 정규화를 적용하여 가중치의 제곱합을 최소화. 변수 간의 상관관계를 처리
        - **Elastic Net (EN) Cox**: L1과 L2 정규화를 혼합하여 적용.
        - **OSCAR-Cox**: L1 정규화와 그룹화된 변수의 가중치에 대한 제한을 혼합하여 적용.

**Advantages:**

- More robust than parametric models because they do not require specifying the baseline hazard function.
- Can handle high-dimensional data effectively.

**Disadvantages:**

- Computationally more intensive than non-parametric methods.
- May be less efficient than parametric models if the true underlying distribution is known.

### 수식 8: Cox Proportional Hazards Model



$$
h(t,Xi)=h_0(t)\exp(X_iβ)
$$


- $h(t,Xi)$: 시간 t에서 공변량 $X_i$를 가진 인스턴스의 위험 함수 (hazard function)
- $h_0(t)$: 기준 위험 함수 (baseline hazard function)
- $X_i$: 인스턴스 i의 공변량 벡터 (covariate vector)
- β: 공변량에 대한 계수 벡터 (coefficient vector)

### 수식 9: 위험 비 (Hazard Ratio)


이 수식은 두 인스턴스 간의 위험 비를 나타내며, 기준 위험 함수에 독립적임. 위험 비는 두 인스턴스의 상대적인 위험을 비교하는 데 사용. 

- 수식 8의 위험도를 활용, 두 인스턴스 간 상대적 위험도 계산


$$
\frac{h(t,X1)}{h(t,X2)}=\frac{h_0(t)\exp⁡(X_1β)}{h_0(t)\exp⁡(X_2β)}=\exp⁡[(X_1−X_2)β]
$$


- $h(t,X)$: 시간 $t$ 에서 공변량 $X$ 를 가진 인스턴스의 위험 함수
    - $h(t,X_1)$ : 인스턴스 1의 위험 함수
- $\exp(X\beta)$ : 공변량 X 가 위험에 미치는 영향
- 만약 $X_1β$와 $X_2β$의 차이가 크다면, 두 인스턴스의 위험 비율도 크게 달라질 것
- 예를 들어, β가 양수라면, $X_1$의 값이 $X_2$보다 크다면 $X_1$의 위험이 더 높다는 것을 의미함.
<details>
<summary>ex</summary>
- $β=[0.5,−0.2]$
- $X1=[1,0]$  (공변량 1의 값이 1, 공변량 2의 값이 0)
- $X2=[0,1]$ (공변량 1의 값이 0, 공변량 2의 값이 1)

위험 비


$\exp⁡[(X_1−X_2)β]\\=\exp⁡[(1,0)−(0,1)]⋅[0.5,−0.2]\\=\exp⁡[1⋅0.5−1⋅(−0.2)]=\exp⁡[0.5+0.2]\\=\exp⁡[0.7]$


즉, 인스턴스 $X_1$의 위험이 $X_2$보다 약 exp⁡[0.7]≈2.01배 높다는 것을 의미


</details>


### 수식 10: 생존 함수 (Survival Function)



$$
S(t)=\exp⁡(−H_0(t)\exp⁡(Xβ))=S_0(t)^{\exp⁡(Xβ)}
$$


- S(t): 시간 t에서의 생존 확률 (survival probability)
    - 사건이 시간 t까지 발생하지 않을 확률
- $H_0(t)$: 누적 기준 위험 함수 (cumulative baseline hazard function)
    - 공변량이 없는 경우의 누적 위험
    - 시간 t 까지의 모든 사건 발생 위험을 누적한 값
- $\exp(Xβ)$ : 공변량 X의 효과를 나타내는 지수 함수. 공변량이 기준 위험에 얼마나 영향을 미치는지를 나타냄.
- $S_0(t)=\exp⁡(−H_0(t))$: 기준 생존 함수 (baseline survival function)
    - 공변량이 없는 경우의 생존 확률
<details>
<summary>수식 유도</summary>

기본적으로, 생존 함수는 누적 위험 함수와 다음과 같은 관계가 있다.


$S(t)=\exp⁡(−H(t))$


여기서 H(t)는 누적 위험 함수. 이 관계는 생존 분석의 기본 원리로, 시간 t까지 사건이 발생하지 않을 확률.


Cox 모델에서는 위험 함수가 다음과 같이 정의됩니다:


$h(t,X)=h_0(t)\exp⁡(Xβ)$


누적 위험 함수는 이 위험 함수를 시간에 대해 적분하여 얻음.


$H(t,X)=∫_0^th(u,X) du=∫_0^th_0(u)\exp⁡(Xβ) du$


$\exp(Xβ)$는 시간에 의존하지 않으므로, 이를 적분 밖으로 빼낼 수 있음.


$H(t,X)=\exp⁡(Xβ)∫_0^th_0(u) du=\exp⁡(Xβ)H_0(t)$


 따라서, 공변량이 포함된 누적 위험 함수는 다음과 같다.


$H(t,X)=\exp(Xβ)H_0(t)$


이제 생존 함수를 누적 위험 함수로 변환:


$S(t,X)=\exp⁡(−H(t,X))=\exp⁡(−\exp⁡(Xβ)H_0(t))$


이 식이 수식 10의 첫 번째 형태


기준 생존 함수 $S_0(t)$는 다음과 같이 정의됨:


$S_0(t)=\exp(−H_0(t))$
따라서, 수식 10을 기준 생존 함수 $S_0(t)$로 표현하면:


$S(t,X)=\exp(−\exp(Xβ)H_0(t))=(\exp(−H_0(t)))^{\exp(Xβ)}=S_0(t)^{\exp(Xβ)}$


</details>


### 수식 11: Breslow의 기준 위험 함수 추정량 (Breslow's Estimator for Baseline Hazard Function)


Breslow의 추정량은 기준 위험 함수를 추정하기 위해 사용



$$
\hat{H}_0(t)=∑_{t_i≤t}\hat{h}_0(t_i)
$$



**설명**:

- $\hat{H}_0(t)$: 누적 기준 위험 함수의 추정값
- $t_i$: 각 사건 발생 시간점
- $\hat{h}0(t_i)$:$t_i$에서의 기준 위험 함수(baseline hazard function)의 추정값
<details>
<summary>유도</summary>
- baseline hazard function 을 추정

    $\hat{h}_0(t_i)=\frac{d_i}{∑{j∈R_i}\exp⁡(X_jβ)}$

    - $d_i$ : $t_i$에서 발생한 사건의 수(number of events).
    - $X_jβ$: 공변량 $X_j$와 계수 벡터 β의 내적(inner product). 공변량 $X_j$가 사건 발생 위험에 미치는 영향을 나타냄.
    - $∑_{j∈R_i}\exp(X_jβ)$는 시간 $t_i$에서 위험에 노출된 모든 인스턴스의 위험 함수의 합
    - $R_i$: $t_i$ 에서 위험에 노출된 인스턴스의 집합(risk set). 즉, 시간 $t_i$까지 생존한 모든 인스턴스를 포함
- 추정한 $\hat{h}_0(t_i)$ 를 활용, 누적 기준 위험 함수 추정
    - 시간 t까지의 모든 사건 발생 시점 $t_i$에서의 기준 위험 함수 추정값 $\hat{h}_0(t_i)$를 합한 값

</details>


### 수식 12: 개별 사건 발생 확률 (Individual Event Probability)


개별 사건 발생 확률은 특정 사건 발생 시간에 대한 인스턴스의 상대적 위험을 나타냄.

- 특정 시간 $T_j$ 에서 한 개의 개별 사건 발생 확률을 계산하는 방법
- 해당 시간에 위험에 노출된 모든 인스턴스의 사건 발생 위험 중에서 인스턴스 j가 차지하는 비율
- 특정 시간 $T_j$에서 인스턴스 $j$가 사건을 겪을 확률


$$
\frac{h(T_j,X_j)dt}{∑_{i∈R_j}h(T_j,X_i)dt}
$$


- $h(T_j,X_j)$: 사건 발생 시간 $T_j$에서 공변량 $X_j$ 를 가진 인스턴스 j의 위험 함수
    - 그 시점에서 인스턴스 j 가 사건을 겪을 가능성
    - Cox 모델에서는 $h(T_j, X_j)=h_0(T_j)\exp(X_jβ)$로 정의됨
    - dt : 아주 작은 시간 간격. 특정 순간에 사건이 발생할 확률 계산하기 위함.
- $∑_{i∈R_j}h(T_j,X_i)dt$: 시간 $T_j$에서 위험에 노출된 모든 인스턴스의 위험 함수 합
    - $R_j$ : 시간 $T_j$ 에서 위험에 노출된 인스턴스의 집합
    - 즉, 그 시점에 사건을 겪을 모든 가능성이 있는 모든 사람의 위험도를 합한 값
<details>
<summary>유도</summary>
- Cox 모델에서의 hazard function 함수
$h(t,X)=h_0(t)\exp⁡(Xβ)$
    - 여기서 $h_0(t)$는 기준 위험 함수, Xβ는 공변량 X와 계수 벡터 β의 내적
- 개별 사건 발생 확률의 계산
$\frac{h(T_j,X_j)dt}{∑_{i∈R_j}h(T_j,X_i)dt}$
    - 이 수식은 시간 $T_j$에서 위험에 노출된 모든 인스턴스의 위험 함수 합에 대한 특정 인스턴스 j의 위험 함수 비율을 나타냄.
    - 시간 $T_j$에서 인스턴스 j의 사건 발생 확률은 해당 시간에 위험에 노출된 모든 인스턴스의 사건 발생 위험 중에서 인스턴스 j가 차지하는 비율
- 즉, 전체 위험도 계산 후 특정 인스턴스의 위험도 계산, 특정 인스턴스의 위험도를 전체 위험도로 나누어 개별 사건 발생 확률을 계산

</details>


### 수식 13: 부분 우도 함수 (Partial Likelihood Function)


각 데이터 포인트의 기여도 계산, 이를 모두 곱해줌으로써 공변량의 계수 $\beta$ 를 추정하는 데 사용



$$
L(β)=∏_{j=1}^N[\frac{\exp⁡(X_jβ)}{∑_{i∈R_j}\exp⁡(X_iβ)}]^{δ_j}
$$


- $δ_j$: 사건이 발생했는지를 나타내는 지시 변수 (발생 시 1, 아니면 0)
- 부분 우도 함수 $L(\beta)$ : 모델의 적합도 측정.  공변량에 대한 계수 β를 추정하기 위해 사용.
- 사건이 발생하지 않은 경우 해당 항은 1로 처리
<details>
<summary>유도</summary>
1. 각 인스턴스의 위험도 계산
    1. 특정 인스턴스 $j$ 의 위험도 : $\exp(X_j\beta)$
    2. 이는 j번째 인스턴스의 공변량 벡터 $X_j$와 계수 벡터 β의 내적을 지수 함수로 변환한 값
2. 전체 위험도 합산
    1. 특정 사건 발생 시간 $T_j$에서 위험에 노출된 모든 인스턴스 $i$의 위험도를 $∑_{i∈R_j}\exp(X_iβ)$ 로 계산
3. 비율 계산 & 부분 우도 함수 계산
    1. 각 사건 발생에 대해 특정 인스턴스 $j$의 위험도를 전체 위험에 노출된 인스턴스들의 위험도 합으로 나누어 비율을 계산
    2. 사건 발생 여부 $δ_j$에 따라 이 비율을 지수 함수로 사용
    3. 모든 사건에 대해 이러한 비율을 곱하여 전체 부분 우도 함수를 구함.

</details>


### 수식 14: 음의 로그 부분 우도 함수 (Negative Log-Partial Likelihood Function)



$$
LL(β)=−∑_{j=1}^Nδ_j(X_jβ−\log⁡[∑_{i∈R_j}\exp⁡(X_iβ)])
$$


- LL(β): 음의 로그 부분 우도 함수
    - 부분 우도 함수를 로그 변환, 음수로 만든 값
- 최대 부분 우도 추정량 (MPLE)으로 β를 추정하기 위해 사용.
<details>
<summary>유도</summary>
1. **부분 우도 함수의 로그 변환**:
    1. 부분 우도 함수 L(β)를 계산한 후, 이를 로그 변환. 로그를 취하면 곱셈이 덧셈으로 바뀌어 계산이 더 용이해짐.
2. **음의 로그 변환**
    1. 로그 부분 우도 함수의 음의 값을 취함.. 최적화 문제에서 로그 우도를 최대화하는 대신, 음의 로그 우도를 최소화하기 위해 사용
3. **계산 과정**:
    1. 각 사건 발생 시간 $T_j$에서의 기여도를 계산
        1. 사건이 발생한 인스턴스 j의 위험도 $X_jβ$
        2. 사건 발생 시간 $T_j$에서 위험에 노출된 모든 인스턴스의 위험도 합의 로그 : $\log[∑_{i∈R_j}\exp(X_iβ)]$
            1. $R_j$는 시간 $T_j$에서 위험에 노출된 인스턴스의 집합
        3. 각 사건에 대해 기여도를 모두 합산한 후 음수로 변환:
        $−∑_{j=1}^Nδ_j(X_jβ−\log[∑_{i∈R_j}\exp(X_iβ)])$

</details>


---


### 각 수식 내용 요약

- **수식 8 :** Cox 모델의 기본 형태로, 공변량과 위험도의 관계를 나타냄.
- **수식 9 :** 두 인스턴스 간의 상대적 위험도를 계산하여, 공변량의 효과를 비교.
- **수식 10 :** 위험도를 바탕으로 생존 확률을 계산.
- **수식 11 :** 기준 위험 함수를 추정하여 전체 모델의 위험도를 완성.
- **수식 12 :**  특정 시간에 개별 인스턴스의 사건 발생 확률을 계산.
- **수식 13 :**  공변량 β를 추정하기 위한 부분 우도 함수를 정의
- **수식 14 :**  로그 변환된 음의 부분 우도 함수를 사용하여 최적의 β를 찾음.
<details>
<summary>code</summary>

```python
import scipy.optimize as opt
import matplotlib.pyplot as plt


# Example data
data = {
    'duration': [5, 6, 6, 2.5, 4, 6, 8, 10, 7, 8],
    'event': [1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    'age': [50, 60, 65, 70, 55, 50, 60, 65, 70, 75],
    'treatment': [1, 1, 1, 0, 0, 0, 1, 1, 0, 0]
}
df = pd.DataFrame(data)

# Sort the data by duration
df = df.sort_values(by='duration')

# Prepare the data
X = df[['age', 'treatment']].values
y = np.array([(bool(event), duration) for event, duration in zip(df['event'], df['duration'])], dtype=[('event', 'bool'), ('duration', 'float')])

# Define the negative log partial likelihood function
def neg_log_partial_likelihood(beta):
    risk_scores = np.dot(X, beta)
    log_likelihood = 0
    for i in range(len(y)):
        if y[i]['event']:
            log_risk = np.log(np.sum(np.exp(risk_scores[i:])))
            log_likelihood += risk_scores[i] - log_risk
    return -log_likelihood

# Optimize the partial likelihood to find the coefficients
initial_beta = np.zeros(X.shape[1])
result = opt.minimize(neg_log_partial_likelihood, initial_beta, method='BFGS')
beta_hat = result.x
print("Estimated Coefficients:", beta_hat)

# Calculate the baseline cumulative hazard function
risk_scores = np.dot(X, beta_hat)
sorted_indices = np.argsort(df['duration'])
risk_scores_sorted = risk_scores[sorted_indices]
event_sorted = df['event'].values[sorted_indices]
durations_sorted = df['duration'].values[sorted_indices]

baseline_hazard = []
cumulative_baseline_hazard = 0
for i in range(len(y)):
    if event_sorted[i] == 1:
        cumulative_baseline_hazard += 1 / np.sum(np.exp(risk_scores_sorted[i:]))
    baseline_hazard.append(cumulative_baseline_hazard)
baseline_hazard = np.array(baseline_hazard)

# Calculate the survival function S(t) for each individual
S_t = np.exp(-baseline_hazard[:, np.newaxis] * np.exp(risk_scores_sorted))
```


</details>


---


### 정규화된 Cox 모델


고차원 데이터에서 중요한 특징을 선택하고 모델의 과적합 문제를 해결하기 위한 정규화된 Cox 모델


![](/assets/seminars/machine-learning-for-survival-analysis-a-survey-2019/3.png)

- **고차원 데이터 문제**:
    - 많은 실제 데이터 세트는 수집된 변수의 수(P)가 인스턴스 수(N)와 거의 같거나 그 이상일 수 있음. 이는 모델이 과적합(overfitting) 문제를 일으킬 수 있음.
    - 따라서 중요한 특징만을 선택하고 나머지는 무시하는 희소성(norm) 규범을 사용하는 것이 유용
- **정규화 파라미터(λ) 조정**:
- λ≥0 값을 조정하여 정규화 항이 모델에 미치는 영향을 조절.
    - 값이 크면, 더 많은 패널티 적용, 모델이 단순해짐.
- 최적의 λ 값({$λ_{opt}$)은 교차 검증을 통해 선택 가능

### Lasso-Cox

- 변수 선택을 위해 $ℓ_1$**-norm 페널티**를 사용하여 변수 선택과 회귀 계수 추정을 동시에 수행. 중요한 변수만 남길 수 있음.
- 변수 선택이 필요할 때 유리
- 부분 우도 함수에 $ℓ_1$-norm 페널티를 추가하여 Lasso-Cox 알고리즘을 만듦
- $ℓ_1$**-norm 페널티** : 변수들의 절대값의 합

### **Ridge-Cox**

- 모든 계수를 작게 만들기 위해  $ℓ_2$**-norm 페널티**를 사용, 상관된 특징을 선택하고 그 값을 서로 가깝게 조정. 변수 간 상관관계가 높은 경우에 유리
- $ℓ_2$**-norm 페널티 :** 변수들의 제곱의 합
- 다중공선성 문제 해결. 과적합 방지

### **Elastic Net (EN-Cox)**:

- $ℓ_1$ 페널티와 $ℓ_2$ 페널티를 결합하여 특징 선택과 상관된 특징 간의 문제를 동시에 해결
    - λ: 정규화 강도를 조절하는 파라미터, α는 $ℓ_1$과 $ℓ_2$ 페널티의 비율을 조절하는 파라미터
    - Lasso 처럼 변수 선택을 하면서도 Ridge 처럼 변수 간의 상관관계 조정
- Lasso-Cox와 달리 N≤P인 경우에도 N개 이상의 특징을 선택할 수 있음


$$
\lambda\left[\alpha \sum_{p=1}^P\left|\beta_p\right|+\frac{1}{2}(1-\alpha) \sum_{p=1}^P \beta_p^2\right]
$$



### **OSCAR-Cox**:

- Octagonal Shrinkage and Clustering Algorithm for Regression (OSCAR) 정규화를 기본 Cox 모델에 통합하여 변수 선택을 수행
- OSCAR 정규화의 주요 장점은 비슷한 방식으로 결과에 영향을 미치는 특징에 대해 동일한 계수를 갖도록 묶어주는 것
    - 변수 간 상호작용 고려
    - 관련 변수를 함께 선택하고, 그들의 계수가 비슷해지도록 함.
- 개인 희소성($ℓ_1$ norm)과 그룹 희소성($ℓ_∞$ norm)을 동시에 가짐.

---


### CoxBoost


Cox 비례 위험 모델을 기반으로 한 부스팅(boosting) 방법

- 부스팅은 여러 개의 약한 예측기(weak learner)를 순차적으로 학습시키고 결합(strong learner)하여 예측 성능을 향상시키는 방법
- Cox 모델과 부스팅을 결합하여 고차원 생존 데이터에서 변수 선택과 모델 적합을 동시에 수행.
    - CoxBoost는 고차원 데이터에서 중요한 변수를 자동으로 선택
    - 많은 수의 변수와 소수의 관측치가 있는 고차원 데이터에 효과적으로 작동
- Cox 모델의 위험 함수와 생존 함수를 사용하여 각 부스팅 단계에서 모델을 업데이트.
- **초기화**:
    - 초기 모델을 설정합니다. 일반적으로 모든 계수 β를 0으로 초기화
- **부스팅 단계**:
    - 각 단계에서 특정 변수에 대한 계수 β를 업데이트
    - 업데이트는 부분 우도 함수의 그래디언트(gradient)에 따라 이루어짐
- **계수 업데이트**:
    - 각 반복에서 가장 크게 기여하는 변수 선택.
    - 선택된 변수에 대해 그래디언트 값이 최대인 변수를 선택
    - 이를 통해 해당 변수의 기여도를 조정
- **반복**:
    - 이 과정을 여러 번 반복하여 모델을 점진적으로 개선.
    - 각 반복에서 모델의 예측 오류를 줄이기 위해 새로운 변수를 선택, 해당 변수의 계수를 조정
<details>
<summary>algorithm</summary>
- **초기화**: $β^{(0)}=0$
- **반복** (m=1,2,…,M):
    - 그래디언트 계산: $∇L(β^{(m)})=\frac{∂L(β)}{∂β}|_{β=β(m)}$
    - 변수 선택: $j=\arg\max_k ∣∇kL(β^{(m)})∣$
    - 계수 $β_j^{(m+1)}$ 업데이트
- 최종 모델 : $h(t,X)=h_0(t)\exp(Xβ^{(M)})$

</details>


### Time-Dependent Cox Model


시간에 따라 변할 수 있는 공변량을 포함하는 Cox 비례 위험 모델의 확장


**시간 종속 공변량**:

    - 공변량이 시간에 따라 변할 수 있음.
        - 예를 들어, 환자의 혈압, 체중, 약물 복용 여부 등이 시간에 따라 달라질 수 있음.
    - 시간 종속 공변량은 $X_i(t)$로 표현. 여기서 i는 인스턴스를, t는 시간을 나타남.
    - 위험 함수 $h(t,X_i(t))$는 시간 t에서의 공변량 $X_i(t)$에 따라 달라짐.

### 수식 15: TD Cox Model 의 Hazard Function



$$
h(t,X(t))=h_0(t)\exp(∑_{j=1}^{P_1}δ_jX.j(t)+∑_{i=1}^{P_2}β_iX.i)
$$


- **수식 15**는 시간 종속 공변량과 비종속 공변량을 모두 포함한 Cox 모델의 위험 함수를 나타냄. 이는 시간에 따라 변할 수 있는 공변량을 고려하여 인스턴스의 위험도를 계산
    - 시간 종속 공변량의 합과 시간 비종속 공변량의 합을 활용

### 수식 16: Hazard Ratio



$$
\hat{HR}(t)=\frac{\hat{h}(t,X(t))}{\hat{h}(t,X^∗(t))}\\=\exp(∑{j=1}^{P_1}δ_j[X_{.j}^∗(t)−X_{.j}(t)]+∑_{i=1}^{P_2}β_i[X_{.i}^∗−X_{.i}])
$$


- **수식 16**은 두 인스턴스의 위험 함수를 비교하여 위험 비를 계산. 시간 종속 및 비종속 공변량의 차이를 반영하여 상대적인 위험도를 나타냄.
    - 시간 종속 공변량의 차이에 따른 위험비와 시간 비종속 공변량의 차이에 따른 위험비를 모두 고려

---


## Parametric


**Characteristics:**

1. **Assumptions on Data Distribution**: Parametric methods assume a specific distribution for the survival times.
2. **Model Specificity**: 높은 구조성을 가짐. 가정된 분포의 정확성에 크게 의존

**Advantages:**

- 가정된 분포가 맞을 경우, 효율적이고 정확한 추정치 얻을 수 있음
- 정밀하고 해석 가능한 결과 제공

**Disadvantages:**

- If the assumed distribution is incorrect, results can be misleading or inaccurate.
- Less flexible, as they depend heavily on the correctness of the distributional assumptions.

### Parametric model 에서 MLE(Maximum Likelihood Estimation) 



$$
L(\beta)=\prod_{\delta_i=1} f\left(T_i, \beta\right) \prod_{\delta_i=0} S\left(T_i, \beta\right) .
$$


- $L(\beta)$ : 주어진 파라미터 β에 대해 관측된 데이터가 나타날 확률. 우도 함수는 파라미터 β를 최대화하여 추정
- $∏_{δ_i=1}f(T_i,β)$ : 모든 uncensored observations 의 결합 확률
    - $f(T_i,β)$ :  생존 시간 $T_i$에서의 사망 밀도 함수 (Death Density Function), 주어진 파라미터 β에 대해 특정 시간 $T_i$에서 이벤트가 발생할 확률
    - $δ_i=1$인 경우, 즉 인스턴스 i가 검열되지 않은 경우 이 항이 포함
- $∏_{δ_i=0}S(T_i,β)$ : 모든  censored observations 의 결합 확률
    - $S(T_i, \beta)$ : 주어진 파라미터 β에 대해 특정 시간 $T_i$까지 생존할 확률
<details>
<summary>부가 설명</summary>
- 모델들의 파라미터는 최대우도추정법(MLE)을 사용하여 추정할 수 있음.
- N개의 인스턴스가 있으며, 그 중 c개는 검열된 관측치이고 (N−c) 개는 검열되지 않은 관측치로 구성됨.
- 모든 파라미터의 집합은 $β=(β_1,β_2,…,β_P)^T$로 나타낼 수 있음
- 사망 밀도 함수 f(t,β)와 생존 함수 S(t,β) 파라미터를 기반으로 표현
- censored instance i 의 경우, 실제 생존 시간은 사용할 수 없지만, 그 인스턴스가 검열 시간 $C_i$ 이전에 관심 이벤트를 경험하지 않았음을 알 수 있음.
    - 따라서 생존 함수 $S(C_i,β)$의 값은 1에 가까운 확률.
- 인스턴스 i 에서 이벤트가 $T_i$에 발생한 경우, 사망 밀도 함수 $f(T_i,β)$는 높은 확률 값을 가짐.

⇒ 따라서 모든 uncensored observations 의 결합 확률은 $∏_{δ_i=1}f(T_i,β)$
⇒ 모든  censored observations 의 결합 확률은 $∏_{δ_i=0}S(T_i,β)$로 표현


 ⇒ 모든 N개의 인스턴스에 대해 우도 함수를 최적화하여 파라미터 β를 추정


</details>


### Parametric Model 에서 일반적으로 사용되는 분포


모수적 생존 분석 모델에서는 데이터의 생존 시간이 특정 이론적 분포를 따른다고 가정함. 각 분포는 생존 시간 데이터의 특성을 반영하며, 다양한 상황에 맞게 적용할 수 있음.


> 💡 **- PDF f(t)** : 특정 시간 t에서 사건이 발생할 확률.  
> - **S(t)** : 특정 시간 t까지 생존할 확률.  
>   
> - **h(t)**: 특정 시간 t에서 사건이 발생할 조건부 확률.

<details>
<summary>유도</summary>

PDF $f(t)$ 에서 Survival Function S(t) 유도



$$
S(t)=1−∫_0^tf(u)du
$$



S(t) 에서 cumulative hazard function H(t) 유도



$$
H(t)=−\log S(t)
$$



H(t) 에서 h(t) 유도 : 미분



$$
h(t)=\frac{dH(t)}{dt}
$$



</details>


![](/assets/seminars/machine-learning-for-survival-analysis-a-survey-2019/4.png)

- **Exponential Distribution**: 고정된 위험률 λ 파라미터를 가짐.
    - 이 모델은 실패나 사망이 시간과 무관하게 무작위로 발생하는 이벤트라고 가정.
    - λ가 높을수록 더 높은 위험과 짧은 생존 시간
- **Weibull Distribution**: 지수 분포를 일반화한 형태로, 사건 발생의 위험률이 시간에 따라 변할 수 있도록 함.
    - 위험률의 변화를 결정하는 shape parameter $k$를 도입.
    - k=1일 때 Weibull 모델은 Exponential 모델로 축소.
    - k<1일 때, 위험 함수는 시간이 지남에 따라 감소하고, k>1일 때는 위험 함수가 증가
- **Logistic and Log-Logistic Distribution**: 위험 함수의 비단조적(non-monotonic) 동작을 허용.
    - 생존 분석에서 비모수적 모델로 널리 사용
    - non-monotonic : 위험 함수가 일정하게 증가하거나 감소하지 않고 여러 단계를 거치는 것. 위험 함수가 처음에는 증가하다가 정점을 찍고 다시 감소하는 패턴을 보일 수 있다는 것을 의미
    - 로지스틱 분포는 생존 시간 T를 직접 모델링하고, 로그-로지스틱 분포는 생존 시간의 로그 log(T)를 모델링
    - **위치 파라미터 (μ)**: 분포의 중심을 결정 / **스케일 파라미터 (s)**: 분포의 폭을 결정
- **Normal and Log-Normal Distribution**: 위험률이 처음에는 증가하고 나중에는 감소하는 생존 패턴에 적합. 생존 시간 T 또는 그 로그 log(T)는 정규 분포를 따름.

### **Common Techniques**

- **Tobit 회귀**: censored data 를 포함하여 회귀 분석.
    - 잠재 변수 $y∗$ 를 도입
    - 일부 데이터가 0 이하로 제한되었을 때, 즉 하한선이 있을 때 사용. $y$ 는 $y*$ 가 0보다 클 때만 $y*$, 그렇지 않으면 0
    - $y∗=Xβ+ϵ,ϵ∼N(0,σ^2)$ , ϵ 는 오차항
- **Buckley-James 회귀**: censored data를 포함한 KM 추정 방법 기반의 회귀 분석.
    - KM 추정법을 기반으로 검열된 인스턴스의 생존 시간을 추정하고, 이를 이용하여 선형 모델을 만듦
- **Penalized 회귀**: 다중공선성 공변량이나 고차원 데이터를 처리하기 위한 가중치가 부여된 회귀 기법. 많은 변수 중 중요한 변수만 선택하여 복잡도를 줄이기
    - 각 방법은 가중치를 부여하여 데이터의 특성을 반영하고, 다중공선성 문제를 해결
    - **Weighted**: 데이터 포인트에 가중치를 부여하여 분석.
        - 특정 인스턴스에 더 높은 가중치를 부여하여 더 중요한 데이터에 더 큰 영향
        - $∑_{i=1}^nw_i(y_i−X_iβ)^2$

            
        $$
            \text{Objective: } \sum_{i=1}^{n} (Y_i - X_i \beta)^2 + \lambda \sum_{j=1}^{p} w_j |\beta_j|
            $$
            

    - **Structured**: 트리 기반 계층 구조와 그래프 기반 관계를 통해 데이터의 구조적 특성을 반영하여 가중치를 부여.
<details>
<summary>예시</summary>
- **Sparse Group Lasso**: 그룹 내에서 변수를 선택하면서도 그룹 간의 희소성을 유지
- **Graph-Guided Fused Lasso**: 그래프 구조를 반영하여 인접한 변수들의 계수를 비슷하게 유지
1. **Sparse Group Lasso**
    - **목적 함수**:
    $\operatorname*{min}_β(∑_{i=1}^n(y_i−X_iβ)^2+λ_1∑_{j=1}^p∣βj∣+λ_2∑_{g=1}^G∥βg∥_2)$
    - **특징**: 개별 변수와 그룹 간의 정규화를 동시에 수행하여, 변수 선택과 그룹 구조를 유지
2. **Graph-Guided Fused Lasso**
    - **목적 함수**:

        $\min⁡_β(∑_{i=1}^n(y_i−X_iβ)^2+λ_1∑_{j=1}^p∣β_j∣+λ_2∑_{(j,k)∈E}∣β_j−β_k∣)$

    - **특징**: 그래프 구조 E를 반영하여 인접한 변수들의 계수를 비슷하게 유지

</details>


### Accelerated Failure Time (AFT) 모델


생존 시간을 직접 모델링하여 공변량이 생존 시간에 미치는 영향을 분석함. 이 모델은 공변량이 생존 시간을 가속시키거나 지연시킨다고 가정

- 생존 시간 T의 로그와 공변량 X 간의 관계가 선형임을 가정. 생존 시간을 특정 공변량이 얼마나 빠르게 또는 느리게 변화시키는지를 분석
- $\ln(T)=Xβ+σϵ$
- 생존 시간 T의 로그가 공변량 X와 공변량의 계수 β, 그리고 오차 항ϵ의 선형 조합으로 표현
    - **ln(T)**: 생존 시간 T의 자연 로그
    - **X**: 공변량 행렬 (예: 나이, 성별, 혈압 등)
    - **β**: 공변량의 계수 벡터 (공변량이 생존 시간에 미치는 영향을 나타냄)
    - **σ**: 스케일 파라미터 (오차 항의 변동성을 조절)
    - **ϵ**: 생존 시간의 로그와 유사한 분포를 따르는 오차 항 (평균이 0이고, 특정 분포를 따름)
- **직관적인 해석**: AFT 모델은 생존 시간을 직접 모델링하므로, 공변량이 생존 시간에 미치는 영향을 더 직관적으로 해석 가능
- **다양한 분포 적용 가능**: AFT 모델은 생존 시간이 다양한 분포(예: 정규, 로그-정규, 와이블 등)를 따를 수 있도록 유연성을 제공
- **비모수적 모델의 대안**: 반모수적 Cox 모델과 달리, AFT 모델은 생존 시간을 직접 모델링하여 공변량의 효과를 더 명확하게 파악할 수 있음.
<details>
<summary>예제</summary>

어떤 약물의 효과가 환자의 생존 시간에 미치는 영향을 분석한다고 가정했을 때, AFT 모델을 사용하여 다음과 같은 분석을 수행할 수 있음

1. **공변량 X**: 약물 복용 여부 (1 = 복용, 0 = 비복용)
2. **생존 시간 T**: 환자가 생존한 기간 (개월 수)

AFT 모델을 적용하면, 약물을 복용한 환자와 복용하지 않은 환자의 생존 시간이 어떻게 다른지를 파악할 수 있음.


$\ln⁡(T)=β_0+β_1×(약물 복용 여부)+σϵ$


여기서 $β_1$이 양수라면 약물 복용이 생존 시간을 증가시킨다는 것을 의미.


ln(T)에 대해 덧셈적이지만 T에 대해 곱셈적 : $T=e^{Xβ}e^{σϵ}$


</details>


![](/assets/seminars/machine-learning-for-survival-analysis-a-survey-2019/5.png)


# Machine Learning Methods 


## Machine Learning Methods 


### **Survival Trees**


<u>censored data를 처리하도록</u> 조정된 분류 및 회귀 나무. 데이터를 재귀적으로 분할하여 유사한 생존 패턴을 가진 데이터를 동일한 노드에 배치

- 노드 내 동질성 최소화 (Minimizing Within-Node Homogeneity) : 각 노드 내의 데이터가 최대한 비슷하도록
- 노드 간 이질성 최대화 (Maximizing Between-Node Heterogeneity) : 서로 다른 노드 간 데이터가 최대한 다르도록

### **Bayesian Methods**


사전 확률과 사후 확률 간의 관계를 제공하여 이벤트 발생 확률을 계산.

- 베이즈 정리 기반 : $P(A∣B)= \frac{P(B∣A)⋅P(A)}{P(B)}$
    - $P(A∣B)$는 사건 B가 주어졌을 때 사건 A가 일어날 확률 (사후 확률).
    - $P(B∣A)$는 사건 A가 주어졌을 때 사건 B가 일어날 확률 (우도, Likelihood).
    - P(A)는 사건 A가 일어날 사전 확률(prior probability).
    - P(B)는 사건 B가 일어날 전체 확률.
<details>
<summary>**베이지안 생존 분석 (Bayesian Survival Analysis)은** Cox 모델과 같은 반모수적 모델을 베이지안 프레임워크 내에서 사용하여, 사전 분포와 데이터로부터 사후 분포를 추정</summary>
- **사전 분포 (Prior Distribution)**: 파라미터 β에 대해 사전 지식을 반영한 분포를 설정
    - **우도 (Likelihood)**: 관측된 생존 데이터로부터 우도를 계산.생존 시간에 대한 정보를 업데이트
    - **사후 분포 (Posterior Distribution)**: 베이즈 정리를 사용하여 사후 분포를 추정. 최종 예측을 얻음

        $P(β∣data)∝P(data∣β)⋅P(β)$


</details>

<details>
<summary>**나이브 베이즈 (Naïve Bayes, NB)**</summary>
- NB는 머신 러닝에서 널리 사용되는 확률적 방법 중 하나. 모든 특징이 독립적이라는 가정을 기반.  계산이 빠르고 간단하나, 특징 간의 상관관계를 무시하기 때문에, 현실 세계의 데이터에 완전히 맞지는 않음.

</details>

<details>
<summary>**베이지안 네트워크 (Bayesian Networks, BN)**</summary>

BN은 확률 변수 간의 조건부 종속성을 나타내는 그래픽 모델. 노드로 변수들을 나타내고, 간선으로 변수 간의 종속성을 나타냄. 복잡한 변수 간의 관계를 효과적으로 모델링. 계산 비용이 다소 높음


</details>


### **Neural Networks**: 인공 신경망을 사용하여 생존 데이터를 처리.

1. 환자의 특정 특성(예: 나이, 치료 유형 등)을 사용하여 생존 시간을 직접 예측
2. Cox PH 모델의 확장 : Cox 비례 위험 모델을 신경망으로 확장하여, 선형 모델 대신 비선형 모델을 사용함.
- **예시**: Faraggi와 Simon(1995)은 Cox 모델을 확장하여 신경망으로 만들었음. 복잡한 데이터에서도 생존 시간을 예측
1. 생존 확률이나 위험 확률을 신경망의 출력으로 사용

cf. 최신 딥러닝 기반 방법:

- **DeepSurv**: 딥 뉴럴 네트워크를 사용한 생존 분석 방법으로, 각 환자의 생존 곡선을 예측하는 데 사용
- **Dynamic-DeepHit**: Recurrent Neural Networks(RNNs)를 사용하여 시계열 생존 데이터를 모델링하고, 동적이고 복잡한 생존 함수를 추정
- **DeepHit**: 다중 사건 생존 분석을 위한 방법으로, 사건의 발생 시간을 예측

### **Support Vector Machines**: 서포트 벡터 머신을 이용하여 생존 데이터의 분류와 회귀 분석.

- **Support Vector Regression, SVR**
    - **SVR은 SVM을 회귀 문제에 적용.**
        - SVR은 일반적으로 ϵ-민감 손실 함수(ϵ-insensitive loss function)를 최소화하는 방식으로 작동
    - 단순히 이벤트가 발생한 경우만을 고려하면, 검열된 데이터의 순서 정보가 무시되는 단점
- **Constraint Classification Approach**
    - **censored data 를 처리하기 위해 순서 정보를 유지하는 방법**. 두 개의  인스턴스 간의 순서를 유지하는 제약을 SVM 공식에 추가
    - 이 알고리즘의 계산 복잡도는 인스턴스 수에 대해 제곱적으로 증가하므로 대규모 데이터셋에는 실용적이지 않음. 또한, 인스턴스 간의 순서만 고려하고 실제 출력 값을 무시함.
- **censored data를 위한 SVR (SVRc)**
    - censored data 를 위한 비대칭 손실 함수를 사용하는 SVR(SVRc)
    - Khan과 Zubek(2008)은 표준 SVR을 사용하면서 비대칭 손실 함수로 censored data를 처리하는 SVRc 제안
    - 검열되지 않은 인스턴스와 검열된 인스턴스를 모두 고려하여 모델링

**관련 기법: Relevance Vector Machine, RVM**

- SVM과 유사한 접근 방식을 사용하지만, 베이지안 추론을 활용하여 보다 확률적인 접근을 제공. 각 데이터 포인트에 대한 불확실성 고려
- RVM은 가중치에 대한 사전을 고려함. SVM과 달리 지역 최소값에 수렴할 수 있지만, 전역 최소값으로의 수렴을 보장하지는 않음
<details>
<summary>“순서 정보를 무시한다”의 의미</summary>
- 환자 A: 5개월 후 사망 (검열되지 않음)
- 환자 B: 8개월 후 사망 (검열되지 않음)
- 환자 C: 10개월 동안 생존했지만 아직 사망하지 않음 (검열됨)

환자 C가 환자 A와 B보다 더 오래 생존했다는 정보를 활용하지 않는다는 것


</details>


## **고급 머신 러닝 방법**


### **Ensemble Learning**: 여러 모델을 결합하여 예측 성능을 향상.

- **Random**: 무작위로 선택된 데이터 서브셋을 사용하여 다수결로 예측 결과를 결정. 모델 간 상관성을 줄이고 예측 성능 향상
<details>
<summary>progress</summary>
1. 주어진 데이터셋에서 B개의 부트스트랩 샘플을 무작위로 추출. 약 37%의 데이터는 각 샘플에서 제외되므로 이를 Out-Of-Bag (OOB) 데이터라고 함
2. 각 샘플에 대해 생존 트리를 구축. 후보 속성을 무작위로 선택하고 분할 기준에 따라 노드를 분할하여 자식 노드 간의 생존 차이를 최대화
3. 터미널 노드의 크기가 특정 이벤트 수 이상이 되도록 전체 트리를 구축
4. 비모수적 Nelson-Aalen 추정기를 사용하여 OOB 데이터의 누적 위험 함수를 계산. 각 트리의 CHF(누적 위험 함수)를 평균하여 앙상블 CHF를 구함.

![Snider, Brett & McBean, Edward. (2022). Assessing the Impact of Pipe Rehabilitation on Decreasing Watermain Break Rates Using Random Survival Forest Models. Water Resources Management. 148. 10.1061/(ASCE)WR.1943-5452.0001579.](/assets/seminars/machine-learning-for-survival-analysis-a-survey-2019/6.png)


</details>

- **Bagging**: 여러 부트스트랩 샘플에서 모델을 학습하고 평균 예측 결과를 사용.
<details>
<summary>progress</summary>
1. 주어진 데이터로부터 B개의 부트스트랩 샘플을 무작위로 추출.
2. 각 부트스트랩 샘플에 대해 생존 트리를 구축. 모든 터미널 노드의 이벤트 수가 임계값 d 이상이 되도록 보장.
3. 각 트리에서 리프 노드의 생존 함수를 추정. Kaplan-Meier 추정기를 사용하여 생존 함수를 추정하며, 같은 노드 내의 모든 데이터는 동일한 생존 함수를 가지는 것으로 가정

</details>

- **Boosting**: 순차적으로 모델을 학습하여 이전 모델의 오차를 줄이는 방향으로 조정. 잔차를 반복적으로 맞추는 방식으로 작동
<details>
<summary>progress</summary>
- 초기 잔차 $U_i$를 설정하고, 첫 번째 모델 $f_0$를 초기화합니다.
- 업데이트된 잔차 $U_i$를 사용하여 학습기를 반복적으로 맞춤
- 각 단계에서 예측 모델을 업데이트하고, 이 과정을 M번 반복

</details>


![https://encord.com/blog/what-is-ensemble-learning/](/assets/seminars/machine-learning-for-survival-analysis-a-survey-2019/7.png)


### **Active Learning**: 모델 학습을 위한 데이터 샘플링을 최적화.

- 주어진 데이터 중에서 가장 유용한 데이터를 선택하여 모델의 성능을 향상
    - Active Regularized Cox Regression (ARC)
<details>
<summary>progress</summary>
1. 초기 모델 만들기: 이미 레이블이 달린 데이터를 사용해서 초기 생존 분석 모델을 제작
2. 예측 : 레이블이 없는 데이터에 대해 예측. 중요한 것은 모델이 어떤 데이터 포인트가 더 많은 정보를 줄 수 있을지를 판단하는 것
3. 유용한 데이터 선택: 모델이 예측한 결과를 바탕으로, 가장 도움이 될 것 같은 데이터 포인트를 선택. 즉, 모델이 예측하기 어려운 데이터를 선택하는 것
4. 전문가에게 선택한 데이터에 대한 레이블 요청
5. 롭게 얻은 레이블 데이터를 모델에 추가, 모델 업데이트

### 4. 전문가에게 레이블 요청


선택한 데이터를 전문가에게 보내어 실제 값을 알아냅니다. 예를 들어, 병원에서 환자의 생존 시간을 기록해 달라고 요청하는 것입니다.


### 5. 모델 업데이트


새롭게 얻은 레이블 데이터를 모델에 추가하고, 이를 바탕으로 다시 학습시킵니다. 이렇게 하면 모델이 더 많은 정보를 가지고 더 정확하게 예측할 수 있습니다.


</details>


### **Transfer Learning**: 다른 관련 문제에서 학습된 모델을 재사용하여 학습.

- 생존 분석에서 레이블된 데이터를 충분히 확보하기 위해서는 많은 사건이 발생할 때까지 기다려야 함. 즉, 모델 구축에 많은 시간이 소요됨.
- 보조 데이터(auxiliary data)가 목표 데이터와 다른 분포를 가지기 때문에 단순 데이터 통합 X, Transfer learning 적용 필요
- **Transfer Learning:** 적은 데이터로도 높은 성능을 유지할 수 있도록 도와줌
- Transfer-Cox 모델 : 생존 분석에서 소스 도메인(source domain)으로부터 타겟 도메인(target domain)으로 지식 전이, 성능 향상
    - **특징 선택**: $L_{2,1}$-norm 정규화를 사용하여 소스와 타겟 도메인의 손실 함수 합계를 최소화
    - **공유 표현 학습**: 두 도메인 간의 공통된 특징을 학습. 타겟 도메인의 성능 향상

![https://www.v7labs.com/blog/transfer-learning-guide](/assets/seminars/machine-learning-for-survival-analysis-a-survey-2019/8.png)


### **Multitask Learning**: 여러 관련 작업을 동시에 학습하여 모델의 일반화를 향상


Multitask Learning Model for Survival Analysis (MTLSA) : 여러 생존 문제를 동시에 풀어서 성능을 높이는 방법

- 각 데이터 포인트에 대해 여러 해 동안 사건이 발생했는지를 표시하는 표를 제작
- 정규화 기법을 사용하여 여러 해의 데이터를 동시에 분석하여 공통된 패턴을 학습
<details>
<summary>progress</summary>
- 문제:생존 분석에서 중요한 문제는 어떤 사건이 발생할 때까지의 시간을 예측하는 것. 하지만 사건이 발생하지 않은 검열된 데이터가 포함되어 있음.
- 데이터를 변환: 각 데이터 포인트마다 사건이 특정 시간 이전에 발생했는지 여부를 표시하는 표를 제작. 예를 들어, 5년 동안 데이터를 추적했으면, 각 데이터 포인트에 대해 5개의 열이 있는 표를 만들기. 각 열에는 그 해에 사건이 발생했는지 표시
    - 원래의 사건 레이블을 $N×K$ 지표 행렬 $I$로 변환. 여기서 K는 데이터셋의 최대 추적 시간. 지표 행렬의 요소 $I_{ij}$는 인스턴스 i가 시간 $y_j$ 이전에 사건이 발생했으면 1, 그렇지 않으면 0

    ![](/assets/seminars/machine-learning-for-survival-analysis-a-survey-2019/9.png)

- 여러 해의 데이터를 동시에 분석하여 공통된 패턴을 찾음. 다양한 시간 지점에서의 결과 간의 관계를 학습
- censored data 와 uncensored data 동시 학습
- 사건이 한 번만 발생하는 특성 반영(비재발 사건 특성)
- 정규화 기법을 사용하여  관련 작업 간의 공통 표현을 학습

</details>


![https://medium.com/@anilmatcha/summary-for-multitask-learning-by-rich-caruana-34427f7c7a87](/assets/seminars/machine-learning-for-survival-analysis-a-survey-2019/10.png)


# Evaluation Metrics


생존 분석에서는 censored data 가 많기 때문에 일반적인 회귀 평가 지표(예: 평균 제곱근 오차(RMSE)나 결정계수(R²))는 적합하지 않음.


## C-index (Concordance Index)


두 인스턴스 간의 상대적 위험을 비교하여 사건 발생 순서를 평가함. 절대적인 생존 시간을 평가하는 대신, 사건 발생의 순서를 고려.

- **모든 가능한 쌍 비교**: 예측 순서와 실제 순서가 일치하는지 확인
- **Concordance 계산**: 비교 가능한 모든 쌍에 대해 예측된 생존 시간과 실제 생존 시간을 비교하여, Concordant 쌍(순서가 일치하는 쌍)과 Discordant 쌍(순서가 일치하지 않는 쌍)을 식별
    - Concordant 쌍의 비율을 계산하여 C-index를 구하기
    - $\frac{Concordant 쌍의 수}{비교 가능한 모든 쌍의 수}$

![](/assets/seminars/machine-learning-for-survival-analysis-a-survey-2019/11.png)

- (a) uncensored data : 모든 쌍의 비교가 가능하여 더 많은 데이터를 사용
    - 모든 쌍에 대해 Concordance Probability를 계산 가능
- (b) censored data: 일부 쌍의 비교가 불가능하여, 사용할 수 있는 데이터가 줄어듦
    - 총 6개의 쌍만 비교 가능. 비교 가능한 쌍에 대해서만 Concordance Probability를 계산
- **두 가지 시나리오 고려**
    1. 두 인스턴스 모두 검열되지 않은 경우.
    2. 검열된 인스턴스의 관측된 사건 시간이 검열되지 않은 인스턴스의 사건 시간보다 작은 경우.

### 수식 19: Concordance Probability 



$$
c=Pr(\hat{y}_1>\hat{y}_2∣y_1≥y_2)
$$


- $\hat{y}_1,\hat{y}_2$: 모델이 예측한 생존 시간
- $y_1, y_2$: 실제 관측된 생존 시간
- c: 두 인스턴스 간의 예측 순위가 실제 관측된 순위와 일치할 확률
    - 실제 생존 시간이 $y_1≥y_2$일 때, 예측된 생존 시간 $\hat{y}_1$이 $\hat{y}_2$보다 클 확률

### <u>C-index 계산 방법</u>


**수식 20: 위험 비율(hazard ratio)을 사용하는 경우**


사건이 발생한 인스턴스 i와 그렇지 않은 인스턴스 j 간의 비교에서, 모델의 예측이 실제 순서와 일치하는지 평가함.



$$
\hat{c}=\frac{1}{num}∑_{i:δ_i=1}∑_{j:y_i<y_j}I[X_i\hat{β}>X_j\hat{β}]
$$


- num: 비교 가능한 모든 쌍의 수
- $δ_i$: 인스턴스 i 의 사건 발생 여부 (1: 사건 발생, 0: 사건 미발생)
- $X_i,X_j$: 인스턴스 i와 j의 특징 벡터. 모델이 예측에 사용하는 모든 입력 변수를 포함
- $\hat{β}$: 모델이 학습한 파라미터. 위험 비율(hazard ratio)을 계산하는 데 사용
- $X_i\beta$ :사례 i의 예측된 위험 점수
- $I[⋅]$: Indicator function (조건이 참이면 1, 거짓이면 0)
    - $X_i\hat{β}>X_j\hat{β}$  가 참이면 1 반환

**수식 21: 생존 시간을 활용하는 C-index**



$$
\hat{c}=\frac{1}{num}∑_{i:δ_i=1}∑_{j:y_i<y_j}I[S(\hat{y}_j∣X_j)>S(\hat{y}_i∣X_i)]
$$


- S(⋅): 생존 확률 함수. 모델이 특정 시간까지 생존할 확률을 예측.
    - 사건이 발생한 인스턴스 i와 그렇지 않은 인스턴스 j 간의 비교에서, 예측된 생존 확률이 실제 순서와 일치하는지 평가
    - 각 쌍의 생존 확률을 비교하여 C-index를 계산

### Supplemental : 시간 의존적 AUC



$$
AUC(t)=P(\hat{y}_i<\hat{y}_j∣y_i<t,y_j>t)=\frac{1}{num(t)}∑_{i:y_i<t}∑_{j:y_j>t}I(\hat{y}_i<\hat{y}_j)
$$


- t: 특정 생존 시간
- num(t): 시간 t에서 비교 가능한 쌍의 수
- 시간 t에서의 시간 의존적인 AUC : 특정 시간 점에서의 모델의 예측 성능. 시간에 따라 달라질 수 있는 모델 성능을 평가
- $P(\hat{y}_i<\hat{y}_j∣y_i<t,y_j>t)$ : 실제 생존 시간이 t보다 짧은 경우와 t보다 긴 경우의 예측 값이 얼마나 일치하는지를 나타내는 확률.
- 시간 t에서 비교 가능한 모든 쌍을 고려

### Supplemental : 시간 의존적 C-Index



$$
c_{t∗}=\frac{1}{num}∑_{i:δ_i=1}∑_{j:y_i<y_j}I(\hat{y}_i<\hat{y}_j)=\frac{∑_{t∈T_s}AUC(t)⋅num(t)}{num}
$$


- Ts: 모든 가능한 생존 시간의 집합
- 시간 의존적인 AUC 값을 사용하여 전체 기간에 걸친 C-index를 계산. 이는 주어진 기간 동안의 예측 일치도를 나타낸다.
- 사건이 발생한 $(δ_i=1)$ 모든 관측치 i와 비교 가능한 모든 관측치 j를 포함
    - $y_i<y_j$: 실제 생존 시간 $y_i$가 $y_j$보다 짧은 경우.
- 모든 가능한 생존 시간 t에서의 AUC 값을 가중합
- 특정 시간 점에서의 예측 성능을 고려해, <u>전체 기간에 걸친</u> 일치도를 계산

## Brier Score


브라이어 점수(Brier Score, BS)는 예측 모델의 부정확성을 평가하는 지표로, 생존 분석에서도 사용됨. 가중치를 통해 censored data 반영 가능

- 모델이 특정 시간까지 생존할 확률을 얼마나 정확하게 예측하는지를 평가
- 주어진 시점에서 예측된 확률과 실제 결과 간의 제곱 오차를 기반으로 함.


$$
BS(t)=\frac{1}{N}∑_{i=1}^N[\hat{y}_i(t)−y_i(t)]^2
$$


- N: 전체 인스턴스의 수
- $\hat{y}_i(t)$: 시간 t에서의 예측된 결과. 특정 시점까지 생존할 확률
- $y_i(t)$: 시간 t에서의 실제 결과. 실제로 사건이 발생했는지(1) 아니면 발생하지 않았는지(0)
- 각 인스턴스의 예측된 값과 실제 값의 차이를 제곱한 후, 이를 모든 데이터 포인트에 대해 평균을 내어 모델의 예측 부정확성을 평가

### 수식 23: censored data 가 포함된 Brier Score



$$
BS(t)=\frac{1}{N}∑_{i=1}^Nw_i(t)[\hat{y}_i(t)−y_i(t)]^2
$$


- $w_i(t)$: 각 인스턴스 i에 대한 가중치. 검열 정보를 반영하여 계산
    - 각 인스턴스의 기여도를 조정하여 검열된 데이터가 예측 평가에 미치는 영향을 고려

### 수식 24: 가중치 $w_i(t)$



$$
w_i(t)= \begin{cases}\delta_i / G\left(y_i\right) & \text { if } y_i \leq t \\ 1 / G\left(y_i\right) & \text { if } y_i>t\end{cases}
$$


- $δ_i$ : 사건 발생 여부를 나타내는 지표. 사건이 발생한 경우 1, 발생하지 않은 경우 0
- $G(y_i)$: 검열 분포 G의 Kaplan-Meier 추정치. 각 시간 $y_i$에서 검열된 데이터의 분포
- $y_i≤t$: 사건이 시간 t 이전에 발생한 경우, 가중치는 $δ_i/G(yi)$로 계산
    - 사건이 발생한 데이터의 중요도를 반영
- $y_i>t$: 사건이 시간 t 이후에 발생한 경우, 가중치는 $1/G(y_i)$로 계산
    - 각 인스턴스의 예측 오차에 가중치를 적용하고, 이를 시간에 걸쳐 평균화
    - 사건이 발생하지 않은 데이터의 중요도를 반영하여 가중치를 계산
- 이를 통해 사건 발생 시간과 검열 정보를 고려하여 각 인스턴스의 기여도를 조정

### Supplemental: IBS (Integrated Brier Score)



$$
IBS=\frac{1}{N}∑_{i=1}^N \int_0^{t*} w_i(t)[\hat{y}_i(t)−y_i(t)]^2 dW(t)
$$



**IBS (Integrated Brier Score)**: 주어진 시간 간격(0,t∗) 동안 예측 오류를 평균화한 값.

- 모델의 예측 성능을 시간 간격 (0,t∗) 전체에 걸쳐 평가하는 지표
- **dW(t)**: 가중 함수
    - 일반적으로 $W(t)=t/t∗$ 또는 $W(t)=(1−S^(t))/(1−S^(t∗))$로 설정

## Mean Absolute Error, MAE

- 예측된 시간 값과 실제 관측된 시간 값 간의 차이의 평균
- 사건이 발생한 데이터에만 초점을 맞추어 계산


$$
MAE=\frac{1}{N}∑_{i=1}^N(δ_i∣y_i−\hat{y}_i∣)
$$


- **사건이 발생한 데이터 포인트만 고려 :** $δ_i=1$인 데이터 포인트만 고려
- 각 데이터 포인트에 대해 예측된 시간과 실제 시간 간의 차이를 절대값으로 계산
    - $y_i$: 각 데이터 포인트의 실제 사건 발생 시간
    - $\hat{y}_i$: 모델이 예측한 사건 발생 시간

# Related Topics


## Early Prediction


초기 단계에서 제한된 데이터를 사용하여 이벤트 발생 시간을 예측하는 방법

- **장기 데이터 수집의 어려움**
- **조기 예측의 중요성**: 조기 단계에서 예측을 통해 빠른 결정을 내릴 수 있는 능력이 중요합니다. 예를 들어, 새로운 치료법의 효과를 빠르게 평가하는 것이 필요함.
- **ESP (Early Stage Prediction) 접근법**: 조기 단계에서 수집된 데이터를 기반으로 이벤트 발생 시간을 예측
- **두 단계 알고리즘**: (i) 초기 단계 데이터로 조건부 확률 분포를 추정, (ii) AFT 모델을 사용하여 미래의 확률을 외삽(extrapolation)
    - 1) 초기 데이터(조기 관찰된 데이터)를 사용하여 특정 시간까지 사건이 발생할 확률을 추정
    - 2) 초기 단계에서 수집된 이벤트 발생 정보를 사용하여 미래에 어떤 사건이 발생할 확률(미래 시점의 사전 확률)을 추정
    - cf. extrapolation : 주어진 데이터 범위 밖의 미래 시점에 대해 확률을 예측하는 것을 의미
    - cf. AFT(Accelerated Failure Time) 모델: 시간의 흐름을 고려하여 사건이 언제 발생할지 예측
    - 예시: 초기 단계에서 추정한 조건부 확률 분포를 기반으로, 향후 1년 내에 사건이 발생할 확률을 예측

## Data Transformation

- 이벤트 정보의 불완전성 때문에 모델 학습이 어려운 경우 많음
- **Uncensoring 접근법**: 검열된 데이터의 정보 손실을 줄이기 위해 검열된 데이터를 변환
    - Delettion
    - Treating as Non-Events
    - Zupan et al. (2000)의 방법 : events / non-event / duplicated 로 처리
<details>
<summary>데이터를 복제하여 각각 다른 라벨을 할당하고 가중치를 부여함으로써 검열된 데이터를 두 가지 가능성으로 분류</summary>
- 사전 정의된 시점보다 이후에 검열된 인스턴스는 "이벤트 미발생"으로 라벨링
- 사전 정의된 시점보다 이전에 검열된 인스턴스는 두 번 복사. 하나는 event, 하나는 non-event 로 라벨링
    - Kaplan-Meier (KM) 방법으로 추정된 사건 발생의 주변 확률로 가중치가 부여

</details>

<details>
<summary>Fard et al. (2016) : 사건 발생 확률과 검열될 확률을 비교하여 검열된 데이터를 적절히 라벨링</summary>
- 사건 발생 확률과 censored 될 확률을 KM 추정기로 추정
    - 각 검열된 인스턴스에 대해 사건 발생 확률과 검열될 확률을 KM 추정기를 사용하여 계산
    - 데이터의 각 인스턴스에 대해 사건 발생 확률이 검열될 확률보다 높으면 "이벤트 발생"으로 라벨링

</details>

- **Calibration 접근법**:  최적의 사건 발생 시간을 학습하여 검열된 데이터에 레이블을 부여
    - Vinzamuri et al. (2017): 검열된 인스턴스 간의 상관관계를 포착하고, 이를 기반으로 보정된 사건 발생 시간을 학습
    - Normalized Inverse Covariance Substitution and Row-wise and Column-wise Correlation Adjustment

## Complex Events


단순한 생존 분석 문제보다 더 많은 변수와 상황을 고려해야 하는 복잡한 문제


### **Competing Risks** 

- **정의**: 다양한 유형의 사건이 동시에 발생할 가능성이 있는 경우.  이러한 경우, 하나의 사건이 발생하면 다른 사건의 발생을 막는 역할을 함.
- **예시**: 환자가 심장마비와 폐암 중 하나로 사망할 수 있지만, 둘 다 동시에 발생할 수는 없음
    - In this case, competing risks are events that prevent an event of interest from occurring, which is different from censoring.
    - censoring의 경우, 관심 사건이 나중에 발생할 수 있지만, Competing Risks 에서는 관심 사건이 발생하지 않게 됨

사건이 여러 가지로 나뉘며, 각 사건이 서로의 발생을 막는 역할을 할 때 사용되는 두 가지 주요 접근법인 CIF와 Subdistribution Hazard

- CIF (Cumulative Incidence Function) : 특정 시간까지 특정 유형의 사건이 발생할 누적 확률을 계산하는 함수. 각 사건 유형별로 발생 확률을 추정


$$
CIF_k(t)=Pr(T≤t,event \ type=k)
$$


- Subdistribution Hazard : 특정 유형의 사건이 발생할 위험을 직접 모델링
    - 각 사건 유형별로 별도의 위험 비율을 계산
    - 각 사건의 상대적인 위험을 파악


$$
λ_k(t)=lim_{Δt→0}\frac{Pr(t≤T<t+Δt,event \ type=k∣T≥t)}{Δt}
$$



### Supplemental : Cumulative Incidence Curve (CIC)


경쟁 위험을 고려한 마진 확률을 추정하기 위해 사용



$$
CIC_q(t)=∑_{j:t_j≤t}\hat{S}(t_{j−1})\hat{h}_q(t_j)=∑_{j:t_j≤t}\hat{S}(t_{j−1})\frac{n_{qj}}{n_j}
$$


- $\hat{S}(t_{j−1})$: 이전 시간 $t_{j−1}$에서의 생존 확률.
- $\hat{h}_q(t_j)$: 시간 $t_j$에서 이벤트 q에 대한 위험 추정치.
- $n_{qj}$: 시간 $t_j$에서 이벤트 q의 이벤트 수.
- $n_j$: 시간 $t_j$에서 이벤트를 경험할 위험이 있는 인스턴스 수.

### Supplemental : Lunn-McNeil (LM) 

- 단일 Cox PH 모델을 적합시켜 경쟁 위험을 분석
- 확장된 데이터를 사용하여 각 이벤트에 대한 더미 변수를 생성하여 다른 경쟁 위험을 구별
- 통계적 추론을 수행하는 유연성을 제공

### Recurrent Events

- **정의**: 관찰 기간 동안 동일한 유형의 이벤트가 여러 번 발생하는 경우.
- **예시**: 환자가 여러 번 입원하는 경우.
- Counting Process (CP) 알고리즘, stratified Cox 등 활용 가능

### Supplemental

- Recurrent Events 에 대한 주요 접근법
    - Counting Process (CP) : 반복 이벤트의 각 시간 간격을 독립적인 기록으로 처리하고, 생존 분석에서 기본적인 Cox 모델을 사용하여 분석
    - **Stratified Cox 방법**은 이벤트 발생 순서를 구분하기 위해 데이터 형식을 다르게 사용하며, 각 방법은 이벤트 발생 순서와 독립성에 대한 가정을 다르게 적용
        - Stratified CP : 첫 번째 이벤트의 시간에 따라 이후 이벤트의 위험 수준을 조정
        - Marginal : 반복 이벤트가 없는 일반적인 생존 데이터처럼 준비하며, 각 이벤트가 독립적이라고 가정
        - Gap Time은 이전 이벤트로부터의 시간 간격을 사용하여 위험 집합을 구성
            - 각 이벤트의 시작 시간을 0으로 설정하고, 이전 이벤트로부터의 시간을 종료 시간으로 사용

# APPLICATION DOMAINS


![](/assets/seminars/machine-learning-for-survival-analysis-a-survey-2019/12.png)

<details>
<summary>해설</summary>

### 7.1 헬스케어 (Healthcare)


**관심 이벤트**:

- 재입원 (Rehospitalization)
- 질병 재발 (Disease recurrence)
- 암 생존율 (Cancer survival)

**예측 목표**:

- 퇴원 후 특정 일 내에 재입원할 확률
- 특정 기간 내에 질병이 재발할 확률
- 암 환자의 생존 확률

**특징**:

- 인구통계학적 데이터: 나이, 성별, 인종
- 임상 데이터: 병력, 치료 과정, 바이오마커

### 7.2 신뢰성 (Reliability)


**관심 이벤트**:

- 장치 고장 (Device failure)

**예측 목표**:

- 장치가 고장 날 확률 및 시간 예측

**특징**:

- 환경 조건: 온도, 습도
- 장치 특성: 제조사, 모델, 사용 시간

### 7.3 크라우드펀딩 (Crowdfunding)


**관심 이벤트**:

- 프로젝트 성공 (Project success)

**예측 목표**:

- 프로젝트가 목표 금액을 달성할 확률 예측

**특징**:

- 프로젝트 특성: 목표 금액, 지속 기간, 카테고리
- 크리에이터 특성: 과거 성공 여부, 위치

### 7.4 사기 탐지 (Fraud Detection)


**관심 이벤트**:

- 사기 거래 발생 (Occurrence of fraudulent transactions)

**예측 목표**:

- 특정 거래가 사기일 확률 예측

**특징**:

- 거래 데이터: 거래 금액, 빈도, 위치
- 고객 데이터: 과거 사기 이력

### 7.5 추천 시스템 (Recommendation Systems)


**관심 이벤트**:

- 콘텐츠 소비 (Consumption of content)

**예측 목표**:

- 사용자가 특정 콘텐츠를 소비할 확률 예측

**특징**:

- 사용자 데이터: 선호도, 과거 시청/청취 기록
- 콘텐츠 특성: 장르, 인기

### 7.6 고객 이탈 예측 (Churn Prediction)


**관심 이벤트**:

- 고객 이탈 (Customer churn)

**예측 목표**:

- 고객이 서비스를 중단할 확률 예측

**특징**:

- 고객 사용 패턴: 서비스 이용 빈도, 만족도
- 고객 특성: 계약 기간, 고객 서비스 이력

### 7.7 소셜 네트워크 분석 (Social Network Analysis)


**관심 이벤트**:

- 사용자 상호작용 (User interactions)

**예측 목표**:

- 특정 이벤트(예: 게시물 공유, 팔로우 등)의 발생 확률 예측

**특징**:

- 상호작용 데이터: 빈도, 반응
- 사용자 프로필: 나이, 위치

### 7.8 자연어 처리 (Natural Language Processing)


**관심 이벤트**:

- 텍스트 기반 이벤트 (Text-based events)

**예측 목표**:

- 특정 단어 사용, 문서 업데이트 등의 이벤트 발생 확률 예측

**특징**:

- 텍스트 특성: 길이, 단어 빈도, 감정 점수
- 주제 특성: 텍스트의 주제, 카테고리

</details>
