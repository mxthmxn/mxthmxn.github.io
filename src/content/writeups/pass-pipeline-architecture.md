---
title: "binary transformation as a pass pipeline"
date: 2026-04-15
tag: architecture
description: "Notes on building a research toolchain for binary-level transformations as composable, target-gated passes."
---

A toolchain that applies many transformations to a compiled binary — substitution, mixed boolean-arithmetic rewriting, opaque predicates, control-flow flattening, virtualisation, packing — quickly stops being a single program and starts being a pipeline. The interesting design question is what shape the pipeline should take so that adding the next transformation does not require editing the previous ten.

## the pass interface is the contract

A small interface, applied uniformly, does most of the work:

```cpp
class IProtectionPass {
public:
    virtual ~IProtectionPass() = default;
    virtual std::string_view name() const noexcept = 0;
    virtual int priority() const noexcept = 0;
    virtual bool is_applicable(const ProtectionContext&) const = 0;
    virtual Status run(ProtectionContext&) = 0;
};
```

`priority` is the pipeline order. `is_applicable` lets a pass declare its target gates — a Windows PE x64 transform short-circuits cleanly on an ELF input rather than crashing. `run` does its single thing. There is no shared mutable state between passes; everything that crosses a boundary lives on the context.

## ordering is documentation

The order of transformations is the most consequential decision in the pipeline, and the cheapest place to make it visible is the priority numbers themselves. A reader scanning the registry sees the order without having to reconstruct it from comments. When a new pass appears in the middle, the diff is one number — and one new file.

## target gates beat target-aware logic

It is tempting to write a single pass that handles "all targets" with internal branches. That always becomes the file nobody wants to edit. The honest shape is one pass per target family, each gated by a predicate on the context: `is_windows_pe_x64()`, `is_elf()`, `is_arm64()`. Adding ARM64 becomes a new sibling pass, not a third branch in an existing one.

## fail-closed, never silent

A pipeline that quietly skips a failing pass is a pipeline whose output cannot be trusted. Every failure mode — backend crash, timeout, missing tool — surfaces an error and reports a worst-case metric. A `try { ... } catch (...) {}` anywhere is a review blocker. Silent success is the most expensive bug.

## what this earns you

Adding a new transformation is one new file, one registry entry, one set of tests. Ordering is visible at a glance. Target support grows by sibling, not by edit. The architecture stops being something you maintain and starts being something you compose against.
