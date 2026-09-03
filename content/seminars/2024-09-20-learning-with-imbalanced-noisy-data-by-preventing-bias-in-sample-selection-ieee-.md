---
date: 2024-09-20
title: Learning with Imbalanced Noisy Data by Preventing Bias in Sample Selection (IEEE Trans. Multimed. 2024)
category: Paper Review
presenter: Jae Hun Cho
url: https://www.notion.so/360723a523d24f1bbda8ce9ac42badc0
keywords: classification, Noisy label learning, Sample selection, Class imbalance
---

# Selected Paper


## Title: Learning with Imbalanced Noisy Data by Preventing Bias in Sample Selection


## Abstract: 


Learning with noisy labels has gained increasing attention because the inevitable imperfect labels in real-world scenarios can substantially hurt the deep model performance. Recent studies tend to regard low-loss samples as clean ones and discard high-loss ones to alleviate the negative impact of noisy labels. However, real-world datasets contain not only noisy labels but also class imbalance. The imbalance issue is prone to causing failure in the loss-based sample selection since the under learning of tail classes also leans to produce high losses. To this end, we propose a simple yet effective method to address noisy labels in imbalanced datasets. Specifically, we propose Class-Balance-based sample Selection (CBS) to prevent the tail class samples from being neglected during training. We propose Confidence-based Sample Augmentation (CSA) for the chosen clean samples to enhance their reliability in the training process. To exploit selected noisy samples, we resort to prediction history to rectify labels of noisy samples. Moreover, we introduce the Average C onfidence Margin (ACM) metric to measure the quality of corrected labels by leveraging the model's evolving training dynamics, thereby ensuring that low-quality corrected noisy samples are appropriately masked out. Lastly, consistency regularization is imposed on filtered label-corrected noisy samples to boost model performance. Comprehensive experimental results on synthetic and real-world datasets demonstrate the effectiveness and superiority of our proposed method, especially in imbalanced scenarios.


[https://ieeexplore.ieee.org/abstract/document/10443531](https://ieeexplore.ieee.org/abstract/document/10443531)


# Paper Review


## Introduction


### **Class Imbalance**


![](/assets/seminars/learning-with-imbalanced-noisy-data-by-preventing-bias-in-sample-selection-ieee-/0.png)

- 정의 : Dataset에서 특정 class의 sample 수가 다른 class들에 비해 현저히 적거나 많은 상황
- 원인 : 특정 현상이나 질병이 드문 경우, 수집 과정의 편향
- 모델이 다수 classes (**Head classes)**에 과도하게 학습하여, 소수 class(**Tail classes)**의 예측 성능이 저하됨

### **Noisy Labels**


![](/assets/seminars/learning-with-imbalanced-noisy-data-by-preventing-bias-in-sample-selection-ieee-/1.png)

- 정의 : 실제 데이터의 feature과 일치하지 않는 data의 레이블
- 원인 : 자동화 라벨링 시스템의 한계나 기술적 오류, 복잡하거나 모호한 데이터로 인해 명확한 레이블 지정의 어려움, 라벨링 비용으로 인한 web image search engine 등으로 데이터셋 구성
- 노이즈 레이블을 학습하여 일반화 성능 저하

| **방법론**              | **주요 전략**                                           | **문제점**                                                                  |
| -------------------- | --------------------------------------------------- | ------------------------------------------------------------------------ |
| **Label Correction** | 노이즈 전이 매트릭스나 모델 예측을 사용하여 노이즈 레이블을 수정                | 일반적으로 추정된 노이즈 전이 행렬과 모델 예측의 불완전성과 불확실성으로 인해 오류가 누적될 위험이 있음               |
| **Sample Selection** | loss가 작은 sample을 clean sample로 간주하고, 노이즈 sample을 제거 | 실제 real-world dataset에 있는 class imbalance으로 인해 head classes에 대한 편향 문제 발생 |


![](/assets/seminars/learning-with-imbalanced-noisy-data-by-preventing-bias-in-sample-selection-ieee-/2.png)

- 기존 손실 기반 sample 선택 방법(ex : Co-teaching) : 불균형한 데이터에서 소수 클래스의 clean sample이 다수 클래스의 노이즈 sample보다 더 큰 손실을 보여 소수 클래스의 clean sample이 제거되고 다수 클래스의 noisy sample이 선택될 수 있음
- 이로 인해 소수 클래스의 학습이 제대로 이루어지지 않아 소수 클래스의 성능이 저하되는 결과를 초래할 수 있음
- 따라서 class imbalance와 noisy label를 동시에 고려하는 Class-Balance-based sample Selection 방법론을 제안함

## Related Work


### Learning with noisy label


![](/assets/seminars/learning-with-imbalanced-noisy-data-by-preventing-bias-in-sample-selection-ieee-/3.png)


### Class imbalance

- 이전 연구들은 주로  class imbalance을 해결하기 위해 sample re-weighting strategy 사용
    - Tail classes에 더 큰 가중치를 부여하고, head classes에는 더 작은 가중치를 부여함
        - gradient directions을 기반으로 sample에 다른 weights를 부여함
        - meta-learning 기반의  sample weighting function 제안
- 그러나 기존 접근 방식들은 노이즈가 포함된 imbalance 데이터 학습 시 취약함
    - 노이즈 sample과 tail classes sample 모두 높은 loss를 가짐
    - 이때 노이즈 sample은 더 작은 weight가 필요하고, tail classes sample은 더 큰 weight가 필요하기 때문

## Methods


### **Preliminaries**

- $D_{\text{train}} = \{(x_i, y_i)|i = 1, \ldots, N\}$: N개의 sample로 구성된 노이즈가 있는 C-클래스 Dataset
    - $x_i$: $i$ 번째 이미지
    - $y_i \in \{0, 1\}^C$ : 노이즈가 있을 수 있는 $i$ 번째 레이블
    - $y^*_i: x_i$의 실제 레이블
    - $D_c$ : Clean subset / $D_n$ : Noisy subset
        - $D_c = \{(x_i, y_i) \in D_{train} | y_i = y^*_i\}$
        - $D_n = \{(x_i, y_i) \in D_{train} | y_i \neq y^*_i\}$
- $F(\cdot, \theta)$: 매개변수 $\theta$로 가지는 Model
- $L(F(x, \theta), y)$

    
$$
L(F(x, \theta), y) = \frac{1}{N} \sum_{i=1}^{N} l_{\text{ce}}(x_i, y_i) = -\frac{1}{N} \sum_{i=1}^{N} \sum_{c=1}^{C} y_{c,i} \log(p_c(x_i, \theta))
$$
    

    - $l_{\text{ce}}$: Cross entropy loss
    - $p_c(x_i, \theta)$ : $i$ 번째 훈련 sample $x_i$에 대한 $c$ 번째 클래스의 예측 softmax 확률

![](/assets/seminars/learning-with-imbalanced-noisy-data-by-preventing-bias-in-sample-selection-ieee-/4.png)


### **Class-Balance-Based Sample Selection**

- Deep neural network의 memorization effect로 인해, 기존 연구들은 낮은 loss sample을 clean sample로 가정하고 있음
    - 이러한 방법은 class imbalance가 있는 경우 학습 편향 문제로 일반화 성능이 떨어짐
    - 현재의 sample selection 방법들이 class imbalance에서 clean sample과 noisy sample을 구별하는 데 어려움을 겪음
- 따라서 Class-Balance-Based Sample Selection (CBS) 제안
1. Loss Normalization: 모든 sample들의 loss가 $[0, 1]$ 구간 내에 위치하도록 조정하는 과정

    
$$
l(F(x, \theta), y) = \frac{l_{ce} - \min\{l_{ce}\}}{\max\{l_{ce}\} - \min\{l_{ce}\}}
$$
    

    - $l_{ce}= l_{ce}(F(x, \theta), y), (x, y) \in D_{train}$
2. Sample selection 수 설정
    - $D_{sub_i}$: i-번째 class의 sample들의 subset
    - 상위 $\left\lfloor \rho \frac{|D_{train}|}{C} \right\rfloor$ small loss sample = clean sample
    - $\rho = 1 - \eta$
    - $\eta$ : 노이즈 비율 (hyperparameter)
    - $\delta = \min\left(\left\lfloor \rho \frac{|D_{train}|}{C} \right\rfloor, |D_{sub_i}| \right)$: 선택할 최대 sample 수
3. clean sample selection:
    - $i$-번째 class의 sample $D_{sub_i}$에서 손실이 가장 작은 것을 찾아서, $|D'{c_i}|$의 크기가 $\delta$인 subset $D'_{c_i}$를 선택

    
$$
D_{c_i} = \argmin_{D'{c_i} \subseteq D{sub_i} : |D'{c_i}| = \delta, (x_j, y_j) \in D{sub_i}} l_{ce}(F(x_j, \theta), y_j)
$$
    

    - $D_c = \bigcup_{i=1}^{C} D_{c_i}$ : clean subset
    - $D_n = D_{train} - D_c$ : 노이즈 subset
- Loss normalization를 통해 class 간 loss 차이를 줄여 sample selection의 비교를 쉽게 하도록 만듦
- Class 별 sample selection으로 각 class imbalance 문제를 완화하고 모델 성능을 향상

### **Confidence-Based Sample Augmentation**

- Class imbalance와 noisy label 문제를 해결하기 위해 CBS 방법 제안하였음
- 하지만 일부 노이즈 sample이 잘못 선택되어 clean sample로 분류될 수 있는 한계 존재

⇒ 선택된 clean sample의 신뢰성을 높이기 위해 Confidence-Based Sample Augmentation (CSA) 방법을 제안

1. $(x_i, y_i) \in D_c$에서 sample을 선택한 후, 다른 sample $(x_j, y_j) \in D_c$를 무작위로 선택하여 결합

    
$$
\tilde{x}_i =
\begin{cases}
l x_i + (1 - l) x_j, & p(x_i)^{max} \geq p(x_j)^{max}, \\
(1 - l) x_i + l x_j, & p(x_i)^{max} < p(x_j)^{max},
\end{cases}
$$
    


    
$$
\tilde{y}_i =
\begin{cases}
l y_i + (1 - l) y_j, & p(x_i)^{max} \geq p(x_j)^{max}, \\
(1 - l) y_i + l y_j, & p(x_i)^{max} < p(x_j)^{max}.
\end{cases}
$$
    

2. 신뢰도가 높은 sample에 더 높은 계수를 부여

    
$$
l = \max(l', 1 - l'), \text{ where } l' \text{ is sampled from } B(4, 4).
$$
    

    - 계수 $l$: Beta 분포 $B(\Phi, \Phi)$에서 sampling
        - $l$의 값은 항상 0과 1 사이 유지
3. CSA를 통해 선택된 clean sample로부터 신뢰성이 향상된 새로운 subset $\tilde{D}_c$를 재구성


$$
L_{D_c} = - \frac{1}{|\tilde{D}c|} \sum_{(\tilde{x}, \tilde{y}) \in \tilde{D}_c} \tilde{y} \log p(\tilde{x}, \theta)
$$


- Mixup은 임의로 두 sample을 섞음
- CSA는 신뢰도가 높은 clean sample에 더 높은 계수를 붙여 일반화 성능 향상

Q. What does 'truly clean' mean in the statement 'High-confidence samples are more likely to be truly clean'?


Answer

- "실제로 깨끗한(truly clean)" 의미:
    - 샘플의 레이블이 정확하고 오염되지 않음
    - 노이즈나 오류가 없는 데이터
- 높은 신뢰도 샘플이 실제로 깨끗할 가능성이 높은 이유:
    1. 딥러닝 모델의 학습 특성
        - 초기에 간단하고 일관된 패턴 먼저 학습
        - 노이즈 있는 데이터는 후반에 학습되는 경향
    2. 학습 초기 단계에서의 관찰
        - 모델이 높은 신뢰도로 분류한 샘플
        - 정확하게 레이블된 예제일 가능성 높음

### **Label Correction & Average Confidence Margin**

- 선택된 노이즈 sample을 단순히 버리면 데이터 낭비가 발생함
- Clean sample 일부가 노이즈 sample로 잘못 분류될 수 있음
- 따라서 semi-supervied learning 방식을 참고하여 노이즈 sample의 레이블을 수정한 후 학습에 사용됨
    - ACM을 사용하여 수정된 레이블의 품질을 모델 훈련을 기반으로 동적으로 평가함
    - 품질이 낮은 샘플은 학습에서 제외됨

Q. Explain the role of Label Correction and ACM in noisy subset.


Answer


레이블 교정(Label Correction)의 역할:

- 목적:
    - 노이지 서브셋의 샘플들을 효과적으로 활용
    - 잘못된 레이블을 수정하여 모델 학습에 사용
- 방법:
    - Exponential Moving Average (EMA) 사용
    - 모델의 과거 예측 결과를 활용하여 레이블 수정
- 장점:
    - 데이터 낭비 방지
    - 잠재적으로 유용한 샘플 활용 가능

평균 신뢰도 마진(ACM)의 역할:

- 목적:
    - 수정된 레이블의 품질 평가
    - 낮은 품질의 수정 레이블 필터링
- 방법:
    - 모델 학습 과정에서의 예측 동향 활용
    - 상위 두 클래스 간 신뢰도 차이 계산
- 장점:
    - 불확실한 수정 레이블 제거
    - 모델 학습의 안정성 향상

**두 기법의 상호작용:**

- **레이블 교정으로 노이지 샘플 활용**
- **ACM으로 수정된 레이블의 품질 관리**
- **높은 품질의 수정 레이블만 학습에 사용**

**최종 효과:**

- **노이지 데이터 활용도 증가**
- **모델 학습의 견고성 향상**
- **전반적인 분류 성능 개선**

**Label Correction**

- **목적**: 모델이 노이즈가 있는 sample을 적합하게 훈련하는 상황을 고려하여, 더 신뢰할 수 있는 레이블 수정을 위해 지수 이동 평균(EMA) 방식 사용
- **수식**:

    
$$
\hat{y_t} = \alpha \hat{y_{t-1}} + (1 - \alpha)p(A_w(x), \theta), \quad (x, y) \in D_n
$$
    

    - $\hat{y_t}$: $t$ 번째 epoch에서의 soft 수정된 레이블
    - $\alpha$: EMA 계수 (0에서 1 사이의 값)
    - $p(A_w(x), \theta)$: 모델 파라미터 $\theta$를 사용하여 weakly augmented 된 $A_w(x)$에 대한 예측
- 이전 예측 결과를 도입하여 잘못된 예측으로부터 오는 혼란을 줄임
- 이를 통해 더 강건하게 하여, 노이즈의 영향을 적게 받도록 함
- **하지만 저신뢰도을 가지는 수정된 라벨은 모델 학습에 도움이 되지 않고 사실상 노이즈가 포함된 레이블과 유사함**

**Confidence Margin (CM)**

- **목적**: 수정된 레이블의 신뢰도를 측정
- **수식**: **각 클래스**  $j$ **에 대한 신뢰도 마진** $CM^t_j(x)$

    
$$
CM^t_j(x) =
\begin{cases}
\hat{y}^t_j - \max_{c \neq j}(\hat{y}^t_c), & \text{if } j = \arg\max(\hat{y}^t) \\
\hat{y}^t_j - \max(\hat{y}^t), & \text{if } j \neq \arg\max(\hat{y}^t)
\end{cases}
$$
    

    - **최대 신뢰도 클래스 = class** $j$
        - $CM^t_j(x) = \hat{y}^t_j - \max_{c \neq j} (\hat{y}^t_c)$
    - **최대 신뢰도 클래스 != class** $j$
        - $CM^t_j(x) = \hat{y}^t_j - \max(\hat{y}^t)$
        - 수정된 label과 모든 class들 중에서 가장 높은 값 사이의 차이를 비교
- 하지만 CM의 경우 한 epoch의 모델 예측을 기반으로 하여 불안정하다는 단점을 가지고 있음

**Average Confidence Margin (ACM)**

- **목적**:  CM의 한계를 극복하기 위해 모든 epoch의 평균을 사용하여 신뢰도를 측정하여 신뢰도가 낮은 레이블을 필터링
- **수식**:

    
$$
ACM^t(x) = \frac{1}{t} \sum_{k=1}^{t} CM^k_{\arg\max \hat{y}^t}(x)
$$
    

    - 입력 데이터 $x$에 대한 $t$번째 epoch까지의 각 epoch에서 예측된 가장 확실한 클래스에 대한 CM의 평균
- 훈련 진행 중 지속적인 신뢰도 평가를 통해 품질이 높은 데이터만 유지
- 모델이 신뢰성이 높고 정확한 정보를 학습함으로써 일반화 성능을 극대화시킴

**Threshold** $T^t$

- **목적**: 신뢰도가 낮은 sample을 학습에서 제외하기 위한 임계값 설정
- **수식**

    
$$
T^t = \min(ACM) + (\max(ACM) - \min(ACM)) \times \tau
$$
    

    - $\min(ACM)$ : 훈련 중 측정된 평균 CM의 최소 값 (가장 신뢰도가 낮은 샘플)
    - $\max(ACM)$ : 평균 CM의 최대 값  (가장 신뢰도가 높은 샘플)
- $\tau$ 값을 조정해 임계값을 설정하고, 이 값보다 낮은 신뢰도 sample은 제외

 **Consistency regularization loss**

- **수식**

    
$$
L_{reg} = - \frac{1}{|D'{n}|} \sum_{(x,y) \in |D'_{n}|} \hat{y} \log p(A_s(x), \theta)
$$
    

    - $D'_{n} = \{(x, y) | ACM_t(x) > T_t, (x, y) \in D_n\}$
    - $|D'_{n}|$: 수정된 레이블 포함 노이즈 sample 집합 크기
    - $\hat{y}$: 수정된 레이블
    - $p(A_s(x), \theta)$: sample $x$의 strong augmentation $A_s(x)$에 대한 예측 확률
- 모델이 노이즈에 강한 안정적인 예측을 하도록 유도하는 데 사용

### **Overall Framework**


![](/assets/seminars/learning-with-imbalanced-noisy-data-by-preventing-bias-in-sample-selection-ieee-/5.png)

- Warm-up 단계:
    - $L_{ce}$ (cross-entropy loss)와 $L_{cp}$ (entropy loss)를 사용하여 예측 신뢰도 향상
- Class-Balance-based Sample Selection (CBS):
- Confidence-Based Sample Augmentation (CSA):
- EMA를 통한 Label correction:
    - EMA(Exponential Moving Average)를 사용해 노이즈 sample의 레이블을 수정
- Consistency Regularization:
- 최종 손실:
    - $L = L_{D_c} + \alpha L_{reg}$로 구성
    - $L_{D_c}$: classification loss (clean subset)
    - $L_{reg}$: consistency regularization loss
    - $\alpha$: 손실 가중치 계수

## Experiments

- Synthetic Datasets: CIFAR10 및 CIFAR100에서 실험 진행
- Real-world Datasets: Web-Aircraft, Web-Bird, Web-Car, Clothing1M에서 실험 진행
- 각 구성 요소 및 hyperparameters에 대한 ablation studies 수행

### **Experimental Setup**

- Synthetic Datasets: CIFAR10 및 CIFAR100

    ![](/assets/seminars/learning-with-imbalanced-noisy-data-by-preventing-bias-in-sample-selection-ieee-/6.png)

    - 무작위로 노이즈 레이블로 변경 (사전 정의된 noise rate 사용)
    - 클래스 불균형 :  Exponential function  $n_i = n_0 \mu_i$ sample 수 조절
    - 클래스 불균형 계수 (IF) : 데이터셋의 최대 클래스 sample 수와 최소 클래스 sample 수의 비율

    
$$
IF = \frac{\max(n_i)}{\min(n_i)}
$$
    

- Real-world Datasets:
    - Web-Aircraft, Web-Bird, Web-Car, Clothing1M 등 사용
    - 웹 이미지 크롤링을 통해 수집된 데이터셋으로, 노이즈 레이블이 포함
- Implementation:
    - Synthetic Datasets에 대해 ResNet18 backbone 사용, SGD optimizer로 훈련
    - Real-world Datasets에서는 ResNet50 사용, 초기 learning rate는 0.001 설정
    - Data augmentation으로 random crop 및 horizontal flipping 사용, strong augmentation은 AutoAugment로 수행
- Evaluation Metrics: Test accuracy, 평균 test accuracy

### **Experimental Results on Synthetic Datasets**


![](/assets/seminars/learning-with-imbalanced-noisy-data-by-preventing-bias-in-sample-selection-ieee-/7.png)


![](/assets/seminars/learning-with-imbalanced-noisy-data-by-preventing-bias-in-sample-selection-ieee-/8.png)


![](/assets/seminars/learning-with-imbalanced-noisy-data-by-preventing-bias-in-sample-selection-ieee-/9.png)


### **Experimental Results on Real-World Datasets**


![](/assets/seminars/learning-with-imbalanced-noisy-data-by-preventing-bias-in-sample-selection-ieee-/10.png)


![](/assets/seminars/learning-with-imbalanced-noisy-data-by-preventing-bias-in-sample-selection-ieee-/11.png)


### **Ablation Studies**


![](/assets/seminars/learning-with-imbalanced-noisy-data-by-preventing-bias-in-sample-selection-ieee-/12.png)


![](/assets/seminars/learning-with-imbalanced-noisy-data-by-preventing-bias-in-sample-selection-ieee-/13.png)

- 모델 성능 향상: 적절히 선택된 $ρ$와 $τ$가 모델 성능을 더욱 향상시킬 수 있음

## Conclusion


In this paper, we focused on the challenge of learning with noisy and imbalanced datasets. To address label noise and class imbalance simultaneously, we proposed a simple yet effec- tive method based on balanced sample selection. Our proposed method followed the semi-supervised learning paradigm and trained only one network in the training process. Specifically, we proposed a class-balance-based sample selection strategy to divide samples into clean and noisy subsets in a class-balanced manner. We then performed confidence-based sample augmen- tation to enhance the reliability of selected clean samples. Af- terward, we employed EMA to relabel selected noisy samples and filtered those with low confidence based on the average con- fidence margin metric. Finally, consistency regularization was adopted on label-corrected noisy samples with high confidence to improve the robustness and stability of the model training. Extensive experiments and ablation studies were conducted to substantiate the effectiveness and superiority of our proposed method.

- Imbalanced 데이터에서 노이즈 라벨 문제를 해결하기 위한 새로운 sample selection 방법론을 제안함
- Class imbalance와 노이즈 라벨을 동시에 고려한 Class-Balance-based Sample Selection (CBS) 방식을 사용
- Clean sample에 대해서는 Confidence-Based Sample Augmentation (CSA)을 적용하여 신뢰도를 높임
- 노이즈가 있는 sample에 대해서는 EMA를 통해 레이블을 수정하고 Average Confidence Margin (ACM)을 이용해 신뢰도 낮은 sample을 필터링함
- 실험 결과, 제안한 방법이 노이즈 레이블과 class imbalance에서도 우수한 성능을 보임

# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.


**AIX 데이터셋 실험 결과**

- Cross Entropy loss
- 5 번 실험 평균

| 1020 DSLR + S         | **정확도** | **F1-score** | **민감도** | **특이도** | **PPV** | **NPV** |
| --------------------- | ------- | ------------ | ------- | ------- | ------- | ------- |
| **논문 방법론**            | 0.717   | 0.501        | 0.487   | 0.813   | 0.529   | 0.792   |
| Co-teaching [Model 1] | 0.711   | 0.548        | 0.59    | 0.764   | 0.557   | 0.817   |
| Co-teaching [Model 2] | 0.711   | 0.526        | 0.546   | 0.78    | 0.535   | 0.806   |

- 현재 실험 결과로는 Co-teaching 방법론이 동일한 setting 기준으로 더 낮은 성능을 보임
- 제안된 방법론의 경우 co-teaching 방법론보다 hyperparameter와 여러 요소들이 있어 여러 요소들이 잘 작동되고 있는지 확인 필요

# Code

    - Warmup-learning : cross entorpy + entropy loss

    ```python
    # Entropy loss
    def conf_penalty(outputs):
        outputs = outputs.clamp(min=1e-12)
        probs = torch.softmax(outputs, dim=1)
        return torch.mean(torch.sum(probs.log() * probs, dim=1))
        
    def warmup(net, optimizer, trainloader, dev, train_loss_meter,train_accuracy_meter, aum_calculator):
        net.train()
        aum_calculator.switch_threshold_examples(set())
        pbar = tqdm(trainloader, ncols=150, ascii=' >', leave=False, desc='training')
        for it, sample in enumerate(pbar):
    
            x, y, indices, _ = sample
            x, y = x.cuda(), y.cuda()
    
            with autocast():
                outputs = net(x)
                logits = outputs['logits'] if type(outputs) is dict else outputs
                ################################################################
                loss_ce = F.cross_entropy(logits, y)
                penalty = conf_penalty(logits)
                loss = loss_ce + penalty
                ################################################################
    
            with torch.no_grad():
                max_logits = torch.max(logits, dim=-1)
                mask = logits != max_logits.values[:, None]
                partial = logits - mask * max_logits.values[:, None]
                second_largest = torch.max(mask * logits, dim=-1)
                second_largest = ~mask * second_largest.values[:, None]
                margins = partial - second_largest
                aum_calculator.update_aums(indices.cpu().numpy(), margins.cpu().numpy())
    
    
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
    
            train_acc = accuracy(logits, y, topk=(1,))
            train_accuracy_meter.update(train_acc[0], x.size(0))
            train_loss_meter.update(loss.detach().cpu().item(), x.size(0))
            pbar.set_postfix_str(f'TrainAcc: {train_accuracy_meter.avg:3.2f}%; TrainLoss: {train_loss_meter.avg:3.2f}')
    ```

    - Class-balance sample selection

    ```python
    def eval_train(net, num_classes, num_samples, trainloader, clean_rate, dev, targets_list=None, criterion='jsdiv'):
        net.eval()
        unclean_criterions = torch.zeros(num_samples)
        if targets_list is None:
            targets_list = torch.zeros(num_samples)
            init_target_list = True
        else:
            init_target_list = False
        with torch.no_grad():
            for it, sample in enumerate(trainloader):
                inputs, y, index,_ = sample
                index = index.cuda()
                if init_target_list:
                    targets_list[index] = y.float()
                inputs, y = inputs.cuda(), y.cuda()
                with autocast():
                    outputs = net(inputs)
                    logits = outputs['logits'] if type(outputs) is dict else outputs
                    if criterion == 'loss':
                        loss = F.cross_entropy(logits, y, reduction='none')
                    elif criterion == 'jsdiv':
                        given_labels = get_smoothed_label_distribution(y, num_classes, epsilon=1e-12)
                        probs = logits.softmax(dim=1)
                        loss = js_div(probs, given_labels)
                    else:
                        raise AssertionError('Not Supported!')
    
                    unclean_criterions[index] = loss.cpu()
    		################################################################
    		# Loss nomalization
        unclean_criterions = (unclean_criterions - unclean_criterions.min()) / (unclean_criterions.max() - unclean_criterions.min())
    		
    		
    		# 각 클래스별로 상위 small loss 선택
        prob_clean = np.zeros(num_samples)
        idx_chosen_sm = []
        bs_j = num_samples * (1.0 / num_classes)
        for j in range(num_classes):
            indices = np.where(targets_list.numpy() == j)[0]
            if len(indices) == 0:
                continue
            pseudo_unclean_criterion_vec_j = unclean_criterions[indices]
            sorted_idx_j = pseudo_unclean_criterion_vec_j.sort()[1].numpy()  # sort ascending order
            partition_j = max(min(int(math.ceil(bs_j*clean_rate)), len(indices)), 1)  # at least one sample
            idx_chosen_sm.append(indices[sorted_idx_j[:partition_j]])
        idx_chosen_sm = np.concatenate(idx_chosen_sm)
        prob_clean[idx_chosen_sm] = 1
        ################################################################
        
        return prob_clean, targets_list
    ```


    ```python
    def robust_train(net, optimizer, trainloader, dev, train_loss_meter,train_accuracy_meter, aug, num_class, ep, p_clean, loss_weight, corr_label_dist, ema_label_dist, params, aum_calculator):
        net.train()
    
        num_threshold_examples = min(len(trainloader.dataset) // 100, len(trainloader.dataset) // num_class)
        threshold_data_ids = random.sample(list(range(len(trainloader.dataset))), num_threshold_examples)
        aum_calculator.switch_threshold_examples(threshold_data_ids)
        pbar = tqdm(trainloader, ncols=150, ascii=' >', leave=False, desc='training')
        for it, sample in enumerate(pbar)
    
            x, y, indices,_ = sample
            batch_size = x.size(0)
            x, y = x.cuda(), y.cuda()
    
            labels_ = torch.zeros(batch_size, num_class).cuda().scatter_(1, y.view(-1, 1), 1)
            weights_ = torch.FloatTensor(p_clean[indices]).view(-1, 1).cuda() if isinstance(p_clean, np.ndarray) else \
                p_clean[indices].view(-1, 1)
    				
            with torch.no_grad():
                with autocast():
                    outputs = net(x)
                    logits = outputs['logits'] if type(outputs) is dict else outputs
                    px = logits.softmax(dim=1)
                    pred_net = F.one_hot(px.max(dim=1)[1], num_class).float()
                    high_conf_cond = (labels_ * px).sum(dim=1) > params.tau
                    weights_[high_conf_cond] = 1
                    
            #######################################################
            # Label Correction
            if params.useEMA:
                label_ema = ema_label_dist[indices, :].clone().cuda()
                aph = params.aph  # 0.1 - (0.1 - params.aph) * linear_rampup(ep, params.start_expand)
                label_ema = label_ema * aph + px * (1 - aph)
                pseudo_label_l = labels_ * weights_ + label_ema * (1 - weights_)
            else:
                pseudo_label_l = labels_ * weights_ + pred_net * (1 - weights_)
            ######################################################
            
            idx_chosen = torch.where(weights_ == 1)[0]  # idx_chosen includes clean samples only
            n_clean = idx_chosen.size(0)
    
            idx_noises = torch.where(weights_ != 1)[0]
            overlay_num = min(int(params.overlay_ratio * batch_size), idx_chosen.size(0))
            idx_noises = torch.cat((idx_noises, idx_chosen[torch.randperm(idx_chosen.size(0))[:overlay_num]]),
                                   dim=0)
    
    				
            with autocast():
                if idx_noises.size(0) > 0:
                    x2 = aug(x, mode='s').cuda()
                    outputs2 = net(x2)
                    logits2 = outputs2['logits'] if type(outputs2) is dict else outputs2
    						
    						
                train_acc = accuracy(logits, y, topk=(1,))
                with torch.no_grad():
                    if epoch > params.start_expand:
                        expected_ratio = params.bs_threshold
                        px2 = torch.zeros_like(px) - 0.1
                        px2[idx_noises] = logits2.softmax(dim=1)
                        score1 = px.max(dim=1)[0]
                        score2 = px2.max(dim=1)[0]
                        match = px.max(dim=1)[1] == px2.max(dim=1)[1]
                        hc2_sel_wx1 = high_conf_sel2(idx_chosen, weights_, batch_size, score1, score2, match,
                                                     params.tau_expand, expected_ratio)
                        idx_chosen = torch.where(hc2_sel_wx1 == 1)[0]  # idx_chosen includes clean & ID noisy samples
                    n_semi = idx_chosen.size(0) - n_clean
    
                ni = max(int((1 + params.overlay_ratio) * batch_size) - idx_chosen.size(0), 0)
                idx_for_idx_noises = torch.randperm(idx_noises.size(0))[:ni]
    						
    						
    						#########################################
    						# Confidence-Based Sample Augmentation
                l = np.random.beta(4, 4)
                l = max(l, 1 - l)
                if params.use_mixup and idx_chosen.size(0) > 0:
                    idx2 = idx_chosen[torch.randperm(idx_chosen.size(0))]
    
                    pseudo_label_mix = copy.deepcopy(pseudo_label_l[idx_chosen])
                    x_mix = copy.deepcopy(x[idx_chosen])
                    confidence = px.max(dim=1)[0]
                    for item in range(idx_chosen.size(0)):
                        l = np.random.beta(4, 4)
                        l = max(l, 1 - l)
                        if confidence[idx_chosen[item]] > confidence[idx2[item]]:
                            x_mix[item] = l * x[idx_chosen[item]] + (1 - l) * x[idx2[item]]
                            pseudo_label_mix[item] = l * pseudo_label_l[idx_chosen[item]] + (1 - l) * pseudo_label_l[
                                idx2[item]]
                        else:
                            x_mix[item] = (1 - l) * x[idx_chosen[item]] + l * x[idx2[item]]
                            pseudo_label_mix[item] = (1 - l) * pseudo_label_l[idx_chosen[item]] + l * pseudo_label_l[
                                idx2[item]]
    
                    outputs_mix = net(x_mix)
                    logits_mix = outputs_mix['logits'] if type(outputs_mix) is dict else outputs_mix
                    loss_mix = F.cross_entropy(logits_mix, pseudo_label_mix)
    
                else:
                    outputs_mix = net(x[idx_chosen])
                    logits_mix = outputs_mix['logits'] if type(outputs_mix) is dict else outputs_mix
                    loss_mix = F.cross_entropy(logits_mix, pseudo_label_l[idx_chosen])
    						##################################################
    						
    						##################################################
    						# 
    consistency regularization loss & AUM 필터링
    
                if params.use_cons and idx_noises.size(0) > 0:
                    loss_cr = F.cross_entropy(logits2, pseudo_label_l,reduction="none")
    
                    with torch.no_grad():
                        logits=pseudo_label_l
                        max_logits = torch.max(logits, dim=-1)
                        mask = logits != max_logits.values[:, None]
                        partial = logits - mask * max_logits.values[:, None]
                        second_largest = torch.max(mask * logits, dim=-1)
                        second_largest = ~mask * second_largest.values[:, None]
                        margins = partial - second_largest
                        aum_calculator.update_aums(indices.cpu().numpy(), margins.cpu().numpy())
    
                        crt_aums = aum_calculator.get_aums(indices.cpu().numpy())
                        crt_aums = crt_aums[np.arange(logits.shape[0]), max_logits.indices.cpu()]
                        crt_aums = torch.tensor(crt_aums).cuda()
                        aum_mask = crt_aums.ge(torch.quantile(crt_aums, params.CM)).float()
                    loss_cr = torch.mean(loss_cr*aum_mask)
    
                else:
                    if params.use_mixup:
                        loss_cr = torch.tensor(0).float()
                    else:
                        loss_cr = F.cross_entropy(logits2, pseudo_label_l[idx_noises])
    						##################################################
    						
                loss = loss_mix + loss_cr * loss_weight
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            train_accuracy_meter.update(train_acc[0], x.size(0))
            train_loss_meter.update(loss.detach().cpu().item(), x.size(0))
            pbar.set_postfix_str(f'TrainAcc: {train_accuracy_meter.avg:3.2f}%; TrainLoss: {train_loss_meter.avg:3.2f}')
    
            corr_label_dist[indices] = pseudo_label_l.detach().clone().cpu().data
            if params.useEMA:
                ema_label_dist[indices] = label_ema.detach().clone().cpu().data
                del label_ema
    ```


    ```python
    config = parse_args()
    init_seeds(config.seed)
    device = set_device(config.gpu)
    # sample selection ratio
    rho_range_items = [float(ele) for ele in config.rho_range.split(':')]
    rho_begin, rho_final = rho_range_items[0], rho_range_items[1]
    T_rho = 1 if len(rho_range_items) == 2 else int(rho_range_items[2])
    # tau인 AUM threshold 
    omega_range_items = [float(ele) for ele in config.omega_range.split(':')]
    omega_begin, omega_final = omega_range_items[0], omega_range_items[1]
    T_omega = 1 if len(omega_range_items) == 2 else int(omega_range_items[2])
    
    # create dataloader
    loader_dict = build_loader(config)
    dataset_name, n_classes, n_samples = loader_dict['dataset'], loader_dict['num_classes'], loader_dict['num_samples']
    
    # create model
    model = build_model(n_classes, config.params_init, device)
    
    if config.resume!=None:
      path = config.resume
      dict_s = torch.load(path, map_location='cpu')
      model.load_state_dict(dict_s)
      model.cuda()
    
    # create optimizer & lr_plan or lr_scheduler
    optim = build_optimizer(model, config)
    lr_plan = build_lr_plan(config.lr, config.epochs, config.warmup_epochs, config.warmup_lr, decay=config.lr_decay,
                          warmup_gradual=config.warmup_gradual)
    
    # init re-augmenter (=strong augmentation)
    re_aug = ReAug(strong_aug=config.aug_type, dataset=dataset_name)
    
    # 초기 label correction
    corrected_label_distributions = init_corrected_labels(n_samples, n_classes, loader_dict['trainloader'], soft=False)
    if config.useEMA:
      ema_label_distributions = copy.deepcopy(corrected_label_distributions)
    else:
      ema_label_distributions = None
      
      
    targets_all = None
    best_accuracy, best_epoch = 0.0, None
    train_loss_meter = AverageMeter()
    train_accuracy_meter = AverageMeter()
    aum_calculator = AUMCalculator(config.delta, int(
      n_classes), n_samples, 95 / 100)
    compiled_model = model
    epoch = 0
    if config.restart_epoch != 0:
      epoch = config.restart_epoch
      config.restart_epoch = 0
    Final_results = 0
    while epoch < config.epochs:
      train_loss_meter.reset()
      train_accuracy_meter.reset()
      adjust_lr(optim, lr_plan[epoch])
      input_loader = loader_dict['trainloader']
      if epoch < config.warmup_epochs:
          warmup(compiled_model, optim, input_loader, device, train_loss_meter,train_accuracy_meter, aum_calculator)
      else:
          rho = rho_begin - (rho_begin - rho_final) * linear_rampup(epoch - config.warmup_epochs, T_rho)
          approx_clean_probs, targets_all = eval_train(compiled_model, n_classes, n_samples, input_loader, rho, device,
                                                       targets_all, criterion=config.criterion)  # np.array, (num_samples, )
          omega = omega_begin - (omega_begin - omega_final) * linear_rampup(epoch - config.warmup_epochs, T_omega)
          robust_train(compiled_model, optim, input_loader, device, train_loss_meter,train_accuracy_meter, re_aug,n_classes, epoch, approx_clean_probs, omega,
                       corrected_label_distributions, ema_label_distributions, config, aum_calculator)
    
      eval_result = evaluate_cls_acc(loader_dict['test_loader'], compiled_model, device)
      test_accuracy = eval_result['accuracy']
      if (epoch+10) >= config.epochs:
          Final_results += test_accuracy
      if test_accuracy > best_accuracy:
          best_accuracy = test_accuracy
          best_epoch = epoch + 1
          if config.save_weights:
              torch.save(model.state_dict(), f'./result_log/'+dataset_name+"_"+str(epoch)+'_best_model.pth')
      print(
          f'>> Epoch {epoch}: loss {train_loss_meter.avg:.2f} ,train acc {train_accuracy_meter.avg:.2f} ,test acc {test_accuracy:.2f}, best acc {best_accuracy:.2f}')
      epoch+=1
    print("Final Results: ",Final_results/10)
    ```
