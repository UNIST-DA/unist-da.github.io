---
date: 2024-03-08
title: ABC: Auxiliary Balanced Classifier for Class-imbalanced Semi-supervised Learning (NeurIPS 2021)
category: Paper Review
presenter: Hyejin Cho
url: https://www.notion.so/daf0cb83b9e448e590e9f97b05ac63df
keywords: semi-supervised learning, Imbalanced Data, Decoupled Training
---

# Selected Paper


H. Lee, S. Shin, and H. Kim (2021), “ABC: Auxiliary Balanced Classifier for Class-imbalanced Semi-supervised Learning,”  _Conference on Neural Information Processing Systems_ (_NeurIPS) 2021._


# Abstract


Existing semi-supervised learning (SSL) algorithms typically assume class-balanced datasets, although the class distributions of many real-world datasets are imbalanced. In general, classifiers trained on a class-imbalanced dataset are biased toward the majority classes. This issue becomes more problematic for SSL algorithms because they utilize the biased prediction of unlabeled data for training. However, traditional class-imbalanced learning techniques, which are designed for labeled data, cannot be readily combined with SSL algorithms. We propose a scalable class-imbalanced SSL algorithm that can effectively use unlabeled data, while mitigating class imbalance by introducing an auxiliary balanced classifier (ABC) of a single layer, which is attached to a representation layer of an existing SSL algorithm. The ABC is trained with a class-balanced loss of a minibatch, while using high-quality representations learned from all data points in the minibatch using the backbone SSL algorithm to avoid overfitting and information loss.Moreover, we use consistency regularization, a recent SSL technique for utilizing unlabeled data in a modified way, to train the ABC to be balanced among the classes by selecting unlabeled data with the same probability for each class. The proposed algorithm achieves state-of-the-art performance in various class-imbalanced SSL experiments using four benchmark datasets.


⇒ 기존의 SSL 알고리즘에 부착되는 단일 레이어의 auxiliary balanced classifier (ABC)를 도입함으로써 클래스 불균형을 완화하는 방법론 제안


# Introduction


![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/0.png)


많은 Semi-Supervised Learning (SSL) 알고리즘들은 레이블이 없는 데이터를 활용하여 DNN의 성능을 향상시키기 위해 고안되었음


⇒ 기존의 알고리즘: 대부분의 데이터셋이 클래스 간에 균등하게 분포되어 있다고 가정


실제로 많은 데이터셋은 Class-imbalanced 상황임. 

- Figure 1 : (a) "Class-imbalanced training set"은 훈련 데이터셋의 클래스 불균형 상황.클래스 인덱스 0에 해당하는 데이터의 양이 가장 많고, 클래스 인덱스 9로 갈수록 점점 데이터 양이 줄어듦.
- 레이블이 있는 데이터(Labeled Data)와 레이블이 없는 데이터(Unlabeled Data) 모두에서 불균형이 보임.

데이터셋의 class-imbalance 문제 : 불균형 데이터셋으로 훈련된 모델이 다수 클래스에 치우친 예측을 하게 만듦

- 기존의 FixMatch나 ReMixMatch 같은 SSL 알고리즘은 데이터가 클래스별로 불균형하게 분포되어 있을 때, 일부 클래스에 치우친 예측을 할 수 있음.

⇒ Figure 1 : (b) ReMixMatch 알고리즘을 사용했을 때의 예측 결과. 데이터셋 내의 다수 클래스일수록, 더 많은 예측 결과로 이어짐. 대부분의 예측이 다수 클래스로 치우침.


> 💡 Auxiliary Balanced Classifier(ABC)와 Consistency Regularization를 적용하는 Class-Imbalanced Semi-Supervised Learing (CISSL) 알고리즘 제안


**Backbone SSL 알고리즘 위에 ABC 를 붙임**

- Backbone 의 Classifier 에 앞선 representation layer 에 연결
- 미니배치에서 클래스 분포를 재조정하는 마스크를 사용해 모든 클래스에 걸쳐 균형 있게 훈련
    - 클래스 균형 부분집합을 확률적으로 재생성하는 방식으로 훈련되는 ABC

⇒ 소수 클래스 데이터에 과적합되거나 다수 클래스 데이터의 정보를 잃어버리는 것을 방지하면서, 모든 클래스에 걸쳐 균형을 맞춤


**Consistency Regularization** :  레이블이 없는 데이터의 다른 버전에 대해서도 모델이 일관된 예측을 하도록 하는 기법

- 새로운 데이터에 대해 결정 경계를 더 잘 파악하도록 하는 기법
- 데이터가 조금 변형되었다 하더라도 같은 종류로 예측하도록 유도
- 레이블이 없는 데이터를 활용해 저밀도 지역에 결정 경계를 배치하는 것을 가능하게 하는 기법.
- 이는 동일한 레이블이 없는 예제의 변형된 버전들에 대한 분류 출력이 일관되게 유지되도록 강제.
- 각 클래스에 대해 동일한 확률로 레이블이 없는 예제를 선택하여 일관성 규제를 통해 ABC의 균형을 장려함.

⇒  Figure 1 : (c)동일한 데이터셋을 학습할 때, 그림 1(b)의 ReMixMatch 결과와 비교해 제안된 알고리즘으로 예측한 레이블의 클래스 분포가 훨씬 더 균형을 이룸. 


# Related Work


Semi-Supervised Learning: 레이블이 붙은 데이터(즉, 분류가 되어 있는 데이터)와 레이블이 붙지 않은 데이터(분류가 되어 있지 않은 데이터)를 모두 사용하여 모델을 학습

- 기본적으로, SSL은 레이블이 붙은 데이터가 한정적일 때 유용하며, 레이블이 없는 데이터를 추가적인 정보로 활용

    ![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/1.png)

- Having low entropy for unlabeled data: 모델이 레이블이 없는 데이터에 대해 확실한 예측을 하도록 격려, 예측의 불확실성을 줄임
- Mixup regularization : 두 데이터 포인트를 혼합하여 생성된 가상의 데이터 포인트에 대해 모델이 일관된 예측을 하도록 하는 방법
- Consistency Regularization : 레이블이 없는 데이터를 약간 변경한 뒤, 모델이 같은 데이터에 대해 일관된 예측을 내리도록 함.

![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/2.png)


![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/3.png)


![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/4.png)


Supervised Learning : labeled data 기준으로 decision boundary 형성. 모분포에 대해서는 이상적으로 나누지 못함.


SSL : Cluster Assumption (decision boundary 가 low-density area 에서 형성) 을 가정으로 unlabeled data 가 활용됨

- 클래스 불균형의 상황에서, decision boundary 가 편향됨
    - 소수 클래스 지역으로 밀린 decision boundary 가 소수 클래스 high-density area 를 지나게 됨

CISSL: Class-Imbalanced Supervised Learning, Semi-Supervised Learning 에서 발전되는 Class-Imbalanced Semi-Supervised Learning


데이터 분포가 균일하지 않을 때를 가정하는 Classifier 연구

- Resampling : 데이터의 양을 조절. oversampling, undersampling
- Reweighting : 각 클래스의 중요도를 다르게 설정
- synthetic samples : 인공적으로 새로운 데이터 생성
- meta learning, transfer learning : 이전에 학습한 지식을 활용하거나 다른 문제에서 얻은 지식을 현재 문제에 적용

CISSL 알고리즘은 pseudo label 을 보정, 개선하는 것에 중점을 두는 방법론과 label 이 없는 추가 데이터를 사용하여 generalization 을 개선하는 방법론으로 나뉨

- pesudo-labeling : 레이블이 없는 데이터에 대해, 모델이 자체적으로 예측한 레이블을 생성.
    - DARP:  pseudo label 분포를 보정하여 더 정확한 결정 경계를 찾는 방법을 제안
    - CReST: 소수 클래스로 분류된 데이터 포인트를 더 우선적으로 사용하여 클래스 불균형을 완화
- Decoupled Training
    - 일반적으로 기계 학습 모델은 데이터의 특징(feature)을 학습하는 '표현 학습(representation learning)' 단계와 이러한 특징을 바탕으로 예측을 수행하는 '분류(classification)' 단계를 동시에 수행함.
    - Decoupled Training에서는 이 두 과정을 분리하여, 먼저 데이터의 표현을 학습하고, 그 다음에 이 표현을 사용하여 분류기를 따로 학습시킴.
    - ABC를 사용하는 경우, representation learning 단계는 클래스 불균형의 영향을 덜 받게 되며, classification 단계에서는 이 표현을 사용하여 각 클래스를 공정하게 분류하는 추가적인 분류기, ABC 를 활용함.

![An example of the neural network architecture decoupling. Each color represents a calculation path of specific input. 

Li, Y. et al. (2020). Interpretable Neural Network Decoupling. In: Vedaldi, A., Bischof, H., Brox, T., Frahm, JM. (eds) Computer Vision – ECCV 2020. ECCV 2020. Lecture Notes in Computer Science(), vol 12360. Springer, Cham. https://doi.org/10.1007/978-3-030-58555-6_39](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/5.png)


**⇒ ABC : CISSL 영역에서 처음으로 Decoupled Training 을 시도한 방법론**


:  auxiliary balanced classifer(ABC) to rebalance the biased model by introducing extra regularization terms.

- ABC : kind of  extra regularization term
- Unlike the algorithms trying to obtain pseudo-labels with higher quality, the balanced
classifer learning method aims to employ class-balanced sampling or post-hoc classifer adjustment from the CISL perspective. It alleviates the need for a large number of pseudolabels with high quality to rebalance the distribution.

# Methodology


![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/6.png)


## Problem Definition


**Labeled Dataset** $X=\{(xn​,yn​): \in (1,...,N)\}$ 


**Unlabeled Dataset** $U = \{ u_m : m \in (1, ..., M) \}$ 


**레이블 데이터의 비율 (β) :** $\frac{N}{N+M}$**, 일반적으로 β < 0.5 로 가정**

- 주로 레이블이 없는 데이터가 더 많이 사용됨. 레이블을 붙이는 작업이 비용이 많이 들고 시간이 오래 걸리기 때문

**클래스 불균형 비율 (γ)**: 가장 많은 데이터를 가진 클래스와 가장 적은 데이터를 가진 클래스 사이의 비율

- 전체 레이블이 붙은 데이터의 수 N이 $\sum_{l=1}^L N_l = N$, L 클래스들이 내림차순으로 정렬되어 있다고 가정
    - $N_1 \geq N_2 \geq ... \geq N_L$
    - 클래스 불균형의 비율 $\gamma = \frac{N_1}{N_L}$
    - $\gamma$ > 1

_X_와 _U_가 같은 예제 클래스 분포를 공유 : 레이블이 있는 데이터에서 특정 클래스의 비율과 레이블이 없는 데이터에서 동일한 클래스의 비율이 유사하다고 가정

- 레이블이 있는 데이터에서 학습한 패턴이 레이블이 없는 데이터에도 적용될 수 있다는 전제를 기반

## Backbone SSL Algorithm


### ReMixMatch


![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/7.png)

1. **다중 데이터 증강 (Multiple Data Augmentation)**:
    - 레이블이 없는 데이터에 대해 약한 증강과 강한 증강 모두 적용.
        - 모델이 다양한 변형에 대해 더 강건하게 학습할 수 있도록 함
    - 레이블이 있는 데이터에 대해서도 유사한 증강을 적용. 일관성 있는 데이터 분포를 유지
2. **레이블 예측 및 정렬 (Label Prediction and Alignment)**
    - 약하게 증강된 Unlabeled Data에 대해 레이블을 예측하고, 이를 의사 레이블(pseudo-label)로 사용
    - Labeled Data와 Unlabeled Data 간의 클래스 분포를 정렬하기 위해, 배치 내에서 레이블 분포를 조정
        - **Distribution alignment :** unlabeled data의 prediction distribution을 labeled data의 distribution에 맞춰서 조정.
3. **Mixup을 통한 데이터 혼합 (Data Mixing via Mixup)**:
    - 앞서 언급된 증강된 데이터와 예측된 레이블을 기반으로, Mixup 기법을 사용하여 레이블이 있는 데이터와 레이블이 없는 데이터를 혼합.
        - 모델이 더 부드러운 결정 경계를 학습하고, 다양한 데이터 조합에서도 일반화할 수 있도록 도움
4. **모델 학습 (Model Training)**:
    - 혼합된 데이터와 정렬된 레이블 분포를 사용하여 모델을 학습.
        - Consistency regularization**(**일관성 정규화)를 통해 모델이 다양한 데이터 증강에 대해서도 일관된 예측을 내리도록

### FixMatch


![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/8.png)

- Main Idea : unlabeled data에 대하여, 변형된 이미지와 그것의 원본 이미지는 어떤 모델에 의해 같은 예측결과가 나와야 한다.
    - 두 변형된 이미지의 확률값의 차이를 목적함수에 반영하여 temporary label의 신뢰성을 향상시키고자 함.
1. **Weak Augmentation**: 레이블이 있는 데이터에 약한 증강
2. **Prediction**: 약하게 증강된 레이블이 있는 데이터를 모델에 입력하여 예측을 수행
3. **레이블 생성**: 모형이 threshold(임계치) 보다 높은 클래스에 확률을 할당하면 모델이 높은 확신(confidence)을 가지고 예측했다고 봄. 그 예측을 의사 레이블(pseudo-label)로 사용
4. **strong augmentation** of the same image에 대한 모델의 예측을 계산
5. **학습**: 의사 레이블이 있는 강하게 증강된 데이터를 모델에 입력하여 모델을 학습

⇒ pseudo-label은 모델이 **strongly-augmented version of the same image를** 제공할 때 대상으로 사용되는**weakly-augmented unlabeled image**를 기반으로 생성


⇒ 이 모델은 strongly-augmented version에 대한 예측이 cross-entropy loss을 통해 pseudo-label과 일치하도록 훈련


### **cf. Augment, WeakAugment, StrongAugment의 차이**

- **Augment**: 일반적으로 데이터 증강(Data Augmentation)은 입력 데이터에 여러 형태의 변환(예: 회전, 크기 조정, 색상 조정 등)을 적용하여 데이터의 다양성을 늘리는 기법. 모델의 일반화 능력을 향상시키기 위함
    - **WeakAugment**: 상대적으로 간단하거나 미묘한 변환을 적용.
        - 데이터의 기본적인 특성을 크게 변형시키지 않는 것. 약간의 회전이나 색상의 조정 등
    - **StrongAugment**: 원본 데이터와 상당히 다른 형태의 데이터를 생성하여, 모델이 더 다양한 변형에 대해 강인하도록 학습.
        - 예를 들어, 이미지의 일부를 잘라내거나 (Cutout), 이미지에 노이즈를 추가하는 것 등

## ABC : Auxiliary Balanced Classifier


기존의 모델(백본)이 이미 학습한 표현을 활용하여 ABC를 추가로 훈련, 모델이 전체 데이터셋에서 균형 잡힌 성능을 낼 수 있도록 함.


레이블이 붙은 데이터를 증강시키고, 그 데이터를 백본 모델과 ABC에 통과시키며, 이를 통해 학습



$$
L_{total} = L_{cls} + L_{con} + L_{back}
$$



**Training: Backbone과 ABC의 손실 합계를 사용하여 훈련**


**새로운 데이터 포인트의 클래스 레이블을 예측할 때는 ABC만을 사용**. 

- 먼저, labeled data는 backbone SSL 알고리즘과 ABC를 거쳐 클래스를 예측함.
    - ABC is attached to a representation layer immediately preceding the classifcation layer of the backbone
- 동시에, unlabeled data 도 약한 증강(weak augmentation)을 거친 후 ABC에 의해 예측됨
- 그리고 다시 강한 증강(strong augmentation)을 거쳐 ABC에서 일관성 정규화 과정을 통해 예측됨.
- Backbone SSL 알고리즘은 주로 레이블이 없는 데이터에서 학습하는 데 중점을 둠. 이를 통해 모델은 레이블이 없는 데이터에 대한 일반적인 특징과 패턴을 학습
    - 데이터의 전반적인 구조와 패턴을 파악하는 데 중점
- Balanced training of the ABC**:** ABC를 모든 클래스에 대해 균등하게 학습시키기 위해, 0/1 마스크(베르누이 분포를 사용하여 생성됨)를 사용. 이 마스크는 소수 클래스의 데이터를 더 자주 선택함.
    - 클래스 분포를 재조정하는 마스크를 사용하여 모든 클래스에 걸쳐 균형을 이루도록 훈련
    - The mask stochastically regenerates a class-balanced subset of a minibatch on which the ABC is trained

![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/9.png)


### **ABC의 classification loss**


 _L_cls: ABC의 분류 손실

- 각 데이터 포인트에 대해 가중치를 적용한 교차 엔트로피 손실의 평균
    - 이 가중치는 수식 (2)에 정의된 마스크 $M(x_b) $ 에 의해 결정


$$
L_{\text{cls}} = \frac{1}{B} \sum_{b=1}^{B} M(x_b) H(p_s (y|\alpha (x_b)), p_b)
$$


- $\frac{1}{B} \sum_{b=1}^{B}$ :미니배치에 있는 각 데이터 포인트에 대한 평균 손실을 계산
    - _B_는 미니배치의 크기.
- $M(x_b) $: 각 레이블이 있는 데이터 포인트 $x_b$에 대한 0/1 마스크. 이 마스크는 소수 클래스의 데이터 포인트에 더 높은 가중치를 부여함.
- _H:_ 표준 교차 엔트로피 손실 함수
- $(p_s (y|\alpha (x_b)), p_b)$: ABC가 변형된 레이블이 있는 데이터 포인트 $\alpha (x_b)$에 대해 예측한 클래스 분포
- $p_b$ : 실제 레이블의 확률 분포(여기서는 one-hot label)

### **labeled data 에 대한 0/1 masking**



$$
M(x_b) = B \left( \frac{N_L}{N_{y_b}} \right)
$$


- $M(x_b) $: 각 레이블이 있는 데이터 포인트 $x_b$에 대한 0/1 마스크.
- B : 베르누이 분포, $\frac{N_L}{N_{y_b}} $ 를 매개변수로 사용
    - $N_L$ 은 레이블이 있는 모든 데이터 포인트의 수
    - $N_{y_b}$ 는  데이터 포인트 $x_b$ 가 속한 클래스의 데이터 포인트 수
- 이 마스크는 소수 클래스의 데이터 포인트에 대해 1을 생성할 확률을 높이고, 다수 클래스에 대해서는 낮춤.
- 소수 클래스 데이터 포인트의 손실에 더 높은 가중치를 주어 모델이 이들에 더 많은 주의를 기울이도록 함
- ABC의 출력 결과와 실제 레이블을 비교하여  $L_{cls}$ 를 계산
- 이 손실을 바탕으로 ABC의 파라미터에 대한 Gradient가 계산됨.

### ABC에 대한 일관성 정규화 손실 (Consistency Regularization Loss)

- **Consistency Regularization**
    - 레이블이 없는 데이터를 사용하여 decision boundary(클래스를 구분하는 경계)와 데이터 포인트 사이의 거리를 늘리려는 의도
    - weak augmentation 된 unlabeled data는 ABC(Auxiliary Balanced Classifier)에 의해 분석되어 각 클래스에 속할 확률 분포를 예측, 이를 soft pseudo-label 로 사용
    - 동일한 unlabeled data에 strong augmentation 적용
    - **Consistency Regularization:** 두 개의 unlabeled data에 대한 예측이 soft pseudo-label 에 가까워지도록 하는 것
        - 약하게 증강된 데이터 포인트에 대한 ABC의 예측(soft pseudo-label)과 강하게 증강된 데이터 포인트에 대한 ABC의 예측이 서로 비슷해지도록 하는 것
        - 모델이 일관되게 예측하는 것을 강화하려는 것을 목표
    - **클래스 불균형 대처:** 다수 클래스에 속하는 unlabeled data point가 많기 때문에, 일관성 정규화를 모든 클래스에 대해 균등하게 적용하기 위해 또 다시 0/1 마스크를 사용함.


$$
L_{\text{con}} = \frac{1}{B} \sum_{b=1}^{B} \sum_{k=1}^{K} M(u_b) I(\max(q_b) > \tau) H(p_s (y|A_k (u_b)), q_b)
$$


- $L_{\text{con}} $ : ABC의 Consistency Regularization Loss
- $\frac{1}{B} \sum_{b=1}^{B}$ $\sum_{k=1}^{K} $
- 미니배치 내의 각 데이터 포인트와 각각의 증강에 대해 이중 합계를 계산
    - K : 강한 변형의 수
- $M(u_b) $: 레이블이 없는 데이터 포인트 $u_b$에 대한 0/1 마스크.
    - 클래스 불균형을 처리하기 위한 가중치를 제공
- I : 지시 함수, $\max(q_b) > \tau$ 일 경우에만 1 반환.
    - $\max(q_b)$ : pseudo-label $q_b$ 의 가장 높은 확률, $\tau$ 는 설정된 신뢰 임계값
    - pseudo-label 의 최대 확률이 임계값  $\tau$ 이상일 경우에만 손실을 계산하는 데 사용
- $H$: 교차 엔트로피 손실 함수
- $p_s (y|A_k (u_b))$ 는 ABC가 강하게 변형된 unlabeled data point $A_k (u_b)$ 에 대해 예측한 클래스 분포
- $q_b$ 는 soft pseudo-label

### unlabeled data 에 대한 0/1 masking



$$
M(u_b) = B \left( \frac{N_L}{N_{\widehat{q_b}}} \right)
$$


- $M(u_b) $:  레이블이 없는 데이터 포인트 $u_b$에 대한 마스크.
- B : 베르누이 분포, $\frac{N_L}{N_{q_b}} $ 를 매개변수로 사용
- $N_{\widehat{q_b}}$ 는  soft pseudo-label $q_b$ 에 의해 가장 높은 확률을 가진 클래스의 데이터 포인트 수

⇒  ABC는 레이블이 없는 데이터의 각각의 변형에 대해 예측을 하고, 이 예측이 일정한 신뢰도 임계값 이상일 때만 학습에 사용됨.

- 여기서 신뢰도가 높은 데이터 포인트들만이 선택되어 일관성 손실을 계산하는 데 기여함.

### **cf. "we do not backpropagate gradients for pseudo-label prediction"**

- pseudo label을 생성하는 과정에서, 그 의사 레이블을 예측하는 데 사용된 모델 파라미터에 대해 그라디언트(오류 신호)를 역전파하지 않는다.
- 즉, pseudo label 생성 과정은 모델 학습에 영향을 주지 않음.
- 오직 생성된 의사 레이블을 사용해 모델을 학습시킬 때만 **backpropagate gradients**.
- 이 방법은 모델이 자기 자신의 예측으로부터 직접적으로 학습하지 않게 하여, 잘못된 레이블에 대한 모델의 자신감이 과도하게 증가하는 것을 방지

    ![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/10.png)

1. 데이터 증강
    - 약하게 증강된 데이터는 주로 모델이 의사 레이블을 생성하기 위해 사용되며, 강하게 증강된 데이터는 일관성 정규화에 사용
2. Deep CNN :  데이터 특징을 추출
3. **Representation**
    - CNN의 중간 레이어에서 나오는 특징은 'Representation'으로 불리며, 이는 다음 단계인 분류를 위한 기초임
    - CNN에서 추출된 특징들은 Representation Layer로 전달되어, 최종 분류 작업에 필요한 형태로 변환
4. **Backbone Classifier**
    - 'Representation'은 'Backbone Classifier'로 전달되어, 레이블이 있는 데이터에 대한 예측을 수행. SSL(반지도 학습) 알고리즘의 핵심
5. **ABC**
- 동시에, 'Representation'은 ABC에도 전달됨. ABC는 모든 클래스 간에 균형을 맞추기 위해 별도로 훈련됨
1. **0/1 Masking**
- 클래스 간의 불균형을 조정. 특정 클래스에 대한 손실 가중치를 조절하여, 소수 클래스의 데이터가 무시되지 않도록
1. $L_{cls}$ **:** masking 데이터를 기반으로 계산
2. **Confidence Threshold &** $L_{con}$
    - 'Confidence Threshold'는 모델이 생성한 의사 레이블의 신뢰도를 측정. 이 임계값을 넘는 의사 레이블만이 학습에 사용.
    - 일관성 정규화 손실: 레이블이 없는 데이터에 대한 모델의 예측이 일관되도록,  모델이 강하게 증강된 데이터에 대해 안정적인 예측을 하도록 장려
    - 0/1 마스킹을 거친 후 계산
3. **Gradient**
    - 최적화 과정.  ABC와 Backbone Algorithm 모두에서 계산. 모델의 가중치가 업데이트

### Algorithm 


![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/11.png)


```python
def train(labeled_trainloader, unlabeled_trainloader, model, optimizer, ema_optimizer, criterion, epoch,ir2):
    
		# Initialization
		batch_time = AverageMeter()
    data_time = AverageMeter()
    losses = AverageMeter()
    losses_x = AverageMeter()
    losses_u = AverageMeter()
    losses_abc = AverageMeter()
    end = time.time()

    bar = Bar('Training', max=args.val_iteration)
    labeled_train_iter = iter(labeled_trainloader)
    unlabeled_train_iter = iter(unlabeled_trainloader)

    model.train()
    for batch_idx in range(args.val_iteration):
        try:
            inputs_x, targets_x, _ = next(labeled_train_iter)
        except:
            labeled_train_iter = iter(labeled_trainloader)
            inputs_x, targets_x, _ = next(labeled_train_iter)

        try:
						#WeakAugment, StrongAugment
            (inputs_u, inputs_u2, inputs_u3), _, idx_u = next(unlabeled_train_iter)
        except:
            unlabeled_train_iter = iter(unlabeled_trainloader)
            (inputs_u, inputs_u2, inputs_u3), _, idx_u = next(unlabeled_train_iter)

        # Measure data loading time
        data_time.update(time.time() - end)
        batch_size = inputs_x.size(0)

        # Transform target_x label to one-hot
        targets_x2 = torch.zeros(batch_size, num_class).scatter_(1, targets_x.view(-1,1), 1)

        inputs_x, targets_x2 = inputs_x.cuda(), targets_x2.cuda(non_blocking=True)
        inputs_u, inputs_u2, inputs_u3  = inputs_u.cuda(), inputs_u2.cuda(), inputs_u3.cuda()

        # Generate the pseudo labels
        with torch.no_grad():
            # Generate the pseudo labels by aggregation and sharpening
            q1=model(inputs_u)
            outputs_u= model.classify(q1) #최종 레이어의 출력
            targets_u2 = torch.softmax(outputs_u, dim=1).detach() #클래스 별 확률

        targets_u = torch.argmax(targets_u2, dim=1) 
				# pseudo label 에서 가장 높은 확률을 가진 클래스의 인덱스 선택

        q = model(inputs_x)
        q2 = model(inputs_u2)
        q3 = model(inputs_u3)

				#pseudo label 인 targets_u2 에서 가장 높은 확률 값을 가진 class 와 그 확률 값을 추출
        max_p, p_hat = torch.max(targets_u2, dim=1)
			 #가장 높은 확률 값을 가진 클래스의 인덱스를 원-핫 인코딩 형식으로 변환
        p_hat = torch.zeros(batch_size, num_class).cuda().scatter_(1, p_hat.view(-1, 1), 1)
        
				#confidence threshold. 95%보다 클 때만 마스크 생성
				select_mask = max_p.ge(0.95)
        select_mask = torch.cat([select_mask, select_mask], 0).float()
				
				# 원-핫 인코딩된 실제 레이블과 의사 레이블을 결합해 모델 훈련에 사용할 전체 타겟 생성
        all_targets = torch.cat([targets_x2, p_hat, p_hat], dim=0)
				
				#각 데이터 포인트에 대한 로짓 계산
        logits_x=model.classify(q)
        logits_u1=model.classify(q2)
        logits_u2=model.classify(q3)
			  # 레이블이 없는 데이터에 대한 로짓값 결합
        logits_u = torch.cat([logits_u1,logits_u2],dim=0)
				
				#클래스 불균형을 조정하기 위한 마스킹 생성. 
				#각 샘플의 레이블 분포에 따라 베르누이 분포를 사용해 샘플링
        maskforbalance = torch.bernoulli(torch.sum(targets_x2 * torch.tensor(ir2).cuda(0), dim=1).detach())

				#레이블이 있는 데이터와 레이블이 없는 데이터의 추가 로짓 계산
        logit = model.classify2(q)
        logitu1 = model.classify2(q1)
        logitu2 = model.classify2(q2)
        logitu3 = model.classify2(q3)
				#확률로 변환
        logits = F.softmax(logit)
        logitsu1 = F.softmax(logitu1)
				#레이블이 없는 데이터로부터 생성된 의사 레이블 중 가장 확률이 높은 클래스 선택
        max_p2, label_u = torch.max(logitsu1, dim=1)
				
        select_mask2 = max_p2.ge(0.95)
				#one-hot encoding 으로 변환된 의사 레이블 생성
        label_u = torch.zeros(batch_size, num_class).scatter_(1, label_u.cpu().view(-1, 1), 1)
        #시간에 따라 변하는 가중치를 사용해
				#클래스 불균형을 조정하기 위한 마스크를 레이블이 없는 데이터에 대해 생성
				#ir22는 에폭에 따라 조정되어 가는 가중치, 이를 사용해 베르누이 분포를 통한 샘플링을 수행
				ir22 = 1 - (epoch / 500) * (1 - ir2)
        maskforbalanceu = torch.bernoulli(torch.sum(label_u.cuda(0) * torch.tensor(ir22).cuda(0), dim=1).detach())
        logitsu2 = F.softmax(logitu2)
        logitsu3 = F.softmax(logitu3)

				#classification loss
        abcloss = -torch.mean(maskforbalance * torch.sum(torch.log(logits) * targets_x2.cuda(0), dim=1))
        #consistency regularization loss
				#레이블이 없는 데이터에 대해 계산된 일관성 정규화 손실을 계산
				abcloss1 = -torch.mean(
            select_mask2 * maskforbalanceu * torch.sum(torch.log(logitsu2) * logitsu1.cuda(0).detach(), dim=1))

        abcloss2 = -torch.mean(
            select_mask2 * maskforbalanceu * torch.sum(torch.log(logitsu3) * logitsu1.cuda(0).detach(), dim=1))

        totalabcloss=abcloss+abcloss1+abcloss2
				#backbone loss
        Lx, Lu = criterion(logits_x, all_targets[:batch_size], logits_u, all_targets[batch_size:], select_mask)
        #레이블이 있는 데이터에 대한 손실, 레이블이 없는 데이터에 대한 손실, ABC 손실을 모두 더한 total loss
				loss = Lx + Lu+totalabcloss

        # record loss
        losses.update(loss.item(), inputs_x.size(0))
        losses_x.update(Lx.item(), inputs_x.size(0))
        losses_u.update(Lu.item(), inputs_x.size(0))
        losses_abc.update(abcloss.item(), inputs_x.size(0))
        # compute gradient and do SGD step
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        ema_optimizer.step()

        batch_time.update(time.time() - end)
        end = time.time()

        # plot progress
        bar.suffix  = '({batch}/{size}) Data: {data:.3f}s | Batch: {bt:.3f}s | Total: {total:} | ETA: {eta:} | ' \
                      'Loss: {loss:.4f} | Loss_x: {loss_x:.4f} | Loss_u: {loss_u:.4f}| Loss_m: {loss_m:.4f}'.format(
                    batch=batch_idx + 1,
                    size=args.val_iteration,
                    data=data_time.avg,
                    bt=batch_time.avg,
                    total=bar.elapsed_td,
                    eta=bar.eta_td,
                    loss=losses.avg,
                    loss_x=losses_x.avg,
                    loss_u=losses_u.avg,
            loss_m=losses_abc.avg,
                    )
        bar.next()
    bar.finish()

    return (losses.avg, losses_x.avg, losses_u.avg, losses_abc.avg)
```


# Experiments


![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/12.png)

- Vanila : Deep CNN 으로 labeled data 로만 학습
- BALMS : Class-Imbalanced 알고리즘, unlabeled data 를 사용하지 않음.
- VAT, ReMixMatch, FixMatch : SSL 알고리즘, 클래스 불균형 미고려
- +CReST + PDA : CISSL 알고리즘. 다수 클래스로 분류된 데이터보다 소수 클래스로 분류된 unlabeled data 를 더 높은 확률로 사용. 불균형 완화
- +DARP : pseudo-label 을 개선하는 CISSL 알고리즘
- +DARP + cRT(rebalancing 기법) : classfier 미세 조정

⇒ 클래스 불균형 상황에서도 훈련에 unlabeled data 를 사용하는 게 성능 향상에 도움


⇒ Proposed Algorithm 이 가장 성능 좋은 이유: End to End 방식. unlabeled data 를 ABC 에서 같이 훈련에 활용


![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/13.png)


+DARP+cRT : classifier tuning 에 unlabeled data 를 사용하지 않음.

- labeled data 의 양 $\beta$ 가 감소하고 클래스 불균형 비율 $\gamma$ 가 증가할수록 Proposed Algorithm 과 성능 차이 커짐

+CReST+PDA : 클래스 불균형 비율 $\gamma$ 가 증가할수록 Proposed Algorithm 과 성능 차이 커짐

- 다수 클래스에 속하는 labeled data point 의 수와 소수 클래스로 분류되는 unlabeled data point 의 수의 차이가 클래스 불균형 비율 $\gamma$ 에 따라 증가하기 때문으로 분석

![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/14.png)

- step-imbalanced 상태 : 일정한 수의 다수 클래스가 동일한 양의 데이터를 가지며, 나머지 소수 클래스도 동일한 양의 데이터를 가짐. 특정 지점에서 데이터 양이 갑자기 변경되는 시나리오를 나타냄.
    - **Long-tail 불균형**: 클래스별 데이터 포인트의 수가 지수적으로 감소하며, 가장 많은 데이터를 가진 클래스부터 가장 적은 데이터를 가진 클래스까지 줄어듦. 많은 실세계 데이터셋에서 흔히 볼 수 있는 불균형 유형.

![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/15.png)


![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/16.png)

- unlabeled data set 의 규모가 커질수록 문제 해결이 어려움.

### Complexity of Proposed Algorithm

- ABC : Backbone 의 representation layer 를 공유. 메모리 사용량과 훈련 시간이 크게 증가하지 않음
- 전체 훈련 절차: 미니 배치 데이터 사용 가능 → 계산 비용의 효율성
    - DARP 와 결합하는 경우, 모든 pseudo-label 에 대한 convex optimization 이 필요함
    - CReST와 결합하는 경우, pseudo-label 이 없는 data point 에 pseudo-label 을 추가해 확장된 레이블 집합을 반복적으로 재훈련해야 함. 상당한 시간 필요

### **Qualitative analysis** 



![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/17.png)

- backbone 을 활용하지 않을 경우, 0/1 마스크를 사용하는 동안 충분한 데이터가 학습에 사용되지 않아, 클래스 구분 가능한 representation 을 학습하는 데 실패

### **Ablation study**


![](/assets/seminars/abc-auxiliary-balanced-classifier-for-class-imbalanced-semi-supervised-learning-/18.png)

- Consistency Regularization 을 수행할 때 베르누이 분포의 파라미터를 점진적으로 감소시키지 않으면, 소수 클래스로 잘못 분류된 레이블이 없는 데이터로 인해 over balance 문제가 발생함.
- ABC 에 대한 Consistency Regularization 를 수행하지 않으면 decision boundary 가 각 class 를 명확하게 구분하지 못함.
- 0/1 마스크 L_cls ,L_con 을 사용하지 않고 ABC 가 다수 클래스에 편향되도록 훈련
- Consistency Regularization 를 위한 임계값 $\tau$가 없으면 훈련이 불안정해져 결과적으로 ABC 가 특정 클래스에 편향되도록 훈련됨
- Consistency Regularization 에 hard-pseudo label 을 사용할 경우, ABC 가 특정 레이블에 편향됨
- Backbone 없이 ABC 만 사용한 경우, backbone 의 representation 을 ABC 가 학습할 수 없어 성능 저하
- ABC 에 mask 대신 reweighting 사용 시, 소수 클래스의 학습에 대한 gradient 가 비정상적으로 커져, 학습이 불안정해졌음
