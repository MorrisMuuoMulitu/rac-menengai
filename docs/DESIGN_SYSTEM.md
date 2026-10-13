# Menengai design system

The revised direction opens with a large cranberry Menengai masthead and a photographic contact sheet. The previous cream, split-panel direction was rejected by the user for insufficient visual impact; its evidence is retained in docs/audit/redesign.

The identity is cranberry (#bd164b) on white. Pale green-grey (#f3f5f0) supports project browsing; forest (#183d2f) marks the Thursday invitation. The footer is deep green (#1c2721). The supplied club logo retains its original proportions and artwork. Photographs are real club assets; no generated people, invented statistics or new emblem.

Barlow Condensed carries the masthead, project names and the Thursday invitation. Manrope carries the home page's conversational headings, prose and controls. Both are locally hosted. Headings vary in scale instead of repeating the same display treatment in every section.

The main gallery and separate planting photograph have independently paced scroll travel. Typography and actions stay stable. Gallery photographs rotate every seven seconds by default. Playback pauses on hover, keyboard focus, hidden tabs and when the gallery is offscreen. Explicit pause and manual selection stop rotation; reduced-motion visitors see a static gallery. The next responsive photograph is prefetched. Mobile uses stacked photographs and keeps the header's Join us action visible. Reduced motion removes travel without hiding content.

Projects use a vertical selector on desktop and compact pressed-state buttons on phones. The selection updates the actual photograph, programme description and route together. The book-club photograph is explicitly identified as a club installation photograph. Dated event records form an asymmetric lead story and smaller companion stories. The membership invitation pairs a real badge-pinning photograph with meeting time, venue and a first-visit link.

Containers have a 1440 px maximum with fluid desktop gutters and 20 px phone gutters. Corners use restrained 5–7 px rounding. Primary buttons have a 52 px minimum height; small and photograph controls have at least 44 px. Keyboard focus and mobile-menu focus management remain intact. All existing public routes, forms, filtering, learning and membership functionality are retained.

Rationale: docs/design/2026-10-13-menengai-second-direction.md. Current hero evidence: docs/audit/hero-autoplay; previous direction evidence: docs/audit/redesign-v2. Browser checks: scripts/verify-redesign.mjs; set OUTPUT_DIR to preserve evidence from each direction separately.

The masthead is slightly shorter and the club introduction and Join us action appear before the photographs, bringing the invitation forward on both desktop and phone.
