---
date: 2023-06-02
title: Bidirectional Learning for Domain Adaptation of Semantic Segmentation (CVPR 2019)
category: Paper Review
presenter: Byungkook Koo
url: https://www.notion.so/e53d3067cc4141c182013e66c78167e9
keywords: Domain adaptation, Bidirectional learning
---

## Link



[📄 자료 링크 ↗](https://openaccess.thecvf.com/content_CVPR_2019/html/Li_Bidirectional_Learning_for_Domain_Adaptation_of_Semantic_Segmentation_CVPR_2019_paper.html)



## Abstract


Domain adaptation for semantic image segmentation is very necessary since manually labeling large datasets with pixel-level labels is expensive and time consuming. Existing domain adaptation techniques either work on limited datasets, or yield not so good performance compared with supervised learning. In this paper, we propose a novel bidirectional learning framework for domain adaptation of segmentation. Using the bidirectional learning, the image translation model and the segmentation adaptation model can be learned alternatively and promote to each other. Furthermore, we propose a self-supervised learning algorithm to learn a better segmentation adaptation model and in return improve the image translation model. Experiments show that our method superior to the state-of-the-art methods in domain adaptation of segmentation with a big margin.

- Bidirectional learning framework에 기반한 domain adpatation을 제안함
    - 이를 이용하여 image translation, segmentation model의 two-stage를 유기적으로 이어지게 함
- Self-supervised strategy를 이용하여 target domain이 unlabeled된 상황이라도 적용할 수 있음

## Introduction


Domain adaptation for semantic segmentation has made good progress by separating it into two sequential steps. 

- translates images(source to target) with image-to-image translation model
- discriminator on top of the features of the segmentation model

⇒ domain gap is reduced by the former step, the latter one is easy to learn and can further decrease the domain shift


⇒ Unfortunately, the segmentation model very relies on the **quality** of image to-image translation 


앞 단계가 재대로 이뤄지지 않으면, 다음 단계(downstream task)도 재대로 이뤄지지 않음


Propose a new **bidirectional** learning framework for domain adaptation of image semantic segmentation

- consists of image-to-image translation model and segmentation adaptation
- learning process involves two directions (i.e., “translation-to-segmentation” and “segmentation-to-translation”)
    - forward direction
        - **self-supervised learning** (SSL) approach in training segmentation adaptation model
        - trained on both synthetic and real datasets, but the real data has no annotations
        - predicted labels for real data with high confidence as the **approximation** to the ground truth
    - backward direction
        - propose a new perceptual loss to build the **bridge** between translation model and
        segmentation adaptation model

### Contribution

1. present a **bidirectional learning** system for semantic segmentation, which is a closed loop to learn the segmentation adaptation model and the image translation model alternatively
2. propose a **self-supervised learning** algorithm for the segmentation adaptation model, which incrementally align the source domain and the target domain at the feature level, based on the translated results
3. introduce a new **perceptual loss** to the image-to image translation, which supervises the translation by the updated segmentation adaptation model

## Related Work


### Domain Adapatation


⇒ 도메인이 서로 다른 데이터를 사용할 때 발생하는 mismatch를 잡아주는 방법


**Approaches**

- minimize domain distribution discrepancy
    - maximum Mean Discrepancy(kind of metric learning)
    - match domains with feature distributions(i.e. mean and covariance)

    ⇒ Gaussian distr.가 아닌 경우에는 domain align이 잘 되지 않음

- adversarial learning
    - reduces the domain shift by forcing the features from different domains
    to fool the discriminator(domain confusion)

### Domain Adaptation for Semantic Segmentation


![GTA-5 virtual dataset](/assets/seminars/bidirectional-learning-for-domain-adaptation-of-semantic-segmentation-cvpr-2019/0.png)


⇒ 이미 segmented된 virtual data를 사용하여 real data에 align해보자


Difficulty: visual (e.g., appearance, scale, etc.) domain gap between synthetic and real data usually makes it difficult


mapping from virtual to realistic data using unpaired image translation model(i.e. cycleGAN)

- performance is limited by the quality of image-to-image translation

## Method

- source dataset $S$ with segmentation labels $Y_s$
- target dataset $T $ with no labels
- image translation model $F$($S$→$T $)
- segmentation adaptatoin model $M$

AIM⇒ make its performance to be as close as possible to the model trained on $T$ with ground truth labels $Y_T$


![](/assets/seminars/bidirectional-learning-for-domain-adaptation-of-semantic-segmentation-cvpr-2019/1.png)


sequential learning framework로 구성 시 한계점

- no feedback from M to boost the performance of F
- M seems to just learn limited transferable knowledge

### Bidirectional Learning


![](/assets/seminars/bidirectional-learning-for-domain-adaptation-of-semantic-segmentation-cvpr-2019/2.png)

- translated results  $\mathcal{S}^{\prime}=\mathbf{F}(\mathcal{S})$
- reverse function of $\mathbf{F}$ = $\mathbf{F}^{\prime}$
1. Forward direction(F → M)
    - F에 대해 loss 계산 - **a**
    - F의 output을 이용하여 M의 loss 계산
2. Backward direction
    - M의 output을 이용하여 F의 loss 계산 - **b**

Image translation model의 loss



$$
\begin{aligned}\ell_{\mathbf{F}} & =\lambda_{G A N}\left[\ell_{G A N}\left(\mathcal{S}^{\prime}, \mathcal{T}\right)+\ell_{G A N}\left(\mathcal{S}, \mathcal{T}^{\prime}\right)\right] \\& +\lambda_{\text {recon }}\left[\ell_{\text {recon }}\left(\mathcal{S}, \mathbf{F}^{-1}\left(\mathcal{S}^{\prime}\right)\right)+\ell_{\text {recon }}\left(\mathcal{T}, \mathbf{F}\left(\mathcal{T}^{\prime}\right)\right]\right. \\& +\ell_{\text {per }}\left(\mathbf{M}(\mathcal{S}), \mathbf{M}\left(\mathcal{S}^{\prime}\right)\right)+\ell_{\text {per }}\left(\mathbf{M}(\mathcal{T}), \mathbf{M}\left(\mathcal{T}^{\prime}\right)\right.\end{aligned}
$$


- Forward direction에서 계산되는 loss(a)


$$
\ell_{G A N}\left(\mathcal{S}^{\prime}, \mathcal{T}\right)=\mathbb{E}_{I_{\mathcal{T}} \sim \mathcal{T}}\left[D_{\mathbf{F}}\left(I_{\mathcal{T}}\right)\right]+\mathbb{E}_{I_{\mathcal{S}} \sim \mathcal{S}}\left[1-D_{\mathbf{F}}\left(\left(I_{\mathcal{S}}^{\prime}\right)\right)\right]
$$




$$
\ell_{\text {recon }}\left(\mathcal{S}, \mathbf{F}^{-1}\left(\mathcal{S}^{\prime}\right)\right)=\mathbb{E}_{I_{\mathcal{S}} \sim \mathcal{S}}\left[\left\|\mathbf{F}^{-1}\left(\left(I_{\mathcal{S}}^{\prime}\right)\right)-I_{\mathcal{S}}\right\|_{1}\right]
$$


1. Domain confusion loss
    - $\mathcal{S}^{\prime}, \mathcal{T}$ 또는 $\mathcal{T}^{\prime}, \mathcal{S}$의 domain을 구분하지 못하도록 함
2. cycle consistency loss
    - Image translation model을 통해 변환된 이미지가 원래대로 reconstruct되는 지 확인
- Backward direction에서 계산되는 loss(b)

![](/assets/seminars/bidirectional-learning-for-domain-adaptation-of-semantic-segmentation-cvpr-2019/3.png)

1. perceptual loss
    - segmentation model과 translation model을 이어주는 역활
    - 두 번째 term으로 semantic consistency를 유지함
    - $\mathcal{S}^{\prime}, \mathcal{S}$ 그리고 $\mathcal{T}^{\prime}, \mathcal{T}$의 perceptuality 차이를 줄이는 방향으로 학습됨

Segmentation adaptation model의 loss(unsupervised setting)



$$
\ell_{\mathbf{M}}=\lambda_{a d v} \ell_{a d v}\left(\mathbf{M}\left(\mathcal{S}^{\prime}\right), \mathbf{M}(\mathcal{T})\right)+\ell_{s e g}\left(\mathbf{M}\left(\mathcal{S}^{\prime}\right), Y_{\mathcal{S}}\right)
$$




$$
\begin{aligned}\ell_{a d v}\left(\mathbf{M}\left(\mathcal{S}^{\prime}\right), \mathbf{M}(\mathcal{T})\right) & =\mathbb{E}_{I_{\mathcal{T}} \sim \mathcal{T}}\left[D_{\mathbf{M}}\left(\mathbf{M}\left(I_{\mathcal{T}}\right)\right)\right] \\& +\mathbb{E}_{I_{\mathcal{S}} \sim \mathcal{S}}\left[1-D_{\mathbf{M}}\left(\mathbf{M}\left(I_{\mathcal{S}}^{\prime}\right)\right)\right]\end{aligned}
$$




$$
\ell_{s e g}\left(\mathbf{M}\left(\mathcal{S}^{\prime}\right), Y_{\mathcal{S}}\right)=-\frac{1}{H W} \sum_{H, W} \sum_{c=1}^{C} \mathbb{1}_{\left[c=y_{\mathcal{S}}^{h w}\right]} \log P_{\mathcal{S}}^{h w c}
$$


1. domain confusion loss
    - Segmentation network 학습 시에도 사용하여 source, target을 더욱 align 시키도록 함
2. cross entropy loss

### Self-supervised Learning for Improving M


Target dataset의 label이 존재한다면, 무조건 supervised setting으로 하는 것이 best choice 


⇒ 문제 세팅이 unlabeled 이므로, self-supervised learning를 적용하여 해결


Based on the prediction probability of $T$, we can obtain some pseudo labels $\hat{Y}_T$ with high confidence


Segmentation adaptation model의 loss(self-supervised setting)



$$
\begin{aligned}\ell_{\mathbf{M}} & =\lambda_{a d v} \ell_{a d v}\left(\mathbf{M}\left(\mathcal{S}^{\prime}\right), \mathbf{M}(\mathcal{T})\right) \\& +\ell_{\text {seg }}\left(\mathbf{M}\left(\mathcal{S}^{\prime}\right), Y_{\mathcal{S}}\right)+\ell_{\text {seg }}\left(\mathbf{M}\left(\mathcal{T}_{s s l}\right), \widehat{Y}_{\mathcal{T}}\right),\end{aligned}
$$



self-supervised setting에서는 segmentation loss가 다음과 같이 변경됨 



$$
\ell_{\text {seg }}\left(\mathbf{M}\left(\mathcal{T}_{s s l}\right), \widehat{Y}_{\mathcal{T}}\right)=-\frac{1}{H W} \sum_{H, W} m_{\mathcal{T}}^{h w} \sum_{c=1}^{C} \mathbb{1}_{\left[c=y_{\mathcal{T}}^{h w}\right]} \log P_{\mathcal{T}}^{h w c}
$$


- $m_{\mathcal{T}}$: $\mathbb{1}{\text {[argmax }} \mathbf{M}\left(I_{\mathcal{T}}\right)> threshold]$

Pseudo label set은 empty에서 시작, M이 학습되면서 늘어가는 형태


![](/assets/seminars/bidirectional-learning-for-domain-adaptation-of-semantic-segmentation-cvpr-2019/4.png)


![](/assets/seminars/bidirectional-learning-for-domain-adaptation-of-semantic-segmentation-cvpr-2019/5.png)


## Discussion


### Bidirectional Learning without SSL


![](/assets/seminars/bidirectional-learning-for-domain-adaptation-of-semantic-segmentation-cvpr-2019/6.png)

1. source data로만 학습
2. translation model없이 segmentation loss만 사용하여 학습
3. (1)과 translation model을 사용하여 학습
4. SSL 없이 1-iteration 학습
5. SSL 없이 2-iteration 학습

⇒ segmentation adaptation model and the translation model can work independently and when combined together


### Bidirectional Learning with SSL


![](/assets/seminars/bidirectional-learning-for-domain-adaptation-of-semantic-segmentation-cvpr-2019/7.png)

- 같은 outer iteration에서 innter iteration이 증가할수록 evaluation performance가 증가함을 보임

![](/assets/seminars/bidirectional-learning-for-domain-adaptation-of-semantic-segmentation-cvpr-2019/8.png)

- outer iteration이 넘어갈 때 성능 감소가 존재했으나, inner iteration으로 다시 성능 증가

⇒ SSL이 효과가 있음


![](/assets/seminars/bidirectional-learning-for-domain-adaptation-of-semantic-segmentation-cvpr-2019/9.png)


### Hyperparameter learning 


predicted label이 최대한 많고, 정확하게 잡히는 지점으로 설정


![](/assets/seminars/bidirectional-learning-for-domain-adaptation-of-semantic-segmentation-cvpr-2019/10.png)


Left: perdiction confidence threshold 설정에 따른 pixel ratio


Right: Left의 기울기


⇒ pixel ratio 변화가 급격하게 일어나기 시작하는 구간인 0.9로 설정


![](/assets/seminars/bidirectional-learning-for-domain-adaptation-of-semantic-segmentation-cvpr-2019/11.png)

- pixel ratio가 수렴함: 참고할 pseudo label을 최대한 활용하고 있음

⇒ pixel ratio & mIoU가 수렴하는 2로 inner iteration 횟수를 설정


## Experiment


![](/assets/seminars/bidirectional-learning-for-domain-adaptation-of-semantic-segmentation-cvpr-2019/12.png)


![](/assets/seminars/bidirectional-learning-for-domain-adaptation-of-semantic-segmentation-cvpr-2019/13.png)

- Segmentation model을 DeepLab + ResNet으로 설정한 것이 더 좋은 성능을 보임
- Oracle(target data를 이용하여 supervised setting으로 학습)과는 성능 차이가 크게 존재

    ⇒ Future work


## Conclusion 

- propose a bidirectional learning method with self-supervised learning for segmentation adaptation problem
- show that segmentation performance for real dataset can be improved when the model is trained bidirectionally
- achieve the state of-the-art result for multiple tasks with different networks.
