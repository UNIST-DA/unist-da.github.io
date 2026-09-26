---
date: 2023-06-09
title: POEM: Polarization of Embeddings for Domain-Invariant Representations (AAAI 2023)
category: Paper Review
presenter: Jae Hun Cho
url: https://www.notion.so/7b3ad0f90f9341a3b9dfafef17bf7416
keywords: Domain Generalization
---

# Title: POEM: Polarization of Embeddings for Domain-Invariant Representations


## Abstract: 


Handling out-of-distribution samples is a long-lasting challenge for deep visual models. In particular, domain generalization (DG) is one of the most relevant tasks that aims to train a model with a generalization capability on novel domains. Most existing DG approaches share the same philosophy to minimize the discrepancy between domains by finding the domain-invariant representations. On the contrary, our proposed method called **POEM acquires a strong DG capability by learning domain-invariant and domain-specific representations and polarizing them**. Specifically, POEM cotrains category-classifying and domain-classifying embeddings while <u>regularizing them to be orthogonal via minimizing the cosine-similarity between their features</u>, i.e., the polarization of embeddings. The clear separation of embeddings suppresses domain-specific features in the domain-invariant embeddings. <u>The concept of POEM shows a unique direction to enhance the domain robustness of representations that brings considerable and consistent performance gains when combined with existing DG methods</u>. Extensive simulation results in popular DG benchmarks with the PACS, VLCS, OfficeHome, TerraIncognita, and DomainNet datasets show that POEM indeed facilitates **the category-classifying embedding to be more domain-invariant**.

- domain-invariant와 domain-specific represenstaions을 학습하고 이를 polarizing시키는 것으로 강한 Domain Generation capability을 갖게 되는 POEM 방법론 제안
- POEM과 기존 Domain Generation methods과 결합 시에 더 좋은 성능을 발휘

## Link



[📄 자료 링크 ↗](https://arxiv.org/abs/2305.13046)



# Paper Review


## Intoduction


Despite the immense effort dedicated during the past decade, enhancing deep models to **acquire a strong generalization capability on novel data distribution** remains a daunting challenge. For computer vision, particularly, <u>the distributional shift of the image domain between the train and test sets</u>, known as **domain shift**, provokes **significant performance degradation** of deep visual models.


Domain generalization (DG), the task of interest here, pursues **developing algorithmic methods to overcome the domain shift.** 


Specifically, the DG task assumes that <u>an image classification model is trained on the data from source domains</u>, such as photos, sketches, cartoons, etc., then t<u>he model is tested on the target domains which are not shown in the training phase</u>.


![](/assets/seminars/poem-polarization-of-embeddings-for-domain-invariant-representations-aaai-2023/0.png)


**Contribution**

- We propose a method called **POEM that enhances the DG capability via polarization of domain-invariant and domain-specific features**.
- We provide a brief explanation that informally describes the improvement of DG ability based on the separation of domain-invariant and domain-specific features.
- We demonstrate <u>a consistent and considerable performance</u> gain of POEM **when combined with the cuttingedge DG methods**.

## Related Works


**Aligning Domains via Domain-Specific Knowledge**

- minimization of the discrepancy across training domains
- To obtain domain-invariant knowledge
- A group of methods in (Bousmalis et al. 2016; Mancini et al. 2018) <u>adopts per-domain embeddings that classify categories of images in each domain, and reduce the discrepancy between them.</u>
- As another strategy that utilizes domain-specific knowledge to acquire domain-invariant representation, the method in (Ganin and Lempitsky 2015) <u>employs a classifier of image domains</u> and <u>_gradient-reversely_</u> <u>co-trains it with the image category classifier</u>. The process makes the model inept to recognize domains.

![](/assets/seminars/poem-polarization-of-embeddings-for-domain-invariant-representations-aaai-2023/1.png)

- In contrast to the prior methods, our method POEM explicitly <u>co-trains category- and domain-classifying embeddings and disentangles them to achieve better generalization</u>, which is never been proposed. The methods of (Bousmalis et al. 2016; Mancini et al. 2018) **does not employ domain-classifying representations**. The algorithm of (Ganin and Lempitsky 2015) **adopts just a domain classifier, not a domain-classifying embeddin**g.

**Erasing Domain-dependancy**

- discard domain-dependent features.
- to obtain domain-invariant features.
- A method called NGLCM of (Wang et al. 2019) <u>regularizes domain-dependent texture features</u> of images extracted by _Gray-Level Co-occurrence Matrix_ (GLCM) of (Haralick, Shanmugam, and Dinstein 1973; Lam 1996).

**GLCM(Gray Level Co-occurrence Matrix)이란??**


GLCM이란, 통계적 질감 분석방법으로 현 재 픽셀과 그 이웃하는 픽셀의 밝기 값의 관계를 대비(Contrast), 상관관계(Correlation), 에너지(Energy), 동질성(Homogeneity) 등과 같은 질감 특징을 결정하는 통계량으로 계산하여 표현하는 것으로, 밝기를 나타낸 영상에서 정의한 변위벡터의 거리와 방향이 일치하는 픽셀쌍의 빈도 수를 표시하는 빈도 수 metric


![](/assets/seminars/poem-polarization-of-embeddings-for-domain-invariant-representations-aaai-2023/2.png)

- Representation Self-Challenging (RSC) of (Huang et al. 2020) learns to <u>mask sensitive features in the representation space</u>, which are believed to be domain-dependent.
- Common Specific Decomposition (CSD) of (Piratla, Netrapalli, and Sarawagi 2020) <u>decomposes the model parameters into the common and domain-specific parts</u> to identify the domain- invariant model parameters.
- POEM erases domain-dependent parts from domain-invariant representations by reducing the similarity between the category- and domain-classifying embeddings. However, **POEM is fundamentally different from the method of (Wang et al. 2019) that relies on visual characteristics** such as texture, and the methods of (Huang et al. 2020; Piratla, Netrapalli, and Sarawagi 2020) that are <u>not able to recognize explicit domain-dependent representations.</u>

**Optimizing Models for Generalization**

- adopt particular optimization methods that can generally improve the robustness of models to distribution shifts.
- After the authors of (Gulrajani and Lopez-Paz 2021) claim that <u>Empirical Risk Minimization (ERM) of (Vapnik 1998)</u> shows outperforming performance beyond the existing complicated DG methods, <u>ensemble learning of moving average models</u> (EoA) of (Arpit et al. 2022) shows the improved DG performance by just averaging model parameters during the ERM training steps.
- A group of approaches surpasses <u>combines ERM and the model averaging methods that find flatter minima in loss space</u> (Izmailov et al. 2018; Cha et al. 2021).
- **POEM is also built upon ERM, which is the simplest way to handle the DG task and is easily plugged in with the flat-minima searching methods called Stochastic Weight Averaging Densely (SWAD) of (Cha et al. 2021) for cutting-edge DG performance.**

**ERM**


The learning procedures of POEM are based on the most straightforward framework called Empirical Risk Minimization (ERM) (Vapnik 1998; Gulrajani and Lopez-Paz 2021) that minimizes the empirical risk, which is the average of category-classification losses $\mathcal{L}$ over the source domains



$$
\begin{equation}	\mathcal{\hat{E}}_{\mathcal{B}}(\theta) \triangleq \frac{1}{|\mathcal{B}|}\sum_{(\mathbf{x},y)\in\mathcal{B}}\mathcal{L}(f(\mathbf{x};\theta),y),\end{equation}
$$



where $\mathcal{B}=\{\mathcal{B}_{k}\}_{k=1}^{K}$ is a mini-batch, and $\mathcal{B}_{k}$ _is a sampled mini-batch from_  $\mathcal{D}_{k}$ of domain $k$. $f(\cdot\:;\theta)$ is an embedding parameterized by $\theta$, and $y$ is the image category label.


**SWAD (Stochastic Weight Averaging Densely)**


ERM + flat-minima searching method


![](/assets/seminars/poem-polarization-of-embeddings-for-domain-invariant-representations-aaai-2023/3.png)


![](/assets/seminars/poem-polarization-of-embeddings-for-domain-invariant-representations-aaai-2023/4.png)

- Dense strategy : 기존의 K epoch 간격이 아닌 모든 epoch에 따른 sampling
- 특정 validation loss 이하로 sampling

**Utilizing Pretrained Knowledge**

- Well-pretrained models from other datasets can be used for better DG performance.
- As a very recent work, Mutual Information Regularization with Oracle (MIRO) of (Cha et al. 2022) aims to <u>maximize the mutual information between the pretrained oracle representation and the target model’s representations for better generalization</u>.
- MIRO does <u>not adopt an explicit way to find domain-invariant features but just makes a model be similar to the oracle</u>.

## Proposed Method


**Motivation of our method**

- Human recognizes the images category and domain together.
- None of the existing methods can explicitly identify domain-specific and domain-invariant features.

### **Problem Settings of Domain Generalization**


set of training domains as $\mathcal{D}=\{\mathcal{D}_{k}\}_{k=1}^{K}$ where $D_{k}$ is the $k$-th training domain


For a classification model $f(x;\theta)$ and the loss function $\mathcal{L}$, the objective of the DG task is **to find the model parameter** $\theta$ **which is generalized well on the target domain** $\mathcal{T}$**,** i.e.,



$$
\begin{equation}
\theta^{*} = \argmin_{\theta}{\mathcal{L}\big(f(\mathbf{x};\theta),y \: ; \mathcal{D} \big)}
\end{equation}
$$



where $(\mathbf{x},y)$ is a pair of input and class label from $\mathcal{T}$.

- Target domain인 $\mathcal{T}$에 있는  $(\mathbf{x},y)$ 데이터에 대해 잘 generalized가 된 model parameter를 찾는 것을 목적으로 하고 있음

### **Model Description of POEM**


**Set of elementary embeddings**
Let us denote the set of elementary embedding as $\mathfrak{F}$: $\mathbb{R}^{D}\rightarrow\mathbb{R}^{N\times L}$ which is the set of elementary embeddings $\mathfrak{F}=\{f_{i}\}_{i=1}^{N}$ _with model parameter_ $\mathrm{\Theta}=\{\theta_{i}\}_{i=1}^{N}$_:_




$$
\begin{equation}
\mathfrak{F}(\mathbf{x}\:;\mathrm{\Theta}) \triangleq \big\{ f_{i}(\mathbf{x}\:;\theta_{i})\big\}_{i=1}^{N},
\end{equation}
$$



_where_ $N$ _is the number of elementary embeddings.
Each elementary embedding_ $f_{i}$ that is parameterized by $\theta_{i}$ maps an input $\mathbf{x}$ to the feature vector with the length of $L$.


![Proposed model architecture of POEM](/assets/seminars/poem-polarization-of-embeddings-for-domain-invariant-representations-aaai-2023/5.png)



For a given input $\mathbf{x}$ and $i$-th elementary embedding, the classification loss $\mathcal{L}_{c}$ _is calculated with cross-entropy_ $\mathcal{H}$ _with the probability from the Softmax computation and target label_ $y^{(i)}$_:_



$$
\begin{equation}
\mathcal{L}_{c}^{(i)}(\mathbf{x},y) = \mathcal{H}\Big(\text{Softmax}\big\{ f_{i}(\mathbf{x}\:;\theta_{i})\mathrm{\Phi}_{i} \big\}, y^{(i)}\Big)
\end{equation}
$$



**Disentangling loss:**



$$
\begin{equation} 
\mathcal{L}_{s}^{(i,j)}(\mathbf{x}) = \lvert K\big( f_{i}(\mathbf{x}\:;\theta_{i}), f_{j}(\mathbf{x}\:;\theta_{j}) \big)\rvert,
\end{equation}
$$



where $K(\cdot,\cdot)$ is the cosine similarity function of two vectors. The absolute operation $\lvert \cdot \rvert$ is for making the similarity be positive. We select cosine similarity for the disentangler to **orthogonalize two embedded features**.


**POEM computes disentangling loss for separating elementary embeddings from each other.**
To be specific, the cosine-similarity loss between features from different embeddings is zero-forced.
For a given input $\mathbf{x}$, the disentangling loss $\mathcal{L}_{s}^{(i,j)}(x)$ _for a pair of_ $i$ _and_ $j$_-th  elementary embeddings is calculated as follows:_


**Discrimination loss:**



$$
\begin{equation} 
%\mathcal{L}{d}(\mathbf{x},i,y) = - f{i}(\mathbf{x}\:;\theta_{i})\cdot w_{i} + \log\displaystyle\sum_{k=1}^{N}{f_{i}(\mathbf{x}\:;\theta_{i})}\cdot w_{k}.
\mathcal{L}_{d}^{(i)}(\mathbf{x}) = \mathcal{H}\Big( \text{Softmax}\big\{ f_{i}(\mathbf{x};\theta_i)\mathbf{W} \big\}, i\Big)
\end{equation}
$$




**POEM adopts discrimination loss which is to recognize the index of embeddings for a given feature.** The discriminator $\mathbf{W}$ is a simple classifier with $N$ classification weights: $\mathbf{W} = \{{w_{i}}\}_{i=1}^{N}$_.
For a given_ $\mathbf{x}$ _and_ $i$_-th elementary embedding, discrimination loss_ $\mathcal{L}_{d}^{(i)}(\mathbf{x})$ is computed with cross-entropy with the probability from Softmax calculation and target label $i$:


### Learning Procedures of POEM


**Training phase :** 


ERM



$$
\begin{equation}	\mathcal{\hat{E}}_{\mathcal{B}}(\theta) \triangleq \frac{1}{|\mathcal{B}|}\sum_{(\mathbf{x},y)\in\mathcal{B}}\mathcal{L}(f(\mathbf{x};\theta),y),\end{equation}
$$




Similarly, POEM trains learnable parameters including $\mathrm{\Theta}$, $\mathrm{\Phi}$ and $\mathbf{W}$ to minimize the empirical risk as follows:



$$
\begin{equation}	\mathcal{\hat{E}}_{\mathcal{B}}(\mathrm{\Theta}, \mathrm{\Phi}, \mathbf{W}) \triangleq \frac{1}{|\mathcal{B}|}\sum_{(\mathbf{x},y)\in\mathcal{B}}\mathcal{L}(\mathfrak{F}(\mathbf{x};\mathrm{\Theta}), \mathrm{\Phi}, \mathbf{W}, y).\end{equation}
$$



The particular loss term $\mathcal{L}$ is computed by considering the classification loss of elementary tasks $\mathcal{L}_{c}$_, the disentangling loss_ $\mathcal{L}_{s}$ between different embeddings, and the discrimination loss $\mathcal{L}_{d}$ for each embedding which are aforementioned:



$$
\begin{equation}	\begin{split}		&\mathcal{L}(f\big(\mathbf{x};\mathrm{\Theta}), \mathrm{\Phi}, \mathbf{W}, y\big) = \\		&\frac{1}{N}\displaystyle\sum_{i=1}^{N}\Big\{ \mathcal{L}_{c}^{(i)}(\mathbf{x},y) + \mathcal{L}_{d}^{(i)}(\mathbf{x}) + \sum_{j\neq i}^{N}\mathcal{L}_{s}^{(i,j)}(\mathbf{x}) \Big\}.	\end{split}\end{equation}
$$



Then the set of parameters $\mathrm{\Theta}$, $\mathrm{\Phi}$ and $\mathbf{W}$ are updated by computing the gradients of the empirical risk, i.e., $\mathcal{\hat{E}}_{\mathcal{B}}(\mathrm{\Theta}, \mathrm{\Phi}, \mathbf{W})$_:_



$$
\begin{equation} 
\begin{split}
&\nabla\mathcal{\hat{E}}_{\mathcal{B}}(\mathrm{\Theta}, \mathrm{\Phi}, \mathbf{W}) = \frac{1}{N|\mathcal{B}|} \sum_{(\mathbf{x},y)\in\mathcal{B}} \sum_{i=1}^{N}\nabla  \mathcal{L}(\mathfrak{F}\big(\mathbf{x};\mathrm{\Theta}), \mathrm{\Phi}, \mathbf{W}, y\big) \\
\end{split}
\end{equation}
$$



![](/assets/seminars/poem-polarization-of-embeddings-for-domain-invariant-representations-aaai-2023/6.png)


**Testing phase:**


In testing, **POEM keeps the embedding and classifier for the category-classifying task but drops other embeddings and classifiers**. With the retained embedding and classifier, i.e., $f_{z}(\cdot\:;\theta_{z})$ and $\mathrm{\Phi}_{z}$, POEM is evaluated on the samples in the target domains $\mathcal{T}$, where $z$ is the index of the elementary embedding for classifying categories of images.

- category-classifying task을 위한 embedding과 classifier만 사용
- target domain의 samples로 평가

### Understanding of POEM

- <u>how the elementary embeddings of POEM are constructed</u>
- <u>how the well-trained POEM achieves an improved generalization capability beyond ERM</u>

**How the elementary embeddings of POEM are constructed**


Before the explanation, let us introduce some useful notations.
We denote the trained set of elementary embeddings of POEM as $\mathfrak{F}(\cdot;\Theta^{})=\{f_{i}(\cdot;\theta_{i}^{})\}_{i=1}^{N}$ _where_ $f_i(\cdot;\theta_i^{*})$ _is_ $i$_-th elementary embedding with the learned parameters_ $\theta_{i}^{*}$_, and_ $N$ _is the number of elementary embeddings._ $N_{i}$ _is the number of labels for the classification task of_ $i$_-th embeddings._



$\mathcal{X}$ _is the input distribution that contains input samples_ $\mathbf{x}$_.
Let us denote the distribution of feature vectors of_ $i$_-th elementary embedding as_ $\mathcal{Z}_{i}^{*}$.
Based on the notations, let us describe the following desirable properties of the trained POEM embeddings.


**Property 1**. (from the discrimination loss $\mathcal{L}_{d}^{(i)}$_) When the feature_ $\mathbf{z}_{i}^{*}$ _is extracted by_  $i^{th}$ _embedding, i.e.,_ $\mathbf{z}_{i}^{*} \sim \mathcal{Z}_{i}^{*}$_, then_



$$
\begin{equation}
\mathbf{z}_{i}^{*}\cdot\mathbf{w}_{i}  \ge \displaystyle \max_{j\neq i}(\mathbf{z}_{i}^{*}\cdot\mathbf{w}_{j}).
\end{equation}
$$



Based on the discrimination loss, POEM is trained **to identify the index of embedding where a given feature is extracted**. Thus the property is desirable. POEM tries to **separate the feature distribution of each embedding** so that the distributions are not overlapped.


**Property 2**. (from the disentangling loss $\mathcal{L}_{s}^{(i,j)}$_)} When two feature vectors are extracted from different_  $i^{th}$ _and_ $j^{th}$ _embeddings for a single input_ $\mathbf{x}$_, then_



$$
\begin{equation}
\big|K\big(f_{i}(\mathbf{x};\theta_{i}^*), f_{j}(\mathbf{x};\theta_{j}^*\big)\big| \simeq 0.
\end{equation}
$$



Based on the disentangling loss for a given input, POEM is trained **to minimize the cosine similarity between two features that are extracted from different embeddings**. Thus the property is also desirable.


**With Property 1, the distributions of embeddings are separated but not orthogonalized.** 


**On the other hand, with Property 2, the sample-wise orthogonalization is guaranteed but the distributions can be overlapped.**


**How the well-trained POEM achieves an improved generalization capability beyond ERM**


Based on the understanding of POEM, we informally provide the following claim to explain how POEM achieves the improved generalization capability.



First, let us process the singular value decomposition (SVD) of the matrix $\mathbf{M}_{j}$ _formed by the collected feature vectors from_ $j^{th}$ _embedding, i.e.,_ $\mathbf{M}_{j}=\mathbf{U}_{j}\boldsymbol{\Sigma}_{j}\mathbf{V}_{j}^{T}$_. Then let us project a feature vector_ $\mathbf{z}_{i}^{*}$ _from different_ $i^{th}$ _embedding to the vector space_ $\mathbf{U}_{j}\boldsymbol{\Sigma}_{j}$_._ 



_Then the power of the projected feature vector will be zero-forced because the dominant components of_ $\mathbf{U}_{j}$ _would be orthogonal to_ $\mathbf{z}_{i}^{*}$ due to the polarization of embeddings.


**Claim 1**. (Information separation of embeddings) When feature vector $\mathbf{z}_{i}^{*}\sim \mathcal{Z}_{i}^{*}$ _is projected to the space formed by the features from different_ $j^{th}$ _embedding, then the power of the projected feature is minimized to zero:_



$$
\begin{equation}
||\mathbf{z}_{i}^{*}\mathbf{U}_{j}\boldsymbol{\Sigma}_{j}||^{2} \simeq 0.
\end{equation}
$$



It implies the information separation between embeddings, i.e., for the DG task, the features for the domain-classifying embedding are zero-forced in the category-classifying embedding space.
In other words,  **features from the category-classifying embedding are domain-invariant, or do not contain the information for domain-classification**.


## Experimental Results


Experimental setting

- Benchmark datasets
    - VLCS : 10,729 images, 5 classes, and 4 domains
    - PACS : 9,991 images, 7 classes, and 4 domains
    - OfficeHome : 15,588 images, 65 classes, and 4 domains
    - TerraIncognita : 24,788 images, 10 classes, 4 domains
    - DomainNet : 586,575 images, 345 classes, and 6 domains

For each benchmark, if a domain is selected as the target domain, then the remaining domains are designated to be the training source domains. We test all cases for each target domain and take the average of accuracies.


Network architecture

- ResNet-50 pretrained on ImageNet dataset

**Performance on Target Domain**


![](/assets/seminars/poem-polarization-of-embeddings-for-domain-invariant-representations-aaai-2023/7.png)

- 기존 방법들보다 성능이 높게 나옴
- 기존 방법들 중 MIRO와 SWAD와 결합 시 성능이 더 향상됨

### t-SNE Visualization of Embeddings


![](/assets/seminars/poem-polarization-of-embeddings-for-domain-invariant-representations-aaai-2023/8.png)


VLCS benchmark where the target domain is the ‘SUN09’ domain

- VLCS : 10,729 images, 5 classes, and 4 domains
- Embedding끼리 겹치지 않고 분리되어 있음

### Entropy Analysis of Embeddings


<u>For quantifying the domain-invariance of category-classifying features, we calculate the cross-entropy values when category-classifying features are used to classify domains.</u>



For the category embedding of POEM, the classifiers for domains are not prepared so we compute the domain-wise centroids $\{\mathbf{c}_{k}\}_{k=1}^{N}$ of features and utilize them as the classifiers for domains.



After obtaining the domain centroids, the c**ross-entropy loss is calculated by measuring the probability based on the Euclidean distance between feature vectors and centroids**, i.e.,



$$
\begin{equation}
P(y = k \: | \: \mathbf{x}) = \frac{\exp\big(-d(f_z(\mathbf{x}\:;\theta_z), \mathbf{c}_k)\big)}{\sum_{l=1}^{N} \exp\big(-d(f_{z}(\mathbf{x}\:;\theta_z), \mathbf{c}_{l})\big)},
\end{equation}
$$





where $N$ is the number of source domains, $d(\cdot,\cdot)$ means the Euclidean distance, and $z$ is the index of the category embedding. In addition, we train the ERM-based model on the same source domains and compute the cross-entropy loss with the same way.


![](/assets/seminars/poem-polarization-of-embeddings-for-domain-invariant-representations-aaai-2023/9.png)


It indicates that POEM <u>discards the domain-related information</u> from the category embedding


### Orthogonality Analysis of Embeddings


![](/assets/seminars/poem-polarization-of-embeddings-for-domain-invariant-representations-aaai-2023/10.png)


To confirm the orthogonality of different elementary embeddings of POEM, we compute the <u>averaged cosine similarity values</u> by randomly sampling two features from category- and domain-classifying embeddings.


### Ablation Analysis


![](/assets/seminars/poem-polarization-of-embeddings-for-domain-invariant-representations-aaai-2023/11.png)


### Complexity Analysis


POEM prepares two elementary embeddings, but once training is over, POEM drops the domain-classifying embedding and <u>utilizes only the category-classifying embedding for inference</u>. It means that POEM shows the same level of memory and computational costs during testing when compared to ERM.
When we compare POEM with SWAD, which is a promising DG method, SWAD is required to store an additional moving average model during iterations.
It means that **SWAD requires twice the number of parameters during the training phase**, i.e., the same as the costs of POEM. **MIRO shows the same level of costs as ERM during training, but MIRO requires additional costs for the pretraining of the oracles**.

- testing일 때 POEM과 ERM의  memory and computational costs가 같음
- SWAD는 훈련 시 POEM과 동일
- MIRO는 ERM와 cost level은 같지만 pretraining을 위해 더 많은 cost 요구

## Conclusion



<u>For achieving the robustness of the deep visual models on the out-of-distribution problem</u>, we propose a method called **POEM with a set of elementary embeddings where the elementary embeddings are trained to be disentangled with each other**. We show that considerable performance gains can be achieved by combining POEM with other cuttingedge DG methods, including ERM, SWAD, and MIRO.

- Out-of-distribution 문제를 해결하기 위해 POEM 방법론 제안
- 기존 DG methods와 결합 시 성능이 더욱 향상

## Discussion



**POEM is possibly extended to the more complicated generalization scenarios**. For example, <u>the medical image classification task may include a variety of dimensions</u> such as diseases, organs, patients, and types of imaging equipment. Then **POEM with an embedding for each dimension possibly handles the generalization tasks across multiple dimensions**. We leave it as a future work. Specifically, we expect that POEM enables training the disease-related embedding invariant to the other factors, i.e., patients or medical imaging equipment. When considering <u>the detection task for road objects, images would be diverse during daytime and night-time</u>. By employing the day/night-classifying embedding, the concept of POEM can be used to train the encoder to extract the day/night-invariant features by utilizing the day/night-classifying features.

- 더욱 복잡한 시나리오로 확장 가능
    - Medical image classification task (diseases, organs, patients, and types of imaging equipment)
    - detection task for road objects, images would be diverse during daytime and night-time.

# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
