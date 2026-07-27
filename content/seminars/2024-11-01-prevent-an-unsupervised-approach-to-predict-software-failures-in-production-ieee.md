---
date: 2024-11-01
title: PREVENT : An Unsupervised Approach to Predict Software Failures in Production (IEEE Trans. Softw. Eng. 2025)
category: Paper Review
presenter: 강태원
url: https://www.notion.so/f6c6ff4589e2469fb18a0c7b14e56cda
keywords: Anomaly Detection, Autoencoder, Causality, UnsupervisedLearning
---

# Selected Paper


## Title: PREVENT : An Unsupervised Approach to Predict Software Failures in Production(IEEE 2023)


## Abstract


This paper presents PREVENT, a fully unsupervised approach to predict and localize failures in distributed enterprise applications. Software failures in production are unavoidable. Predicting failures and locating failing components online are the first steps to proactively manage faults in production. Many techniques predict failures from anomalous combinations of system metrics with supervised, weakly supervised, and semi supervised learning models. Supervised approaches require large sets of labelled data not commonly available in large enterprise applications, and address failure types that can be either captured with predefined rules or observed while training supervised models. **PREVENT integrates the core ingredients of unsupervised approaches into a novel fully unsupervised approach to predict failures and localize failing resources.** The results of experiment ing with PREVENT on a commercially-compliant distributed cloud system indicate that PREVENT provides more stable, reliable and timely predictions than supervised learning  approaches, without requiring the often impractical training with labeled data.


[Prevent: An Unsupervised Approach to Predict Software Failures in Production | IEEE Journals & Magazine | IEEE Xplore](https://ieeexplore.ieee.org/document/10305549)


## Introduction

- Even if software design and quality assurance are flawless, there is still a possibility of novel failure occurring during operation.
- PREVENT : **Predicts and localizes novel failures** simultaneously using a **fully unsupervised** learning approach
    - **Trains only on normal data without using any label information and detects abnormal data**

### Learning Type

- Supervised : recognizes known abnormal types using labeled data
- Unsupervised : detects abnormal types using unlabeled data (can include normal and abnormal data, or only normal)
- Fully unsupervised : **predicts novel abnormal types** using only **unlabeled normal data**
    - This is crucial across various domains as it **enables the preventing of novel failure types without prior knowledge**

![](/assets/seminars/prevent-an-unsupervised-approach-to-predict-software-failures-in-production-ieee/0.png)


### **Anomaly Category in Software**

- Defect(결함) : Arises from an error or mistake, represents a potential issue or flaw that **could lead to problems in performance or reliability**
- Fault(고장) : An abnormal behavior or partial malfunction within a specific part of the system, **resulting in degraded performance**
- Failure(실패) : A complete inability of the system to operate, often **leading to a shutdown**

![](/assets/seminars/prevent-an-unsupervised-approach-to-predict-software-failures-in-production-ieee/1.png)


## Related work


### **PREMISE : Predicting failures in multi-tier distributed systems (arXiv 2020)**

- Failure Prediction System Combining Anomaly Detection and Signature-based Prediction
    - Just using make a comparison between PREMISE and PREVENT(seminar paper)

![](/assets/seminars/prevent-an-unsupervised-approach-to-predict-software-failures-in-production-ieee/2.png)

- Offline - **establish a baseline model and signature model**
    - Train on normal data to **establish a baseline model**
    - Train to **learn fault patterns using fault seeds to establish a signature model** (Supervised)
- Online - Anomaly detector
    - **Detects anomalies and potential failures in real-time comparison with baseline model** using time series analysis (Unsupervised)
    - **Predicts failure by assessing the match with the trained signature model** (Supervised)
- **Requires labeled data for training** and performs well only on known, pre-trained failure types

### **LOUD : Localizing Faults in Cloud Systems (IEEE 2018)**

- Unsupervised Detection Based on Granger-Causality and PageRank Centrality
    - Seminar paper using a idea about localization
    - PageRank : based on the idea that pages receiving more links are likely more important
    - considers not only **the number of links** but also the **importance of the linking pages(propagation)**

![](/assets/seminars/prevent-an-unsupervised-approach-to-predict-software-failures-in-production-ieee/3.png)

- Offline
    - **Sets reference baseline model for Key performance indicators(KPIs)** under normal conditions
        - KPI **:** represents a performance metric(cpu stress, memory leak …)
    - **Models causality graph between KPIs**, where nodes represent KPIs, and weighted edges represent causality
        - node : Represents the specific resource or component being monitored for anomalies
        - Edge Weight : Represents the strength of causality from node $i$ to node $j$
- Online
    - Monitors KPI data in real-time and **detects abnormal KPIs by comparing against the baseline**
    - **Calculates anomaly scores** for each KPI by measuring the deviation from its baseline value
        - **Anomaly Score**: For each KPI, calculate the reconstruction error using techniques
    - Converts detected **abnormal KPIs into a propagation graph** to model the mutual influence among anomalous KPIs
- Localization(PageRank)
    - **Identify the source of the fault using centrality indices** in the propagation graph
        - Centrality Indices : Indicates the importance of specific KPIs
            - $W_{ij}$ : weight(causality) between node $i$ and node $j$

        
    $$
        \text{Centrality score } c_i = \mu\sum^n_{j=1}W_{ij}c_i
        $$
        


## Dataset


![](/assets/seminars/prevent-an-unsupervised-approach-to-predict-software-failures-in-production-ieee/4.png)

- Consists of 1,700 KPIs and minute-level KPI values extracted from a Redis Cluster
    - Data is extracted from 20 nodes for each of the 85 KPIs, resulting in 85 x 20 = 1,700 points (feature)
    - ex) redis-1-11.system.[cpu.total](http://cpu.total/), 11 is node, cpu.total is KPI
- Data collect : Data for false positive rate test and failure Injection test data
    - Data for false positive rate test
        - Weeks 1–2: Data collected **under normal operation** for training (80%) and validation (20%)
        - Week 3: Data collected **under normal operation to verify the false positive rate with normal data**
    - Failure Injection test data : Separate data is **used for detecing 5 types failure** (CPU, memory stress, network packet loss, delay and corruption)

    ![](/assets/seminars/prevent-an-unsupervised-approach-to-predict-software-failures-in-production-ieee/5.png)

    - This graph shows the **data changes dramatically before and after the failure injection**
    - The experiment concludes once the failure occurs

## PREVENT


![](/assets/seminars/prevent-an-unsupervised-approach-to-predict-software-failures-in-production-ieee/6.png)

- Uses a combination of Deep Autoencoder, Granger-causality, and PageRank to predict failures
- **Utilizes a State Classifier and Anomaly Ranker** to classify system states and detect anomalous nodes(failure localization)
    - State Classifier : **Learns normal system behavior and detects deviations based on a threshold**(PREVENT_A, PREVENT_E)
        - Anomalous state : Passed to the Anomaly ranker
    - Anomaly ranker : **Ranks nodes with detected anomalies** based on their importance and **detecting failure nodes**

### A. PREVENT_A State Classifier


![](/assets/seminars/prevent-an-unsupervised-approach-to-predict-software-failures-in-production-ieee/7.png)

1. Learns from **KPI data collected under normal conditions** and **identifies anomalous KPI values using Autoencoder**
    - Encoder: Compresses input data(KPI), Decoder: Reconstructs the input data
    - **Detects anomalies when the Reconstruction Error exceeds 3 sigma**(concept drift X)
2. **Calculate each KPI’s reconstruction error(MSE)** the difference between Input and Output

    
$$
    \text{MSE}= \frac{1}{n}\sum^n_{i=1}(x_i-\hat{x}_i)^2
    $$
    

3. Calculate and **save anomaly score for each KPIs where reconstruction error exceeds the threshold**
4. **Passed to anoamly ranker**

```javascript
# Autoencoder and threshold


number_nodes_factor = 0.5
sigma = 3

class AnomalyDetector(Model):
    def __init__(self, number_of_columns_, factor_):
        super(AnomalyDetector, self).__init__()

        self.encoder = tf.keras.Sequential([
            layers.Dense(int(number_of_columns_ * factor_), activation="tanh", kernel_regularizer=regularizers.l1(0.002)),
            layers.Dense(int(number_of_columns_ * factor_ * factor_), activation="tanh", kernel_regularizer=regularizers.l1(0.002)),
            layers.Dense(int(number_of_columns_ * factor_ * factor_ * factor_), activation="tanh"),
        ])

        self.decoder = tf.keras.Sequential([
            layers.Dense(int(number_of_columns_ * factor_ * factor_), activation="tanh"),
            layers.Dense(int(number_of_columns_ * factor_), activation="tanh"),
            layers.Dense(int(number_of_columns_), activation="tanh")
        ])
        
def get_threshold(loss_, verbose=False):
    threshold_up = np.mean(loss_) + sigma * np.std(loss_)
    threshold_down = np.mean(loss_) - sigma * np.std(loss_)
    if verbose:
        print("Mean:", np.mean(loss_),"Std Deviation:", np.std(loss_),  "Threshold UP: ", threshold_up,  "Threshold DOWN: ", threshold_down)
    
    return round(np.mean(loss_), 2), round(np.std(loss_), 2), round(threshold_up, 2), round(threshold_down, 2)
```


```javascript
# Calculate reconstruction error(MSE)


test_data_sets = []
test_reconstructions = []

for test_data_set_code in test_data_set_codes:
    test_df = pd.read_csv(data_set_file_path.format(data_set_code=test_data_set_code))
    test_data = scaler.transform(test_df.values.astype(float))
    test_data_sets.append(test_data)
    test_reconstructions.append(autoencoder.predict(test_data))

# Detect anomalies (point-level) and save predictions
for test_data_set_idx, test_data_set_code in enumerate(test_data_set_codes):
    
test_point_reconstruction_errors = tf.keras.losses.mse(test_reconstructions[test_data_set_idx], test_data_sets[test_data_set_idx])

    test_predictions = np.array(get_predictions(test_point_reconstruction_errors, threshold_up))[0]
```


```javascript
# Calculate and save anomaly score for each metric where reconstruction error exceeds the threshold


for test_data_set_idx, test_data_set_code in enumerate(the_test_data_set_codes):

    # Calculate the reconstruction errors for each KPI's value within each point
    test_reconstruction_errors = np.abs(test_reconstructions[test_data_set_idx] - test_data_sets[test_data_set_idx])

    # Create a two-dim array of anomalies (sets of anomalous KPIs for each point) in JSON format - anomalous_kpis_json
    anomalous_kpis_json = []
    for current_timestamp, point__ in enumerate(test_reconstruction_errors):

        anomalous_kpis_json_one_point  = []
        for kpi_index, kpi_re in enumerate(point__):

            kpi_re_above_threshold = kpi_re - thresholds_per_metric_up[kpi_index]
            
if kpi_re_above_threshold >= 0:

                
                kpi_components_list = feature_set[kpi_index].split("_")
                kpi_node = kpi_components_list[0]
                kpi_metric = "_".join(kpi_components_list[1:])
                
                anomalous_kpis_json_one_point.append({
                    'timestamp': 1522751098000,
                    'resource': {
                        'name': kpi_node,
                    },
                    'metric': {
                        'name': kpi_metric,
                    },
                   
 'value': kpi_re_above_threshold/thresholds_per_metric_up[kpi_index],

                    'kpi_index': kpi_index
                })

        # Append an anomalies to the JSON data structure
        anomalous_kpis_json.append(anomalous_kpis_json_one_point)
```


```javascript
# Passed to anoamly ranker


for test_data_set_code in test_data_set_codes:
    with open(anomalies_file_path.format(data_set_code=test_data_set_code)) as json_file:
        anomalous_kpis_json = json.load(json_file)

    with open(localisations_file_path.format(data_set_code=test_data_set_code), "w") as file_out:
        localisations_writer = csv.writer(file_out)

        for i, anomalies in enumerate(anomalous_kpis_json):
            data = {"anomalies": anomalies}
            # Passed to anomaly ranker

            response = requests.post(f"{server_address.format(localizer_server_port=localizer_server_port)}/localize?rank_selection={rank_selection}&data_set_code={test_data_set_code}&minute={i}", json=data, headers={"Content-Type": "application/json"})

            response_content_decoded = json.loads(response.content)
            # 주요 장애 노드 저장
            localization_row = [str(i), response_content_decoded["localization"]]
            
            # 장애 가능성이 높은 노드 리스트 저장
            for item in response_content_decoded["suspected_list"]:
                localization_row.extend([item[0], item[1]])  # Node and Score

            localisations_writer.writerow(localization_row)
```


### B. PREVENT_E State Classifier


![](/assets/seminars/prevent-an-unsupervised-approach-to-predict-software-failures-in-production-ieee/8.png)

1. Learns from KPI data collected under normal conditions and identifies anomalous KPI values
2. Restricted Boltzmann Machine(RBM) Structure and Energy Function Calculation
    - Visible layer: KPI values as input, Hidden layer: Encodes the joint distribution among KPIs to model their interactions

    
$$
    E({v_i},{h_j}) = \sum_i a_iv_i + \sum_{i,j} v_iw_{ij}h_j + \sum_j b_jh_j
    $$
    

    - $v_i, a_i$ : visible variable & bias, $h_j, b_j$ ; hidden variable & bias, $w_{i,j}$ : visible & hidden weigt
3. Train the RBM and Calculate Gibbs Free Energy
    - Gibbs Free Energy: Serves as an overall assessment of the **system's state, calculated based on KPI correlations**


$$
G({v_i}) = -\log \sum_{h_j}e^{-E({v_i},{h_j})}
$$


1. Build a Baseline Model for Normal State: Define the baseline as $G_{baseline} ± 3\sigma$
2. Anomaly Detection: Detect anomalies by comparing Gibbs free energy with the baseline

### C. PREVENT Anomaly Ranker

- Anomaly Ranker : **Detects anomalous states in KPIs and identifies nodes where errors occurred**
1. State classifier : Identifies anomalous KPIs by detecting using the reconstruction error exceeds three times the standard deviation and **receive anomaly score(anoamlous KPIs)**
2. Granger Causality : **Builds a causality graph based on anomalous KPIs**
    - **Removes normal KPIs** and retains only anomalous KPIs to infer abnormal states according to causality graph
3. PageRank Centrality : **Calculates centrality based on the causality graph of anomalous KPIs**
    - Uses the causality graph among abnormal KPIs to calculate the **relative importance of each KPI, extracting the top 20% anomalous KPIs.**

        ```javascript
        personalization_dict[elem_idx] = kpi_re_above_thrsh / max_re_above_threshold
        ```

4. **Identification of Node with Most Anomalies Using Basic Oracle**
    - Among nodes containing the top 20% anomalous KPIs, **identifies the node with the highest number of anomalous KPIs**
        - For example, if redis-1-10 node contains 10 anomalous KPIs and redis-1-15 node contains 15 anomalous KPIs, **redis-1-15 would be identified as the faulty node**
        - Oracle: An evaluation module that helps **determine if results are correct, used to predict faults and localize failures**
            - **BasicOracle**: Selects a single node with the **highest frequency of anomalies** (used in this paper)
            - SumOracle : Selects the node with the highest sum of anomaly scores

```javascript
# Granger Causality: Builds a causality graph based on anomalous KPIs and remove normal KPIs


class GeneralRanker(object):
    """Abstract superclass of ranking algorithms.

    Any adoption of ranking algorithms should inherit this class, and implement
    rank() class method and predict() class method.
    """
    @classmethod
    @abstractmethod
    def rank(cls, anomalies_seq):
        """Abstract ranking class method.

        Classes inherit this class should implement this method, which is
        supposed to contain the user's stratagy of ranking the anomalies.

        Args:
            anomalies_seq(list): A list of sets, each set contains the
                anomalies' idices at a timestamp.

        Returns:
            A list whose elements are the anomaly list. Each anoamly list
            contains the tuples of KPI index and rankings. Example: [[${KPI
            index 1}, ${KPI ranking 1}, ${KPI index 2}, ${KPI ranking 2}, ...],
            ...]
        """
        pass

    @classmethod
    def sub_matrix(cls, anomaly_list):
        """Helper class method to get a adjecency matrix of the anomalies.

        Args:
            anomaly_list(list): The list that contains the anomalies' idices at
                a timestamp.

        Returns:
            An adjecency matrix that represents the sub-graph in the causality
            graph which only contains the anomalies.
        """
        

        # 전체 인과 관계 그래프의 가중치 행렬 불러오기
        full_matrix = causality_graph.get_weighted_matrix()

        # print("\nGeneralRanker. Full matrix (from saved file):\n")
        # for item in full_matrix:
            # print(item)

        # print("\nGeneralRanker. Anomaly list: ", anomaly_list)
        
        # 이상 KPI 간의 인과 관계만을 포함
        sub_matrix = []
        len_submx = len(anomaly_list)

        for i in range(len_submx):
            row = []
            for j in range(len_submx):
                if anomaly_list[i] is not -1 and anomaly_list[j] is not -1:
                    row.append(full_matrix[anomaly_list[i]][anomaly_list[j]])
                else:
                    row.append(0)
            sub_matrix.append(row)

        return np.matrix(sub_matrix)
```


```javascript
# PageRank : calculate personalization score of each anomalous KPIs to use ranking


@app.route('/localize', methods=['POST'])
def localize():
    # Generate personalization score by dividing each KPI's reconstruction error by the maximum error value
    personalization_dict = {}
    max_re_above_threshold = np.max(kpis_re_above_thrsh)
    for elem_idx, kpi_re_above_thrsh in enumerate(kpis_re_above_thrsh):
        
personalization_dict[elem_idx] = kpi_re_above_thrsh / max_re_above_threshold

        
ranker_name = config.get('restful', 'ranker')
ranker = localizer_config.get_plugin('ranker', ranker_name)
rankings, values = ranker().rank(kpis_index, personalization_dict)
```


```javascript
# Final Ranking and Localization


oracle_name = config.get('restful', 'oracle')
oracle = localizer_config.get_plugin('oracle', oracle_name)
if config.get('restful', 'oracle') == "sum_oracle.SumOracle":
    _, rsc_sorted = oracle.check([list(zip(rankings, values))], None, 0)
    ret = {'suspected_list': rsc_sorted, 'localization': rsc_sorted[0]}

elif config.get('restful', 'oracle') == "basic_oracle.BasicOracle":
    single_check, suspected_list, strong_sus = oracle.check([list(zip(rankings, values))], None, 0)
    ret = {'suspected_list': suspected_list, 'localization': strong_sus}

    

# BasicOracle Logic


    @classmethod
    def sub_check(cls, lst, rsc):
        """A helper class method to check if the suspect in the resource list
        is the given one. For more information, refer to the doc of the class.

        Args:
            lst(list): A list of resources.
            rsc(str): The string representing the faulty resource.

        Return:
            A boolean which is:
            - True if the ONLY most suspected resource in lst is rsc
            - False if the ONLY most supected resource in lst is not rsc
            - None if there is more than one most suspected resources in lst,
                or lst is empty.
        """
        # anomaly 노드 등장 빈도 계산
        
        counter = Counter(lst).most_common()  # keys - resources, values - number of entry of the resource to the list. All resources are considered.
        couter_dicts = dict(counter)
        # print("\nOracle. Resources sorted by the number of KPIs in top ranked KPIs list: ", couter_dicts)

        suspect_list = list(zip(list(couter_dicts.keys()), list(couter_dicts.values())))
        # print("\nOracle. Suspect_list: ", suspect_list)
                

        # 가장 많이 등장한 노드 찾기
        
        rev_cnt = {}
        for (term, cnt) in counter:
            if cnt not in rev_cnt:
                rev_cnt[cnt] = []
            rev_cnt[cnt].append(term)

            
        # print("##############", rev_cnt, rev_cnt.keys())

        max_app = max(rev_cnt.keys())
        

        # 최종 anomaly 노드 찾기 (rev_cnt[max_app]와 faulty node(rsc) 일치 여부 확인)

        if len(rev_cnt[max_app]) == 1:  # if there is a absolute leader amount the resources
            if rev_cnt[max_app][0] == rsc:
                return True, rsc, suspect_list
            else:
                return False, rev_cnt[max_app][0], suspect_list
        else:
            if rsc == 'None':
                return True, 'None', suspect_list

            return None, None, suspect_list
```


## Experiments


### Research Question

1. Does the unsupervised PREVENT approach improve over SOTA (supervised) approaches?
2. Can PREVENT predict failures in distributed enterprise applications?
3. Does PREVENT improve over LOUD, i.e., the Anomaly Ranker used as a standalone component?
    - standalone : not using state classifier

### **Experimenting with PREVENT**

- Training of Deep Autoencoder, RBM (RBM Neural Network), and Construction of Granger-Causality Analysis Graph
    - Training: **Uses unlabeled data collected over two weeks during normal operation**
        - Out of 1,700 KPIs, removes KPIs with low variance (below $10^{-5}$), resulting in 719 KPIs for training
    - Experiments : Conducted in the third week to evaluate (1) the False Positive rate during normal operation and (2) detection accuracy for Failure Injection

        (1) False Positive Rate: **Measures the false alarm rate** to check if PREVENT incorrectly flags normal states as errors


        (2): Failure Injection Detection: **Assesses alarm accuracy and the precision of failure node identification**, evaluating the stability of true predictions.

            - For 5 type of fault injection, **3 replica tests** were conducted to evaluate anomaly node detection performance, with **the same fault injection pattern** applied across replicas to ensure consistency and robustness in detection accuracy
- Performance Comparison with Existing Research PREMISE(supervised) and LOUD

### **Experimenting with PREMISE and LOUD**

- PREMISE : trained on **labeled data**, **expanding the dataset by replicating failures across all nodes**
    - Evaluating predictive performance by training on data that excludes a specific failure type
- LOUD : considering a failure only if the same node ranks highest for **N consecutive timestamps**, thereby reducing false alarms(N : 3, 4, 5, 6)
    - LOUD uses the Anomaly Ranker in a standalone mode(not using state classifier)

### Results


**(1) False Positive Rate : comparison with LOUD**

- PREVENT_A and PREVENT_E dramatically reduced the false-prediction alarm rate

![](/assets/seminars/prevent-an-unsupervised-approach-to-predict-software-failures-in-production-ieee/9.png)


**(2): Failure Injection Detection**

- PREVENT_A and PREVENT_E show better performance, earliness prediction and localization
    - PREVENT_A and E demonstrated earliness in prediction and stability, through **PREVENT_A showed slightly better performance**
- Red squares indicate the timestamps at which the injected failures manifest as observable failures of the cluster, and the experiment terminates
- Blue squares indicate successful failure predictions
- Grey squares indicate either false prediction alarms before the injection or false location alarms after the injection

    ![](/assets/seminars/prevent-an-unsupervised-approach-to-predict-software-failures-in-production-ieee/10.png)

- False prediction alarm rate : The rate of false alarms during normal operation
    - The proportion of gray squares occuring before failure injection
- Reaction time : The time taken from the failure injection to the first correct prediction
    - The interval between the failure injection point and the first blue square
- Prediction earliness : The time between the first correct prediction and the acture system failure
    - The interval between the first blue square and the red square
- True positive rate(TPR) : The proportion of correct predictions maintained from the first correct prediction until the actual system failure
    - The ratio of blue square between the first blue square and the red square

![](/assets/seminars/prevent-an-unsupervised-approach-to-predict-software-failures-in-production-ieee/11.png)
