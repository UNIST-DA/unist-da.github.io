---
date: 2025-04-11
title: MTSCI: A Conditional Diffusion Model for Multivariate Time Series Consistent Imputation (CIKM 2024)
category: Lab Seminar
presenter: 이희윤
url: https://www.notion.so/1d1046396f7e8080983acdd19473ea9c
keywords: DeepLearning, time series, Diffusion Model
---

# Selected Paper


## Title: 


# **MTSCI: A Conditional Diffusion Model for Multivariate Time Series Consistent Imputation**



[📄 PDF 자료 ↗](https://github.com/UNIST-DA/homepage_new/releases/download/seminar-assets/2025-04-11-mtsci-a-conditional-diffusion-model-for--0.pdf)



## Abstract: 


Missing values are prevalent in multivariate time series, compromising the integrity of analyses and degrading the performance of downstream tasks. Consequently, research has focused on multivariate time series imputation, aiming to accurately impute the missing values based on available observations. A key research question is how to ensure imputation consistency, i.e., intra-consistency between observed and imputed values, and inter-consistency between adjacent windows after imputation. However, previous methods rely solely on the inductive bias of the imputation targets to guide the learning process, ignoring imputation consistency and ultimately resulting in poor performance. Diffusion models, known for their powerful generative abilities, prefer to generate consistent results based on available observations. Therefore, we propose a conditional diffusion model for Multivariate Time Series Consistent Imputation (MTSCI). Specifically, MTSCI employs a contrastive complementary mask to generate dual views during the forward noising process. Then, the intra contrastive loss is calculated to ensure intra-consistency between the imputed and observed values. Meanwhile, MTSCI utilizes a mixup mechanism to incorporate conditional information from adjacent windows during the denoising process, facilitating the inter-consistency between imputed samples. Extensive experiments on multiple real-world datasets demonstrate that our method achieves the state-of-the-art performance on multivariate time series imputation task under different missing scenarios.


## Link


[https://arxiv.org/abs/2408.05740](https://arxiv.org/abs/2408.05740)


# Seminar Slide



[📄 첨부파일 ↗](https://github.com/UNIST-DA/homepage_new/releases/download/seminar-assets/2025-04-11-mtsci-a-conditional-diffusion-model-for--1.pptx)



# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
