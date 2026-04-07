Live mobile app source map.

Main folders:
- `screens/`: active role-based app screens
- `navigation/`: live navigators only
- `store/`: shared mobile state for auth and task workflow
- `services/`: current backend-driven service layer
- `components/shared/`: reusable UI primitives used by the live app
- `components/`: active app-specific UI pieces such as `TaskCard` and `StatusBadge`
- `hooks/`: active hooks for auth and data queries
- `types/`: mobile task model
- `utils/`: small runtime helpers like location and toasts
- `theme/`: design tokens and styling constants

Archived and unused files live under `mobile-app/archive/legacy`.
