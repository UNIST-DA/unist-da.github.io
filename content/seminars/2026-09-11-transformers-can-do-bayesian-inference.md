---
date: 2026-09-11
title: Transformers Can Do Bayesian Inference
category: Paper Review
presenter: Yongmin Kim
url: https://www.notion.so/3d8046396f7e8051933edf8f63db57ca
keywords: Bayesian Inference, foundation model
---

# Selected Paper


## Title: 


[Transformers Can Do Bayesian Inference (ICLR 2022)](https://arxiv.org/pdf/2112.10510)


## Abstract: 


Currently, it is hard to reap the benefits of deep learning for Bayesian methods,
which allow the explicit specification of prior knowledge and accurately cap-
ture model uncertainty. We present Prior-Data Fitted Networks (PFNs). PFNs
leverage in-context learning in large-scale machine learning techniques to ap-
proximate a large set of posteriors. The only requirement for PFNs to work is
the ability to sample from a prior distribution over supervised learning tasks (or
functions). Our method restates the objective of posterior approximation as a
supervised classification problem with a set-valued input: it repeatedly draws
a task (or function) from the prior, draws a set of data points and their labels
from it, masks one of the labels and learns to make probabilistic predictions for
it based on the set-valued input of the rest of the data points. Presented with a
set of samples from a new supervised learning task as input, PFNs make proba-
bilistic predictions for arbitrary other data points in a single forward propagation,
having learned to approximate Bayesian inference. We demonstrate that PFNs
can near-perfectly mimic Gaussian processes and also enable efficient Bayesian
inference for intractable problems, with over 200-fold speedups in multiple setups
compared to current methods. We obtain strong results in very diverse areas such
as Gaussian process regression, Bayesian neural networks, classification for small
tabular data sets, and few-shot image classification, demonstrating the general-
ity of PFNs. Code and trained PFNs are released at [https://github.com/](https://github.com/)
automl/TransformersCanDoBayesianInference.


## Link


[https://arxiv.org/pdf/2112.10510](https://arxiv.org/pdf/2112.10510)


# Seminar Slide



[📄 PDF 자료 ↗](https://github.com/UNIST-DA/unist-da.github.io/releases/download/seminar-assets/2026-09-11-transformers-can-do-bayesian-inference-0.pdf)



# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
