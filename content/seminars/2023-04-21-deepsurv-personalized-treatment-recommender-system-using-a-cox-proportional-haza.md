---
date: 2023-04-21
title: DeepSurv: personalized treatment recommender system using a Cox proportional hazards deep neural network (ICML WCB 2016)
category: Paper Review
presenter: Jae Hun Cho
url: https://www.notion.so/b4dc9b0161c14f7cb2460b51ebf15ebb
keywords: 
---

# Selected Paper


## Title: **DeepSurv: personalized treatment recommender system using a Cox proportional hazards deep neural network**


## Abstract: 


### Background


Medical practitioners use survival models **to explore and understand the relationships between patients’ covariates (e.g. clinical and genetic features) and the effectiveness of various treatment options**. Standard survival models like the linear Cox proportional hazards model **require extensive feature engineering or prior medical knowledge to model treatment interaction at an individual level**. While nonlinear survival methods, such as neural networks and survival forests, can inherently model these high-level interaction terms, they **have yet to be shown as effective treatment recommender systems.**


### Methods


We introduce **DeepSurv**, a Cox proportional hazards deep neural network and state-of-the-art survival method for **modeling interactions between a patient’s covariates and treatment effectiveness** in order to **provide personalized treatment recommendations**.


### Results


We perform a number of experiments **training DeepSurv on simulated and real survival data**. We demonstrate that **DeepSurv performs as well as or better than other state-of-the-art survival models** and **validate that DeepSurv successfully models increasingly complex relationships between a patient’s covariates and their risk of failure**. We then show how DeepSurv models the r**elationship between a patient’s features and effectiveness of different treatment options** to show how DeepSurv can be used to provide individual treatment recommendations. Finally, we **train DeepSurv on real clinical studies to demonstrate how it’s personalized treatment recommendations would increase the survival time of a set of patients**.


### Conclusions


The predictive and modeling capabilities of DeepSurv will enable medical researchers **to use deep neural networks as a tool in their exploration, understanding, and prediction of the effects of a patient’s characteristics on their risk of failure.**


## Link



[📄 자료 링크 ↗](https://bmcmedresmethodol.biomedcentral.com/articles/10.1186/s12874-018-0482-1#Abs1)



## Background


**Goal**

- To show that the application of deep learning to survival analysis **performs as well as or better than other survival methods in predicting risk**
- To demonstrate that the deep neural network can be used as **a personalized treatment recommender system** and **a useful framework for further medical research**

**Contributions**

1. **DeepSurv performs as well as or better than other survival analysis methods** on survival data with both linear and nonlinear effects from covariates.
2. we include an additional categorical variable representing a patient’s treatment group to illustrate how **the network can learn complex relationships between an individual’s covariates and the effect of a treatment**.
3. Third, we use DeepSurv **to provide treatment recommendations tailored to a patient’s observed features.**
4. Finally, we show that **the recommender system supports medical practitioners in providing personalized treatment recommendations** that potentially could increase the median survival time for a set of patients.

Medical researchers use survival models to **evaluate the significance of prognostic variables in outcomes** such as death or cancer recurrence and subsequently i**nform patients of their treatment options**


**Survival analysis (=time to event analysis)**

- a set of statistical analyses that **takes a series of observations** and **attempts to estimate the time it takes for an event of interest to occur**

### Survival data

- Survival data is comprised of three elements: **a patient’s baseline data** $x$, **a event time** $T$, and **an event indicator** $E$
- If an event (e.g. death) is observed, the time interval $T$ corresponds to the time elapsed between the time in which the baseline data was collected and the time of the event occurring, and the event indicator is $E=1$.
- If an event is not observed, the time interval $T$ corresponds to the time elapsed between the collection of the baseline data and the last contact with the patient (e.g. end of study), and the event indicator is $E=0$. In this case, the patient is said to be $\textit{right-censored}$.

**censored : incompletely observed survival times**

- **Right censored: situation described above in which not all the patients experience the event until completion of the study, the most common type of censoring in survival studies**
- Left censored: when a subject is known to have had the event before the start of the observation, but the exact time of the event is unknown
- Interval censoredis where it is only known that the event occurred between 2 time points, but again, the exact time is unknown.

![](/assets/seminars/deepsurv-personalized-treatment-recommender-system-using-a-cox-proportional-haza/0.png)


**Survival function**

- probability that a subject of interest will survive beyond time $t$

$S(t) = \Pr(T > t)$


![](/assets/seminars/deepsurv-personalized-treatment-recommender-system-using-a-cox-proportional-haza/1.png)


**Hazard function** 

- probability an individual will not survive an extra infinitesimal amount of time $δ$, given they have already survived up to time $t$
- A greater hazard signifies a greater risk of death

$\Large\lambda(t) = \underset{\delta \rightarrow 0}{\lim} \: \frac{\Pr(t \leq T < t + \delta \: | \: T \geq t)}{\delta}$


![](/assets/seminars/deepsurv-personalized-treatment-recommender-system-using-a-cox-proportional-haza/2.png)


**Survival analysis models**

1. parametric models
- the survival time follows a known distribution
1. nonparametric models
- no dependencies on the form of parameters in underlying distributions
1. semi-parametric models
- even if the regression parameters are known, the distribution of the survival time is still unknown

![](/assets/seminars/deepsurv-personalized-treatment-recommender-system-using-a-cox-proportional-haza/3.png)


### Linear survival models


**Cox proportional hazards model(CPH)** 

- a common method for modeling an individual’s survival time
- a semi-parametric model
- <u>calculates the effects of observed covariates on the risk of an event occurring</u>

_Linear proportional hazards condition_ 

- a patient’s log-risk of failure is a linear combination of the patient’s covariates

the hazard function is composed of two non-negative functions


$\lambda(t | x) = \lambda_0(t) \cdot e ^ {h(x)}$

1. a baseline hazard function : $\lambda_0(t)$
2. a risk score : $r(x)=e^{h(x)}$
- the effect of an individual’s observed covariates on the baseline hazard
- $h(x)$ : the log-risk function

**partial likelihood** 

- the product of the probability at each event time $T_i$ that the event has occurred to individual $i$, given the set of individuals still at risk at time $T_i$

$\Large L_{c}(\beta) = \underset{i : E_{i} = 1}{\prod} \frac{\hat{r}_{\beta}(x_{i})} { \underset{j \in \Re(T_{i})}{\sum} \hat{r}_{\beta}(x_{j})} = \underset{i : E_{i} = 1}{\prod} \frac{\exp (\hat{h}_{\beta}(x_{i}))} { \underset{j \in \Re(T_{i})}{\sum} \exp (\hat{h}_{\beta}(x_{j}))}$

- the values $T_i$, $E_i$, and $x_i$ are the respective event time, event indicator, and baseline data for the $i^{th}$ observation
- The risk set $\Re(t) = \{ i : T_i \geq t \}$ is the set of patients still at risk of failure at time $t$.

**Problem**

- For example modeling **nonlinear** gene interactions, we cannot assume the data satisfies _the linear proportional hazards condition_
- It may be too simplistic to assume that the log-risk function is linear

### Nonlinear survival models


Three main types of neural networks to model nonlinear survival data


(i) classification methods 


(ii) time-encoded methods 


**(iii) risk-predicting methods**

- a feed-forward neural network that estimates an individual’s risk of failure.

**Proposed model**


Risk neural networks learn highly **complex and nonlinear relationships between prognostic features and an individual’s risk of failure without prior feature engineering or domain expertise**. 


The network is then able **to provide a personalized recommendation based on the computed risk of a treatment**.


**Faraggi-Simon Network**

- a feed-forward neural network that provides **the basis for a nonlinear proportional hazards model**
- a single hidden layer network with two or three nodes
- no prior assumption of the log-risk function
- computes nonlinear features from the training data and calculates their linear combination to estimate the log-risk function
- optimizes a modified Cox partial likelihood
- Problem : Faraggi-Simon network has not been shown to outperform the linear CPH
- Solution : applying **modern deep learning techniques** to the Cox proportional hazards loss function

**RSF (random survival forest)**

- a nonparametric ensemble method (tree method)
- popular machine learning approach to modeling patients’ hazard function
- produces an ensemble estimate for the <u>cumulative hazard function.</u>

$\Lambda (t) = \int _{0}^{t}{\lambda (\tau)d\tau }$


## Methods


First, we describe **the architecture and training details of DeepSurv**, an open source Python module that applies **recent deep learning techniques** to a nonlinear Cox proportional hazards network.


Second, we define DeepSurv as **a prognostic model** and show how to use **the network’s predicted log-risk function to provide personalized treatment recommendations.**


**DeepSurv**


![](/assets/seminars/deepsurv-personalized-treatment-recommender-system-using-a-cox-proportional-haza/4.png)

- **a deep feed-forward neural network** which predicts **the effects of a patient’s covariates** on their hazard rate parameterized by the weights of the network $θ$
- The input : a patient’s baseline data $x$
- The output ( $\hat {h}_{\theta }(x)$ ) : a single node with a linear activation **which estimates the log-risk function in the Cox model**
- the objective function : **average negative log partial likelihood with regularization**, where $N_E=1$  is the number of patients with an observable event and $λ$  is the $ℓ_2$  regularization parameter

$\large {}l(\theta) \!:=\! - \frac{1}{N_{E=1}} \sum_{i: E_{i} = 1} \left(\hat{h}_{\theta}(x_{i}) - \log \sum_{j \in \Re(T_{i})} e^{\hat{h}_{\theta}(x_{j})} \right) + \lambda \cdot ||\theta||^{2}_{2} $


M**odern deep learning techniques**

- Scaled Exponential Linear Units (SELU)

    $SELU(x)=scale∗(max(0,x)+min(0,α∗(exp(x)−1))$


    ![](/assets/seminars/deepsurv-personalized-treatment-recommender-system-using-a-cox-proportional-haza/5.png)

- Adaptive Moment Estimation (Adam), Nesterov momentum
- learning rate scheduling

    $decayed\_LR := \frac{LR}{1 + epoch \cdot lr\_decay\_rate}$

- Random hyper-parameter optimization search for tuning hyper-parameters

### Treantment recommender system


In **a clinical study**, patients are subject to **different levels of risk** based on **their relevant prognostic features and which treatment they undergo all patients** in a given study be assigned to one of $n$  treatment groups $τ∈{0,1,…,n−1}$



We assume **each treatment** $i$  **to have an independent risk function** : $\phantom {\dot {i}\!}e^{h_{i}(x)}$


**hazard function** 


$\lambda(t; x | \tau = i) = \lambda_{0}(t) \cdot e^{h_{i}(x)}$


 **recommender**  **function**


$\begin{aligned}  {}\text{rec}_{ij}(x) &= \log \left(\frac{\lambda(t;x | \tau = i)} {\lambda(t; x | \tau = j)} \right) = \log \left(\frac{\lambda_{0}(t) \cdot e^{h_{i}(x)}}{\lambda_{0}(t) \cdot e^{h_{j}(x)}} \right) \\ &= h_{i}(x) - h_{j}(x). \end{aligned}$



**Compared CPH**

- an advantage over the CPH because it calculates the recommender function without **an a priori specification of treatment interaction terms.**
- In contrast, the CPH model computes a constant recommender function unless treatment interaction terms are added to the model.
- Discovering relevant interaction terms is **expensive** because it requires extensive experimentation or prior biological knowledge of treatment outcomes.
- **Therefore, DeepSurv is more cost-effective compared to CPH.**

## Results


First, we use simulated data to show how DeepSurv successfully learns the true log-risk function of a population. 


Second, we validate the network’s predictive ability by training DeepSurv on real survival data. 


Third, we simulate treatment data to verify that the network models multiple risk functions in a population based on the specific treatment a patient undergoes. 


Fourth, we demonstrate how DeepSurv provides treatment recommendations and show that DeepSurv’s recommendations improve a population’s survival rate.


In addition to training DeepSurv on each dataset, we run a linear CPH regression for a baseline comparison. 


We also fit a RSF to compare DeepSurv against a state-of-the-art nonlinear survival model. 


Even though we can compare the RSF’s predictive accuracy to DeepSurv’s, we do not measure the RSF’s performance on modeling a simulated dataset’s true log-risk function $h
(x)$. 


This is due to the fact that the the RSF calculates the cumulative hazard function $\Lambda (t) = \int _{0}^{t}{\lambda (\tau)d\tau }$ rather than the hazard function $λ(t)$.


## Evaluation


### Survival data


**concordance-index (C-index)**

- the most common metric used in survival analysis to evaluate the models’ predictive accuracy on the survival data
- reflects a measure of how well a model predicts the ordering of patients’ death times.
- For context, a $c =0.5$ is the average C-index of a random model, whereas $c =1$ is a perfect ranking of death times.

### Treatment recommendations


We do not calculate the recommended treatment for CPH


**DeepSurv & RSF**

- Determine the recommended treatment for each patient in the test set
- are capable of predicting an individual’s hazard per treatment because each computes relevant interaction terms
- For DeepSurv, we choose the recommended treatment by **calculating the recommender function**
- Because the RSF predicts a cumulative hazard for each patient, we **choose the treatment with the minimum cumulative hazard.**
- identify two subsets of patients: those whose treatment group aligns with the model’s recommended treatment (**Recommendation**) and those who do not undergo the recommended treatment (**Anti-Recommendation**)
- **calculate the median survival time** of each subset to determine if a model’s treatment recommendations increase the survival rate of the patients
- We then perform **a log-rank test** to validate whether the difference between the two subsets is significant

### simulated survival data


**Two experiments with simulated survival data**

1. one with **a linear log-risk function**
2. one with **a nonlinear (Gaussian) log-risk function**

**simulated data** : can ascertain whether DeepSurv can successfully **model the true log-risk function** instead of overfitting random noise


a training, validation, and testing set of $N =4000,1000,1000$ observations


Each observation $x$  represents a patient vector with $d =10$ covariates


The ten variables are each drawn from a uniform distribution on $[−1,1)$


generate a patient’s death time $T$  as a function of their covariates by using the exponential Cox model


$T \sim \text{Exp} (\lambda(t; x)) = \text{Exp} \left(\lambda_{0} \cdot {e}^{h(x)} \right).$


the log-risk function $h(x)$ only depends on two of the ten covariates

- to verify that DeepSurv discerns the relevant covariates from the noise
- choose a censoring time to represent the ‘end of study’ such that 50 percent of the patients have an observed event, $E=1$, in the dataset

### Linear experiment


simulate patients to have a linear log-risk function for $x \in \mathbb {R}^{d}$


$h(x) = x_{0} + 2x_{1}$


![Table 1](/assets/seminars/deepsurv-personalized-treatment-recommender-system-using-a-cox-proportional-haza/6.png)


![](/assets/seminars/deepsurv-personalized-treatment-recommender-system-using-a-cox-proportional-haza/7.png)


**Mean-squared- error (MSE)** between a model’s predicted log-risk and the true log-risk values

- CPH : $20.528 057 878 872 541$
- DeepSurv :  $0.192 683 15$

### Nonlinear experiment


log-risk function to be a **Gaussian** with $λ_{max}=5.0$ and a scale factor of $r=0.5$


$h(x) = \log (\lambda_{\max}) \: \exp \left(-{\frac{x_{0}^{2} + x_{1}^{2}}{2 r^{2}}} \right).$


![](/assets/seminars/deepsurv-personalized-treatment-recommender-system-using-a-cox-proportional-haza/8.png)


### Real survival data experiments


**Real survival dataset**

1. the Worcester Heart Attack Study (WHAS)
2. the Study to Understand Prognoses Preferences Outcomes and Risks of Treatment (SUPPORT)
3. The Molecular Taxonomy of Breast Cancer International Consortium (METABRIC)

### Worcester Heart Attack Study

- investigates **the effects of a patient’s factors on acute myocardial infraction (MI) survival**
- The dataset consists of **1638 observations** and **5 features**: age, sex, body-mass-index (BMI), left heart failure complications (CHF), and order of MI (MIORD)
- 20 percent of the dataset as a testing set
- A total of **42.12 percent of patients** died during the survey with **a median death time of 516.0** **days**
- [Table1](/b4dc9b0161c14f7cb2460b51ebf15ebb#e1e8b564aa6a42fcae43847f9b7d7298)

### **Study to Understand Prognoses Preferences Outcomes and Risks of Treatment (SUPPORT)**

- a larger study that **researches the survival time of seriously ill hospitalized adults**
- **9,105** patients and **14** features for which almost all patients have observed entries (age, sex, race, number of comorbidities, presence of diabetes, presence of dementia, presence of cancer, mean arterial blood pressure, heart rate, respiration rate, temperature, white blood cell count, serum’s sodium, and serum’s creatinine)
- drop patients with any missing features
- 20 percent of the dataset as a testing set
- A total of **68.10 percent of patients** died during the survey with **a median death time of 58 days**
- [Table1](/b4dc9b0161c14f7cb2460b51ebf15ebb#e1e8b564aa6a42fcae43847f9b7d7298)

### **Molecular Taxonomy of Breast Cancer International Consortium (METABRIC)**

- uses **gene and protein expression profiles** to determine **new breast cancer subgroups** in order to help physicians **provide better treatment recommendations**
- gene expression data and clinical features for **1,980 patients**, and **57.72 percent have an observed death** due to breast cancer with a **median survival time of 116 months**
- prepare the dataset in line with the Immunohistochemical 4 plus Clinical (**IHC4+C**) test, which is a common prognostic tool for evaluating treatment options for breast cancer patients
- join the 4 gene indicators (_MKI67, EGFR, PGR, and ERBB2_) with the a patient’s 5 clinical features (hormone treatment indicator, radiotherapy indicator, chemotherapy indicator, ER-positive indicator, age at diagnosis)
- 20 percent of the patients as the test set
- [Table1](/b4dc9b0161c14f7cb2460b51ebf15ebb#e1e8b564aa6a42fcae43847f9b7d7298)

### **Treatment recommender system experiments**


perform two experiments to demonstrate the effectiveness of DeepSurv’s treatment recommender system

1. we simulate treatment data by including **an additional covariate to the simulated data** from nonlinear experiment
2. we **apply the recommender system to a real dataset** used to study the effects of hormone treatment on breast cancer patients

### **Simulated treatment data**


uniformly assign a treatment group $τ∈{0,1}$ to each simulated patient in the dataset


All of the patients in group $τ=0$ were ‘unaffected’ by the treatment (e.g. given a placebo) and have a constant log-risk function $h_0(x)$


The other group $τ=1$ is prescribed a treatment with Gaussian effects and has a log-risk function $h_1(x)$ with $λ_{max}=10$ and $r=0.5$


![](/assets/seminars/deepsurv-personalized-treatment-recommender-system-using-a-cox-proportional-haza/9.png)


**Kaplan - Meier estimator**

- a non-parametric statistic used to estimate the survival function from lifetime data.
- It is used to measure the fraction of subjects living for a certain amount of time after treatment.

$\large \hat{S(t)} = \prod_{i: t_i <= t}{\frac{n_i - d_i}{n_i}}$

- where $n_i$ is a number of individuals who are at risk at time point, $t_i$ and $d_i$ is a number of subjects that experienced the event at time $t_i$

**Log-rank test**

- the most commonly-used statistical test for comparing the survival distributions of two or more groups

![](/assets/seminars/deepsurv-personalized-treatment-recommender-system-using-a-cox-proportional-haza/10.png)


![](/assets/seminars/deepsurv-personalized-treatment-recommender-system-using-a-cox-proportional-haza/11.png)

- [Table1](/b4dc9b0161c14f7cb2460b51ebf15ebb#e1e8b564aa6a42fcae43847f9b7d7298)

### Rotterdam & German Breast Cancer Study Group (GBS)

- first **train DeepSurv on breast cancer data from the Rotterdam tumor bank**
- **1546 patients** with node-positive breast cancer, and nearly **90 percent of the patients have an observed death time** (Rotterdam tumor bank)
- construct **a recommender system to provide treatment recommendations** to patients from a study by the **German Breast Cancer Study Group (GBSG)**
- The testing data from the GBSG contains complete data for **686 patients (56 percent are censored)** in **a randomized clinical trial** that studied **the effects of chemotherapy and hormone treatment on survival rate**

![](/assets/seminars/deepsurv-personalized-treatment-recommender-system-using-a-cox-proportional-haza/12.png)

- [Table1](/b4dc9b0161c14f7cb2460b51ebf15ebb#e1e8b564aa6a42fcae43847f9b7d7298)

### **Conclusion**

- Higher performance due to the flexibility of the model
- Effective treatment recommendations based on the predicted effect of treatment options on an individual’s risk

We validated that **DeepSurv predicts patients’ risk mostly as well as or better than other linear and nonlinear survival methods**. 


We experimented on increasingly complex survival datasets and demonstrated that **DeepSurv computes complex and nonlinear features without a priori selection or domain expertise**. 


We then demonstrated that **DeepSurv is superior in predicting personalized treatment recommendations** compared to the state-of-the-art survival method of **random survival forests.** 


We also **released a Python module** that implements DeepSurv and scripts for running reproducible experiments in Docker.
