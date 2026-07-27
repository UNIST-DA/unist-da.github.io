---
date: 2025-01-17
title: Warpformer: A Multi-scale Modeling Approach for Irregular Clinical Time Series (KDD 2023)
category: Paper Review
presenter: Hyejin Cho
url: https://www.notion.so/cb135695f2a148bfb39562f4c3b67934
keywords: Attention, Transformer, Irregular time series, Warping
---

# Selected Paper


## Title: 
Warpformer: A Multi-scale Modeling Approach for Irregular Clinical Time Series


Jiawen Zhang, Shun Zheng, Wei Cao, Jiang Bian, and Jia Li. 2023. Warpformer: A Multi-scale Modeling Approach for Irregular Clinical Time Series. In Proceedings of the 29th ACM SIGKDD Conference on Knowledge Discovery and Data Mining (KDD '23). Association for Computing Machinery, New York, NY, USA, 3273–3285. [https://doi.org/10.1145/3580305.359954](https://doi.org/10.1145/3580305.3599543)


## Abstract: 


Irregularly sampled multivariate time series are ubiquitous in various fields, particularly in healthcare, and exhibit two key characteristics: intra-series irregularity and inter-series discrepancy. Intra-series irregularity refers to the fact that time-series signals are often recorded at irregular intervals, while inter-series discrepancy refers to the significant variability in sampling rates among diverse series. However, recent advances in irregular time series have primarily focused on addressing intra-series irregularity, overlooking the issue of inter-series discrepancy. To bridge this gap, we present Warpformer, a novel approach that fully considers these two characteristics. In a nutshell, Warpformer has several crucial designs, including a specific input representation that explicitly characterizes both intra-series irregularity and inter-series discrepancy, a warping module that adaptively unifies irregular time series in a given scale, and a customized attention module for representation learning. Additionally, we stack multiple warping and attention modules to learn at different scales, producing multi-scale representations that balance coarse-grained and fine-grained signals for downstream tasks. We conduct extensive experiments on widely used datasets and a new large-scale benchmark built from clinical databases. The results demonstrate the superiority of Warpformer over existing state-of-the-art approaches.






# Introduction


### Characteristics of clinical time series data

1. Intra-series irregularity : Individual time series data is recorded at irregular intervals.
2. Inter-series discrepancy : There is a large difference in sampling rate between different time series, resulting in an imbalance in the frequency of signal occurrence.

![](/assets/seminars/warpformer-a-multi-scale-modeling-approach-for-irregular-clinical-time-series-kd/0.png)


> 💡 The problem of inconsistencies between time series has been overlooked.

- Fine-grained unification: Preserves variation in frequently sampled data well, but becomes sparse for infrequently sampled data.
- Coarse-grained unification: More balanced representation of infrequently sampled data, but loses detail in frequently sampled data.

예를 들어, 심박수를 세밀하게 표현하면 나트륨 농도는 거의 나타나지 않을 수 있고, 반대로 나트륨 농도를 고려하면 심박수의 변화가 희석될 수 있음


### Warpformer


Warpformer is designed to process data at **multiple scales**, and can consider both **fine-grained signals** (such as changes in heart rate) and **coarse-grained signals** (such as trends in sodium concentration).


# Related Work


### Existing issues

- Normalized reference point (interpolation): Interpolates data to a normalized reference point, **but fails to balance fine-grained information with coarse trends.**
- Tuple conversion method: Data is converted into a long sequence of “(value, type, time)”, leading to sampling imbalance and difficulty capturing overall trends.

### Warpformer


⇒ Warpformer : **시계열 간 불일치(inter-series discrepancy) 문제에 집중**


⇒ Warpformer : 다양한 시간 단위에서의 패턴 포착 : multi-scales


### **Dynamic Time Warping(DTW) 의 Warping 개념 응용**


DTW temporally aligns two time series of data to calculate similarity, even when they have different time scales.


→ For adjusting temporal misalignment 


**Warping Path of DTW** 

- DTW applies “time warping” to reduce the difference between two time series and align unaligned time series data.
- In the process, it determines the matching (or mapping) between specific points in time and aligns the data to a new time axis.
- nonlinearly transforming the time axis of two time series to find an optimal alignment.

> 💡 Reformulate the basic idea behind DTW's time warping path in a differentiable and learnable way.


> 💡  Extend Warping Path to differentiable Transformation Matrix to dynamically adapt non-stationary time series to data characteristics and tasks, and make multi-scale representations learnable.


# Methodology


![](/assets/seminars/warpformer-a-multi-scale-modeling-approach-for-irregular-clinical-time-series-kd/1.png)


## 1. Input Encoder


Define irregular time series data for a patient in the following format.



$$
\left\{[(t_i^k, x_i^k)]_{i=1}^{L^k}\right\}_{k=1}^K
$$


- K : num of variables
- $L^k$ : Number of observations in the k-th variable
- $t_i^k$ : Time of the i-th observation of the k-th variable
- $x_i^k$ : The i-th observation of the k-th variable

> 💡 Not in a form suitable for batch processing.   
> Needs to be converted to a structured format.


Create $T$ by combining all unique timestamps of all variables into one, then organize the observations, variable types, and observation status into $X, E,$ and $M$ matrices, respectively.


![](/assets/seminars/warpformer-a-multi-scale-modeling-approach-for-irregular-clinical-time-series-kd/2.png)

- $T \in \R^L$
: A vector of <u>all unique timestamps</u> sorted in ascending order. 
$L$ is the number of unique timestamps.
- value matrix $X \in \R^{K \times L}$
- type matrix $E \in \R^{K \times L}$
- mask matrix $M \in \R^{K \times L}$

$X_{k,j}=x_i^k, E_{k,j}=k, M_{k,j}=1$ if $T_j$ equals to $t_i^k$; $X_{k,j}=0, E_{k,j}=0, M_{k,j}=0$  otherwise.


> 💡 $H \in \R^{K \times L \times D}$ as $H = f^{\textrm{val}}(X) + f^{\textrm{type}}(E) + f^{\textrm{abs}}(T) + f^{\textrm{rel}}(T, M)$


$f^{\textrm{val}}(X)$ : **value embedding**

- 각 observation (X)을 임베딩 크기 D로 변환하는 fully-connected layer.
<details>
<summary>code</summary>
- 관측값(x)을 `nn.Linear`로 임베딩(D-차원 벡터)으로 변환.
- 관측되지 않은 값(마스킹된 값)을 제거하기 위해 M을 곱함.

```python
class Value_Encoder(nn.Module):
    def __init__(self, hid_units, output_dim, num_type):
        self.hid_units = hid_units
        self.output_dim = output_dim
        self.num_type = num_type
        super(Value_Encoder, self).__init__()

        self.encoder = nn.Linear(1, output_dim)

    def forward(self, x, non_pad_mask):
        non_pad_mask = rearrange(non_pad_mask, 'b l k -> b l k 1')
        x = rearrange(x, 'b l k -> b l k 1')
        x = self.encoder(x)
        return x * non_pad_mask
```


</details>


$f^{\textrm{type}}(E)$ : **type embedding**

- 변수 유형(E)을 임베딩 테이블(lookup table)을 통해 임베딩으로 변환.
<details>
<summary>code</summary>

```python
class Event_Encoder(nn.Module):
    def __init__(self, d_model, num_types):
        super(Event_Encoder, self).__init__()
        self.event_emb = nn.Embedding(num_types+1, d_model, padding_idx=PAD)

    def forward(self, event):
        event_emb = self.event_emb(event.long())
        return event_emb
```


</details>


$f^{\textrm{abs}}(T)$ : **absolute time embedding**

- Functions to embed absolute time based on T
- combination of sinusoidal functions and linear mapping
<details>
<summary>code</summary>

```python
class Time_Encoder(nn.Module):
    def __init__(self, embed_time, num_types):
        super(Time_Encoder, self).__init__()
        self.periodic = nn.Linear(1, embed_time - 1)
        self.linear = nn.Linear(1, 1)
        self.k_map = nn.Parameter(torch.ones(1,1,num_types,embed_time))

    def forward(self, tt, non_pad_mask):
        non_pad_mask = rearrange(non_pad_mask, 'b l k -> b l k 1')
        if tt.dim() == 3:  # [B,L,K]
            tt = rearrange(tt, 'b l k -> b l k 1')
        else: # [B,L]
            tt = rearrange(tt, 'b l -> b l 1 1')
        
        out2 = torch.sin(self.periodic(tt))
        out1 = self.linear(tt)
        out = torch.cat([out1, out2], -1) # [B,L,1,D]
        out = torch.mul(out, self.k_map)
        return out
```

- `self.periodic`: T에 대해 sin-기반의 주기적 변환 수행.
- `self.linear`: 선형 변환으로 절대 시간을 학습.
- `torch.cat`: 주기적 및 선형 임베딩을 결합하여 D-차원 벡터로 변환.
- `self.k_map`: 변수별 가중치를 곱해 최종 변환

</details>


$f^{\textrm{rel}}(T, M)$ : **relative time embedding**

- Embedding by calculating the sampling interval of each variable.
- Using a multilayer perceptron (MLP) implemented with two fully-connected layers.
<details>
<summary>code</summary>

```python
class MLP_Tau_Encoder(nn.Module):
    def __init__(self, embed_time, num_types, hid_dim=16):
        super(MLP_Tau_Encoder, self).__init__()
        self.encoder = FFNN(1, hid_dim, embed_time)
        self.k_map = nn.Parameter(torch.ones(1,1,num_types,embed_time))

    def forward(self, tt, non_pad_mask):
        non_pad_mask = rearrange(non_pad_mask, 'b l k -> b l k 1')
        if tt.dim() == 3:  # [B,L,K]
            tt = rearrange(tt, 'b l k -> b l k 1')
        else: # [B,L]
            tt = rearrange(tt, 'b l -> b l 1 1')
        
        tt = self.encoder(tt)
        tt = torch.mul(tt, self.k_map)
        return tt * non_pad_mask
```

- `FFNN`을 사용해 상대 시간 정보를 D-차원 벡터로 변환.
- 변수별 가중치(`k_map`)를 곱해 가중 임베딩 수행.

</details>


> 💡 Keep time and variable dimensions $H \in \R^{K \times L \times D}$  
> ⇒ inter-series discrepancy 가 $H$ 에 드러남.


## 2. Warping Module


> 💡 Aligning and unifying irregularly sampled data at multiple scales.


The Warping Module adjusts irregularly sampled data at different scales according to certain criteria to **align them into calibrated positions**.


⇒ This allows you to utilize both **fine-grained** and **coarse-grained** information at the same time.


![](/assets/seminars/warpformer-a-multi-scale-modeling-approach-for-irregular-clinical-time-series-kd/3.png)


![](/assets/seminars/warpformer-a-multi-scale-modeling-approach-for-irregular-clinical-time-series-kd/4.png)


### Requirements

- **unification based on data →** differentiable
- down-sampling & up-sampling
- maintain the format $H \in \R^{K \times L \times D}$ ⇒ inter-series discrepancy

### Input & Output


input : 

- $H^{(n-1)} \in \R^{K \times L^{(n-1)} \times D}$
- $M^{(n-1)} \in \R^{K \times L^{(n-1)} }$
- $T^{(n-1)} \in \R^{K \times L^{(n-1)} }$

output:

- $Z^{(n)} \in \R^{K \times L^{(n)} \times D}$
- $M^{(n)} \in \R^{K \times L^{(n)} }$
- $T^{(n)} \in \R^{K \times L^{(n)} }$

### Transformation Data to New Scale



$$
A^{(n)} \in \R^{K \times L^{(n)} \times L^{(n-1)}}
$$



> 💡 A tensor for converting $H(n−1))$ to a new scale


Converting to

- $Z^{(n)} = A^{(n)} \otimes H^{(n-1)}$
- $M^{(n)} = A^{(n)} \otimes M^{(n-1)}$
- $T^{(n)} = A^{(n)} \otimes T^{(n-1)}$

### Generating $A^{(n)}$  : Score Calculation


For each data $H^{(n-1)}$, calculate a weighted score $\bm s_k$



$$
\bm{s}_k = f^{\bm{s}}(\bm{h}_k) \odot \bm{m}_k
$$




Generate a Warping Curve($\bm{\lambda}_{k}$) by **cumulatively summing** the scores.



$$
\bm{\lambda}_{k,i} = \dfrac{\sum_{i'=1}^{i} \bm{s}_{k,i'}}{\sum_{i'=1}^{L^{(n-1)}} \bm{s}_{k,i'}}
$$



This curve indicates where each data point would be located on the new scale.

<details>
<summary>code</summary>

```python
class VanillaWarp(nn.Module):
    def __init__(self, backend, nonneg_trans='abs'):
        super().__init__()
        self.backend = backend  # 워핑 스코어를 계산하는 네트워크
        self.normintegral = NormalizedIntegral(nonneg_trans)  # 정규화 및 누적합을 담당

    def forward(self, input_seq, mask):
        score = self.backend(input_seq, mask=mask)  # 스코어 계산 [B, K, L, D] -> [B, K, L]
        gamma = self.normintegral(score, mask)  # 스코어를 누적하여 워핑 곡선 생성
        return gamma

class NormalizedIntegral(nn.Module):
    def __init__(self, nonneg):
        super().__init__()
        self.nonnegativity = {
            'abs': Abs(),
            'square': Square(),
            'relu': nn.ReLU(),
            'exp': Exp(),
            'sigmoid': nn.Sigmoid(),
            'softplus': nn.Softplus()
        }.get(nonneg, ValueError("Invalid non-negativity transformation"))

    def forward(self, input_seq, mask):
        gamma = self.nonnegativity(input_seq)  # 입력 스코어를 변환 (e.g., 절대값, 제곱 등)
        dgamma = mask * gamma  # 마스크된 스코어
        gamma = torch.cumsum(dgamma, dim=-1)  # 누적합 계산
        gamma_max = torch.max(gamma, dim=1, keepdim=True)[0]  # 정규화
        gamma_max[gamma_max == 0] = 1  # 정규화 시 0 방지
        gamma = gamma / gamma_max
        return gamma

class Almtx(nn.Module):
    def __init__(self, opt, K):
        super().__init__()
        self.S = K  # 목표 워핑된 길이

    def forward(self, input_seq, mask):
		    mask = rearrange(mask,'b k l -> (b k) l')
		    # 워핑 곡선 계산, [BK, L]
		    gamma = self.warp(input_seq, mask)  
				
				#Upscaling
		    mask = repeat(mask, 'b l -> b s l', s=self.S)
		    _, L = gamma.shape
		    gamma = repeat(gamma, 'b l -> b s l', s=self.S)
				
				#경계 값 설정
		    Rl = torch.arange(0, 1, 1/self.S).unsqueeze(0).unsqueeze(-1).expand(1, self.S, L).to(gamma.device)
		    Rr = torch.arange(1/self.S, 1+1/self.S, 1/self.S).unsqueeze(0).unsqueeze(-1).expand(1, self.S, L).to(gamma.device)
				
				#정렬 행렬 A 및 mask 계산
		    A, bound_mask = self.get_boundary(gamma, Rl, Rr, mask)
				
				# 정규화
		    A_diag = A * bound_mask
		    A_sum = A_diag.sum(dim=-1, keepdim=True)
		    A_sum = torch.where(A_sum == 0, torch.ones_like(A_sum), A_sum).to(A_sum.device)
		    A_norm = A_diag / A_sum
		
		    return bound_mask.float(), A_norm
```


</details>


### Upsampling


**Transformation Mapping**


divide $[0, 1]$ into $L^{(n)}$ segments 

- left : $\bm{r}^1 = [0, \tfrac{1}{L^{(n)}}, \cdots, \tfrac{L^{(n)}-1}{L^{(n)}}]$
- right : $\bm{r}^2 = [\tfrac{1}{L^{(n)}}, \tfrac{2}{L^{(n)}}, \cdots, 1]$

Generate a mapping matrix  $\bm{a}_k^m$ by comparing the warping curve $\bm{\lambda}_k$ to the bin boundaries:



$$
\bm{a}_k^m = (\Lambda_k - R^1 \ge 0) \texttt{ \& } (R^2 - \Lambda_k \ge 0)
$$


- When upsampling, expand the mapping matrix by copying the boundary values of the Warping Curve.
- This allows you to generate fine-grained data even when $L^{(n)} > L^{(n-1)}$.
<details>
<summary>code</summary>

```python
def get_boundary(self, gamma, Rl, Rr, mask):
    if self.only_down:
        new_Rl, new_Rr = Rl, Rr
    else:
        new_Rl, new_Rr = self.cal_new_bound(Rl, Rr, gamma)

    bound_mask = (gamma - new_Rl >= 0) & (new_Rr - gamma > 0)  # 워핑 구간 내의 마스크 계산
    bound_mask = mask * bound_mask

    A = torch.threshold(gamma - new_Rl, 0, 0) + torch.threshold(new_Rr - gamma, 0, 0)
    return A, bound_mask

def cal_new_bound(self, Rl, Rr, gamma):
		# 워핑 곡선 γ를 기반으로 구간의 왼쪽/오른쪽 경계를 조정.
    B, S, L = gamma.shape
    mask = (Rr - gamma >= 0)
    vl, _ = torch.max(mask * gamma.detach(), -1)
    new_Rl = torch.min(vl, torch.arange(0, 1, 1/S).to(gamma.device)).unsqueeze(-1).expand(B, S, L)

    mask = (gamma - Rl >= 0)
    mask[mask == False] = 10
    mask[mask == True] = 1
    vr, _ = torch.min(mask * gamma.detach(), -1)
    tmp_Rr = torch.max(vr, torch.arange(1/S, 1+1/S, 1/S).to(gamma.device)).unsqueeze(-1).expand(B, S, L)
    new_Rr = tmp_Rr.clone()
    new_Rr[:, -1] = tmp_Rr[:, -1] + 1e-4

    return new_Rl, new_Rr
```


</details>


### Ensure Differentiability


The mapping matrix ($\bm{a}_k^m$ ) generated based on the warping curve is not differentiable. 


⇒ Convert the mapping matrix to a **continuous function** to make it differentiable. This allows us to compute the **gradient** during training.



$$
\bm{a}_k^u = \bm{a}_k^m \odot \left( \max \left(\Lambda_k - R^1, 0\right) + \max \left(R^2 - \Lambda_k, 0\right) \right)
$$



$R^1$ $R^2$ : 상수로 간주. 


$\Lambda_k$ : 연속적인 curve 값. 


linear conversion


### The Warping Module's Features 

- Align irregular data
- Scale transformation
- Make it learnable

## 3. Doubly Self-attention Module


![](/assets/seminars/warpformer-a-multi-scale-modeling-approach-for-irregular-clinical-time-series-kd/5.png)


> 💡 A module for training the data representation $Z(n)$ generated by the Warping Module, designed to learn **intra-series** and **inter-series** information simultaneously.

- Representation generated by the Warping Module $Z^{(n)} \in \R^{K \times L^{(n)} \times D}$
- cf : Vanila Transformer : Data $\in$$\R^{L^{(n)}×D}$
<details>
<summary>code</summary>

```python
class Warpformer(nn.Module):
    def forward(self, h0, non_pad_mask, event_time, id_warp=False):
        if id_warp:
            z0 = h0
            new_pad_mask = non_pad_mask
        else:
            z0, _, new_pad_mask, _ = self.almat_aggregate(event_time, h0, non_pad_mask)

        for enc_layer in self.layer_stack:
            z0, _, _ = enc_layer(z0, non_pad_mask=new_pad_mask)  # Transformer 레이어
        return z0, new_pad_mask
```


</details>


### First Self-Attention : Intra-variate


> 💡 Capture patterns that occur over time within each variable

- Let $Z^{(n)} \in \R^{K \times L^{(n)} \times D}$ be 𝐾 sequences of embeddings
- Each sequence is represented by an embedding vector $D$ ordered along the time dimension $L^{(n)}$.

### Second Self-Attention : Inter-variate


> 💡 Learn the correlation between multiple variables at a specific time

- rearrange $𝑍^{(𝑛)}$ into $𝐿^{(𝑛)}$ sequences of embeddings
- Each sequence is represented by an embedding vector $(D)$ ordered along the variable dimension $(K)$

### Position-wise Feed-Forward Network

- Generally used in Vanila Transformer

### Final Structure

- Input $Z^{(n)}$ →  Output $H^{(n)} \in \R^{K \times L^{(n)} \times D}$
- $M^{(n)}$ and $T^{(n)}$ are unchanged.
<details>
<summary>code</summary>

```python
class EncoderLayer(nn.Module):
    """ Compose with two layers """

    def __init__(self, d_model, d_inner, n_head, d_k, d_v, dropout=0.1, opt=None):
        super(EncoderLayer, self).__init__()

        self.full_attn = opt.full_attn
				
				# 시간(Time) 차원에서의 Multi-Head Self-Attention.
        self.slf_tem_attn = MultiHeadAttention_tem_bias(
            n_head, d_model, d_k, d_v, dropout=dropout, opt=opt)
				
				# 변수(Variable) 차원에서의 Multi-Head Self-Attention.
        self.slf_type_attn = MultiHeadAttention_type_bias(
            n_head, d_model, d_k, d_v, dropout=dropout)


        self.pos_ffn = PositionwiseFeedForward(d_model, d_inner, dropout=dropout)
        
        self.layer_norm = nn.LayerNorm(d_model, eps=1e-6)

    def forward(self, input, non_pad_mask=None):
        # time attention
        # [B, K, L, D]
        
        # 시간(Time) 차원에서 패딩 위치를 차단
        tem_mask = get_attn_key_pad_mask_K(mask=non_pad_mask, transpose=False, full_attn=self.full_attn)
        # 변수(Variable) 차원에서 패딩 위치를 차단
        type_mask = get_attn_key_pad_mask_K(mask=non_pad_mask, transpose=True, full_attn=self.full_attn)
        
        # residue = enc_input
        tem_output = self.layer_norm(input)
        
        tem_output, enc_tem_attn = self.slf_tem_attn(
            tem_output, tem_output, tem_output, mask=tem_mask) 
        
        tem_output = tem_output + input

        tem_output = rearrange(tem_output, 'b k l d -> b l k d')

        # type attention
        # [B, L, K, D]
        # residue = enc_output
        type_output = self.layer_norm(tem_output)
        
        type_output, enc_type_attn = self.slf_type_attn(
            type_output, type_output, type_output, mask=type_mask) 
        
        enc_output = type_output + tem_output
        
        # FFFNN
        # residue = enc_output
        output = self.layer_norm(enc_output)
        
        output = self.pos_ffn(output)

        output = output + enc_output
        
        output = rearrange(output, 'b l k d -> b k l d')
        
        # optional
        output = self.layer_norm(output)

        return output, enc_tem_attn, enc_type_attn
```


</details>


> 💡 By learning the temporal and variable dimensions simultaneously, the model never loses the context and relationships of the data.

<details>
<summary>example</summary>

데이터가 K=2개의 변수(심박수, 혈당)와 L(n)=5개의 시간 샘플로 이루어져 있다고 가정한다면


First : 심박수 / 혈당 데이터 따로 학습 → 시간에 따른 변화 학습


Second : 특정 시간 : 심박수/ 혈당 관계 학습



$$
Z^{(n)}=\left[\begin{array}{cccc}\text { 심박수 }(\text { 시간 1) } & \text { 심박수 }(\text { 시간 } 2) & \cdots & \text { 심박수 }(\text { 시간 } 5) \\\text { 혈당(시간 } 1) & \text { 혈당(시간 } 2) & \cdots & \text { 혈당(시간 } 5)\end{array}\right]
$$



</details>


## 4. Task Decoder


![](/assets/seminars/warpformer-a-multi-scale-modeling-approach-for-irregular-clinical-time-series-kd/6.png)


> 💡 The Task Decoder converts the **multi-scale representations** generated by Warpformer in multiple layers into fixed-size vectors, which are used to perform final tasks such as classification or prediction.


### Now : Inconsistent data size


**Each layer** $H^{(n)}$ **has a different time scale,** $L^{(n)}$**.**


⇒ Use the **Attention mechanism** to compress(aggregate) the time dimension and the variable dimension to create a fixed-size vector



$$
f^{\textrm{agg}}(\textrm{Query}, \textrm{Key}, \textrm{Value}) = \text{Softmax}(\textrm{Query} \cdot \textrm{Key}^T) \cdot \textrm{Value}
$$


- Time dimension : $L^{(n)}$ → 1
- Variable dimension : $K$ → 1

### Final Representation $\bm v$



$$
\bm{v} = \sum_{n=1}^N \bm{v}^{(n)}
$$



$\{\bm{v}^{(n)}\}_{n=1}^N$ : Fixed-size vectors generated from each layer

<details>
<summary>example : classification</summary>

In a multi-class classification problem with C classes, the final output Use $\bm v$ to compute the predicted probability distribution as follows:



$$
\hat{\bm{y}} = \texttt{Softmax}( W^y \bm{v} + \bm{b}^y)
$$


- $\hat{\bm{y}} \in \R^{C}$  : predicted probability distribution over $C$ classes
- $W^y \in \R^{C \times D}, \bm{b}^y \in \R^C$ : task-specific parameters.

</details>

<details>
<summary>code</summary>

```python
class Pool_Classifier(nn.Module):
    def __init__(self, dim, cls_dim):
        super(Pool_Classifier, self).__init__()
        self.classifier = nn.Linear(dim, cls_dim)  # 선형 분류기

    def forward(self, ENCoutput):
        b, l, k = ENCoutput.size(0), ENCoutput.size(1), ENCoutput.size(2)  # 입력 크기
        ENCoutput = rearrange(ENCoutput, 'b l k d -> (b l) d k')  # 차원 변경
        ENCoutput = F.max_pool1d(ENCoutput, k).squeeze()  # Variables(K)에 대해 최대 풀링
        ENCoutput = rearrange(ENCoutput, '(b l) d -> b d l', b=b, l=l)  # 원래 배치로 복원
        ENCoutput = F.max_pool1d(ENCoutput, l).squeeze(-1)  # Time Length(L)에 대해 최대 풀링
        return self.classifier(ENCoutput)  # 최종 분류 결과 반환

class Attention_Aggregator(nn.Module):
    def __init__(self, dim, task):
        super(Attention_Aggregator, self).__init__()
        self.task = task
        self.attention_len = Attention(dim*2, dim)  # Time Length(L)에 대한 Attention
        self.attention_type = Attention(dim*2, dim)  # Variables(K)에 대한 Attention

    def forward(self, ENCoutput, mask):
        if self.task == "active":
            mask = rearrange(mask, 'b k l 1 -> b l k 1')  # 마스크 차원 변경
            ENCoutput = rearrange(ENCoutput, 'b k l d -> b l k d')  # 차원 변경
            ENCoutput, _ = self.attention_type(ENCoutput, mask)  # Variables(K) -> [B, L, D]
        else:
            ENCoutput, _ = self.attention_len(ENCoutput, mask)  # Time Length(L) -> [B, K, D]
            ENCoutput, _ = self.attention_type(ENCoutput)  # Variables(K) -> [B, D]
        return ENCoutput

class Classifier(nn.Module):
    def __init__(self, dim, type_num, cls_dim, activate=None):
        super(Classifier, self).__init__()
        self.linear = nn.Linear(dim, cls_dim)  # 선형 분류기

    def forward(self, ENCoutput):
        ENCoutput = self.linear(ENCoutput)  # 선형 분류를 통해 최종 출력 생성
        return ENCoutput
```


</details>


# Experiments


### Datasets

- Physionet Challenge 2012
- Human Activity Dataset
- MIMIC-III

### Baselines

- Irregularity-sensitive RNNs
- Neural ODEs
- Continuous-time Representations
- Self-Attention & Graph-based Approaches

![](/assets/seminars/warpformer-a-multi-scale-modeling-approach-for-irregular-clinical-time-series-kd/7.png)


![](/assets/seminars/warpformer-a-multi-scale-modeling-approach-for-irregular-clinical-time-series-kd/8.png)


Warpformer's performance improvement is most noticeable on **WBM(Task)**.


⇒ Impact of observation window length & High complexity


### Ablation Studies


![](/assets/seminars/warpformer-a-multi-scale-modeling-approach-for-irregular-clinical-time-series-kd/9.png)


(1) Related to Warping Module 

- **No Up-sampling**
- **Identical Mapping**: No use Warping Module
- **Hourly Aggregation**: Warping Module 대체
    - Creating an inappropriate coarse-grained representation

(2) Related to Input Encoding

- Removing absolute time embedding has the largest impact on performance.

    ⇒ Absolute time is essential for understanding the **continuous time position** of each sample in irregular data.


### Multi-scale Effects


![](/assets/seminars/warpformer-a-multi-scale-modeling-approach-for-irregular-clinical-time-series-kd/10.png)

- For optimal performance on each dataset, the appropriate scale ($\tilde{L}^{(n)}$) should be chosen.

> 💡 Warpformer relies heavily on **preset hyperparameters**  
> - Number of layers (N): determines how many Warpformer layers to use.  
>   
> - Sort Steps by Layer ($\tilde L^{(n)}$): Sampling level at each layer.


### Case Study


> 💡 To analyze how Warpformer's Warping Module improves performance in downstream tasks (such as forecasting)


![](/assets/seminars/warpformer-a-multi-scale-modeling-approach-for-irregular-clinical-time-series-kd/11.png)


**Dense Signals** 


Systolic Blood Pressure (수축기 혈압) : Downsampling

- Contains significant local fluctuations

Sparse Signals


Temperature, Glucose(혈당) : Upsampling

- 추가적인 샘플 포인트(interpolated sample points)를 생성
- Convert to fine-grained representation

> 💡 1. Intra-variate Irregularity 보존  
>   
> 2. Inter-variate Discrepancy 완화  
>   
> 3. Adaptive Unification의 중요성
