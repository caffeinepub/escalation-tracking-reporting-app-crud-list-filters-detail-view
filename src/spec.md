# Specification

## Summary
**Goal:** Fix blank/error screens when using Escalation list Actions by ensuring navigation and operations use the backend-provided escalation identifier.

**Planned changes:**
- Update the Escalations list/table Actions (e.g., View/details navigation) to use the real backend escalation ID instead of any UI-generated/index-based identifier.
- Ensure the escalation ID is carried consistently through the frontend data flow and types for list, detail, edit, and delete (including routing params, React Query keys, and mutation inputs).
- Prevent index-based ID usage so ordering/filtering/deletions do not cause Actions to open the wrong escalation.

**User-visible outcome:** From the Escalations Dashboard, clicking Actions/View reliably opens the correct Escalation Detail page for that record, without blank/error screens due to incorrect IDs (and if an escalation truly can’t be loaded, the existing readable error UI is shown).
