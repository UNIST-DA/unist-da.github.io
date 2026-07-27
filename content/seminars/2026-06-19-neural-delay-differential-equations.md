---
date: 2026-06-19
title: NEURAL DELAY DIFFERENTIAL EQUATIONS
category: Lab Seminar
presenter: SeungSu Kam
url: https://www.notion.so/376046396f7e8088baf2f3b2abcfd642
keywords: Neural Differential Equation
---

# Selected Paper


## Title: NEURAL DELAY DIFFERENTIAL EQUATIONS (ICLR 2021)


## Title: Time and State Dependent Neural Delay Differential Equations (ECAI 2024)


## Abstract: 


## Abstract


Neural Ordinary Differential Equations (NODEs), a framework of continuousdepth neural networks, have been widely applied, showing exceptional efficacy in coping with some representative datasets. Recently, an augmented framework has been successfully developed for conquering some limitations emergent in application of the original framework. Here we propose a new class of continuous-depth neural networks with delay, named as Neural Delay Differential Equations (NDDEs), and, for computing the corresponding gradients, we use the adjoint sensitivity method to obtain the delayed dynamics of the adjoint. Since the differential equations with delays are usually seen as dynamical systems of infinite dimension possessing more fruitful dynamics, the NDDEs, compared to the NODEs, own a stronger capacity of nonlinear representations. Indeed, we analytically validate that the NDDEs are of universal approximators, and further articulate an extension of the NDDEs, where the initial function of the NDDEs is supposed to satisfy ODEs. More importantly, we use several illustrative examples to demonstrate the outstanding capacities of the NDDEs and the NDDEs with ODEs’ initial value. Specifically, (1) we successfully model the delayed dynamics where the trajectories in the lower-dimensional phase space could be mutually intersected, while the traditional NODEs without any argumentation are not directly applicable for such modeling, and (2) we achieve lower loss and higher accuracy not only for the data produced synthetically by complex models but also for the real-world image datasets, i.e., CIFAR10, MNIST, and SVHN. Our results on the NDDEs reveal that appropriately articulating the elements of dynamical systems into the network design is truly beneficial to promoting the network performance.



[📄 자료 링크 ↗](https://arxiv.org/pdf/2102.10801)



Discontinuities and delayed terms are encountered in the governing equations of a large class of problems ranging from physics and engineering to medicine and economics. These systems cannot be properly modelled and simulated with standard Ordinary Differential Equations (ODE), or data-driven approximations such as Neural Ordinary Differential
Equations (NODE). To circumvent this issue, latent variables are typically introduced to solve the dynamics of the system in a higher dimensional space and obtain the solution as a projection to the original space. However, this solution lacks physical interpretability. In contrast, Delay Differential Equations (DDEs), and their data-driven approximated counterparts, naturally appear as good candidates to  characterize such systems. In this work we revisit the recently proposed Neural DDE by introducing Neural State-Dependent DDE (SDDDE), a general and flexible framework that can model multiple and state- and time-dependent delays. We show that our method is competitive and outperforms other continuous-class models on a wide variety of delayed dynamical systems. Code is available at the repository here. 



[📄 자료 링크 ↗](https://arxiv.org/pdf/2306.14545)



# Paper Review


### What is Markov property

- Markov assumption: the future depends **only on the present state**, **not on the past**.

> 💡 Example: board game


### What is Non-Markovian?

- characteristic of a stochastic process in which the future state depends **not only on the present state**, **but also on the history or sequence of past states**

> 💡 Example: traffic congestion, poker


### Neural Ordinary Differential Equation (Neural ODE)

- Instead of **directly predicting the state** through an artificial neural network, it predicts the **derivative of the state** and **approximates the function** (neural network) using an ODE solver

![](/assets/seminars/neural-delay-differential-equations/0.png)



$$
z(t_1) = z(t_0) + \int_{t_0}^{t_1} f(z(t), t, \theta) dt
$$


- $z(t_1)$ , $z(t_0)$: **State**
- $f(z(t), t, \theta)$: Neural network
- $\int_{t_0}^{t_1} (\dots) dt$: **ODE Solver**

> 💡 Example: Position, Velocity


### Problem of Neural ODE


![](/assets/seminars/neural-delay-differential-equations/1.png)


![](/assets/seminars/neural-delay-differential-equations/2.png)

1. **Markov assumption**
    1. The vector field sees only the current state $y(t)$
    2. But many systems are **non-Markovian**: $dy/dt$ depends on $y(t−τ)$
2. **Initial-state problem**
    1. NODE trajectory is fully determined by a single point $y(0)$.
    2. A delayed system's future is not fixed by $y(0)$ alone — it needs a whole past segment

### What is Neural Delay Differential Equation (NDDE)?



$$
\frac{dx_t}{dt} = −2x_{t−τ}  , \text{  } t >= 0, \\
x(t) = x_0, \text{  } t <= 0.
$$



![(Zhu et al,. 2021)](/assets/seminars/neural-delay-differential-equations/3.png)


![](/assets/seminars/neural-delay-differential-equations/4.png)

- Add a **delayed term** to the vector field (Zhu et al. 2021):
    - $dy/dt = f_θ(t, y(t), y(t−τ))$, $τ ∈ ℝ⁺ $(constant), history $y(t<0)=φ(t).$
- Needs a whole history segment on $[−τ, 0]$, not just a single initial point $ y(0)$.
- **Preserves interpretability** and can identify the delay.

### Limitation of existing NDDE

- **NDDE** (Zhu 2021): one constant delay.
- **NPCDDE** (Zhu 2022): piecewise-constant delays only.
- Real systems need richer delays:
    - multiple delays
    - time-dependent `τ = g(t)`
    - state-dependent `τ = g(t, y(t))`

### Other approaches

- **ANODE**: **augment the state with latent dimensions** → expressive, but interpretability lost.
- **Neural Laplace**: solve in the Laplace domain; the delay is absorbed as `e^(−sτ)`, so no explicit delay is needed.
    - but: undefined for state-dependent delays; needs a long input trajectory; ILT causes Runge (edge) oscillations.

### **Contribution: Neural SDDDE**



$$
dy/dt = f_θ(t, y(t), y(t−τ₁(t,y)), …, y(t−τₖ(t,y))) \\
y(t < 0) = ϕ(t)
$$


- $ϕ(t)$: history function, $τ_i(t,y)$: delay function
- The model $f_θ$ is a plain MLP — identical in spirit to **Neural ODE**.

> 💡 **The real contribution is the solver**


![](/assets/seminars/neural-delay-differential-equations/5.png)


![](/assets/seminars/neural-delay-differential-equations/6.png)


![](/assets/seminars/neural-delay-differential-equations/7.png)


### **Background: how to solve a DDE** 



$$
\frac{dy(t)}{dt} = f(t, y(t), y(t − τ )), \\ y(t < 0) = y_0
$$


- On $[0, τ]$: the delayed value y(t−τ) falls inside the known history $φ$ → the DDE becomes a plain ODE.

    
$$
    \frac{dy(t)}{dt} = f(t, y(t), y_0), \\ y(0) = y_0
    $$
    

- Solve it → obtain the solution on $[0, τ]$; use it as the delayed input on $[τ, 2τ]$ → **another ODE; repeat**.


$$
ϕ′
(t = 0^−) = y′
(t = 0^+)
$$



> 💡 In general, DDEs possess a derivative jump (discontinuity) 


### **Discontinuities**


![](/assets/seminars/neural-delay-differential-equations/8.png)

- A discontinuity is seeded at $t=0: φ′(0⁻) ≠ y′(0⁺).$
- The DDE feeds its own past back in → the kink propagates by τ, one derivative-order smoother each time:
    - $y′ $ kinks at 0,$ y″ $at $τ$, $ y‴ $at $2τ$, …
- The solver must put grid points exactly on the discontinuity (an order-p method needs $C^{p+1}$ smoothness).
- Constant delay → discontinuity locations **known in advance.**
- State-dependent → discontinuity **move with the solution**.
- Detect on the fly via roots of $g_is(t) = t − τ_i(t,y) − λ_s$; new discontinuity $λ_r $= nearest such root.

### **How SDDDE works (the solver loop**


![](/assets/seminars/neural-delay-differential-equations/9.png)


![](/assets/seminars/neural-delay-differential-equations/10.png)


```python
dy/dt = f(t, y, y(t−τ)) = −y(t) + 0.5·y(t−τ)
history function = 1


If dt < τ:
	y(2.0) = 1.2999 ,dt = 0.4, τ = 0.9
	[2.0, 2.4]
	y_hat(2 - 0.9) = 1.2312 -> already solve
	dy/dt = f(2.0, 1.2999, 1.2312) = −1.2999 + 0.5×1.2312 = −0.6843
	y(2.4) = 1.2999 + 0.4×(−0.6843) = 1.0262

If dt > τ:
	y(2.0) = 1.2999 ,dt = 0.9, τ = 0.4
	
	[2.0, 2.9]
	f(2.5) -> not solve -> 1.29987
	
	y(2.9) = y(2.0) + (dt/2)·[ f(2.0) + f(2.9) ]
	f(2.0, y(2.0), y(1.6)) =  −0.65617
	f(2.9, y(2.9), y(2.5)) = −y(2.9) + 0.5·y(2.5)
	f(2.9) = −y(2.9) + 0.5×1.29987 = −y(2.9) + 0.64994
	y(2.9) = 1.29987 + (0.9/2)·[ (−0.65617) + (−y(2.9) + 0.64994) ] =  0.8945
	
	intepolation
	f(2.5) = 1.07467 => update iterate
	
	then if step is not accepted:
		find lambda_r using g_is
		t* = lambda_r + τ
		t* => discontinuity occurs
		[2.0 , t*] step stop
```


### **Experimental setup** 

- Benchmarks (synthetic):
    - time-dependent delayed logistic, $τ(t) = 2 + sin (t)$
    - state-dependent Mackey–Glass variant, $τ(y) = ½cos (y(t))$
    - delayed diffusion PDE (constant $τ = 2$)
- Metric: MSE over the trajectory. Baselines: NODE, ANODE, Neural Laplace.
- Fair-comparison choice: Laplace is given the _same_ history as SDDDE.
- All models use the Dopri5 solver; AdaBelief optimizer; 256 train / 32 test trajectories.

### **Results**


![](/assets/seminars/neural-delay-differential-equations/11.png)


![](/assets/seminars/neural-delay-differential-equations/12.png)


### Extrapolation


![](/assets/seminars/neural-delay-differential-equations/13.png)


![](/assets/seminars/neural-delay-differential-equations/14.png)

- SDDDE generalizes best
- In extrapolation, Neural Laplace suffers from overfitting in PDEs.

> ### 💡 **Limitations & discussion**  
>   
> - cannot handle **continuous / distributed** (integral) delays.  
>   
> - the **delays τ** must be specified  
>   
> ### My opinion  
>   
> - is validated only on **synthetic systems with** _**known**_ **τ**  
>   
> - cost is expensive than NODE  
>   
> - When  $   
> \tau$ goes nearby zero?


# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
