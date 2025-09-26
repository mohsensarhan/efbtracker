# Egyptian Food Bank Donor Tracking Platform - Ultra-Precise Build Specification

## Journey Stages

1. **Collection**: Maadi Sarayat [31.3169891, 29.9625624]
2. **Processing**: EFB HQ New Cairo [31.40217, 30.00015]  
3. **Regional Hub**: Minya City [30.74444, 28.1194]
4. **Distribution**: Mallawi [30.8418, 27.7314]
5. **Redemption**: Idmo Village [30.6300, 28.4667]

## Animation Sequence

### Initial State
- Map centered at [29.5, 31.0] with zoom level 6.5
- All paths hidden
- Only Stage 1 dot is green and pulsing
- Stages 2-5 dots are gray and inactive

### Stage 1: "Operational Data Ingestion"
- **Camera Animation**: 2000ms ease-in-out to Maadi Sarayat [31.3169891, 29.9625624] at zoom 13
- **Marker Placement**: 500ms delay, then green circle marker (24px diameter)
- **Marker Animation**: Infinite pulse (scale 1.0 to 1.2, 1000ms duration, 500ms pause)
- **Panel Text**: "Donation record initiated at Maadi Sarayat residential district. Corporate partner contribution of EGP 2,400 secured."
- **Stage Transition**: Stage 1 stays green, Stage 2 becomes clickable (gray to white)

### Stage 2: "Resource Allocation Analysis"
- **Camera Animation**: 2500ms ease-in-out to frame both Maadi and New Cairo (center: [31.359, 29.981], zoom: 11.5)
- **Path Drawing**: 500ms delay, then cyan path (#00D4FF, 3px width) from Maadi to EFB HQ
- **Path Animation**: Bezier curve with control point [31.35, 30.01], 3000ms linear stroke-dasharray
- **Marker Animation**: Blue square marker (20px) at EFB HQ with 360° rotation over 2000ms (looping)
- **Panel Text**: "Processing at Egyptian Food Bank headquarters, New Cairo. Allocation to Minya feeding program confirmed."
- **Stage Transition**: Stage 2 turns green, Stage 3 becomes clickable

### Stage 3: "Logistics Network Activation"
- **Camera Animation**: 3000ms ease-in-out to Cairo-to-Minya corridor (center: [29.95, 29.5], zoom: 7.8)
- **Route Waypoints**: 
  - Start: [31.40217, 30.00015]
  - Waypoint 1: [31.2, 29.5]
  - Waypoint 2: [30.95, 29.0]
  - End: [30.74444, 28.1194]
- **Marker Movement**: White circular marker (16px) travels 8000ms with quadratic easing
- **Trail Effect**: Spawn dot every 200ms (max 5 dots, fade out over 1000ms)
- **Distance Counter**: "245 km" to "0 km" synchronized with movement
- **Panel Text**: "Logistics convoy deployed. Resources in transit via secured corridor to Minya regional hub."
- **Stage Transition**: Stage 3 turns green, Stage 4 becomes clickable

### Stage 4: "Impact Validation & Transmission"
- **Camera Animation**: 2000ms ease-in-out to Minya region (center: [30.79, 27.92], zoom: 10)
- **Marker Transformation**: Traveling marker becomes amber hexagon (28px) with fade transition
- **Path Drawing**: 
  - Minya to Mallawi: 2000ms linear
  - Mallawi to Idmo: 2000ms with slight curve
- **Panel Text**: "Resources validated at Minya hub. Distribution authorized to Mallawi center and Idmo village."
- **Stage Transition**: Stage 4 turns green, Stage 5 becomes clickable

### Stage 5: "System Normalization & Monitoring"
- **Marker Transition**: All amber markers to green over 1500ms linear
- **Path Transition**: All cyan paths to green (#10B981) over 1500ms linear
- **Final Marker**: Green star marker (32px) at Idmo with scale animation (0 to 1, 500ms ease-in-out)
- **Text Overlay**: "Family #248: 20 meals delivered" at Idmo
- **Panel Text**: "Impact confirmed. Family 248 in Idmo village has received nutritional allocation. System normalized and monitoring active."
- **Final State**: All 5 stage dots green with gentle continuous pulse

## Critical Implementation Rules

1. **Map Interaction**: Never allow user interaction (no zoom, pan, or click on map)
2. **Clickable Elements**: Only stage dots in Processing Pipeline panel
3. **Sequential Completion**: Stages must be completed in order - cannot skip ahead
4. **Coordinate Precision**: All coordinates exactly as specified - no rounding
5. **Animation Timing**: Every timing exactly as specified in milliseconds
6. **No Scrolling**: Interface never scrolls under any circumstances
7. **Global Lock**: Use isAnimating flag to prevent overlapping animations

## Animation Timing Specifications

- **Camera movements**: ease-in-out
- **Path drawing**: linear
- **Marker appearances**: ease-out
- **Color transitions**: linear
- **Scale animations**: ease-in-out

## Panel Positioning (Exactly as Reference)

- **Top Left**: EFB logo panel (6rem from top, 6rem from left, 200px wide)
- **Top Right**: Processing Pipeline panel (6rem from top, 6rem from right, 320px wide)
- **Bottom Left**: Operational status panel (6rem from bottom, 6rem from left, 400px wide)
- **Bottom Right**: Network Analytics panel (6rem from bottom, 6rem from right, 240px wide)

## Viewport Specifications

- **Dimensions**: Exactly 100vh tall and 100vw wide
- **Overflow**: hidden
- **Background**: Pure black (#000000)
- **Map Coverage**: Entire viewport
- **Mapbox Token**: pk.eyJ1IjoibW9oc2Vuc2FyaGFuIiwiYSI6ImNtZnliaWFpeTBpdTUyanNieGdydXRjMmUifQ.W14WRrNn17S-bCR6nEK8Yg
- **Map Style**: mapbox://styles/mapbox/dark-v11
