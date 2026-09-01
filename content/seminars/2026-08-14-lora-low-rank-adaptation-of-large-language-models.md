---
date: 2026-08-14
title: LoRA: Low Rank Adaptation of large language models
category: Paper Review
presenter: 조용진
url: https://www.notion.so/3bc046396f7e80318271f0cdd7098a3e
keywords: LLM, Parameter Efficient Fine Tuning, fine tuning
---

Abstract


An important paradigm of natural language processing consists of large-scale pretraining on general domain data and adaptation to particular tasks or domains. As we pre-train larger models, full fine-tuning, which retrains all model parameters, becomes less feasible. Using GPT-3 175B as an example – deploying independent instances of fine-tuned models, each with 175B parameters, is prohibitively expensive. We propose Low-Rank Adaptation, or LoRA, which freezes the pretrained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture, greatly reducing the number of trainable parameters for downstream tasks. Compared to GPT-3 175B fine-tuned with Adam, LoRA can reduce the number of trainable parameters by 10,000 times and the GPU memory requirement by 3 times. LoRA performs on-par or better than finetuning in model quality on RoBERTa, DeBERTa, GPT-2, and GPT-3, despite having fewer trainable parameters, a higher training throughput, and, unlike adapters, no additional inference latency. We also provide an empirical investigation into rank-deficiency in language model adaptation, which sheds light on the efficacy of LoRA. We release a package that facilitates the integration of LoRA with PyTorch models and provide our implementations and model checkpoints for RoBERTa, DeBERTa, and GPT-2 at [https://github.com/microsoft/LoRA](https://github.com/microsoft/LoRA).



[📄 PDF 자료 ↗](https://github.com/UNIST-DA/unist-da.github.io/releases/download/seminar-assets/2026-08-14-lora-low-rank-adaptation-of-large-langua-0.pdf)
