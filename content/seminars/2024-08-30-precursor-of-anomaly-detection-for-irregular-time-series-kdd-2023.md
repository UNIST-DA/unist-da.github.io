---
date: 2024-08-30
title: Precursor-of-anomaly detection for irregular time series (KDD, 2023)
category: Paper Review
presenter: SeungSu Kam
url: https://www.notion.so/4487c7a8eef145b2bee224364228e398
keywords: Neural Differential Equation, Time-series anomaly detection
---

# Selected Paper


## Title: 


**Precursor-of-anomaly detection for irregular time series**


## Abstract: 


Anomaly detection is an important field that aims to identify unexpected patterns or data points, and it is closely related to many real-world problems, particularly to applications in finance, manufacturing, cyber security, and so on. While anomaly detection has been studied extensively in various fields, detecting future anomalies before they occur remains an unexplored territory. In this paper, we present a novel type of anomaly detection, called Precursor-of-Anomaly (PoA) detection. Unlike conventional anomaly detection, which focuses on determining whether a given time series observation is an anomaly or not, PoA detection aims to detect future anomalies before they happen. To solve both problems at the same time, we present a neural controlled differential equation-based neural network and its multi-task learning algorithm. We conduct experiments using 17 baselines and 3 datasets, including regular and irregular time series, and demonstrate that our presented method outperforms the baselines in almost all cases. Our ablation studies also indicate that the multitasking training method significantly enhances the overall performance for both anomaly and PoA detection.

- This paper aims to predict future anomalies before they occur, unlike traditional anomaly detection that identifies existing anomalies
- The proposed method uses a neural controlled differential equation-based neural network with a multi-task learning algorithm to address both conventional anomaly detection and PoA detection simultaneously.
- Experiments with 17 baselines and 3 datasets show that the proposed method outperforms others in most cases

## Link



[📄 자료 링크 ↗](https://arxiv.org/abs/2306.15489)



# Paper Review


# **Preliminary**


## **Controlled Differential Neural Differential Equation**

- **CDE (Neural Controlled Differential Equations for Irregular Time Series)**
- Neural CDE 모델은 시계열 데이터를 연속적인 형태(path X = $X_\bold{x}$)로 변환한 후 이를 기반으로 데이터에 내재된 정보의 변화를 연속적으로 모델링
- 여기서 시계열 데이터를 연속적인 형태로 변환하는 과정은 불연속적인(irregular or partially observed) 시계열 데이터를 처리하는데 매우 효과적

![](/assets/seminars/precursor-of-anomaly-detection-for-irregular-time-series-kdd-2023/0.png)


## Knowledge Distillation


![](/assets/seminars/precursor-of-anomaly-detection-for-irregular-time-series-kdd-2023/1.png)

- 대규모 복잡한 모델에서 작은 단순한 모델로 지식을 전이하는 기술
- 대규모 시계열 데이터 세트에 대해 복잡한 모델(예: 딥 뉴럴 네트워크)을 학습시키는 것으로 시작
- 복잡한 모델을 사용해 동일한 데이터 세트에 대한 예측을 생성
- 예측값을 사용하여 더 간단한 모델(예: 선형 회귀 모델이나 의사결정 트리)을 학습진행

## Multi-task Learning


![](/assets/seminars/precursor-of-anomaly-detection-for-irregular-time-series-kdd-2023/2.png)

- 여러 task를 독립적으로 학습하는 대신, 공유된 파라미터로 여러 task를 함께 학습하는 프레임워크
- 여러 task를 동시에 학습함으로써, task 간의 공유된 구조를 활용하여 각 개별 task의 일반화 성능을 향상

##  Anomaly Detection in Time-series

- Classical methods
    - OCSVM, Isolation Forest
- Clustering-based methods
    - Deep SVDD, ITAD, and THOC 
    ⇒ clustering-based methods are not suitable for complex data to train
- Density-estimation methods
    - LOF, kernel density estimation or gaussian mixture models 
    ⇒ may not perform well in cases where the data contains significant non-stationary patterns or where the anomalies are not well represented by the estimated density function
- Reconstruction-based methods.
    - USAD
    ⇒ can be sensitive to the choice of reconstruction model, and may not perform well in cases where the anomalies are not well represented
    by the reconstruction model

# **Definition: Precursor-of-Anomaly Detection**


![](/assets/seminars/precursor-of-anomaly-detection-for-irregular-time-series-kdd-2023/3.png)

- **The precursor-of-anomaly detection refers to the process of identifying current patterns/signs that may indicate upcoming abnormal events**

# **PROPOSED METHOD: Precursor-of-Anomaly Detection (PAD)**


 **Precursor-of-Anomaly Detection = CDE +** multi-task learning + knowledge distillation-based training algorithm with self-supervision


###  Problem Statement

- multivariate time series: $x_{0:T} = \{x_0, x_1, \dots, x_T\} $
    - $T$ is the time-length
    - An observation at time $t$, denoted $x_t$, is an $N$-dimensional vector, 
    i.e., $x_t \in \mathbb{R}^N$
- A window $w_i$ is defined as: $
w_i = [x_{t^i_0}, x_{t^i_1}, \dots, x_{t^i_b}]
$
where $t^i_j = i \times b + j - 1$ with a window size of $b$.
- There are a total of$ \left\lceil \frac{T}{b} \right\rceil$ windows in $x_{0:T}$. ⇒ Non-overlapping

### Overall Workflow

1. Data Augmentation Methods for Self-supervised Learning
2. two co-evolving NCDE layers which produce the last hidden representations $h(𝑇 )$and $z(𝑇 )$
3. In the training progress, **the anomaly NCDE gets two inputs**, $𝑤_𝑖 $ for the **anomaly detection** and $𝑤_{𝑖+1}$ for the **PoA detection**
4. **2 output layers** for the anomaly detection and the PoA detection, respectively. 
These two different tasks are integrated into a **single training method via our shared
parameter 𝜃𝑐 for multi-task learning**
5. In the training progress, the anomaly NCDE creates the two outputs $\hat{y}^{a}_{i}$ _and_ $\hat{y}^{a}_{{i+1}}$ for the knowledge distillation.

    ![Overall Architecture: PAD](/assets/seminars/precursor-of-anomaly-detection-for-irregular-time-series-kdd-2023/4.png)

- co-evolving NCDEs are used to derive the two hidden vectors


$$
\begin{aligned}& \mathbf{h}(T)=\mathbf{h}(0)+\int_0^T f\left(\mathbf{h}(t) ; \theta_f, \theta_c\right) \frac{d X(t)}{d t} d t \\& \mathbf{z}(T)=\mathbf{z}(0)+\int_0^T g\left(\mathbf{z}(t) ; \theta_g, \theta_c\right) \frac{d X(t)}{d t} d t\end{aligned}
$$




$$
\begin{aligned}&\begin{aligned}& f\left(\mathbf{h}(t) ; \theta_f, \theta_c\right)=\underbrace{\rho(\mathrm{FC}(\phi(\mathrm{FC}(\mathbf{h}(t)))))}_{\theta_f}+\underbrace{\rho(\mathrm{FC}(\phi(\mathrm{FC}(\mathbf{h}(t)))))}_{\theta_c} \\& g\left(\mathbf{z}(t) ; \theta_g, \theta_c\right)=\underbrace{\rho(\mathrm{FC}(\phi(\mathrm{FC}(\mathbf{z}(t)))))}_{\theta_c}+\underbrace{\rho(\mathrm{FC}(\phi(\mathrm{FC}(\mathbf{z}(t)))))}_{\theta_c}\end{aligned}\\\end{aligned}
$$


- 𝑓 and 𝑔 have their own parameter and shared parameter $c$

$\hat{y}_i^a=\sigma\left(\mathrm{FC}_{\theta_a}(\mathbf{h}(T))\right)$, for the anomaly detection,
$\hat{y}_i^p=\sigma\left(\mathrm{FC}{\theta_p}(\mathbf{z}(T))\right)$, for the precursor-of-anomaly detection,


![](/assets/seminars/precursor-of-anomaly-detection-for-irregular-time-series-kdd-2023/5.png)



$$
L_{KD} = CE(\hat{y}_{i+1}^a,\hat{y}_{i+1}^p) \\
L_{a} = CE(\hat{y}_{i+1}^a,y_{i})
$$



$L_{KD}$: CE loss for the knowledge distillation


$L_a$: CE loss for anomaly detection

- Back propagation
    - compute gradient for  $\theta_f $, using $L_a, L_{KD} $
    - compute gradient for  $\theta_g $, using $L_{KD} $
    - compute gradient for the shared parameter $\theta_c $ , using  sum of $L_a, L_{KD} $

# Performance


![](/assets/seminars/precursor-of-anomaly-detection-for-irregular-time-series-kdd-2023/6.png)


![](/assets/seminars/precursor-of-anomaly-detection-for-irregular-time-series-kdd-2023/7.png)


![](/assets/seminars/precursor-of-anomaly-detection-for-irregular-time-series-kdd-2023/8.png)


![](/assets/seminars/precursor-of-anomaly-detection-for-irregular-time-series-kdd-2023/9.png)


# Conclusion

- This paper introduces Precursor-of-Anomaly (PoA) detection, a task that predicts future anomalies in time series data
- The proposed method uses a neural controlled differential equation-based neural network with a multi-task learning algorithm to address both conventional anomaly detection and PoA detection simultaneously.
- Experiments on real-world datasets validate the method's effectiveness

# Code


### PAD (Swat) reproduce results


CUDA_VISIBLE_DEVICES=0 python3 -u ./pad.py --seed 112 --missing_rate 0 --data_path dataset/SWAT --dataset SWAT --win_size 30 --forecast_window 10 --step_size 30 --h_channels 60 --lr 1e-2 --hh_channels_f 90 --hh_channels_g 60 --hh_channels_c 20 --epoch 350


Epoch: 349   


Test loss:       1.6144 , Test Pr :      0.9448       Test Re :      0.9407    Test F1:       0.9366  Test AUROC :        0.8812      Time :0.3271
[Precursor]                           Test Next Pr : 0.5708       Test Next Re : 0.3700    Test Next F1:  0.4333  Test Next AUROC :   0.3649
[Forecasting]                         Test MSE :     652.1597


```python
class CDEFunc_f(torch.nn.Module):
    def __init__(self, input_channels, hidden_channels,hidden_hidden_channels):
        super(CDEFunc_f, self).__init__()
        self.input_channels = input_channels
        self.hidden_channels = hidden_channels

        # f / g 
        self.linear0 = torch.nn.Linear(hidden_channels, hidden_hidden_channels)
        self.linear1 = torch.nn.Linear(hidden_hidden_channels, hidden_hidden_channels)
        self.linear2 = torch.nn.Linear(hidden_hidden_channels, hidden_hidden_channels)
        self.linear3 = torch.nn.Linear(hidden_hidden_channels, hidden_hidden_channels)
        self.linear4 = torch.nn.Linear(hidden_hidden_channels, input_channels * hidden_channels)
        
        
        # FOR MSL, SMD 
        # self.linear1 = torch.nn.Linear(hidden_channels, 128)
        # self.linear2 = torch.nn.Linear(128, input_channels * hidden_channels)


    def forward(self, t, z):
        
        z = self.linear0(z)
        z = z.relu()
        z = self.linear1(z)
        z = z.relu()
        z = self.linear2(z)
        z = z.relu()
        z = self.linear3(z)
        z = z.relu()
        z = self.linear4(z)
        # z = z.tanh()
        z = z.view(z.size(0), self.hidden_channels, self.input_channels)

        return z 
class CDEFunc_g(torch.nn.Module):
    def __init__(self, input_channels, hidden_channels,hidden_hidden_channels):
        super(CDEFunc_g, self).__init__()
        self.input_channels = input_channels
        self.hidden_channels = hidden_channels

        # f / g 
        self.linear0 = torch.nn.Linear(hidden_channels, hidden_hidden_channels)
        self.linear1 = torch.nn.Linear(hidden_hidden_channels, hidden_hidden_channels)
        self.linear2 = torch.nn.Linear(hidden_hidden_channels, hidden_hidden_channels)
        self.linear3 = torch.nn.Linear(hidden_hidden_channels, hidden_hidden_channels)
        self.linear4 = torch.nn.Linear(hidden_hidden_channels, input_channels * hidden_channels)
        
        
        # FOR MSL, SMD 
        # self.linear1 = torch.nn.Linear(hidden_channels, 128)
        # self.linear2 = torch.nn.Linear(128, input_channels * hidden_channels)


    def forward(self, t, z):
        
        z = self.linear0(z)
        z = z.relu()
        z = self.linear1(z)
        z = z.relu()
        z = self.linear2(z)
        z = z.relu()
        z = self.linear3(z)
        z = z.relu()
        z = self.linear4(z)
        # z = z.tanh()
        z = z.view(z.size(0), self.hidden_channels, self.input_channels)

        return z 
    
class CDEFunc_c(torch.nn.Module):
    def __init__(self, input_channels, hidden_channels,hidden_hidden_channels):
        super(CDEFunc_c, self).__init__()
        self.input_channels = input_channels
        self.hidden_channels = hidden_channels

        # f / g 
        self.linear1 = torch.nn.Linear(hidden_channels, hidden_hidden_channels)
        self.linear2 = torch.nn.Linear(hidden_hidden_channels, input_channels * hidden_channels)
        
        
        # FOR MSL, SMD 
        # self.linear1 = torch.nn.Linear(hidden_channels, 128)
        # self.linear2 = torch.nn.Linear(128, input_channels * hidden_channels)


    def forward(self, t, z):
        
        z = self.linear1(z)
        z = z.relu()
        z = self.linear2(z)
        z = z.tanh()
        z = z.view(z.size(0), self.hidden_channels, self.input_channels)

        return z 
    
class NeuralDE(torch.nn.Module):
    def __init__(self, input_channels, hidden_channels,hidden_hiddens, output_channels,forecast_window,device, interpolation="cubic"):
        super(NeuralDE, self).__init__()
        if args.model=='ncde':
            
            hidden_hidden_f,hidden_hidden_g,hidden_hidden_c = hidden_hiddens 
            
            self.func_f = CDEFunc_f(input_channels, hidden_channels,hidden_hidden_f)
            self.func_g = CDEFunc_g(input_channels, hidden_channels,hidden_hidden_g)
            self.func_c = CDEFunc_c(input_channels, hidden_channels,hidden_hidden_c)
            self.readout = torch.nn.Linear(hidden_channels, output_channels)
            self.readout2 = torch.nn.Linear(hidden_channels, output_channels)
            self.forecast = torch.nn.Linear(hidden_channels,input_channels)
            self.reconstruct = torch.nn.Linear(hidden_channels,input_channels)
            self.interpolation = interpolation
            # self.readout2= torch.nn.Linear(hidden_channels,)
            
        self.initial = torch.nn.Linear(input_channels, hidden_channels)
        self.interpolation = interpolation
        self.input_channels = input_channels
        self.forecast_window = forecast_window
        # self.win_size = 
        self.device=device
        
    def forward(self, _coeffs,mode,adjoint=True,**kwargs):
        # import pdb ; pdb.set_trace()
        if mode =='train':
            coeffs,next_coeffs = _coeffs
        else:
            coeffs = _coeffs
        if self.interpolation in CUBICS:
            if mode =='train':
                X = torchcde.CubicSpline(coeffs)
                next_X = torchcde.CubicSpline(next_coeffs)
            else:
                X = torchcde.CubicSpline(coeffs)
        elif self.interpolation == 'linear':
            if mode =='train':
                X = torchcde.LinearInterpolation(coeffs)
                next_X = torchcde.LinearInterpolation(next_coeffs)
            else:
                X = torchcde.LinearInterpolation(coeffs)
                   
        else:
            raise ValueError("Only 'linear' and 'cubic' interpolation methods are implemented.")
    
        batch_dims = coeffs.shape[:-2]
        ######################
        # Easy to forget gotcha: Initial hidden state should be a function of the first observation.
        ######################
        
        # X0 = X.evaluate(X.interval[0])
        # z0 = self.initial(X0)
        times = torch.arange(X.interval[-1].item()+1).to(coeffs.device)
        X0 = X.evaluate(times)
        # X0 = X.evaluate(X.interval[0])
        z0 = self.initial(X0)
        z0 = z0.sum(dim=1)
        if mode =='train':
            # next_X0 = next_X.evaluate(next_X.interval[0])
            # next_z0 = self.initial(next_X0)
            next_times = torch.arange(next_X.interval[-1].item()+1).to(coeffs.device)
            next_X0 = next_X.evaluate(next_times)
            next_z0 = self.initial(next_X0)
            next_z0 = next_z0.sum(dim=1)
        
        if args.model =='ncde':
            
            times = torch.arange(X.interval[-1].item()+1).to(z0.device)
            # z_T = torchcde.cdeint(X=X,z0=z0,func=(self.func_f,self.func_c),t=X.interval)
            z_T = torchcde.cdeint(X=X,z0=z0,func=(self.func_f,self.func_c),t=times)
            if mode =='train':
                next_z_T = torchcde.cdeint(X=next_X,z0=next_z0,func=(self.func_f,self.func_c),t=times)
            h_T= torchcde.cdeint(X=X, z0=z0,func=(self.func_g,self.func_c),t= times)
            
            
            pred_y = z_T[:,-1,:]
            pred_reconstruct = self.reconstruct(z_T)
            # sigmoid = torch.nn.Sigmoid()
            # pred_reconstruct = sigmoid(pred_reconstruct)
            pred_y = self.readout(pred_y)
            pred_y = pred_y.squeeze(-1)
            look_window = times.shape[0]
            if mode =='train':
                next_pred_y = next_z_T[:,look_window-self.forecast_window:,:]
                next_pred_reconstruct = self.forecast(next_pred_y)
                # import pdb ; pdb.set_trace()
                next_pred_y = self.readout2(next_pred_y)
                # import pdb ;pdb.set_trace()
                next_pred_y_gt = next_pred_y.squeeze(-1)
                next_pred_y_gt = next_pred_y_gt[:,-1]
            
            ## Forecasting part  
            
            
            forecast_hidden =  h_T[:,look_window-self.forecast_window:,:]
            pred_next_forecast = self.forecast(forecast_hidden)
            pred_next_y = self.readout2(forecast_hidden)
            pred_next_y = pred_next_y.squeeze(-1)
            
            
            pred_next_y = pred_next_y[:,-1]
            # import pdb ; pdb.set_trace()
            
        if mode =='train':
            return pred_y,pred_reconstruct,pred_next_y,pred_next_forecast,next_pred_y_gt,next_pred_reconstruct
        else:
            return pred_y,pred_reconstruct,pred_next_y,pred_next_forecast
```


```python
def train(args,optimizer,forecast_loss,train_dataloader,val_dataloader,test_dataloader):
    for epoch in range(args.epoch):
        model.train()
        full_pred_y=torch.Tensor().to(device)
        full_pred_next_y = torch.Tensor().to(device)
        full_true_y=torch.Tensor().to(device)
        full_true_next_y=torch.Tensor().to(device)
        
        pred_latent_y = torch.Tensor().to(device)
        pred_latent_next_y = torch.Tensor().to(device)
        start_time= time.time()
        train_loss_ = 0 
        mse_loss_ = 0 
        for batch in train_dataloader:
            # import pdb ; pdb.set_trace()
            present,batch_coeffs,batch_next_coeffs, batch_y,next_y ,next_forecast= batch 
            coeffs = (batch_coeffs,batch_next_coeffs)
            pred_y,reconstruct,pred_next_y,forecast_y ,next_gt,next_gt_reconstruct= model(coeffs,mode='train')
            pred_y = pred_y.squeeze(-1)
            pred_next_y = pred_next_y.squeeze(-1)
            # import pdb ; pdb.set_trace()
            if args.missing_rate >0:
                
                X = torchcde.CubicSpline(batch_coeffs)
                times = torch.arange(X.interval[-1].item()+1)
                present = X.evaluate(times)
                
                next_X= torchcde.CubicSpline(batch_next_coeffs)
                next_times = torch.arange(next_X.interval[-1].item()+1)
                next_forecast = next_X.evaluate(next_times)
            
            fore_loss = forecast_loss(forecast_y.cpu(),next_forecast.cpu()) #256,20,55
            
            present_score  = pred_y # (present.cuda() - reconstruct).abs().mean(dim=[1,2]) + pred_y
            next_gt_score = next_gt # (next_forecast.cuda() - next_gt_reconstruct).abs().mean(dim=[1,2]) + next_gt
            precursor_score = pred_next_y
            
            binary_prediction = (present_score>0).to(batch_y.dtype)
            next_binary_prediction = (precursor_score>0).to(batch_y.dtype)
            next_gt = (next_gt_score>0).to(batch_y.dtype)
            
            batch_y = (batch_y.sum(dim=1)>0).to(batch_y.dtype)
            next_y = (next_y.sum(dim=1)>0).to(batch_y.dtype)
            
            loss = torch.nn.functional.binary_cross_entropy_with_logits(pred_y, batch_y)
            # Knowledge distillation
            next_loss = torch.nn.functional.binary_cross_entropy_with_logits(pred_next_y, next_gt)
            
            
            full_pred_y=torch.cat([full_pred_y,binary_prediction])
            full_pred_next_y=torch.cat([full_pred_next_y,next_binary_prediction])
            
            full_true_y=torch.cat([full_true_y,batch_y])
            full_true_next_y=torch.cat([full_true_next_y,next_y])
            
            pred_latent_y = torch.cat([pred_latent_y,present_score])
            pred_latent_next_y = torch.cat([pred_latent_next_y,precursor_score])
            
            
            full_loss = next_loss + loss
            train_loss_ += full_loss
            mse_loss_ += fore_loss
            
            
            full_loss.backward()
            optimizer.step()
            optimizer.zero_grad()
        
        preds = pred_latent_y.squeeze(-1).detach().cpu().numpy()
        next_preds = pred_latent_next_y.squeeze(-1).detach().cpu().numpy()
        
        y = full_true_y.squeeze(-1).detach().cpu().numpy()
        next_y = full_true_next_y.squeeze(-1).detach().cpu().numpy()

        train_loss = train_loss_ / len(train_dataloader)
        mse_loss = mse_loss_ / len(train_dataloader)
        
        if (full_true_y.sum() ==0) or (full_true_y.sum() == full_true_y.shape[0]): 
            auroc = 0.5
            auroc_next = 0.5
        else:
            fpr,tpr,thresholds = metrics.roc_curve(y,preds,pos_label=1)
            next_fpr,next_tpr,next_thresholds = metrics.roc_curve(next_y,next_preds,pos_label=1)
            
            auroc = metrics.auc(fpr,tpr)
            auroc_next = metrics.auc(next_fpr,next_tpr)

        Full_precision, Full_recall, Full_f_score, _     = precision_recall_fscore_support(full_true_y.cpu(), full_pred_y.cpu(),average='weighted')
        Next_precision, Next_recall, Next_f_score, _     = precision_recall_fscore_support(full_true_next_y.cpu(), full_pred_next_y.cpu(),average='weighted')
        
        
        # print('Epoch: {}   Train loss:      {:.4f}  Train forecasting loss :      {:.4f}    Time :{:.4f}'.format(epoch, train_loss,mse_loss,(time.time()-start_time)))
        
        print('Epoch: {}   Train loss:      {:.4f}  Train Pr :      {:.4f}       Train Re :      {:.4f}   Train F1:       {:.4f}  Train AUROC :       {:.4f}      Time :{:.4f}'.format(epoch, loss.item(),Full_precision,Full_recall,Full_f_score,auroc,(time.time()-start_time)))
        print('[Precursor]                          Train Next Pr : {:.4f}       Train Next Re : {:.4f}   Train Next F1:  {:.4f}  Train Next AUROC :  {:.4f}'.format(Next_precision,Next_recall,Next_f_score,auroc_next))
        print('[Forecasting]                        Train MSE :     {:.4f} \n'.format(mse_loss))
        evaluate(args,'val',val_dataloader,epoch)
        evaluate(args,'test',test_dataloader,epoch)
```


# Comments


> 😀 **YongKyung Oh**  
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
