---
date: 2024-04-05
title: Active Domain Adaptation via Clustering Uncertainty-Weighted Embeddings (ICCV 2021)
category: Paper Review
presenter: Byungkook Koo
url: https://www.notion.so/53d45668d7a7432db19c834b9255312d
keywords: Domain adaptation, Active learning
---

# Active Domain Adaptation via Clustering Uncertainty-Weighted Embeddings


### Link



[📄 자료 링크 ↗](https://openaccess.thecvf.com/content/ICCV2021/html/Prabhu_Active_Domain_Adaptation_via_Clustering_Uncertainty-Weighted_Embeddings_ICCV_2021_paper.html)



## Abstract


Generalizing deep neural networks to new target domains is critical to their real-world utility. In practice, it may be feasible to get some target data labeled, but to be cost-effective. it is desirable to select a maximally-informative subset via active learning (AL). We study the problem of AL under a domain shift, called Active Domain Adaptation (Active DA). We demonstrate how existing AL approaches based solely on model uncertainty or diversity sampling are less effective for Active DA. We propose Clustering Uncertainty-weighted Embeddings (CLUE), a novel label acquisition strategy for Active DA that performs uncertainty-weighted clustering to identify target instances for labeling that are both uncertain under the model and diverse in feature space. CLUE consistently outperforms competing label acquisition strategies for Active DA and AL across learning settings on 6 diverse domain shifts for image classification. 


## Introduction


**Domain adaptation**

- Deep neural networks struggle to generalize this knowledge to new target domains → distribution shift problems

![](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/0.png)

- Dataset size가 source >> target인 경우를 많이 가정함
    - e.g. simulation → reality
- Target domain의 성격에 따라 여러 learning strategy 적용 가능
    - Supervised(all labeled)
    - Semi-supervised(unlabeled + partially labeled)
    - Unsupervised(unlabeled)
- Data amount가 같을 때, 성능 측면에서 supervised > unsupervised인 경우가 일반적임
    - 모든 target data를 labeling → cost-high
    - Target data의 일부만 labeling → cost-effective
    - Target data 모두 informative 하지 않음

    ⇒ labeling을 위해 informative한 데이터를 어떻게 선별할까?


**Active learning**


![Active learning process](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/1.png)

1. Labeled data를 통해 모델을 학습
2. 학습된 모델을 통해 labeling 대상 데이터를 선별
3. Oracle(e.g. 도메인 전문가, 의사)을 통해 해당 데이터를 labeling
4. 3을 거친 labeled data를 training set에 포함 시킴
5. 목표 성능에 도달할 때 까지 1-4를 반복함

![Red dot: labeled data / Green dot: selected data for labeling](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/2.png)


⇒ Active learning을 통해 informative한 데이터를 선별, labeling하여 분류 성능 향상이 가능함


선별 기준에 따라 두 가지 paradigm으로 나눌 수 있음

1. Uncertainty ⇒ boundry 근처에 있는 데이터 / 모델이 햇갈리는 데이터
2. Diversity ⇒ 데이터의 분포를 커버할 수 있는 데이터 / 데이터셋을 대표하는 데이터

![](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/3.png)


각 paradigm은 Trade-off가 존재하며, 다음과 같은 단점들이 있음

1. Uncertainty ⇒ Outlier에 취약하며, 데이터 분포를 고려하지 못 함
2. Diversity ⇒ 정교한 decision boundry를 위한 정보 X

**Active domain adaptation**


 ⇒ Domain shift가 존재하는 데이터에 대해서, active learning을 적용하자


![](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/4.png)

- Source model을 target에 adapt 시키면서, target instance labeling을 진행

Domain shift 상황에서 active learning paradigm을 단일 적용하는 경우, 다음과 같은 문제가 발생함 


![](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/5.png)

- Uncertainty sampling
    - Calibrate 되지 않은 instance를 sampling할 수 있음
- Diversity sampling
    - 이미 분류가 잘 되는 instance를 sampling할 수 있음

⇒ 두 paradigm을 모두 고려하는 방법을 제안(CLUE)


## Methodology


**Notation** 


$\left(X_{\mathcal{S}}, Y_{\mathcal{S}}\right)$ → Labeled source domain data, label 


$X_{\mathcal{U} \mathcal{T}}$ → Unlabeled target domain data


$B$ → 한 step 당 labeling 할 수 있는 데이터 개수


    $X_{\mathcal{L} \mathcal{T}}$ → Labeling된 target data


$X_{\mathcal{T}}=X_{\mathcal{L} \mathcal{T}} \cup X_{\mathcal{U} \mathcal{T}}$


$\mathbf{x}_{\mathcal{S}} \in X_{\mathcal{S}}, \mathbf{x}_{\mathcal{T}} \in X_{\mathcal{T}}$ → Source, target의 image sample


$y_{\mathcal{S}} \in Y_{\mathcal{S}}, y_{\mathcal{T}} \in Y_{\mathcal{T}}$ → Source, target의 label($y \in\{1,2, . ., C\}$)


$\phi(x)$ → CNN network의(Feature extractor) penultimate layer의 activation


**Target Uncertainty weighting**


![](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/6.png)

- Source domain으로 학습된 모델에 대해 unlabeled target data의 **entropy**에 따라 uncertainty weighting을 진행


$$
\mathcal{H}(Y \mid \mathbf{x})=-\sum_{c=1}^{C} p_{\Theta}(Y=c \mid \mathbf{x}) \log p_{\Theta}(Y=c \mid \mathbf{x})
$$


- Domain shift 상황에서는, entropy를 통해 uncertainty & domainness 모두 capture 가능
    - Source domain으로 학습된 모델을 사용하기 때문에,
        - Source instance는 낮은 entropy, target instance는 높은 entropy를 가지게 됨

    
$$
    \begin{equation*}
    p(d(\mathbf{x})=1)=\frac{\mathcal{H}(Y \mid \mathbf{x})}{\log (C)} \propto \mathcal{H}(Y \mid \mathbf{x}) \quad[C \text { is constant }]
    \end{equation*}
    $$
    


    ⇒ entropy에 따라 weight을 부여하면, uncertainty가 높고 & domain shift가 큰(target domain에 속할 확률이 높음) 데이터가


    큰 weight 을 가지게 됨


**Uncertainty-weighted Clustering**


![](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/7.png)

- Uncertainty weight을 이용하여 weighted k-means clustering 진행

    ⇒ 가중치를 고려하며, 각 set의 분산이 최소화되도록 partitioning


    $\mathcal{S} : X_{T} \rightarrow\left\{X_{1}, X_{2}, \ldots, X_{K}\right\}$ → partitioning function


    $\left\{\mu_{1}, \mu_{2}, \ldots, \mu_{K}\right\}$ → 각 set의 centroid



$$
\begin{equation*}
\underset{\mathcal{S}, \mu}{\operatorname{argmin}} \sum_{k=1}^{K} \frac{1}{Z_{k}} \sum_{\mathbf{x} \in X_{k}} \mathcal{H}(Y \mid \mathbf{x})\left\|\phi(\mathbf{x})-\mu_{\mathbf{k}}\right\|^{2}, where \; Z_{k}=\sum_{x \in X_{k}} \mathcal{H}(Y \mid \mathbf{x})
\end{equation*}
$$



**Acquire labels(labelieng)**

- 각 set의 centroid의 nearest neighbor에 해당하는 데이터를 labeling

![](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/8.png)


$ X_{\mathcal{L} \mathcal{T}}^{\rho} \leftarrow\left\{\mathbf{N N}\left(\mu_{\mathbf{i}}\right)\right\}_{i=1}^{B}, 
\;\;X_{\mathcal{L} T}=X_{\mathcal{L} T} \cup X_{\mathcal{L T}}^{\rho}$


**Update model via (semi)supervised manner**

- Labeled target data 혹은 labeled source, unlabeled target data를 사용하여 model update 진행
- 상단의 단계들을 Iterative하게 진행하여 최종적으로 distribution alignment를 진행할 수 있음

![](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/9.png)


![CLUE: algorithm](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/10.png)


**Trade-off uncertainty and diversity**

- Uncertainty via entropy-weighting
- Diversity(feature-space coverage) via clustering
- 모델의 logit에 Temperature를 적용하여 trade-off를 조정 가능


$$
\begin{equation*}p_{\Theta}(Y \mid \mathbf{x})=\sigma\left(\frac{h(\mathbf{x})}{T}\right) \tag{5}\end{equation*}
$$



![Softmax distributions](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/11.png)

- T를 크게 하는 경우 → Similar uncertainty estimates를 가지게 되어, diversity가 강조됨
- T를 작게 하는 경우 → uncertainty estimates 차이가 극대화 되어, uncertainty가 강조됨

## Experiments


**Data**

- DomainNet
- DIGITS
- Office

**DA methods**

- Fine-tuning(ft) from source
- MME(minimax entropy)

![](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/12.png)

- Labeled data를 대표하는 prototype을 지정 & unlabeled data의 entropy가 maximize 하는 위치로 이동
- 이동된 prototype에 대해서, unlabeled data의 entropy가 minimize 되도록 학습
- prototype을 변경하며 진행
- DANN(Domain adversarial training of neural networks)

![](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/13.png)

- Class, domain label을 잘 구별하도록 loss 계산 후,
    - domain loss에 대해 gradient reversal layer를 통해 반대로 학습되도록 설정(domain 구별을 못하도록)

**AL methods**

- Uncertainty
    - entropy
    - margin
- Diversity
    - Coreset
- Compositive
    - Badge
        - Gradient embedding을 통한 uncertainty, k-means clustering을 통한 diversity를 고려하는 방법론
    - AADA
        - DANN을 통해 학습한 모델에 대해, entropy가 큰 & target domain의 확률이 큰 unlabeled data를 찾는 방법론
    - CLUE
        - 제안 방법

## Results


**DomainNet에 대한 결과** 


![](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/14.png)

- Source → target / 이에 따른 round 2, 4, 10에 대한 성능을 표기함
    - 단계 별 확보되는 label은 1000, 2000, 5000
- Easy task에 대해서는 ‘margin’이 앞서는 경우가 있지만, challenging task에 대해서는 outperform함!

**DIGIT, Office에 대한 결과**


![](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/15.png)

- Digit의 일부 경우를 제외하고 대부분 outperform한 결과를 보여줌

**Comparsion: BADGE**

- BADGE
    - Clustering in a high-dimensional “gradient-embedding”
    - ∼176k dimensions(C→S with a ResNet34)
- CLUE
    - Clustering in a “hidden embedding “
    - 512-dimensions(C→S with a ResNet34)

⇒ CLUE 대비 high dimension embedding을 사용함에 따라 distance-based diversity가 less meaningful하게 작용했을 가능성


**Comparsion: AADA**

- Domain adaptation 난이도가 증가할수록 CLUE와의 Gap이 커지는 경향을 보임

**종합** 

- Domain shift된 상황에서 optimal label acquisition을 위해서는, model uncertainty & diversity를 함께 고려하는 방법론이 필요하다!

**Feature embedding visualization**


![](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/16.png)


→ round 0 이후 labeling data로 선택된 데이터

- Entropy(uncertainty를 기준) → Boundry 근처에 있는 데이터가 선택되는 양상
- Coreset(diversity를 기준) → 선택된 데이터들의 다양성이 높게 선택되는 양상
- CLUE(compositive) → 두 기준을 혼합하여 다양한 위치에서 적절히 선택되는 양상

**Time complexity** 


C → number of classes


N → number of instances


D → embdding dimensionality 


B → budget 


t → number of clustering iterations


![](/assets/seminars/active-domain-adaptation-via-clustering-uncertainty-weighted-embeddings-iccv-202/17.png)

- Uncertainty & diversity 모두 고려하는 BADGE보다 빠름
- Diversity만 고려하는 coreset과 비슷함

    ⇒ Time complexity 측면에서도 효율적임


## **Conclusion**

- Uncertainty 혹은 diversity를 단일 고려하는 active learning 방법론은 domain shift가 있는 상황에서 적절치 않음
- Feature space level에서 uncertainty weighted clustering 방법을 통해 instance의 uncertainty와 diversity를 모두 고려한 CLUE를 제안함

### Code


```javascript
class CLUESampling(SamplingStrategy):
	"""
	Implements CLUE: CLustering via Uncertainty-weighted Embeddings
	"""
	def __init__(self, dset, train_idx, model, discriminator, device, args, balanced=False):
		super(CLUESampling, self).__init__(dset, train_idx, model, discriminator, device, args)
		self.random_state = np.random.RandomState(1234)
		self.T = self.args.clue_softmax_t

	def query(self, n):
		idxs_unlabeled = np.arange(len(self.train_idx))[~self.idxs_lb]
		train_sampler = ActualSequentialSampler(self.train_idx[idxs_unlabeled]) # 항상 같은 순서로 seqential하게 sampling
		data_loader = torch.utils.data.DataLoader(self.dset, sampler=train_sampler, num_workers=4, \
												  batch_size=self.args.batch_size, drop_last=False)
		self.model.eval()
		
		if self.args.cnn == 'LeNet':
			emb_dim = 500
		elif self.args.cnn == 'ResNet34':
			emb_dim = 512

		
## target instance에 대해서, last layer embedding, label, prediction, penultimative embedding 순으로 추출

		tgt_emb, tgt_lab, tgt_preds, tgt_pen_emb = utils.get_embedding(self.model, data_loader, self.device, self.num_classes, \
																	   self.args, with_emb=True, emb_dim=emb_dim)		
		tgt_pen_emb = tgt_pen_emb.cpu().numpy()
		tgt_scores = nn.Softmax(dim=1)(tgt_emb / self.T)
		tgt_scores += 1e-8
		
		
## Target instance의 entropy를 계산 -> weight 설정

		sample_weights = -(tgt_scores*torch.log(tgt_scores)).sum(1).cpu().numpy()
		
		
## 계산한 weight를 기반으로 weighted K-means clustering 진행

		km = KMeans(n)
		km.fit(tgt_pen_emb, sample_weight=sample_weights)
		
		
## 각 centroid에서의 nearest neighbor에 해당하는 instance를 return

		dists = euclidean_distances(km.cluster_centers_, tgt_pen_emb)
		sort_idxs = dists.argsort(axis=1)
		q_idxs = []
		ax, rem = 0, n
		while rem > 0:
			q_idxs.extend(list(sort_idxs[:, ax][:rem]))
			q_idxs = list(set(q_idxs))
			rem = n-len(q_idxs)
			ax += 1

		return idxs_unlabeled[q_idxs]
```
