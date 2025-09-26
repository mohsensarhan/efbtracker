import mapboxgl from 'mapbox-gl'

// Ultra-precise location constants for Egyptian Food Bank tracking
export const LOCATIONS = {
  MAADI_SARAYAT: [31.3169891, 29.9625624] as [number, number],    // Collection Point
  EFB_HQ: [31.40217, 30.00015] as [number, number],              // Processing Center
  MINYA_CITY: [30.74444, 28.1194] as [number, number],           // Regional Hub
  MALLAWI: [30.8418, 27.7314] as [number, number],               // Distribution Point
  IDMO_VILLAGE: [30.6300, 28.4667] as [number, number]           // Family Redemption
}

// Camera positions for precise framing
export const CAMERA_POSITIONS = {
  INITIAL: { center: [29.5, 31.0] as [number, number], zoom: 6.5 },
  STAGE_1: { center: [31.3169891, 29.9625624] as [number, number], zoom: 13 },
  STAGE_2: { center: [31.359, 29.981] as [number, number], zoom: 11.5 },
  STAGE_3: { center: [29.95, 29.5] as [number, number], zoom: 7.8 },
  STAGE_4: { center: [30.79, 27.92] as [number, number], zoom: 10 }
}

// Ultra-precise color palette for Egyptian Food Bank tracking
export const COLORS = {
  STAGE_ACTIVE: '#10b981',      // Green for active/completed stages
  STAGE_INACTIVE: '#6b7280',    // Gray for inactive stages
  STAGE_CLICKABLE: '#ffffff',   // White for clickable stages
  PATH_CYAN: '#00D4FF',         // Cyan for data flow paths
  PATH_GREEN: '#10B981',        // Green for final paths
  MARKER_GREEN: '#10b981',      // Green circle marker
  MARKER_BLUE: '#2563eb',       // Blue square marker
  MARKER_WHITE: '#ffffff',      // White circular marker
  MARKER_AMBER: '#f59e0b',      // Amber hexagon marker
  MARKER_STAR: '#10b981',       // Green star marker
  PANEL_BG: 'rgba(26, 26, 26, 0.9)', // Dark glass morphism
  TEXT_PRIMARY: '#ffffff',      // White text
  TEXT_SECONDARY: '#9ca3af',    // Gray text
  BACKGROUND: '#000000'         // Pure black background
}

// Ultra-precise animation timing constants (milliseconds)
export const ANIMATION = {
  CAMERA_STAGE_1: 2000,         // Camera to Maadi Sarayat
  CAMERA_STAGE_2: 2500,         // Camera to frame Maadi + New Cairo
  CAMERA_STAGE_3: 3000,         // Camera to Cairo-Minya corridor
  CAMERA_STAGE_4: 2000,         // Camera to Minya region
  MARKER_DELAY: 500,            // Delay before marker placement
  MARKER_PULSE: 1000,           // Pulse animation duration
  MARKER_PULSE_PAUSE: 500,      // Pause between pulses
  PATH_DRAW_STAGE_2: 3000,      // Path drawing for stage 2
  PATH_DRAW_STAGE_4: 2000,      // Path drawing for stage 4
  MARKER_ROTATION: 2000,        // Blue marker rotation
  MARKER_TRAVEL: 8000,          // White marker travel time
  TRAIL_SPAWN: 200,             // Trail dot spawn interval
  TRAIL_FADE: 1000,             // Trail dot fade duration
  COLOR_TRANSITION: 1500,       // Color transitions
  SCALE_ANIMATION: 500,         // Scale animations
  FADE_TRANSITION: 1000         // Fade transitions
}

// Ultra-precise type definitions for Egyptian Food Bank tracking
export interface DonationPhase {
  id: number
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  progress: number
  location?: [number, number]
  destination?: [number, number]
  animationType?: 'ingestion' | 'allocation' | 'transport' | 'impact' | 'normalization'
  operationalText: string
  isClickable: boolean
}

// Animation state management
export interface AnimationState {
  isAnimating: boolean
  currentStage: number
  activeMarkers: string[]
  activePaths: string[]
}

// Ultra-precise animation utilities for Egyptian Food Bank tracking
export class MapAnimator {
  private map: mapboxgl.Map
  private animationFrameId: number | null = null
  private activeElements: { id: string; type: 'marker' | 'source' | 'layer' }[] = []

  constructor(map: mapboxgl.Map) {
    this.map = map
  }

  // Coordinate validation helper
  private validateCoordinates(coords: [number, number] | undefined): boolean {
    if (!coords || !Array.isArray(coords) || coords.length !== 2) return false
    const [lng, lat] = coords
    return typeof lng === 'number' && typeof lat === 'number' &&
           !isNaN(lng) && !isNaN(lat) &&
           lng >= -180 && lng <= 180 &&
           lat >= -90 && lat <= 90
  }

  // Professional cleanup - Enterprise grade
  cleanup(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }

    // Remove all active elements
    this.activeElements.forEach(element => {
      try {
        if (element.type === 'layer' && this.map.getLayer(element.id)) {
          this.map.removeLayer(element.id)
        }
        if (element.type === 'source' && this.map.getSource(element.id)) {
          this.map.removeSource(element.id)
        }
      } catch (err) {
        console.warn(`Failed to remove ${element.type}: ${element.id}`, err)
      }
    })

    this.activeElements = []

    // Remove DOM markers
    const markers = document.querySelectorAll('[id^="marker-"], [id^="animated-"], [id^="pulse-"]')
    markers.forEach(marker => marker.remove())

    // Remove custom styles
    const styles = document.querySelectorAll('[id^="animation-"], [id^="pulse-"]')
    styles.forEach(style => style.remove())
  }
}