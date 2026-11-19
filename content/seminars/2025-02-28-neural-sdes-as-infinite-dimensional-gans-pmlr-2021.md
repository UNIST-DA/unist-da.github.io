---
date: 2025-02-28
title: Neural SDEs as Infinite-Dimensional GANs (PMLR, 2021)
category: Paper Review
presenter: SeungSu Kam
url: https://www.notion.so/193046396f7e8060ae4df1ff7a564d8d
keywords: Neural Differential Equation, Generative Model
---

# Selected Paper


## Title: Neural SDEs as Infinite-Dimensional GANs(PMLR, 2021)


## Abstract: 


Stochastic differential equations (SDEs) are a staple of mathematical modelling of temporal dynamics. However, a fundamental limitation has been that such models have typically been relatively inflexible, which recent work introducing Neural SDEs has sought to solve. Here, we show that the current classical approach to fitting SDEs may be approached as a special case of (Wasserstein) GANs, and in doing so the neural and classical regimes may be brought together. The input noise is Brownian motion, the output samples are time-evolving paths produced by a numerical solver, and by parameterising a discriminator as a Neural Controlled Differential Equation (CDE), we obtain Neural SDEs as (in modern machine learning parlance) continuous-time generative time series models. Unlike previous work on this problem, this is a direct extension of the classical approach without reference to either prespecified statistics or density functions. Arbitrary drift and diffusions are admissible, so as the Wasserstein loss has a unique global minima, in the infinite data limit \textit{any} SDE may be learnt.


### Main Contribution

- **Reinterpret the classical approach and develop a continuous-time (GAN) model**
- **Offer flexibility and theoretical guarantees**
- **Empirical validation**

## Link



[📄 자료 링크 ↗](https://proceedings.mlr.press/v139/kidger21b.html)



### GANs (D: Discriminator, G: Generator)



$$
\min_G \max_D \; \mathbb{E}_{x \sim p_{\text{data}}} \left[ \log D(x) \right] + \mathbb{E}_{z \sim p_z} \left[ \log \left( 1 - D\left( G(z) \right) \right) \right]
$$



⇒ limitation: local minimum


### Wasserstein GANs



$$
\min_G \max_{D \in \mathcal{D}} \; \mathbb{E}_{x \sim p_{\text{data}}} \left[ D(x) \right] - \mathbb{E}_{z \sim p_z} \left[ D\left( G(z) \right) \right]
$$



# Paper Review


## Introduction


### Neural differential equations




$$
{dX_t} = f(t, X_t){dt}
$$



⇒ limitation: Lack of stochasticity, uncertainty


### Stochastic differential equations



$$
dX_t = f(t, X_t)\,dt + g(t, X_t) \circ dW_t,
$$



### Conventional **SDE modelling:**

- A domain expert will formulate an SDE model using $σ◦dW_t$
- Once an SDE model is chosen, the model parameters must be **calibrated from real-world data**
    - The parameters are trained the model to match target statistics: $\mathbb{E} \left[ F_i(X) \right], \quad 1 \leq i \leq n$

Therer are two types of studies in **Neural SDE**

- the terminal state of the SDE = terminal value
- **the full time-evolution of the SDE = trajectory**

**⇒ This paper fitting SDE using a neural SDE and a neural CDE (controlled differential equation) as a generator–discriminator pair from the perspective of Wasserstein GANs.**


## Methods


### In SDE

- SDEs are maps from a **noise distribution** (Wiener measure, the distribution of Brownian
motion) to some **solution distribution**
- **It is hard to evaluate its probability density.**

⇒ So, in general, **SDE** fit to data by asking that the model statistics $\mathbb{E}_{X \sim \text{model}} \left[ F_i(X) \right], \quad 1 \leq i \leq n $ match the data statistics $\mathbb{E}_{X \sim \text{data}} \left[ F_i(X) \right], \quad 1 \leq i \leq n $


### In GAN

- $\mu $: noise distribution $\in $ $\mathcal{X}$ space
- $ν$: target probability distribution $\in \mathcal{Y}$
- $G_{\theta}: X \to Y $, $G_{\theta}({\mu}) $ approximates $ν$
- GANs examine the statistics of samples from $G_θ(µ)$,  and **seek to match the statistics
of the model to the statistics of the data**  using Discriminator


$$
\mathbb{E}_{X \sim \text{model}} \left[ F_i(X) \right] = \mathbb{E}_{X \sim \text{data}} \left[ F_i(X \right)]
$$



### **What GANs and SDEs have in common**

- Both GANs and SDEs involve the **process of generating samples by transforming random nois**e.
- In both methods, **the probability density is not explicitly defined or calculated**
- Instead, sampling is done, and model fitting is done by **fitting a statistic.**

![](/assets/seminars/neural-sdes-as-infinite-dimensional-gans-pmlr-2021/0.png)


![](/assets/seminars/neural-sdes-as-infinite-dimensional-gans-pmlr-2021/1.png)


### **Dense data regime**


 **⇒ use Interpolation** 


$\hat{z}: [0, T] \to \mathbb{R}^y$ such that $\hat{z}(t_i) = z_i, $ 


### **Sparse data regime** 


**⇒ sample the generato**r at whatever time points are desired, and then **interpolate both the training data and the generated data**


### Using Wasserstein loss



**Generator Loss**



$$
\begin{equation}
\min_\theta \; \mathbb{E}_{V,W}\left[ D_\phi\left(Y_\theta(V, W)\right) \right]
\end{equation}
$$



**Discriminator Loss**



$$
\begin{equation}
\max_\phi \; \left[ \mathbb{E}_{V,W}\left[ D\phi\left(Y_\theta(V, W)\right) \right] - \mathbb{E}_z\left[ D_\phi\left(\hat{z}\right) \right] \right]
\end{equation}
$$



> 💡 - Wasserstein GANs need a **Lipschitz discriminator**  
>   
> - In this paper, they use  gradient penalty at **discriminator (WGAN-GP, Gulrajani et al. (2017))**


## Experiments

- perform four dataset which is selected to represent a different regime
    - univariate synthetic data
    - large-scale dataset
    - conditional generative problem
    - dataset of weight evolution under SGD

### Time-dependent Ornstein–Uhlenbeck process



$$
dz_t = (\mu t - \theta_{z_{t}})dt + \sigma \circ dW_t
$$



![](/assets/seminars/neural-sdes-as-infinite-dimensional-gans-pmlr-2021/2.png)


![](/assets/seminars/neural-sdes-as-infinite-dimensional-gans-pmlr-2021/3.png)

- Classification: to distinguish real data from fake data.
    - **Larger losses**, meaning inability to classify, indicate better performance of the
    generative model
- Prediction: train-on-synthetic-test-on-real (TSTR) metric
    - **Smaller losses**, meaning ability to predict, are better.
- Maximum mean discrepancy: distance between probability distributions with respect to a kernel or feature map
    - **Smaller values**, meaning closer distributions, are better

### Google/Alphabet stock prices

- large-scale dataset

![](/assets/seminars/neural-sdes-as-infinite-dimensional-gans-pmlr-2021/4.png)


### Air Quality in Beijing

- train this as a conditional generative problem, using class labels that correspond to 14 different locations the data was measured at

![](/assets/seminars/neural-sdes-as-infinite-dimensional-gans-pmlr-2021/5.png)


### Weights trained via SGD

- train several small convolutional networks on MNIST for 100 epochs
- record their weights on every epoch

⇒ the weight updates when training a neural network via stochastic gradient descent with momentum = SDE


![](/assets/seminars/neural-sdes-as-infinite-dimensional-gans-pmlr-2021/6.png)


실제 코드 구현 결과:


```python
class MLP(torch.nn.Module):
    def __init__(self, in_size, out_size, mlp_size, num_layers, tanh):
        super().__init__()

        model = [torch.nn.Linear(in_size, mlp_size),
                 LipSwish()]
        for _ in range(num_layers - 1):
            model.append(torch.nn.Linear(mlp_size, mlp_size))
            ###################
            # LipSwish activations are useful to constrain the Lipschitz constant of the discriminator.
            # (For simplicity we additionally use them in the generator, but that's less important.)
            ###################
            model.append(LipSwish())
        model.append(torch.nn.Linear(mlp_size, out_size))
        if tanh:
            model.append(torch.nn.Tanh())
        self._model = torch.nn.Sequential(*model)

    def forward(self, x):
        return self._model(x)


###################
# Now we define the SDEs.
#
# We begin by defining the generator SDE.
###################
class GeneratorFunc(torch.nn.Module):
    sde_type = 'stratonovich'
    noise_type = 'general'

    def __init__(self, noise_size, hidden_size, mlp_size, num_layers):
        super().__init__()
        self._noise_size = noise_size
        self._hidden_size = hidden_size

        ###################
        # Drift and diffusion are MLPs. They happen to be the same size.
        # Note the final tanh nonlinearity: this is typically important for good performance, to constrain the rate of
        # change of the hidden state.
        # If you have problems with very high drift/diffusions then consider scaling these so that they squash to e.g.
        # [-3, 3] rather than [-1, 1].
        ###################
        self._drift = MLP(1 + hidden_size, hidden_size, mlp_size, num_layers, tanh=True)
        self._diffusion = MLP(1 + hidden_size, hidden_size * noise_size, mlp_size, num_layers, tanh=True)

    def f_and_g(self, t, x):
        # t has shape ()
        # x has shape (batch_size, hidden_size)
        t = t.expand(x.size(0), 1)
        tx = torch.cat([t, x], dim=1)
        return self._drift(tx), self._diffusion(tx).view(x.size(0), self._hidden_size, self._noise_size)


###################
# Now we wrap it up into something that computes the SDE.
###################
class Generator(torch.nn.Module):
    def __init__(self, data_size, initial_noise_size, noise_size, hidden_size, mlp_size, num_layers):
        super().__init__()
        self._initial_noise_size = initial_noise_size
        self._hidden_size = hidden_size

        self._initial = MLP(initial_noise_size, hidden_size, mlp_size, num_layers, tanh=False)
        self._func = GeneratorFunc(noise_size, hidden_size, mlp_size, num_layers)
        self._readout = torch.nn.Linear(hidden_size, data_size)

    def forward(self, ts, batch_size):
        # ts has shape (t_size,) and corresponds to the points we want to evaluate the SDE at.

        ###################
        # Actually solve the SDE.
        ###################
        init_noise = torch.randn(batch_size, self._initial_noise_size, device=ts.device)
        x0 = self._initial(init_noise)

        ###################
        # We use the reversible Heun method to get accurate gradients whilst using the adjoint method.
        ###################
        xs = torchsde.sdeint_adjoint(self._func, x0, ts, method='reversible_heun', dt=1.0,
                                     adjoint_method='adjoint_reversible_heun',)
        xs = xs.transpose(0, 1)
        ys = self._readout(xs)

        ###################
        # Normalise the data to the form that the discriminator expects, in particular including time as a channel.
        ###################
        ts = ts.unsqueeze(0).unsqueeze(-1).expand(batch_size, ts.size(0), 1)
        return torchcde.linear_interpolation_coeffs(torch.cat([ts, ys], dim=2))


###################
# Next the discriminator. Here, we're going to use a neural controlled differential equation (neural CDE) as the
# discriminator, just as in the "Neural SDEs as Infinite-Dimensional GANs" paper. (You could use other things as well,
# but this is a natural choice.)
#
# There's actually a few different (roughly equivalent) ways of making the discriminator work. The curious reader is
# encouraged to have a read of the comment at the bottom of this file for an in-depth explanation.
###################
class DiscriminatorFunc(torch.nn.Module):
    def __init__(self, data_size, hidden_size, mlp_size, num_layers):
        super().__init__()
        self._data_size = data_size
        self._hidden_size = hidden_size

        # tanh is important for model performance
        self._module = MLP(1 + hidden_size, hidden_size * (1 + data_size), mlp_size, num_layers, tanh=True)

    def forward(self, t, h):
        # t has shape ()
        # h has shape (batch_size, hidden_size)
        t = t.expand(h.size(0), 1)
        th = torch.cat([t, h], dim=1)
        return self._module(th).view(h.size(0), self._hidden_size, 1 + self._data_size)


class Discriminator(torch.nn.Module):
    def __init__(self, data_size, hidden_size, mlp_size, num_layers):
        super().__init__()

        self._initial = MLP(1 + data_size, hidden_size, mlp_size, num_layers, tanh=False)
        self._func = DiscriminatorFunc(data_size, hidden_size, mlp_size, num_layers)
        self._readout = torch.nn.Linear(hidden_size, 1)

    def forward(self, ys_coeffs):
        # ys_coeffs has shape (batch_size, t_size, 1 + data_size)
        # The +1 corresponds to time. When solving CDEs, It turns out to be most natural to treat time as just another
        # channel: in particular this makes handling irregular data quite easy, when the times may be different between
        # different samples in the batch.

        Y = torchcde.LinearInterpolation(ys_coeffs)
        Y0 = Y.evaluate(Y.interval[0])
        h0 = self._initial(Y0)
        hs = torchcde.cdeint(Y, self._func, h0, Y.interval, method='reversible_heun', backend='torchsde', dt=1.0,
                             adjoint_method='adjoint_reversible_heun',
                             adjoint_params=(ys_coeffs,) + tuple(self._func.parameters()))
        score = self._readout(hs[:, -1])
        return score.mean()
```


```python
## Train

for step in trange:
    real_samples, = next(infinite_train_dataloader)

    generated_samples = generator(ts, batch_size)
    generated_score = discriminator(generated_samples)
    real_score = discriminator(real_samples)
    loss = generated_score - real_score
    loss.backward()
```


![](/assets/seminars/neural-sdes-as-infinite-dimensional-gans-pmlr-2021/7.png)

<details>
<summary>추가 결과</summary>

![](/assets/seminars/neural-sdes-as-infinite-dimensional-gans-pmlr-2021/8.png)


![](/assets/seminars/neural-sdes-as-infinite-dimensional-gans-pmlr-2021/9.png)


![](/assets/seminars/neural-sdes-as-infinite-dimensional-gans-pmlr-2021/10.png)


</details>


# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
