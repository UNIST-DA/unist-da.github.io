---
date: 2025-02-13
title: Root Cause Analysis of anomalies in multivariate time series through granger causal discovery (ICLR 2025)
category: Lab Seminar
presenter: 강태원
url: https://www.notion.so/199046396f7e80afac16f04606f1e35c
keywords: Autoencoder, Causality, Anomaly Detection
---

# Selected Paper


## Root Cause Analysis of anomalies in multivariate time series through granger causal discovery(2025, ICLR)


## Abstract


Identifying the **root causes of anomalies in multivariate time series is challenging** due to the complex dependencies among the series. In this paper, we propose a comprehensive approach called AERCA that inherently integrates Granger causal discovery with root cause analysis. By defining anomalies as interventions on the exogenous variables of time series, AERCA not only learns the Granger causality among time series but also explicitly models the distributions of exogenous variables under normal conditions. AERCA then identifies the root causes of anomalies by highlighting exogenous variables that significantly deviate from their normal states. Experiments on multiple synthetic and real-world datasets demonstrate that **AERCA can accurately capture the causal relationships among time series and effectively identify the root causes of anomalies**


[Root Cause Analysis of Anomalies in Multivariate Time Series through Granger Causal Discovery | OpenReview](https://openreview.net/forum?id=k38Th3x4d9)


## Introduction

- Root cause analysis on multivariate time series data has applications in various domains, **but traditional topology-based approaches are impractical due to system complexity.**
- Existing causal inference-based approaches often assume **prior knowledge of causal relationships, which may not be feasible in real-world scenarios**.
- AERCA(Autoencoder-based Root Cause Analysis) integrates Granger causal discovery with root cause analysis, modeling anomalies as interventions on exogenous variables.
    - **AERCA : Granger causal discovery +** **root cause analysis**
- The encoder models abductive reasoning to infer exogenous variables, while the decoder models deductive reasoning to reconstruct observed data.
    - **Encoder : Abductive reasoning**(귀납적 추론)**, decoder : Deductive reasoning**(연역적 추론)
- AERCA achieves state-of-the-art performance in both Granger causal discovery and root cause identification across multiple datasets.

## Related work

- Understanding the root cause of an anomaly is crucial for mitigating abnormal behaviors in real-world applications.
- Traditional methods rely on domain knowledge or system tools to build dependency graphs, but **these approaches become impractical as systems grow in complexity.**
- Unlike existing approaches, **AERCA identifies both the root cause time series and the specific time steps where exogenous interventions occur.**

## Preliminay 


### Granger causality

- Granger causality assumes that **if knowing past values of** $X$ **improves the prediction of** $Y$**, then** $X$ **'Granger causes'** $Y$**.**


$$
x_t^{(j)} :=f^{(j)}(\mathbf{x}^{(1)}_{≤t-1},...,\mathbf{x}^{(d)}_{≤t-1})+u^{(j)}_t,\text{  for } 1 \leq j \leq d, \tag 1
$$


- $\mathbf{x}^{(j)}_{≤t-1}$ :  past of time series $j$, $u^{(j)}_t$ : exogenous variable for time series $j$
- If time series $i $ granger causes $j$

    
$$
f^{(j)}(..., \mathbf x_{\leq t-1}^{(i)}, ...) \neq f^{(j)}(..., \mathbf x_{\leq t-1}^{\prime (i)}, ...)
$$
    

- Granger causality **assumes no hidden confounding and no instantaneous effects,** which can lead to erroneous conclusions if violated.
- Granger causality는 **숨겨진 혼란 변수나 즉각적인 영향을 고려하지 않는다는 가정을 가지고 있으며**, 이 가정이 위반되면 잘못된 결론을 초래할 수 있다.

### Exogenous variable

- In the context of Granger causality, the function $f(\mathbf{x}_{\leq{t-1}})$ predicts the current state $\mathbf{x}_t$ based on past data:


$$
\mathbf x_t=f(\mathbf x_{≤t−1})
$$


- However, **perfect prediction is impossible in real-world scenarios.**
    - Some variations in $\mathbf{x}_t$ **can’t be predicted by past values** through Granger causality.
    - This unexplained portion is defined as the **exogenous variable** $\mathbf{u}_t$, capturing unpredictable external influences:

        
$$
\mathbf u_t=\mathbf x_t−f(\mathbf x_{≤t−1}) \tag3
$$
        

    - If $\mathbf x_t$ were perfectly predictable through Granger causality, then the exogenous variable would be zero: $\mathbf{u}_t = 0$

## Methodology


![](/assets/seminars/root-cause-analysis-of-anomalies-in-multivariate-time-series-through-granger-cau/0.png)


## 1. Problem formulation and framework

- Anomalies in multivariate time series are caused by **interventions on exogenous variables, which can lead to point or sequential anomalies.**
    - Point Anomaly : An exogenous intervention occurring at a **specific time step.**
    - Sequential Anomaly : An exogenous intervention **propagating through time or continuously occurring over time steps.**
- **The exogenous variable** $( \hat{u}_t^{(j)})$ **is defined as the sum of the normal value** $( u_t^{(j)})$ **and the anomaly term** $( \epsilon_t^{(j)} )$.

    
$$
\tilde{x}_t^{(j)} = f^{(j)}\left(x_{\leq t-1}^{(1)}, \cdots, x_{\leq t-1}^{(d)}\right) + \hat{u}_t^{(j)}, \quad \hat{u}_t^{(j)} = u_t^{(j)} + \epsilon_t^{(j)} \text{ for }
1 \leq j \leq d, \tag{2}
$$
    

- The task is to **locate the variables** $j$ **and the time steps** $t$ where exogenous interventions occur.
- AERCA uses an encoder-decoder structure to explicitly model exogenous variables and distinguish root causes from downstream impacts.
    - Encoder : Infers the exogenous variables based on the observed data.
        - **Computes exogenous variables** $u_t$
    - Decoder : Predicts the current values from the exogenous variables following Granger causality.
        - **Reconstructing the current time step as a function of all previous exogenous variables**(recursive resolution).

## 2. Granger causal discovery


### Motivation

- The encoder-decoder structure is adopted to simulate abductive and deductive reasoning processes for **modeling the data generation process.**
    - **Generation process : causal relationships + exogenous variables**
- Encoder(Abductive Reasoning) : Abductive reasoning infers the **most plausible exogenous variables (**$\mathbf u_t$**) that could have generated the observed past data** $\mathbf x_t$**.**
    - **Extracts exogenous variables** $\mathbf{u}_t$ **by removing the explainable part of** $\mathbf{x}_t$ **using Granger causality.**
    - i.e., **learning Granger causal relationships** $f(⋅)$.

    
$$
\mathbf u_t: = \mathbf x_t-f(\mathbf x_{\leq{t-1}}), \tag 3
$$
    

- Decoder(Deductive Reasoning) : Deductive reasoning **reconstructs the observed data** $\mathbf x_t$ **from the exogenous variables** $\mathbf u_t$.
    - The decoder leverages recursive resolution to **reconstruct the current time step** $\mathbf x_t$ **by iteratively resolving past time steps(t-1, t-2,…, 1) based on exogenous variables** $\mathbf u_t$**.**
        - Reconstructs $\mathbf{x}_t$ **using only past exogenous variables** $\mathbf{u}_{\leq{t-1}}$ **to ensure a causal structure.**
        - Because Granger causality is based on the interaction between past data and exogenous variables.
    - Reconstructs the current time step $\mathbf x_t$ using computed exogenous variables $\mathbf u_{\leq t-1}$ from Equation (4).
    - i.e., **predict current times step** $\mathbf x_t$**.**

    
$$
\mathbf x_t = f(\mathbf u_{\leq{t-1}})+\mathbf u_t. \tag 4
$$
    


##  3. Encoder - decoder structure

- We define a sliding window of length $K$ and convert the time series into a sequence of sliding windows.
    - The sliding window approach enables **capturing local temporal dependencies effectively.**
    - The $k$-th neural network predicts the Granger causality between $\mathbf x_{t-k}$ and $\mathbf  x_t$.

    
$$
\mathbf X = (\mathbf x_1, ..., \mathbf x_t) → \text{ define }\mathbf W_t = (\mathbf x_{t-K+1},..., \mathbf x_t)
$$
    


    
$$
\mathbf W = (\mathbf W_K, \mathbf W_{K+1},...,\mathbf W_T)
$$
    


### Encoder: Granger causality learning

- $w_{\theta_k}(\mathbf x_{t-k})$ **:** $k$-th neural networks($w_{\theta_k}(·)$) predict weights of past $k$ time series to derive $\mathbf x_t$.
    - **Predict the granger causal relationship between** $\mathbf x_{t-k}$ **and** $\mathbf x_t$**.**

        
$$
\mathbf x_t = \sum^K_{k=1}\omega_{\theta_k}(\mathbf x_{t-k})\mathbf x_{t-k}+\mathbf u_t. \tag5
$$
        

- The encoder computes exogenous variables $\mathbf U_t$ from each time window.
    - **Calculate** $\mathbf U_t = (\mathbf u_{t-K+1},...,\mathbf u_t) $ **by** $K$ **times encoding**

        
$$
\mathbf u_t = \mathbf x_t-\sum^K_{k=1}\omega_{\theta_k}(\mathbf x_{t-k})\mathbf x_{t-k}. \tag6
$$
        

- Independence Constraint : **The independence constraint ensures exogenous variables** $\mathbf U_t$ **follows a standard isotropic Gaussian distribution.**
    - The distribution difference is quantified using the KL divergence.
    - The **exogenous variables should be uncorrelated and independent of each other.**
    - So use $\mu_Q = 0$ and $\Sigma_Q = I$ to enforce this property.

    
$$
D_t^{\text{KL}}(P(\mathbf U_t) \| Q)= \frac{1}{2} \text{tr}(\Sigma_Q^{-1}\Sigma_t) + (\mu_Q -\mu_t)^T\Sigma^{-1}_Q(\mu_Q- \mu_t)- d+\text{log}\frac{\text{det}\Sigma_Q}{\log \det \Sigma_t}.
$$
    


    
$$
= \frac{1}{2} \text{tr}(\Sigma_t) + \mu_t^T \mu_t - d - \log \det \Sigma_t.
$$
    


### Decoder : Reconstruction

- To address infinite time series length, **we iteratively replace** $x_{t-k}$ **with subsequences of length** $n$**.**
- Proposition1 : Autoregressive Model
    - $\mathbf x_t$ **can be reconstructed from exogenous variables(**$\mathbf u_{t-1},...,\mathbf u_{t-K}$**)** and **observed time series in previous windows(**$\mathbf x_{t-K-1},...,\mathbf x_{t-2k})$**.**

    
$$
\mathbf x_t = \sum_{m=1}^K \alpha_{K-m} \mathbf u_{t-(K-m)} + \alpha_K \mathbf x_{t-K} + \sum_{m=2}^{K+1} \alpha_{K+1-m} \sum_{k=m}^K \omega_k \mathbf x_{t-k-(K+1-m)} \tag{8}
$$
    

    - $w_k $ : parameter of Granger causality, $\alpha_n $ : Weights defined by recursive relationships.
- Decoder structure : **The decoder combines observed time series and exogenous variables to reconstruct** $\mathbf x_t$**.**
    - Recursive weights $\alpha_n$ defined in Proposition 1 are used to effectively model the **temporal dependencies across** $K$**-steps, enabling accurate reconstruction of** $\mathbf x_t$**.**

    
$$
\hat{\mathbf x}_t = \sum_{k=1}^K \bar{\omega}_{\bar{\theta}_k}(\mathbf u_{t-k}) \mathbf u_{t-k} + \sum_{k=1}^K \bar{\omega}'_{\bar{\theta}'_k}(\mathbf x_{t-K-k}) \mathbf x_{t-K-k} + \mathbf u_t \tag{9}
$$
    

    - $\bar{\omega}_{\bar{\theta}_k}(\mathbf u_{t-k})$ : The impact of the exogenous variable $\mathbf u_{t-k}$ on $\mathbf x_t$.
    - $\bar{\omega'}_{\bar{\theta'}_k}(\mathbf x_{t-K-k})$ : The impact of the observed data $\mathbf x_{t-K-k}$ on $\mathbf x_t$.
- The entire encoder-decoder structure is defined as follows:


$$
\hat {\mathbf x}_t = AE_{\theta_k, \bar\theta_k, \bar\theta'_k}(\mathbf x_{＜t})
$$



### Encoder-decoder objective fuction 

- The objective function **minimizes reconstruction error while ensuring independence and smoothness.**

    
$$
\mathcal{L} = \sum_{t=K+1}^T \left(\| \hat{\mathbf x}_t - \mathbf x_t \|_2 + \beta D_t^{\text{KL}} + \lambda_{\text{en}} R(\Omega_t) + \lambda_{\text{de}} R(\bar{\Omega}_t) + \lambda_{\text{de}} R(\bar{\Omega}'_t)\right) + \sum_{t=K+1}^{T-1} \left(\gamma_{\text{en}} S(\Omega_{t+1}, \Omega_t) + \gamma_{\text{de}} S(\bar{\Omega}_{t+1}, \bar{\Omega}_t) + \gamma_{\text{de}} S(\bar{\Omega}'_{t+1}, \bar{\Omega}'_t)\right). \tag{10}
$$
    

    - $\| \hat{\mathbf x}_t - \mathbf x_t \|_2$ : Minimizing the reconstruction error.
    - $D_t^{KL}$ : Encourages the exogenous variables to be maintained to an **independent distribution**.
    - $R(⋅)$ : **Sparsity constraint** applied through $\ell_1-$ and $\ell_2-$ norm penalties.
        - Encourages **focus on significant causal relationships, reducing noise.**
    - $S(⋅,⋅)$ : **Smoothness constraint.**
        - Promotes temporal consistency **by preventing abrupt changes in causal relationships.**
    - Encoder coefficient matrix $\Omega_t$ : Captures past $K$-step causal dependencies.
        - $Ω_t​:=[ω_{θ_K}​​(\mathbf x_{t−K}​):⋯:ω_{θ_1}​​(\mathbf x_{t−1}​)]$
    - Decoder coefficient matrix $\bar{\Omega}_t$ : Reconstructs $\mathbf x_t$ using exogenous variables $\mathbf u_t$.
        - $\bar Ω_t​:=[\bar ω_{θ_K}​​(\mathbf u_{t−K}​):⋯:\bar ω_{θ_1}​​(\mathbf u_{t−1}​)]$
    - Decoder coefficient matrix $\bar{\Omega}'_t$′: Uses past time series data to reconstruct $\mathbf x_t$.
        - $\bar Ω'_t​:=[\bar ω'_{θ'_K}​​(\mathbf x_{t−2K}​):⋯:\barω'_{θ'_1}​​(\mathbf x_{t−K-1}​)]$

### 4. Granger causal discovery : Encoder-Decoder structure and Granger causality learning

- The encoder-decoder simulates the data generation process and $ω_{\theta_k}$ **captures the causal relationships in the time series and make a coefficient matrix** $S.$
- A summarized granger causal graph is generated by aggregating $\omega_{\theta_k}$
    - Outputs into a **coefficient matrix** $S$ **and deriving the adjacency matrix** $A$ **based on a threshold** $\tau$**.**
    - $S_{i,j}$ : The impact of the variable $i$ on $j$.


$$
S_{i,j} = \max_{1 \leq k \leq K} \left\{ \text{median}_{K+1 \leq t \leq T} \left( |(\omega_{\theta_k}(\mathbf x_{t-k}))_{i,j}| \right) \right\}, A_{i,j} =
\begin{cases} 
1 & \text{if } S_{i,j} > \tau, \\
0 & \text{otherwise}.
\end{cases}
$$



## 5. Root cause localization

- The encoder estimates $u_{t^{*}}$ at the new time step, and **the z-score quantifies how much** $u^{(j)}_{t^*}$**deviates from normal behavior.**
    - SPOT(streamingpeaks-over-threshold) **determines the dynamic threshold** for labeling potential root causes based on z-scores.
    - This enables the method to **precisely identify which time series is affected by an exogenous intervention and from which time step onward.**

        
$$
z_{t^*}^{(j)} = \frac{u_{t^*}^{(j)}-\mu^{(j)}}{\sigma^{(j)}}
$$
        

        - $\mu, \sigma $ : mean and standard deviation of the exogeneous variables.

### Code


```javascript
# Sliding window를 적용하여 과거 K개 시점의 데이터를 입력으로 사용하고, 현재 시점을 예측

def encoding(self, xs):
    windows = sliding_window_view(xs, (self.window_size+1, self.num_vars))[:, 0, :, :]
    winds = windows[:, :-1, :]
    nexts = windows[:, -1, :]
    
    winds = torch.tensor(winds).float().to(self.device)
    nexts = torch.tensor(nexts).float().to(self.device)
    
    # 인코더를 통해 과거 데이터를 기반으로 현재 값 예측
    preds, coeffs = self.encoder(winds)
    
    # 예측값을 실제값에서 빼서 외생 변수 u_t 추출
    us = preds - nexts  
    return us, coeffs, nexts[self.window_size:], winds[:-self.window_size]
  
# 외생 변수 u_t가 표준 정규 분포를 따르도록 KL Divergence를 계산하여 독립성 강제

def compute_kl_divergence(us, device: torch.device):
    mean_p = torch.mean(us, dim=0)
    cov_p = torch.cov(us.t())

    d = mean_p.shape[0]
    eigenvalues = torch.linalg.eigvalsh(cov_p)
    condition_number = eigenvalues.max() / eigenvalues.clamp(min=1e-9).min()
    regularization_term = condition_number * 1e-6
    cov_p += torch.eye(d, device=device) * regularization_term

    trace_term = torch.trace(cov_p)
    means_term = torch.dot(mean_p, mean_p)

    try:
        L = torch.linalg.cholesky(cov_p)
        log_det_cov_p = 2 * torch.log(torch.diagonal(L)).sum()
    except RuntimeError:
        log_det_cov_p = torch.logdet(cov_p)

    kl_div = means_term + trace_term - d + log_det_cov_p
    return kl_div
```


```python
# 외생 변수 u_t와 과거 데이터를 조합하여 현재 시점 x_t 재구성

def decoding(self, us, winds, add_u=True):
    # 외생 변수를 기반으로 슬라이딩 윈도우 적용
    u_windows = sliding_window_view_torch(us, self.window_size+1)
    u_winds = u_windows[:, :-1, :]
    u_next = u_windows[:, -1, :]
    
    # 외생 변수를 사용해 현재 값을 예측
    preds, coeffs = self.decoder(u_winds)
    
    # 기존 데이터를 이용한 과거 예측값
    prev_preds, prev_coeffs = self.decoder_prev(winds)

    # 최종 재구성: 외생 변수와 과거 데이터 결합
    if add_u:
        nexts_hat = preds + u_next + prev_preds
    else:
        nexts_hat = preds + prev_preds
    return nexts_hat, coeffs, prev_coeffs
```


```python
# Loss function : MSE Loss + Sparsity Constraint + Smoothness Constraint + D^KL

# MSE Loss 계산
loss_recon = self.mse_loss(nexts_hat, nexts)  

# Sparsity Constraint
loss_encoder_coeffs = (1 - self.encoder_alpha) * torch.mean(torch.mean(torch.norm(encoder_coeffs, dim=1, p=2), dim=0)) + \
                      self.encoder_alpha * torch.mean(torch.mean(torch.norm(encoder_coeffs, dim=1, p=1), dim=0))

loss_decoder_coeffs = (1 - self.decoder_alpha) * torch.mean(torch.mean(torch.norm(decoder_coeffs, dim=1, p=2), dim=0)) + \
                      self.decoder_alpha * torch.mean(torch.mean(torch.norm(decoder_coeffs, dim=1, p=1), dim=0))

# Smoothness Constraint
loss_encoder_smooth = torch.norm(encoder_coeffs[:, 1:, :, :] - encoder_coeffs[:, :-1, :, :], dim=1).mean()
loss_decoder_smooth = torch.norm(decoder_coeffs[:, 1:, :, :] - decoder_coeffs[:, :-1, :, :], dim=1).mean()
loss_prev_smooth = torch.norm(prev_coeffs[:, 1:, :, :] - prev_coeffs[:, :-1, :, :], dim=1).mean()

# 전체 손실 함수 계산
loss = (loss_recon +  
        self.encoder_lambda * loss_encoder_coeffs +  
        self.decoder_lambda * loss_decoder_coeffs +  
        self.decoder_lambda * loss_prev_coeffs +  
        self.encoder_gamma * loss_encoder_smooth +  
        self.decoder_gamma * loss_decoder_smooth +  
        self.decoder_gamma * loss_prev_smooth +  
        self.beta * loss_kl)
```


```python
# 학습된 가중치의 중간값과 최댓값을 기반으로 인과 관계를 추론하고 adjacency matrix 생성

with torch.no_grad():
    for x in xs:
        loss, nexts_hat, nexts, encoder_coeffs, decoder_coeffs, kl_div, _, _ = self._testing_step(x)

        # 인코더와 디코더의 가중치를 기반으로 인과 관계 추론
        encoder_causal_struct_estimate_temp = torch.max(torch.median(torch.abs(encoder_coeffs), dim=0)[0], dim=0).values.cpu().numpy()
        decoder_causal_struct_estimate_temp = torch.max(torch.median(torch.abs(decoder_coeffs), dim=0)[0], dim=0).values.cpu().numpy()
```


```python
# POT(Peak-Over-Threshold) 기법을 적용하여 이상 탐지를 위한 dynamic threshold 설정
# 1. 데이터의 상위 2% (init_level = 0.98)를 초기 임계값으로 설정
# 2. Grimshaw 최적화 기법을 사용하여 동적으로 threshold를 조정

def pot(data: np.array, risk: float = 1e-2, init_level: float = 0.98, num_candidates: int = 10):
    # 초기 threshold: 데이터의 상위 2%를 설정
    t = np.sort(data)[int(init_level * data.size)]
    
    # threshold 이상인 값(peak values)을 추출
    peaks = data[data > t] - t

    # Grimshaw 최적화 기법을 사용하여 dynamic threshold 조정
    gamma, sigma = grimshaw(peaks=peaks, threshold=t, num_candidates=num_candidates)
    
    # 최종적으로 dynamic threshold 계산
    r = data.size * risk / peaks.size
    if gamma != 0:
        z = t + (sigma / gamma) * (pow(r, -gamma) - 1)
    else:
        z = t - sigma * log(r)
    
    return z, t
```


```javascript
# POT (Peak-Over-Threshold) 기법을 활용하여 이상치를 판별하고 root cause 식별

us_all_z_score_pot, us_all_z_score_initial = utils.utils.pot(us_all_z_score, self.risk, self.initial_level, self.num_candidates)
us_decoder_all_z_score_pot, us_decoder_all_z_score_initial = utils.utils.pot(us_decoder_all_z_score, self.risk, self.initial_level, self.num_candidates)

pred_root_cause_encoder_z_score_pot = us_all_z_score > us_all_z_score_pot
pred_root_cause_encoder_z_score_pot = pred_root_cause_encoder_z_score_pot.astype(int)

pred_root_cause_decoder_z_score_pot = us_decoder_all_z_score > us_decoder_all_z_score_pot
pred_root_cause_decoder_z_score_pot = pred_root_cause_decoder_z_score_pot.astype(int)
```


## Experiments


## Experimental setup


### Dataset : 4 synthetic dataset & 2 real world dataset

- The table shows the statistics of datasets used for training and evaluation.
    - Synthetic : Linear and Nonlinear datasets are synthetic, designed to evaluate AERCA's ability to capture causal structures under varying complexity.
    - Real world : Simulate real-world scenarios, such as attack simulations and fault injections.

![](/assets/seminars/root-cause-analysis-of-anomalies-in-multivariate-time-series-through-granger-cau/1.png)


### Evaluation metirxs : Causal Discovery & Root Cause Identification

- Causal discovery : **F1, AUC-ROC, and AUC-PR evaluate the correctness of edge discovery**, while **Hamming distance quantifies the disagreement between learned and ground truth causal graphs.**
    - F1 Score: Evaluates the precision and recall
    - AUC-ROC : Assesses the accuracy of causal relationship predictions
    - AUC-PR : Measures the performance of causal relationship predictions in imbalanced data
    - Hamming Distance (HD): Calculates the proportion of disagreement between the **learned causal graph and the ground truth causal graph**
- Root cause identification : $AC@K$
    - AC@K : Evaluates the probability of identifying **the correct root cause within the top** $K$ **ranked variables based on root cause scores.**
        - Ex) If the top-5 ranked variables include 3 out of 4 ground truth root causes, $AC@5 = 0.75$

        
$$
AC@K = \frac{1}{|\mathcal{X}|} \sum_{X \in \mathcal{X}} \frac{|V^{(RC)}_X \cap \{R_X[k] \mid k = 1, 2, \ldots, K\}|}{\min(K, |V^{(RC)}_X)|}
$$
        

        - $R_\mathbf X[k]$ : The variable with the $k$**-th highest predict root cause** score in sequence $X.$
        - $V_\mathbf X(RC)$ : The set of all **real root cause** variables in sequence $X.$
    - $Avg@K$ : Compute the overall performance by **computing the average**($\frac{1}{K}\sum^K_{k=1}AC@K$).

```javascript
# 가장 높은 anomaly score를 가진 상위 K 개의 변수를 root cause 후보로 평가

def topk(z_scores, label, threshold, k_range=500):
    ''' Top-k method

    Args:
        us: anomaly scores
        label: ground truth

    Returns:
        k: the number of top-k nodes
    '''
    z_scores = np.array(z_scores)
    us_above_threshold = np.where(z_scores > threshold, z_scores, 0.0)
    label = np.array(label)
    us_above_threshold = us_above_threshold.flatten()
    label = label.flatten()
    ranking = np.argsort(us_above_threshold)
    label_ind = np.where(label == 1)[0]
    
    k_lst = []
    for k in range(1, k_range+1):
        count = [1 if i in label_ind else 0 for i in ranking[-k:]]
        k_lst.append(sum(count)/min(k, len(label_ind)))
    
    return np.array(k_lst)
```


### Baseline

- Causal Discovery: Compare AERCA's Granger causality learning performance with 8 existing causal discovery models.
- Root Cause Identification: Compare AERCA's root cause localization performance with 3 existing root cause identification methods.

## Experimental results

- AERCA achieves state-of-the-art performance in both causal discovery and root cause identification.

### Performance of causal discovery

- AERCA achieves perfect performance on the Linear dataset, indicating error-free causal graph learning.
    - AERCA effectively discovers nonlinear causal relationships with high accuracy.

![](/assets/seminars/root-cause-analysis-of-anomalies-in-multivariate-time-series-through-granger-cau/2.png)


![](/assets/seminars/root-cause-analysis-of-anomalies-in-multivariate-time-series-through-granger-cau/3.png)


### Performance of root cause identification

- AERCA demonstrates exceptional performance across all datasets even at the AC@1 metric.
    - The SWaT dataset's performance decline can be attributed to the **presence of complex causal relationships and hidden confounders, which challenge the assumptions of independence and temporal causality.**

![](/assets/seminars/root-cause-analysis-of-anomalies-in-multivariate-time-series-through-granger-cau/4.png)


## Appendix


### Proposition 1



$$
\mathbf x_t = \sum_{m=1}^{K} \alpha_{K-m} \mathbf u_{t-(K-m)} + \alpha_K\mathbf  x_{t-K} + \sum_{m=2}^{K+1} \alpha_{K+1-m} \sum_{k=m}^{K} \omega_k \mathbf x_{t-k-(K+1-m)} \tag 8
$$


- 과거의 $\mathbf{x}_{t-k}$들이 특정 가중치 $\omega_k$를 가지고 현재 값에 영향을 미침


$$
\mathbf x_t
=
\sum_{k=1}^{K}
\omega_k
\,\mathbf x_{t-k}
\;+\;
\mu_t
$$




$$
\mathbf x_t
=
\omega_1\,\mathbf x_{t-1}
\;+\;
\sum_{k=2}^K
\omega_k\,\mathbf x_{t-k}
\;+\;
\mu_t
$$


- 이전 시점 $\mathbf{x}_{t-1}$을 다시 autoregressive equations $\sum_{k=1}^{K}
\omega_k
\,\mathbf x_{t-1-k}
\;+\;
\mu_{t-1}$으로 치환 :


$$
\mathbf x_t  = \omega_1 \left(\omega_1 \mathbf x_{t-2} + \sum_{k=2}^{K} \omega_k \mathbf x_{t-1-k} + \mu_{t-1}\right) +\left( \omega_2\mathbf  x_{t-2} + \sum_{k=3}^{K} \omega_k \mathbf x_{t-k} + \mu_t\right)
$$


- $\mathbf{x}_{t-2}$에 대해서도 같은 방식으로 다시 치환 :
    - 과거 데이터가 반복적으로 치환되면서, 시점이 점점 더 멀어진 데이터들까지 영향을 미침을 표현


$$
\mathbf x_t = 
\left( \omega_1^2 + \omega_2 \right) 
\left( \omega_1 \mathbf x_{t-3} + \sum_{k=2}^{K} \omega_k \mathbf x_{t-2-k} + \mu_{t-2} \right)
+ \omega_1 
\left( \omega_2 \mathbf x_{t-3} + \sum_{k=3}^{K} \omega_k \mathbf x_{t-1-k} + \mu_{t-1} \right)
+ \left( \omega_3 \mathbf x_{t-3} + \sum_{k=4}^{K} \omega_k \mathbf x_{t-k} + \mu_t \right)
$$


- 새로운 계수 정의 : $
\alpha_n =
\sum_{i=1}^{n}
\omega_n
\,\alpha_{n-i},
\quad
1 \le n \le K,
\quad
\alpha_0 = 1,
$
    - 각 $\alpha_n$은 과거 데이터가 현재 시점에 미치는 영향을 weight로 표현
    - $\alpha_n$은 과거 시점에서 현재 시점으로 영향을 주는 누적 가중치로, 모델을 통해 점진적으로 학습됨


$$
\mathbf x_t
=
\alpha_{2}\left(\omega_1\,\mathbf x_{t-3}
\;+\;
\sum_{k=2}^K
\omega_k
\,\mathbf x_{t-2-k}
\;+\;
\mu_{t-2}\right)
\;+\;
\alpha_{1}\left(\omega_2\,\mathbf x_{t-3}
\;+\;
\sum_{k=3}^K
\omega_k\,\mathbf x_{t-1-k}
\;+\;
\mu_{t-1}\right)
\;+\;
\alpha_{0}\left(\omega_3\,\mathbf x_{t-3}
\;+\;
\sum_{k=4}^K
\omega_k
\,\mathbf x_{t-k}
\;+\;
\mu_{t}\right)
$$


- 일반화 : 외생 변수 $\mathbf{u}$와 관측된 데이터 $\mathbf{x}$를 결합하여 현재 시점의 값을 복원할 수 있음을 보일 수 있음


$$
\mathbf x_t = 
\alpha_{n-1} 
\left( \omega_1 \mathbf x_{t-n} + \sum_{k=2}^{K} \omega_k \mathbf x_{t-k-n+1} + \mu_{t-n+1} \right)
+ \alpha_{n-2} 
\left( \omega_2 \mathbf x_{t-n} + \sum_{k=3}^{K} \omega_k \mathbf x_{t-k-n+2} + \mu_{t-n+2} \right)
+ \cdots + \alpha_0 
\left( \omega_n \mathbf x_{t-n} + \sum_{k=n+1}^{K} \omega_k \mathbf x_{t-k} + \mu_t \right).
$$


- Rearranging the above expression :


$$
\mathbf x_t = \sum_{m=1}^{n} \alpha_{n-m} \mathbf u_{t-(n-m)} + \alpha_n \mathbf x_{t-n} + \sum_{m=2}^{n+1} \alpha_{n+1-m} \sum_{k=m}^{K} \omega_k \mathbf x_{t-k-(n+1-m)}
$$


- rewritten n as K(proposition 1) : $α_n$과 $\omega_k$가 주어진 데이터에서 도출된 고정된 값이 됨


$$
\mathbf x_t = \left(\sum_{m=1}^{K} \alpha_{K-m} \mathbf u_{t-(K-m)}\right) + \left(\alpha_K \mathbf x_{t-K} + \sum_{m=2}^{K+1} \alpha_{K+1-m} \sum_{k=m}^{K} \omega_k \mathbf x_{t-k-(K+1-m)}\right) \tag 8
$$


- Granger 인과 관계를 학습한 가중치 $\alpha_n$과 $\omega_k$를 신경망 기반 가중치$\bar{\omega}_{\bar{\theta}_k}$, $\bar{\omega}'_{\bar{\theta}'_k}$로 변환
    - 신경망이 학습한 가중치 $\bar{\omega}_{\bar{\theta}_k}$와 $\bar{\omega}'_{\bar{\theta}'_k}$로 표현하여 더 유연하게 모델링(기존 $\omega_k$는 고정 값)
    - $\mathbf u$가 직접적인 영향을 미치는 부분과, 과거 $\mathbf{x}$가 영향을 주는 부분을 명확히 분리하여 모델을 구성됨
    - 디코더 모델에서 현재 시점의 **외생 변수(**$\mathbf u$**)를 추가하여 최종적인 값을 보정함**


$$
\hat{\mathbf x}_t = \left(\sum_{k=1}^K \bar{\omega}_{\bar{\theta}_k}(\mathbf u_{t-k}) \mathbf u_{t-k}\right) + \left(\sum_{k=1}^K \bar{\omega}'_{\bar{\theta}'_k}(\mathbf x_{t-K-k}) \mathbf x_{t-K-k}\right) + \mathbf u_t \tag{9}
$$
