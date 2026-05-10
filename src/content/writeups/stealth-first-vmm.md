---
title: "transparency as a design axis in research VMMs"
date: 2026-05-08
tag: hypervisor
description: "Engineering observations from a research hypervisor whose only goal is to remain indistinguishable from bare metal under guest measurement."
---

A virtual-machine monitor built for *observing* a guest is held to a different standard than one built for partitioning resources. Correctness alone is insufficient: the guest must, by every measurement available to it, be unable to tell that it is virtualised. That single requirement reorganises the design — not as a feature layered on top, but as the gravity well every other decision orbits.

## the default is "do not trap"

A natural instinct, when adding a feature, is to intercept more events. But each VM-exit is a clock on the wall: residency time, branch-trace state, cache footprint, all measurable from inside. The right question is not *"can this be intercepted?"* but *"what does the interception cost the guest, and is the data worth that cost?"* The honest answer is usually no; the architecture rewards subtraction.

## vendor neutrality is an interface, not a porting effort

Intel VT-x and AMD SVM are different enough that copying one into the other is a slow road to bugs, and similar enough that a thin abstraction — vCPU lifecycle, exit dispatch, memory-virtualisation primitives — lets everything above stay vendor-agnostic.

```cpp
class vmm_core {
public:
    explicit vmm_core(const vendor_ops& v) noexcept : v_{v} {}
    status_t bringup_pcpu(pcpu_id id) noexcept;
private:
    const vendor_ops& v_;
};
```

Once the boundary is right, adding a vendor is a sibling implementation — not an edit to the existing one.

## the guest's pointers are guest-controlled data

A guest pointer is a value the guest can change between the read and the use. Walks through guest paging happen via the host's second-level translation, with coherence checks across two samples — anything else races. Memory the VMM owns is simply absent from the guest's second-level page table; reads return zero, writes drop. There is nothing to fingerprint because there is nothing mapped.

## stealth is a budget

Every CPU exposes timing surfaces — TSC, performance counters, last-branch records, retire timing. Closing all of them at once is impossible; what matters is keeping the budget honest. Each exit accounts for its own residency and reimburses it through the timestamp-counter offset. Every CPUID and MSR response is decided by what bare-metal hardware would have returned. A surface that is *almost* transparent is an obscure measurement away from being a fingerprint.

## what this earns you

A platform on which kernel-mode software can be studied while running against what looks, from the inside, like an ordinary machine. The interesting engineering is not in any single exit handler — it is in the discipline of refusing to add the ones you do not need.
