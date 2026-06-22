# New Follow-Up Implementation Plan

This plan turns the stakeholder follow-up notes in `NEW-FOLLOWUP.md` into implementation phases.

## Phase 1: Dashboard Map Hierarchy

Goal: make the dashboard map show the right geographic layer at the right zoom level.

- Very zoomed out: do not show utility boundaries.
- Tanzania/country level: show utilities as small point markers only.
- Near one utility: show only the focused utility boundary.
- Inside a utility: hide utility boundary and show DMA boundaries/data for that utility.
- Detail level: show report points and infrastructure layers within the active role/scope.
- Keep manual dropdown selections stronger than map-derived scope.
- Keep role limits strict:
  - Admin can use smart geographic exploration.
  - Utility manager stays inside their assigned utility.
  - DMA manager stays inside their assigned DMA.

## Phase 2: Dashboard Scope Controls

Goal: prevent invalid cross-hierarchy selection.

- When admin has `All utilities` selected, disable the DMA selector.
- When admin selects a utility, enable DMA selector and list only that utility's DMAs.
- Utility managers see only their utility's DMA list.
- DMA managers remain locked to their assigned DMA.

## Phase 3: Multiple Utilities Per Region Audit

Goal: ensure region is metadata, not a uniqueness boundary.

- Confirm utility creation/update does not enforce unique `region_name`.
- Confirm report assignment prefers boundary-based matching over region matching.
- If multiple utilities share one region and no reliable boundary match exists, avoid forcing assignment by region alone.

## Phase 4: Utility Center Point UX And Validation

Goal: make utility center point mandatory and correctly explained.

- Keep automatic center calculation from uploaded boundary as a backup.
- Allow users to edit/correct the center point.
- Explain in create/edit UI that the center point represents the primary city or operational center of the utility.
- Require center latitude and longitude on utility create/update.
- Keep the existing label for continuity unless a later design pass renames it.

## Phase 5: Pipeline-Derived Utility Boundary Fallback

Goal: maintain map/report hierarchy when official utility boundaries are missing.

- If saved utility boundary exists, use it.
- If no saved boundary exists but a utility pipe network exists, derive an approximate boundary from pipeline geometry.
- Mark derived boundaries internally as approximate.
- If neither boundary nor pipeline exists, use center point for map focus and allow manual report reassignment.
- Do not present pipeline-derived geometry as an official utility boundary.

## Verification

- TypeScript check.
- Production frontend build.
- Backend syntax checks for edited backend modules.
- Manual dashboard checks:
  - Admin Tanzania view shows utility dots, not utility boundaries.
  - Zoom near one utility shows only that utility boundary.
  - Zoom inside utility switches to DMA boundary/data scope.
  - Admin `All utilities` disables DMA selector.
  - Selecting a utility enables DMA selector for that utility only.
