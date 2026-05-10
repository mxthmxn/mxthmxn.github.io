---
title: "vector.hyper"
name: "vector.hyper"
date: 2026-05-08
description: "A research VMM for transparent observation of kernel-mode software on commodity x86_64. Cross-vendor (Intel VT-x / AMD SVM)."
status: "private · research"
language: "C++"
---

A research virtual-machine monitor for instrumenting kernel-mode software on commodity x86_64 hardware. Designed around a single question: *how close to bare metal can a VMM keep its guest while still observing it?*

## research focus

- **Vendor-neutral core.** Intel VT-x and AMD SVM bring-up paths reduce to a small abstract interface; everything above (memory introspection, instrumentation) is vendor-agnostic.
- **Observation through second-level translation.** Guest virtual addresses are walked via EPT/NPT — the VMM never dereferences a guest pointer.
- **Exit minimisation as a design axis.** Every additional VM-exit is a measurable perturbation; the architecture is biased toward not trapping.
- **Memory layout invariants.** All host frames are unmapped from the guest's second-level paging structures, eliminating the most common VMM-fingerprinting vector.
- **Per-pCPU coverage.** Each physical CPU maps 1:1 to a virtual CPU; partial coverage would distort thread migration in ways measurable from the guest.

## minimal vendor abstraction

```cpp
struct vendor_ops {
    bool (*supported)() noexcept;
    status_t (*vcpu_init)(vcpu&) noexcept;
    status_t (*vcpu_launch)(vcpu&) noexcept;
    void     (*on_exit)(vcpu&, exit_event&) noexcept;
};
```

A single table — the same VMI and instrumentation layers sit on top of either implementation.

Source is private.
