---
title: "mxprotector"
name: "mxprotector"
date: 2026-04-02
description: "A research code-protection toolchain for Windows PE x64. Pass-pipeline architecture, C++23, target-gated."
status: "private · research"
language: "C++23"
---

A research toolchain for studying transformations of compiled binaries — substitution, mixed boolean-arithmetic rewriting, control-flow flattening, virtualisation, packing — under a single composable pipeline. Today: Windows PE x64. ELF and ARM64 are roadmap.

## architecture

Every transformation is a `IProtectionPass` and registers itself; ordering is explicit and explicitly documented. New behaviour is a new file plus a registry entry — never an edit to an existing pass. No global state: passes receive a `ProtectionContext` and read target capabilities through it.

```cpp
class IProtectionPass {
public:
    virtual ~IProtectionPass() = default;
    virtual std::string_view name() const noexcept = 0;
    virtual int priority() const noexcept = 0;       // pipeline order
    virtual bool is_applicable(const ProtectionContext&) const = 0;
    virtual Status run(ProtectionContext&) = 0;
};
```

## research stance

- **OCP-first.** Pipeline ordering and registry are append-only; passes never reach inside one another.
- **Target-gated.** Each pass declares the targets it supports (`ctx.target().is_windows_pe_x64()`); non-applicable inputs short-circuit cleanly rather than crash.
- **No monolithic files.** Hard caps per file and per function; growth means a new sibling, not a longer file.
- **Tests mandatory.** Every pass ships with unit tests; backend-coupled paths are mocked. Fail-closed semantics are tested explicitly.
- **Fail-closed.** A backend timeout or missing tool raises an error and surfaces a worst-case metric — never a silent pass.

## scope

In-scope: studying composition and ordering of binary-level transformations on PE x64. Out of scope: any deployment outside research; the toolchain exists to measure transformation behaviour, not to ship binaries.

Source is private.
