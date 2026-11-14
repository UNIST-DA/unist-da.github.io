---
date: 2024-01-26
title: Neural ordinary differential equations(NeurIPS 2018)
category: Paper Review
presenter: SeungSu Kam
url: https://www.notion.so/46372e04c2194c79a6ead65ac7516f6a
keywords: Neural Differential Equation
---

# Selected Paper


## Title: Neural ordinary differential equations


_Advances in neural information processing systems_ 31 (2018).


## Abstract: 


We introduce a new family of deep neural network models. Instead of specifying a discrete sequence of hidden layers, we parameterize the derivative of the hidden state using a neural network. The output of the network is computed using a blackbox differential equation solver. These continuous-depth models have constant memory cost, adapt their evaluation strategy to each input, and can explicitly trade numerical precision for speed. We demonstrate these properties in continuous-depth residual networks and continuous-time latent variable models. We also construct continuous normalizing flows, a generative model that can train by maximum likelihood, without partitioning or ordering the data dimensions. For training, we show how to scalably backpropagate through any ODE solver, without access to its internal operations. This allows end-to-end training of ODEs within larger models

- 이산적인 구조가 아닌 신경망을 통해 Hidden state의 미분을 parameterize하여 새로운 딥뉴럴 네트워크를 개발함
- blackbox ODE Solver를 통해 출력이 가능하며, 메모리 비용이 일정한 장점 존재
- 내부 연산에 접근하지 않고도 모든 ODE Solver를 통해 확장 가능한 역전파하는 방법을 보여줌

## Link



[📄 자료 링크 ↗](https://proceedings.neurips.cc/paper_files/paper/2018/file/69386f6bb1dfed68692a24c8686939b9-Paper.pdf)




[📄 PDF 자료 ↗](https://proceedings.neurips.cc/paper_files/paper/2018/file/69386f6bb1dfed68692a24c8686939b9-Paper.pdf)



# Paper Review


## Preliminary

- **Euler-Method**

    ![](/assets/seminars/neural-ordinary-differential-equationsneurips-2018/0.png)


초기 값을 사용하여 상미분 방정식 (ODE)을 풀기 위한 방법


 $A_1 = A_0 + \Delta{x}f(x_0,A_0)$


⇒ $y_{n+1} = y_n + hf(t_n , y_n)$


# Introduction


Residual networks


![](/assets/seminars/neural-ordinary-differential-equationsneurips-2018/1.png)



$$
\begin{equation}
\bold{h}_{t+1} = \bold{h}_{t}+ f({h}_{t}, \theta_t)
\end{equation}
$$



$t ∈ \{{0 . . . T\}}$, $h_t ∈ \mathbb{R}^D$


If it goes infinite layers and small step size:



$$
\begin{aligned}
& \mathbf{h}_{t+1}=f\left(\mathbf{h}_t, \theta_t\right)+\mathbf{h}_t \\
& \rightarrow \mathbf{h}_{t+1}-\mathbf{h}_t=f\left(\mathbf{h}_t, \theta_t\right) \\
& \rightarrow \frac{\mathbf{h}_{t+1}-\mathbf{h}_t}{1}=f\left(\mathbf{h}_t, \theta_t\right) \\
& \left.\rightarrow \frac{\mathbf{h}_{t+\Delta}-\mathbf{h}_t}{\Delta}\right|_{\Delta=1}=f\left(\mathbf{h}_t, \theta_t\right) \\
& \rightarrow \lim _{\Delta \rightarrow 0} \frac{\mathbf{h}_{t+\Delta}-\mathbf{h}_t}{\Delta}=f\left(\mathbf{h}_t, t, \theta\right) \\
& \rightarrow \frac{d \mathbf{h}(t)}{d t}=f(\mathbf{h}(t), t, \theta)
\end{aligned}
$$




$$
\begin{equation}
\frac{d\bold{h}({t})}{dt} =  f({h}_{t}, t, \theta)
\end{equation}
$$



⇒ infinite layers, Latent state changes continuously, Latent state dynamics controlled by one function 


![](/assets/seminars/neural-ordinary-differential-equationsneurips-2018/2.png)


### Neural ODE :



$$
y(0) = y_0, \qquad y(t) = y(0) + \int_0^t f_\theta(s, y(s)) \,d s.
$$



$ t > t_i.$


![](/assets/seminars/neural-ordinary-differential-equationsneurips-2018/3.png)


### Contributions

- **Memory efficiency**
- **Adaptive computation**
- **Parameter efficiency**
- **Scalable and invertible normalizing flows**
- **Continuous time-series models**

# Memory efficiency


Two approaches in training continuous-depth network

1. Differentiating through the operations of the forward pass is straightforward

⇒ high memory cost and introduces additional numerical error = **Vram Explode**

1. Reverse-mode automatic differentiation of ODE solutions

→ using adjoint sensitivity method (adjoint $\mathbf{a}(t)=\partial L / \partial \mathbf{z}(t)$: 각 state 별 gradient)




$$
\begin{equation}
\frac{d \mathbf{a}(t)}{d t}=-\mathbf{a}(t)^{\top} \frac{\partial f(\mathbf{z}(t), t, \theta)}{\partial \mathbf{z}}
\end{equation}
$$



ODE solve Backwards


### Reverse-mode automatic differentiation of ODE solutions


![](/assets/seminars/neural-ordinary-differential-equationsneurips-2018/4.png)


![](/assets/seminars/neural-ordinary-differential-equationsneurips-2018/5.png)

- Differentiating through 1000 operations of the forward pass ⇒ 1000 gradient memory
- adjoint sensitivity method ⇒ only needs a(1) and equation (3)

# **Parameter efficiency**


### Replacing residual networks with ODEs for supervised learning


![](/assets/seminars/neural-ordinary-differential-equationsneurips-2018/6.png)


Resnet: 6 standard residual blocks


RK-Net: ODE + Runge-Kutta integrator


ODE-Net: ODE + adjoint sensitivity method 


# Scalable and invertible normalizing flows


![](/assets/seminars/neural-ordinary-differential-equationsneurips-2018/7.png)


![](/assets/seminars/neural-ordinary-differential-equationsneurips-2018/8.png)


![](/assets/seminars/neural-ordinary-differential-equationsneurips-2018/9.png)


⇒ Computing of the determinant of the Jacobian incur cubic cost in either the dimension of z, or the number of hidden units


In Theorem 1 (Instantaneous Change of Variables).



$$
\operatorname{tr}\left(\frac{d f}{d \mathbf{z}(t)}\right) = det\frac{\partial f}{\partial z_0}
$$



![](/assets/seminars/neural-ordinary-differential-equationsneurips-2018/10.png)


⇒ Planar CNF with M hidden units can be at least as expressive as a planar NF with K = M layers, and sometimes much more expressive.


# Continuous time-series models



$$
\begin{equation}\begin{aligned}\mathbf{z}_{t_0} & \sim p\left(\mathbf{z}_{t_0}\right) \\\mathbf{z}_{t_1}, \mathbf{z}_{t_2}, \ldots, \mathbf{z}_{t_N} & =\text { ODESolve }\left(\mathbf{z}_{t_0}, f, \theta_f, t_0, \ldots, t_N\right) \\\text { each } \quad \mathbf{x}_{t_i} & \sim p\left(\mathbf{x} \mid \mathbf{z}_{t_i}, \theta_{\mathbf{x}}\right)\end{aligned}\end{equation}
$$



$f$ is time invariant, given any latent state z(t), the entire latent trajectory is uniquely defined.


![](/assets/seminars/neural-ordinary-differential-equationsneurips-2018/11.png)


RNN Encoder를 통해 얻어낸 가우시안 분포로부터 초기 히든스테이트를 구함 → ODE Solve 진행 → latent trajectory ⇒ Data space projection


![](/assets/seminars/neural-ordinary-differential-equationsneurips-2018/12.png)


![](/assets/seminars/neural-ordinary-differential-equationsneurips-2018/13.png)


# Conclusion


Using black-box ODE solvers as a model component, develop time-series modeling, supervised learning, and density estimation


⇒ memory efficient in supervised learning


⇒ Irregular time series modeling


⇒ Easy computation in Normalizing Flow
