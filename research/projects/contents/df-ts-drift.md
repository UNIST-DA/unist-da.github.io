---
layout: project
slug: df-ts-drift
permalink: /research/projects/contents/df-ts-drift/
title: Domain-free Time-Series Drift Management
---

중견연구 과제 상세 내용:

## Background
여러 산업 도메인(제조·헬스케어·항만물류·교통·금융)에서 시계열 데이터의 **분포/개념 변화(드리프트)** 로 인해
예측 성능 저하와 운영 리스크가 발생합니다. 도메인별 커스텀 대응은 유지보수 비용이 크고 확장성이 낮습니다.

## Goals
- 다변량 시계열 **드리프트 모니터링/탐지/보정** 핵심 기술 개발
- 다양한 도메인에 공통 적용 가능한 **domain-free 툴킷/플랫폼 SW** 구축
- 실제 데이터 및 시뮬레이터로 **성능·범용성 검증** (제조/헬스케어/물류/교통/금융)

## Methods
- **Monitoring & Detection:** 스트리밍 윈도우 기반 통계 검정, 개념/공변량 드리프트 감지, 적응 임계
- **Robust Learning:** **Neural Differential Equations** 및 강건 전처리로 분포 변화 대응
- **Domain-free Representation:** 표준화 I/O 스키마, 메타데이터 규격, 플러그인형 어댑터
- **Toolkit & Platform:** Python SDK + 웹 대시보드(알림/리포팅/시뮬레이터 연동)

## Deliverables
- 드리프트 모니터링/탐지 알고리즘 **3건**
- **Domain-free 툴킷** 및 **플랫폼 SW/서비스 1건**
- 벤치마크/파일럿 **성능 보고서** 및 공개 SW 릴리스(계획)
- 논문/특허/PoC 대시보드

## Project Info
- **Funding:** NRF(한국연구재단) 중견연구
- **Project No.:** 2710079663
- **PI:** 김성일
- **Period:** 2025-03-01 ~ 2028-02-29
- **Fields:** System Monitoring & Anomaly Detection, Time-Series Representation
