---
date: 2024-05-24
title: ITRANSFORMER: Inverted Transformers Are Effective for Time Series Forecasting (ICLR, 2024)
category: Paper Review
presenter: SeungSu Kam
url: https://www.notion.so/ce64ff05edfb418d887814bc3781424b
keywords: Transformer, time-series forecasting
---

# Selected Paper


## Title: **ITRANSFORMER: Inverted Transformers Are Effective for Time Series Forecasting**


ICLR 2024


## Abstract: 


The recent boom of linear forecasting models questions the ongoing passion for architectural modifications of Transformer-based forecasters. These forecasters leverage Transformers to model the global dependencies over temporal tokens of time series, with each token formed by multiple variates of the same timestamp. However, Transformers are challenged in forecasting series with larger lookback windows due to performance degradation and computation explosion. Besides, the embedding for each temporal token fuses multiple variates that represent potential delayed events and distinct physical measurements, which may fail in learning variate-centric representations and result in meaningless attention maps. In this work, we reflect on the competent duties of Transformer components and repurpose the Transformer architecture without any modification to the basic components. We propose iTransformer that simply applies the attention and feed-forward network on the inverted dimensions. Specifically, the time points of individual series are embedded into variate tokens which are utilized by the attention mechanism to capture multivariate correlations; meanwhile, the feed-forward network is applied for each variate token to learn nonlinear representations. The iTransformer model achieves state-of-the-art on challenging real-world datasets, which further empowers the Transformer family with promoted performance, generalization ability across different variates, and better utilization of arbitrary lookback windows, making it a nice alternative as the fundamental backbone of time series forecasting. Code is available at this repository: [https://github.com/thuml/iTransformer](https://github.com/thuml/iTransformer).


## Link



[📄 자료 링크 ↗](https://arxiv.org/pdf/2310.06625)



# Paper Review


# Transformer is Everywhere


### What is Transformer?


![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/0.png)

- **Transformer** is the basis of the current dominant methodology in NLP and is the methodology used after RNN, LSTM and seq2seq.
- The **existing seq2seq model** is bottlenecked by **compressing the source** sentence information in the **context vector v**, resulting in **poor performance.**

![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/1.png)


## Transformer Structure


![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/2.png)


![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/3.png)

- Transformer receives information from encoders and produces an output by a decoders.

## Encoder Structure


![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/4.png)


## Self Attention Structure


![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/5.png)

- Self-Attention is the similarity value of each of the inputs in terms of how they relate to each other.

![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/6.png)


![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/7.png)

- Obtain Q-vector, K-vector, and V-vector from each word vector to perform self attention.
- Each Q-vector will get an attentional score for every K-vector, get an attention distribution,
- Use attention distribution to weight all V-vectors to get an attentional value or context vector.

# Transformer in Time-series


![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/8.png)

- Transformer (Vaswani et al., 2017) has achieved tremendous success in **natural language processing** (Brown et al., 2020) and **computer vision** (Dosovitskiy et al., 2021).
- Because of depicting pairwise dependencies and extracting multi-level representations in sequences **Transformer is emerging in time series forecasting**

    ![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/9.png)


**Autoformer, Informer**

- component adaptation
- attention module for the temporal dependency modeling
- the complexity optimization on  long sequences

⇒ **Lower** performance than **linear forecasters**


**PatchTST, NSTransformer**

- pays more attention to the inherent processing of time series
    - Segmenting a time series into sub-time series patches and using them as input tokens for Transformers
    - increasing significance of the **independence** and mutual interactions of **multiple variates**

**Crossformer**

- Embedding MTS as a 2D Vector array (To capture dependencies between variables)
- Renovated attention mechanism and architecture.

### **Limitation**

- **Embed multiple variates of the same timestamp** into indistinguishable channels and apply attention on these **temporal tokens to capture temporal dependencies.**
- **Simple linear layers**, which can be traced back to statistical forecasters (Box & Jenkins, 1968), have **exceeded complicated Transformers on both performance and efficiency**

# What is the Proper Transformer Structure in Time-Series Data?


![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/10.png)

- **Points of the same time step** that basically represent **completely different physical meanings** recorded by **inconsistent measurements** are embedded **into one token** with wiped-out multivariate correlations.
- **Token formed by a single time step** can struggle to reveal beneficial information due to excessively **local receptive field** and **time-unaligned events** represented by simultaneous time points.
- **Series variations** can be greatly influenced by the **sequence order**, permutation-invariant
attention mechanisms are improperly adopted on the **temporal dimension**

⇒ Hard to capture essential series representations and portray multivariate correlations, limiting its capacity and generalization ability on diverse time series data.


![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/11.png)


**Inverted View**: Embed the whole time series of each variate independently into a (variate) token

- the embedded token aggregates the global representations of series that can be more variate-centric
- better leveraged by booming attention mechanisms for multivariate correlating

⇒ Using Attention, FFNN  to capture multivariate dependency and temporal dependency 


![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/12.png)


![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/13.png)


Historical observations: $\mathbf{X}=\left\{\mathbf{x}_1, \ldots, \mathbf{x}_T\right\} \in \mathbb{R}^{T \times N}$ _with_ $T$ _time steps and_ $N$ _variates_


_Future_ $S$ _time steps_ $\mathbf{Y}=\left\{\mathbf{x}_{T+1}, \ldots, \mathbf{x}_{T+S}\right\} \in$\mathbb{R}^{S \times N}$


$\mathbf{X}_{t,:}$ : _simultaneously recorded time points at the step_ $t$


$\mathbf{X}_{:, n}$: whole time series of each variate indexed by $n$. 


![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/14.png)

- Attention doesn't work well with time series (increasing applications of Patching)
- Given the high performance of linear forecasters, there is no need to use heavy models


$$
\begin{aligned}\mathbf{h}_n^0 & =\operatorname{Embedding}\left(\mathbf{X}_{:, n}\right), \\\mathbf{H}^{l+1} & =\operatorname{TrmBlock}\left(\mathbf{H}^l\right), l=0, \ldots, L-1, \\\hat{\mathbf{Y}}_{:, n} & =\operatorname{Projection}\left(\mathbf{h}_n^L\right),\end{aligned}
$$



![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/15.png)


### Self Attention

- generally adopted for facilitating the **temporal dependencies modeling.**

**Inverted version ⇒ regards the whole series of one variate as an independent process**


![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/16.png)

- highly correlated variate will be more weighted for the next representation interaction with values V

### Feed-Forward Neural Network

- multiple variates of the same timestamp that form the token can be malpositioned and too localized to reveal enough information for predictions

**Inverted version ⇒ FFN is leveraged on the series representation of each variate token**


![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/17.png)

- MLP are taught to portray the intrinsic properties of any time series, such as the amplitude, periodicity, and even frequency spectrums

### Layer Normalization

- In typical Transformer-based forecasters, the module normalizes the multivariate representation of the same timestamp, gradually fusing the variates with each other

**Inverted version ⇒ applied to the series representation of individual variate**


![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/18.png)



$$
\operatorname{LayerNorm}(\mathbf{H})=\left\{\left.\frac{\mathbf{h}_n-\operatorname{Mean}\left(\mathbf{h}_n\right)}{\sqrt{\operatorname{Var}\left(\mathbf{h}_n\right)}} \right\rvert\, n=1, \ldots, N\right\}
$$



![](/assets/seminars/itransformer-inverted-transformers-are-effective-for-time-series-forecasting-icl/19.png)


# Conclusion

- Pioneering a new direction in time series transformers
- Propose iTransformer that regards independent time series as tokens to capture multivariate
correlations by self-attention
- Utilize layer normalization and feed-forward network modules to learn better series-global representations for time series forecasting
- Achieves comprehensive state-of-the-art on real-world benchmarks.

# Code


### iTransformer Model


```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from layers.Transformer_EncDec import Encoder, EncoderLayer
from layers.SelfAttention_Family import FullAttention, AttentionLayer
from layers.Embed import DataEmbedding_inverted
import numpy as np


class Model(nn.Module):
    """
    Paper link: https://arxiv.org/abs/2310.06625
    """

    def __init__(self, configs):
        super(Model, self).__init__()
        self.seq_len = configs.seq_len
        self.pred_len = configs.pred_len
        self.output_attention = configs.output_attention
        self.use_norm = configs.use_norm
        # Embedding
        self.enc_embedding = DataEmbedding_inverted(configs.seq_len, configs.d_model, configs.embed, configs.freq,
                                                    configs.dropout)
        self.class_strategy = configs.class_strategy
        # Encoder-only architecture
        self.encoder = Encoder(
            [
                EncoderLayer(
                    AttentionLayer(
                        FullAttention(False, configs.factor, attention_dropout=configs.dropout,
                                      output_attention=configs.output_attention), configs.d_model, configs.n_heads),
                    configs.d_model,
                    configs.d_ff,
                    dropout=configs.dropout,
                    activation=configs.activation
                ) for l in range(configs.e_layers)
            ],
            norm_layer=torch.nn.LayerNorm(configs.d_model)
        )
        self.projector = nn.Linear(configs.d_model, configs.pred_len, bias=True)

    def forecast(self, x_enc, x_mark_enc, x_dec, x_mark_dec):
        if self.use_norm:
            # Normalization from Non-stationary Transformer
            means = x_enc.mean(1, keepdim=True).detach()
            x_enc = x_enc - means
            stdev = torch.sqrt(torch.var(x_enc, dim=1, keepdim=True, unbiased=False) + 1e-5)
            x_enc /= stdev

        _, _, N = x_enc.shape # B L N
        # B: batch_size;    E: d_model; 
        # L: seq_len;       S: pred_len;
        # N: number of variate (tokens), can also includes covariates

        # Embedding
        # B L N -> B N E                (B L N -> B L E in the vanilla Transformer)
        enc_out = self.enc_embedding(x_enc, x_mark_enc) # covariates (e.g timestamp) can be also embedded as tokens
        
        # B N E -> B N E                (B L E -> B L E in the vanilla Transformer)
        # the dimensions of embedded time series has been inverted, and then processed by native attn, layernorm and ffn modules
        enc_out, attns = self.encoder(enc_out, attn_mask=None)

        # B N E -> B N S -> B S N 
        dec_out = self.projector(enc_out).permute(0, 2, 1)[:, :, :N] # filter the covariates

        if self.use_norm:
            # De-Normalization from Non-stationary Transformer
            dec_out = dec_out * (stdev[:, 0, :].unsqueeze(1).repeat(1, self.pred_len, 1))
            dec_out = dec_out + (means[:, 0, :].unsqueeze(1).repeat(1, self.pred_len, 1))

        return dec_out


    def forward(self, x_enc, x_mark_enc, x_dec, x_mark_dec, mask=None):
        dec_out = self.forecast(x_enc, x_mark_enc, x_dec, x_mark_dec)
        return dec_out[:, -self.pred_len:, :]  # [B, L, D]
```


### Data Embedding


**iTransformer DataEmbedding(inverted)**


```python
class DataEmbedding_inverted(nn.Module):
    def __init__(self, c_in, d_model, embed_type='fixed', freq='h', dropout=0.1):
        super(DataEmbedding_inverted, self).__init__()
        self.value_embedding = nn.Linear(c_in, d_model)
        self.dropout = nn.Dropout(p=dropout)

    def forward(self, x, x_mark):
        x = x.permute(0, 2, 1)
        # x: [Batch Variate Time]
        if x_mark is None:
            x = self.value_embedding(x)
        else:
            # the potential to take covariates (e.g. timestamps) as tokens
            x = self.value_embedding(torch.cat([x, x_mark.permute(0, 2, 1)], 1)) 
        # x: [Batch Variate d_model]
        return self.dropout(x)
```


### Encoder


```python
class EncoderLayer(nn.Module):
    def __init__(self, attention, d_model, d_ff=None, dropout=0.1, activation="relu"):
        super(EncoderLayer, self).__init__()
        d_ff = d_ff or 4 * d_model
        self.attention = attention
        self.conv1 = nn.Conv1d(in_channels=d_model, out_channels=d_ff, kernel_size=1)
        self.conv2 = nn.Conv1d(in_channels=d_ff, out_channels=d_model, kernel_size=1)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)
        self.activation = F.relu if activation == "relu" else F.gelu

    def forward(self, x, attn_mask=None, tau=None, delta=None):
        new_x, attn = self.attention(
            x, x, x,
            attn_mask=attn_mask,
            tau=tau, delta=delta
        )
        x = x + self.dropout(new_x)

        y = x = self.norm1(x)
        y = self.dropout(self.activation(self.conv1(y.transpose(-1, 1))))
        y = self.dropout(self.conv2(y).transpose(-1, 1))

        return self.norm2(x + y), attn


class Encoder(nn.Module):
    def __init__(self, attn_layers, conv_layers=None, norm_layer=None):
        super(Encoder, self).__init__()
        self.attn_layers = nn.ModuleList(attn_layers)
        self.conv_layers = nn.ModuleList(conv_layers) if conv_layers is not None else None
        self.norm = norm_layer

    def forward(self, x, attn_mask=None, tau=None, delta=None):
        # x [B, L, D]
        attns = []
        if self.conv_layers is not None:
            for i, (attn_layer, conv_layer) in enumerate(zip(self.attn_layers, self.conv_layers)):
                delta = delta if i == 0 else None
                x, attn = attn_layer(x, attn_mask=attn_mask, tau=tau, delta=delta)
                x = conv_layer(x)
                attns.append(attn)
            x, attn = self.attn_layers[-1](x, tau=tau, delta=None)
            attns.append(attn)
        else:
            for attn_layer in self.attn_layers:
                x, attn = attn_layer(x, attn_mask=attn_mask, tau=tau, delta=delta)
                attns.append(attn)

        if self.norm is not None:
            x = self.norm(x)

        return x, attns
```


### Self-Attention


```python
class AttentionLayer(nn.Module):
    def __init__(self, attention, d_model, n_heads, d_keys=None,
                 d_values=None):
        super(AttentionLayer, self).__init__()

        d_keys = d_keys or (d_model // n_heads)
        d_values = d_values or (d_model // n_heads)

        self.inner_attention = attention
        self.query_projection = nn.Linear(d_model, d_keys * n_heads)
        self.key_projection = nn.Linear(d_model, d_keys * n_heads)
        self.value_projection = nn.Linear(d_model, d_values * n_heads)
        self.out_projection = nn.Linear(d_values * n_heads, d_model)
        self.n_heads = n_heads

    def forward(self, queries, keys, values, attn_mask, tau=None, delta=None):
        B, L, _ = queries.shape
        _, S, _ = keys.shape
        H = self.n_heads

        queries = self.query_projection(queries).view(B, L, H, -1)
        keys = self.key_projection(keys).view(B, S, H, -1)
        values = self.value_projection(values).view(B, S, H, -1)

        out, attn = self.inner_attention(
            queries,
            keys,
            values,
            attn_mask,
            tau=tau,
            delta=delta
        )
        out = out.view(B, L, -1)

        return self.out_projection(out), attn
        
class FullAttention(nn.Module):
    def __init__(self, mask_flag=True, factor=5, scale=None, attention_dropout=0.1, output_attention=False):
        super(FullAttention, self).__init__()
        self.scale = scale
        self.mask_flag = mask_flag
        self.output_attention = output_attention
        self.dropout = nn.Dropout(attention_dropout)

    def forward(self, queries, keys, values, attn_mask, tau=None, delta=None):
        B, L, H, E = queries.shape
        _, S, _, D = values.shape
        scale = self.scale or 1. / sqrt(E)

        scores = torch.einsum("blhe,bshe->bhls", queries, keys)

        if self.mask_flag:
            if attn_mask is None:
                attn_mask = TriangularCausalMask(B, L, device=queries.device)

            scores.masked_fill_(attn_mask.mask, -np.inf)

        A = self.dropout(torch.softmax(scale * scores, dim=-1))
        V = torch.einsum("bhls,bshd->blhd", A, values)

        if self.output_attention:
            return (V.contiguous(), A)
        else:
            return (V.contiguous(), None)
```


# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
