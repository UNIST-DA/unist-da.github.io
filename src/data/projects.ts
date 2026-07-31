// Research projects, ported from Jekyll _data/projects.yml.
// `image` paths point into /public/assets (copied from the original site).

export type Project = {
  slug: string;
  title: string;
  image: string;
  summary: string;
  period: string;
};

// Sort key from a "YYYY.MM – …" period → its start month as a number (202307).
const startKey = (period: string) => Number(period.slice(0, 7).replace(".", ""));

export const projects: Project[] = ([
  {
    slug: "cobot-rul",
    title: "Predictive Maintenance and Remaining Useful Life Prediction for Collaborative Robots in Shipbuilding",
    image: "/assets/research/projects/cobot-rul-1.jpg",
    summary:
      "Developing predictive-maintenance and remaining-useful-life (RUL) prediction models for collaborative robots operating in shipyard manufacturing, as part of a national multimodal foundation model R&D program.",
    period: "2026.03 –",
  },
  {
    slug: "lg-lqc",
    title: "Fault Detection via Domain-Knowledge-Based Training Data Refinement",
    image: "/assets/research/projects/lg-lqc-1.png",
    summary:
      "A domain knowledge–based data refinement methodology for detecting defective products that cannot be filtered out in the LQC process.",
    period: "2023.07 – 2024.10",
  },
  {
    slug: "lg-pmo",
    title:
      "Data-driven user engagement metrics for updatable home appliances",
    image: "/assets/research/projects/lg-pmo-1.png",
    summary:
      "Developing a new metric for measuring customer satisfaction based on user activity data.",
    period: "2023.06 – 2024.05",
  },
  {
    slug: "maritime-ad",
    title: "Maritime Anomaly Detection",
    image: "/assets/research/projects/maritime-ad-1.png",
    summary:
      "An ST-based method using failure-pattern knowledge to detect tiny anomalies in manufacturing time-series data.",
    period: "2020.01 – 2022.01",
  },
  {
    slug: "scsc-llm-maritime",
    title: "Hybrid Prompt Agent for Conversational Maritime AIS Data Analysis",
    image: "/assets/research/projects/scsc-llm-maritime-1.png",
    summary:
      "A Hybrid Prompt Agent enabling natural-language analysis of maritime AIS data by combining query classification with dynamic prompting.",
    period: "2025.06 – 2025.08",
  },
  {
    slug: "lqc-od",
    title: "Domain Knowledge-Informed Functional Outlier Detection for LQC",
    image: "/assets/research/projects/lqc-od-1.png",
    summary:
      "An ST-based method using failure-pattern knowledge to detect tiny anomalies in manufacturing time-series data.",
    period: "2022.01 – 2022.12",
  },
  {
    slug: "cnn-gas",
    title: "CNN-based Gas Mixture Classification",
    image: "/assets/research/projects/cnn-gas-1.png",
    summary:
      "A CNN-based multi-channel time-series method for accurate classification of gas mixtures using electronic-nose sensor data.",
    period: "2020.03 – 2020.07",
  },
  {
    slug: "piston-lc",
    title: "Deep Learning for the Behavior of Linear Compressor Pistons",
    image: "/assets/research/projects/piston-lc-1.png",
    summary:
      "Deep learning–based sensorless control of linear compressor pistons with over 90% performance improvement.",
    period: "2022.12 – 2023.12",
  },
  {
    slug: "tao-eye-detect",
    title: "Active Thyroid-Associated Orbitopathy Detection on Eye Photographs",
    image: "/assets/research/projects/tao-eye-detect-1.png",
    summary:
      "A deep learning–based system for early monitoring and diagnosis of thyroid eye disease before irreversible damage.",
    period: "2021.08 – 2021.12",
  },
  {
    slug: "traffic-cong",
    title: "Prediction of Traffic Congestion Propagation",
    image: "/assets/research/projects/traffic-cong-1.png",
    summary:
      "Modeling and quantifying time-lagged accident-induced congestion using causal inference and bootstrap uncertainty analysis.",
    period: "2021.01 – 2024.02",
  },
  {
    slug: "iitp-bio",
    title:
      "A robust, generalizable foundation model for bioelectrical signals",
    image: "/assets/research/projects/iitp-bio-1.png",
    summary:
      "Developing a foundation model that generalizes across heterogeneous bioelectrical signal domains.",
    period: "2024.10 –",
  },
  {
    slug: "quasar-detect",
    title: "Real-Time Changing-State Quasar Detection",
    image: "/assets/research/projects/quasar-detect-1.png",
    summary:
      "Real-time detection of changing-state quasars using a Mixture Density Network.",
    period: "2021.01 – 2025.12",
  },
  {
    slug: "thyroid-dose",
    title: "Personalized Dose Determination for Thyroid Hormone Disorders",
    image: "/assets/research/projects/thyroid-dose-1.png",
    summary:
      "Optimal, personalized dose determination using deep learning–based survival analysis.",
    period: "2022.01 – 2025.12",
  },
  {
    slug: "scsc-ais-risk",
    title: "Risk-Aware Imitation Learning with Environmental Context for AIS",
    image: "/assets/research/projects/scsc-ais-risk-1.png",
    summary:
      "Imitation-learning anomaly detection for AIS augmented with environmental data so the model separates risky behavior from weather-driven detours.",
    period: "2025.08 –",
  },
  {
    slug: "scsc-fuel-pred",
    title: "Physics-Informed AI for Robust Ship Fuel Consumption Prediction",
    image: "/assets/research/projects/scsc-fuel-est-1.png",
    summary:
      "A ship fuel-consumption prediction model that accounts for environmental factors.",
    period: "2024.03 –",
  },
  {
    slug: "navermap-transport",
    title: "User-Centered Evaluation of Public Transit Route Recommendations",
    image: "/assets/research/projects/none.png",
    summary:
      "Evaluating whether public-transit route recommendations provide practically useful choices for users.",
    period: "2026.03 –",
  },
] as Project[]).sort((a, b) => startKey(b.period) - startKey(a.period));
