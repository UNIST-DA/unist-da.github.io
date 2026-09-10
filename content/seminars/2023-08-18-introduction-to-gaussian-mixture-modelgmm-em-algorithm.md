---
date: 2023-08-18
title: Introduction to Gaussian Mixture Model(GMM) & EM Algorithm
category: Lab Seminar
presenter: Hyejin Cho
url: https://www.notion.so/8edbb35e58c84c39a912f006d7e9e12a
keywords: Gaussian Mixture Model, EM Algorithm, UnsupervisedLearning
---

# Gaussian Mixture Model (GMM)

- A probability model
    - 여러 개의 서로 다른 특정한 확률 분포로 데이터가 생성되었다고 가정
- 다변량 분포(joint probability dustribution) : 여러 개의 독립변수들에 대한 분포

→ 데이터가 여러 개의 다변량 가우시안 분포로 이뤄졌다고 가정하는 것


정규 분포(Gaussian distribution)의 확률 분포 함수(Probability Density Function)를 나타내기 위한 파라미터 : $\mu = E(X), \sigma^2 = Var(X)$


![](/assets/seminars/introduction-to-gaussian-mixture-modelgmm-em-algorithm/0.png)


아래 수평선이 독립변수 X1이라고 한다면,


GMM은 데이터가 정규분포를 가지고 생성이 되었다고 가정함


GMM 에서 최종적으로 계산해야 하는 것: 각 분포에 대한 파라미터 값


# Mixture Model

- 데이터가 하나의 확률 분포가 아니라, 여러 개의 확률 분포로 이뤄져있다고 가정
- 만약, 독립변수가 2개일 때, 데이터가 3개의 서로 다른 정규 분포(Normal distribution, 이하 N)으로 이뤄져있다고 가정하는 경우,

    $x_i$ 라는 특정 관측치의 확률 표현은



$$
p(x_i) = \pi_{i,1}N(x_i | \mu_1, \sigma_1^2) + \pi_{i,2}N(x_i | \mu_2, \sigma_2^2) + \pi_{i,3}N(x_i | \mu_3, \sigma_2^2)
$$



$\pi_{i,1} : x_i$ 가 첫번째 정규분포를 이용해 생성되었을 확률


→ $\pi_{i.j} : $ mixing coefficient, weight


$\pi_{i.j} $ 를 나타내기 위해 $z$ 라는 latent variable 사용


$z_i = i$ 번째 관측치가 생성될 때 사용된 분포를 나타내는 잠재변수


$p(z_i = 1) = \pi_{i,1}$


GMM 은 다변량 정규분포를 가정 : $N = (\boldsymbol{\mu, \Sigma})$


독립변수의 수가 M 개 일 때, $\boldsymbol{\mu} = (\mu_1, \mu_2, ..., \mu_M)$ , $\Sigma : $ M개 변수들에 대한 covariance matrix


---


# Maximum Likelihood Estimation

- likelihood : 지금 얻은 데이터가 이 분포로부터 나왔을 가능도

![](/assets/seminars/introduction-to-gaussian-mixture-modelgmm-em-algorithm/1.png)


결과 값이 가장 커지는 $\theta$ 를 추정값 $\hat{\theta}$ 로 보는 것



$$
P(x|\theta) = \Pi_{k=1}^n P(x_k | \theta)
$$



계산 편의를 위해 보통 log값을 취함.



$$
L(\theta|x) =  \log P(x|\theta) = \Pi_{k=1}^n \log P(x_k | \theta)
$$


- GMM 을 통해 계산해야 하는 파라미터 $\theta$  : $\pi, \boldsymbol{\mu, \Sigma}$

→ probability model 이므로 Maximum Likelihood Estimation(MLE) 를 통해 추정

- N개의 관측치가 있는 데이터 X에 대해, likelihood 를 다음과 같은 조건부 확률 형태로 나타낼 수 있음


$$
X = (x_1, x_2, ...,x_N)
$$




$$
p(X|\boldsymbol{\pi,\mu, \Sigma}) = \Pi_{i=1}^N p(x_i|\boldsymbol{\pi,\mu, \Sigma})
$$



이 때 찾고자 하는 군집의 수가 K일 때



$$
p(x_i) = \pi_{i,1}N(\boldsymbol{\mu_1, \Sigma_1}) + \pi_{i,2}N(\boldsymbol{\mu_1, \Sigma_1}) + ... + \pi_{i,k}N(\boldsymbol{\mu_k, \Sigma_k}) \\
= \sum_{k=1}^K \pi_{i,k}N(\boldsymbol{\mu_k, \Sigma_k})
$$




$$
\ln\{ \Pi_{i=1}^N p(x_i|\boldsymbol{\pi,\mu, \Sigma})\} \\
= \sum_{i=1}^N \ln p(x_i|\boldsymbol{\pi,\mu, \Sigma}) \\
= \sum_{i=1}^N \ln \{\sum_{j=1}^K \pi_{i,j}N(\boldsymbol{\mu_j, \Sigma_j}) \}
$$


- GMM의 경우, 직접적인 미분을 통해 파라미터를 알아내는 데 어려움 존재

    → $\pi$ 를 모르기 때문



$$
\pi_{i,k} = P(z_i = k)
$$



$z_i = i$ 번째 관측치가 생성될 때 사용된 분포를 나타내는 잠재변수


$z$ 는 latent variable


# Expectation-Maximization Algorithm


 Expectation-Maximization Algorithm

- 잠재 변수(latent variable)를 가지고 있는 확률 모델에서 _MLE_ 를 구하는 일반화된 기법
- Z,X를 모두 알고 있다면 Complete Data, X 만 안다면 Incomplete Data
    - Incomplete Data 에 대해 EM 알고리즘 수행

![](/assets/seminars/introduction-to-gaussian-mixture-modelgmm-em-algorithm/2.png)



$$
P(z_i = k | x_i, \pi_{i,k}, \boldsymbol{\mu_k, \Sigma_k} )
$$



임의값에서 시작해, 순차적으로 $z_i$를 업데이트하면서 log-likelihood 를 최대화하는 파라미터를 찾음. 파라미터가 수렴할 때까지 반복


**[E단계] :** 각 샘플이 어떤 분포에 속하는지 소속정보 Z 추정, responsibility 가 가장 큰 카테고리를 찾아내는 것.


**[M단계]:** 각 분포에 소속된 샘플들을 이용하여 확률분포 parameter 갱신**(MLE 사용)**


2) 3)을 iterative하게 반복


---


GMM 은 세 가지 파라미터에 의해 결정



$$
\theta = \{ \pi, \boldsymbol{\mu, \Sigma }\}  \\

\scriptsize{\pi = \{\pi_1, ..., \pi_K \} \space\space \mu = \{\mu_1, ..., \mu_K \}} \space\space \Sigma = \{\Sigma_1, ..., \Sigma_K \}
$$



### Expectation Step


각 데이터가 어느 카테고리에 속하는지, 즉, responsibility를 추정


$\gamma(z_k)$ : x가 주어졌을 때 $z_k$ = 1 일 조건부 확률



$$
\gamma(z_k) = p(z_{i,k} = 1|x_i)
$$



$z_{i,k} \in \{0,1\}$ : $x_i$ 가 주어졌을 때 GMM의 k번째 Gaussian distribution이 선택되면 1, 아니면 0의 값을 갖는 binary variable



$$
\begin{aligned}\gamma\left(z_k\right) = \pi_{i k} & =p\left(z_i=k \mid x_i\right) \\& =\frac{p\left(z_i=k\right) p\left(x_i \mid z_i=k\right)}{p\left(x_i\right)} \\& =\frac{p\left(z_i=k\right) p\left(x_i \mid z_i=k\right)}{\sum_{k=1}^K p\left(x_i, z_i=k\right)} \\& =\frac{p\left(z_i=k\right) p\left(x_i \mid z_i=k\right)}{\sum_{k=1}^K p\left(z_i=k\right) p\left(x_i \mid z_i=k\right)}\end{aligned}
$$



GMM의 경우, 베이즈 정리 통해 다음 식 도출 가능



$$
\begin{aligned}\gamma\left(z_k\right) = \pi_{i k} & =p\left(z_i=k \mid x_i\right) 
& =\frac{\pi_k \mathcal{N}\left(x_i \mid \mu_k, \Sigma_k\right)}{\Sigma_{k=1}^K \pi_k \mathcal{N}\left(x_i\mid \mu_k, \Sigma_k\right)}\end{aligned}
$$



$\gamma(z_k)$ : 관측값 x를 설명하는 데에 있어 component k의 **Responsibility** 


### Maximization Step

- 구한 responsibilities 를 가지고 k 개의 정규분포의 평균, 공분산행렬, $\pi_k$를 업데이트


$$
\begin{gathered}\boldsymbol{\mu}_k^{\text {new }}=\frac{1}{N_k} \sum_{i=1}^n \gamma\left(z_{i k}\right) \mathbf{x}_i \\\boldsymbol{\Sigma}_k^{\text {new }}=\frac{1}{N_k} \sum_{i=1}^n \gamma\left(z_{i k}\right)\left(\mathbf{x}_i-\boldsymbol{\mu}_k\right)\left(\mathbf{x}_i-\boldsymbol{\mu}_k\right)^T \\\pi_k^{\text {new }}=\frac{N_k}{N}\end{gathered}
$$



앞서서 log likelihood 를 구하기 위한 식



$$
log p(\mathbf{X} | \pi, \mu, \Sigma) = \Sigma_{n=1}^N log (\Sigma_{k=1}^K \pi_k \mathcal{N} ( \mathbf{x}_n | \mu_k, \Sigma_k ))
$$



Gaussian Component의 평균 $\mu_k$ 에 대한 위 식의 미분 값을 0이라고 설정



$$
0 = - \Sigma_{n=1}^N \frac{\pi_k \mathcal{N} ( \mathbf{x}_n | \mu_k, \Sigma_k )}{\Sigma_{j} \pi_j \mathcal{N} ( \mathbf{x}_n | \mu_j, \Sigma_j )} \Sigma_k (\mathbf{x}_n - \mu_k)
$$



이를 정리한다면,



$$
\mu_k = \frac{1}{N_k} \Sigma_{n=1}^N \gamma(z_{nk}) \mathbf{x}_n
$$



Gaussian Component의  $\Sigma_k$ 에 대한 식의 미분 값을 0이라고 설정, 유사한 과정 진행



$$
\Sigma_k = \frac{1}{N_k} \Sigma_{n=1}^N \gamma(z_{nk}) (\mathbf{x}_n - \mu_k) (\mathbf{x}_n - \mu_k)^T
$$



이 Log Likelihood를 mixing 계수 $\pi_k$ 에 대해 최대화

- Lagrange Multiplier 사용.  $\pi_k$ 의 총합이 1이 되어야 하기 때문


$$
log p(\mathbf{x} | \pi, \mu, \Sigma) + \lambda (\Sigma_{k=1}^K \pi_k - 1 )
$$



최대화하면, 



$$
0 = \Sigma_{n=1}^N \frac{\mathcal{N} ( \mathbf{x}_n | \mu_k, \Sigma_k )}{\Sigma_{j} \pi_j \mathcal{N} ( \mathbf{x}_n | \mu_j, \Sigma_j )} + \lambda
$$



양변에 $\pi_k$ 를 곱해주면,



$$
0 = \Sigma_{n=1}^N \frac{\pi_k \mathcal{N} ( \mathbf{x}_n | \mu_k, \Sigma_k )}{\Sigma_{j} \pi_j \mathcal{N} ( \mathbf{x}_n | \mu_j, \Sigma_j )} + \lambda
$$




$$
\to 0 = \Sigma_{n=1}^N \gamma(r_{nk}) + \lambda
$$




$$
\to 0 = N_k + \lambda
$$




$$
\pi_k = \frac{N_k}{N}
$$



---


Evidence of Lower Bound(ELBO) : variational lower bound

- 우리가 관찰한 P(Z|X) 가 다루기 힘든 분포를 가지고 있을 때, 이를 조금 더 다루기 쉬운 분포인 Q(X)로 대신 표현하려는 과정에서 두 분포의 차이(KL Divergence) 를 최소화하기 위해 사용

![](/assets/seminars/introduction-to-gaussian-mixture-modelgmm-em-algorithm/3.png)

- 𝐿(𝑞,𝜃)는 분포함수 𝑞(𝑧)를 입력하면 수치가 출력되는 범함수(functional)
- 𝐾𝐿(𝑞∣𝑝) 은 분포함수 𝑞(𝑧) 와 𝑝(𝑧∣𝑥,𝜃) 의 차이를 나타내는 **쿨백-라이블러 발산**(Kullback–Leibler divergence, **KLD**)
- 쿨백-라이블러 발산은 항상 0과 같거나 크다.

→  따라서 𝐿(𝑞,𝜃) 는 log𝑝(𝑥)의 하한(lower bound)가 된다. **즉, 𝐿(𝑞,𝜃) 를 최대화하면 log 𝑝(𝑥)도 최대화**


E step 에서, 현재의 파라미터인 $\theta^{old} $ 고정,  ELBO $\mathcal{L}(q,\theta) $ 를 q(Z) 에 대해 최대화하는 과정


M step: q(Z)를 고정, log-likelihood 를 가장 크게 만드는 새 parameter $\theta^{new} $ 를 찾아나감. 


E-Step


![](/assets/seminars/introduction-to-gaussian-mixture-modelgmm-em-algorithm/4.png)


M-Step


![](/assets/seminars/introduction-to-gaussian-mixture-modelgmm-em-algorithm/5.png)


![](/assets/seminars/introduction-to-gaussian-mixture-modelgmm-em-algorithm/6.png)

- 빨간선: 최대화하고싶은 log likelihood
- 파란선: 초기값으로 설정한 ELBO

→ 지속적으로 EM 을 수행해 초록선과 같은 결과를 얻으려고 하는 것


---


## Reference


[https://bloomberg.github.io/foml/#lecture-26-gaussian-mixture-models](https://bloomberg.github.io/foml/#lecture-26-gaussian-mixture-models)


[https://bloomberg.github.io/foml/#lecture-27-em-algorithm-for-latent-variable-models](https://bloomberg.github.io/foml/#lecture-27-em-algorithm-for-latent-variable-models)
