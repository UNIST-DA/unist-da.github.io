---
date: 2025-12-08
title: OIL-AD: An anomaly detection framework for decision-making sequences
category: Lab Seminar
presenter: Yongmin Kim
url: https://www.notion.so/2bc046396f7e806dab28eb0090bf7390
keywords: reinforcement learning, Time-series anomaly detection, UnsupervisedLearning
---

# Selected Paper


## Title: **OIL-AD: An anomaly detection framework for decision-making sequences**


## Abstract: 


[Anomaly detection](https://www.sciencedirect.com/topics/computer-science/anomaly-detection) in decision-making sequences is a challenging problem due to the complexity of normality [representation learning](https://www.sciencedirect.com/topics/computer-science/representation-learning) and the sequential nature of the task. Most existing methods based on [Reinforcement Learning](https://www.sciencedirect.com/topics/computer-science/reinforcement-learning)  (RL) are difficult to implement in the real world due to unrealistic 
assumptions, such as having access to environment dynamics, reward signals, and online interactions with the environment. To address these limitations, we propose an [unsupervised method](https://www.sciencedirect.com/topics/computer-science/unsupervised-method) named Offline [Imitation Learning](https://www.sciencedirect.com/topics/social-sciences/imitation-learning) [based Anomaly Detection](https://www.sciencedirect.com/topics/computer-science/anomaly-based-detection) (OIL-AD), which [detects anomalies](https://www.sciencedirect.com/topics/computer-science/detect-anomaly) in decision-making sequences using two extracted behaviour features: _action optimality_ and _sequential association_. Our offline learning model is an adaptation of behavioural cloning with a transformer [policy network](https://www.sciencedirect.com/topics/social-sciences/policy-networks), where we modify the training process to learn a Q function and a state [value function](https://www.sciencedirect.com/topics/computer-science/function-value) from normal trajectories. We propose that the Q function and the state value function can provide sufficient information about agents’ behavioural data, from which we derive two features for anomaly detection. The intuition behind our method is that the _action optimality_ feature derived from the Q function can differentiate the optimal action from others at each local state, and the _sequential association_ feature derived from the state value function has the potential to 
maintain the temporal correlations between decisions (state–action pairs). Our experiments show that OIL-AD can achieve outstanding online anomaly detection performance with up to 34.8% improvement in  score over comparable baselines. The [source code](https://www.sciencedirect.com/topics/physics-and-astronomy/source-coding) is available on [https://github.com/chenwang4/OILAD](https://github.com/chenwang4/OILAD)


## Link


[https://www.sciencedirect.com/science/article/pii/S0031320325003164](https://www.sciencedirect.com/science/article/pii/S0031320325003164)


# Paper Review



[📄 PDF 자료 ↗](https://github.com/UNIST-DA/unist-da.github.io/releases/download/seminar-assets/2025-12-08-oil-ad-an-anomaly-detection-framework-fo-0.pdf)



# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
