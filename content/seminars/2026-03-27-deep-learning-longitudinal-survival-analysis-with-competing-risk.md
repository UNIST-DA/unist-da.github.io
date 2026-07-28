---
date: 2026-03-27
title: Deep Learning Longitudinal Survival Analysis with Competing Risk
category: Lab Seminar
presenter: SeungSu Kam
url: https://www.notion.so/32f046396f7e80b6807fe5be4ea9f2d9
keywords: Survival Analysis, Deep Learning, Irregular time series
---

# Selected Paper


## Title: Cui, Chang, Yongqiang Tang, and Wensheng Zhang. "Disentangled and reassociated deep representation for dynamic survival analysis with competing risks." _Knowledge-Based Systems_ 315 (2025): 113295.

Abstract: 


Survival analysis has been extensively utilized to analyze when the event of interest occurs. However, most of present studies merely focus on single risk and static data, while incapable of handling the scenario where competing risks and longitudinal observations are involved, which is prevalent in clinical practice, especially in the [ICU](https://www.sciencedirect.com/topics/engineering/intensive-care-unit). Although some impressive progress has been made in recent years, they generally utilize a single encoder to learn patient representations and input identical representations into each cause-specific [subnetwork](https://www.sciencedirect.com/topics/engineering/subnetwork) to learn the survival distribution of competing risks, thereby neglecting the specificity and association of each [risk factor](https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/risk-factor). In this study, we propose a novel model, namely competing risks disentangled and reassociated deep representation for dynamic survival analysis. On one hand, we propose risks-disentangled [autoencoders](https://www.sciencedirect.com/topics/engineering/autoencoder) to learn specific representations for each risk factor with contrastive learning. On the other hand, a risks-reassociated representation fusion module is proposed to explicitly learn the association relationships among competing risk representations with attention mechanism. Through extensive experiments on two popular clinical datasets, i.e., MIMIC-III and eICU, we demonstrate that our proposed model achieves advanced survival prediction performance. Visualization and interpretability analysis experiments are also provided to indicate the superior performance of our model.




## Link



[📄 자료 링크 ↗](https://www.sciencedirect.com/science/article/pii/S0950705125003429)



# Seminar Slide



[📄 PDF 자료 ↗](https://github.com/UNIST-DA/homepage_new/releases/download/seminar-assets/2026-03-27-deep-learning-longitudinal-survival-anal-0.pdf)



# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
