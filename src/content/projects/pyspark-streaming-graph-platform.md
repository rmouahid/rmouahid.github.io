---
title: 'pyspark-streaming-graph-platform'
summary:
  'Real-time marketplace pipeline: PySpark Structured Streaming with windowed aggregates and a live GraphFrames graph.'
tldr:
  - 'TODO: one measured result (for example events per second processed, or end-to-end latency to the dashboard)'
tags: ['Data']
stack: ['PySpark 3.5', 'Spark Structured Streaming', 'GraphFrames', 'Faker', 'Streamlit', 'PyVis']
featured: false
order: 15
repo: https://github.com/rmouahid/pyspark-streaming-graph-platform
status: active
date: 2026-05-28
---

## Problem

A real-time streaming pipeline that simulates user, seller and product interactions on a marketplace, processes them
with PySpark Structured Streaming and shows them as a dynamic graph built with GraphFrames.

TODO: the question the pipeline answers, and in which course or context it was built.

## Architecture

```mermaid
flowchart LR
    P[Event producer<br/>Faker, one JSON event<br/>every 500 ms] --> F[data/events/*.json]
    F --> S[Spark Structured Streaming<br/>strict schema]
    S --> Q1[q1: sliding window 1 min / 30 s<br/>10 s watermark, update mode]
    Q1 --> T[In-memory table<br/>action_counts]
    S --> Q2[q2: foreachBatch]
    Q2 --> G[GraphFrames<br/>User, Product, Seller vertices,<br/>typed edges]
    G --> C[data/graph_*.csv]
    C --> D[Streamlit + PyVis dashboard<br/>refresh every 5 s]
```

Each event carries a timestamp, user and city, product and category, seller, action type and price. Actions follow a
weighted split: 60 % like, 30 % view, 10 % purchase.

## Technical choices & trade-offs

- **Schema enforcement** on the stream: events are read with a strict Spark schema.
- **Sliding window of 1 minute every 30 s with a 10 s watermark** on event time, in `update` output mode so only changed
  rows are emitted at each trigger.
- **`foreachBatch` to rebuild the graph**: each micro-batch updates GraphFrames vertices (users, products, sellers) and
  typed edges, exported for the dashboard.
- **File source and a simulator** instead of a message broker. TODO: why, and what a production version would use.
- TODO: the alternatives you considered and why you rejected them.

## Results

TODO: measured results (throughput, latency from event to dashboard, graph size over time).

| Metric | Value |
| ------ | ----- |
| TODO   | TODO  |

## Limitations & next steps

TODO: known limitations and next steps.

## Links

- [Source code on GitHub](https://github.com/rmouahid/pyspark-streaming-graph-platform)
