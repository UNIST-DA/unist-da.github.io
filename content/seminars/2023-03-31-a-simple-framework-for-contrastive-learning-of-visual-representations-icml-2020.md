---
date: 2023-03-31
title: A Simple Framework for Contrastive Learning of Visual Representations (ICML 2020)
category: Lab Seminar
presenter: 유지태
url: https://www.notion.so/d433b50be9f949ff86dc36951387a49f
keywords: Contrastive learning, visual representation, Self-supervised Learning
---

# Selected Paper


## Title: **A Simple Framework for Contrastive Learning of Visual Representations**


## Abstract: 


This paper presents SimCLR: a simple framework for contrastive learning of visual representations. We simplify recently proposed contrastive self-supervised learning algorithms without requiring specialized architectures or a memory bank. In order to understand what enables the contrastive prediction tasks to learn useful representations, we systematically study the major components of our framework. We show that (1) composition of data augmentations plays a critical role in defining effective predictive tasks, (2) introducing a learnable nonlinear transformation between the representation and the contrastive loss substantially improves the quality of the learned representations, and (3) contrastive learning benefits from larger batch sizes and more training steps compared to supervised learning. By combining these findings, we are able to considerably outperform previous methods for self-supervised and semi-supervised learning on ImageNet. A linear classifier trained on self-supervised representations learned by SimCLR achieves 76.5% top-1 accuracy, which is a 7% relative improvement over previous state-of-the-art, matching the performance of a supervised ResNet-50. When fine-tuned on only 1% of the labels, we achieve 85.8% top-5 accuracy, outperforming AlexNet with 100X fewer labels.


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/0.png)


## Link



[📄 자료 링크 ↗](https://arxiv.org/pdf/2002.05709.pdf)



# Preliminaries 


**Memory Bank:**


A memory bank consists of the representations of all samples in the dataset.


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/1.png)


**Pretext:** 


Pretext tasks are pre-designed tasks for networks to solve, and visual features are learned by learning objective functions of pretext tasks.



**Downstream Task:**


Downstream tasks are computer vision applications that are used to evaluate the quality of features learned by self-supervised learning. These applications can greatly benefit from the pretrained models when training data are scarce.



[📄 자료 링크 ↗](https://arxiv.org/pdf/1902.06162.pdf)



  


# Introduction


**Learning effective visual representation**

- Generative
    - Pixel wise generation is computationally expensive
- Discriminative
    - Learning representation using objective function
    - Pretext tasks  have relied on hueristics → limit the generality of learned representation

⇒ Discriminative learning with contrastive learning in the latent space 


**Main contribution**

- Composition of multiple data augmentation operations is crucial **(Color distortion + Cropping)**in defining the contrastive prediction tasks that
yield effective representations. In addition, unsupervised contrastive learning benefits from stronger data augmentation than supervised learning.
- Introducing a learnable nonlinear transformation **(MLP)**between the representation and the contrastive loss substantially improves the quality of the learned representations.
- Representation learning with contrastive cross entropy loss benefits from normalized embeddings and an appropriately adjusted temperature parameter.
- Contrastive learning benefits from larger batch sizes **(color distortion)**and longer training compared to its supervised counterpart. Like supervised learning, contrastive learning benefits from deeper and wider networks.

⇒ Achieve a new state-of-the-art in self-supervised and semi-supervised learning on ImageNet ILSVRC-2012


# Method


SimCLR learns representations by maximizing agreement between differently augmented views of the same data example via a contrastive loss in the latent space.


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/2.png)

- A stochastic data augmentation module that transforms any given data example randomly resulting in two correlated views of the same example, denoted $\tilde{x}_{i}$ and $\tilde{x}_{j}$ (Positive pair)
    - random cropping, random color distortions, and random Gaussian blur
- A neural network base encoder $f(·)$ that extracts representation vectors from augmented data examples
    - ResNet
    - $h_{i} = f(\tilde{x}_{i}) = ResNet(\tilde{x}_{i})$   where   $h_{i} ∈ R^{d}$
- A small neural network projection head $g(·) $ that maps representations to the space where contrastive loss is applied.
    - $z_{i} = g(h_{i}) = W^{(2)}σ(W^{(1)}h_{i})$ where σ is a ReLU nonlinearity
- A contrastive loss function defined for a contrastive prediction task. Given a set { $ \tilde{x}_{i}$} including a positive pair of examples $\tilde{x}_{i} $ and, $\tilde{x}_{j}$ the contrastive prediction task aims to identify $\tilde{x}_{i}$ in $\left\{\tilde{\boldsymbol{x}}_k\right\}_{ k \neq i}$ for a given $\tilde{x}_{i}$

### NT-Xent


 The loss function for a positive pair of examples $(i, j)$ is defined as


    $
    \ell_{i, j}=-\log \frac{\exp \left(\operatorname{sim}\left(\boldsymbol{z}i, \boldsymbol{z}j\right) / \tau\right)}{\sum_{k=1}^{2N} \mathbb{1}{[k \neq i]} \exp \left(\operatorname{sim}\left(\boldsymbol{z}_i, \boldsymbol{z}k\right) / \tau\right)},
    $

    - A minibatch of $N$ examples
    - Augmented examples, resulting in $2 N$ data points.
    - The other $2(N-1)$ augmented examples =  negative examples.
    - $\operatorname{sim}(\boldsymbol{u}, \boldsymbol{v})=\boldsymbol{u}^{\top} \boldsymbol{v} /\|\boldsymbol{u}\|\|\boldsymbol{v}\| $denote the dot product between $\ell_2 $ normalized $\boldsymbol{u}$ and $\boldsymbol{v}$ (i.e. cosine similarity).
    - $\mathbb{1}{[k \neq i]} \in\{0,1\}$ is an indicator function evaluating to 1 iff $k \neq i $
    - $\tau$ denotes a temperature parameter.

![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/3.png)


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/4.png)


figure: [https://amitness.com/2020/03/illustrated-simclr/](https://amitness.com/2020/03/illustrated-simclr/)


### Training stage with large batch size


Unstable Training with large batch size 

- To stabilize the training, we use the LARS optimizer

local information leakage

- address this issue by aggregating BN mean and variance over all devices during the training.

### Default setting

- ResNet-50 as the base encoder network
- A 2-layer MLP projection head to project the representation to a 128-dimensional latent space.
- batch size 4096

# Experiment


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/5.png)


### Random cropping 


Existing method: Two different architecture needed


a) global-to-local view prediction via constraining the receptive field in the network architecture


b) neighboring view prediction via a fixed image splitting procedure and context  aggregation network


### **Studied augmentation list**


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/6.png)


### Composition of data augmentation operations is crucial for learning good representations


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/7.png)

- Random color + distortion
    - No single transformation suffices to learn good representations

### Contrastive learning needs stronger data augmentation than supervised learning


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/8.png)


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/9.png)

- Fig 6. shows color distortion enough to distinguish images
- It show that unsupervised contrastive learning benefits from stronger (color) data augmentation than supervised learning.

### Unsupervised contrastive learning benefits (more) from bigger models


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/10.png)


### A nonlinear projection head improves the representation quality of the layer before it


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/11.png)


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/12.png)

- Non Linear projection performs better
- However, it takes information loss  due to contrastive loss therefore, for down stream task, we does not use g()

### Normalized cross entropy loss with adjustable temperature works better than alternatives


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/13.png)


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/14.png)

- Unlike cross-entropy, other objective functions do not weigh the negatives by their relative hardness.

![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/15.png)

- Proper scaling and $l_{2}$ is important.
- without normalization and proper temperature scaling, performance is significantly worse.
- Without normalization, the contrastive task accuracy is higher, but the resulting representation is worse under linear evaluation(Top1)
- Contrastive prediction task:  perfectly identify the positive pairs in the contrastive task

### Contrastive learning benefits (more) from larger batch sizes and longer training


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/16.png)

- when the number of training epochs is small (e.g. 100 epochs), larger batch sizes have a significant advantage over the smaller ones.

### Comparison with State-of-the-art

- Self-supervised setting

![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/17.png)

- Semi supervised setting

![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/18.png)


# Conclusion

- It presents a simple framework and its instantiation for contrastive visual representation learning
- It improves considerably over previous methods for selfsupervised, semi-supervised, and transfer learning
- The use of a nonlinear head at the end of the network, and the loss function.

# Appendix.


### Accuracy


**Top-1 accuracy** is the conventional accuracy: the model answer (the one with highest probability) must be exactly the expected answer.


**Top-5 accuracy** means that _any_ of your model 5 highest probability answers must match the expected answer.


## Triplet Loss


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/19.png)


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/20.png)


### Cross entropy


![](/assets/seminars/a-simple-framework-for-contrastive-learning-of-visual-representations-icml-2020/21.png)


# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
