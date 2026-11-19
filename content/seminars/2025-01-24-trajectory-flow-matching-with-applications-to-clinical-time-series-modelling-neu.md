---
date: 2025-01-24
title: Trajectory Flow Matching with Applications to Clinical Time Series Modelling (NeurIPS 2024)
category: Paper Review
presenter: Jae Hun Cho
url: https://www.notion.so/2017013160aa4616a9bbca865c34b07c
keywords: Irregular time series, Flow Matching, Clinical time series
---

# Selected Paper


## Title: **Trajectory Flow Matching with Applications to Clinical Time Series Modelling**


## Abstract: 


Modeling stochastic and irregularly sampled time series is a challenging problem found in a wide range of applications, especially in medicine. Neural stochastic differential equations (Neural SDEs) are an attractive modeling technique for this problem, which parameterize the drift and diffusion terms of an SDE with neural networks. However, current algorithms for training Neural SDEs require backpropagation through the SDE dynamics, greatly limiting their scalability and stability. To address this, we propose **Trajectory Flow Matching** (TFM), which trains a Neural SDE in a _simulation-free_ manner, bypassing backpropagation through the dynamics. TFM leverages the flow matching technique from generative modeling to model time series. In this work we first establish necessary conditions for TFM to learn time series data. Next, we present a reparameterization trick which improves training stability. Finally, we adapt TFM to the clinical time series setting, demonstrating improved performance on four clinical time series datasets both in terms of absolute performance and uncertainty prediction, a crucial parameter in this setting.




## Link


[https://openreview.net/forum?id=fNakQltI1N&referrer=[the profile of Alexander Tong](%2Fprofile%3Fid%3D~Alexander_Tong1)](https://openreview.net/forum?id=fNakQltI1N&referrer=%5Bthe%20profile%20of%20Alexander%20Tong%5D(%2Fprofile%3Fid%3D~Alexander_Tong1))


# Seminar Slide



[📄 첨부파일 ↗](https://github.com/UNIST-DA/unist-da.github.io/releases/download/seminar-assets/2025-01-24-trajectory-flow-matching-with-applicatio-0.pdf)



# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
