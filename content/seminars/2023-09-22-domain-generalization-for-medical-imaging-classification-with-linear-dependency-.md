---
date: 2023-09-22
title: Domain Generalization for Medical Imaging Classification with Linear-Dependency Regularization (NeurIPS 2020)
category: Paper Review
presenter: Jae Hun Cho
url: https://www.notion.so/abf6d219d41144c3a7e12ad64a38b5b1
keywords: DeepLearning, Domain Generalization, Medical Imaging
---

## Link



[📄 자료 링크 ↗](https://proceedings.nips.cc/paper_files/paper/2020/hash/201d7288b4c18a679e48b31c72c30ded-Abstract.html)




[📄 자료 링크 ↗](https://colab.research.google.com/drive/1ziB6fdMytHw45cg1bQaLqkzI9UzrWGFB?usp=sharing)



## Abstract: 


Recently, we have witnessed great progress in the field of medical imaging classification by adopting deep neural networks. However, the recent advanced models still require accessing sufficiently large and representative datasets for training, which is often unfeasible in clinically realistic environments. When trained on limited datasets, the deep neural network is lack of generalization capability, as the trained deep neural network on data within a certain distribution (e.g. the data captured by a certain device vendor or patient population) may not be able to generalize to the data with another distribution. In this paper, we introduce a simple but effective approach to improve the generalization capability of deep neural networks in the field of medical imaging classification. Motivated by the observation that the domain variability of the medical images is to some extent compact, we propose to learn a representative feature space through variational encoding with a novel linear-dependency regularization term to capture the shareable information among medical data collected from different domains. As a result, the trained neural network is expected to equip with better generalization capability to the “unseen" medical data. Experimental results on two challenging medical imaging classification tasks indicate that our method can achieve better cross-domain generalization capability compared with state-of-the-art baselines.


### Summary

- medical imaging classification task : unseen domain에서 모델의 generalization capability이 부족
- 이를 해결하기 위해 간단하고 효율적인 방법 제안
- **여러가지 domain에서 공유하는 feature를 학습하기 위해 variational encoding과 Linear-Dependency Regularization을 통해 representative feature space를 학습**

## Introduction


**ML & DL**

- 다양한 medical imaging task에서 좋은 성과를 보여줌
- the number of training data is not sufficient
    - lack of generalization capability
    - domain shift problem이 발생할 경우 좋은 성능을 발휘하기 어려움

    ![](/assets/seminars/domain-generalization-for-medical-imaging-classification-with-linear-dependency-/0.png)


![](/assets/seminars/domain-generalization-for-medical-imaging-classification-with-linear-dependency-/1.png)

- **Medical Imaging domain : imaging protocol, device vendors and patient populations**

⇒ Domain variability of the medical images : 작음


![](/assets/seminars/domain-generalization-for-medical-imaging-classification-with-linear-dependency-/2.png)


![](/assets/seminars/domain-generalization-for-medical-imaging-classification-with-linear-dependency-/3.png)


![](/assets/seminars/domain-generalization-for-medical-imaging-classification-with-linear-dependency-/4.png)


**LDDG(Linear-Dependency Domain Generalization)**

1. train a model with **a rank regularization term** on latent feature space
2. variational encoding을 통해 사전 분포을 따르도록 latent feature들의 분포를 제한
- 이론적으로 target domain의 empirical risk에 대한 upper bound를 증명하였음
    - overfitting 문제 완화 가능
- two challenging medical imaging classification 실험
    - SOTA에 비해 generalization capability를 향상시킴

## Related Work


### Domain Adaptation and Generalization

- domain-shift problem을 해결하기 위한 방법

    ![](/assets/seminars/domain-generalization-for-medical-imaging-classification-with-linear-dependency-/5.png)


**Domain adaptation**


![](/assets/seminars/domain-generalization-for-medical-imaging-classification-with-linear-dependency-/6.png)

- source domain의 knowledge를 target domain로 transfer하는 방법
- Trainditaionl approaches : instance re-weighting, subspace learning
- Deep learning methods
    - distribution alignment
        - Maximum Mean Discrepancy
    - adversarial learning through feature level or pixel level
        - DANN(Domain Adversarial Neural Net), Adversarial Discriminative Domain Adaptation
        - Unsupervised Pixel-level Domain Adaptation with GAN
        - pixel level adaptation과 feature level adaptation를 동시에 고려하는 방법도 존재
- **real-time clinical application scenario**
    - 실제 상황에서 충분한 target domain data를 얻기 어려움
    - target domain data를 access하기 어려움 (privacy regulation)

**Domain generalization**

- **사전 지식 없이도 unseen domain에서도 충분한 performance 발휘**
- domain invariant feature를 학습
    - leverage Canonical Correlation Analysis (**CCA**)
    - a Domain Invariant Component Analysis (**DICA**) algorithm to learn an empirical mapping based on multiple source domain data where the distribution mismatch across domains was minimized
    - the **low-rank regularization** based on classifier and model parameters
    - a **multi-task autoencoder** by reconstructing the latent representation of a given sample from one domain to another domain
- minimize the semantic alignment loss as well as the separation loss
- 데이터 증강 기법 : MixUp
- Meta learning : transfer the idea in to the target domain setting by randomly constructing meta-train and meta-test set

### Cross-Domain Medical Imaging Classification

- GANs to mitigate the domain shift problem
    - transfer the knowledge from CT images to X-ray images
    - conducted domain translation from MR to CT domain for heart segmentation problem
    - proposed to conduct segmentation and data synthesis jointly to segment heart chambers in both CT and MR domain
- data augmentation based on medical imaing data
    - three different aspects: image quality (e.g., blurriness), image appearance (e.g., brightness) and spatial shape (e.g., rotation, scaling)

## Methodology


**Goal**


multiple source domains


$\mathcal{D}=\left\{\left(x_i^k, y_i^k\right)\right\}_{i=1}^{N_k}, k \in\{1,2, \ldots, K\}$


 **훈련된 모델로 target domain의 sample** $x^T$**를 예측할 수 있도록 하는 것**


**Linear-Dependency Domain Generalization (LDDG)**

1. Linear-Dependency Modeling : regularize the latent feature space
2. Distribution Alignment :  **the distribution of latent features와 pre-defined distribution** (shareable information를 가지고 있음)를 일치 시킴

### Linear-Dependency Modeling


Data augmentation approach 


    ⇒ 적절한 augmentation type을 선택하기 어려움

- most of augmentation process : linear transformation

⇒ 이를 통해 latent feature space에 linear dependency가 존재한다고 가정


**Linear-Dependency Modeling**


a medical image batch collected from $K$ different domains with label $c$ : $\left\{x_{i_1, c}^1, x_{i_2, c}^2, \ldots, x_{i_K, c}^K\right\}$


a set of parameters $\left\{\alpha_1, \alpha_2, \ldots, \alpha_K\right\}$ 


the corresponding latent features $\left\{z_{i_1, c}^1, z_{i_2, c}^2, \ldots, z_{i_K, c}^K\right\}$ 


$z_{i_j, c}^j=\alpha_1 z_{i_1, c}^1+\alpha_2 z_{i_2, c}^2+\ldots+\alpha_{j-1} z_{i_{j-1}, c}^{j-1}+\alpha_{j+1} z_{i_{j+1}, c}^{j+1}+\ldots+\alpha_K z_{i_K, c}^K$ for different $j$


⇒ unseen domain을 source domain의 latent features과 parameters들의 선형 결합


⇒ a dominant eigenvalue 존재 (capturing the category information of the matrix $\left[z_{i_1, c}^1, z_{i_2, c}^2, \ldots, z_{i_K, c}^K\right]$)


**과정**

1. mini-batch $\mathcal{X}=\left\{x_i^k\right\}$를 이용해 a posterior $q(z \mid x)$ parameterized by an encoder를 통해  해당 latent features as $\mathcal{Z}$를 얻을 수 있음
2. mode-1 flattening $\mathcal{Z}$ as $\mathbf{Z}^1$
3. $\mathbf{Z}$의 rank를 클래스의 수로 정규화

Setting the rank of $\mathbf{Z}$ to $C$ is equivalent to minimize the $(C+1)$ th singular value(특이값) of $\mathbf{Z}$ 



$$
\mathcal{L}_{\text {rank }}=\sigma_{C+1}
$$



```python
feature = mu_logvar[:, 2].permute(0, 2, 3, 1).contiguous().view(-1, net_spinal_cord.feature_dim)
feature = feature[torch.randperm(len(feature))]
U, S_spinal, V = torch.svd(feature[0:2000])
low_rank_loss_spinal = S_spinal[2]
```


(이때 categories = [0, 1])


기존 방법 : low-rank regularization


1) rank regularization based on the latent feature space ⇒ computational efficiency


2) set the rank to be a specific number ⇒  better performance


### Distribution Alignment


**Variational encoding**

- Kullback-Leibler (KL) divergence
    - match the latent features to a pre-defined prior distribution
    - Gaussian distribution $\mathcal{N} \sim(0,1)$ as the prior distribution
    - $K L(q(\mathcal{Z} \mid \mathcal{X}) \| \mathcal{N} \sim(0,1))$**, where** $\mathcal{Z}$ **is the latent features**

**Theoretical Analysis**

- LDDG can lead to an upper bound of expected loss on target domain

**Assumption 1**


> 💡 For any latent feature belong to domain $T$ with label $c$, it can be represented by data from other related domains, i.e., $q\left(z_{i_T, c}^T \mid x_{i_T, c}^T\right)=\sum_{j=1}^K \beta_j q\left(z_{i_j, c}^j \mid x_{i_j, c}^j\right)$, where $\beta_j>=0$ and $\|\beta\| \leq M,\left\{x_{i_1, c}^1, x_{i_2, c}^2, \ldots, x_{i_K, c}^K\right\}$ belong to the same category as $x_T$.


restrict the rank of latent features to be the number of category



**Assumption 2**


> 💡 (1) $\mathcal{L}$ is non-negative and bounded. (2) $\mathcal{L}$ is convex: $\mathcal{L}\left(\sum_j \lambda_j y_j, y\right) \leq$ $\sum_j \lambda_j \mathcal{L}\left(y_j, y\right)$, where $\lambda_j \geq 0$,  and $\sum_j \lambda_j=1$.


cross-entropy loss 포함 다양한 loss functions은 이를 만족함


**Theorem 1**


> 💡 Given a sample $x_{i_T, c}^T$ from target domain $T$ where the distribution of its latent variable is represented as $q\left(z_{i_T, c}^T \mid x_{i_T, c}^T\right)=\sum_{j=1}^K \beta_j q\left(z_{i_j, c}^j \mid x_{i_j, c}^j\right)$, its latent variable is within the manifold of $\mathcal{N} \sim(0,1)$


**Proof**. For simplicity, we first denote **the distribution on latent variables as** $q_i(z), i=\{1,2, \ldots, K, T\}$ as well as the **Gaussian prior** $\mathcal{N} \sim(0,1)$ **as** $q_*(z)$_. We can obtain the following upper bound,_



$$
\begin{aligned}
\small & K L\left(q_T(z) \| q_*(z)\right)=\sum_{j=1}^K \beta_j \int_z q_j(z) \log \frac{q_T(z)}{q_*(z)} d z \\
= & \sum_{j=1}^K \beta_j \int_z q_j(z) \log \frac{q_j(z)\left[1+\left(q_T(z) / q_j(z)-1\right)\right]}{q_*(z)} d z \\ =& \sum_{j=1}^K \beta_j \int_z q_j(z) (\log \frac{q_j(z)} {q_*(z)}+\log \left[1+\left(q_T(z) / q_j(z)-1\right)\right]) d z  \\ \leq & \sum_{j=1}^K \beta_j   K L\left(q_j(z) \| q_*(z)\right)=\sum_{j=1}^K \beta_j \int_z q_j(z) (\log \frac{q_j(z)}{q_*(z)} + q_T(z) / q_j(z)-1)   d z
\end{aligned}
$$




where we use $\log (1+x) \leq x$ and $\int q_T(z) d z=\int q_j(z) d z=1$. 


**As** $K L\left(q_j(z) \| q_*(z)\right)$ _**is minimized according to our proposed distribution alignment,**_ $K L\left(q_T(z) \| q_*(z)\right)$ **is then minimized**



**Theorem 2** 


> 💡 Given data from $K$ source domains, where the empirical risk of domain $j$ is given as $\mathcal{L}\left(\hat{y}^j, y\right)=\epsilon_j \leq \epsilon$, the expected loss $\mathcal{L}\left(\hat{y}^T, y\right)$ is at most $M \epsilon+\log C$, where $C$ denotes the number of category given a task, if the classification layer is linear with softmax normalization trained by $\mathcal{L}$ which is a cross-entropy loss.


**Proof**. Based on Theorem 1, we have $q_T(z)=q_*(z)$


Thus, we have the following upper bound


$\begin{aligned}
& \int_z \mathcal{L}\left(\hat{y}^T, y\right) q_T(z) d z=\int_z \mathcal{L}\left(\sum_{j=1}^K \beta_j \hat{y}^j, y\right) q_*(z) d z=\int_z \mathcal{L}\left(\|\beta\| \sum_{j=1}^K \frac{\beta_j}{\|\beta\|} \hat{y}^j, y\right) q_*(z) d z \\
\leq & \sum_{j=1}^K \frac{\beta_j}{\|\beta\|} \int_z \mathcal{L}\left(\|\beta\| \hat{y}^j, y\right) q_j(z) d z = \sum_{j=1}^K \frac{\beta_j}{\|\beta\|} \mathcal{L}\left(\|\beta\| \hat{y}^j, y\right) \leq \sum_{j=1}^K \frac{\beta_j}{\|\beta\|} M \epsilon+\log C=M \epsilon+\log C,
\end{aligned}$


where $\mathcal{L}(\cdot)$ denotes the cross-entropy loss with softmax operation. 


We also utilize the bounds of Log-Sum-Exp function $f(a) \leq \max \left\{a_1, a_2, \ldots, a_n\right\}+\log n$, where $f(a)=\log \sum_{i=1}^n \exp \left(a_i\right)$. In our work, $\left\{a_1, a_2, \ldots a_n\right\}$ corresponds to the softmax output of $n$ different nodes.


### Model Training


Only adopt a linear module without any non-linear processing

1. Images $\mathcal{X}=\left\{x_i^k\right\}$ are first fed into the feature extractor $Q_\theta$ to obtain the latent features
2. latent features are resampled through variational encoding network $F_\omega$

    ```python
    def reparameterization(self, mu, logvar):
            std = torch.exp(logvar / 2)
            # sampled_z = torch.tensor(np.random.normal(0, 1, (mu.size(0), mu.size(1))))
            sampled_z = torch.normal(mu, std)
            z = sampled_z * std + mu
            return z
    ```

3. Classification network $T_\phi$ outputs the corresponding prediction $\left\{\hat{y}i^k\right\}$


$$
\mathcal{L}_{\text {obj }}=\sum_{i, k} \mathcal{L}_c\left(\hat{y}i^k, y_i^k\right)+\lambda_1 \mathcal{L}_{\text {rank }}+\lambda_2 K L(q(\mathcal{Z} \mid \mathcal{X}) \| \mathcal{N} \sim(0,1))
$$



# Experiments


### Skin lesion classification

- seven domain : HAM10000, Dermofit (DMF), Derm7pt (D7P), MSK, PH2, SONIC (SON), and UDA
    - 각각 다른 장비들로 수집됨
- seven-category
- 50% training set, 20% validation set and 30% testing set
- ResNet18 model pretrained on ImageNet

![](/assets/seminars/domain-generalization-for-medical-imaging-classification-with-linear-dependency-/7.png)


![](/assets/seminars/domain-generalization-for-medical-imaging-classification-with-linear-dependency-/8.png)


### Spinal cord gray matter segmentation


the task of gray matter segmentation of spinal cord based on MRI

- four domain
    - different MRI systems

![MRI image](/assets/seminars/domain-generalization-for-medical-imaging-classification-with-linear-dependency-/9.png)


![spinal cord  mask](/assets/seminars/domain-generalization-for-medical-imaging-classification-with-linear-dependency-/10.png)


![gray matter mask](/assets/seminars/domain-generalization-for-medical-imaging-classification-with-linear-dependency-/11.png)


Two-strategy

1. segment the spinnal cord (척수) area
2. segment the gray matter area (회색질) from the output of 1)

![](/assets/seminars/domain-generalization-for-medical-imaging-classification-with-linear-dependency-/12.png)

<details>
<summary>Metric</summary>
- Dice Similarity Coefficient (DSC)
    - IoU와 같이 두 개의 영역 A, B가 얼마나 겹쳐지는 지를 나타내는 지표
    - GT와 예측된 영역 Pred를 비교

    
$$
    \begin{equation}D S C=\frac{2|X \cap Y|}{|X|+|Y|}\end{equation}
    $$
    

- Jaccard Index (JI)

    
$$
    \begin{equation}J(A, B)=\frac{|A \cap B|}{|A \cup B|}=\frac{|A \cap B|}{|A|+|B|-|A \cap B|}\end{equation}
    $$
    

- Conformity Coefficient (CC)

    measures the ratio between missegmented voxels and correctly segmented voxels


    
$$
    \frac{1-(FP +FN)}{TP}
    $$
    

- Average surface distance (ASD)

    Computes the average surface distances by correctly taking the area of each surface element into account

- Sensitivity (TPR)

    
$$
    \frac{TP}{TP + FN}
    $$
    


</details>


LDDG


| source | target | DSC    | CC     | JI      | TPR    | ASD    |
| ------ | ------ | ------ | ------ | ------- | ------ | ------ |
| 2,3,4  | 1      | 0.8397 | 60.87  |  0.7270 | 0.8675 | 0.0484 |
| 1,3,4  | 2      | 0.8299 | 58.88  | 0.7098  | 0.8808 | 0.0547 |
| 1,2,4  | 3      | 0.5510 | -122.6 | 0.3932  | 0.5675 | 1.8391 |
| 1,2,3  | 4      | 0.8896 | 75.085 | 0.8019  | 0.8970 | 0.0467 |


![](/assets/seminars/domain-generalization-for-medical-imaging-classification-with-linear-dependency-/13.png)


### Ablation Study


![](/assets/seminars/domain-generalization-for-medical-imaging-classification-with-linear-dependency-/14.png)


![](/assets/seminars/domain-generalization-for-medical-imaging-classification-with-linear-dependency-/15.png)

- rank를 클래스의 개수로 제한 시 가장 성능이 좋음

![](/assets/seminars/domain-generalization-for-medical-imaging-classification-with-linear-dependency-/16.png)

- 클래스의 개수 : 2
- stage 1, stage 2 모두에서 나머지 value들이 빠르게 수렴되는 것을 확인할 수 있음

## Conclusion


Generalization problem in medical imaging classification task


proposed method : LDDG(Linear-Dependency Domain Generalization)

- **linear-dependency modeling and domain alignment**
- **learn a representative feature space** through variational encoding with linear-dependency regularization with a novel rank regularization term
- theoretical analysis : an empirical risk upper bound on target domain can be achieved
- 두 개의 실험에서 SOTA 성능을 달성

# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
