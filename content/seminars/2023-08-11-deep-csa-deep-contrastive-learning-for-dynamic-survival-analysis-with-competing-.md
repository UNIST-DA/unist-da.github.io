---
date: 2023-08-11
title: Deep-CSA: Deep Contrastive Learning for Dynamic Survival Analysis With Competing Risks (JBHI 2022)
category: Paper Review
presenter: Jae Hun Cho
url: https://www.notion.so/f363a8c064884a2eba9ab2a67c8db2f2
keywords: Survival Analysis, Contrastive learning, DeepLearning
---

# Selected Paper


## Title: **Deep-CSA: Deep Contrastive Learning for Dynamic Survival Analysis With Competing Risks**


## Abstract


Survival analysis (SA) is widely used to analyze data in which the time until the event is of interest. Conventional SA techniques assume a specific form for viewing the distribution of survival time as the hitting time of a stochastic process, and explicitly model the relationship between covariates and the distribution of the events hitting time. Although valuable, existing SA models seldom consider to model the dynamic correlations between covariates and more than one event of interest (i.e., competing risks) in the disease progression of subjects. To alleviate this critical problem, we propose a novel deep contrastive learning model to obtain a deep understanding of disease progression of subjects with competing risks from their longitudinal observational data. Specifically, we design a self-supervised objective for learning dynamic representations of subjects suffering from multiple competing risks, such that the relationship between covariates and each specific competing risk changes over time can be well captured. Experiments on two open-source clinical datasets, i.e., MIMIC-III and EICU, demonstrate the effectiveness of our proposed model, with remarkable improvements over the state-of-the-art SA models.


Summary

- 대부분의 기존 SA 모델들은 환자의 질병 진행에서 competing risks와 covariates 사이의 dynamic 상관관계들을 모델링하는 것을 고려하지 않음
- 따라서 competing risks를 가진 환자들의 질병 진행에 대한 깊은 이해를 얻기 위한 새로운 deep contrastive learning model을 제안
- competing risks를 가진 환자들의 dynamic representations를 학습하기 위한 self-supervised objective를 설계
- 두 가지 오픈 소스 clinical datasets(MIMIC-III and EICU)에서 SOTA 성능 달성

## Link



[📄 자료 링크 ↗](https://ieeexplore.ieee.org/document/9756287)



# Paper Review


## **Introduction**


Survival analysis (SA)

- <u>prognosing the time-to-event</u> by **estimating the relationships between covariates and the hitting time of events of interest.**
- It has been widely recognized as an essential tool for health service management.

![](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/0.jpg)


![](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/1.png)


![](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/2.jpg)


CPH(Cox proportional hazard model)

- A globally accepted tool for investigating the relationship between the survival time of subjects and one or more predictor variables
- **A strong assumption on both the distribution of survival time and linear combination of predictor covariate**

Deep learning-based survival analysis models

- **Making no assumptions** about the form of the underlying distribution of survival time process

Competing risks

- Fine-Gray model
- DeepHit, Dynamic-DeepHit

이전 연구 : Powerful representations can lead to better performance on the downstream tasks


가설 : **Learning essential representations of subjects from their longitudinal observational data can improve the performance of SA with competing risks as well.**


Existing deep learning-based models

- learn the representations of subjects by reconstructing data in a supervised manner
- **may not be sufficiently prognostic to capture the semantic similarity** between subjects suffering from the same competing risk, since they <u>may lack the ability to fully utilize the potential of censored data</u>.

Note that <u>part of censored subjects can be analogized as unlabeled samples</u> during learning. In this sense, the task of survival analysis for competing risks can be recognized as <u>a semi-supervised learning problem</u>. 


**The main contributions**

1. **Without assumptions** about the form of the underlying time-to-event process, we employ **a deep contrastive learning framework** that consists of <u>a single shared encoder</u> and <u>a family of cause-specific subnetworks</u> for dynamic SA with multiple competing risks. The shared encoder equipped with the contrastive learning strategy is used **to capture meaningful representation of subjects**, which benefits the cause-specific subnetworks exploiting both survival times and relative risks, such that the time-dependent influence of covariates on time-to-event can be well addressed.
2. In addition to the competing risk-supervised learning strategy, we design **two data generation strategies**, namely, mask-generation and shuffle-generation, that can contrastively <u>capture the meaningful representations of subjects from their longitudinal observational data</u>.
3. We empirically observe that the proposed model improves the SA performance over **the state-of-the-art models**.

## **Related Work**


Survival Analysis 

- Statistical-based models
- Machine-learning-based models
- Deep learning-based models

Statistical-based models

- non-parametric methods
    - Kaplan-Metrier
        - To estimate the overall survival curves for a group of individuals in a great flexible manner

        ⇒ It infeasible to employ non-parametric models from the individual perspective.

- parametric methods
    - Make a strong prior assumption on the distribution of hitting time of event
    - Ex) weibull distribution, exponential distribution

    ⇒ It is incapable of looking insight into the distribution of real-world time-to-event data.

- semi-parametric methods
    - CPH model
        - A globally accepted tool for investigating the relationship between the survival time of subjects and one or more predictor variables

    ⇒ CPH lacks **the ability to handle the competing risks problem**

- Competing risk
    - cs-Cox
        - the cause-specific version of the Cox proportional hazards model
    - Fine-Gray model
        - To model the relative effect of covariates on the sub-distribution **cumulative incidence function**

    ⇒ a strong assumption on the distribution of event time


Machine-learning-based models

- Random Survival Forest (RSF) ： It is a random forests model for the analysis of survival data. RSF produces an ensemble estimate for the cumulative hazard function.
- Support vector machine
- Bayesian methods

⇒ use a pre-defined assumption on the hitting time of event


Deep learning-based models

- Deepsurv

![](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/3.png)

- DRSA

![](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/4.png)

- DeepHit

![](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/5.png)

- Dynamic-DeepHit

![](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/6.png)


## **Method**


### A. Problem Formulation


![](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/7.gif)


$\mathbb{E}\lbrace \phi,1,2,\ldots,E\rbrace$ : a set of competing events of interest


$\mathcal {D}=\lbrace \delta ^{i}\rbrace _{i=1}^{N}$

- $\delta ^{i}=\lbrace (x_{k}^{i}, t_{k}^{i}, y_{k}^{i})\rbrace _{k=1}^{T_{i}}$
    - $x_{k}^{i}$ :  a set of observed covariates to describe the subject’s state $k_{th}$ visit documented at time $t_{k}^{i}$
    - $y_{k}^{i} \in \mathbb{E}$ : occurred competing event or censoring at time

The objective of this study is to issue **the SA problem in the disease progression of a target subject** by utilizing the past observational data $\delta _{i}$ of subjects $i$.

- $[p_{1}^{i}, p_{2}^{i}, \ldots, p_{e}^{i}, \ldots, p_{E}^{i}]$ where $p_{e}^{i}$ denotes the probability that a competing event $e$ occurs within the time window $[t_{\mathrm{T}_{\mathrm{i}}}^{\mathrm{i}}, \quad t_{\mathrm{T}_{\mathrm{i}}}^{\mathrm{i}}+T_{w}]$

### B. Model Overall


![](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/8.png)

- ,Data augmentation : to generate syntactic samples by employing two data augmentation strategies, i.e., random shuffle, and random mask
- The masked sample is then reconstructed by employing a mask reconstruction module
- Shared encoder : to learn the hidden representations of subjects from their longitudinal observational data
- Contrastive learning module : helps to improve the effectiveness of learning the latent representations by using the shared encoder
- K cause-specific subnetworks : to estimate the joint distribution of hitting time and competing events

### C. Data Augmentation


Random shuffle

- Given the treatment trajectory of subject $i$, we randomly shuffle the visit records of $\delta ^{i}$ to generate a shuffled sample, denoted as $\delta _{s}^{i}$.

Random mask

- randomly mask one or several visiting records in $\delta ^{i}$ to generate a masked one, denoted as $\delta _{m}^{i}$

### D. Shared Encoder


The shared encoder composed of **LSTM network** is used **to transform the longitudinal observational data of subjects to latent representations**.



$$
\begin{equation*}
h_{\mathrm{k}}^{\mathrm{i}}=LSTM\left(x_{\mathrm{k}}^{\mathrm{i}}, h_{\mathrm{k}-1}^{\mathrm{i}}\right)\left(1 \leq \mathrm{k} \leq \mathrm{T}_{\mathrm{i}}\right) 
\end{equation*}
$$



we input the **shuffled, masked, and real samples** into the shared-encoder layer, **to optimize the latent representation of a target subject** $i$, which encoded as $h_{s,k}^{i}$, $h_{M,k}^{i}$ and $h_{r,k}^{i}$, respectively.


### E. Mask-Reconstruction


Considering that the time interval between visits contains time information in the longitudinal observational data of a target subject $i$, we utilize a state-of-the-art timed-LSTM model as the decoder <u>to reconstruct the masked visit</u>. Of note, there are three variants of timed-LSTM presented in, and **Time-LSTM 2** achieved the best performance among all three variants in the experiments. 



$$
\begin{align*}
\begin{split} \widehat{x}_{m,\mathrm{k}}^{\mathrm{i}}= \text{Time-LSTM2}\left(H^{i}_{k}\right) \end{split} 
\end{align*}
$$



where $H^{i}_{k}=[(h_{1}^{i}, t_{2}^{i} - t_{1}^{i}), (h_{2}^{i}, t_{3}^{i} - t_{2}^{i}),\ldots, (h_{k}^{i}, t_{k+1}^{i} - t_{k}^{i})]$, $h_k^i$ is the latent state of the masked sample at time $t_{k}^{i}$.



$$
\begin{equation*}
\mathcal {L}_{r e c}=\mathbb{E}\left(|| \widehat{x}_{\mathrm{m}, \mathrm{k}}^{\mathrm{i}}-x_{r, k}^{i}||_{2}^{2}\right)
\end{equation*}
$$



### F. Contrative Learning



$$
\begin{align*} \small
&\mathcal {L}_{\text{cl}-\text{risk}}
&=-\sum _{i=1}^{N} \frac{1}{E} \sum _{j \in \Omega (i)} \log \frac{\exp \left(h_{r, T_{i}}^{i}\left(h_{r, T_{i}}^{j}\right)^{T}\right)}{\sum _{k \in A(i)} \exp \left(h_{r, T_{i}}^{i} \cdot \left(h_{r, T_{i}}^{k}\right)^{T}\right)} 
\end{align*}
$$



$\small \Omega (i)=\lbrace j \mid \delta ^{j} \in \mathcal {D}, e_{i}=e_{j} \wedge e_{i} \ne \emptyset \rbrace$


$\small A(i)=\lbrace j \mid \delta ^{j} \in \mathcal {D}, e_{i} \ne e_{j}\rbrace$


We regard the learned representations of the real subject and the shuffled/masked one corresponding to the real subject as a positive pair, and consider the representations of the real subject and the shuffled/masked one corresponding to another subject as a negative pair.



$$
\begin{align*}\small
\mathcal {L}_{\text{cl}-\text{sh}}=-\sum _{i=1}^{N} \log \frac{\exp \left(h_{r, T_{i}}^{i}\left(\tilde{h}_{s, T_{i}}^{i}\right)^{T}\right)}{\sum _{j=1}^{N} \exp \left(h_{r, T_{i}}^{i} \cdot \left(\tilde{h}_{s, T_{i}}^{j}\right)^{T}\right)} 
\\
\mathcal {L}_{\text{cl}-\text{mask}}=-\sum _{i=1}^{N} \log \frac{\exp \left(h_{r, T_{i}}^{i}\left(\tilde{h}_{m, T_{i}}^{i}\right)^{T}\right)}{\sum _{j=1}^{N} \exp \left(h_{r, T_{i}}^{i} \cdot \left(\tilde{h}_{m, T_{i}}^{j}\right)^{T}\right)} 
\end{align*}
$$



### G. Cause-Specific Subnetworks


We develop cause-specific networks **to capture relations between the cause-specific risk and covariates documented in the longitudinal observational data of subjects**. 


![](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/9.png)


The cumulative incidence function (CIF)

- Probability that a competing event $e^*$ occurs on or before time $t_{T_{i}}^{i}+T_{w}$ conditioned on the latent representation $h_{r,T_{i}}^{i}$ of $\delta _{i}$

    
$$
    \begin{equation*} \small
    \begin{split} F_{e}^{i}(t_{\mathrm{T}_{\mathrm{i}}}^{\mathrm{i}}+T_{w} \mid h_{\mathrm{r}, \mathrm{T}_{\mathrm{i}}}^{\mathrm{i}})=P(t \leq t_{\mathrm{T}_{\mathrm{i}}}^{\mathrm{i}}+T_{w}, e=e^{*} \mid h_{\mathrm{r}, \mathrm{T}_{\mathrm{i}}}^{\mathrm{i}}, \\
     t>T_{i})=\sum _{\tau \leq t_{\mathrm{T}_{\mathrm{i}}}^{\mathrm{i}}+T_{w}} P(t=\tau, e=e^{*} \mid h_{\mathrm{r}, \mathrm{T}_{\mathrm{i}}^{\mathrm{i}}}^{\mathrm{i}}, t>T_{i}) \end{split} 
    \end{equation*}
    $$
    


Estimated CIF



$$
\begin{equation*} \small
\widehat{F}_{e^{*}}^{i}\left(t_{\mathrm{T}_{\mathrm{i}}}^{\mathrm{i}}+T_{w} \mid h_{\mathrm{r}, \mathrm{T}_{\mathrm{i}}}^{\mathrm{i}}\right)=\frac{\sum _{T_{i} \leq \tau \leq t_{\mathrm{T}_{\mathrm{i}}}^{\mathrm{i}}+T_{w}}{o}_{e^{*}, \tau }}{1-\sum _{e \ne \emptyset } \sum _{t \leq T_{i}} \mathrm{o}_{e, t}} 
\end{equation*}
$$



Survival probability of a subject at time $\tau ^*$



$$
\begin{equation*}\small
S\left(t_{\mathrm{T}_{\mathrm{i}}}^{\mathrm{i}}+T_{w} \mid h_{\mathrm{r}, \mathrm{T}_{\mathrm{i}}}^{\mathrm{i}}\right)=1-\sum _{e \in E \wedge e \ne \emptyset } F_{e}^{i}\left(t_{\mathrm{T}_{\mathrm{i}}}^{\mathrm{i}}+T_{w} \mid h_{\mathrm{r} \mathrm{T}_{\mathrm{i}}}^{\mathrm{i}}\right) 
\end{equation*}
$$



Negative log-likelihood loss



$$
\begin{align*} \small
 \mathcal {L}_{\text{sur}}&=-\sum _{i=1}^{N}\bigg[\mathrm{I}(e^{i} \ne \emptyset) \cdot \log \left(\frac{{o^{i}}_{e^{i}, \tau ^{i}}}{1-\sum _{e \ne \emptyset } \sum _{t \leq T_{i}}{o}_{e, t}^{i}}\right) \\
 &\quad+\mathrm{I}(e^{i}=\emptyset) \cdot \log \bigg(1-\sum _{e \ne \emptyset } \hat{F}_{\mathrm{e}}^{i}\left(\tau ^{i} \mid h_{\mathrm{r}, \mathrm{T}_{\mathrm{i}}}^{\mathrm{i}}\right)\bigg]. 
\end{align*}
$$



### H. Loss Function



$$
\begin{align*} \small
 \mathcal {L}_{total}&=\lambda _{cl-risk} \mathcal {L}_{cl-risk}+\lambda _{rec} \mathcal {L}_{rec}+\lambda _{cl-sh} \mathcal {L}_{cl-sh} \\
 &\quad+\lambda _{cl-mask} \mathcal {L}_{cl-mask}+\lambda _{sur} \mathcal {L}_{sur} 
\end{align*}
$$



$\lambda _{\text{cl}-risk},\ \lambda _{\text{rec}},\ \lambda _{\text{cl}-\text{sh}},\ \lambda _{cl-mask},\ \lambda _{\text{sur}}$ : Hyperparameters


## **Experiments**


### A. Datasets


Both databases are widely used public clinical datasets related to patients admitted to the ICU setting.


MIMIC-III database

- 2,279 patients diagnosed with two or more following five diseases: septicemia, cerebral hemorrhage, acute respiratory failure, subendocardial acute myocardial infarction and pneumonia
- 517 patients (22.68%) died of septicemia / 65 patients (2.85%) died of cerebral hemorrhage / 238 patients (10.44%) died of acute respiratory failure / 62 patients (2.72%) died of subendocardial acute myocardial infarction / 44 patients (1.93%) died of pneumonia
- The remaining 1,353 patients (59.37%) were right-censore

eICU Collaborative Research Database

- 5,269 patients diagnosed with two or more following three diseases: acute respiratory failure, acute renal failure and pneumonia
- 961 patients (18.24%) died of acute respiratory failure / 711 patients (13.49%) died of acute renal failure / 604 patients (11.46%) died of pneumonia
- The remaining 2,993 patients (56.80%) were right-censored

### B. Baseline Models

1. _Cox Proportional hazard model (CPH)_
2. _DeepSurv_
3. _Random Survival Forest (RSF)_
4. _DRSA_
5. _DeepHit_
6. _Dynamic DeepHit_
7. _cs-Cox_
8. _Fine-Gray_

### C. **Experimental Configurations**

- Five-fold cross-validation strategy / Ridge regularization / early stop
- 80% : train dataset, 20% : test dataset / Batch size : 64 / RMSProp optimizer
- The hyper-parameters of each module were turned by Bayesian Optimization
- All parameters were randomly initialized, and the initial learning rate α was set to 0.001.

### D. R**esults and Analysis**


Concordance-index

- the most common metric used in survival analysis to evaluate the models’ predictive accuracy on the survival data
- reflects a measure of how well a model predicts the ordering of patients’ death times.

Performance Comparison on the Experimental MIMIC-III Dataset. (Mean ± Std)


![](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/10.png)


Performance Comparison on the Experimental eICU Dataset. (Mean ± Std)


![](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/11.png)


![Comparison of survival curves between the proposed model and benchmark models on MIMIC-III dataset in terms of the disease (a) septicemia, (b) cerebral hemorrhage, (c) acute respiratory failure, (d) subendocardial acute myocardial infarction, (e) pneumonia and on eICU dataset in terms of the disease (f) acute respiratory failure, (g) acute renal failure, (h) pneumonia.](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/12.png)


### E. **Ablation Study**



$$
\begin{align*} \small
 \mathcal {L}_{total}&=\lambda _{cl-risk} \mathcal {L}_{cl-risk}+\lambda _{rec} \mathcal {L}_{rec}+\lambda _{cl-sh} \mathcal {L}_{cl-sh} \\
 &\quad+\lambda _{cl-mask} \mathcal {L}_{cl-mask}+\lambda _{sur} \mathcal {L}_{sur} '
\end{align*}
$$



_Model_v0:_ We remove the **contrastive loss** of competing risks from the model.



$$
\small \lambda _{\text{rec }} \mathcal {L}_{\text{rec }}+\lambda _{\text{cl-sh }} \mathcal {L}_{\text{cl-sh }}+\lambda _{\text{cl-mask }} \mathcal {L}_{\text{cl-mask }}+\lambda _{\text{sur }} \mathcal {L}_{\text{sur }}
$$



_Model_v1:_ We remove the **mask-generation strategy and the corresponding contrastive learning** compound between the generated trajectories and real ones.



$$
\lambda _{\text{cl-risk }} \mathcal {L}_{\text{cl-risk }}+\lambda _{\text{cl-sh }} \mathcal {L}_{\text{cl-sh }}+\lambda _{\text{sur }} \mathcal {L}_{\text{sur }}
$$



_Model_v2:_ We remove the **corresponding contrastive learning loss of between the augmented trajectories** using the mask-generation strategy and real ones.



$$
\lambda _{\text{cl-risk }} \mathcal {L}_{\text{cl-risk }}+\lambda _{\text{rec }} \mathcal {L}_{\text{rec }}+\lambda _{\text{cl-sh }} \mathcal {L}_{\text{cl-sh }}+\lambda _{\text{sur }} \mathcal {L}_{\text{sur }}
$$



_Model_v3:_ We remove the corresponding <u>contrastive learning between shuffle-generation strategies and real ones</u>.



$$
\lambda _{\text{cl-risk }} \mathcal {L}_{\text{cl-risk }}+\lambda _{\text{rec }} \mathcal {L}_{\text{rec }}+\lambda _{\text{cl-mask }} \mathcal {L}_{\text{cl-mask }}+\lambda _{\text{sur }} \mathcal {L}_{\text{sur }}
$$



_Model_v4:_ The model only has **the basic modules** which include the shared encoder, cause-specific subnetworks and the survival prediction layer.



$$
\lambda _{\text{sur }} \mathcal {L}_{\text{sur }}
$$



_Model_v5:_ The model has **the basic modules and the contrastive learning losses of between generated trajectories and real ones**.



$$
\lambda _{\text{cl}-\text{sh}} \mathcal {L}_{\text{cl}-\text{sh}}+\lambda _{\text{cl}-\text{mask}} \mathcal {L}_{\text{cl}-\text{mask}}+\lambda _{\text{sur }} \mathcal {L}_{\text{sur}}
$$



_Model_v6:_ The model has **the basic modules and the corresponding contrastive learning between shuffled trajectories and real ones**.



$$
\lambda _{\text{cl}-\text{sh}} \mathcal {L}_{\text{cl}-\text{sh}}+\lambda _{\text{sur}} \mathcal {L}_{\text{sur}}
$$



Ablation Study on MIMIC-III Dataset. (Mean ± Std)


![](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/13.gif)


Ablation Study on eICU Dataset. (Mean ± Std)


![](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/14.gif)


### **F. Interpreting Prediction**


We utilized a post-processing statistic that can be used by clinicians to interpret predictions issued by the proposed model and to understand the associations of covariates and time to event.



$$
\begin{equation*}
\gamma \mathrm{k}\left(\Delta \mathrm{t}, x_{d}=x_{d, \max }\right)-\gamma \mathrm{k}\left(\Delta \mathrm{t}, x_{d}=x_{d, \min }\right) 
\end{equation*}
$$



where $\gamma \mathrm{k}(\Delta \mathrm{t}, x_{d})$ is the estimated CIF


![The Top 15 Most Influential Covariates on MIMIC-III Dataset. The Values Indicate the Amount of Increase(+)/Decrease(-) in the Predicted Risks on Average and the Covariates are Ranked by the Absolute Values](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/15.gif)


![The Top 15 Most Influential Covariates on eICU Dataset. The Values Indicate the Amount of increase(+)/decrease(-) in the Predicted Risks on Average and the Covariates are Ranked by the Absolute Values](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/16.gif)


### **G. Dynamic Survival Prediction**


Dynamic survival analysis

- To show how our model issues and updates **risk predictions for different causes** (including right-censoring) with new visiting record of patient treatment trajectory being collected
- Trajectories of two highly influential covariates are used to display their associations.

![Illustration of dynamic risk predictions on MIMIC-III dataset and eICU dataset. (a) is a censored patient on MIMIC-III dataset, (b) is a patient died of Septicemia on MIMIC-III dataset, (c) is a censored patient on eICU dataset, (d) is a patient died of Acute Respiratory Failure and Acute Renal Failure on eICU dataset. Gray solid lines, yellow dotted lines, and stars indicate times at which measurement are taken, the time at which a patient is censored, and the time at which an event occurred, respectively.](/assets/seminars/deep-csa-deep-contrastive-learning-for-dynamic-survival-analysis-with-competing-/17.png)


## **Conclusion**


In this paper, we present **a new SA model, named deep contrastive learning model for dynamic survival prediction with competing risks**. The proposed model **utilizes the contrastive learning strategy for extracting event-specific representations of subjects from their longitudinal observational data**, which benefits estimating the joint distributions of survival time and competing risks **without prior assumption** on the underlying stochastic process of survival time. We demonstrate the effectiveness of our proposed model on two widely used <u>real-world clinical datasets</u>, i.e., MIMIC-III and EICU by modeling the in-hospital survival statuses for subjects suffering from at least two competing risks. **The achieved experimental results show that our model outperforms the state-of-the-art methods**.


Limitations

- Model was trained using data collected from the ICU settings, and further refinement of the model is needed by including more diverse training datasets **to further improve the generalisability of the model**.
- Model was developed and validated using retrospective data for prognosticating disease-caused mortality, but was not validated for predicting the other types of endpoints, e.g., emergent readmission in one month after discharge, etc.
- The competing risks are confounders that may mislead survival prediction models to learn spurious correlations between covariates and the target event of interest.
    - This issue may reduce the ability of existing models to identify covariates with causal effects to the target event.

For future work, we plan to investigate how to interpret the SA results from the causal-effect perspective.


# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
