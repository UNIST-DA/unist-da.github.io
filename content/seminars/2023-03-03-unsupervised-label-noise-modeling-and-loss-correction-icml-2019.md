---
date: 2023-03-03
title: Unsupervised Label Noise Modeling and Loss Correction (ICML 2019)
category: Paper Review
presenter: YongKyung Oh
url: https://www.notion.so/0af52a38cb0e4404b2e5746fcab6580b
keywords: Noisy label learning
---

# Selected Paper


## Title: **Unsupervised Label Noise Modeling and Loss Correction**


## Abstract: 


Despite being robust to small amounts of label noise, convolutional neural networks trained with stochastic gradient methods have been shown to easily fit random labels. When there are a mixture of correct and mislabelled targets, networks tend to fit the former before the latter. This suggests using a suitable two-component mixture model as an unsupervised generative model of sample loss values during training to allow online estimation of the probability that a sample is mislabelled. Specifically, we propose a beta mixture to estimate this probability and correct the loss by relying on the network prediction (the so-called bootstrapping loss). We further adapt mixup augmentation to drive our approach a step further. Experiments on CIFAR-10/100 and TinyImageNet demonstrate a robustness to label noise that substantially outperforms recent state-of-the-art. Source code is available at [this https URL](https://git.io/fjsvE)


## Link



[📄 자료 링크 ↗](https://arxiv.org/abs/1904.11238)



# Paper Review


## Motivation: **Deep NN can Learn Random Noise**



[📄 자료 링크 ↗](https://lilianweng.github.io/posts/2019-03-14-overfit/)



As we know two-layer neural networks are universal approximators, it is less surprising to see that they are able to learn unstructured random noise perfectly, as shown in Zhang, et al. (2017). If labels of image classification dataset are randomly shuffled, the high expressivity power of deep neural networks can still empower them to achieve near-zero training loss. These results do not change with regularization terms added.


![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/0.png)



[📄 자료 링크 ↗](https://arxiv.org/abs/1611.03530)



The traditional machine learning uses the following U-shape risk curve to measure the bias-variance trade-offs and quantify how generalizable a model is. If I get asked how to tell whether a model is overfitted, this would be the first thing popping into my mind.


As the model turns larger (more parameters added), the training error decreases to close to zero, but the test error (generalization error) starts to increase once the model complexity grows to pass the threshold between “underfitting” and “overfitting”. 


![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/1.png)



[📄 자료 링크 ↗](https://arxiv.org/pdf/1812.11118.pdf)



## Motivation: Noisy label problem

- Top performing DNN models: strong supervision
- Labeled data is a scarce resource

![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/2.png)


![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/3.png)



[📄 자료 링크 ↗](https://icml.cc/media/Slides/icml/2019/102(13-16-00)-13-17-05-5042-unsupervised_la.pdf)



![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/4.png)

- This overfitting also arises in biases that networks encounter during training, e.g., when a dataset contains class imbalances (Alvi et al., 2018). However, before fitting label noise, CNNs fit the correctly labeled samples (clean samples) even under high-levels of corruption.

### Main contribution

- A simple yet effective <u>unsupervised noise label modeling based on each sample loss</u>.
- <u>A loss correction approach</u> that exploits the unsupervised label noise model to correct each sample loss, thus preventing overfitting to label noise.
- Pushing the state-of-the-art one step forward by combining our approach with <u>mixup data augmentation.</u>
- Guiding <u>mixup data augmentation to achieve convergence even under extreme label noise.</u>

Image classification can be formulated as the problem of learning a model $h_{\theta}(x)$ from a set of training examples $\mathcal{D}=\left\{ \left(x_{i},y_{i}\right)\right\}_ {i=1}^{N}$ with $y_{i}\in\left\{ 0,1\right\} ^{C}$ being the one-hot encoding ground-truth label corresponding to $x_{i}$. In our case, $h_{\theta}$ is a CNN and $\theta$ represents the model parameters (weights and biases). As we are considering classification under label noise, the label $y_{i}$ can be noisy (i.e. $x_{i}$ is a noisy sample). The parameters $\theta$ are fit by optimizing a loss function, e.g. categorical cross-entropy: 



$$
\begin{equation}
\ell(\theta)=\sum_{i=1}^{N} \ell_i(\theta) = -\sum_{i=1}^{N} y_{i}^T\log\left(h_{\theta}(x_{i})\right),
\end{equation}
$$



where $h_{\theta}(x)$ are the softmax probabilities produced by the model and $\log(\cdot)$ is applied elementwise. The remainder of this section describes our noisy sample modeling technique and how to extend the loss in Eq. (1) based on this model to handle label noise. For notational simplicity, we use $\ell_i(\theta)=\ell_i$ and $h_{\theta}(x_i)=h_i$ in the remainder of the paper.


![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/5.png)


Our essential observation is simple: random labels take longer to learn than clean labels, meaning that noisy samples have higher loss during the early epochs of training, allowing clean and noisy samples to be distinguished from the loss distribution alone. 


### 3.1. Label noise modeling


Mixture models are a widely used unsupervised modeling technique with the Gaussian Mixture Model (GMM) being the most popular. The probability density function (pdf) of a mixture model of $K$ components on the loss $\ell$ is defined as:



$$
\begin{equation}
p\!\left(\ell\right)=\sum_{k=1}^{K}\lambda_{k}\,p\!\left(\ell\mid k\right),
\end{equation}
$$



where $\lambda_{k}$ are the mixing coefficients for the convex combination of each individual pdf $p\!\left(\ell\mid k\right)$.


Unfortunately, the Gaussian is a poor approximation to the clean set distribution, which exhibits high skew toward zero. The more flexible beta distribution allows modelling both symmetric and skewed distributions over $[0, 1]$; the beta mixture model (BMM) better approximates the loss distribution for mixtures of clean and noisy samples. 


The beta distribution over a (max) normalized loss $\ell\in\left[0,1\right]$ is defined to have pdf:



$$
\begin{equation}p\!\left(\ell\mid\alpha,\beta\right)=\frac{\Gamma\!\left(\alpha+\beta\right)}{\Gamma\!\left(\alpha\right)\Gamma\!\left(\beta\right)}\ell^{\alpha-1}\left(1-\ell\right)^{\beta-1},\end{equation}
$$



where $\alpha,\beta>0$ and $\Gamma\!\left(\cdot\right)$ is the Gamma function, and the mixture pdf is given by substituting the above into Eq. (2). 


**Expectation Maximization (EM) procedure to fit the BMM to the observations.** 


![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/6.png)


Specifically, we introduce latent variables ${\gamma_{k}(\ell)=p(k|\ell)}$ which are defined to be the posterior probability of the point $\ell$ having been generated by mixture component $k$. In the E-step we fix the parameters ${\lambda_{k},\alpha_{k},\beta_{k}}$ and update the latent variables using Bayes rule:



$$
\begin{equation}\gamma_{k}(\ell)=\frac{\lambda_{k}\,p\!\left(\ell\mid\alpha_{k},\beta_{k}\right)}{\sum_{j=1}^{K}\lambda_{j}\,p\!\left(\ell\mid\alpha_{j},\beta_{j}\right)}.\end{equation}
$$



Given fixed ${\gamma_{k}(\ell)}$, the M-step estimates the distribution parameters ${\alpha_{k},\beta_{k}}$ using a weighted version of the method of moments:



$$
\begin{equation}\beta_{k}=\frac{\alpha_{k}\left(1-\bar{\ell}_{k}\right)}{\bar{\ell}_{k}},\;\alpha_{k}=\bar{\ell}_{k}\left(\frac{\bar{\ell}_{k}\left(1-\bar{\ell}_{k}\right)}{s_{k}^{2}}-1\right)\end{equation}
$$



with $\bar{\ell}_{k}$ being a weighted average of the losses $\left\{ \ell_{i}\right\}_{i=1}^{N}$ corresponding to each training sample $\left\{ x_{i}\right\}_{i=1}^{N}$, and $s_{k}^{2}$ being a weighted variance estimate: 



$$
\begin{equation}\bar{\ell}_{k}=\frac{\sum_{i=1}^{N}\gamma_{k}(\ell_{i})\,\ell_{i}}{\sum_{i=1}^{N}\gamma_{k}(\ell_{i})},\end{equation}
$$




$$
\begin{equation}s_{k}^{2}=\frac{\sum_{i=1}^{N}\gamma_{k}(\ell_{i})\,\left(\ell_{i}-\bar{\ell}_{k}\right)^{2}}{\sum_{i=1}^{N}\gamma_{k}(\ell_{i})}.\end{equation}
$$



The updated mixing coefficients ${\lambda_{k}}$ are then calculated in the usual way:



$$
\begin{equation}{\lambda_{k}}=\frac{1}{N}\sum_{i=1}^{N}\gamma_{k}(\ell_{i}).\end{equation}
$$



The above E and M-steps are then iterated until convergence or a maximum number of iterations (10 in our experiments) are reached. Note that the above algorithm becomes numerically unstable when the observations are very near zero and one. Our implementation simply sidesteps this issue by bounding the observations in $\left[\epsilon,1-\epsilon\right]$ instead of ${[}0, 1{]}$ ($\epsilon=10^{-4}$ in our experiments).


Finally, we obtain the probability of a sample being clean or noisy through the posterior probability:



$$
\begin{equation}p\!\left(k\mid\ell_{i}\right)=\frac{p\!\left(k\right)p\!\left(\ell_{i}\mid k\right)}{p\!\left(\ell_{i}\right)},\end{equation}
$$



where $k=0\left(1\right)$ denotes clean (noisy) classes.


### 3.2. Noise model for label correction


The static hard bootstrapping loss proposed in Reed et al., (2015) provides a mechanism to deal with label noise by adding a perceptual term to the standard cross-entropy loss that helps to correct the training objective:



$$
\begin{equation}\ell_{B}=-\sum_{i=1}^{N}\left(\left(1-w_{i}\right)y_{i}+w_{i} \textcolor{red}{z_{i}}\right)^T\log\left(\mathit{h_{i}}\right),\end{equation}
$$



where $w_{i}$ weights the model prediction $z_{i}$ in the loss function. Reed et al., (2015) use $w_{i}=0.2,\forall i$.


We refer to this approach as **static hard bootstrapping**. Reed et al., (2015) also proposed a **static soft bootstrapping** **loss** ($w_{i}=0.05,\forall i$) that uses the predicted softmax probabilities $\mathit{h}_{i}$ instead of the class prediction $z_{i}$. Unfortunately, using a fixed weight for all samples does not prevent fitting the noisy ones. 


![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/7.png)



[📄 자료 링크 ↗](http://www-personal.umich.edu/~reedscot/bootstrap.pdf)



We propose **dynamic hard** and **soft bootstrapping losses** by using our noise model to individually weight each sample; i.e., $w_{i}$ is dynamically set to $p\!\left(k=1\mid\ell_{i}\right)$ and the BMM model is estimated after each training epoch using the cross-entropy loss for each sample $\ell_{i}$. Therefore, clean samples rely on their ground-truth label $y_{i}$ ($1-w_{i}$ is large), while noisy ones let their loss being dominated by their class prediction $z_{i}$ or their predicted probabilities $\mathit{h_{i}}$ ($w_{i}$ is large), respectively, for hard and soft alternatives.


### 3.3. Joint label correction and <u>mixup</u> data augmentation


Recently Zhang et al., (2018) proposed a data augmentation technique named <u>mixup</u> that exhibits strong robustness to label noise. This technique trains on convex combinations of sample pairs ($x_{p}$ and $x_{q}$) and corresponding labels ($y_{p}$ and $y_{q}$):



$$
\begin{equation}x=\delta x_{p}+(1-\delta)x_{q},\end{equation}
$$




$$
\begin{equation}\ell=\delta\ell_{p}+(1-\delta)\ell_{q},\end{equation}
$$



where $\delta$ is randomly sampled from a beta distribution $\mathcal{B}e\left(\alpha,\beta\right)$, with $\alpha=\beta$ set to high values when learning with label noise so that $\delta$ tends to be close to $0.5$. This combination regularizes the network to favor simple linear behavior between training samples, which reduces oscillations in regions far from them.


![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/8.png)



[📄 자료 링크 ↗](https://arxiv.org/pdf/1710.09412.pdf)



<u>Mixup</u> achieves robustness to label noise by appropriate combinations of training examples. Under high-levels of noise mixing samples that both have incorrect labels is prevalent, which reduces the effectiveness of the method. We propose to fuse <u>mixup</u> and our dynamic bootstrapping to implement a robust per-sample loss correction approach:



$$
\begin{align*}\ell^{*}=&-\delta\left[\left(\left(1-w_{p}\right)y_{p}+w_{p}z_{p}\right)^T\log\left(\mathit{h}\right)\right] \\&-\left(1-\delta\right)\left[\left(\left(1-w_{q}\right)y_{q}+w_{q}z_{q}\right)^T\log\left(\mathit{h}\right)\right],\end{align*}
$$




$$
\begin{equation}{}\end{equation}
$$



The loss $\ell^{*}$ defines the hard alternative, while the soft one can be easily defined by replacing $z_{p}$ and $z_{q}$ by $h_{p}$ and $h_{q}$. These hard and soft losses exploit mixup's advantages while correcting the labels through dynamic bootstrapping, i.e. the weights $w_{p}$ and $w_{q}$ that control the confidence in the ground-truth labels and network predictions are inferred from our unsupervised noise model: $w_{p}=p\!\left(k=1\mid\ell_{p}\right)$ and $w_{q}=p\!\left(k=1\mid\ell_{q}\right)$.


Ideally, the proposed loss $\ell^{*}$ would lead to a better model by trusting in progressively better predictions during training. For high-levels of label noise, however, the network predictions are unreliable and dynamic bootstrapping may not converge when combined with the complex signal that mixup provides. This is reasonable as under high levels of noise most of the samples are guided by the network's prediction in the bootstrapping loss, encouraging the network to predict the same class to minimize the loss. We apply the regularization term used in Tanaka et al., (2018), which seeks preventing the assignment of all samples to a single class, to overcome this issue:



$$
\begin{equation}R=\sum_{c=1}^{C}p_{c}\log\left(\frac{p_{c}}{\overline{h}_{c}}\right),\end{equation}
$$



where $p_{c}$ denotes the prior probability distribution for class $c$ and $\overline{h}_{c}$ is the mean softmax probability of the model for class $c$ across all samples in the dataset.



[📄 자료 링크 ↗](https://arxiv.org/pdf/1803.11364.pdf)



### Experiments


Summary


![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/9.png)


![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/10.png)


![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/11.png)


![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/12.png)


Table 1 presents the results for static (ST) and dynamic (DY) bootstrapping in CIFAR-10. Table 2 reports outstanding accuracy for 80% of label noise, a case where we improve upon mixup. 


It is important to highlight that we achieve quite similar best and last performance for all levels of label noise in CIFAR datasets, indicating that the proposed method is robust to varying noise levels.


![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/13.png)


![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/14.png)


Table 3 explores convergence under extreme label noise conditions, showing that the proposed approach M-DYR-H fails to converge in CIFAR-10 with 90% label noise. We propose a dynamic mixup strategy in the input that uses a different $δ$ for each sample to reduce the contribution of noisy samples when they are mixed with clean ones:



$$
\begin{equation}x=\left(\frac{\delta_{p}}{\delta_{p}+\delta_{q}}\right)x_{p}+\left(\frac{\delta_{q}}{\delta_{p}+\delta_{q}}\right)x_{q},\end{equation}
$$



where $\delta_{p}=p\!\left(k=0\mid\ell_{p}\right)$ and $\delta_{q}=p\!\left(k=0\mid\ell_{q}\right)$, <u>i.e. we use the noise probability from our BMM to guide mixup in the input.</u>


Note that for clean-clean and noisy-noisy cases, the behavior remains similar to mixup with $\alpha=\beta=32$, which leads to $\delta\approx0.5$ (i.e. $\delta_{p}\approx\delta_{q}\Rightarrow$ $\delta_{p}/(\delta_{p}+\delta_{q})\approx0.5$). This configuration simplifies the input to the network when mixing a sample whose label is potentially useless,
while retaining the strengths of mixup for clean-clean and noisy-noisy combinations. This is used with the original mixup strategy to benefit from the regularization that an additional label provides.


Table 4 compares with related works for different levels of label noise using a common architecture and the 300 epochs training scheme. We outperform the related work in the presence of label noise, obtaining remarkable improvements for high levels of noise (80% and 90%) where the compared approaches <u>do not learn as well from the noisy samples (see best accuracy)</u> and <u>do not prevent fitting noisy labels (see last accuracy).</u>


Table 2 reported that hard bootstrapping works better than the soft alternative. Unfortunately, hard bootstrapping under high levels of label noise causes large variations in the loss that lead to drops in performance. To ameliorate such instabilities, we propose <u>a decreasing softmax technique Vermorel & Mohri, (2005) to progressively move from a soft to a hard dynamic bootstrapping</u>. This is implemented by modifying the softmax temperature $T$ in:



$$
\begin{equation}h_{ij}=\frac{\exp\!\left(s_{ij}/T\right)}{\sum_{k=1}^{N}\exp\!\left(s_{ik}/T\right)},\end{equation}
$$



where $s_{ij}$ denotes the <u>score obtained in the last layer of the CNN model class</u> $j$ <u>of sample</u> $x_{i}$. To move from soft to hard bootstrapping we linearly reduce the temperature for $h_p$ and $h_q$ until we reach a final temperature in a certain epoch ($T = 0.001$ and epoch 200 in our experiments)


![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/15.png)



[📄 자료 링크 ↗](https://cs.nyu.edu/~mohri/pub/bandit.pdf)



![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/16.png)


![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/17.png)


### *Pre-activation ResNet


![](/assets/seminars/unsupervised-label-noise-modeling-and-loss-correction-icml-2019/18.png)



[📄 자료 링크 ↗](https://arxiv.org/pdf/1603.05027.pdf)




[📄 자료 링크 ↗](https://hoya012.github.io/blog/deeplearning-classification-guidebook-2/)
