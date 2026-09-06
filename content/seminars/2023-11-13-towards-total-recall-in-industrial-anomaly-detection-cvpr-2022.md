---
date: 2023-11-13
title: Towards Total Recall in Industrial Anomaly Detection (CVPR 2022)
category: Paper Review
presenter: 강태원
url: https://www.notion.so/aa90edda3406416082be5c6d5b557339
keywords: Anomaly Detection
---

# Selected Paper


## Abstract: 


Being able to spot defective parts is a critical component in large-scale industrial manufacturing. A particular challenge that we address in this work is the cold-start problem: fit a model using nominal (non-defective) example images only. While handcrafted solutions per class are possible, the goal is to build systems that work well simultaneously on many different tasks automatically. The best peforming approaches combine embeddings from ImageNet models with an outlier detection model. In this paper, we extend on this line of work and propose PatchCore, which uses a maximally representative memory bank of nominal patch-features. PatchCore offers competitive inference times while achieving state-of-the-art performance for both detection and localization. On the challenging, widely used MVTec AD benchmark PatchCore achieves an image-level anomaly detection AUROC score of up to 99.6%, more than halving the error compared to the next best competitor. We further report competitive results on two additional datasets and also find competitive results in the few samples regime. 


## Link


[CVPR 2022 Open Access Repository (thecvf.com)](https://openaccess.thecvf.com/content/CVPR2022/html/Roth_Towards_Total_Recall_in_Industrial_Anomaly_Detection_CVPR_2022_paper.html)


## Paper Review: 

1. pre-trained model 활용으로 별도의 학습과정 없이 이미지 이상치 탐지를 수행하는 PatchCore 모델 소개
2. 정상 데이터의 feature를 활용하여 적은 양의 정상 이미지만으로도 높은 성능의 탐지 가능
3. High-level feature 활용의 단점(공간적 정보 손실)을 보완하기 위한 Mid-level feature 활용

# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.


Patchcore_1108
