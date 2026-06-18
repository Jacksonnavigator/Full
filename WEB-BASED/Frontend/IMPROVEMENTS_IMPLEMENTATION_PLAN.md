# MajiScope Improvement Implementation Plan

This document turns the proposed improvements into phased implementation steps. The goal is to improve the dashboard, map experience, analytics, database structure, and operational usefulness of the system without rushing large architectural changes.

## Phase 1: Dashboard And Map Usability Polish

Objective: make the dashboard cleaner, easier to read, and more useful before changing deeper data structures.

### 1. Rename Dashboard Wording

- Replace broad wording such as "National Leak" with clearer system language.
- Preferred wording: "Water Leakage Monitoring".
- Keep labels specific to leakage operations, utilities, DMAs, reports, and resolution performance.

### 2. Improve Right-Side Reported Vs Resolved Graph

- Resize the right graph so it is not squeezed or tiny.
- Reduce unused empty space below the graph.
- Make the graph responsive for different dashboard widths.
- Keep dark theme axis and label colors readable.

### 3. Move Dashboard Header Into Right Column

- Move the introductory dashboard header card to the top-right column.
- Place it above the right graph and keep the same width as the right-side graph card.
- Let the map use the freed top-left space so the map gets more room.

### 4. Improve Map Controls

- Move map controls to the right side of the map.
- Stack controls vertically inside the map.
- Add a small toggle button at the top-right of the map.
- On hover, show a tooltip explaining that the button expands or collapses map controls.
- On click, show or hide the map controls so the map can stay focused and clean.

### 5. Make Boundary Control Zoom-Aware

- The "Show DMA boundaries" or boundary-related button should change meaning based on zoom level.
- At national/far zoom, the control should refer to utility boundaries.
- At medium/close zoom, the control should refer to DMA boundaries.
- When utility boundaries are not yet available, show a graceful disabled or fallback state.

### 6. Remove Confusing Plus Text From Create DMA Button

- Remove the visible "+" text from the Create DMA button.
- Use either a proper icon-only plus or a clean text label such as "Create DMA".
- Avoid mixing a raw plus character with text if users find it confusing.

### 7. Default Admin Map View To Tanzania

- When an admin opens the dashboard, fit the map to Tanzania by default.
- Do not restrict zooming out.
- Users should still be able to zoom to neighboring countries, region, continent, or wider views as currently possible.

## Phase 2: Leakage Type Data Model And Analytics

Objective: make leakage reports more informative and enable better analytics.

### 1. Add Leakage Type To Reports

- Add a `leakage_type` field to the reports data model.
- Default value should be `unknown` so old/mobile submissions do not break.
- Recommended controlled values:
  - `ground_leakage`
  - `pipe_burst`
  - `meter_leakage`
  - `valve_leakage`
  - `overflow`
  - `unknown`

### 2. Update Backend Report Handling

- Allow the backend to receive `leakage_type` during report creation.
- Validate submitted values against the allowed list.
- Store `unknown` if the field is missing.
- Keep API backward-compatible with the current mobile app.

### 3. Prepare Frontend Report Forms

- Add leakage type selection where reports are created or reviewed on the web if applicable.
- Mobile will be updated later, but the backend must be ready first.
- Use radio buttons or a simple controlled selection.

### 4. Add Leakage Type Donut Chart To Dashboard

- Add a donut/pie chart showing leakage type percentages.
- Place it below the right-side "Reported vs resolved" graph on the dashboard.
- Show both percentage and count where practical.
- Include an empty state when no report data is available.

### 5. Add Leakage Type Donut Chart To Analytics Page

- Add the same leakage type distribution chart to the analytics page.
- Respect current filters where applicable.
- Ensure chart labels, tooltips, and legends are readable in dark theme.

## Phase 3: Pipeline Network Performance And Access Rules

Objective: make the pipeline network faster and more operationally correct.

### 1. Optimize Dashboard Pipeline Loading

- Avoid blocking the initial dashboard render with pipeline network loading.
- Lazy-load the pipe network after the map and report markers are ready.
- Cache parsed network data by utility where possible.
- Avoid loading networks that the current user is not allowed to see.

### 2. Improve Network Rendering Performance

- Consider simplified geometry for dashboard display.
- Load detailed pipe geometry only when the user zooms in or interacts with the pipe layer.
- Keep pipe popups working when individual pipes are clicked.
- If file sizes become large, plan for backend spatial filtering or vector tiles.

### 3. Update DMA Manager Network Visibility

- DMA managers should see the full pipeline network for their utility, not only pipes inside their DMA boundary.
- DMA managers must not see pipeline networks from other utilities.
- Utility managers should see their own utility network.
- Admins may see all available utility networks depending on dashboard scope/filter.

### 4. Enforce Access Rules Consistently

- Apply visibility rules in the backend/API layer where possible.
- The frontend should not be the only place enforcing pipeline access.
- Keep user role, utility ID, and DMA ID checks consistent.

## Phase 4: Utility Geometry And Smart Zoom-Based Map Hierarchy

Objective: evolve the dashboard map into a stronger GIS-style operations view.

### 1. Add Utility Spatial Fields

- Add center and boundary data to utilities, similar to DMAs.
- Recommended fields for current architecture:
  - `center_latitude`
  - `center_longitude`
  - `boundary_geojson`
- Long-term spatial database option:
  - `center geometry(Point, 4326)`
  - `boundary geometry(MultiPolygon, 4326)`

### 2. Add Utility Boundary Upload Support

- Reuse the DMA boundary upload approach for utility boundaries.
- Accept supported formats such as GeoPackage and GeoJSON.
- Extract boundary points and calculate center automatically when missing.
- Do not permanently store uploaded files; store only extracted geometry.

### 3. Implement Zoom-Based Map Layers

- Far zoom:
  - Show utility boundaries.
  - Show utility-level report counts.
  - Use different boundary colors per utility.
  - Hide low-level DMA boundary detail.
- Medium zoom:
  - Show selected or visible utility details.
  - Show DMA boundaries within visible utilities.
  - Show DMA-level aggregation.
- Close zoom:
  - Show individual reports.
  - Show DMA boundaries.
  - Show pipeline network where allowed.
  - Enable pipe and report popups.

### 4. Add Utility Boundary Legend And Hover Behavior

- Add a map legend explaining utility colors.
- On hover over a utility boundary, show the utility name and summary.
- Keep the legend compact and collapsible if it takes too much map space.

### 5. Keep Map Performance Under Control

- Do not render every layer at every zoom level.
- Use zoom thresholds to decide which data should be visible.
- Avoid showing all DMA boundaries at national zoom.
- Consider backend bounding-box queries if the frontend becomes slow.

## Recommended Implementation Order

1. Complete Phase 1 for immediate dashboard usability gains.
2. Implement Phase 2 so reports become analytically richer.
3. Implement Phase 3 to improve pipe network performance and access correctness.
4. Implement Phase 4 after utility geometry is designed and database changes are stable.

## Professional Notes

- Phase 1 is mostly frontend and low risk.
- Phase 2 requires database and backend migration care.
- Phase 3 affects permissions and performance, so it must be tested with admin, utility manager, and DMA manager accounts.
- Phase 4 is the largest feature and should be treated as a GIS/map architecture enhancement, not a small UI change.
- Existing light theme should remain the default theme. Dark theme improvements should be added without weakening the current light theme.
