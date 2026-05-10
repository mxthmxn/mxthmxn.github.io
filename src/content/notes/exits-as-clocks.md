---
title: "exits are clocks"
date: 2026-05-09
body: "Every VM-exit is a measurement the guest can make. Designing a transparent VMM is mostly the discipline of refusing to add the ones you do not need — minimisation is not an optimisation, it is the architecture."
---

A short corollary I keep returning to: the trap surface *is* the side-channel surface. An exit you did not add cannot leak residency, branch state, or cache footprint. Architecture biased toward subtraction.
