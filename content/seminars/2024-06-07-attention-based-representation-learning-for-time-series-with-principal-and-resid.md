---
date: 2024-06-07
title: Attention-based Representation Learning for Time Series with Principal and Residual Space Monitoring
category: Paper Review
presenter: Seongjin
url: https://www.notion.so/ecb8b06cbfeb4a87a0cb280995ada3e4
keywords: Anomaly Detection, Representation Learning, Attention, time series, residual space
---

# Selected Paper


## **Attention-based Representation Learning for Time Series with Principal and Residual Space Monitoring**


2022 IEEE 18th International Conference on Automation
Science and Engineering (CASE)


## Abstract: 


The encoder-decoder network is one of the most common deep learning models for time series representation learning and anomaly detection. However, it is hard to reconstruct time series, which is complex, correlated, and lacking in common patterns. In this paper, we apply the attention mechanism to rescale convolution layers and learn representation in the principal and the residual space. To avoid the reconstruction process, we define the residual space by the omitted segments according to the attention score in the encoder. We introduce the temporal information inside the token level and use sparse penalty to improve representation learning. We apply the proposed model to anomaly classification and fault detection experiments on two datasets, i.e. multivariate bearing fault dataset and UCRArchive profile dataset. The result shows that the representation learned by the proposed model is more likely to cluster by category, especially in the residual space. Compared to the baselines and state-of-the-art models, the proposed model has higher accuracy and recall in the limitedlabeled situation, which illustrates the stability of the learned representation and its superiority in the downstream tasks.


## Link



[📄 자료 링크 ↗](https://ieeexplore.ieee.org/document/9926721)



# Paper Review


# Introduction & Related Works


### **시계열 표현 학습의 필요성**

- **응용 분야**: 시계열 데이터는 금융, 의료, 산업 프로세스 모니터링 등 다양한 분야에서 사용됨.
- **중요성**: 시계열 데이터의 효과적인 표현 학습은 이상 탐지, 예측, 분류 등의 작업에 필수적임.
- **이점**: 차원 축소, 기본 패턴 캡처, 다운스트림 작업 성능 향상에 도움을 줌.

## **기존 시계열 표현 학습 모델**

- 데이터 크기, 복잡도 등이 증가하면서 성능이 만족스럽지 못했음.

### **Feature-based 접근법**

- **기법**: Fourier Transform, Wavelet Transform.
- **특징**: 수학적 변환을 사용하여 특성을 추출하며, 도메인 지식이 필요함.

### **Distance-based 접근법**

- **기법**: Dynamic Time Warping, 1-NN, Shapelet.
- **특징**: 시계열 간의 거리를 측정하여 암묵적 평가로 사용함.

### **Dictionary-based 접근법**

- **기법**: Bag-of-Words, Bag-of-Patterns, PCA.
- **특징**: 저차원 표현을 특성으로 사용함.

### **Deep Learning-based 접근법**

- **기법**: 3D-convolution 모델, ConvLSTM, Inception-like Conv blocks in 1D-CNN.
- **특징**: 상관관계를 포착하며, 주로 비지도 학습 또는 반지도 학습에 사용됨.

## **AutoEncoder**


![](/assets/seminars/attention-based-representation-learning-for-time-series-with-principal-and-resid/0.png)


### **개요**

- **설명**: AutoEncoder는 입력 데이터를 저차원 잠재 공간에 인코딩하고 이를 디코딩하여 입력을 재구성하는 신경망으로, 입력과 출력의 차이를 최소화함으로써 표현을 학습함.
- **주요 포인트**:
    - 잠재 공간 통계와 잔여 공간 통계 모두 이상 탐지에 적용될 수 있음.
    - 잠재 공간(Latent Space)은 입력 데이터를 저차원으로 압축한 공간.
    - 잔여 공간(Residual Space)은 입력 데이터와 디코더를 통해 재구성된 데이터 간의 차이를 나타내는 공간.
    - 최근 연구에서 AutoEncoder 모델의 잔여 공간이 프로세스 모니터링에 도움이 됨이 밝혀짐.

### **Attention 메커니즘**

- **목적**: Attention 메커니즘을 사용하여 잔여 공간을 구성하고 입력 데이터의 가장 중요한 부분을 포착함.
- **응용**: 시계열 분석에서 Attention 메커니즘은 데이터 내의 다양한 측면 간의 상관관계를 모델링함.


$$
A = softmax(\frac{QK^T}{\sqrt{d_k}})V
$$



### **이 연구에서의 배경**


보통은 Decoder에 의해 얻은 Reconstruction에서 residual을 얻는데, 시계열을 reconstruction 하게 되면 잠재 벡터가 무작위로 분산되어 의미 없는 재구성이 이루어져 데이터가 왜곡될 수 있기 때문에  Reconstruction이 어려움. 그래서 일부 연구에서는 재구성 대신 예측을 위해 잠재 공간을 모델링하거나 시계열의 일부를 재구성하기도 함.


이 연구에서는 PCA에서 영감을 받아 Attention 메커니즘을 활용하여 주요 공간과 잔여 공간을 구성하고 KDE를 적용하여 이상 탐지를 수행함.

- **PCA와 AutoEncoder의 유사성**:
    1. 둘 다 가장 중요한 요소를 찾는 비지도 학습 알고리즘임.
    2. **재구성 오류의 유사성**:
        - AutoEncoder: 손실 함수에 원본과 재구성 간의 차이를 포함.
        - PCA: Residual 또는 SPE(Squared Prediction Error) 통계. PCA에서 재구성 오류를 나타내는 값. 주성분으로 설명되지 않는 데이터를 측정함.
    3. **KQ 맵 활성화**: Attention 메커니즘의 softmax 함수가 토큰 간의 상관관계를 그림, 이는 PCA의 공분산 행렬과 유사.

# Method


## 문제 정의

- **다변량 시계열**: $X=\{x^{(n)}\}$, $X=\left| N \right|$, $x^{(n)} \in \R^{M \times T}$.
    - _N_은 샘플 수, _M_은 변수 수, _T_는 시간 길이.
- **레이블** : $Y=\{y^{(n)}\}$, $y^{(n)} \in {−1,0,1,...,n_e}$.
    - $n_e$는 결함 종류 개수. $y^{(n)} = 0$은 정상 샘플,  $y^{(n)} = -1$은 레이블이 없는 샘플.

![Fig. 1. Methodology of the anomaly detection. (a) training process, (b) anomaly detection process.](/assets/seminars/attention-based-representation-learning-for-time-series-with-principal-and-resid/1.png)


## **Attention-based Encoder-Decoder 구조**

- **개요**: Attention 기반 인코더-디코더 네트워크로 시계열을 비지도 학습하여 주요 공간과 잔여 공간을 통해 이상을 탐지함.
- **프로세스**:
    1. 데이터셋을 1D-CNN 백본 네트워크로 사전 학습하고 제안된 모델에 하이퍼파라미터를 전이하여 빠른 수렴을 도모함.
    2. 표현 학습 후, 라벨링된 데이터를 사용하여 클래스별 KDE를 생성함.
    3. 이상 탐지 시, Attention 기반 인코더가 입력 데이터를 주요 공간과 잔여 공간으로 매핑함.
    4. KDE 예측기를 사용하여 각 클래스의 신뢰 점수를 계산함.
    5. 모든 클래스의 임계값보다 신뢰 점수가 낮으면 새로운 클래스로 정의함.
    6. 새로운 클래스를 반영하여 KDE 예측기를 셀프 업데이트함.

![Fig. 2. Main architecture of the proposed model.](/assets/seminars/attention-based-representation-learning-for-time-series-with-principal-and-resid/2.png)


### **주요 아키텍처**

- **설명**: 1D-CNN 백본을 사용하여 사전 학습을 진행하고, 각 인코더 블록에 하이퍼파라미터를 공유하는 두 개의 포워드 경로를 가짐. 이는 Attention 점수로 재조정된 주요 공간과 잔여 공간을 생성함.
- **재구성 손실**: 재구성 손실을 최소화하고 Attention 점수를 통해 중요한 부분을 명확하게 파악함.

    
$$
    J_a = ||x − \hat{x} || + \lambda \Sigma^{n_c}_{i=1} \Sigma_t \frac{1}{S_i(t)} \log S_i(t)
    $$
    


    Loss는 MSE + Penalty constant 형태로 구성됨.


     Penalty constant는 재구성의 정확도와 attention 점수의 sparsity 간 trade-off를 잡아줌.

- **Sparse Attention**: Attention 점수가 대부분 0에 가깝도록 유도하여 중요한 부분만 집중적으로 학습함.
- **토큰화 :** 시간방향으로 1칸씩 이동하는 rolling window 사용하여 token을 정의함.

![Fig. 3. Token definition on the feature map.](/assets/seminars/attention-based-representation-learning-for-time-series-with-principal-and-resid/3.png)

1. Rolling window 방식으로 전체 data를 여러번 나눔.
2. 경계 효과를 방지하기 위해 Zero padding 적용
3. 1차원 벡터 형태로 평탄화

다음과 같은 과정을 통해 토큰은  $1 \cdot f_{i-1} \cdot t_t$ 형태를 갖게 됨.


# Experiment


## **실험 설정**


### **실험 데이터셋**

- **데이터셋 1**: 오픈 소스 베어링 결함 데이터셋 (Case Western Reserve University, CWRU) [29]
- **데이터셋 2**: UCR Time Series Archive [30]

### **베어링 결함 데이터셋 (CWRU)**

- **목적**: 다변량 스트리밍 데이터 처리에서 제안된 모델의 효과를 검증하고, 토큰 정의 및 희소성 제약의 개선 효과를 평가.
- **구성**:
    - 정상 상태와 두 종류의 베어링 결함 (구동 끝 결함(DE)과 팬 끝 결함(FE)).
    - 다양한 모터 실험에서 수집된 데이터 (결함 생성 방법, 결함 심각도, 결함 위치, 모터 속도 등).
    - 선택한 데이터 서브셋의 세부 사항은 TABLE.I 참고

        ![TABLE I : BEARING DATA USED IN EXPERIMENT](/assets/seminars/attention-based-representation-learning-for-time-series-with-principal-and-resid/4.png)

    - **전처리**: 원본 데이터를 길이 1024의 짧은 샘플로 분할하고, 고주파 노이즈를 필터링하기 위해 FFT 사용.

    ## 결과


    ### **1) 이상 분류 실험**

    - **베어링 결함 데이터셋 결과**:

        ![Fig. 4. The proposed model on the bearing fault dataset. (a) representation learned by the backbone network     (b) representation learned by the proposed network in the principal space (c) attention map of the input layer.](/assets/seminars/attention-based-representation-learning-for-time-series-with-principal-and-resid/5.png)

        - **Fig.4-a, 4-b**: 백본과 제안된 모델이 학습한 표현이 주 공간에서 어떻게 나타나는지 보여줌. 표현의 차원이 3이므로, 3D 잠재 공간에서 점으로 나타낼 수 있음.
        - 서로 다른 카테고리의 표현은 다른 분포를 가짐. 제안된 모델의 표현이 더 명확하게 카테고리별로 클러스터링되는 것을 관찰할 수 있음.
        - **Fig.4-c**: 입력층의 키 매트릭스와 쿼리 매트릭스의 내적을 나타내는 attention 맵. attention 맵의 희소성은 입력 데이터의 일부 세그먼트/특징 맵만으로도 입력 데이터를 나타내는 데 충분함을 의미함.

        ### **2) 새로운 결함 탐지 실험**

        - **CWRU 데이터셋 결과**:

            ![Fig. 6. Verification of the anomaly detection ability. (a) OR fault (fault 2) masked, (b) IR fault (fault 1) masked.](/assets/seminars/attention-based-representation-learning-for-time-series-with-principal-and-resid/6.png)

            - OR 결함과 IR 결함의 레이블을 각각 마스킹한 두 개의 하위 실험 수행.
            - 사용 가능한 레이블 수가 변할 때, 두 결함의 전체 분류 정확도와 재현율의 변화를 Fig.6에서 보여줌.
            - 레이블 수가 적을 때, KDE는 표현의 실제 분포를 추정할 수 없음. 테스트 데이터는 알려진 두 카테고리 중 하나보다는 새로운 결함으로 분류될 가능성이 높아져 미지의 결함에 대한 높은 재현율과 정상 데이터에 대한 낮은 정확도를 초래함.
            - 레이블 수가 증가하면, KDE 함수는 알려진 카테고리의 표현 분포를 더 정확하게 설명할 수 있게 됨. 미지의 결함 재현율은 알려진 결함과 유사한 값으로 감소함.

# **UCR Time Series Archive**


    ### **UCR Time Series Archive**

    - **사용 서브셋**: Wafer와 ItalyPowerDemand.
    - **목적**: 비교 실험을 위해 사용, 두 서브셋 모두 이변량 시계열 데이터로 정상과 결함 두 카테고리로 구성됨.

        ![TABLE II : SELECTED UCR TIME SERIES ARCHIVE.](/assets/seminars/attention-based-representation-learning-for-time-series-with-principal-and-resid/7.png)

    - **구성**: 선택된 서브셋의 세부 사항은 Table.II에 표시.
    - **데이터 분할**: 70%는 훈련용, 10%는 검증용, 20%는 테스트용으로 랜덤하게 선택.
    - **실험 설정**: 훈련 시 일부 레이블만 접근 가능, 10번의 독립적인 실험의 평균 정확도와 재현율로 성능 평가.

    ### **비교 모델**

    - **종단간 모델**: MLP, FCN, Inception, ResNet (softmax 분류기를 사용).
        - 제안된 모델과의 비교를 위해 인코더와 KDE 예측기에 대한 추가 미세 조정을 수행 (End2End).
    - **최신 반지도 학습 모델**:
        - **SemiTime 모델 [31]**: 레이블이 있는 데이터로 지도 학습 네트워크를 구성하고, 레이블이 없는 데이터에 대해 유용한 표현을 학습.
        - **MultiTime 모델 [32]**: 레이블이 있는 데이터로 분류를 수행하고, 모든 훈련 데이터를 사용하여 자기 지도 학습을 통해 시계열 예측 수행.

    ### **이상 탐지 실험**

    - **설정**: 하나의 결함 레이블을 마스킹.
        - 모든 KDE 예측기의 신뢰 점수가 임계값보다 낮으면 해당 입력 데이터를 학습되지 않은 결함 데이터로 간주.
        - **비교 모델**: PCA (SPE 통계를 사용하여 상태 모니터링).

    ## 결과


    ### **1) 이상 분류 실험**

    - **UCR 데이터셋 결과**:

        ![Fig. 5. The proposed model on Wafer dataset. Distribution of the latent vectors (a) in principal space, (b) in residual space; (c) attention map example of input.](/assets/seminars/attention-based-representation-learning-for-time-series-with-principal-and-resid/8.png)

        - 잔여 공간에서의 표현 분포가 더 명확하게 클러스터링 되어 레이블 예측에 도움을 줌.
        - **벤치마크 모델들과 비교** : TABLE.III, IV
            - 잔여 공간에 KDE를 적용하여 제안된 모델과 다른 벤치마크 모델들을 비교한 결과.
            - 일부 레이블이 있는 샘플만 사용할 수 있을 때 제안된 모델이 가장 좋은 성능을 보임.

                ![](/assets/seminars/attention-based-representation-learning-for-time-series-with-principal-and-resid/9.png)


                ![](/assets/seminars/attention-based-representation-learning-for-time-series-with-principal-and-resid/10.png)

        - Wafer 데이터셋의 기본 오류율이 10.79%로, 레이블 불균형 문제가 있음.
            - 따라서 기존의 모델들은 훈련을 위한 양성 샘플 부족으로 인해 실패할 가능성이 크고 낮은 재현율로 모든 예측이 정상으로 수렴할 수 있음.
        - 레이블 데이터가 증가함에 따라 제안된 모델의 정확도와 재현율이 천천히 향상됨.
        - 기존의 모델들은 소수의 레이블 데이터만 있을 때 성능이 나쁠 수 있지만 레이블 데이터가 많을 때는 오히려 더 나은 성능을 달성할 수 있음.
        - 제안된 모델의 인코더와 예측기를 미세 조정하면 (End2End), 두 상황에서 모두 강점을 결합하여 최상의 성능을 달성할 수 있음.

    ### **2) 새로운 결함 탐지 실험**

    - **UCR 데이터셋 결과**:

        ![Fig. 7. Comparison of the anomaly detection on Wafer dataset when the number of the available labels change.   (a) classification accuracy of different models, (b) anomaly detection recall of different models.](/assets/seminars/attention-based-representation-learning-for-time-series-with-principal-and-resid/11.png)

        - 정상 레이블만 사용 가능함. KDE는 정상 데이터의 표현 분포에 대한 신뢰 점수를 예측하고, 테스트 데이터에서 분포 외 표현을 감지함.
        - Fig.7은 사용 가능한 레이블 수가 변할 때, 전체 정확도와 이상 탐지 재현율을 보여줌.
        - 제안된 모델은 소수의 훈련 레이블이 있을 때 가장 좋은 성능을 보임. 선의 기울기에 따라 PCA 모니터링과 유사한 안정성을 가짐.
        - LAKE는 소수의 레이블이 있을 때 이상 탐지에 실패함. 이는 잠재 공간에서 카테고리별로 클러스터링되지 않으면, 특히 불균형한 데이터셋에서는 소수 샘플의 레이블 변동이 어려움.
        - RM의 낮은 정확도는 시계열 재구성의 부진으로 인한 모니터링 통계의 높은 값 때문이며, 이는 분류 오류로 이어짐.

### **실험 요약**

- **베어링 데이터셋**에서는 제안된 모델이 다변량 스트리밍 데이터 처리 및 이상 탐지에서 기존 모델보다 우수한 성능을 보임.
- **UCR 데이터셋**에서도 제안된 모델이 높은 정확도와 재현율을 기록하며, 비교 모델들에 비해 더 나은 성능을 입증함.

# Conclusion


## **결론**

- **제안된 방법**: self-attention AE 네트워크 기반의 표현 학습 방법을 제안하고 이를 이상 탐지 작업에 적용.
    - 토큰에 시간 정보를 도입하고, 더 집중된 표현 학습을 위해 희소성 페널티 추가.
    - 재구성 없이 attention score에 따라 주 공간과 잔여 공간에서 표현을 얻음.
- **실험 결과**:
    - 제안된 모델을 CWRU 베어링 결함 데이터셋과 UCRArchive의 두 서브셋에서 테스트함.
    - 결과는 레이블이 제한된 상황에서도 제안된 모델이 높은 성능을 발휘하며, 이상 분류 및 결함 탐지 작업에서 베이스라인과 최신 모델들을 능가함을 보여줌.
    - 제안된 모델은 잠재 공간에서 명확한 클러스터를 가진 더 안정적인 표현을 학습함.
    - 각 개선의 효과를 비교 실험을 통해 입증함.
- **향후 연구**:
    - 충분한 레이블 시나리오에서 모델을 개선할 계획 (예: 종단간 미세 조정 도입).
    - 상태 공간 모니터링 및 이상 탐지를 위해 주 벡터와 잔여 벡터로 표현을 구성하는 통계를 구축할 예정.

# Code


코드가 없어서 직접 구현


베어링 데이터셋은 안 구해져서 UCR Dataset으로 실험


```python
import numpy as np
import torch
import pandas as pd
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
import torch.nn as nn
import torch.optim as optim

# 실험 데이터
# Load the datasets
italy_power_demand_test = pd.read_csv('ItalyPowerDemand_TEST.csv', header=None)
italy_power_demand_train = pd.read_csv('ItalyPowerDemand_TRAIN.csv', header=None)
wafer_test = pd.read_csv('wafer_TEST.csv', header=None)
wafer_train = pd.read_csv('wafer_TRAIN.csv', header=None)

# Adding the correct column headers
italy_power_demand_test.columns = ['label'] + list(range(1, italy_power_demand_test.shape[1]))
italy_power_demand_train.columns = ['label'] + list(range(1, italy_power_demand_train.shape[1]))
wafer_test.columns = ['label'] + list(range(1, wafer_test.shape[1]))
wafer_train.columns = ['label'] + list(range(1, wafer_train.shape[1]))

# Extracting X and y
wafer_train_X = wafer_train.drop(columns=['label'])
wafer_train_y = wafer_train['label']
wafer_test_X = wafer_test.drop(columns=['label'])
wafer_test_y = wafer_test['label']

italy_power_demand_train_X = italy_power_demand_train.drop(columns=['label'])
italy_power_demand_train_y = italy_power_demand_train['label']
italy_power_demand_test_X = italy_power_demand_test.drop(columns=['label'])
italy_power_demand_test_y = italy_power_demand_test['label']

# 데이터 분할 및 전처리 함수
def process_data(X_train, y_train, X_test, y_test, val_size=0.1, random_state=42):
    train = pd.concat([X_train, y_train], axis=1)
    test = pd.concat([X_test, y_test], axis=1)

    # 훈련 데이터를 다시 훈련/검증으로 분할
    X_train, X_val, y_train, y_val = train_test_split(train.drop(columns=[train.columns[-1]]), train[train.columns[-1]], test_size=val_size, random_state=random_state, stratify=y_train)

    # 레이블이 있는 데이터와 없는 데이터로 분리
    X_train_labeled = X_train[y_train != -1]
    y_train_labeled = y_train[y_train != -1]
    X_train_unlabeled = X_train[y_train == -1]

    return X_train, X_val, X_test, y_train, y_val, y_test, X_train_labeled, X_train_unlabeled, y_train_labeled

# 데이터 처리
#X_train, X_val, X_test, y_train, y_val, y_test, X_train_labeled, X_train_unlabeled, y_train_labeled = process_data(wafer_train_X, wafer_train_y, wafer_test_X, wafer_test_y)
X_train, X_val, X_test, y_train, y_val, y_test, X_train_labeled, X_train_unlabeled, y_train_labeled = process_data(italy_power_demand_train_X, italy_power_demand_train_y, italy_power_demand_test_X, italy_power_demand_test_y)

# 데이터를 (samples, variables, timesteps) 형태로 변환
def reshape_data(X):
    return X.values.reshape(-1, 1, X.shape[1])

X_train = reshape_data(X_train)
X_train_labeled = reshape_data(X_train_labeled)
X_train_unlabeled = reshape_data(X_train_unlabeled)
X_val = reshape_data(X_val)
X_test = reshape_data(X_test)

print(f"훈련 데이터 : {X_train.shape}, {y_train.shape}")
print(f"훈련 데이터 (레이블 있음): {X_train_labeled.shape}, {y_train_labeled.shape}")
print(f"훈련 데이터 (레이블 없음): {X_train_unlabeled.shape}")
print(f"검증 데이터: {X_val.shape}, {y_val.shape}")
print(f"테스트 데이터: {X_test.shape}, {y_test.shape}")
```


##  Step 2: 데이터셋 클래스 정의 및 데이터 로더 생성


```python
class TimeSeriesDataset(Dataset):
    def __init__(self, X, y=None, window_size=11):
        self.X = X
        self.y = y.reset_index(drop=True) if y is not None else None
        self.window_size = window_size

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        x = self.X[idx]
        if len(x.shape) == 1:
            x = x.reshape(1, -1)
        x = self.tokenize(x)
        if self.y is not None:
            return x, self.y.iloc[idx]
        else:
            return x
            
    def tokenize(self, x):
        num_variables = x.shape[0]
        num_timesteps = x.shape[1]
        padded_data = np.pad(x, ((0, 0), (self.window_size - 1, self.window_size - 1)), 'constant')
        windows = []
        for i in range(num_timesteps):
            window = padded_data[:, i:i + self.window_size].flatten()
            windows.append(window)
        return np.stack(windows, axis=0)

window_size = 11
# 데이터셋 생성
train_dataset = TimeSeriesDataset(X_train, y_train, window_size=window_size)
train_labeled_dataset = TimeSeriesDataset(X_train_labeled, y_train_labeled, window_size=window_size)
#train_unlabeled_dataset = TimeSeriesDataset(X_train_unlabeled, window_size=window_size)
val_dataset = TimeSeriesDataset(X_val, y_val, window_size=window_size)
test_dataset = TimeSeriesDataset(X_test, y_test, window_size=window_size)

# 데이터 로더 생성
batch_size = 32
train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
train_labeled_loader = DataLoader(train_labeled_dataset, batch_size=batch_size, shuffle=True)
#train_unlabeled_loader = DataLoader(train_unlabeled_dataset, batch_size=batch_size, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)
print(f"훈련 데이터 로더 : {len(train_loader)} 배치")
print(f"훈련 데이터 로더 (레이블 있음): {len(train_labeled_loader)} 배치")
#print(f"훈련 데이터 로더 (레이블 없음): {len(train_unlabeled_loader)} 배치")
print(f"테스트 데이터 로더: {len(test_loader)} 배치")
```


```python
훈련 데이터 : (60, 1, 24), (60,)
훈련 데이터 (레이블 있음): (60, 1, 24), (60,)
훈련 데이터 (레이블 없음): (0, 1, 24)
검증 데이터: (7, 1, 24), (7,)
테스트 데이터: (1029, 1, 24), (1029,)
훈련 데이터 로더 : 2 배치
훈련 데이터 로더 (레이블 있음): 2 배치
테스트 데이터 로더: 33 배치
```


## Step 3: Encoder-Decoder Backbone 모델 정의 및 사전 훈련



```python
class EncoderDecoder(nn.Module):
    def __init__(self, input_dim, latent_dim):
        super(EncoderDecoder, self).__init__()
        self.encoder = nn.Sequential(
            nn.Conv1d(1, 64, kernel_size=3, padding=1),  # 입력 채널 수를 1로 설정
            nn.ReLU(),
            nn.Conv1d(64, latent_dim, kernel_size=3, padding=1),
            nn.ReLU()
        )
        self.decoder = nn.Sequential(
            nn.ConvTranspose1d(latent_dim, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.ConvTranspose1d(64, 1, kernel_size=3, padding=1),  # 출력 채널 수를 1로 설정
            nn.Sigmoid()
        )

    def forward(self, x):
        batch_size, seq_len, flat_dim = x.size()
        x = x.view(batch_size, 1, flat_dim * seq_len)
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        decoded = decoded.view(batch_size, seq_len, -1)
        return decoded, encoded.view(batch_size, seq_len, -1)

# 모델 초기화
input_dim = window_size = 10  # window size
latent_dim = 32
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = EncoderDecoder(input_dim, latent_dim).to(device)

criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# 사전 훈련
n_epochs = 20

for epoch in range(n_epochs):
    model.train()
    running_loss = 0.0
    for inputs, _ in train_loader:
        inputs = inputs.to(device).float()
        optimizer.zero_grad()
        outputs, _ = model(inputs)
        loss = criterion(outputs, inputs)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()
    print(f'Epoch [{epoch+1}/{n_epochs}], Loss: {running_loss/len(train_loader):.4f}')

pretrain_params = model.state_dict()
print("사전 훈련 완료")
```


```python
Epoch [1/20], Loss: 1.0678
Epoch [2/20], Loss: 0.8917
Epoch [3/20], Loss: 0.7534
Epoch [4/20], Loss: 0.6555
Epoch [5/20], Loss: 0.6013
Epoch [6/20], Loss: 0.5731
Epoch [7/20], Loss: 0.5615
Epoch [8/20], Loss: 0.5588
Epoch [9/20], Loss: 0.5537
Epoch [10/20], Loss: 0.5484
Epoch [11/20], Loss: 0.5453
Epoch [12/20], Loss: 0.5439
Epoch [13/20], Loss: 0.5407
Epoch [14/20], Loss: 0.5386
Epoch [15/20], Loss: 0.5372
Epoch [16/20], Loss: 0.5370
Epoch [17/20], Loss: 0.5367
Epoch [18/20], Loss: 0.5359
Epoch [19/20], Loss: 0.5354
Epoch [20/20], Loss: 0.5355
사전 훈련 완료
```


## Step 4: Self-Attention을 포함한 Encoder-Decoder 모델 정의 및 학습



```python
## Step 4: Self-Attention을 포함한 Encoder-Decoder 모델 정의 및 학습


class SelfAttentionBlock(nn.Module):
    def __init__(self, latent_dim, num_heads, debug=False):
        super(SelfAttentionBlock, self).__init__()
        self.attention = nn.MultiheadAttention(latent_dim, num_heads)
        self.debug = debug

    def forward(self, x):
        if self.debug:
            print(f"SelfAttentionBlock input shape: {x.shape}")
        attn_output, attn_weights = self.attention(x, x, x)
        if self.debug:
            print(f"SelfAttentionBlock output shape: {attn_output.shape}")
            print(f"SelfAttentionBlock weights shape: {attn_weights.shape}")
        return attn_output, attn_weights

## 기본 Attention (비교용)
class AttentionEncoderDecoder(nn.Module):
    def __init__(self, input_dim, latent_dim, num_heads=4, debug=False):
        super(AttentionEncoderDecoder, self).__init__()
        self.encoder = nn.Sequential(
            nn.Conv1d(input_dim, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv1d(64, latent_dim, kernel_size=3, padding=1),
            nn.ReLU()
        )
        self.attention = SelfAttentionBlock(latent_dim, num_heads, debug)
        self.decoder = nn.Sequential(
            nn.ConvTranspose1d(latent_dim, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.ConvTranspose1d(64, input_dim, kernel_size=3, padding=1),
            nn.Sigmoid()
        )
        self.debug = debug

    def forward(self, x):
        if self.debug:
            print(f"Input shape: {x.shape}")

        batch_size, var_len, seq_len = x.size()  # (batch_size, variables, timesteps)
        
        if self.debug:
            print(f"Reshaped input shape: {x.shape}")

        encoded = self.encoder(x)
        if self.debug:
            print(f"Encoded shape: {encoded.shape}")

        # Reshape for attention: (seq_len, batch_size, latent_dim)
        encoded = encoded.permute(2, 0, 1)  # (seq_len, batch_size, latent_dim)
        attn_output, attn_weights = self.attention(encoded)
        attn_output = attn_output.permute(1, 2, 0)  # (batch_size, latent_dim, seq_len)
        if self.debug:
            print(f"Attention output shape: {attn_output.shape}")

        decoded = self.decoder(attn_output)
        if self.debug:
            print(f"Decoded shape: {decoded.shape}")

        return decoded, attn_output

def sparse_attention_loss(x, principal, residual, attention, lambda_):
    # Reconstruction loss between input x and the sum of principal and residual components
    reconstruction_loss = nn.MSELoss()(x, principal + residual)
    
    # Sparsity loss to encourage attention scores to be close to 0 or 1
    attention = torch.clamp(attention, min=1e-8, max=1.0)  # to prevent log(0) and ensure stability
    sparsity_loss = torch.sum(attention * torch.log(attention))
    
    # Total loss is a combination of reconstruction loss and sparsity loss
    total_loss = reconstruction_loss + lambda_ * sparsity_loss
    return total_loss

class SparseAttentionEncoderDecoder(nn.Module):
    def __init__(self, input_dim, latent_dim, embed_dim, num_heads, debug=False):
        super(SparseAttentionEncoderDecoder, self).__init__()
        self.encoder_conv1 = nn.Conv1d(input_dim, 64, kernel_size=3, padding=1)
        self.encoder_conv2 = nn.Conv1d(64, latent_dim, kernel_size=3, padding=1)
        self.encoder_relu = nn.ReLU()
        self.encoder_attention = SelfAttentionBlock(latent_dim, num_heads, debug)
        self.decoder = nn.Sequential(
            nn.ConvTranspose1d(latent_dim, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.ConvTranspose1d(64, input_dim, kernel_size=3, padding=1),
            nn.Sigmoid()
        )
        self.debug = debug

    def forward(self, x):
        if self.debug:
            print(f"Input shape: {x.shape}")

        batch_size, var_len, seq_len = x.size()  # (batch_size, variables, timesteps)
        if self.debug:
            print(f"Reshaped input shape: {x.shape}")

        # Encoder
        x = self.encoder_relu(self.encoder_conv1(x))
        if self.debug:
            print(f"After first conv shape: {x.shape}")
        x = self.encoder_relu(self.encoder_conv2(x))
        if self.debug:
            print(f"After second conv shape: {x.shape}")

        # Reshape for attention: (seq_len, batch_size, latent_dim)
        x = x.permute(2, 0, 1)  # (seq_len, batch_size, latent_dim)
        if self.debug:
            print(f"Reshaped for attention shape: {x.shape}")

        # Attention
        attn_output, attn_weights = self.encoder_attention(x)
        attn_output = attn_output.permute(1, 2, 0)  # (batch_size, latent_dim, seq_len)
        if self.debug:
            print(f"Attention output shape: {attn_output.shape}")

        # Calculate the attention score
        attn_score = torch.mean(attn_weights, dim=-1, keepdim=True)  # (batch_size, seq_len, 1)
        attn_score = attn_score.permute(0, 2, 1)  # (batch_size, 1, seq_len)
        attn_score = attn_score.expand(-1, attn_output.size(1), -1)  # (batch_size, latent_dim, seq_len)
        if self.debug:
            print(f"Attention score shape: {attn_score.shape}")

        # Align shapes for multiplication
        attn_output = attn_output.permute(0, 2, 1)  # (batch_size, seq_len, latent_dim)
        attn_score = attn_score.permute(0, 2, 1)  # (batch_size, seq_len, latent_dim)

        principal_input = attn_score * attn_output
        residual_input = (1 - attn_score) * attn_output

        if self.debug:
            print(f"Principal input shape: {principal_input.shape}")
            print(f"Residual input shape: {residual_input.shape}")

        principal_decoded = self.decoder(principal_input.permute(0, 2, 1))
        residual_decoded = self.decoder(residual_input.permute(0, 2, 1))
        if self.debug:
            print(f"Principal decoded shape: {principal_decoded.shape}")
            print(f"Residual decoded shape: {residual_decoded.shape}")

        principal_decoded = principal_decoded.permute(0, 2, 1)  # (batch_size, input_dim, seq_len)
        residual_decoded = residual_decoded.permute(0, 2, 1)  # (batch_size, input_dim, seq_len)

        return principal_decoded, residual_decoded, attn_weights


def train_model(sparse=False):
    input_dim = X_train.shape[2]  # 입력 채널 수
    latent_dim = 32
    window_size = 11
    embed_dim = latent_dim * window_size
    num_heads = 4
    lambda_ = 0.0007  # Lambda 값 수정
    debug = False  # 디버그 모드 활성화


    if sparse:
        model = SparseAttentionEncoderDecoder(input_dim, latent_dim, embed_dim, num_heads, debug).to(device)
    else:
        model = AttentionEncoderDecoder(input_dim, latent_dim, num_heads, debug).to(device)

    # 사전 훈련된 파라미터를 로드
    pretrain_dict = pretrain_params
    model_dict = model.state_dict()

    # 필요한 키만 업데이트 (일치하는 파라미터만 업데이트)
    pretrain_dict = {k: v for k, v in pretrain_dict.items() if k in model_dict and model_dict[k].shape == v.shape}
    model_dict.update(pretrain_dict)

    model.load_state_dict(model_dict)

    # 손실 함수 및 최적화 기법 설정
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    criterion = nn.MSELoss()

    # Labeled 데이터로 학습
    n_epochs = 20

    for epoch in range(n_epochs):
        model.train()
        running_loss = 0.0
        for data, labels in train_labeled_loader:
            inputs, labels = data.to(device).float(), labels.to(device).float()
            if debug:
                print(f"Batch input shape: {inputs.shape}")
            optimizer.zero_grad()
            if sparse:
                principal_decoded, residual_decoded, attn_weights = model(inputs)
                if debug:
                    print(f"Principal decoded shape: {principal_decoded.shape}")
                    print(f"Residual decoded shape: {residual_decoded.shape}")
                    print(f"Attention weights shape: {attn_weights.shape}")
                # Ensure target and input sizes match
                loss = sparse_attention_loss(inputs.permute(0, 2, 1), principal_decoded, residual_decoded, attn_weights, lambda_)
            else:
                outputs, encoded = model(inputs)
                if debug:
                    print(f"Model output shape: {outputs.shape}")
                loss = criterion(outputs, inputs)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
        print(f'Epoch [{epoch+1}/{n_epochs}], Loss: {running_loss/len(train_labeled_loader):.4f}')

    print("레이블 데이터로 학습 완료")
    return model  # 학습된 모델 반환

# 학습 실행
att_model = train_model(sparse=True)

#att_model = train_model(sparse=False)
```


```python
Epoch [1/20], Loss: 1.4482
Epoch [2/20], Loss: 1.4288
Epoch [3/20], Loss: 1.4072
Epoch [4/20], Loss: 1.3738
Epoch [5/20], Loss: 1.3179
Epoch [6/20], Loss: 1.2261
Epoch [7/20], Loss: 1.0909
Epoch [8/20], Loss: 0.9133
Epoch [9/20], Loss: 0.7290
Epoch [10/20], Loss: 0.5865
Epoch [11/20], Loss: 0.4938
Epoch [12/20], Loss: 0.4285
Epoch [13/20], Loss: 0.3740
Epoch [14/20], Loss: 0.3307
Epoch [15/20], Loss: 0.2958
Epoch [16/20], Loss: 0.2735
Epoch [17/20], Loss: 0.2637
Epoch [18/20], Loss: 0.2541
Epoch [19/20], Loss: 0.2397
Epoch [20/20], Loss: 0.2293
레이블 데이터로 학습 완료
```


## Step 5: KDE를 이용한 분포 학습


```python
import numpy as np
import torch
from sklearn.neighbors import KernelDensity
from sklearn.metrics import accuracy_score, recall_score

# 시계열 데이터의 분포를 KDE를 사용하여 평가
def evaluate_kde(kde_models, data):
    scores = {}
    for label, kde in kde_models.items():
        scores[label] = kde.score_samples(data)  
    return scores

# 테스트 데이터에 대한 라벨 예측 수행
def predict(loader, model, kde_models, sparse):
    model.eval()
    all_predictions = []
    all_labels = []
    with torch.no_grad():
        for inputs, labels in loader:
            inputs = inputs.to(device).float()
            labels = labels.to(device)
            if sparse:
                principal_output, residual_output, _ = model(inputs)
                combined_output = torch.cat((principal_output, residual_output), dim=-1)
            else:
                outputs, _ = model(inputs)
                combined_output = outputs.mean(dim=1)
            combined_output = combined_output.cpu().numpy()  # 시퀀스 차원에서 평균 계산
            combined_output = combined_output.reshape(-1, kde_models[list(kde_models.keys())[0]].n_features_in_)  # 2D 배열로 변환

            scores = evaluate_kde(kde_models, combined_output)
            predictions = []
            for i in range(combined_output.shape[0]):
                label_scores = {label: score[i] for label, score in scores.items()}
                predicted_label = max(label_scores, key=label_scores.get)
                predictions.append(predicted_label)

            all_predictions.extend(predictions)
            all_labels.extend(labels.cpu().numpy())

    return np.array(all_predictions), np.array(all_labels)

# Latent vector 추출
def get_latent_vectors(loader, model, sparse):
    model.eval()
    latent_vectors = []
    labels = []
    with torch.no_grad():
        for inputs, label in loader:
            inputs = inputs.to(device).float()
            if sparse:
                principal_output, residual_output, _ = model(inputs)
                combined_output = torch.cat((principal_output, residual_output), dim=-1)
            else:
                outputs, _ = model(inputs)
                combined_output = outputs.mean(dim=1)
            latent_vectors.append(combined_output.cpu().numpy())
            labels.append(label.cpu().numpy())
    return np.concatenate(latent_vectors, axis=0), np.concatenate(labels, axis=0)
    
# 학습 실행
sparse = False
att_model = train_model(sparse=sparse)

# Labeled data의 latent vectors
latent_vectors, latent_labels = get_latent_vectors(train_labeled_loader, att_model, sparse)

# KDE 모델 생성 및 학습
kde_models = {}
for label in np.unique(latent_labels):
    label_vectors = latent_vectors[latent_labels == label]
    kde = KernelDensity(kernel='gaussian', bandwidth=1.0).fit(label_vectors)
    kde_models[label] = kde

print("KDE 모델 생성 및 학습 완료")

# 테스트 데이터로 평가
predictions, true_labels = predict(test_loader, att_model, kde_models, sparse)

print(f"Predictions: {predictions}")
print(f"True labels: {true_labels}")

# Accuracy 및 Recall 계산
accuracy = accuracy_score(true_labels, predictions)
recall = recall_score(true_labels, predictions, average='macro')

print(f"Accuracy: {accuracy}")
print(f"Recall: {recall}")

predictions.mean()
np.unique(predictions, return_counts=True)
```

<details>
<summary>epoch200</summary>

```python
Sparse True

Epoch [1/200], Loss: 1.4234
Epoch [2/200], Loss: 1.4000
Epoch [3/200], Loss: 1.3651
Epoch [4/200], Loss: 1.3119
Epoch [5/200], Loss: 1.2257
Epoch [6/200], Loss: 1.0966
Epoch [7/200], Loss: 0.9222
Epoch [8/200], Loss: 0.7365
Epoch [9/200], Loss: 0.5898
Epoch [10/200], Loss: 0.4921
Epoch [11/200], Loss: 0.4209
Epoch [12/200], Loss: 0.3633
Epoch [13/200], Loss: 0.3192
Epoch [14/200], Loss: 0.2864
Epoch [15/200], Loss: 0.2612
Epoch [16/200], Loss: 0.2454
Epoch [17/200], Loss: 0.2364
Epoch [18/200], Loss: 0.2347
Epoch [19/200], Loss: 0.2246
Epoch [20/200], Loss: 0.2159
Epoch [21/200], Loss: 0.2103
Epoch [22/200], Loss: 0.2082
Epoch [23/200], Loss: 0.2037
Epoch [24/200], Loss: 0.1971
Epoch [25/200], Loss: 0.1952
...
Predictions: [2 2 2 ... 2 2 2]
True labels: [2 2 2 ... 2 2 2]
Accuracy: 0.9455782312925171
Recall: 0.9455607688471825

predictions.mean : 1.5072886297376094
predictions counts : (array([1, 2]), array([507, 522]))
true labels.mean : 1.501457725947522
true labels counts : (array([1, 2]), array([513, 516]))
```


```python
Sparse False

Epoch [1/200], Loss: 1.1742
Epoch [2/200], Loss: 1.1597
Epoch [3/200], Loss: 1.1465
Epoch [4/200], Loss: 1.1283
Epoch [5/200], Loss: 1.0982
Epoch [6/200], Loss: 1.0498
Epoch [7/200], Loss: 0.9797
Epoch [8/200], Loss: 0.8962
Epoch [9/200], Loss: 0.8160
Epoch [10/200], Loss: 0.7638
Epoch [11/200], Loss: 0.7407
Epoch [12/200], Loss: 0.7302
Epoch [13/200], Loss: 0.7201
Epoch [14/200], Loss: 0.7213
Epoch [15/200], Loss: 0.7193
Epoch [16/200], Loss: 0.7122
Epoch [17/200], Loss: 0.7137
Epoch [18/200], Loss: 0.7112
Epoch [19/200], Loss: 0.7071
Epoch [20/200], Loss: 0.7061
Epoch [21/200], Loss: 0.7060
Epoch [22/200], Loss: 0.7033
Epoch [23/200], Loss: 0.7011
Epoch [24/200], Loss: 0.7013
Epoch [25/200], Loss: 0.6993
...
Predictions: [1 1 1 ... 1 2 1]
True labels: [2 2 2 ... 2 2 2]
Accuracy: 0.6005830903790087
Recall: 0.6017328528038443

predictions.mean : 1.1059280855199223
predictions counts : (array([1, 2]), array([920, 109]))
true labels.mean : 1.501457725947522
true labels counts : (array([1, 2]), array([513, 516]))
```


</details>

<details>
<summary>epoch20</summary>

```python
Sparse False (General Attention) epoch 20

Epoch [1/20], Loss: 1.1725
Epoch [2/20], Loss: 1.1456
Epoch [3/20], Loss: 1.1046
Epoch [4/20], Loss: 1.0395
Epoch [5/20], Loss: 0.9491
Epoch [6/20], Loss: 0.8541
Epoch [7/20], Loss: 0.7851
Epoch [8/20], Loss: 0.7518
Epoch [9/20], Loss: 0.7357
Epoch [10/20], Loss: 0.7281
Epoch [11/20], Loss: 0.7261
Epoch [12/20], Loss: 0.7253
Epoch [13/20], Loss: 0.7232
Epoch [14/20], Loss: 0.7232
Epoch [15/20], Loss: 0.7215
Epoch [16/20], Loss: 0.7208
Epoch [17/20], Loss: 0.7202
Epoch [18/20], Loss: 0.7202
Epoch [19/20], Loss: 0.7174
Epoch [20/20], Loss: 0.7184
레이블 데이터로 학습 완료
KDE 모델 생성 및 학습 완료
Predictions: [1 1 1 ... 1 2 1]
True labels: [2 2 2 ... 2 2 2]
Accuracy: 0.5383867832847424
Recall: 0.5397173489278753
```


```python
Sparse True epoch 20

Epoch [1/20], Loss: 1.4045
Epoch [2/20], Loss: 1.3858
Epoch [3/20], Loss: 1.3603
Epoch [4/20], Loss: 1.3170
Epoch [5/20], Loss: 1.2468
Epoch [6/20], Loss: 1.1372
Epoch [7/20], Loss: 0.9796
Epoch [8/20], Loss: 0.7935
Epoch [9/20], Loss: 0.6275
Epoch [10/20], Loss: 0.5092
Epoch [11/20], Loss: 0.4265
Epoch [12/20], Loss: 0.3619
Epoch [13/20], Loss: 0.3107
Epoch [14/20], Loss: 0.2758
Epoch [15/20], Loss: 0.2537
Epoch [16/20], Loss: 0.2430
Epoch [17/20], Loss: 0.2318
Epoch [18/20], Loss: 0.2221
Epoch [19/20], Loss: 0.2138
Epoch [20/20], Loss: 0.2128
레이블 데이터로 학습 완료
KDE 모델 생성 및 학습 완료
Predictions: [2 1 1 ... 1 2 1]
True labels: [2 2 2 ... 2 2 2]
Accuracy: 0.5578231292517006
Recall: 0.5590915272677819
```


</details>


시행착오 포함한 결과 공유

- Data 전처리, 샘플링 등 크게 신경쓰지 않았고 에포크, 튜닝 등 많이 하지 않았는데 논문에 나와있는 성능과 거의 유사한 성능 뽑기 성공
- Sparse attention 적용했을 때 일반 attention으로 한 것 보다 좋은 성능을 확인할 수 있었음.
- Epoch가 적을 때는 sparse 여부에 따라서 성능 차이가 크지 않았는데 epoch 키우니까 성능 차이가 확연히 났음.
- sparse attention 계수 lambda = 0.0007 로 사용.
    - 0.001이상만 되어도 loss가 아주아주 작은 음수가 되어버림
- window size = 11 (논문 참고함)
- learning rate = 0.001

# **부록 : 성능 비교**


### **토큰 개선**


![Fig. 8. Verification of the token improvement. (a)-(c) and (d)-(f) are the attention map example of the input layer and latent vectors in the principal spaces where the width of the rolling window on the feature maps for the token improvement are tt = 7, 5, 1 respectively.](/assets/seminars/attention-based-representation-learning-for-time-series-with-principal-and-resid/12.png)

- **개선 방법**: 각 convolution layer에 self-attention을 적용하고, 토큰에 시간 정보를 도입.
- **효과 검증**: 롤링 윈도우의 너비 _t_t_를 7, 5, 1로 감소시켜 실험.
    - 너비가 1일 때, attention 메커니즘은 전통적인 self-attention으로 변환됨.
    - **결과**: Fig.8의 attention map과 주 공간에서의 표현을 통해, 토큰에 포함된 시간 정보가 적을수록 윈도우의 너비가 감소하며 attention map이 덜 명확해지고, 표현이 블렌딩되어 KDE로 구별하기 어려워짐.
    - **성능**:
        - 너비 7: 정확도/재현율 = 82.0%/87.1%
        - 너비 5: 정확도/재현율 = 74.0%/74.2%
        - 너비 1: 정확도/재현율 = 76.7%/84.5%
        - 제안된 모델의 _t_t_=11에서의 성능: 정확도/재현율 = 85.5%/91.5% ($t_t = 11$)

### **희소성 제약**


![Fig. 9. Verification of the sparsity constraint. (a), (b) are the latent vectors and attention map example of the proposed model when the sparsity constraint tern if the loss function is omitted during the optimization.](/assets/seminars/attention-based-representation-learning-for-time-series-with-principal-and-resid/13.png)

- **개선 방법**: 최적화 목표에 희소성 제약 항을 도입하여 attention 메커니즘이 시계열의 일부 세그먼트에 집중하도록 함.
- **효과 검증**: 희소성 제약 항을 제거한 제안된 모델의 결과는 Fig.9에 표시.
    - **비교**: Fig.4-b, 4-c와 비교하여 제약 없이 최적화하면 attention map이 덜 명확해지고, 카테고리별 클러스터링이 덜 명확해짐.
    - **성능**: 레이블 20% 사용 시, 정확도/재현율 = 72.7%/76.4%로 제안된 모델보다 낮음.
