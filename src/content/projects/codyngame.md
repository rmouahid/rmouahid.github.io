---
title: 'CodYngame'
summary:
  'Desktop coding-exercise platform: write, compile and run code in 5 languages in a Docker sandbox, with automated
  checks.'
tldr:
  - 'TODO: one measured result (for example sandbox run time per submission, or test count)'
tags: ['Java']
stack: ['Java 21', 'JavaFX', 'MySQL', 'Maven', 'Docker', 'H2 (tests)']
featured: false
order: 20
repo: https://github.com/rmouahid/CodYngame
status: active
date: 2025-04-15
---

## Problem

A desktop coding-exercise platform inspired by CodinGame: users sign up, pick an exercise and a language, write their
solution in an editor, and get it compiled, run and checked against expected outputs. Scores and submission statistics
are tracked per user.

School project at CY Tech (group G18). TODO: your own part in the group.

## Architecture

```mermaid
flowchart LR
    U[JavaFX views<br/>FXML + CSS] --> C[Controllers<br/>login, exercise,<br/>dashboard, profile]
    C --> M[Model + DAOs<br/>User, Exercise,<br/>Submission]
    M --> DB[(MySQL)]
    C --> X[Code merging<br/>and execution]
    X --> S[Docker sandbox<br/>no network, read-only FS,<br/>CPU, memory, process limits]
    S --> R[Outputs compared<br/>with expected results]
    R --> M
```

- Exercises in five languages: Python, Java, C, JavaScript and PHP. Toolchains live in the sandbox image, not on the
  host.
- "Include" exercises: the user writes a function that is merged into base code and run against generated tests.
- Dashboard with score and submission history.

## Technical choices & trade-offs

- **Every submission runs in a throw-away Docker container** with no network, a read-only filesystem and CPU, memory and
  process limits. Without Docker the app refuses to run submissions rather than running untrusted code on the host.
- **Passwords hashed with salted PBKDF2.**
- **No hard-coded credentials**: database settings come from a git-ignored file, environment variables or JVM
  properties.
- **DAO tests against H2 in MySQL mode**, so the suite runs without a MySQL server; sandbox integration tests run real
  programs when the image is present.
- TODO: the alternatives you considered and why you rejected them.

## Results

TODO: measured results (for example submissions run, sandbox overhead, test count and coverage).

| Metric | Value |
| ------ | ----- |
| TODO   | TODO  |

## Limitations & next steps

TODO: known limitations and next steps.

## Links

- [Source code on GitHub](https://github.com/rmouahid/CodYngame)
- [Sandbox design](https://github.com/rmouahid/CodYngame/blob/main/sandbox/README.md)
- [Specification and project report](https://github.com/rmouahid/CodYngame/tree/main/doc)
