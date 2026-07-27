---
date: 2023-10-13
title: DCdetector: Dual Attention Contrastive Representation Learning for Time Series Anomaly Detection (KDD 2023)
category: Paper Review
presenter: Hyejin Cho
url: https://www.notion.so/d781095fb55444249782941872b4f779
keywords: Time-series anomaly detection, Attention, Contrastive learning
---

# Selected Paper


## Title: 


DCdetector: Dual Attention Contrastive Representation Learning for Time Series Anomaly Detection. In Proceedings of the 29th ACM SIGKDD Conference on Knowledge Discovery and Data Mining (KDD '23). Yiyuan Yang, Chaoli Zhang, Tian Zhou, Qingsong Wen, and Liang Sun. 2023.  Association for Computing Machinery, New York, NY, USA, 3033–3045. https://doi.org/10.1145/3580305.3599295


## Abstract: 


Time series anomaly detection is critical for a wide range of applications. It aims to identify deviant samples from the normal sample distribution in time series. The most fundamental challenge for this task is to learn a representation map that enables effective discrimination of anomalies. Reconstruction-based methods still dominate, but the representation learning with anomalies might hurt the performance with its large abnormal loss. On the other hand, contrastive learning aims to find a representation that can clearly distinguish any instance from the others, which can bring a more natural and promising representation for time series anomaly detection. In this paper, we propose DCdetector, a multi-scale dual attention contrastive representation learning model. DCdetector utilizes a novel dual attention asymmetric design to create the permutated environment and pure contrastive loss to guide the learning process, thus learning a permutation invariant representation with superior discrimination abilities. Extensive experiments show that DCdetector achieves state-of-the-art results on multiple time series anomaly detection benchmark datasets. 


# Paper Review


> 💡 Contrastive learning-based의 dual-branch attention structure를 설계하여 normal 과 abnormal 의 representation 차이를 확대하는 permutation invariant representation을 학습


> 💡 두 가지 branch의 유사성을 기반으로 효과적이고 강력한 loss function 을 설계


# Introduction


## Time-series anomaly detection

- 시계열 데이터에서 정상패턴과는 다른 이상치를 탐지
- 주어진 시계열 데이터에 대해, 과거 데이터를 기반으로 t 시점에서의 이상치 여부 예측

## Difficulties of Time-series anomaly detection

- 이상 패턴이 어떤 것인지 밝혀지지 않았기 때문
    - 이상치: 비정상적, 불규칙적, 비일관성
- 이상 징후가 매우 드물어 label 을 얻는 데 많은 노력이 요구됨
- 시계열 데이터에 대해 시간적, 다차원적, 비고정적 특징 고려 필요
    - 다변량: 차원 간 의존성 존재할 수 있음. 통계적 특징 불안정

# Related Work


## Types of anomaly detection model


## Prediction based


![Wong, Lawrence, et al. "AER: Auto-encoder with regression for time series anomaly detection." 2022 IEEE International Conference on Big Data (Big Data). IEEE, 2022.](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/0.png)

- 시계열 데이터에 대한 모델을 학습시켜 다음 값(들)을 예측
- 예측된 값과 실제 값을 비교해 이상징후를 탐지
- 예측값과 실제값의 차이가 특정 threshold 보다 크면 해당 data point 를 anomaly로 간주
- ARIMA(2015), LSTM-DT(2018), FuseAD(2019), STOC(2023)

## Reconstruction-based


![Wong, Lawrence, et al. "AER: Auto-encoder with regression for time series anomaly detection." 2022 IEEE International Conference on Big Data (Big Data). IEEE, 2022.](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/1.png)

- 시계열 데이터를 재구축하도록 모델을 학습
- 재구축 오차를 사용하여 이상 징후를 식별
- 정상적인 data point 는 모델에서 쉽게 재구성할 수 있지만, anomaly는 재구축 오차가 커진다는 개념 활용
- TadGAN(2020), InterFusion(2021), Anomaly Transformer(2022)

⇒ Reconstruction-based:  이상치와 함께 표현을 학습하는 것은 이상 손실이 크기 때문에 성능에 악영향을 미칠 가능성 존재


## Contrastive learning-based

- 데이터 샘플로부터 유사한 또는 다른 표현을 학습하는 목표를 가진 기법
- 본 논문: representation learning 을 위해 사용
- 입력 샘플 간의 **비교**를 통해 학습
- embedding space 상에서 의미적으로 비슷한 sample pair(-positive pair)는 가깝게, 서로 다른 sample들(=negative pair)은 멀게 위치하도록 학습
- supervised / unsupervised 모두 적용 가능
- 특히, unlabeled data를 활용한 self-supervised learning 에서 강한 효과를 보이고 있음
- Reconstruction-based와 다르게 다른 모든 인스턴스와 명확하게 구별할 수 있는 표현을 찾으려고 하며, 시계열 이상 탐지에 대해 더 자연스러운 representation 찾을 수 있음

![같은 이미지에서 나온 이미지 패치는 positive, 다른 이미지에서 나온 이미지 패치는 negative
Chen, Ting, et al. "A simple framework for contrastive learning of visual representations." International conference on machine learning. PMLR, 2020.](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/2.png)


## Anomaly Transformer


![Anomaly Transformer architecture. Anomaly-Attention (left) models the prior-association and series-association simultaneously. In addition to the reconstruction loss, our model is also optimized by the minimax strategy with a specially-designed stop-gradient mechanism (gray arrows) to constrain the prior- and series- associations for more distinguishable association discrepancy.](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/3.png)

- 가정: 이상치는 rare 하기 때문에 전반적인 시계열에 약한 상관관계(연관성, association)를 갖는다. (global)
- 하지만, 이상치는 인접한 영역에 대해서는 강한 상관 관계(연관성, association)을 갖는다 (prior)
- Normal 과 abnormal point 의 association 간의 차이가 있을 것이라고 보고, 이를 연관 불일치(association discrepancy)라고 함.
- 연관 불일치는 각 time point 의 prior association 과 series association 의 distance 로 정의함. 이러한 distance를 통해 계산하는 방식.
- 연관 불일치 값을 효율적으로 추출하기 위해 mini-max 기법을 활용

Xu, Jiehui, et al. "Anomaly transformer: Time series anomaly detection with association discrepancy." _The International Conference on Learning Representations (ICLR) 2022 Spotlight_


## Architecture comparion of three apporaches 


![](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/4.png)


# Methodology


![The workflow of the DCdetector framework. DCdetector consists of four main components: Forward Process module, Dual Attention Contrastive Structure module, Representation Discrepancy module, and Anomaly Criterion module.](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/5.png)


## Forward Process module : Instance Normalization


K : 변수 개수, $T_x$ : input sequence 길이, $T_y$ : output sequence 길이


![](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/6.png)

- 각 변수별로 하나의 sequence에 대해 평균과 분산을 구하여 normalization을 수행
- 이를 통해 sequence 간의 평균과 분산을 일정하게 유지

## Forward Process module : Channel Independence + Patching


![Basic patching attention with channel independence. Each channel in the multivariate time series input is considered as a single time series and divided into patches. Each channel shares the same self-attention network, and the representation results are concatenated as the final output.](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/7.png)

- Channel Independence: parameter 수를 줄이고 overfitting 문제를 줄이기 위한 목적
    - 각 채널이 동일한 임베딩과 Transformer 가중치를 공유
    - attention map 의 계산, 메모리 사용량 감소
- Patching: 시계열의 하나하나의 시점을 인풋으로 사용하는 것 대신 패치 단위로 나눠 각 패치가 하나의 토큰이 되도록
    - 하나의 시계열에 대해 patch 단위로 쪼갬.
    - input  $\chi^i \in \mathbb{R}^{1\times T}$ 이 주어지면, $\chi^i$ 에 sliding window 방식 적용(일정 간격으로 이동). P 길이의 sub-series patch N개로 구성된 patch sequence $\chi_p^i \in \mathbb{R}^{P\times N}$ 을 생성
    - P: 패치 길이, N: 패치 개수, d: 패치의 차원수

![](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/8.png)


because of the channnel independence, 차원 d는 batch 로 빠지게 됨.



$$
\chi \in \mathbb{R}^{P\times N \times d}   \rightarrow \chi \in \mathbb{R}^{P\times N}
$$



That is,



$$
\chi\prime \in \mathbb{R}^{B \times P\times N \times d}   \rightarrow \chi\prime \in \mathbb{R}^{(B \times d) \times P\times N}
$$



## Dual Attention


![](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/9.png)

- Dual Attention 통한 두 가지의 representation 도출
- patch-wise 와 in-patch attention 은 서로 weight 을 share

### Patch-wise representation


### In-patch representation 

- Input shape


$$
\chi \in \mathbb{R}^{P\times N}   \rightarrow \chi \in \mathbb{R}^{N\times P}
$$


- Initialized the query and key


$$
Q_{\Nu_i}, K_{\Nu_i} = W_{Q_i}\Chi_{\Nu_i}, W_{K_i}\Chi_{\Nu_i} \quad\quad 1\leq i \leq H
$$


- Compute the attention weights


$$
Attn_{\Nu_i} = Softmax(\frac{Q_{\Nu_i} K_{\Nu_i}^T}{d_{model}})
$$


- Contact the multi-head and get the final patch-wise representation

    
$$
Attn_{\Nu}=Concat(Attn_{\Nu_1}, \dots,Attn_{\Nu_H})W_N^O
$$
    

- Input shape


$$
\chi \in \mathbb{R}^{P\times N}
$$


- Initialized the query and key


$$
Q_{P_i}, K_{P_i} = W_{Q_i}\Chi_{P_i}, W_{K_i}\Chi_{P_i} \quad\quad 1\leq i \leq H
$$


- Compute the attention weights


$$
Attn_{P_i} = Softmax(\frac{Q_{P_i} K_{P_i}^T}{d_{model}})
$$


- Contact the multi-head and get the final patch-wise representation


$$
Attn_{P} = Concat(Attn_{P_1}, \dots,Attn_{P_H})W_P^O
$$



⇒ **같은 input을 가지고 있지만 view가 서로 다르다!**


## Up-sampling and Multi-scale Design

- 두 representation 간 output shape 을 맞춰줘야 함.
- Patch-wise attention 은 patch 내의 point 간의 관련성을 무시함.
- In-patch attention은 patch 간의 관련성을 무시
- 업샘플링 및 멀티 스케일 설계를 통해 원본 데이터의 정보를 더 잘 보존하면서 표현을 개선


$$
N = \sum_{Patch\,list} Upsampling(Attn_N)
$$




$$
P = \sum_{Patch\,list} Upsampling(Attn_P)
$$



![A simple example of how up-sampling is done. For patch-wise branch, repeating is done in patches (from patch to points). For in-patch branch, repeating is done from "one" patch to a full number of patches (from points to patches).](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/10.png)


## Constrative learning


![](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/11.png)

- 동일한 시계열을 두 가지 다른 view 로 표현
- Normal point는 permutations 하에서 representation 을 유지할 수 있지만, anomalies 는 그렇지 못하다는 것

    ⇒ **permutation invariant representation**


## Code Implementation : DCdetector Framework

<details>
<summary>Class Encoder in model.py</summary>

```python
class Encoder(nn.Module):
    def __init__(self, attn_layers, norm_layer=None):
        super(Encoder, self).__init__()
        self.attn_layers = nn.ModuleList(attn_layers)
        self.norm = norm_layer

    def forward(self, x_patch_size, x_patch_num, x_ori, patch_index, attn_mask=None):
        series_list = []
        prior_list = []
        for attn_layer in self.attn_layers:
            series, prior = attn_layer(x_patch_size, x_patch_num, x_ori, patch_index, attn_mask=attn_mask)
            series_list.append(series)
            prior_list.append(prior)
        return series_list, prior_list
```


**`Encoder`** 클래스는 여러 **`AttentionLayer`** 레이어로 구성된 인코더를 정의. 이 인코더는 각 **`AttentionLayer`**를 반복적으로 호출하고 그 결과를 반환


</details>

<details>
<summary>class DCdetector(nn.Module) : Patching and Call Dual Attention Encoder </summary>

```python
class DCdetector(nn.Module):
    def __init__(self, win_size, enc_in, c_out, n_heads=1, d_model=256, e_layers=3, patch_size=[3,5,7], channel=55, d_ff=512, dropout=0.0, activation='gelu', output_attention=True):
        super(DCdetector, self).__init__()
        self.output_attention = output_attention
        self.patch_size = patch_size
        self.channel = channel
        self.win_size = win_size
				# Patching List  
        self.embedding_patch_size = nn.ModuleList()
        self.embedding_patch_num = nn.ModuleList()
        for i, patchsize in enumerate(self.patch_size):
            self.embedding_patch_size.append(DataEmbedding(patchsize, d_model, dropout))
            self.embedding_patch_num.append(DataEmbedding(self.win_size//patchsize, d_model, dropout))

        self.embedding_window_size = DataEmbedding(enc_in, d_model, dropout)
				# Dual Attention Encoder
        self.encoder = Encoder(
            [
                AttentionLayer(
                    DAC_structure(win_size, patch_size, channel, False, attention_dropout=dropout, output_attention=output_attention),
                    d_model, patch_size, channel, n_heads, win_size)for l in range(e_layers)
            ],
            norm_layer=torch.nn.LayerNorm(d_model)
        )
				#Linear projection layer for final output. This layer does class prediction 
				self.projection = nn.Linear(d_model, c_out, bias=True)
```

- **`DCdetector`** 클래스는 Dual Attention Convolutional Detector 모델을 정의. 이 모델의 하이퍼파라미터와 구조를 설정
- Patching List : 입력 데이터를 다양한 패치 크기로 분할하기 위한 임베딩 레이어들을 정의.
- **`DCdetector`** 모델의 핵심: **`encoder`** 레이어로 구성된 Encoder.  **`AttentionLayer`** 레이어를 여러 번 중첩하여 사용하며, 이를 **`Encoder`** 클래스로 감싸고 있음.

</details>

<details>
<summary>DAC_structure (DAC (Dual-Attention Convolutional)) implementation</summary>

```python
class DAC_structure(nn.Module):
	def forward(self, queries_patch_size, queries_patch_num, keys_patch_size, keys_patch_num, values, patch_index, attn_mask):
				# Patch-wise Representation
				# 입력된 queries_patch_size와 keys_patch_size를 이용하여 어텐션 계산
				# 어텐션 스코어를 계산, 스케일링 및 소프트맥스를 적용
				B, L, H, E = queries_patch_size.shape
        scale_patch_size = self.scale or 1. / sqrt(E)
        scores_patch_size = torch.einsum("blhe,bshe->bhls", queries_patch_size, keys_patch_size)
        attn_patch_size = scale_patch_size * scores_patch_size
        series_patch_size = self.dropout(torch.softmax(attn_patch_size, dim=-1))
				
				# In-patch Representation
				#입력된 queries_patch_num와 keys_patch_num을 이용하여 어텐션 계산
				B, L, H, E = queries_patch_num.shape #batch_size*channel, patch_size, n_head, d_model/n_head
        scale_patch_num = self.scale or 1. / sqrt(E)
        scores_patch_num = torch.einsum("blhe,bshe->bhls", queries_patch_num, keys_patch_num) #batch*ch, nheads, p_size, p_size 
        attn_patch_num = scale_patch_num * scores_patch_num
        series_patch_num = self.dropout(torch.softmax(attn_patch_num, dim=-1)) # B*D_model H S S	

				# Upsampling
				#크기 조절
        series_patch_size = repeat(series_patch_size, 'b l m n -> b l (m repeat_m) (n repeat_n)', repeat_m=self.patch_size[patch_index], repeat_n=self.patch_size[patch_index])    
        series_patch_num = series_patch_num.repeat(1,1,self.window_size//self.patch_size[patch_index],self.window_size//self.patch_size[patch_index]) 
        #Patch-wise의 attention 과 in-patch attention 의 평균 계산
				series_patch_size = reduce(series_patch_size, '(b reduce_b) l m n-> b l m n', 'mean', reduce_b=self.channel)
        series_patch_num = reduce(series_patch_num, '(b reduce_b) l m n-> b l m n', 'mean', reduce_b=self.channel)
```


</details>

<details>
<summary>AttentionLayer</summary>
- **`AttentionLayer`** 클래스는 주어진 어텐션 구조(**`DAC_structure`**)를 활용하여 어텐션 계산을 수행
- 패치 크기(**`x_patch_size`**)와 패치 개수(**`x_patch_num`**)에 대한 어텐션을 계산하고, 이를 통합하여 결과를 반환
- **`AttentionLayer`**는 입력 데이터에 대한 어텐션 정보를 계산하고 이를 **`DCdetector`** 모델의 다른 부분에 전달

</details>


## Loss function



$$
L \{ P, N; X\} = \frac{1}{2}D(P,Stopgrad(N)) + \frac{1}{2}D(N, Stopgrad(P))
$$


- 두 가지 branch 를 비동기적으로 학습하기 위해 **stop-gradient** 연산 사용
- KL divergence distance을 기반으로 하는 similarity metric D, $D(P.N) = KL(P||N)$
<details>
<summary>KL divergence distance implementation</summary>

```python
def my_kl_loss(p, q):
    res = p * (torch.log(p + 0.0001) - torch.log(q + 0.0001))
    return torch.mean(torch.sum(res, dim=-1), dim=1)
```


</details>


### Stop gradient

- SimSiam 에서 model collapse 를 방지하기 위해 사용한 stop gradient 방식을 사용
    - In SimSiam, 모델의 두 branch가 완전한 대칭

![Chen, Xinlei, and Kaiming He. "SimSiam: Exploring simple siamese representation learning." Proceedings of the IEEE/CVF conference on computer vision and pattern recognition. 2021.](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/12.png)

- 현재 patch-wise, In-patch brench 는 서로 비대칭. 굳이 stop-gradient 사용하지 않아도 모델 붕괴가 일어나지는 않음.  stop gradient 사용 시 더 좋은 성능 발휘
<details>
<summary> [Solver.py](http://solver.py/) loss function implementation</summary>

```python
class Solver(object): #학습 및 테스트를 관리하는 주요 클래스
	...
	def build_model(self):
	        self.model = DCdetector(win_size=self.win_size, enc_in=self.input_c, c_out=self.output_c, n_heads=self.n_heads, d_model=self.d_model, e_layers=self.e_layers, patch_size=self.patch_size, channel=self.input_c
	        self.optimizer = torch.optim.Adam(self.model.parameters(), lr=self.lr)
...
	def train(self):
	        for epoch in range(self.num_epochs):
	            iter_count = 0
	
	            epoch_time = time.time()
	            self.model.train()
	            for i, (input_data, labels) in enumerate(self.train_loader):
	
	                self.optimizer.zero_grad()
	                iter_count += 1
	                input = input_data.float().to(self.device)
	                series, prior = self.model(input)
	                
	                series_loss = 0.0
	                prior_loss = 0.0
	
	                for u in range(len(prior)):
	                    series_loss += (torch.mean(my_kl_loss(series[u], (
	                            prior[u] / torch.unsqueeze(torch.sum(prior[u], dim=-1), dim=-1).repeat(1, 1, 1,
	                                                                                                   self.win_size)).detach())) + torch.mean(
	                        my_kl_loss((prior[u] / torch.unsqueeze(torch.sum(prior[u], dim=-1), dim=-1).repeat(1, 1, 1,
	                                                                                                           self.win_size)).detach(),
	                                   series[u])))
	                    prior_loss += (torch.mean(my_kl_loss(
	                        (prior[u] / torch.unsqueeze(torch.sum(prior[u], dim=-1), dim=-1).repeat(1, 1, 1,
	                                                                                                self.win_size)),
	                        series[u].detach())) + torch.mean(
	                        my_kl_loss(series[u].detach(), (
	                                prior[u] / torch.unsqueeze(torch.sum(prior[u], dim=-1), dim=-1).repeat(1, 1, 1,
	                                                                                                       self.win_size)))))
	
	                series_loss = series_loss / len(prior)
	                prior_loss = prior_loss / len(prior)
	
	                loss = prior_loss - series_loss 
	                loss.backward()
	                self.optimizer.step()
	
	            vali_loss1, vali_loss2 = self.vali(self.test_loader)
	
	            print(
	                "Epoch: {0}, Cost time: {1:.3f}s ".format(
	                    epoch + 1, time.time() - epoch_time))
	            early_stopping(vali_loss1, vali_loss2, self.model, path)
	            if early_stopping.early_stop:
	                break
	            adjust_learning_rate(self.optimizer, epoch + 1, self.lr)
```


 **`detach()`** 함수:  **`series`** 및 **`prior`**의 그래디언트 역전파를 막으며 **`stop gradient`**의 역할. 손실을 계산할 때 **`series`** 및 **`prior`**의 그래디언트가 서로 간섭하지 않도록 함.


모델을 검증하고 손실 값을 반환. 모델을 평가하면서 series 및 prior(Attention 가중치)의 KL 손실을 계산하고 이를 저장.이후 평균 손실 값을 반환


</details>


## The final anomaly score



$$
AnomalyScore(X) = \frac{1}{2}D(P,N) + \frac{1}{2}D(N, P)
$$




$$
output \; y_i = \begin{Bmatrix}1:anomaly \quad AnomalyScore(X_i)\geq \delta\\0:normal \quad AnomalyScore(X_i) \leq \delta \end{Bmatrix}
$$



# Experiments


Baselines

- Reconstruction-based
    - AutoEncoder, LSTM-VAE, OmniAnomaly, BeatGAN, InterFusion, Anomaly Transformer
- Autoregression-based
    - VAR, Autoregression, LSTM-RNN, LSTM, CL-MPPCA
- Density-estimation
    - LOF, MPPCACD, DAGMM
- Clustering-based
    - DeepSVDD, THOC, ITAD
- Classic
    - OCSVM, OCSVM-based subsequence clustering(OCSVM*), IForest, IForest-based subsequence clustering(IForest*), Gradient boosting regression(GBRT)
- Change point detection and time series segmentation
    - BOCPD, U-Time, TS-CP2

Datasets

- 총 7개 datasets

![](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/13.png)


![The P, R and F1 are the precision, recall and F1-score. All results are in %, the best ones are in Bold, and the second ones are underlined.](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/14.png)


![Multi-metrics results on real-world multivariate datasets. Aff-P and Aff-R are the precision and recall of affiliation metric [31], respectively. R_A_R and R_A_P are Range-AUC-ROC and Range-AUC-PR [49], which denote two scores based on label transformation under ROC curve and PR curve, respectively. V_ROC and V_RR are volumes under the surfaces created based on ROC curve and PR curve [49],respectively. All results are in %, and the best ones are in Bold.](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/15.png)


![](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/16.png)

- 광범위한 window size(30~210) 에서 견고
- Multi-scale size 는 최종 성능에 기여, patch size 조합에 따라 성능 달라짐
- Attention head 수와 model 의 dimension 의 크기가 작을 때 좋은 성능 달성

![](/assets/seminars/dcdetector-dual-attention-contrastive-representation-learning-for-time-series-an/17.png)

- $d_{model} = 256$ 에서도 효율적인 실행 시간, 적은 메모리 사용으로도 잘 작동
