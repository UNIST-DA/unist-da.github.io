---
date: 2025-03-14
title: CARLA: Self-supervised contrastive representation learning for time series anomaly detection (Pattern Recognition 2025)
category: Lab Seminar
presenter: Yongmin Kim
url: https://www.notion.so/1525af7835be4d8a8f2ae5f5a350b9ce
keywords: Contrastive learning, Self-supervised Learning, Time-series anomaly detection, Anormaly Injection
---

# Selected Paper


## Title: CARLA: Self-supervised contrastive representation learning for time series anomaly detection


## Abstract: 


One main challenge in time series anomaly detection (TSAD) is the lack of labelled data in many real life scenarios. Most of the existing anomaly detection methods focus on learning the normal behaviour of unlabelled time series in an unsupervised manner. The normal boundary is often defined tightly, resulting in slight deviations being classified as anomalies, consequently leading to a high false positive rate and a limited ability to generalise normal patterns. To address this, we introduce a novel end-to-end self-supervised ContrAstive Representation Learning approach for time series Anomaly detection (CARLA). While existing contrastive learning methods assume that augmented time series windows are positive samples and temporally distant windows are negative samples, we argue that these assumptions are limited as augmentation of time series can transform them to negative samples, and a temporally distant window can represent a positive sample. Existing approaches to contrastive learning for time series have directly copied methods developed for image analysis. We argue that these methods do not transfer well. Instead, our contrastive approach leverages existing generic knowledge about time series anomalies and injects various types of anomalies as negative samples. Therefore, CARLA not only learns normal behaviour but also learns deviations indicating anomalies. It creates similar representations for temporally close windows and distinct ones for anomalies. Additionally, it leverages the information about representations’ neighbours through a self-supervised approach to classify windows based on their nearest/furthest neighbours to further enhance the performance of anomaly detection. In extensive tests on seven major real-world TSAD datasets, CARLA shows superior performance (F1 and AU-PR) over state-of-the-art self-supervised, semi-supervised, and unsupervised TSAD methods for univariate time series and multivariate time series. Our research highlights the immense potential of contrastive representation learning in advancing the TSAD field, thus paving the way for novel applications and in-depth exploration.


## Link



[📄 자료 링크 ↗](https://www.sciencedirect.com/science/article/pii/S0031320324006253)



# Seminar Slide



[📄 PDF 자료 ↗](https://github.com/UNIST-DA/unist-da.github.io/releases/download/seminar-assets/2025-03-14-carla-self-supervised-contrastive-repres-0.pdf)



# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.


ModernTCN


[https://github.com/luodhhh/ModernTCN](https://github.com/luodhhh/ModernTCN)


CNN 기반 TS 모델 다시 부각시키는 논문

- 기본적인 것을 다시 돌아본다는 측면에서 관심이 간다.

ICLR 2024 spotlight


---


TimeMixer


[https://github.com/kwuking/TimeMixer](https://github.com/kwuking/TimeMixer)


다양한 측정 주기의 TS 데이터들을 이용하는 것과 관련된 논문인듯? - 우리 쪽이랑 관련 있을 것 같음


ICLR 2024 Poster
