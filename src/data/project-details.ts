// Per-project detail content, ported from research/projects/contents/*.md.
// Keyed by the project slug used in projects.ts.

export type Section = { heading: string; body: string[] };
export type Figure = { src: string; caption?: string };
export type ProjectDetail = {
  organizer: string;
  category: string;
  tags: string[];
  sections: Section[];
  figures: Figure[];
};

const A = "/assets/research/projects";

export const projectDetails: Record<string, ProjectDetail> = {
  "cobot-rul": {
    organizer: "IITP (Institute of Information & Communications Technology Planning & Evaluation)",
    category: "AI in Quality Engineering",
    tags: ["Collaborative Robots", "Predictive Maintenance", "Remaining Useful Life", "Foundation Model", "Shipbuilding"],
    sections: [
      { heading: "Motivation", body: ["In shipbuilding, collaborative robots operate under highly variable, ship-specific conditions, so robot maintenance still relies on experience-based, manual judgment rather than systematic prediction.", "Existing rule-based and single-task AI/ML approaches struggle to generalize across changing designs, new ship types, and heterogeneous multimodal data (drawings, schedules, sensor logs)."] },
      { heading: "Goal", body: ["As part of a national multimodal foundation-model R&D program (with HD Hyundai Heavy Industries, HD Korea Shipbuilding & Offshore Engineering, and Crowdworks), lead the predictive-maintenance track: anomaly detection, fault diagnosis, remaining useful life (RUL) prediction, and maintenance scheduling for collaborative robots.", "Build a digital twin of robot health that supports explainable, dialogue-based maintenance decisions."] },
      { heading: "Methodology", body: ["Define the state-space and data pipeline for collaborative-robot condition monitoring, then develop an adaptive physics-informed RUL prediction model that stays reliable under small data and shifting work conditions.", "Extend to a Bayesian neural network for RUL distributions and confidence intervals, feeding a multi-stage (normal/caution/warning/risk) alert system.", "In later stages, integrate diagnosis into an LLM-based conversational maintenance agent and extend to multi-robot coordination."] },
    ],
    figures: [{ src: `${A}/cobot-rul-1.jpg` }],
  },
  "lg-lqc": {
    organizer: "LG Electronics",
    category: "System Monitoring & Anomaly Detection",
    tags: ["Anomaly Detection", "Quality Control", "Rule-based Data Refinement"],
    sections: [
      { heading: "Motivation", body: ["Defective products that are not detected during the LQC process are shipped to customers and later returned due to quality issues."] },
      { heading: "Methodology", body: ["Based on domain knowledge, the conditions of abnormal patterns are specified and used to refine the model's training data. A self-supervised learning method is employed, accounting for data contamination and the extremely limited information on minor defects."] },
      { heading: "Contribution", body: ["Before refinement, defective products were rarely detected; after refinement, more than 80% were identified. The model also learned to distinguish abnormal from normal data more effectively."] },
    ],
    figures: [{ src: `${A}/lg-lqc-1.webp`, caption: "A general process for detecting product defects through Line Quality Control." }],
  },
  "lg-pmo": {
    organizer: "LG Electronics",
    category: "System Monitoring & Anomaly Detection",
    tags: ["Customer Retention", "User Satisfaction", "Survival Analysis", "Data-Driven Metrics"],
    sections: [
      { heading: "Motivation", body: ["In non-contractual settings, customer satisfaction is hard to measure as real churn is not directly observable. Many existing metrics also fail to capture true user satisfaction."] },
      { heading: "Methodology", body: ["Use survival-analysis techniques (e.g., the Kaplan-Meier estimator) to measure customer retention."] },
      { heading: "Contribution", body: ["Developed a novel metric that accurately measures customer retention in a non-contractual environment."] },
    ],
    figures: [{ src: `${A}/lg-pmo-1.webp`, caption: "Clustering-based customer segmentation, using the developed metric for retention insights." }],
  },
  "maritime-ad": {
    organizer: "Personal",
    category: "System Monitoring & Anomaly Detection",
    tags: ["Route Planning", "Maritime Situational Awareness", "Maritime Surveillance"],
    sections: [
      { heading: "Motivation", body: ["The maritime industry is a key component of the global economy — a complex adaptive system that must adjust quickly to changing situations by solving many decision-making problems."] },
      { heading: "Goal", body: ["Construct the best-planned route (the reference line)", "Develop a novel statistical (low-likelihood) anomaly detector", "Ensure maritime situational awareness and surveillance"] },
      { heading: "Methodology", body: ["Quantify the route probability", "Detect spatial and temporal anomalies"] },
    ],
    figures: [{ src: `${A}/maritime-ad-1.webp` }, { src: `${A}/maritime-ad-2.webp` }],
  },
  "scsc-llm-maritime": {
    organizer: "SCSC",
    category: "System Monitoring & Anomaly Detection",
    tags: ["LLM Agent", "Prompt Engineering", "AIS Data", "Maritime Data Analytics", "Conversation Agents"],
    sections: [
      { heading: "Motivation", body: ["Conventional AIS analysis requires SQL/GIS/Python expertise, while single-prompt LLM agents cannot balance factual accuracy and analytical reasoning."] },
      { heading: "Methodology", body: ["A two-stage agent: first classify query types (fact/aggregation vs. inference/analysis), then apply tailored prompts — compact for accuracy or chain-of-thought for reasoning — executed via safe tool-calling on AIS datasets."] },
      { heading: "Contribution", body: ["Hybrid prompt architecture validated on a 100-item AIS QA benchmark", "Balanced improvements in accuracy, reasoning, and efficiency"] },
    ],
    figures: [{ src: `${A}/scsc-llm-maritime-1.webp`, caption: "Hybrid Prompt Agent workflow with AIS tracks and analysis results." }],
  },
  "lqc-od": {
    organizer: "LG Electronics",
    category: "System Monitoring & Anomaly Detection",
    tags: ["Manufacturing", "LQC", "Sequential Transformation", "Domain Knowledge"],
    sections: [
      { heading: "Motivation", body: ["In manufacturing, time-series data are collected from multiple sensors for quality control.", "In line quality control (LQC), weak failures occur that are difficult to detect with conventional methods."] },
      { heading: "Goal", body: ["Develop a method for detecting tiny anomaly patterns in manufacturing time-series data using Sequential Transformation (ST) and domain knowledge of failure patterns."] },
      { heading: "Methodology", body: ["ST maximizes the time-series pattern of a tiny anomaly sample through various computations.", "Domain knowledge of failure patterns defines new derivatives, combined with ST to improve performance."] },
    ],
    figures: [{ src: `${A}/lqc-od-1.webp` }],
  },
  "cnn-gas": {
    organizer: "Ulsan Industry-University Convergence Campus",
    category: "Time-Series Representation Learning",
    tags: ["E-sensing", "Electronic Nose", "Gas Sensing", "CNN"],
    sections: [
      { heading: "Motivation", body: ["An electronic nose detects odors or flavors. E-sensing technologies have undergone important technical and commercial developments."] },
      { heading: "Goal", body: ["Develop an analysis method for classifying gas mixtures.", "A CNN-based time-series analysis method is proposed."] },
    ],
    figures: [{ src: `${A}/cnn-gas-2.webp` }, { src: `${A}/cnn-gas-1.webp` }],
  },
  "piston-lc": {
    organizer: "Personal",
    category: "Time-Series Representation Learning",
    tags: ["Refrigerator Compressor", "MLP", "Sensorless Technology", "Precision Control", "DNN"],
    sections: [
      { heading: "Motivation", body: ["80% of a refrigerator's total power consumption is consumed by the compressor.", "Cooling is determined by the distance and position of piston movement."] },
      { heading: "Goal", body: ["Precision control of the piston and sensorless technology are required."] },
      { heading: "Data", body: ["Build an automated data-collection system measuring current, voltage, and stroke."] },
      { heading: "Methodology", body: ["A four-layer Multi-Layer Perceptron (MLP) with drop-out.", "Contribution: more than 90% performance improvement."] },
    ],
    figures: [{ src: `${A}/piston-lc-2.webp` }, { src: `${A}/piston-lc-3.webp` }, { src: `${A}/piston-lc-1.webp` }],
  },
  "tao-eye-detect": {
    organizer: "Korea Innovation Foundation",
    category: "System Monitoring & Anomaly Detection",
    tags: ["Thyroid Eye Disease", "Clinical Activity Score", "Early Diagnosis", "Ophthalmology Imaging"],
    sections: [
      { heading: "Motivation", body: ["Thyroid eye disease is a representative complication of thyroid dysfunction.", "Ophthalmologists assign a Clinical Activity Score (CAS) in the early active inflammatory phase so treatment can begin before irreversible changes occur.", "Long-lasting thyroid eye disease can cause great pain."] },
      { heading: "Goal", body: ["Develop an AI system for early monitoring and diagnosis during the active inflammatory phase, enabling timely treatment before irreversible changes."] },
      { heading: "Methodology", body: ["Using deep learning, detect all present diseases from eye images."] },
    ],
    figures: [{ src: `${A}/tao-eye-detect-1.webp` }],
  },
  "traffic-cong": {
    organizer: "NAVER",
    category: "Time-Series Representation Learning",
    tags: ["Non-recurrent Congestion", "Propagation Mechanism", "Bootstrap Uncertainty"],
    sections: [
      { heading: "Motivation", body: ["Congestion caused by an accident propagates to subsequent roads, delayed and manifested on some of them.", "Unpredictable delayed events and a lack of historical irregular-event data make the propagation pattern difficult to model."] },
      { heading: "Goal", body: ["Identify and quantify the propagation mechanisms and time-lag effects of accident-induced non-recurrent congestion."] },
      { heading: "Methodology", body: ["Model the propagation pattern of non-recurrent traffic congestion.", "Identify the statistical causal relationship between accident and subsequent roads, using the bootstrap to quantify uncertainty in propagation lags."] },
    ],
    figures: [{ src: `${A}/traffic-cong-2.webp` }, { src: `${A}/traffic-cong-1.webp` }],
  },
  "iitp-bio": {
    organizer: "IITP",
    category: "Time-Series Representation Learning",
    tags: ["Time-Series Analysis", "Biosignal", "Foundation Model"],
    sections: [
      { heading: "Motivation", body: ["AI for bioelectrical signals suffers from insufficient labeled data, high noise, large variability, and study-specific data collection — leading to low efficiency, poor generalizability, and difficult training and deployment."] },
      { heading: "Methodology", body: ["Develop a foundation model that accounts for the unique characteristics of bioelectrical signal acquisition mechanisms."] },
      { heading: "Contribution", body: ["Enables the development of a wide range of downstream solutions."] },
    ],
    figures: [{ src: `${A}/iitp-bio-1.webp` }],
  },
  "quasar-detect": {
    organizer: "AI HUB",
    category: "System Monitoring & Anomaly Detection",
    tags: ["Outlier Detection", "Astronomical", "Physics", "Time Series"],
    sections: [
      { heading: "Motivation", body: ["Reliably detect changes in quasar (QSO) light curves in real time and describe these changes quantitatively for easy understanding."] },
      { heading: "Methodology", body: ["Apply physics-based transformation to irregularly observed astronomical time series.", "Estimate the probability of being normal at each time using a conditional density model on the transformed data.", "Detect outliers when data deviating from normal probability arrives, defining this as a changing state."] },
      { heading: "Contribution", body: ["Understand QSO state changes and identify their physical mechanisms.", "Selectively identify reliable targets for spectroscopic follow-up, improving efficiency.", "Understand and explore supermassive black holes."] },
    ],
    figures: [{ src: `${A}/quasar-detect-1.webp` }, { src: `${A}/quasar-detect-2.webp` }],
  },
  "thyroid-dose": {
    organizer: "THYROSCOPE",
    category: "AI in Quality Engineering",
    tags: ["Survival Analysis", "Deep Learning", "Time Series Data"],
    sections: [
      { heading: "Motivation", body: ["A drawback of traditional thyroid hormone therapy is the difficulty of determining the initial dosage. An inappropriate dose can lead to goiter, thyroid eye disease, prolonged treatment, and increased cost and patient dissatisfaction."] },
      { heading: "Methodology", body: ["In training, longitudinal patient data trains a deep-learning survival model to compute a cumulative incidence function fitting individual patient profiles.", "In testing, only the first patient visit is used to compute incidence functions for different dose levels; the highest-value dose is recommended as the optimal initial dose."] },
      { heading: "Contribution", body: ["Replaces experience-based dosing with a data-driven model leveraging deep learning and survival analysis for individualized recommendations.", "Effectively handles complex, nonlinear, irregularly sampled patient data."] },
    ],
    figures: [{ src: `${A}/thyroid-dose-1.webp` }],
  },
  "scsc-ais-risk": {
    organizer: "SCSC",
    category: "Time-Series Representation Learning",
    tags: ["Imitation Learning", "Anomaly Detection", "Risk-Aware", "Environmental Data"],
    sections: [
      { heading: "Motivation", body: ["Most imitation-learning anomaly detectors rely only on vessel trajectories.", "Without environmental context, hazard-avoidance maneuvers are often misclassified as anomalies.", "Adding environmental context (wind, waves) helps distinguish unsafe actions from safe, weather-driven detours."] },
      { heading: "Methodology", body: ["Redefine the imitation-learning state space to include ERA5 environmental variables.", "Train policies on normal trajectories under environmental context.", "Evaluate with hazard-injection scenarios to test decision robustness."] },
      { heading: "Contribution (Expected)", body: ["A hazard-injection evaluation pipeline for imitation learning under weather impact.", "A framework showing how enriched state representations improve risk-sensitive anomaly detection."] },
    ],
    figures: [{ src: `${A}/scsc-ais-risk-1.webp`, caption: "Representative image of OIL-AD, the reference for this preliminary research." }],
  },
  "scsc-fuel-pred": {
    organizer: "SCSC",
    category: "Time-Series Representation Learning",
    tags: ["Sustainable Maritime Transport", "Spatio-temporal Analysis", "Physics-Guided Prediction", "Surrogate Modeling"],
    sections: [
      { heading: "Motivation", body: ["Maritime operations face growing sustainability pressure as regulations tighten. Optimal, environment-aware routing requires a fuel-consumption model that reflects environmental information."] },
      { heading: "Methodology", body: ["Integrate satellite environmental data with AIS data to reflect environmental information.", "Use regression and neural surrogate modeling for fuel estimation.", "Extract a physics-based resistance value from AIS and environmental data."] },
      { heading: "Contribution", body: ["A robust hybrid fuel-consumption model, resilient to environmental change, integrating physics-based knowledge.", "Supports an optimal routing system for tangible reductions in carbon emissions."] },
    ],
    figures: [{ src: `${A}/scsc-fuel-est-1.webp`, caption: "Maritime data and environmental data." }],
  },
  "navermap-transport": {
    organizer: "NAVER",
    category: "Route Recommendation",
    tags: ["Public Transit", "Route Recommendation Evaluation", "Mobility Data"],
    sections: [
      { heading: "Motivation", body: ["Transit route recommendation should suggest not only fast routes but realistic, useful alternatives.", "Users weigh travel time, transfer burden, fare, and walking distance.", "This project evaluates whether recommended route lists are reasonable and practical from the user's perspective."] },
      { heading: "Methodology", body: ["Analyze the characteristics of recommended transit routes using mobility data.", "Consider multiple factors — time, cost, and travel burden.", "Evaluate whether the list provides practically meaningful choices, with interpretable criteria applicable to real services."] },
      { heading: "Contribution", body: ["Organize user-centered criteria for evaluating transit route recommendations.", "Design an evaluation framework for quantitatively analyzing recommendation quality.", "Provide foundational analysis to support future improvements to real-world mobility services."] },
    ],
    figures: [{ src: `${A}/navermap-transport-1.png`, caption: "Pipeline from transportation data to an enhanced recommended route list via route representation and evaluation." }],
  },
};
