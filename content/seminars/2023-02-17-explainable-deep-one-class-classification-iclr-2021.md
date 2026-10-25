---
date: 2023-02-17
title: EXPLAINABLE DEEP ONE-CLASS CLASSIFICATION (ICLR 2021)
category: Paper Review
presenter: 유지태
url: https://www.notion.so/6860c9169b3a4d1baae8e9c00c32c237
keywords: outlier exposure, Anomaly Detection, XAI
---

# Selected Paper


## Title: EXPLAINABLE DEEP ONE-CLASS CLASSIFICATION


(ICLR 2021)


## Abstract: 


Deep one-class classification variants for anomaly detection learn a mapping that concentrates nominal samples in feature space causing anomalies to be mapped away. Because this transformation is highly non-linear, finding interpretations poses a significant challenge. In this paper we present an explainable deep one-class classification method, Fully Convolutional Data Description (FCDD), where the mapped samples are themselves also an explanation heatmap. FCDD yields competitive detection performance and provides reasonable explanations on common anomaly detection benchmarks with CIFAR-10 and ImageNet. On MVTec-AD, a recent manufacturing dataset offering ground-truth anomaly maps, FCDD sets a new state of the art in the unsupervised setting. Our method can incorporate ground-truth anomaly explanations during training and using even a few of these (∼ 5) improves performance significantly. Finally, using FCDD’s explanations, we demonstrate the vulnerability of deep one-class classification models to spurious image features such as image watermarks.


## Link


EXPLAINABLE DEEP ONE-CLASS CLASSIFICATION



[📄 자료 링크 ↗](https://arxiv.org/pdf/2007.01760.pdf)



HSC

- Rethinking Assumptions in Deep Anomaly Detection


[📄 자료 링크 ↗](https://arxiv.org/pdf/2006.00339.pdf)



Upsampling

- Understanding the Effective Receptive Field in Deep Convolutional Neural Networks


[📄 자료 링크 ↗](https://arxiv.org/pdf/1701.04128.pdf)



# Summary

- FCDD는 Fully convolutional network와 DeepSAD의 식을 이용한 Explainable Deep one class calssification 방법론임
- 특히 Outlier exposure를 활용하였기 때문에, 데이터셋이 작은 경우 유의미하게 적용할 수 있음
- 천체 데이터의 경우 광도곡선을 이미지로 변형시켜 적용해볼 요소는 있음

![](/assets/seminars/explainable-deep-one-class-classification-iclr-2021/0.png)


# Seminar Slide


# Preliminary 


    ### **DeepSVDD**

    - Unsupervised anomaly detection
    - kernel based SVDD에서 kernel대신 neural network를 활용
    - 정상데이터를 대표적인 정상 feature를 나타내는 center에 가깝게 학습
    - Deep SVDD는 CNN 구조로 동일한 구조의 encoder를 가진  pretrained CAE의 encoder parameters를 가중치 초기값으로 활용
    - $\min \theta \frac{1}{n} \sum_{i=1}^n\left\|\phi_\theta\left(\boldsymbol{x}_i\right)-\boldsymbol{c}\right\|^2$

    ![](/assets/seminars/explainable-deep-one-class-classification-iclr-2021/1.png)


    ### DeepSAD

    - Semi-supervised anomaly detection
    - Labeled 된 anomaly 정보를 활용하여 학습을 진행
    - abnormal면 center에서 멀게, normal이면 center에서 가깝게 각각의 feature 학습
    - m labeled samples $\left(\tilde{\boldsymbol{x}}_1, \tilde{y}_1\right), \ldots,\left(\tilde{\boldsymbol{x}}_m, \tilde{y}_m\right) \in \mathcal{X} \times \mathcal{Y}$ with $\mathcal{Y}=\{-1,+1\}$ where $\tilde{y}=+1 $denotes known normal samples and $\tilde{y}=-1$ known anomalies.
    - $
    \min {\mathcal{W}} \frac{1}{n+m} \sum_{i=1}^n\left\|\phi\left(\boldsymbol{x}i ; \mathcal{W}\right)-\boldsymbol{c}\right\|^2+\frac{\eta}{n+m} \sum_{j=1}^m\left(\left\|\phi\left(\tilde{\boldsymbol{x}}_j ; \mathcal{W}\right)-\boldsymbol{c}\right\|^2\right)^{\tilde{y}j}+\frac{\lambda}{2} \sum{\ell=1}^L\left\|\boldsymbol{W}^{\ell}\right\|_F^2
    $

    ### OE(Outlier exposure)

    - 테스트 하고자 하는 out of distribution(OOD) 데이터와 다른 OOD 데이터를 모델 학습에 사용하여 기존 OOD detection 모델의 성능을 높인 방법론

    ### Receptive field

    - 출력 레이어의 뉴런 하나에 영향을 미치는 입력 뉴런들의 공간 크기
    - *진분홍색 영역

    ![](/assets/seminars/explainable-deep-one-class-classification-iclr-2021/2.png)


    ### Binary Cross Entropy Loss

    - $(\hat{y}, y)=-(y \times \log \hat{y}+(1-y) \times \log (1-\hat{y}))$

        ![](/assets/seminars/explainable-deep-one-class-classification-iclr-2021/3.png)


    ### Upsampling

    - Conv와 Pooling을 통과시키면서 원본 이미지를 압축해나가는 과정을 Downsampling
    - 이와 반대로 크기를 늘려나가는 방식을 Upsampling

    ![](/assets/seminars/explainable-deep-one-class-classification-iclr-2021/4.png)


    _Understanding the Effective Receptive Field in Deep Convolutional Neural Networks_

    - It is shown that the distribution of impact within the receptive field is asymptotically Gaussian.
    - In particular, it is discovered that not all pixels in a receptive field contribute equally to an output unit’s response
    - Pixels at the center of a receptive field have a much larger impact on an output.

        ![](/assets/seminars/explainable-deep-one-class-classification-iclr-2021/5.png)


# Introduction


    ### HSC(Hypersphere classification)

    - Semi-supervised anomaly detection
    - Deep SAD에 outlier exposure를 결합한 방법론
    - The unsupervised OE approach to AD
        - Unsupervised OE: unsupervised methods that incorporate auxiliary data that is not nominal
    - A principled modification of Deep SAD based on cross-entropy classification that concentrates nominal samples

    | 분류               | 설명                               | Traning | Testing |
    | ---------------- | -------------------------------- | ------- | ------- |
    | Normal           | 정상 데이터                           | O       | O       |
    | Abnormal         | 탐지하고자 하는 비정상 데이터                 | X       | O       |
    | Outlier Exposure | Abnormal 데이터와 다른 분포를 가지는 비정상 데이터 | O       | X       |


    | 분류                        | 설명                                                                                                                                            |
    | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
    | Dataset                   | $\mathcal{D}=\left\{\left(\boldsymbol{x}_1, y_1\right),\left(\boldsymbol{x}_2, y_2\right), \ldots,\left(\boldsymbol{x}_n, y_n\right)\right\}$ |
    | class                     |  $\left.y_i=1 \text { (normal), } y_i=0 \text { (abnormal }\right)$                                                                           |
    | Neural network            | $\phi_{\theta}: \mathbb{R}^d \rightarrow \mathbb{R}^r$                                                                                        |
    | Function 
    (Output → Prob) | $l: \mathbb{R}^r \rightarrow[0,1]$                                                                                                            |

    - **BCE(Binary cross entrophy)**
        - $\frac{1}{n} \sum_{i=1}^n y_i \log l\left(\phi\left(x_i ; \theta\right)\right)+\left(1-y_i\right) \log \left(1-l\left(\phi\left(x_i ; \theta\right)\right)\right)$
        - For standard binary deep classifiers, $l$ is a linear layer followed by the sigmoid activation and the decision region for the mapped samples $\phi_\theta\left(\boldsymbol{x}1\right), \ldots, \phi_\theta\left(\boldsymbol{x}_n\right) \text { is a half-space } S$ ,In this case the preimage of $ S$, $\phi_\theta^{-1}(S)$, is not guaranteed to be compact.
    - **Radial basis function**
        - $ l(z):=\exp \left(-\|z\|^2\right)$
        - A real-valued function whose value depends only on the distance from the origin
    - **BCE with Radial basis function**
        - In order to enforce the preimage $S$ of our nominal decision region to be compact, thereby encouraging the mapped nominal data to be concentrated
        - $l\left(\phi\left(x_i ; \theta\right)\right):=\exp \left(-\left\|\phi\left(x_i ; \theta\right)\right\|^2\right)$
        - $\frac{1}{n} \sum_{i=1}^n y_i\left\|\phi\left(x_i ; \theta\right)\right\|^2-\left(1-y_i\right) \log \left(1-\exp \left(-\left\|\phi\left(x_i ; \theta\right)\right\|^2\right)\right)$
        - If there are no anomalies, the HSC loss is the same as special case of DeepSVDD when c is equal to 0. (중심이 원점인 DeepSVDD)
    - **Pseudo-Huber loss**
        - Squared-norm is replaced with a robust alternative
        - A robust loss that interpolates from quadratic to linear penalization
        - $ l(z):=\exp (h(z))=\exp \left(\sqrt{\|z\|^2+1}-1\right)$

            ![](/assets/seminars/explainable-deep-one-class-classification-iclr-2021/6.png)

        - $\frac{1}{n} \sum_{i=1}^n y_i\left(\sqrt{\left\|\phi\left(x_i ; \theta\right)\right\|^2+1}-1\right)-\left(1-y_i\right) \log \left(1-\exp \left(\sqrt{\left\|\phi\left(x_i ; \theta\right)\right\|^2+1}-1\right)\right)$
    - **HSC**
        - where center is defined as c,  $y_{i} = 1$ denotes an anomaly and $y_{i} = 0$ denotes a nominal sample

            $\min {\mathcal{W}, \mathbf{c}} \frac{1}{n} \sum_{i=1}^n\left(1-y_i\right) h\left(\phi\left(X_i ; \mathcal{W}\right)-\mathbf{c}\right)-y_i \log \left(1-\exp \left(-h\left(\phi\left(X_i ; \mathcal{W}\right)-\mathbf{c}\right)\right)\right)$

        - The HSC loss encourages $\phi$ to map nominal samples near $c$ and anomalous samples away from the center $c$

# Methodology


    ### FCDD(Fully convolution data description)

    - Semi-supervised anomaly detection
    - Explainable deep one-class classification method based on HSC and fully convolutional network
    - Labeled normal/OE data are used for deriving feature maps through convolution and pooling layers, and then heatmap is derived through upsampling.
        - Fully Convolutional network preserves spatial information.
        - Therefore, the main difference is to derive a feature map rather than a specific feature vector.
        - All operations are applied element-wise for psedo hubor loss, in FCN output matrix

            | 분류                | 설명                                                                                                                                                                                          |
            | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
            | Dataset           | $\mathcal{D}=\left\{\left(X_1, y_1\right),\left(X_2, y_2\right), \cdots,\left(X_n, y_n\right)\right\} \text { with } X_i \in \mathbb{R}^{c \times h \times w} \text { and } y_i \in\{0,1\}$ |
            | class             | $\left.y_i=1 \text { (abnormal), } y_i=0 \text { (normal }\right)$                                                                                                                          |
            | Neural network    | $\phi: \mathbb{R}^{c \times h \times w} \rightarrow \mathbb{R}^d \text { with weights } \mathcal{W}$                                                                                        |
            | Center            | $c \in \mathbb{R}^d$                                                                                                                                                                        |
            | Pseudo-Huber loss | $h: \mathbb{R}^d \rightarrow[0,1]$                                                                                                                                                          |

    - $\min {\mathcal{W}} \frac{1}{n} \sum_{i=1}^n\left(1-y_i\right) \frac{1}{u v}\left\|A\left(X_i\right)\right\|_1-y_i \log \left(1-\exp \left(-\frac{1}{u v}\left\|A\left(X_i\right)\right\|_1\right)\right)$
    - $A(X)=\sqrt{\phi\left(X_i ; \mathcal{W}\right)^2+1}-1 \in \mathbb{R}^{1 \times u \times v}$

    ![](/assets/seminars/explainable-deep-one-class-classification-iclr-2021/7.png)

    - A(X) will have u × v dimension and less than h × w, which is the original image dimension. Upsampling is applied because it is desirable to generate heatmap with the same resolution.

    ### Upsampling

    - Because there is no ground truth pixel anotation, the use and learning difficulties of the decovolution layer
    - Receptive field의 input pixel이 output에 미치는 영향의 분포가 Gaussian distribution을 따른다는 사실을 기반으로 fixed gaussian kernel strided transposed convolution을 통해 anoamly heatmap을 Upsampling 함
    - Upsampling by defining its weights as Gaussian distributions

        ![](/assets/seminars/explainable-deep-one-class-classification-iclr-2021/8.png)


        ![](/assets/seminars/explainable-deep-one-class-classification-iclr-2021/9.png)


# Experiment

    - One Vs. res set up :  “one” class is used as the nominal class and the rest of the classes are used as anomalies at test time
    - For training, only  nominal samples as well as random samples from some auxiliary Outlier Exposure are used
    - Report the mean AUC over all classes for each dataset

    | Normal/Abnormal | Outlier exposure dataset                                 |
    | --------------- | -------------------------------------------------------- |
    | Fashion MNIST   | EMNIST-letters or grayscaled CIFAR-100                   |
    | CIFAR-10        | CIFAR-100 which does not share any classes with CIFAR-10 |
    | ImageNet -1K    | ImageNet-22K where ImageNet -1k classes are removed      |


    ### Quantitative Results


    ![](/assets/seminars/explainable-deep-one-class-classification-iclr-2021/10.png)


    ### Qualitative Results


    **Heatmaps for Fashion-MNIST**

    - Achieve a performance that is close to state-of-the-art methods and outperforms autoencoders
    - In(b) CIFAR-100 was used for OE and In (c) EMNIST, anomaly heatmaps for anomalous test samples of a Fashion-MNIST
    - FCDD correctly highlights horizontal elements as being anomalous

    ![](/assets/seminars/explainable-deep-one-class-classification-iclr-2021/11.png)


    **Heatmaps for ImageNet**

    - Green and brown areas tending to be seen as more nominal, and other colors being deemed anomalous
    - It recognizes the green caterpillar as being anomalous

    ![](/assets/seminars/explainable-deep-one-class-classification-iclr-2021/12.png)


    **Heatmaps for CIFAR-10 models with varying amount of OE**

    - Anomaly heatmaps for three anomalous test samples on a CIFAR-10 model trained on
    nominal class “airplane.”
    - For FCDD and Grad, the number of OE samples are increased from 2, 8, 128, 2048 to full OE
    - FCDD tends to concentrate the explanations more on the primary object in the image

    ![](/assets/seminars/explainable-deep-one-class-classification-iclr-2021/13.png)


    ### Explaining Defects in Manufacturing 

    - Comparison on the performance of FCDD on the MVTec-AD dataset
    - MVTec-AD contains 15 object classes of high-resolution RGB images with up to 1024×1024 pixels,
    - anomalous test samples are categorized in up to 8 defect types
    - synthetic anomalies using a sort of “confetti noise,”
        - inserts colored blobs into images

        ![](/assets/seminars/explainable-deep-one-class-classification-iclr-2021/14.png)

    - objective
        - A major advantage of FCDD in comparison to reconstruction-based methods is that it can be readily used in a semi-supervised AD setting
        - Let $X_{1}, . . . , X_{n}$ again denote a batch of inputs with corresponding ground-truth heatmaps $Y_{1}, . . . , Y_{n}$, each having m = h · w number of pixels.
        - $A(X) $ denote the corresponding output anomaly heatmap of X.
        - $
        \min {\mathcal{W}} \frac{1}{n} \sum{i=1}^n\left(\frac{1}{m} \sum_{j=1}^m\left(1-\left(Y_i\right)_j\right) A^{\prime}\left(X_i\right)j\right)-\log \left(1-\exp \left(-\frac{1}{m} \sum_{j=1}^m\left(Y_i\right)_j A^{\prime}\left(X_i\right)_j\right)\right)
        $
    - Pixel-wise mean AUC

    ![](/assets/seminars/explainable-deep-one-class-classification-iclr-2021/15.png)


    **Celever Hans effect**

    - a classifier recognizes a watermark in the lower left corner as the relevant class pattern and fails if the watermark is removed.
    - (a) shows anomalous samples ordered from most nominal to most anomalous from left to right, and (b) shows examples that indicate that the model is a “Clever Hans”

    ![](/assets/seminars/explainable-deep-one-class-classification-iclr-2021/16.png)


# Conclusion

    - FCDD, in comparison to previous methods, performs well and is adaptable to both semantic detection tasks and more subtle defect detection tasks.
    - It makes an explanation to the anomaly score, so that it is less vulnerable.

# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
