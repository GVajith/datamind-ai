# Frontend page structure

The UI follows the Corporate frontend's screen-oriented organization while keeping DataMind domains isolated.

```text
src/
  config/                  environment and route constants
  network/                 shared Axios client and endpoint catalog
  screens/
    common/                loading, form, navigation, guard components
    components/
      LandingPage/
      Authentication/
      Dashboard/
      Datasets/             Phase 2
      Analysis/             Phase 3+
      Reports/              Phase 5
      Settings/
    containers/Routes/     route components and route constants
    store/                 Redux reducer, actions, session persistence
  utility/                 pure formatting and validation helpers
```

Public routes are `/`, `/sign-in`, `/sign-up`, and `/forgot-password`. Authenticated routes are `/dashboard`, `/datasets`, `/datasets/:id`, `/analysis/:conversationId?`, `/history`, `/reports`, and `/settings`. Admin routes are role-guarded.

Phase 1 implements public authentication screens and the protected dashboard shell. Later pages use the same `AppLayout`, route constants, Redux state, and API helpers.

- Navy `#102A43`, teal `#0D9488`, and light `#F0F4F8` are design tokens.
- Tailwind supplies layout primitives; component CSS handles distinctive behavior.
- The analysis route will be a full-height three-panel workspace on desktop and a single column on mobile.
- Forms expose inline validation, focus states, busy states, and API errors.
- Recharts receives only validated backend chart specifications.
