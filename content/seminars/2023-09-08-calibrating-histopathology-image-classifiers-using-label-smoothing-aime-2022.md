---
date: 2023-09-08
title: Calibrating Histopathology Image Classifiers Using Label Smoothing (AIME 2022)
category: Paper Review
presenter: Byungkook Koo
url: https://www.notion.so/d7a0ceaddd1d475fbd4bbb23a77eda63
keywords: Label Smoothing, Model Calibration
---

## Link



[📄 자료 링크 ↗](https://link.springer.com/chapter/10.1007/978-3-031-09342-5_26)



## Abstract


The classification of histopathology images fundamentally differs from traditional image classification tasks because histopathology images naturally exhibit a range of diagnostic features, resulting in a diverse range of annotator agreement levels. However, examples with high annotator disagreement are often either assigned the majority label or discarded entirely when training histopathology image classifiers. This widespread practice often yields classifiers that do not account for example difficulty and exhibit poor model calibration. In this paper, we ask: can we improve model calibration by endowing histopathology image classifiers with inductive biases about example difficulty?


We propose several label smoothing methods that utilize per-image annotator agreement. Though our methods are simple, we find that they substantially improve model calibration, while maintaining (or even improving) accuracy. For colorectal polyp classification, a common yet challenging task in gastrointestinal pathology, we find that our proposed agreement-aware label smoothing methods reduce calibration error by almost 70%. Moreover, we find that using model confidence as a proxy for annotator agreement also improves calibration and accuracy, suggesting that datasets without multiple annotators can still benefit from our proposed label smoothing methods via our proposed confidence-aware label smoothing methods.


Given the importance of calibration (especially in histopathology image analysis), the improvements from our proposed techniques merit further exploration and potential implementation in other histopathology image classification tasks.


### 4-line Summary

- Annotator agreement level이 다양한 상황에서, 이를 반영하는 calibration method가 필요
- Agreement level과 label smoothness의 관계에 따른 4가지 smoothing 방법을 제시
- Multiple annotator가 아닌 상황에서 사용 가능한 confidence-aware smoothing 방법 또한 제시
- 해당 방법을 통해 performance 감소 없이, calibration error를 줄일 수 있음

## Introduction

- The nature of medical image classification tasks differs substantially from standard benchmarks(natural images) used in computer vision
    - Often have **high annotator disagreement** where diagnoses can differ substantially, even among expert clinicians

        → Existing literature typically uses the classic CV training procedure: using the majority vote of annotators as a one-hot encoded target

    - Initial adoption of medical image analysis models will likely be as **assistants for clinicians**
        - 시스템에서 애매하게 도출된 증상 이미지들만 직접 진찰하는 방식

        → Confidence outputs of deep learning classifiers crucially influence clinician decisions


    **⇒ calibration is key**

- Propose **label smoothing** techniques for the classification of histopathology images
    - Agreement-aware smoothing(utilize **annotations from multiple pathologists**)
        - Depend on the annotator agreement for each individual image, providing the model with more information about the contents of the images
    - Confidence-aware smoothing(adapt proposed label smoothing to single annotations)
        - Model confidence used as a proxy for example difficulty instead of annotator agreement
        - Resembles agreement-aware label smoothing, substitutes annotator agreement data with model confidence outputs

     ⇒ Proposed label smoothing technique **improve calibration** more than vanilla label smoothing and hard-target models do, **while maintaining or improving** accuracy


## Label smoothing 


Hard labels → resulting in models being less-calibrated and too overconfident in their predictions


Label smoothing ⇒ **“smooth” labels** by encouraging small logit gaps 



$$
y=(1-\alpha) * y_{k}+\frac{\alpha}{K} .
$$



![x-axis: model confidence / y-axis: corresponding target label
Left: baseline(hard label) / Right: vanilla label smoothing](/assets/seminars/calibrating-histopathology-image-classifiers-using-label-smoothing-aime-2022/0.png)


### 작동 원리


출력 층 layer의 입력 = $x$, 클래스 k의 가중치 vector = $w_k$라고 했을 때, 

- 도출되는 logit  $p_k = \alpha(x^Tw_k)$
- $x$와 $w_k$의 euclidean distance $||x-w_k||^2 = x^Tx - 2x^Tw_k+w_k^Tw_k$
    - 큰 logit은 작은 값, 작은 logit은 큰 값을 가지게 됨
- 이에 대한 CE loss $CE(y, p_k) = \sum_{k =1}^{K} -y_klog(p_k)$
    - 정답 logit은 최대화, 오답 logit은 최소화 되도록 학습됨
    - Hard label인 경우
        - 정답 class가 아닌 logit은 loss 계산 시 제외 됨

            → 정답 class의 weight vector의 거리만 최소화되도록 학습 

    - Soft label의 경우
        - 정답 class와 오답 class의 logit이 함께 고려됨

            ⇒ 학습 시, 최대 logit이 다른 logit보다 지나치게 커지는 것을 방지(less over-confident)


            ⇒ 정답 class의 weight vector의 거리는 최소화되면서, 오답 class의 거리는 충분히 멀게 유지하도록 학습됨(well-calibrated)


![](/assets/seminars/calibrating-histopathology-image-classifiers-using-label-smoothing-aime-2022/1.png)


### Related Work


**When Does Label Smoothing Help?**



[📄 자료 링크 ↗](https://arxiv.org/abs/1906.02629)


- Originally proposed seeks to improve calibration and has been found to reduce expected calibration error on computer vision benchmarks

⇒ 실제로는 **Rethinking the Inception Architecture for Computer Vision**에서 제안됨



[📄 자료 링크 ↗](https://www.cv-foundation.org/openaccess/content_cvpr_2016/html/Szegedy_Rethinking_the_Inception_CVPR_2016_paper.html)



**Interpreting chest X-rays via CNNs that exploit hierarchical disease dependencies and uncertainty labels**



[📄 자료 링크 ↗](https://arxiv.org/abs/1911.06475)


- Proposed to remap targets to random numbers close to one

⇒ Primarily **uses one-hot encoded labels**


**Human uncertainty makes classification more robust**



[📄 자료 링크 ↗](https://arxiv.org/abs/1908.07086)


- Sampling ground truth labels from a distribution of human annotations

### Agreement-Aware Label Smoothing


Propose three types of agreement-aware label smoothing paradigms

- $n_k$ = the number of annotators that labeled a given example as class k
- $N$ = number of  annotators

    ⇒ Utilizes $\frac{n_k}{N}$ as agreement level

1. Linear
- Examine the sole effect of including annotator agreement data without changing the format of vanilla label smoothing
- Hyper-parameter $\alpha \in(0,1]$


$$
y=(1-\alpha) * \frac{n_{k}}{N}+\frac{\alpha}{K}
$$



![x-axis: agreement level / y-axis: corresponding target label](/assets/seminars/calibrating-histopathology-image-classifiers-using-label-smoothing-aime-2022/2.png)


⇒ 찬성 비율에 따른 target label의 관계를 linear하게 부여하는 방법

1. piecewise
- Examine variable-sized discontinuity in the vanilla label smoothing equation can improve the precision of smoothed targets
- Hyper-parameter $\Omega \in(0,0.5]$
- Number of annotators needed for a majority $n_{m}=\left\lceil\frac{N}{K}\right\rceil$


$$
\left\{\begin{array}{ll}y=(1-\Omega)+\Omega\left(\frac{n_{k}-n_{m}}{n_{m}-1}\right), & \text { if } n_{k}>n_{m} \\y=0.5, & \text { if } n_{k}=n_{m} \\y=\Omega\left(\frac{n_{k}}{n_{m}-1}\right), & \text { if } n_{k}<n_{m}\end{array} .\right.
$$



![](/assets/seminars/calibrating-histopathology-image-classifiers-using-label-smoothing-aime-2022/3.png)


⇒ 찬성 비율에 따른 target label의 관계를 linear하게 부여하되, 과반 수 시점을 기준으로 보다 hard하게 부여하는 방법

1. Non-linear
- Address more-heavily penalizing images with higher disagreement can produce better-calibrated models.
- Uses sigmoid non-linear function as f, hyperparameter $\Phi>0$


$$
y=f\left(\Phi\left(\frac{n_{k}}{N}-\frac{1}{2}\right)\right)
$$



![](/assets/seminars/calibrating-histopathology-image-classifiers-using-label-smoothing-aime-2022/4.png)


⇒ 찬성 비율에 따른 target label의 관계를 non-linear하게 부여하는 방법


(sigmoid에 기반하여 agreement가 낮은 대상은 더욱 penalize)


### Confidence-Aware Label Smoothing


Use the **confidence outputs** of a baseline model as a **proxy** for example difficulty


→ thus requires training the model twice

    1. Without label smoothing in order to **obtain model confidence** scores for each training example
    2. Again with proposed confidence-aware label smoothing methods

![Difference between n_k and c_k](/assets/seminars/calibrating-histopathology-image-classifiers-using-label-smoothing-aime-2022/5.png)

1. Vanilla
- Obtaining from vanilla smoothing by substituting model confidence for annotator agreement level.


$$
y=(1-\alpha) *\left\lfloor c_{k}\right\rceil+\frac{\alpha}{K}
$$


1. Linear
- simply replace $\frac{n_k}{N}$ with $c_k$


$$
y=(1-\alpha) * c_k +\frac{\alpha}{K}
$$


1. Non-linear
- simply replace $\frac{n_k}{N}$ with $c_k$


$$
y=f\left(\Phi\left(c_k-\frac{1}{2}\right)\right)
$$


1. Piecewise
- Modified version of agreement-aware smoothing


$$
\begin{cases}y=(1-\Omega)+\left(\frac{c_{k}-0.5}{0.5}\right) * \Omega, & \text { if } c_{k}>0.5 \\ y=0.5, & \text { if } c_{k}=0.5 \\ y=\left(\frac{c_{k}}{0.5}\right) * \Omega, & \text { if } c_{k}<0.5\end{cases}
$$



## Experiments


Experiments on the Minimalist Histopathology Image Analysis Dataset(MHIST)

- Binary label from 7 annotators

### Expected Calibration Error(ECE)


![](/assets/seminars/calibrating-histopathology-image-classifiers-using-label-smoothing-aime-2022/6.png)

- 상단 plot: 모델이 도출한 confidence에 따른 데이터 샘플의 비율
    - ResNet: 대부분의 sample에 대해 0.9 이상의 confidence를 보임
- 하단 plot: confidence와 실제 accuracy의 차이
    - ResNet: 0.8의 confidence를 갖는 sample에 대해서, 80% 정도 정답

**ECE: derivation**

- $B_m$ = m개로 나눈 구간을 의미

![](/assets/seminars/calibrating-histopathology-image-classifiers-using-label-smoothing-aime-2022/7.png)


⇒ m 번째 구간에 대한 평균 accuracy 


![](/assets/seminars/calibrating-histopathology-image-classifiers-using-label-smoothing-aime-2022/8.png)


⇒ m 번째 구간에 대한 평균 confidence


![](/assets/seminars/calibrating-histopathology-image-classifiers-using-label-smoothing-aime-2022/9.png)


**ECE ⇒ accuracy와 confidence의 차이의 평균**


## Label Smoothing: Annotator Agreement


### Improving Accuracy and Calibration


![Agreement-aware label smoothing improves performance (higher AUC) and model calibration (lower ECE). Means and standard deviations are reported across 10 seeds](/assets/seminars/calibrating-histopathology-image-classifiers-using-label-smoothing-aime-2022/10.png)


![AUROC, ECE graph in train phase](/assets/seminars/calibrating-histopathology-image-classifiers-using-label-smoothing-aime-2022/11.png)

- Baseline: becomes uncalibrated after training for ∼30 epochs (ECE goes up)
- Smoothing: remained well-calibrated throughout training (ECE stays constant)

    ⇒ Achieved similar or better performance (AUC) than the baseline


### Hyperparameter Selection


![Top: change in AUC from the baseline model / Bottom: percent improvement in ECE from the baseline model](/assets/seminars/calibrating-histopathology-image-classifiers-using-label-smoothing-aime-2022/12.png)

- All label smoothing methods are able to improve both AUC and ECE for some hyperparameter ranges

## Label Smoothing: Model Confidence

- Obtain model confidence data by using each image’s confidence output from baseline model

    → trained using binary gold standard annotations by majority vote of our seven annotator


### Improving Accuracy and Calibration


![Confidence-aware label smoothing improves performance (higher AUC) and model calibration (lower ECE). Means and standard deviations are reported across 10 seeds.](/assets/seminars/calibrating-histopathology-image-classifiers-using-label-smoothing-aime-2022/13.png)

- Confidenceaware label smoothing is still very effective in improving both accuracy and calibration
- Piecewise confidence-aware label smoothing was ineffective
    - overly-complex for already-sophisticated data such as confidence value

### Hyperparameter Selection


![Top: change in AUC from the baseline model / Bottom: percent improvement in ECE from the baseline model](/assets/seminars/calibrating-histopathology-image-classifiers-using-label-smoothing-aime-2022/14.png)

- **Except piecewise**, all label smoothing methods are able to improve both AUC and ECE for some hyperparameter range

## Discussion 

- Although we intentionally chose the common and diagnostically-challenging task, our study nevertheless is only evaluated on one dataset.

    → Do not consider our encouraging empirical results as validation of our label smoothing methods for all histopathology tasks

- Proposed two well-motivated sets of label smoothing methods
    - Agreement-aware label smoothing: uses annotator agreement data
    - Confidence-aware label smoothing: uses model confidence
- Finding that both proposed method reduce calibration error, while increasing AUC
- Aims to demonstrate the potential usefulness of including example difficulty when implementing label smoothing

# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
