---
date: 2023-02-10
title: Transfusion: Understanding Transfer Learning for Medical Imaging (NeurIPS 2019)
category: Paper Review
presenter: Byungkook Koo
url: https://www.notion.so/b0fd0ca6eef7470fbdcb3f239c80a394
keywords: Medical Imaging, Transfer Learning, XAI
---

## Transfusion: Understanding Transfer Learning for Medical Imaging


⇒ Google brain 팀에서 연구된 NIPS 논문


## Abstract


Transfer learning from natural image datasets, particularly IMAGENET, using standard large models and corresponding pretrained weights has become a de-facto method for deep learning applications to medical imaging. However, there are fundamental differences in data sizes, features and task specifications between natural image classification and the target medical tasks, and there is little understanding ofthe effects of transfer. In this paper, we explore properties of transfer learning for medical imaging. A performance evaluation on two large scale medical imaging tasks shows that surprisingly, transfer offers little benefit to performance, and simple, lightweight models can perform comparably to IMAGENET architectures. Investigating the learned representations and features, we find that some of the differences from transfer learning are due to the over-parametrization of standard models rather than sophisticated feature reuse. We isolate where useful feature reuse occurs, and outline the implications for more efficient model exploration. We
also explore feature independent benefits of transfer arising from weight scalings.


## Link



[📄 자료 링크 ↗](https://proceedings.neurips.cc/paper/2019/hash/eb1e78328c46506b46a4ac4a1e378b91-Abstract.html)



# Review


**들어가기 전, 4줄 요약(main contribution)**

1. Medical imaging task에서는 적어도 IMAGENET 기반 transfer가 성능 향상에 도움이 되지 않음
2. smaller, simpler CNN 모델도 ResNet 같은 모델과 비슷한 성능을 낼 수 있음
3. Larger network(ResNet)의 경우 앞 단 layer는 transfer에 따른 변화가 거의 없음(feature reuse)
4. 앞의 결론들을 기반으로, 일반적인 transfer 방법과 비슷한 성능을 도출하는 간단한 방법들을 제안

## Introduction


Transfer learning in the present standard: to take an existing architecture designed for natural image datasets such as **IMAGENET**, together with corresponding pretrained weights then **fine-tune** the model on the **medical imaging data**


![ImageNet images](/assets/seminars/transfusion-understanding-transfer-learning-for-medical-imaging-neurips-2019/0.png)


Universal adoption across many different medical specialties

- **radiology**
    - training ResNet, DenseNet on chest x-rays

        ![Chest x-rays](/assets/seminars/transfusion-understanding-transfer-learning-for-medical-imaging-neurips-2019/1.png)

- **ophthalmology**
    - training Inceptionv3, ResNet on retinal fundus images

        ![retinal fundus images](/assets/seminars/transfusion-understanding-transfer-learning-for-medical-imaging-neurips-2019/2.png)


Transfer learning in medical imaging does not necessarily result in performance improvements


    ⇒ IMAGENET classification and medical image diagnosis have considerable differences

1. **Imaging tasks**
    - Medical imaging tasks: start with a large image of a <u>bodily region of interest</u>, use <u>variations in local textures</u> to identify pathologies
    - In natural image, there is often a clear <u>global subject</u> of the image
2. **Data quantity**
    - ImageNet: 120,0000
    - Medical Image: range from several thousand to couple hundred thousand
3. **Number of classes:** medical tasks often have significantly fewer classes

    → design of these models is likely to be suboptimal for the medical setting


## Dataset

1. RETINA data
    - consists of retinal fundus photographs(587 X 587)
    - used to diagnose including Diabetic Retinopathy(DR, graded on five-class scale of increasing severity)
2. CHEXPERT data
    - consists of chest x-ray images (resized to 224 × 224)
    - used to diagnose 5 thoracic pathologies
        - atelectasis, cardiomegaly, consolidation, edema and pleural effusion

## Models & Performance Evaluation of Transfer Learning

- select multiple neural network architectures and evaluate their performance when
    1. training from random initialization
    2. doing transfer learning from IMAGENET
- transfer learning from IMAGENET on **smaller, non-standard** IMAGENET architectures
    - large, computationally expensive models might significantly impede mobile and on-device applications
    - IMAGENET models are highly overparametrized
        - most of the parameters are concentrated at the top, to perform the 1000-class classification

⇒ transfer learning does not significantly affect performance


⇒ smaller lightweight CNNs performs comparably to standard IMAGENET models


### Description of Models

- **ResNet50, Inception-v3**: be used extensively in medical transfer learning applications
- **Family CBR(**CBR-LargeT, CBR-LargeW, CBR-Tiny**)**: smaller, simpler models
<details>
<summary>Specification</summary>
- CBR-LargeT(all) has 7x7 conv filters: (conv32-bn-relu) maxpool (conv64-bn-relu) maxpool
(conv128-bn-relu) maxpool (conv256-bn-relu) maxpool (conv512-bn-relu) global
avgpool, classification
- CBR-LargeW(ide) has 7x7 conv filters: (conv64-bn-relu) maxpool (conv128-bn-relu) maxpool
(conv256-bn-relu) maxpool (conv512-bn-relu) maxpool, global avgpool, classification
- CBR-Small has 7x7 conv filters: (conv32-bn-relu) maxpool (conv64-bn-relu) maxpool
(conv128-bn-relu) maxpool (conv256-bn-relu) maxpool global avgpool, classification
- CBR-Tiny has 5x5 conv filters: (conv64-bn-relu) maxpool (conv128-bn-relu) maxpool
(conv256-bn-relu) maxpool (conv512-bn-relu) maxpool, global avgpool, classification

</details>


### Results


![](/assets/seminars/transfusion-understanding-transfer-learning-for-medical-imaging-neurips-2019/3.png)


Transfer learning and random initialization perform comparably across both standard IMAGENET
architectures and simple, lightweight CNNs for AUCs from diagnosing moderate DR

- Both sets of models also have similar AUCs, despite significant differences in size and complexity
- Small models performing poorly on IMAGENET but very comparably on the medical task
    - Model performance on DR diagnosis is also not closely correlated with IMAGENET performance

Performances (AUC%) of diagnosing different pathologies on the CHEXPERT dataset


![](/assets/seminars/transfusion-understanding-transfer-learning-for-medical-imaging-neurips-2019/4.png)

- Transfer learning provides mixed performance gains on chest x-rays
    - Cardiomegaly and Consolidation, transfer learning performs slightly worse, but helps with Edema and Pleural Effusion
- Transfer learning does not help significantly, and much smaller models performing comparably

### The Very Small Data Regime


Train models on only 5000 datapoints on the RETINA dataset to study the effects in this very small data regime


![](/assets/seminars/transfusion-understanding-transfer-learning-for-medical-imaging-neurips-2019/5.png)


→ Transfer learning has a bigger effect with very small amounts of data


## Representational Analysis of the Effects of Transfer 


transfer learning and training from random initialization result in very similar performance


    ⇒ Does transfer learning result in **any representational differences** compared to training from random initialization? or are the effects of the initialization lost? 


    ⇒ Does **feature reuse** take place, and if so, where exactly?


### Quantitatively Studying Hidden Representations with SVCCA


⇒ Analyzing **latent layers** for how pretraining affects the features and representations learned by the models

- **(Singular Vector) Canonical Correlation Analysis**

    
[📄 자료 링크 ↗](https://github.com/google/svcca/blob/master/tutorials/002_CCA_for_Convolutional_Layers.ipynb)
    

- Rather than working directly with the model parameters or neurons, CCA works with neuron activation vectors — the ordered collection of outputs of the neuron on a sequence of inputs

    ![](/assets/seminars/transfusion-understanding-transfer-learning-for-medical-imaging-neurips-2019/6.png)


→  compare the latent representations of corresponding hidden layers of different pairs of neural networks, giving a CCA similarity score of the learned intermediate functions


### Transfer Learning and Random Initialization Learn Different Representations

- CCA similarity to compare representational similarity of hidden layers
- Representations learned at the top two layers (for CBRs) or stages (for Resnet, Inception) before the output layer, averaging their similarity scores(w/o opt layer)

![](/assets/seminars/transfusion-understanding-transfer-learning-for-medical-imaging-neurips-2019/7.png)


### Larger Models Change Less Through Training

- larger models **change much less** during training, especially in the lowest layers, even when they are **randomly initialized**

![](/assets/seminars/transfusion-understanding-transfer-learning-for-medical-imaging-neurips-2019/8.png)

- feature reuse is mostly restricted to the bottom two layers
    - similarity with initialization is significantly higher for pretrained weights

![](/assets/seminars/transfusion-understanding-transfer-learning-for-medical-imaging-neurips-2019/9.png)

- First row: similarity correlation in lower layer
- Second row: similarity correlation in higher layer
- 1 ,2 column(ResNet50): strong correlation between similarity at initialization and similarity after convergence

    → **Overparametrization of Resnet for the task**


### Filter Visualizations and the Absence of Gabors

- Visualize some of the filters of conv1 for Resnet and CBR-Small

![](/assets/seminars/transfusion-understanding-transfer-learning-for-medical-imaging-neurips-2019/10.png)

- Resnet filters change much less than those of CBR-Small
- CBR-Small
    - moves more from its initialization, and has more similar learned filters in random and pretrained initialization
    - Not appear to learn Gabor filters when trained from scratch
    - **Erases some of the Gabor filters** that it is initialized with in the pretrained weights

![Gabor filter(orig) for detecting edges](/assets/seminars/transfusion-understanding-transfer-learning-for-medical-imaging-neurips-2019/11.png)


## Convergence: Feature Independent Benefits and Weight Transfusion


the effects of transfer learning on convergence speed

- transfer offers feature independent benefits to convergence simply through better
weight scaling
- using pretrained weights from the lowest two layers/stages has the biggest effect
on convergence

⇒ hybrid approaches to transfer learning, where only a **subset** of the pretrained weights are
used, with a **lightweight redesign** to the top of the network(Transfusion)


⇒ using entirely synthetic features, such as **synthetic Gabor filters**


### Feature Independent Benefits of Transfer: Weight Scalings


Using pretrained weights results in **faster convergence** because of significant feature reuse


→ found feature independent benefits: **better scaling**


![](/assets/seminars/transfusion-understanding-transfer-learning-for-medical-imaging-neurips-2019/12.png)


**Mean Var init**: initialize iid weights from distribution with mean and variance of pretrained weights

    - Inherits the scaling of the pretrained weights, but destroys all of the features
    - Significantly helps speed up convergence

### Weight Transfusions and Feature Reuse

- Meaningful feature reuse is restricted to the lowest two layers/stages effect on convergence speed

⇒ Transfering a contiguous set of some of the pretrained weights, randomly initializing the rest of the network, and training on the medical task.


![](/assets/seminars/transfusion-understanding-transfer-learning-for-medical-imaging-neurips-2019/13.png)


→ Reusing conv1 gives the greatest marginal convergence speedup, even though transfusing weights for a block means several new layers are using pretrained weights


### Takeaways: Hybrid Approaches to Transfer Learning


**Slim model** 

- Reusing pretrained weights of larger model **partially**(weights up to block2, ResNet)
- Redesiging the top of the network to be more lightweight, initializing these layers randomly

**Synthetic Gabor model**

- initializing conv1 with synthetic Gabor filters  and the rest of the network randomly

![](/assets/seminars/transfusion-understanding-transfer-learning-for-medical-imaging-neurips-2019/14.png)

- Slimming the top of the network in this way offers the same convergence and performance as transfer learning
- synthetic Gabors for conv1 has the same effect as pretrained weights for conv1

## Conclusion

- Investigated many central questions on transfer learning for medical imaging applications
- Transfer learning offers limited performance gains and much smaller architectures can perform comparably to the standard IMAGENET models
- For ImageNet models in medical imaging task, it is overparametrized for task
- Meaningful feature reuse is concentrated at the lowest layers
- Explore more flexible, hybrid approaches to transfer
    - maintain all the benefits of transfer and open up rich new possibilities
- Demonstrate feature-independent benefits of transfer learning for better weight scaling and convergence speedups
