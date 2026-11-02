---
date: 2024-08-16
title: Co-teaching: Robust Training of Deep Neural Networks with Extremely Noisy Labels
category: Paper Review
presenter: Seongjin
url: https://www.notion.so/ee84b2bb1771409a8ad36a95481e0b97
keywords: Noisy label learning
---

## Abstract: 


Deep learning with noisy labels is practically challenging, as the capacity of deep models is so high that they can totally memorize these noisy labels sooner or later during training. Nonetheless, recent studies on the memorization effects of deep neural networks show that they would first memorize training data of clean labels and then those of noisy labels. Therefore in this paper, we propose a new deep learning paradigm called “Co-teaching” for combating with noisy labels. Namely,
we train two deep neural networks simultaneously, and let them teach each other given every mini-batch: firstly, each network feeds forward all data and selects some data of possibly clean labels; secondly, two networks communicate with each other what data in this mini-batch should be used for training; finally, each network back propagates the data selected by its peer network and updates itself. Empirical results on noisy versions of MNIST, CIFAR-10 and CIFAR-100 demonstrate that
Co-teaching is much superior to the state-of-the-art methods in the robustness of trained deep models.


# Introduction


## Noisy Labels

- 정의 : 데이터셋에서 잘못된, 부정확한, 또는 불확실한 레이블
- 원인 : 사람이 라벨링할 때의 실수, 자동화된 라벨링 시스템의 오류, 또는 데이터 자체의 애매함 등
- 딥러닝 모델 : 방대한 Capacity로 Noisy Label까지 모두 학습해버림.

       ⇒ 모델 학습의 정확도를 떨어뜨림. 성능 저하 초래


## 기존 방법론 : Noise Transition Matrix (NTM) 추정

- Goldberger : NTM을 모델링 하기 위한 softmax layer 추가
- Patrini : NTM 추정 위해 heuristic한 방법을 적용한 2 Step 방법론 사용
- 한계점 : Class 수가 많을 때, NTM 추정이 쉽지 않음

## 기존 방법론 : Clean instances 추출

- NTM을 추정하지 않고 기존 Data에서 Clean set(Clean instances)를 추출하여 Train.
- 제대로 labeled 된 데이터만으로 model update 하려는 목적.

### Mentor-Net (M-Net)

- Clean set을 뽑기 위한 추가적인 Network을 사전학습하여 사용.
- 단점) Clean validation set이 없으면, 사전 정의된 커리큘럼을 따라서 사용해야함. 샘플 선택에 편향이 있을 수 있고 오류가 누적되어 문제 발생 가능.

### Decoupling

- 구조가 동일한 2개의 Network를, 서로 다른 initial point에서 시작하여, 서로 다른 예측이 나온 경우만 사용하여 각 모델을 업데이트.
- 단점) 노이즈 라벨이 전체 데이터 공간에 고르게 분포하기 때문에, 불일치 영역에도 노이즈 존재. 노이즈 라벨을 명확하게 처리하기 어려움.

### Co-teaching

- 이 연구에서 제안하는 Co-teaching 방법.
- 앞서 Decoupling과 유사하게, 구조가 동일한 2개의 Network를, 서로 다른 initial point에서 시작함.
- 각 mini-batch마다 small-loss instances (배우기 쉬운 data, clean label일 확률이 높은 것)을 사용하여 상대방 Network를 update 시킵니다.

![Fig1. 3가지 구조 도식화](/assets/seminars/co-teaching-robust-training-of-deep-neural-networks-with-extremely-noisy-labels/0.png)

- **M-Net** : 전체 Network 안에 Clean set 추출용 Teacher Net을 통해 Student Net이 학습됨.
- **Decoupling** : A Net ↔ B Net (update if ≠)
- **Co-teaching** : A Net ↔ B Net (small-loss인 clean label로 상대방 Net을 update)

### M-Net과 Decoupling, Co-teaching 방법의 차이점

- 이전 mini-batch의 error가 본인(Net)의 다음 mini-batch로 바로 update되지 않음. error 누적을 방지할 수 있음.

# Background


## Memorization Effect

- Deep Neural Net은 학습할 때 쉬운 데이터 패턴부터 먼저 학습함.
- 더 복잡한 패턴은 이후에 학습하면서 데이터를 하나하나 외우기 시작하는 특성.

⇒ 올바른 라벨을 가진 Clean set은 더 일관된 패턴을 갖고 있어 학습이 더 쉬움, Noisy labeled data보다 Loss가 더 낮고 더 빠르게 학습됨.

- 앞서 Co-teaching에서 모델 학습 중 일정 비율의 큰 Loss를 갖는 데이터를 제외하여 Noisy label을 배제함으로 적용됨.
- 위 Memorization effect는 Network 구조, Optimizer와 관계없이 일어난다고 알려져있음.

### Co-teaching Algorithm


![](/assets/seminars/co-teaching-robust-training-of-deep-neural-networks-with-extremely-noisy-labels/1.png)


Network : $f,g$ , Weight $w_f, w_g$, Learning rate  $\eta$


Epoch  $T_k, T_{max}$, Iteration  $N_{max}$, 최종 고정된 비율값  $\tau$

1. 초기 설정 : 두 네트워크 $f,g$ 의 파라미터 $w_f, w_g$, Learning rate $\eta$, Epoch $T_k, T_{max}$, Iteration $N_{max}$, 최종 고정된 비율값 $\tau$ 를 입력으로 받음.

    각 Epoch 마다

    1. 노이즈가 포함된 훈련 데이터셋 $D$를 셔플링.

    각 iteration 마다

        1. 셔플된 데이터셋 $D$에서 미니배치 $\bar{D}$를 추출.

        4,5. 네트워크 $f,g$는 각각 small-loss instances 선택. 


        6,7. 네트워크 $f$는 $g$가 선택한 $\bar{D_g}$ 사용하여 자신의 파라미터 $w_f$ 업데이트,  $\bar{D_f}$를 사용하여 $w_g$ 업데이트.

        1. 에포크 $T$에 따라 $R(T)$를 업데이트. $R(T)$는 시간이 지남에 따라 작아져 더 작은 비율의 인스턴스를 선택.

    9.  출력 : 모든 에포크가 완료되면, 학습된 두 네트워크 $w_f, w_g$ 출력.


몇 %의 데이터만 사용할 것 인지를 정하는 R(T)와 $\tau$에 대해서는 이후 Section에서 추가 설명


# Co-teaching meets noisy supervision


## Q1. 왜 R(T)를 동적으로 사용하는 것이 효과적인가?

- R(T) : 데이터에서 손실이 작은 인스턴스를 선택하는 비율
- 손실이 작은(small-loss) 인스턴스는 보통 라벨이 정확한 경우가 많음.
- Deep Neural Network는 학습 초기에 깨끗하고 쉬운 패턴을 먼저 학습하는 경향이 있음.

     ⇒ 초기에는 많은 데이터를 사용해 깨끗한 데이터를 학습하고, 시간이 지나면서 R(T)를 점차 줄여
          Noisy data를 학습하지 않도록 조함.


## Q2. 왜 두 개의 네트워크가 필요하고, 서로의 파라미터를 교차해서 업데이트해야 할까?

- 하나의 네트워크로 학습할 때, 잘못된 데이터가 선택되면 학습 성능이 떨어질 수 있음.
- 그러나 두 개의 네트워크를 사용하면 서로 다른 decision boundary를 만들어냄

       → Noisy label을 걸러낼 수 있는 능력 향상.

- 각 네트워크가 선택한 Small-loss 데이터를 다른 네트워크가 학습하도록 하여, 서로의 오류를 보완.

       → Peer review와 유사한 작용, 단일 네트워크보다 Noise Robustness가 증가함.


# Data

- MNIST, CIFAR10, CIFAR100 (Table1)

    ![](/assets/seminars/co-teaching-robust-training-of-deep-neural-networks-with-extremely-noisy-labels/2.png)


    ⇒ Clean, Image set

- Noise Transition matrix Q를 통해 noise를 생성.


$$
NTM : Q_{ij} = Pr(\tilde{y}=j|y=i)
$$


- Clean label : $y$
- Flipped label : $\tilde{y}$

       ⇒   $Q_{ij}$ = label i가 실제로 라벨 j일 확률 


![](/assets/seminars/co-teaching-robust-training-of-deep-neural-networks-with-extremely-noisy-labels/3.png)

- Label : 0~4, 해당하는 확률
- noise rate $\epsilon$ : 각 Label이 실제 Label이 아닐 확률

(1) Symmetry flipping (b)

    - $Q_{0,0}$ = 50%, $Q_{0,1}$ = 12.5%, $Q_{0,2}$ = 12.5%, $Q_{0,3}$ = 12.5%

(2) Pair flipping (a)

    - $Q_{0,0}$ = 55%, $Q_{0,1}$ = 45%, $Q_{0,2}$ = 0%

분류 난이도 : (a) >> (b)


(a) 정답 instance가 55:45, 10% 차이


(b) 50 : 12.5 : 12.5 : 12.5 : 12.5, 가장 높은 Class와의 확률 차이가 37.5%


# Baselines

- 제안하는 Co-teaching 과 비교할 Baseline들.

    ![](/assets/seminars/co-teaching-robust-training-of-deep-neural-networks-with-extremely-noisy-labels/4.png)

1. Bootstrap
    - predicted label과 original label을 weighted combination해서 correct label로 사용. (Hard label)
2. S-Model
    - NTM을 모델링 하기 위해 추가적인 softmax layer 사용.
3. F-Correction
    - Standard Net을 train하여 NTM을 추정. 추정된 NTM으로 예측을 수정함.
4. Decoupling
    - Initial point가 다른 2개의 동일한 Net을, 예측이 다른 instance만을 학습.
5. Mentor-Net
    - Teacher Net이 pre-train되어 noisy instance를 filtering, Student Net이 받아서 Classify.
6. Co-Teaching
    - Initial point가 다른 2개의 동일한 Net이 서로의 small-loss instance를 상대방 Net에 학습시킴.
    - 학습 초기에는 더 많은 데이터 사용, 점차 데이터 양을 줄임.
7. Standard (Co-teaching의 기본 Deep Neural Net, 위의 baseline들의 Net)

    ![](/assets/seminars/co-teaching-robust-training-of-deep-neural-networks-with-extremely-noisy-labels/5.png)

    - K80 GPU, Pytorch, 9-layer CNN, Leaky-ReLU, Adam(momentum=0.9), Lr=0.001, batch size = 128, 200 epochs, 5-fold validation.

# Evaluation

1. Test accuracy = $\frac{\text{\# of correct predictions}}{\text{\# of test samples}}$

    : 모델이 테스트 데이터셋에서 올바르게 예측한 비율

2. Label-precision in mini-batch (M-Net, Decoupling, Co-teaching only) = $\frac{\text{\# of clean labels}}{\text{\# of all selected labels}}$

    : 각 미니배치에서 선택된 라벨 중 Clean label 비율.

    - Label precision 높음 → 샘플링 후 미니배치에 포함된 노이즈 개수가 적음 → 노이즈에 더 강인함.

# Results on MNIST


![](/assets/seminars/co-teaching-robust-training-of-deep-neural-networks-with-extremely-noisy-labels/6.png)


### Sym 20% (easiest)

- 모든 방법이 좋은 성능을 보임.

### Sym 50% 

- Standard, Bootstrap, S-model, F-correction 성능저하.
- Decoupling, M-Net, Co-teaching 성능 양호 (Co-teaching이 가장 좋음)

### Pair 45% (hardest) 

- Standard, Bootstrap, S-model : 학습 전혀 안됨. (Clean set 비율과 Accuracy가 거의 같음)
- F-correction : Fail, (NTM 추정에 실패)
- Decoupling, M-Net, Co-teaching 성능 양호 (Co-teaching과 다른 방법 간 성능 차이가 많이 남)

![Figure 3: 테스트 정확도와 epoch 수의 관계](/assets/seminars/co-teaching-robust-training-of-deep-neural-networks-with-extremely-noisy-labels/7.png)

- x축 : Epoch,  y축: test accuracy.
- 모든 그래프에서 네트워크의 "memorization effect"를 확인 가능.

    ⇒ Epoch 초반에는 Clean label들로 학습되기 때문에, accuracy가 높고 점차 감소. 

    - 강건한 방법은 이 감소를 막거나 완화해야 함.

(c) Symmetry-20% 같은 쉬운 경우 : Bootstrap을 제외한 모든 방법이 잘 작동함.


(a), (b) 더 어려운 Pair-45%와 Symmetry-50%의 경우 : MentorNet, Co-teaching만이 효과적.

- Co-teaching이 일관되게 더 높은 정확도, 특히 어려운 경우에서 가장 좋은 성능을 보임.
- x축 : Epoch, y축 : Label Precision.
- Decoupling은 깨끗한 인스턴스를 제대로 선택하지 못함.
    - Decoupling의 라벨 정밀도가 Standard와 동일.
    - Decoupling이 "memorization effect"를 활용하지 않기 때문.
- Co-teaching과 MentorNet은 깨끗한 인스턴스를 성공적으로 선택.
    - 쉬운 Symmetry-20%와 Symmetry-50%에서는 비슷한 성능.
    - 어려운 Pair-45% 상황에서 Co-teaching이 더 높은 정밀도, 깨끗한 인스턴스를 찾는 데 뛰어남.

# Results on CIFAR10


    ![](/assets/seminars/co-teaching-robust-training-of-deep-neural-networks-with-extremely-noisy-labels/8.png)


    ![](/assets/seminars/co-teaching-robust-training-of-deep-neural-networks-with-extremely-noisy-labels/9.png)

    - MNIST와 성능 차이만 일부 존재, 결과는 동일함.

# Results on CIFAR100


    ![](/assets/seminars/co-teaching-robust-training-of-deep-neural-networks-with-extremely-noisy-labels/10.png)


    ![](/assets/seminars/co-teaching-robust-training-of-deep-neural-networks-with-extremely-noisy-labels/11.png)

    - MNIST와 성능 차이만 일부 존재, 결과는 동일함.

![Figure 4: 라벨 정밀도와 epoch 수의 관계](/assets/seminars/co-teaching-robust-training-of-deep-neural-networks-with-extremely-noisy-labels/12.png)


### 추가 분석

- Label Precision 측면에서
    - Pair45%에서 Co-teaching > Mentor-Net
    - Sym50, Sym20에서 Co-teaching $\approx$ Mentor-Net
- Co-teaching이 Mentor-Net보다 나은 이유를 저자들은 Network의 개수 및 구조 차이로 해석.
- Sym20 경우, F-correlation $\gtrsim$ Co-teaching
    - 의견) 쉬운 경우에는 NMT를 추정하기 쉬워서 더 정확하게 예측할 수 있으나, 어려운 경우에는 적용이 어려운 것 같음.

# Choices of R(T) and $\tau$

- 네트워크는 먼저 깨끗한 인스턴스를 학습한 후 점차 노이즈 인스턴스를 학습.
- $R(T)$는 다음 조건을 만족해야함 :
    - $R(T)∈[τ,1]$이며, $\tau$는 노이즈 비율 $\epsilon$에 따라 결정.
    - $R(1)=1$ : 초기 학습에서는 인스턴스 제거 없이 모든 데이터 사용.
    - $R(T)$는 Non-decreasing function : 학습이 진행되며 더 많은 인스턴스 제거 필요.

![](/assets/seminars/co-teaching-robust-training-of-deep-neural-networks-with-extremely-noisy-labels/13.png)

- $R(T)$의 감소가 Co-teaching에 미치는 영향:
    - $R(T) = 1 - \tau \cdot \min\left\{\frac{T^c}{T_k}, 1\right\}$
    - $c=\{0.5,1,2\}$ 및 $T_k=\{5,10,15\}$로 설정.
    - Table 7에서 test accuracy는 $T_k$와 $c$에 대해 안정적임.
- $\tau$의 영향: Table 8
    - $\tau = \{0.5, 0.75, 1, 1.25, 1.5\} \epsilon$으로 설정.
    - 더 많은 인스턴스를 제거하면 성능 향상 (1.25 $\epsilon$) , 그러나 과도한 제거는 성능 저하 (1.5 $\epsilon$).
    - 이전 실험들에서는 $τ=ϵ$로 설정함. 잘 작동하지만 최상의 성능은 아님.

# Conclusion

- **Co-teaching**: 노이즈가 많은 환경에서 딥 뉴럴 네트워크를 강건하게 학습시키는 간단하고 효과적인 학습 패러다임.
- **핵심 아이디어**:
    - 두 개의 네트워크를 동시에 유지.
    - "Small-loss" 기준으로 선별된 인스턴스를 Cross-train.
- **실험 결과**:
    - Co-teaching은 매우 높은 노이즈 환경에서도 딥 모델을 안정적으로 학습 가능.
- **Future work**:
    - Semi-supervised 환경에서의 검증 제안.
- **의견**:
    - 학습 패러다임 제안으로 다양한 모델에 적용 가능성이 있음.
    - 실제 real-data에서의 검증 필요.

# Code


**핵심 코드** : `loss_coteaching` 함수

1. **손실 계산 및 정렬**:

    ```python
    def loss_coteaching(y_1, y_2, t, forget_rate, ind, noise_or_not):
    		loss_1 = F.cross_entropy(y_1, t, reduce=False)
    		loss_2 = F.cross_entropy(y_2, t, reduce=False)
    		ind_1_sorted = np.argsort(loss_1.data).cuda()
    		ind_2_sorted = np.argsort(loss_2.data).cuda()
    ```

    - 각 네트워크의 예측 손실 계산 후, 손실이 작은 인스턴스들을 정렬.
2. **기억률 계산 및 인스턴스 선택**:

    ```python
    remember_rate = 1 - forget_rate
    		num_remember = int(remember_rate * len(loss_1_sorted))
    		ind_1_update = ind_1_sorted[:num_remember]
    		ind_2_update = ind_2_sorted[:num_remember]
    ```

    - `forget_rate`에 따라 기억할 인스턴스의 비율을 계산하고, 해당 인스턴스 선택.
3. **교차 학습 진행**:

    ```python
    loss_1_update = F.cross_entropy(y_1[ind_2_update], t[ind_2_update])
    		loss_2_update = F.cross_entropy(y_2[ind_1_update], t[ind_1_update])
    ```

    - 선택된 인스턴스들을 다른 네트워크에 전달하여 학습.
4. **평균 손실 계산 및 반환**:

    ```python
    return torch.sum(loss_1_update)/num_remember, torch.sum(loss_2_update)/num_remember, pure_ratio_1, pure_ratio_2
    ```

    - 평균 손실을 계산하고, 노이즈 필터링 성능 평가.

**R(T)와** $\tau$ **관련 코드**:

1. **`forget_rate`** **설정**:
    - 노이즈 비율 기반 설정:

    ```python
    if args.forget_rate is None:
        forget_rate = args.noise_rate
    else:
        forget_rate = args.forget_rate
    ```

2. **`rate_schedule`** **정의**:
    - 초기 `epoch` 동안 선형 증가:

    ```python
    rate_schedule = np.ones(args.n_epoch) * forget_rate
    rate_schedule[:args.num_gradual] = np.linspace(0, forget_rate**args.exponent, args.num_gradual)
    ```

3. **손실 계산 시 적용**:
    - 각 epoch에서 `forget_rate` 적용:

    ```python
    loss_1, loss_2, pure_ratio_1, pure_ratio_2 = loss_coteaching(logits1, logits2, labels, ra
    ```
