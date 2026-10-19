---
date: 2023-03-17
title: High-Resolution Image Synthesis With Latent Diffusion Models (CVPR 2022)
category: Paper Review
presenter: Byungkook Koo
url: https://www.notion.so/1583405649a3491588ad909c912f12c7
keywords: Diffusion Model, Text-to-Image, Generative Model
---

# High-Resolution Image Synthesis With Latent Diffusion Models


### Link



[📄 자료 링크 ↗](https://openaccess.thecvf.com/content/CVPR2022/html/Rombach_High-Resolution_Image_Synthesis_With_Latent_Diffusion_Models_CVPR_2022_paper.html)



## Abstract


By decomposing the image formation process into a sequential application of denoising autoencoders, diffusion models (DMs) achieve state-of-the-art synthesis results on image data and beyond. Additionally, their formulation allows for a guiding mechanism to control the image generation process without retraining. However, since these models typically operate directly in pixel space, optimization of powerful DMs often consumes hundreds of GPU days and inference is expensive due to sequential evaluations. To enable DM training on limited computational resources while retaining their quality and flexibility, we apply them in the latent space of powerful pretrained autoencoders. In contrast to previous work, training diffusion models on such a representation allows for the first time to reach a near-optimal point between complexity reduction and detail preservation, greatly boosting visual fidelity. By introducing cross-attention layers into the model architecture, we turn diffusion models into powerful and flexible generators for general conditioning inputs such as text or bounding boxes and high-resolution synthesis becomes possible in a convolutional manner. Our latent diffusion models (LDMs) achieve new state of the art scores for image inpainting and class-conditional image synthesis and highly competitive performance on various tasks, including unconditional image generation, text-to-image synthesis, and super-resolution, while significantly reducing computational requirements compared to pixel-based DMs


## Introduction

- Image synthesis is one of the computer vision fields with the most spectacular recent development, but also among those with the greatest computational demands
    - Likelihood-based models(AR transformers): good for high-resolution synthesis(complex, natural scenes), high model complexity(billions of parameters)
    - GANs: confined to data with comparably limited variability(adversarial learning procedure does not easily scale to modeling complex, multi-modal distributions)
- Diffusion models have shown to achieve impressive results in image synthesis
    - Do not exhibit mode-collapse and training instabilities as GANs
    - Can model highly complex distributions of natural images without involving billions of parameters by heavily exploiting parameter sharing

### **Democratizing High-Resolution Image Synthesis**

- DMs mode-covering behavior spend excessive amounts of capacity and compute resources
    - Belong to the class of likelihood-based models, modeling imperceptible details of the data
    - Training the most powerful DMs often takes hundreds of GPU days (e.g. 150 -1000 V100 days)

    → Only available to a small fraction of the field, and leaves a huge carbon footprint


### **Departure to Latent Space**


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/0.png)


perceptual and semantic compression: Most bits of a digital image correspond to imperceptible details. Proposing latent diffusion models can separate mild compression stage that only eliminates imperceptible details. ⇒ LDM은 더 적은 bit수로 dimension을 내포할 수 있다

- learning can be roughly divided into two stages:
    - perceptual compression stage which removes high-frequency details but still learns little semantic variation
        - Train an autoencoder which provides a lower-dimensional representational space which is perceptually equivalent to the data space
        - Train DMs in the learned latent space, which exhibits better scaling properties with
        respect to the spatial dimensionality → spatial compression에 기댈 필요가 없음
    - Actual generative model learns the semantic and conceptual composition of the data (semantic compression)
        - train the universal autoencoding stage only once and can therefore **reuse** it for multiple DM trainings or to explore possibly completely different tasks
        - Design an architecture that connects transformers to the DM’s UNet backbone and enables arbitrary types of token-based conditioning mechanisms

### **Contribution**

1. Scales more graceful to higher dimensional data
    1. Can work on a compression level which provides more faithful and detailed reconstructions
    than previous work
    2. can be efficiently applied to high-resolution image synthesis
2. Achieve competitive performance on multiple tasks and datasets while significantly lowering
computational costs with decreasing inference costs
3. Does not require a delicate weighting of reconstruction and generative abilities
    - Different from learning both an encoder/decoder architecture and a score-based prior simultaneously
    - ensures extremely faithful reconstructions and requires very little regularization of the latent space
4. For densely conditioned tasks such as super-resolution, inpainting and semantic synthesis, our
model can be applied in a convolutional fashion and render large, consistent images of ∼ 1024 *1024 px
5. Design a general-purpose conditioning mechanism based on cross-attention, enabling multi-modal training(class-conditional, text-to-image, layout-to-image)
6. **Release pretrained latent diffusion and autoencoding models which might be reusable for a various tasks besides training of DMs**

## Related Work


### Generative Models for Image Synthesis


**Generative model**


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/1.png)


⇒ To know **distribution(manifold**) of data


VAE(Variational AutoEncoder)


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/2.png)


GAN(Generative Adversarial Network)


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/3.png)


Flow-based models(i.e. Normalizing flow)


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/4.png)


Diffusion models


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/5.png)

- The generative power of these models stems from a natural fit to the inductive biases
of image-like data when their underlying neural backbone is implemented as a **UNet**
    - DM corresponds to a lossy compressor and allow to trade image quality for compression capabilities
- Evaluating and optimizing these models in pixel space, however, has the downside of
low inference speed and very high training costs

**Model Comparison for Image Sampling**


⇒ 각 모델마다 3가지 측면에서 trade-off가 존재함 


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/6.png)


**GAN**: High Quality Samples / Fast Sampling / Mode Convergence or Diversity

    - 여러 형태에 대한 이미지 생성이 어려움(low diversity)
    - Optimize하기 어려움

**VAE, Flow-based**: High Quality Samples / Fast Sampling / Mode Convergence or Diversity

    - 생성된 이미지 quality가 낮음

**Diffusion**: High Quality Samples / Fast Sampling / Mode Convergence or Diversity

    - Sampling 속도가 매우 느림(학습, 샘플링 모두)

### Two-Stage Image Synthesis


⇒ Combining the strengths of different methods into more efficient and performant models via a two stage approach to mitigate the shortcomings of individual generative approaches


VQ-VAE: AR model + discretized VAE


VQGAN: AR transformer + CNN with adversarial objective


LDM: VAE(VQGAN) + DM 

- Scale more gently to higher dimensional latent spaces due to their convolutional backbone
- Free to choose the level of compression which optimally mediates between learning a powerful first stage

## Method


기존 DMs: Require costly function evaluations in pixel space, which causes huge demands in computation time and energy resources.


→ Propose to circumvent this drawback by introducing an explicit **separation** of the compressive from the generative learning phase


Advantage

- Utilize an autoencoding model which learns a space that is perceptually equivalent to the image space, but offers significantly reduced computational complexity.
    - By leaving the high-dimensional image space, obtain DMs which are computationally much more efficient because sampling is performed on a **low-dimensional space**
    - Exploit the inductive bias of DMs inherited from their UNet architecture

        → Alleviates the need for aggressive, quality-reducing compression levels as
        required by previous approaches

    - Obtain general-purpose compression models whose latent space can be used to train multiple generative models

### Perceptual Image Compression


Perceptual compression model is based on VQGAN and consists of an autoencoder trained by combination of a **perceptual loss** and a **patch-based adversaria**l objective


→ reconstructions are confined to the image manifold by enforcing local realism and avoids bluriness introduced by relying solely on pixel-space losses


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/7.png)



$$
x\in \mathbb{R}^{H*W*3}, z\in \mathbb{R}^{h*w*3}, f = H/h = W/w = 2^m
$$



Explored two types of regularization in autoencoder training to avoid arbitrarily high-variance in the latent spaces

- KL-reg: A small KL penalty towards a standard normal distribution over the learned latent, similar to VAE
- VQ-reg: Uses a vector quantization layer within the decoder, like VQVAE but the quantization layer is absorbed by the decoder

![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/8.png)


### Latent Diffusion Models


**Diffusion models**


→ 정보가 확산되는 것을 이용한 방법

- Diffusion process

    
$$
D_{KL}(q_\phi(z|x)||p_\theta(z))+ \mathbb{E}_{q_\phi(z|x)}[log \;p_\theta(x|z)
$$
    


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/9.png)

- Gaussian noise를 T만큼 반복하여 T 시점에는 isotropic gaussian이 되도록 변환

→ 해당 과정을 reverse하여 noise에서 의미 있는 정보로 되돌리는 과정을 학습


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/10.png)


q(forward) process



$$
q(X_{1:T}|X_0) = \prod_{t=1}^{T}q(X_t|X_{t-1}),
\;\;\;\;\;\;\; q(X_t|X_{t-1}) = N(X_t;\sqrt{1-\beta_t}X_{t-1}, \beta_t I)
$$


- 이전 값에 대해서 gaussian noise를 취해주는 형태
- beta: parameter, 0에 가깝게 설정할수록 노이즈 정도가 줄어듦. 각 단계마다 beta 값은 다름

p(reverse) process



$$
p_\theta(X_{0:T}) = p(X_T)\prod_{t=1}^Tp_\theta(X_{t-1}|X_t), \;\;\;\;\;\;\;\;\;
p_\theta(X_{t-1}|X_t)=N(X_{t-1}; \mu_\theta(X_t, t), \sum_\theta(X_t, t))
$$


- gaussian noise를 제거해가는 과정
- Noise의 mean, variance function을 학습

Diffusion loss(ELBO loss) ⇒ NLL(Negative Log-Likelihood)


Regularization + Denoising Process + Reconstruction 



$$
D_{KL}(q(\bold{x_T}|x_0)||p(\bold{x}_T))
+ \sum_{t>1}D_{KL}(q(\bold{x_{t-1}}|\bold{x}_t, x_0)||p_\theta(\bold{x}_{t-1}|\bold{x}_t))
- log\; p_\theta(\bold{x}_0 | \bold{x}_1)
$$


- Denoising term: reverse process의 conditional gaussian distr(p), forward process의 posterior prob의 KL-divergence의 합

**DDPM(Denoising Diffusion Probabilistic Model**


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/11.png)

1. Inductive bias를 늘리기 ⇒ 사람이 설계한 방향으로 대체하자
    - beta를 학습하지 않고 고정 ⇒ Regularization term을 제거
        - beta를 0.0001 ~ 0.02로 linear하게 증가하도록 scheduling해도 T 시점에서 isotropic gaussian이 획득가능함 → 굳이 학습하지 않아도 됨
    - 고정된 beta를 이용하여 reverse process의 분산을 상수화
        - t 시점까지의 누적된 noise로 설정

        ![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/12.png)

2. loss simplification
    - mean function을 새롭게 정의, 이를 이용하여 MSE 형태로 loss 단순화
        - q를 VAE reparameterization을 사용하여 x0, xt, epsilon의 linear combination으로 정의
        - t에 따른 noise에 대한 denoising score matching 형태로 바뀜

![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/13.png)


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/14.png)


→ 논문에서는 해당 방식으로 표현하고 있음


### Generative Modeling of Latent Representations


Efficient, low-dimensional latent space is more suitable for likelihood-based generative models

- Focus on the important, semantic bits of the data
- Train in a lower dimensional, computationally much more efficient space

⇒ With highly compressed, discrete latent space(Via VQGAN) we can take advantage of image-specific inductive biases that our model offers


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/15.png)


→ 일반적인 DDPM loss에 x 대신 latent variable이 들어간 형태


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/16.png)


### Conditioning Mechanisms 

- Diffusion models are in principle capable of modeling conditional distributions

    → By implementing a conditional denoising autoencoder ǫθ(zt, t, y) and paves the way to controlling the synthesis process through inputs y

- DMs into more flexible conditional image generators by augmenting their underlying UNet backbone with the cross-attention mechanism

![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/17.png)

- Domain-specific encoder Tau를 이용하여 language 등의 y를 encode
- Unet의 flattend intermediate representation를 이용하여 cross-attention 수행

![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/18.png)


→ 일반 LDM loss에 conditional한 term이 추가된 형태


## Experiments


⇒ Analyze the gains of models compared to pixel-based diffusion models in both training and inference

- LDMs trained in **VQ-regularized latent spaces** achieve better sample quality, even though the reconstruction capabilities of VQ-regularized first stage models slightly fall behind those of their continuous counterparts

    → we evaluate VQ-regularized LDMs in the remainder of the paper


### On Perceptual Compression Tradeoffs


LDMs with different downsampling factors f ∈ {1, 2, 4, 8, 16, 32} (abbreviated as LDM-f, where LDM-1 corresponds to pixel-based DMs)

- FID(Frechet Inception Distance) ⇒ Inception V3으로 embedding된 vector들 간 weasserstein-2 distance ⇒ 값이 작을수록 좋음
- Inception Score: Inception 네트워크를 이용하여 이미지의 Sharpness, Diversity를 계산, 이를 곱한 것 ⇒ 값이 클수록 좋음

![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/19.png)


LDM-{4-16}이 training progress에 따른 성능 효율이 좋았음


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/20.png)


LDM-{4-8}이 inference speed, sample quality 비율이 최적이었음


### Image Generation with Latent Diffusion


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/21.png)


CelebA-HQ에서 SOTA 달성


### Conditional Latent Diffusion


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/22.png)


→ 보다 적은 parameter를 사용하여 낮은 FID를 기록함


**Super-Resolution with Latent Diffusion**


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/23.png)


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/24.png)


**Inpainting with Latent Diffusion**


![](/assets/seminars/high-resolution-image-synthesis-with-latent-diffusion-models-cvpr-2022/25.png)


## Conclusion

- presented **latent diffusion models,** a simple and efficient way to significantly improve both the training and sampling efficiency of denoising diffusion models without degrading their quality
- Wide range of conditional image synthesis tasks can be done without task-specific architectures with cross-attention conditioning mechanism

# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
