---
date: 2024-01-12
title: Moderate Coreset: A Universal Method of Data Selection for Real-world Data-efficient Deep Learning (ICLR 2023)
category: Paper Review
presenter: Jae Hun Cho
url: https://www.notion.so/b405aaa3164f45108e644c490e701696
keywords: Coreset selection, Dataset pruning, DeepLearning
---

# Selected Paper


## **Moderate Coreset: A Universal Method of Data Selection for Real-world Data-efficient Deep Learning**


ICLR 2023


## Abstract


Deep learning methods nowadays rely on massive data, resulting in substantial costs of data storage and model training. Data selection is a useful tool to alleviate such costs, where a coreset of massive data is extracted to practically perform on par with full data. Based on carefully-designed score criteria, existing methods first count the score of each data point and then select the data points whose scores lie in a certain range to construct a coreset. These methods work well in their respective preconceived scenarios but are not robust to the change of scenarios, since the optimal range of scores varies as the scenario changes. The issue limits the application of these methods, because realistic scenarios often mismatch preconceived ones, and it is inconvenient or unfeasible to tune the criteria and methods accordingly. In this paper, to address the issue, a concept of the moderate coreset is discussed. Specifically, given any score criterion of data selection, different scenarios prefer data points with scores in different intervals. As the score median is a proxy of the score distribution in statistics, the data points with scores close to the score median can be seen as a proxy of full data and generalize different scenarios, which are used to construct the moderate coreset. As a proof-of-concept, a universal method that inherits the moderate coreset and uses the distance of a data point to its class center as the score criterion, is proposed to meet complex realistic scenarios. Extensive experiments confirm the advance of our method over prior state-of-the-art methods, leading to a strong baseline for future research. The implementation is available at [https://github.com/tmllab/Moderate-DS](https://github.com/tmllab/Moderate-DS).


### Summary

- 일부 data (coreset)만으로 전체 데이터를 학습했을 때와 비교하여 동등한 performance를 가지도록 하는 것이 목적
- 기존 방법 : 각 data의 score를 계산하여 일정 범위에 있는 data를 선택하여 coreset 구성
    - Scenario에 따라 최적의 score 범위가 다르기 때문에 scenario 변경 시 성능 떨어짐
    - 기존의 score 정의 및 방법의 변경이 불가능
- (Proposed) moderate coreset 도입
    - Score median에 가까운 score를 가진 data들로 coreset를 구성
    - 실제 상황처럼 다양한 시나리오에 관련된 실험들을 통해 기존 방법들보다 우수함을 입증

## Link



[📄 자료 링크 ↗](https://openreview.net/forum?id=7D5EECbOaf9)



# Paper Review


## Introduction


**Large-scale datasets**

- 수 백만 개의 데이터들이 포함
- SOTA DL method를 달성하기 위해 **Large-scale dataset**에 의존하고 있음
- **Data의 용량 및 computation costs**를 스타트업이나 비영리 단체에서 진행하기 어려움
    - ImageNet-22k, BDD100K datasets : 1TB, 1.8TB
    - PaLM : 대규모 언어 모델로 1920 year이 걸림 (3072 TPU v4 chips)

![ImageNet-22k](/assets/seminars/moderate-coreset-a-universal-method-of-data-selection-for-real-world-data-effici/0.png)


![BDD100K datasets](/assets/seminars/moderate-coreset-a-universal-method-of-data-selection-for-real-world-data-effici/1.png)


**Data selection**


![](/assets/seminars/moderate-coreset-a-universal-method-of-data-selection-for-real-world-data-effici/2.png)

- 대규모 데이터를 다루면서 cost 문제를 완화하기 위해 시작
- 가장 필수적인 data point들을 찾고 coreset 를 구축
- 목적 : Coreset만으로 전체 데이터를 사용했을 때와 비교하여 동등한 performance를 발휘하는 것
- 기존 SOTA 방법의 문제점
    - 실제 상황에서 시간이 지남에 따라 scenario가 자주 변경됨
    - 변화가 미미하더라도 상황이나 요구의 변화에 robust하지 않음

**Proposed method**

- A new concept about data selection : **moderate coreset**
    - Prior knowledge과 adjustments 없이 realistic tasks에서 사용 가능한 방법
    - Scenarios들 각각 다른 범위의 score에 있는 data point들을 필요
        - Distribution을 median 값로 표현 가능
    - Score median와 비슷한 distance를 가지는 data point는 전체 dataset의 proxy으로 볼 수 있음

**Contributions**

- Different from prior works targeting preconceived scenarios, we focus on data selection in the real world, where encountered scenarios always mismatch preconceived ones. **The concept of the moderate coreset is proposed to generalize different tasks without any task-specific prior knowledge and fine-tuning.**
- As a proof-of-concept, we propose a universal method operating on **deep representations** of data points for data selection in various realistic scenarios. The method successfully combines the advantages of **simplicity and effectiveness**.
- **Comprehensive experiments** for the comparison of our method with state-of-the-arts are provided. Results demonstrate that our method is leading in multiple realistic cases, **achieving lower time cost in data selection and better performance on follow-up tasks**. This creates a strong baseline of data selection for future research.
- 사전 지식과 적응 없이 다양한 시나리오 즉  real world을 고려한 coreset selection 가능
- 다른 SOTA에 비해 간단하고 효율적임
- 다양한 실험들을 통해 다른 SOTA 방법들에 비해 time cost가 더 작고 성능도 더 높음

## Background


### Data Selection Recap


Data-effecient deep learning

- Data selection

    ![](/assets/seminars/moderate-coreset-a-universal-method-of-data-selection-for-real-world-data-effici/3.png)

- Data distillation & Data condensation

    ![](/assets/seminars/moderate-coreset-a-universal-method-of-data-selection-for-real-world-data-effici/4.png)

    - 실제 large scale dataset에서 데이터 일부를 선택하는 대신 small, informative dataset을 생성
    - 작은 양의 데이터 수만 생성 가능
    - 안전하지 않음

Score criterial in data selection

- existing methods
    - 특정 scenario의 사전 지식을 활용하여 score criterion 설계
    - 특정 range의 data point로 coreset 구성
- "Random" means that we randomly select partial data from full data.
- "Herding" selects data points that are closer to class centers.
- "Forgetting" selects data points that are easy to be forgotten during optimization.
- "GraNd-score" includes data points with larger loss gradient norms.
- "EL2N-score" focuses on data points with larger norms of the error vector that is the predicted class probabilities minus one-hot label encoding.
- "Optimization-based" employs the influence function and picks data points that yields strictly constrained generalization gap.
- "Self-sup.-selection" selects data points on the difficulty of each data point by the distance to its nearest cluster centroid, after self-supervised pre-training and clustering. To avoid the tuning of the cluster number, we set it to the class number. Data points with larger distances are selected here.

Forgetting, GraNd-score, and EL2N-score

- Retrain model 필요

Optimization-based

- heavy computational costs
    - influence function과 data selection process의 반복

Self-sup.-selection

- self-supervised pre-training과 clustering 모두 시간이 많이 걸리는 문제 발생

Herding and proposed method

- distance 계산 및 sort operation만 필요하여 시간이 적게 걸림

### Instability of Prior Works to Changed Scenarios

- 이전 SOTA 방법들은 각각의 scenario에서 좋은 performanece를 보여줌
- 하지만 다양한 scenario들에서 robust한 성능을 보여주지 않는 문제가 발생

**Distribution shift scenarios**

- 이상적인 데이터를 대상 : outlier가 학습에 더 기여하도록 식별되어 선택
- outlier가 포함된 데이터 대상 : model robutness를 위해 decision boundary에서 멀리 떨어진 data들을 선택
- 하지만 decision boundary에 가까운 오염되지 않은 data들이 decision boundary에 가까운  오염된 data들을 정확하게 식별할 수 없는 모델 성능에 더 중요
    - decision boundary에서 멀리 떨어진 data들만 training에 사용하면 성능이 저하되는 covariates-shift problem 문제 발생 가능

**Changing demands of corest sizes**

- scenario마다 coreset size의 요구 사항이 다름
- coreset size가 상대적으로 큰 size를 갖도록 허용하면 generalization이 잘됨
- 하지만 작은 size를 요구하면 performance가 떨어질 수 있음
- 즉, Data selection method는 coreset size에 불안정

**Varied competence on deep models**

- data selection을 위해서 model architecture에 aceess하고 retraining에 의존
- 일부 시나리오에서는 이러한 방법에 대한 요구 사항을 충족됨
    - 그러나 비밀 보장 문제로 인해 요구 사항이 충족되지 않을 수 있음
- 현실에서는 scenario가 계속 변경됨에 따라 unstable issue를 가지는 기존 method의 적용 제한
- **변화에 따라 method를 수정하는 것 또한 cost가 많이 들고 불가능하기 때문에 이를 해결할 필요성이 있음**

## Methodology


### Preliminaries


In the sequel, vectors, matrices, and tuples are denoted by bold-faced letters. We use $\|\cdot\|_p$ as the $\ell_p$ norm of vectors or matrices. Let $[n]=\{1, \ldots, n\}$. Let $\mathbb{I}[\mathcal{B}]$ be the indicator of the event $\mathcal{B}$.
We define the problem of data selection in data-efficient deep learning. Formally, we are given a large-scale dataset $\mathcal{S}=\left\{\mathbf{s}_1, \ldots, \mathbf{s}_n\right\}$ with a sample size $n$, where $\mathbf{s}_i=\left(\mathbf{x}_i, y_i\right), \mathbf{x}_i \in \mathbb{R}^d$, and $y_i \in[k]$. The aim of data selection here is to find a subset of $\mathcal{S}$ for follow-up tasks, which reduces both storage and training consumption. The subset is called the coreset that is expected to practically perform on par with full data $\mathcal{S}$. We denote the coreset as $\mathcal{S}^*=\left\{\hat{\mathbf{s}}_1, \ldots, \hat{\mathbf{s}}_m\right\}$ with a sample size $m$ and $\mathcal{S}^{\star} \subset \mathcal{S}$. The data selection ratio in building the coreset is then $m / n$.


### Procedure Description


**Represenation extraction**


Given a well-trained deep model denoted by $f(\cdot)=g(h(\cdot))$, where $h(\cdot)$ denotes the part of the model mapping input data to hidden representations at the penultimate layer, and $g(\cdot)$ is the part mapping such hidden representations to the output $f(\cdot)$ for classification. Namely, for a data point $\mathbf{s}=(\mathbf{x}, y)$, its hidden representation is $h(\mathbf{x})$. Therefore, with the trained deep model $f(\cdot)$ and full training data $\mathcal{S}=\left\{\mathbf{s}_1, \ldots, \mathbf{s}_n\right\}$, the hidden representations of all data points are acquired as $\left\{\mathbf{z}_1=h\left(\mathbf{x}_1\right), \ldots, \mathbf{z}_n=h\left(\mathbf{x}_n\right)\right\}$_. At the representational level,_ _**the class center**_ _of each class is_



$$
\left\{\mathbf{z}^j=\frac{\sum_{i=1}^n \mathbb{I}\left[y_i=j\right] \mathbf{z}_i}{\sum_{i=1}^n \mathbb{I}\left[y_i=j\right]}\right\}_{j=1}^k,
$$




where the mean of the representations from one class is calculated as the mean of every single dimension in the representations.

- CNN의 feature extracotr에서 구할 수 있는 hidden representations들을 바탕으로 각 class에 해당하는 평균

**Distance-based score for data selection**


With hidden representations $\left\{\mathbf{z}_1, \ldots, \mathbf{z}_n\right\}$ and representational class centers $\left\{\mathbf{z}^1, \ldots, \mathbf{z}^k\right\}$, the Euclidean distance from each representation to the corresponding class center can be simply calculated with $d(\mathbf{s})=\left\|\mathbf{z}-\mathbf{z}^j\right\|_2$. The set consisting of the distances is $\left\{d\left(\mathbf{s}_1\right), \ldots, d\left(\mathbf{s}_n\right)\right\}$ with the median as $\mathcal{M}(d(\mathbf{s}))$. All data points are then sorted with an ascending order based on the distance set, which are denoted by $\left\{d\left(\tilde{\mathbf{s}}_1\right), \ldots, d\left(\tilde{\mathbf{s}}_n\right)\right\}$_. Afterwards, the data points with distances close to the distance median_ $\mathcal{M}(d(\mathbf{s}))$ _are selected as the coreset_ $\mathcal{S}^*$_, i.e.,_


![](/assets/seminars/moderate-coreset-a-universal-method-of-data-selection-for-real-world-data-effici/5.png)


_where_ $a=(n-m) / 2$ _relates to the data selection ratio. The set_ $\left\{\tilde{\mathbf{s}}_{a+1}, \ldots, \tilde{\mathbf{s}}_{n-a}\right\}$ is regarded as the coreset $\mathcal{S}^* \subset \mathcal{S}$ for follow-up tasks.

- 기존 methods에 비해 간단하고 model architecture access하거나 retrain할 필요 없음

confidence-based score와 distance-based score 유사

- distance가 class center과 가까울수록 높은 probabilty를 가짐
- 하지만 proposed method가 더 real world에 적용하기 쉬움
    - represenation이 class posterior probabilities보다 더 적용하기 쉬움
    - 구현하기 매우 쉬움
    - time cost도 적고 이는 data-efficient deep learning 목적과 일치함

```python
def get_median(features, targets):
    # get the median feature vector of each class
    num_classes = len(np.unique(targets, axis=0))
    prot = np.zeros((num_classes, features.shape[-1]), dtype=features.dtype)
    
    for i in range(num_classes):
        prot[i] = np.median(features[(targets == i).nonzero(), :].squeeze(), axis=0, keepdims=False)
    return prot


def get_distance(features, labels):
    
    prots = get_median(features, labels)
    prots_for_each_example = np.zeros(shape=(features.shape[0], prots.shape[-1]))
    
    num_classes = len(np.unique(labels))
    for i in range(num_classes):
        prots_for_each_example[(labels==i).nonzero()[0], :] = prots[i]
    distance = np.linalg.norm(features - prots_for_each_example, axis=1)
    
    return distance


def get_prune_idx(args, distance):
    
    low = 0.5 - args.rate / 2
    high = 0.5 + args.rate / 2
    
    sorted_idx = distance.argsort()
    low_idx = round(distance.shape[0] * low)
    high_idx = round(distance.shape[0] * high)
    
    ids = np.concatenate((sorted_idx[:low_idx], sorted_idx[high_idx:]))
    
    return ids
```

- 논문과 코드에서 다른 점이 논문에서 class center를 mean으로 구하지만 코드에서는 median으로 구하는 것을 확인할 수 있음

## More Justifications for The Proposed Methods


**Representation structures**


Model performance는 represenation structure과 관련이 있음

- Good represemation을 얻기 위해서 다음 3 가지에 대한 균형이 필요
- 제안된 방법이 세 가지 속성을 충족하고 여기서 균형을 달성함
- 그러나 다른 방법은 이 3 가지 속성의 균형을 동시에 맞출 수 없음

![](/assets/seminars/moderate-coreset-a-universal-method-of-data-selection-for-real-world-data-effici/6.png)


**Representation information measurement**


optimal representations는 유익함 (sufficiency) 과 간결함 (minimality) 둘 다 있어야 함


**Definition 1** (Sufficient and minimal representations) We say that a representation $\mathrm{z}$ of $\mathrm{x}$ is sufficient for $y$ if $y \!\perp\!\!\!\perp  \mathbf{x} \mid \mathbf{z}$ or equivalently if $I(\mathbf{z} ; y)=I(\mathbf{x} ; y)$; it is minimal when $I(\mathbf{x} ; \mathbf{z})$ is smallest among sufficient representations.



[📄 자료 링크 ↗](https://arxiv.org/abs/1801.04062)



We use a mutual information estimator to estimate $I(\mathbf{z} ; y),I(\mathbf{x} ; y),$ and $I(\mathbf{x} ; \mathbf{z})$. The technical details of the estimator are provided in Appendix E. Experiments are conducted on CIFAR100. Each estimation is repeated 20 times for reported mean.


![](/assets/seminars/moderate-coreset-a-universal-method-of-data-selection-for-real-world-data-effici/7.png)


## Evaluations In Ideal Scenarios


### Experimental Setup


**Datasets and network structures**

- CIFAR-100, Tiny ImageNet and ImageNet-1K
- ResNet-50

**Baselines**

- Random
- Herding
- Forgetting
- GradNd-score
- EL2N-score
- Optimation-based
- Self-sup.-selection
<details>
<summary>**Implementation details**</summary>
- NVIDIA GTX 3090 GPU
- CIFAR 100
    - 128 batch size
    - SGD : momentum 0.9, weight decay $5 \mathrm{e}-4$, initial learning rate 0.1
    - Learning rate is divided by 5 after the 60th epoch, the 120th epoch, and the 160th epoch. 200 epochs
    - random crop, random horizontal flip
- Tiny-ImageNet
    - 256 batch size
    - SGD : momentum 0.9, weight decay $5 \mathrm{e}-4$, initial learning rate 0.1
    - Learning rate is divided by 10 after the 30th epoch and the 60th epoch. 90 epochs are set totally
    - Random horizontal flip
- ImageNet-1k
    - 256 batch size
    - initial learning rate 0.01
    - SGD optimizer with a momentum of 0.9 , and a weight decay of 1e-3
    - 100 epochs

</details>


### Comparison with The State-of-the-Arts


![](/assets/seminars/moderate-coreset-a-universal-method-of-data-selection-for-real-world-data-effici/8.png)

- Test set accuracy
    - CIFAR-100 및 Tiny-ImageNet에서 특히 데이터 선택 비율이 낮은 경우(예: 20%, 30%, 40%), 저희 방법은 항상 최고의 성능을 달성
    - ImageNet-1k
        - 데이터 선택 비율이 60%, 70%, 90%일 때 저희 방법이 가장 좋은 결과를 얻었음
        - 또한 90%의 경우 proposed method의 결과가 전체 데이터로 학습 시 성능과 유사함

### Model Analyses


**Unseen network structure generalization**


![](/assets/seminars/moderate-coreset-a-universal-method-of-data-selection-for-real-world-data-effici/9.png)

1. Data selection을 위해 학습을 ResNet 50으로 학습을 완료하고 coreset 구성
2. Coreset으로 다른 architecture로 학습 후 evaluation (test set accuracy)

**Ablation study**


![Figure 3: Illustrations of results of ablation study on different data selection ways. (a)
Evaluations on CIFAR-100. (b) Evaluations on Tiny-ImageNet.](/assets/seminars/moderate-coreset-a-universal-method-of-data-selection-for-real-world-data-effici/10.png)

- Herding : class centers에 가까운 data point들을 선택
- Herding-c : class centers에서 먼 data point들을 선택
- Two-ends : class centers에서 가까운 data point와 먼 data point 모두 선택

**Boosting baselines with moderated corests**


![Figure 4: Illustrations of boosting advanced methods with moderate coresets. (a) Evaluations on CIFAR-100. (b) Evaluations on Tiny-ImageNet.](/assets/seminars/moderate-coreset-a-universal-method-of-data-selection-for-real-world-data-effici/11.png)

- 다른 score-based data selection methods에 moderate coreset 개념 추가
- 결과적으로 추가할 경우 더 성능이 향상됨

## Evaluations In Complex Realistic Scenarios


### Robustness to Corrupted Images


![](/assets/seminars/moderate-coreset-a-universal-method-of-data-selection-for-real-world-data-effici/12.png)


![](/assets/seminars/moderate-coreset-a-universal-method-of-data-selection-for-real-world-data-effici/13.png)


### Robustness To Label Noise


![](/assets/seminars/moderate-coreset-a-universal-method-of-data-selection-for-real-world-data-effici/14.png)


### Defense Against Adversarial Attacks


Adversarial examples : model 내에 작은 교란을 일으켜 높은 confidence로 오분류하도록 하는 것


PGD attacks, GS attacks 


![](/assets/seminars/moderate-coreset-a-universal-method-of-data-selection-for-real-world-data-effici/15.png)


![](/assets/seminars/moderate-coreset-a-universal-method-of-data-selection-for-real-world-data-effici/16.png)


## Conclusion


In this paper, we focus on data selection to boost data-efficient deep learning. Different from existing works that are usually limited to preconceived scenarios, we propose a concept of the moderate coreset to generalize different scenarios. As a proof-of-concept, a universal method operating with data representations is presented for data selection in various circumstances. Extensive experiments confirm the effectiveness of the proposed method. For future work, we are interested in adapting our method to other domains such as natural language processing. Furthermore, we are also interested in applying the concept of the moderate coreset concept to multiple advanced data selection methods theoretically and empirically.

- 다양한 scenario에서 generalize가 되는 moderate coreset 방법론을 제안
- 실제 다양한 실험들에서 성능과 시간 cost 측면에 높은 효율성을 가짐
