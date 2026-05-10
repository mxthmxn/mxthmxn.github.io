---
title: "fail-closed beats fail-quiet"
date: 2026-05-02
body: "A pipeline that silently skips a failing stage produces output that no measurement can trust. The cheapest place to spend on engineering is the error surface — every failure must be visible, and the metric it reports must be the worst case, not the absence."
---

`try { ... } catch (...) {}` is the most expensive line in a research toolchain. It converts a measurable failure into an unmeasurable one. The discipline is small: if a stage cannot do its job, say so loudly and report a worst-case number.
