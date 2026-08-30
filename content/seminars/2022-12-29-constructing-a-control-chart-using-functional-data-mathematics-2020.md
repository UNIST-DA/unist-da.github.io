---
date: 2022-12-29
title: Constructing a Control Chart Using Functional Data (Mathematics 2020)
category: Paper Review
presenter: SeungSu Kam
url: https://www.notion.so/f6d644e023124cc59c0c186b86c5ac2b
keywords: Functional Data, Functional depth, ControlChart
---

# Selected Paper


## Title: Constructing a Control Chart Using Functional Data


Flores, Miguel, et al, MDPI (2020)


## **Abstract**


This study proposes a control chart based on functional data to detect anomalies and estimate the normal output of industrial processes and services such as those related to the energy efficiency domain. Companies providing statistical consultancy services in the fields of energy efficiency; heating, ventilation and air conditioning (HVAC); installation and control; and big data for buildings, have been striving to solve the problem of automatic anomaly detection in buildings controlled by sensors. Given the functional nature of the critical to quality (CTQ) variables, this study proposed a new functional data analysis (FDA) control chart method based on the concept of data depth. Specifically, it developed a control methodology, including the Phase I and II control charts. It is based on the calculation of the depth of functional data, the identification of outliers by smooth bootstrap resampling and the customization of nonparametric rank control charts. A comprehensive simulation study, comprising scenarios defined with different degrees of dependence between curves, was conducted to evaluate the control procedure. The proposed statistical process control procedure was also applied to detect energy efficiency anomalies in the stores of a textile company in the Panama City. In this case, energy consumption has been defined as the CTQ variable of the HVAC system. Briefly, the proposed methodology, which combines FDA and multivariate techniques, adapts the concept of the control chart based on a specific case of functional data and thereby presents a novel alternative for controlling facilities in which the data are obtained by continuous monitoring, as is the case with a great deal of process in the framework of Industry 4.0.


## Link



[📄 자료 링크 ↗](https://www.mdpi.com/2227-7390/8/1/58)



# Review


## Preliminary


### Data Depth


In multivariate analysis, the term depth refers to the degree of centrality of a point regarding a data cloud or a probability distribution. Therefore, it is possible to define a rank in the multidimensional Euclidean space through the calculation of observation depth. 
The depth defines a center of the cloud, that is the set of deepest points, and measures how far away a point is located from the center


### Bootstrap


Bootstrapping statistics is a form of hypothesis testing that involves resampling a single data set to create a multitude of simulated samples. Those samples are used to calculate standard errors, confidence intervals and for hypothesis testing. This approach allows you to generate a more accurate sample from a smaller data set than the traditional method.


### Rank Statistics


In statistics, ranking is the data transformation in which numerical or ordinal values are replaced by their rank when the data are sorted. For example, the numerical data 3.4, 5.1, 2.6, 7.3 are observed, the ranks of these data items would be 2, 3, 1 and 4 respectively


### Rank Statistics derived from data depth


Let $G$ a $k$-dimensional distribution, and let $Y_1, \ldots, Y_m$ be $m$ random observations from $G$. The sample $Y_1, \ldots, Y_m$ is generally the reference sample of a CTQ variable in the context of quality control, composed of measurements from products obtained by an under control process. 


If $X_1, X_2, \ldots$ are the new observations from the manufacturing process, assuming that the different $X_i$ values follow an $F $ distribution if the quality of the studied product has been deteriorated or, in other words, if the process is out of control. Otherwise, they follow a $G$ distribution. 


Let $D_G(\cdot)$ denote a notion of depth, and assume that $G$ and $F$ are two continuous distributions. Thus, if all the $D_G\left(Y_i\right)$ values are sorted in increasing order, and $Y_{[j]}$ denotes the sample value associated with the $j$ th smallest depth value, then $Y_{[1]}, \ldots, Y_{[m]}$ are the order statistics of $Y_i$ 's, with $Y_{[m]}$ being the most central point. Therefore, the smaller the order (or the rank) of a point, the farther that point will be from the underlying distribution $G(\cdot)$.
Liu (1995) defines the rank statistic as



$r_G(y)=P\left\{D_G(Y) \leq D_G(y) \mid Y \sim G\right\}$



whereby $Y \sim G$ indicates that the random variable $Y$ follows the distribution $G$


When $G$ is unknown, the empirical distribution $G_m$ of the sample $\left\{Y_1, \ldots, Y_m\right\}$ can be used instead, and the statistic is defined by


$
r_{G_m}(y)=\frac{\#\left\{D_{G_m}\left(Y_j\right) \leq D_{G_m}(y), j=1, \ldots, m\right\}}{m}
$


# Introduction

- Univariate and multivariate control charts are applied to identify anomalies in the industry and control the quality of products and services
- The specific characteristics of data obtained by continuous monitoring require the use of increasingly sophisticated tools that take into account the presence of autocorrelation in critical to quality (CTQ) variables

→ EWMA control charts, ARIMA models, Neural networks Support vector machines


→ Many of these new data, usually **curves**, can be studied as **functional data.**


ex) The case of data in the fields of energy consumption, indoor and machine temperatures, relative humidity, amount of CO2, among other variables, measured in all types of buildings


This study intends to provide an alternative solution to the detection of out-of-control anomalies or states in the area of energy efficiency in buildings, specifically in commercial areas such as different stores of textile companies.


Energy efficiency data:

- Non-Gaussian
- Autocorrelated

→ provides alternative control charts for Phases I and II of the statistical process control that can deal with non-Gaussian and autocorrelated data.


**Proposed Control Chart:**


**Phase I:**


a control chart is proposed based on the depth measurement of a functional datum and the idea of atypical detection


**Phase II:**


a nonparametric range control chart is proposed, based on the calculation of the functional data depth,


### _Alternatives of the Statistical Quality Control When the Basic Assumptions of the Control Charts Are Not Met_

- Control chart approximation for functional data is based on nonparametric multivariate control charts, which are useful when the assumptions of Gaussianity are not met.

⇒ r, Q and S control charts based on the data depth and rank concepts and the rank or ranges which is nonparametric control charts have been proposed

- Another starting hypothesis of control charts is the independence of the observations
- The data continuously monitored over time by different sensors usually show a variable level of autocorrelation
- The application of standard techniques in the case of the violation of the independence hypothesis often results in the detection of an unacceptable number of false alarms
- It is necessary to remove the sample autocorrelation

⇒ FDA techniques allows us to consider the autocorrelation of the data as well as, by means of resampling techniques, to circumvent parametric assumptions about the trend and dependence.


# Methodology


## _Procedure for Building a Control Chart for Phase I (Stabilization)_


In Phase I, a control chart is used to test the hypothesis that there is no change in the distribution of observations of the variable ordered with respect to time ${X_1(t), X_2(t), . . . , X_n(t)}.$


The hypothesis tested in Phase I is:


![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/0.png)


The proposed control charts for **Phase I** are based on the adaptation of outlier detection methodologies from functional data, based on the data depth calculations.


⇒ The method of the detection of outliers for functional data considers an atypical curve if its depth is less than a specific quantile of the distribution of depths estimated by **bootstrap**. In other words, an atypical curve will have a significantly low depth.


Different types of functional depths

- Fraiman and Muniz (FM)
- Mode depth
- Random projections depth (RP)

Estimate a specific quantile of the depth distribution that plays the role of the lower control limit (LCL) for a Phase I control chart.

1. Calculate the depth corresponding to each observation of the dataset, $D\left(\mathcal{X}_i\right){i=1}^n$ and make a control chart based on the depth of each datum with respect to time.
2. Choose the parameter LCL according to the significance level of the control chart, that is, the percentage of false alarms (observations under control but erroneously detected as out-of-control) is small (for example, α = 1%). The following procedures are used to estimate the LCL

    ![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/1.png)


    ![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/2.png)

3. If there is any curve such that $D(X_i) ≤ LCL$ for a given LCL, then it would be considered atypical and the process would be out-of-control.
4. Additionally, a control chart including the original curves and the functional envelope obtained from 99% of the deeper bootstrap replicas is also developed.

Once the atypical curves are detected, they are removed and the procedure is repeated until the process becomes stable (under control), namely, defined by a total absence of atypical data.


## _Procedure for Building a Control Chart for Process Monitoring (Phase II)_

- Phase II deals with process monitoring; it involves quick detection of changes from the calibrated sample stabilized in Phase I
- Test if there are deviations between the data obtained in Phase II, also called monitoring sample, ${X_{(n+1)}(t), X_{(n+2)}(t), . . . , X_m(t)}$ and the reference data ${X_1(t), X_2(t), . . . , X_n(t)}$ or calibration sample, taking into account its distribution.
- In Phase II, in the univariate case, an F distribution for the under-control process is estimated from a calibration sample or reference data.
- F is the distribution of the CTQ variable of an under-control process (Phase I). This distribution is used to establish control limits that will be used to monitor the process in Phase II.
- In Phase II, a sample of the G distribution is monitored

![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/3.png)


⇒ In the FDA context, we do not have a density function for a functional random variable X that allows us to perform different tests corresponding to Phases I and II.


⇒ we can estimate the distribution of the depth corresponding to the curves that belong to a sample of functional data.


**For Phase II, the use of the rank control charts is proposed in an FDA context. 
The calculation of depths for functional data is proposed, which facilitate the calculation of ranks.**


(Assume that the rank statistic follows a uniform asymptotic distribution.)

1. From the reference sample $\left\{\mathcal{X}_1(t), \mathcal{X}2(t), \ldots, \mathcal{X}n(t)\right\}$_, get the depths of the dataset,_ $D\left(\mathcal{X}_i\right)_{i=1}^n$ _and the depths of the curves that make up the monitoring sample,_ $D\left(\mathcal{X}_j\right)_{j=n+1}^{n+m}$_. The depth of each curve corresponding to the monitoring sample is calculated from the_ $n$ _curves of the calibration sample, that is, with respect to_ $n+1$ _cases._
2. _The rank statistic is calculated for each curve of the monitoring sample,_ $r_G\left(\mathcal{X}_{n+1}\right), \ldots, r_G\left(\mathcal{X}_{m+n}\right)$, considering the calibration sample $\left\{\mathcal{X}_1(t), \mathcal{X}_2(t), \ldots, \mathcal{X}_n(t)\right\}$ as sample of reference.

$r_G(\mathcal{X})=\frac{\#\left\{\mathcal{X}_i \mid D\left(\mathcal{X}_i\right) \leq D(\mathcal{X}), i=1, \ldots, n\right\}}{n}$
3. The values of the rank statistic, the lower control limit $\mathrm{LCL}=\alpha$ and central line $\mathrm{CL}=0.5$(the expected value of the rank statistic) are plotted, thereby generating the control chart.
4. Proceed to monitor the process. If at least the rank of a curve, $\mathcal{X}$, is such that $r_G(\mathcal{X}) \leq$ LCL, then the process is considered out-of-control.
5. A functional control chart is developed. This is a graphical tool that allows us to identify the possible assignable causes of the out-of-control states. The original curves are included, those correspond to the reference and monitoring samples, in addition to the functional envelope obtained from $(1-\alpha) \%$ of the deepest curves of the calibration sample.

# Experiments


## **Data Collection: Case Study of HVAC Installations in Commercial Areas**


Sixteen CTQ variables are measured taking into account their ability to provide information about the energy efficiency,  air quality and the thermal comfort of the store environment—indoor temperatures, overall energy consumption, HVAC energy consumption, CO2 content in the air (ppm), relative humidity (%), temperatures of impulsion and return temperatures of the chillers in different areas of the store.


![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/4.png)


Anomalies were identified by the maintenance staff.

- On 11 September, there was a decline in the air conditioning consumption at about midday.
- On 21, 22 and 30 September, the shopping center was closed and thus there was no energy
consumption and the temperatures remained high.
- On 27 September, several maintenance tests were applied to the store’s HVAC installations.
- On 29 September, the store’s HVAC installations were stopped one hour earlier.
- Additionally, on 19 September, the air conditioning was stopped half an hour before the usual
time. Particularly, there was a regulation change in the HVAC system.
- In mid-October, there was a leak in the air conditioning circuit. From that moment,
energy consumption began to rise.
- On 1 November, repairing activities were performed. Consequently, the consumption decreased
and the start-up consumption peak was removed.
- Between 17 and 20 November, the energy consumption in HVAC was again increased.

## **Application to Real Data**

- In the scalar case, boxplot is commonly used to detect anomalous or atypical data.
- By using a methodology for scalar data (ignoring the autocorrelation between the variables), an unacceptable number of false alarms could be detected.

![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/5.png)


(Left) the boxplot for each variable of energy consumption in HVAC systems per hour


(Right) the curves of daily energy consumption in HVAC systems


⇒ the drawback of this approach is that it increases the probability of type I error. It detects 12 daily energy consumption curves as outliers.


### **Phase 1:**


![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/6.png)


![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/7.png)

- A significance level of α = 0.025 is used for the estimation of the LCL from B = 500 bootstrap resamples, a smoothing coefficient γ = 0.8, and a percentage of Trimming trim = 0.05, which allows obtaining an envelope of 95% of the deepest curves.
- The process began with 44 curves, of which 9 (in the first iteration) and 5 (in the second iteration) curves were identified as anomalous.

### **Phase 2:**


![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/8.png)

- The results of the application of the rank control chart show that the process is out-of-control both for the monitoring samples of October and November.
- In October, the assignable cause is the fault in HVAC facilities, whereas the assignable cause in November is the change in the process due to repair activities that deals on a decreasing in HVAC energy consumption.
- Given that the process has changed, a new reference sample should be obtained and studied.

## **Simulation Study**


The control chart performance 

- Measured by observing its power (1 − β)
- Average Run Length (ARL), which is defined as the average number of observations plotted before a signal is out-of-control.

First, the simulation scheme designed in Febrero et al. [44] will be used to evaluate the performance of the control chart proposal for Phase I. Realizations of a Gaussian stochastic process have been proposed following the expression below:


$\mathcal{X}(t)=\mu(t)+\sigma(t) \cdot \epsilon(t)$


whereby $\sigma^2(t)=0.5$ and

$\mu(t)=\mathbf{E}(\mathcal{X}(t))=30 t(1-t)^{3 / 2}$



whereas $\epsilon(t)$ is a Gaussian process $\epsilon(t) \sim G P(0, \Sigma)$ with 0 mean and variance-covariance matrix equal to
$\mathbf{E}\left[\epsilon\left(t_i\right) \times \epsilon\left(t_j\right)\right]=e^{-\frac{\left|t_i-t_j\right|}{0.3}} .$



The control charts proposed in this work have been designed to monitor the functional mean to detect two events


—**change in the mean of the process in terms of the magnitude and shape**—


which reveal that the process is not under control. For designing control charts for Phase II, it is assumed that the process is under control, that is, outliers are not detected. To generate simulation scenarios for each of these events, the following functional means have been considered:


**Mean of the model with a change in the magnitude:**


$M_1 : \mu(t)=30 t(1-t)^{3 / 2}+\delta,$
by which $\delta$ denotes the change that goes from $0.4$ to $2$ in steps of $0.4$.


**Mean of the model with a change in form:**


$M_2 : \mu(t)=(1-\eta) \cdot 30 t(1-t)^{3 / 2}+\eta \cdot 30 t^{3 / 2}(1-t),
$
where $\eta$ is the change change from $0.2$ to $1$ in steps of $0.2$


**Dependence Case:**


 $\tilde{Y}i(t)=\mu(t)+\sigma(t) \cdot \tilde{\epsilon}(t)$_,  with_ $\tilde{\epsilon}(t)=\rho \cdot \tilde{\epsilon}_{i-1}(t)+(1-\rho) \cdot \epsilon_i(t)$, 
where $\rho$ is the correlation measure between curves and $\sigma(t)=0.5$ and both $\epsilon(t)$ and $\tilde{\epsilon}(t)$ are Gaussian processes.


![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/9.png)


### _Measurement and Comparison of the Performance of the Control Chart Proposed for Phase I_

- Estimate and compare the type I error (α = 0.01 is fixed) of the proposed control chart
- Estimate and evaluate the power of the control chart to detect out-of-control signals in different situations
- $\hat{p}_c $: The percentage of out-of-control signals
- $\hat{p}_f$: The percentage of false alarms

![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/10.png)


![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/11.png)


![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/12.png)


![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/13.png)


![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/14.png)


![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/15.png)


### _Measurement and Comparison of the Performance of the Control Chart Proposed for Phase II_

- For Phase II, the monitoring stage, the use of the rank control chart has been proposed.
- Rank control chart allows simultaneous monitoring of changes in the mean and variability of a process
- $\mathrm{ARL}_0=\frac{1}{\alpha=0.025}$ is assumed to evaluate the performance of the control chart.

![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/16.png)


![](/assets/seminars/constructing-a-control-chart-using-functional-data-mathematics-2020/17.png)


# Conclusion

- A new alternative of control charts has been proposed when CTQ variables of the process are functional
- Phase I control charts based on functional data, outlier detection methods are used based on a method of smooth bootstrap resampling and the depth calculation of functional data
- Phase II, the use of rank-type nonparametric control charts based on the concept of functional data depth
- Simulation study is conducted to measure the performance of the control charts, depending on the functional data depth used, the sample size, the presence of dependence between curves and the use of different FDA procedures for outlier detection.
