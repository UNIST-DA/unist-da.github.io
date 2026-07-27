---
date: 2025-12-15
title: Reversible instance normalization for accurate time-series forecasting against distribution shift
category: Paper Review
presenter: SeungSu Kam
url: https://www.notion.so/2c4046396f7e806bb025d114b98d780c
keywords: time-series forecasting
---

# Selected Paper


## Title: Reversible instance normalization for accurate time-series forecasting against distribution shift." _International conference on learning representations_. 2021



## Abstract: 


Statistical properties such as mean and variance often change over time in time series, i.e., time-series data suffer from a distribution shift problem. This change in temporal distribution is one of the main challenges that prevent accurate timeseries forecasting. To address this issue, we propose a simple yet effective normalization method called reversible instance normalization (RevIN), a generally applicable normalization-and-denormalization method with learnable affine transformation. The proposed method is symmetrically structured to remove and restore the statistical information of a time-series instance, leading to significant performance improvements in time-series forecasting, as shown in Fig. 1. We demonstrate the effectiveness of RevIN via extensive quantitative and qualitative analyses on various real-world datasets, addressing the distribution shift problem.

- Statistical properties are  change over time in time series
- paper propose a simple yet effective normalization which is normalization-and-denormalization method with learnable affine transformation.
- address the distribution shift problem in time series

## Link



[📄 자료 링크 ↗](https://openreview.net/pdf?id=cGDAkQo1C0p)



# Paper Review


## Time-series data distribution shift


![](/assets/seminars/reversible-instance-normalization-for-accurate-time-series-forecasting-against-d/0.png)


![Wu et al,. 2025](/assets/seminars/reversible-instance-normalization-for-accurate-time-series-forecasting-against-d/1.png)

1. Temporal covariate shift $P(X)$
2. Event-based covariate shift $P(X)$
3. Concept Drift $P(Y|X)$

### Out-of-Distribution generalization

- **model’s ability to maintain good performance on data drawn from distributions that differ from trainset**

### A research roadmap of representative methods for TS-OOG


![Wu et al,. 2025](/assets/seminars/reversible-instance-normalization-for-accurate-time-series-forecasting-against-d/2.png)


### Invariant-based Methods

- focuses on **extracting features that remain invariant across different domains**

### Domain adaptation


![](/assets/seminars/reversible-instance-normalization-for-accurate-time-series-forecasting-against-d/3.png)

- attempts to reduce the distribution gap between source and target domains

⇒ Known Target


> 💡 갤럭시s20 카메라 화질 분포를 아이폰17 카메라 화질 분포로 맞추는것


### Domain generalization


![](/assets/seminars/reversible-instance-normalization-for-accurate-time-series-forecasting-against-d/4.png)

- only relies on the source domain and hopes to generalize on the target domain

⇒ Unknown Target


> 💡 여러 스마트폰 카메라 화질 분포를 학습해 이후에 신형 스마트폰 카메라 화질 분포에도 잘 작동하게 하는것


> 💡 **Limiation**  
> defining a domain **is not straightforward** in non-stationary time series since the data distribution shifts over time


## RevIN(Reversible Instance Normalization)


### Stationary time series:


![](/assets/seminars/reversible-instance-normalization-for-accurate-time-series-forecasting-against-d/5.png)

- have distribution consistency

### Non Stationary time series:


![](/assets/seminars/reversible-instance-normalization-for-accurate-time-series-forecasting-against-d/6.png)

- have non-distribution consistency


$$
\mathcal{X} = \{ x^{(i)} \}_{i=1}^{N}, \\ \mathcal{Y} = \{ y^{(i)} \}_{i=1}^{N},
$$


- $N, K, T_x, T_y$: number of sequecne, feature, input sequence length, output sequence length

![](/assets/seminars/reversible-instance-normalization-for-accurate-time-series-forecasting-against-d/7.png)



$$
\mathbb{E}_t\big[x^{(i)}_{kt}\big]= \frac{1}{T_x} \sum_{j=1}^{T_x} x^{(i)}_{kj},
$$




$$
\operatorname{Var}\big[x^{(i)}_{kt}\big]= \frac{1}{T_x} \sum_{j=1}^{T_x}\Big( x^{(i)}_{kj} - \mathbb{E}_t[x^{(i)}_{kt}] \Big)^2.
$$



> 💡 Reducing non-stantionary proerties


### RevIN Normalization



$$
\hat{x}^{(i)}_{kt}= \gamma_k \,\frac{x^{(i)}_{kt} - \mathbb{E}_t[x^{(i)}_{kt}]}{\sqrt{\operatorname{Var}[x^{(i)}_{kt}] + \epsilon}}+ \beta_k,
$$



$\gamma, \beta$: learnable affine parameter vectors


### RevIN Denormalization



$$
\hat{y}^{(i)}_{kt}= \sqrt{\operatorname{Var}\big[x^{(i)}_{kt}\big] + \epsilon}\cdot\frac{\tilde{y}^{(i)}_{kt} - \beta_k}{\gamma_k}+ \mathbb{E}_t\big[x^{(i)}_{kt}\big].
$$



**Procedure**



$$
x^{(i)}_{kt} \xrightarrow[\text{norm}]{} \hat{x}^{(i)}_{kt} \xrightarrow[\text{model}]{} \tilde{y}^{(i)}_{kt} \xrightarrow[\text{denorm}]{} \hat{y}^{(i)}_{kt}
$$



## Results


![](/assets/seminars/reversible-instance-normalization-for-accurate-time-series-forecasting-against-d/8.png)


![](/assets/seminars/reversible-instance-normalization-for-accurate-time-series-forecasting-against-d/9.png)


### Dataset

1. Electricity transformer temperature (ETT) h1
2. Electricity transformer temperature (ETT) h2
3. Electricity transformer temperature (ETT) m1
    1. power load features and oil temperature
4. Electricity Consuming Load (ECL)
    1. electricity consumption (kWh) collected from 321 clients

![](/assets/seminars/reversible-instance-normalization-for-accurate-time-series-forecasting-against-d/10.png)


![](/assets/seminars/reversible-instance-normalization-for-accurate-time-series-forecasting-against-d/11.png)


> 💡 RevIN makes the baseline model more robust to prediction length


![](/assets/seminars/reversible-instance-normalization-for-accurate-time-series-forecasting-against-d/12.png)


### 실제 결과 


| Informer | MSE   | MAE+ RevIN |
| -------- | ----- | ---------- |
| ETTh1    | 1.386 | 0.9500     |
| ETTh2    | 3.77  | 1.701      |


| Informer + RevIN | MSE       | MAE        |
| ---------------- | --------- | ---------- |
| ETTh1            | **1.075** | **0.794**  |
| ETTh2            | **0.622** | **0.5819** |


```python
import torch
import torch.nn as nn
import torch.nn.functional as F

from utils.masking import TriangularCausalMask, ProbMask
from models.encoder import Encoder, EncoderLayer, ConvLayer, EncoderStack
from models.decoder import Decoder, DecoderLayer
from models.attn import FullAttention, ProbAttention, AttentionLayer
from models.embed import DataEmbedding

import sys
sys.path.append('../../')
from RevIN import RevIN


class Informer(nn.Module):
    def __init__(self, enc_in, dec_in, c_out, seq_len, label_len, out_len, 
                factor=5, d_model=512, n_heads=8, e_layers=3, d_layers=2, d_ff=512, 
                dropout=0.0, attn='prob', embed='fixed', freq='h', activation='gelu', 
                output_attention = False, distil=True, mix=True,
                device=torch.device('cuda:0'),
                use_RevIN=False):
        super(Informer, self).__init__()
        self.pred_len = out_len
        self.attn = attn
        self.output_attention = output_attention

        # Encoding
        self.enc_embedding = DataEmbedding(enc_in, d_model, embed, freq, dropout)
        self.dec_embedding = DataEmbedding(dec_in, d_model, embed, freq, dropout)
        # Attention
        Attn = ProbAttention if attn=='prob' else FullAttention
        # Encoder
        self.encoder = Encoder(
            [
                EncoderLayer(
                    AttentionLayer(Attn(False, factor, attention_dropout=dropout, output_attention=output_attention), 
                                d_model, n_heads, mix=False),
                    d_model,
                    d_ff,
                    dropout=dropout,
                    activation=activation
                ) for l in range(e_layers)
            ],
            [
                ConvLayer(
                    d_model
                ) for l in range(e_layers-1)
            ] if distil else None,
            norm_layer=torch.nn.LayerNorm(d_model)
        )
        # Decoder
        self.decoder = Decoder(
            [
                DecoderLayer(
                    AttentionLayer(Attn(True, factor, attention_dropout=dropout, output_attention=False), 
                                d_model, n_heads, mix=mix),
                    AttentionLayer(FullAttention(False, factor, attention_dropout=dropout, output_attention=False), 
                                d_model, n_heads, mix=False),
                    d_model,
                    d_ff,
                    dropout=dropout,
                    activation=activation,
                )
                for l in range(d_layers)
            ],
            norm_layer=torch.nn.LayerNorm(d_model)
        )
        # self.end_conv1 = nn.Conv1d(in_channels=label_len+out_len, out_channels=out_len, kernel_size=1, bias=True)
        # self.end_conv2 = nn.Conv1d(in_channels=d_model, out_channels=c_out, kernel_size=1, bias=True)
        self.projection = nn.Linear(d_model, c_out, bias=True)

        self.use_RevIN = use_RevIN
        if use_RevIN:
            self.revin = RevIN(enc_in)
        
    def forward(self, x_enc, x_mark_enc, x_dec, x_mark_dec, 
                enc_self_mask=None, dec_self_mask=None, dec_enc_mask=None):
   
     if self.use_RevIN:
            x_enc = self.revin(x_enc, 'norm')

        enc_out = self.enc_embedding(x_enc, x_mark_enc)
        enc_out, attns = self.encoder(enc_out, attn_mask=enc_self_mask)

        dec_out = self.dec_embedding(x_dec, x_mark_dec)
        dec_out = self.decoder(dec_out, enc_out, x_mask=dec_self_mask, cross_mask=dec_enc_mask)
        dec_out = self.projection(dec_out)
        
        # dec_out = self.end_conv1(dec_out)
        # dec_out = self.end_conv2(dec_out.transpose(2,1)).transpose(1,2)

        if self.use_RevIN:
            dec_out = self.revin(dec_out, 'denorm')


        if self.output_attention:
            return dec_out[:,-self.pred_len:,:], attns
        else:
            return dec_out[:,-self.pred_len:,:] # [B, L, D]
```


```python
class RevIN(nn.Module):
    def __init__(self, num_features: int, eps=1e-5, affine=True):
        """
        :param num_features: the number of features or channels
        :param eps: a value added for numerical stability
        :param affine: if True, RevIN has learnable affine parameters
        """
        super(RevIN, self).__init__()
        self.num_features = num_features
        self.eps = eps
        self.affine = affine
        if self.affine:
            self._init_params()

    def forward(self, x, mode:str):
        if mode == 'norm':
            self._get_statistics(x)
            x = self._normalize(x)
        elif mode == 'denorm':
            x = self._denormalize(x)
        else: raise NotImplementedError
        return x

    def _init_params(self):
        # initialize RevIN params: (C,)
        self.affine_weight = nn.Parameter(torch.ones(self.num_features))
        self.affine_bias = nn.Parameter(torch.zeros(self.num_features))

    def _get_statistics(self, x):
        dim2reduce = tuple(range(1, x.ndim-1))
        self.mean = torch.mean(x, dim=dim2reduce, keepdim=True).detach()
        self.stdev = torch.sqrt(torch.var(x, dim=dim2reduce, keepdim=True, unbiased=False) + self.eps).detach()

    def _normalize(self, x):
        x = x - self.mean
        x = x / self.stdev
        if self.affine:
            x = x * self.affine_weight
            x = x + self.affine_bias
        return x

    def _denormalize(self, x):
        if self.affine:
            x = x - self.affine_bias
            x = x / (self.affine_weight + self.eps*self.eps)
        x = x * self.stdev
        x = x + self.mean
        return x
```


## Applied

- 갑상선 호르몬 예측 문제
- 과거 상태에 따른 다음 시점 갑상선 호르몬 예측 모델 구성
    - ODE-RNN 사용 (Auto-regressive)
- Training
    - t=0 상태 값 + 복용량 → t=1 호르몬 예측값
    - 실제 (t= 1) 호르몬 예측값 + 현재(t=1)  상태값 + 복용량 → 다음 (t=2) 호르몬 예측값
- Test
    - t=0 상태 값  + 복용량 → t=1 호르몬 예측값
    - t=1 호르몬 예측값 + 현재(t=1) 상태값  + 복용량 → 다음  (t=2) 호르몬 예측값
- 결과

![no revin: mse: 3.2616, mae: 1.22](/assets/seminars/reversible-instance-normalization-for-accurate-time-series-forecasting-against-d/13.png)


![revin mse: 2.17, mae: 1.10](/assets/seminars/reversible-instance-normalization-for-accurate-time-series-forecasting-against-d/14.png)


# Conclusion

- reversible instance normalization aims to address the distribution shift problem in time series
- proposed approach effectively alleviates the discrepancy between training and test data distributions
- achieves state-of-the-art performance on seven real-world time-series datasets by a significant margin

### Appendix


![](/assets/seminars/reversible-instance-normalization-for-accurate-time-series-forecasting-against-d/15.png)


# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
