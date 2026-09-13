---
date: 2023-11-24
title: SAITS: Self-attention-based imputation for time series (ESWA 2023)
category: Paper Review
presenter: Yongmin Kim
url: https://www.notion.so/d412661c05fa48a3854e1938265cc9d6
keywords: Irregular time series, Self-attention
---

# Selected Paper


## Title: **SAITS: Self-attention-based imputation for time series**


Author: Wenjie Du, David Côté, Yan Liu
Journal: Expert Systems with Applications, Volume 219, 2023, 119619, ISSN 0957-4174


## Abstract: 


Missing data in time series is a pervasive problem that puts obstacles in the way of advanced analysis. A popular solution is imputation, where the fundamental challenge is to determine what values should be filled in. This paper proposes SAITS, a novel method based on the self-attention mechanism for missing value imputation in multivariate time series. Trained by a joint-optimization approach, SAITS learns missing values from a weighted combination of two diagonally-masked self-attention (DMSA) blocks. DMSA explicitly captures both the temporal dependencies and feature correlations between time steps, which improves imputation accuracy and training speed. Meanwhile, the weighted-combination design enables SAITS to dynamically assign weights to the learned representations from two DMSA blocks according to the attention map and the missingness information. Extensive experiments quantitatively and qualitatively demonstrate that SAITS outperforms the state-of-the-art methods on the time-series imputation task efficiently and reveal SAITS’ potential to improve the learning performance of pattern recognition models on incomplete time-series data from the real world.


## Link


[https://doi.org/10.1016/j.eswa.2023.119619](https://doi.org/10.1016/j.eswa.2023.119619).([https://www.sciencedirect.com/science/article/pii/S0957417423001203](https://www.sciencedirect.com/science/article/pii/S0957417423001203))


## Paper Review


> 💡 Propose joint-optimization training approach of imputation and reconstruction which can be applied for any other imputation model


> 💡 Propose SAIT model, the self-attention based imputation for time series model


## Introduction


Self-attention mechanism, which is non-autoregressive and can overcome RNN’s drawbacks of slow speed and memory constraints, can avoid compounding error, but application of self-attention mechanism on time series imputation is limited. 


→ So, authors propose time series imputation based on self-attention mechanism


## Related Work


### Methods to deal with missing data in time series

1. Deletion

    Remove samples or features that are partially observed

2. Imputation

    Estimate missing data from observed values


Two advantages of using imputation:


Correctly specified imputation estimates are unbiased while deletion introduces bias


Partially observed data has potential to be informative but deletion removes them


### Time series imputation

1. RNN-based

    Recurrent Neural Network (RNN) is used for this models.


    GAN-based is developed version of RNN-based method by adopting the generative adversarial network (GAN) structure


    ![Fang, C., & Wang, C. (2020, November 23). Time Series Data Imputation: A Survey on Deep Learning Approaches. arXiv.org. https://arxiv.org/abs/2011.11347](/assets/seminars/saits-self-attention-based-imputation-for-time-series-eswa-2023/0.png)


    Limit:


    Time-consuming and memory constraints exists, so that, it is hard to deal with long-term dependency in time series

2. VAE-based

    Variational auto-encoder (VAE) architecture for time series imputation with a Gaussian process (GP) prior in the latent space is based. GP-prior is used to help embed the data into a smother and more explainable representation. 


    ex. GP-VAE, L-VAE, SGP-VAE


    Limit:


    Tend to involve latent variables used in the sampling and imputation, while they often do not correspond to concrete structures or distributions of the data → lead to difficult to interpret the imputation process for further understanding

3. Self-attention based

    CDSA (2019): apply cross-dimensional self attention jointly from three dimensions (time, location, and measurement) to impute missing values in geo-tagged data


    But, specifically designed for spatiotemporal data and not open source


    DeepMVI (2021): includes a Transformer with a convolutional window feature and a kernel regression


    But, not open source


    NRTSI (2021): treating time series as a set of tuples and directly uses a Transformer encoder for modeling


    But, the advantage of self-attention that is parallelly computational being weaken due to the existence of two nested loops which also slow down the model


### Basic components of DMSA block:

1. Diagonally-masked self-attention : widely applied in NLP field.

    $\text{DiagMaskedMHA}(x)=\text{Concat}(head_1,head_2,\dots, head_i,\dots,head_h)W^O\text{ where }head_i=\text{DiagMaskedSelfAttention}(xW_i^Q,xW_i^K,xW_i^V),h\text{ is the number of heads}$


    $\text{DiagMaskedSelfAttention}(Q,K,V)=\text{Softmax}(\text{DiagMask}({QK^T\over\sqrt{d_k}}))V=AV,\text{where }A\text{ is attention weights}$


    $[\text{DiagMask}(x)](i,j)=
    \begin{cases}
    -\infin&\text{if }i=j\\
    x(i,j)&\text{if }i\neq j
    \end{cases}$


    ![Image of DiagMaskedSelfAttention](/assets/seminars/saits-self-attention-based-imputation-for-time-series-eswa-2023/1.png)


    Softmax result of the diagonal value = 0 → Input at $t$ step cannot contribute to estimation of themselves.

2. Positional encoding & Feed-forward network :

    Vaswani et al. (2017) applied positional encoding in transformer to make use of the sequence order due to non-existence of notion of sequence order in the original Transformer architecture


    Positional encoding


    $\text{PosEnc}(pos,2i)=\sin({pos\over{2i\over 10000^dmodel}})$


    $\text{PosEnc}(pos,2i+1)=\cos({pos\over{2i\over 10000^dmodel}})$


    Feed-forward network


    $\text{FFN}(x)=\text{ReLU}(xW_1+b_1)W_2+b_2\text{ where }W_1\in\R^{d_\text{model}\times d_\text{ffn}}, b_1\in\R^{d_\text{ffn}},W_2\in\R^{d_\text{ffn}\times d_\text{model}}, b_1\in\R^{d_\text{model}}$


## Methodology


### Joint-optimization training approach of imputation and reconstruction


Task composition: Masked Imputation Task (MIT) + Observed Reconstruction Task (ORT)


Loss: made from the imputation loss of MIT and the reconstruction loss of ORT


두 task가 필요한 이유: 기존에 RNN에 적용되던 imputation step은 ORT와 동일, 하지만 이는 RNN에 맞는 것, self-attention based에 맞는 task 구성 필요


MIT is utilized to force the model to predict missing values as accurately as possible, and ORT is leveraged to ensure that the model converges to the distribution of observed data


![](/assets/seminars/saits-self-attention-based-imputation-for-time-series-eswa-2023/2.png)


$\ell_\text{MAE}(estimation, target, mask)={\sum^D_{d=1}\sum^T_{t=1}|(estimation-target)\odot mask|^d_t\over\sum^D_{d=1}\sum^T_{t=1}mask^d_t}$


Task 1 - MIT: 무작위로 일부를 가리고 imputation 진행


$\mathsterling_\text{MIT}=\ell_\text{MAE}(\~{X},X,I)$


Masked language Modeling과 유사한 방법


차이점: MLM은 time steps, MIT은 value을 예측, MLM은 missing value 예측이 task가 아니라는 점에서 pretrain-finetune discrepancy 발생


![A graphical overview of the joint-optimization training approach, illustrating the implementation details of the two training tasks: masked imputation task (MIT) and observed reconstruction task (ORT)](/assets/seminars/saits-self-attention-based-imputation-for-time-series-eswa-2023/3.png)


Task 2 - ORT: 모든 missing에 대해서 빈 곳의 값을 reconstruct


$\mathsterling_\text{ORT}=\ell_\text{MAE}(\~{X},X,\hat{M})$


### SAITS model, a weighted combination of two DMSA blocks


![SAITS model architecture](/assets/seminars/saits-self-attention-based-imputation-for-time-series-eswa-2023/4.png)


Two diagonally-masked self-attention (DMSA) blocks and a weighted combination


### First DMSA block


$e=[\text{Concat}(\hat{X},\hat{M})W_e+b_e]+p$


$z=\{\text{FFN(DiagMaskedMHA}(e))\}^N$


$\~{X}_1=zW_z+b_z$


$\hat{X}'=\hat{M}\odot\hat{X}+(1-\hat{M})\odot\~{X}_1$


### Second DMSA block


$\alpha=[\text{Concat}(\hat{X}',\hat{M})W_\alpha+b_\alpha]+p$


$\beta=\{\text{FFN(DiagMaskedMHA}(\alpha))^N\}$


$\~{X}_2=\text{ReLU}(\beta W_\beta+b_\beta)W_r+b_r$


One more non-linear layer is applied


→ to build deeper block


### Weighted combination block


$\hat{A}={1\over h}\sum^h_{i=1}A_i$


$\eta=\text{Sigmoid}(\text{Concat}(\hat{A},\hat{M})W_\eta+b_\eta)$


$\~X_3=(1-\eta)\odot\~X_1+\eta\odot\~X_2$


$\hat{X}_c=\hat{M}\odot\hat{X}+(1-\hat{M})\odot\~{X}_3$


A is attention weights which is the output by multi-heads in the last layer of the second DMSA block


Just two DMSA blocks are applied as adding new block leads to little benefit


### Loss function


$\mathsterling_\text{MIT}=\ell_\text{MAE}(\~{X},X,I)$


$\mathsterling_\text{ORT}={1\over 3}(\ell_\text{MAE}(\~{X}_1,X,\hat{M})+\ell_\text{MAE}(\~{X}_2,X,\hat{M})+\ell_\text{MAE}(\~{X}_3,X,\hat{M}))$


$\mathsterling=\mathsterling_\text{MIT}+\mathsterling_\text{ORT}$


Model is updated by minimizing the final loss $\mathsterling$


## Experiments


제시한 기법들이 유의미한가?

1. Diagonal-masks

    ![](/assets/seminars/saits-self-attention-based-imputation-for-time-series-eswa-2023/5.png)

2. DMSA blocks and weighted combination

    ![](/assets/seminars/saits-self-attention-based-imputation-for-time-series-eswa-2023/6.png)


모델의 성능 증명


Dataset:


![](/assets/seminars/saits-self-attention-based-imputation-for-time-series-eswa-2023/7.png)


Baseline methods: $\text{Median, Last, GRUI-GAN, }\text{E}^2\text{GAN, M-RNN, GP-VAE, BRITS}$


Evaluation Metrics: MAE, RMSE, MRE

1. Comparison with baseline methods

    ![](/assets/seminars/saits-self-attention-based-imputation-for-time-series-eswa-2023/8.png)

2. Varing Missing value percentage에서 성능 확인

    ![](/assets/seminars/saits-self-attention-based-imputation-for-time-series-eswa-2023/9.png)

3. 추가적인 metrics

    ![](/assets/seminars/saits-self-attention-based-imputation-for-time-series-eswa-2023/10.png)

4. 2021년의 SOTA와 비교

    ![](/assets/seminars/saits-self-attention-based-imputation-for-time-series-eswa-2023/11.png)


# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
