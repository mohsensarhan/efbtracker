'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './efb-animations.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { 
  LOCATIONS, 
  CAMERA_POSITIONS,
  COLORS, 
  ANIMATION, 
  DonationPhase, 
  AnimationState
} from '@/lib/donation-tracker-utils'

// Ultra-precise Mapbox configuration
const MAPBOX_TOKEN = 'pk.eyJ1IjoibW9oc2Vuc2FyaGFuIiwiYSI6ImNtZnliaWFpeTBpdTUyanNieGdydXRjMmUifQ.W14WRrNn17S-bCR6nEK8Yg'
mapboxgl.accessToken = MAPBOX_TOKEN

// Ultra-precise five-stage journey definition
const donationPhases: DonationPhase[] = [
  {
    id: 1,
    title: 'Operational Data Ingestion',
    description: 'Collection Point',
    status: 'pending',
    progress: 0,
    location: LOCATIONS.MAADI_SARAYAT,
    animationType: 'ingestion',
    operationalText: 'Donation record initiated at Maadi Sarayat residential district. Corporate partner contribution of EGP 2,400 secured.',
    isClickable: true
  },
  {
    id: 2,
    title: 'Resource Allocation Analysis',
    description: 'Processing Center',
    status: 'pending',
    progress: 0,
    location: LOCATIONS.EFB_HQ,
    animationType: 'allocation',
    operationalText: 'Processing at Egyptian Food Bank headquarters, New Cairo. Allocation to Minya feeding program confirmed.',
    isClickable: false
  },
  {
    id: 3,
    title: 'Logistics Network Activation',
    description: 'Regional Hub',
    status: 'pending',
    progress: 0,
    location: LOCATIONS.MINYA_CITY,
    animationType: 'transport',
    operationalText: 'Logistics convoy deployed. Resources in transit via secured corridor to Minya regional hub.',
    isClickable: false
  },
  {
    id: 4,
    title: 'Impact Validation & Transmission',
    description: 'Distribution Point',
    status: 'pending',
    progress: 0,
    location: LOCATIONS.MALLAWI,
    animationType: 'impact',
    operationalText: 'Resources validated at Minya hub. Distribution authorized to Mallawi center and Idmo village.',
    isClickable: false
  },
  {
    id: 5,
    title: 'System Normalization & Monitoring',
    description: 'Family Redemption',
    status: 'pending',
    progress: 0,
    location: LOCATIONS.IDMO_VILLAGE,
    animationType: 'normalization',
    operationalText: 'Impact confirmed. Family 248 in Idmo village has received nutritional allocation. System normalized and monitoring active.',
    isClickable: false
  }
]

const EgyptianFoodBankTracker = memo(function EgyptianFoodBankTracker() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [currentStage, setCurrentStage] = useState(0)
  const [phases, setPhases] = useState(donationPhases)
  const [isMapLoading, setIsMapLoading] = useState(true)
  const [mapError, setMapError] = useState<string | null>(null)
  const [animationState, setAnimationState] = useState<AnimationState>({
    isAnimating: false,
    currentStage: 0,
    activeMarkers: [],
    activePaths: []
  })

  // Initialize map with ultra-precise configuration
  const initializeMap = useCallback(() => {
    if (!mapContainer.current || map.current) return

    try {
      const container = mapContainer.current
      if (!container.offsetWidth || !container.offsetHeight) {
        setTimeout(() => initializeMap(), 100)
        return
      }

    map.current = new mapboxgl.Map({
        container: container,
      style: 'mapbox://styles/mapbox/dark-v11',
        center: CAMERA_POSITIONS.INITIAL.center,
        zoom: CAMERA_POSITIONS.INITIAL.zoom,
        attributionControl: false,
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: false,
        interactive: false // Disable all user interaction
    })

    map.current.addControl(new mapboxgl.AttributionControl({
      compact: true
    }))

    map.current.on('load', () => {
        console.log('Map loaded successfully')
        setIsMapLoading(false)
        setMapError(null)
      })

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e)
        setMapError('Failed to load map. Please refresh the page.')
        setIsMapLoading(false)
      })

    } catch (err) {
      console.error('Map initialization error:', err)
      setMapError('Failed to initialize map. Please refresh the page.')
      setIsMapLoading(false)
    }
  }, [])

  // Map initialization effect
  useEffect(() => {
    initializeMap()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [initializeMap])

  // Stage execution with ultra-precise animations
  const executeStage = useCallback(async (stageIndex: number) => {
    if (animationState.isAnimating || stageIndex > currentStage + 1) return

    const phase = phases[stageIndex]
    if (!phase || !map.current) return

    setAnimationState(prev => ({ ...prev, isAnimating: true }))

    try {
      switch (phase.animationType) {
        case 'ingestion':
          await executeStage1()
          break
        case 'allocation':
          await executeStage2()
          break
        case 'transport':
          await executeStage3()
          break
        case 'impact':
          await executeStage4()
          break
        case 'normalization':
          await executeStage5()
          break
      }

      // Update phase status
      setPhases(prev => prev.map((p, i) => {
        if (i === stageIndex) {
          return { ...p, status: 'completed' as const }
        } else if (i === stageIndex + 1) {
          return { ...p, isClickable: true }
        }
        return p
      }))

      setCurrentStage(stageIndex)

    } catch (error) {
      console.error('Stage execution error:', error)
    } finally {
      setAnimationState(prev => ({ ...prev, isAnimating: false }))
    }
  }, [animationState.isAnimating, currentStage, phases])

  // Stage 1: Operational Data Ingestion
  const executeStage1 = async (): Promise<void> => {
    if (!map.current) return

    // Camera animation to Maadi Sarayat
    await new Promise<void>((resolve) => {
      map.current!.flyTo({
        center: CAMERA_POSITIONS.STAGE_1.center,
        zoom: CAMERA_POSITIONS.STAGE_1.zoom,
        duration: ANIMATION.CAMERA_STAGE_1,
        easing: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      })

      setTimeout(resolve, ANIMATION.CAMERA_STAGE_1)
    })

    // Place green circle marker with pulse animation
    setTimeout(() => {
      createPulsingMarker(LOCATIONS.MAADI_SARAYAT, 'green-circle', COLORS.MARKER_GREEN, 24)
    }, ANIMATION.MARKER_DELAY)
  }

  // Stage 2: Resource Allocation Analysis
  const executeStage2 = async (): Promise<void> => {
    if (!map.current) return

    // Camera animation to frame both locations
    await new Promise<void>((resolve) => {
      map.current!.flyTo({
        center: CAMERA_POSITIONS.STAGE_2.center,
        zoom: CAMERA_POSITIONS.STAGE_2.zoom,
        duration: ANIMATION.CAMERA_STAGE_2,
        easing: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      })

      setTimeout(resolve, ANIMATION.CAMERA_STAGE_2)
    })

    // Draw cyan path with bezier curve
    setTimeout(() => {
      drawBezierPath(LOCATIONS.MAADI_SARAYAT, LOCATIONS.EFB_HQ, COLORS.PATH_CYAN, 3)
    }, ANIMATION.MARKER_DELAY)

    // Place blue square marker with rotation
    setTimeout(() => {
      createRotatingMarker(LOCATIONS.EFB_HQ, 'blue-square', COLORS.MARKER_BLUE, 20)
    }, ANIMATION.MARKER_DELAY + ANIMATION.PATH_DRAW_STAGE_2)
  }

  // Stage 3: Logistics Network Activation
  const executeStage3 = async (): Promise<void> => {
    if (!map.current) return

    // Camera animation to corridor view
    await new Promise<void>((resolve) => {
      map.current!.flyTo({
        center: CAMERA_POSITIONS.STAGE_3.center,
        zoom: CAMERA_POSITIONS.STAGE_3.zoom,
        duration: ANIMATION.CAMERA_STAGE_3,
        easing: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      })

      setTimeout(resolve, ANIMATION.CAMERA_STAGE_3)
    })

    // Create route with waypoints
    const waypoints = [
      LOCATIONS.EFB_HQ,
      [31.2, 29.5] as [number, number],
      [30.95, 29.0] as [number, number],
      LOCATIONS.MINYA_CITY
    ]

    // Animate white marker along route
          setTimeout(() => {
      animateMarkerAlongRoute(waypoints, COLORS.MARKER_WHITE, 16)
    }, ANIMATION.MARKER_DELAY)
  }

  // Stage 4: Impact Validation & Transmission
  const executeStage4 = async (): Promise<void> => {
    if (!map.current) return

    // Camera animation to Minya region
    await new Promise<void>((resolve) => {
      map.current!.flyTo({
        center: CAMERA_POSITIONS.STAGE_4.center,
        zoom: CAMERA_POSITIONS.STAGE_4.zoom,
        duration: ANIMATION.CAMERA_STAGE_4,
        easing: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      })

      setTimeout(resolve, ANIMATION.CAMERA_STAGE_4)
    })

    // Transform marker to amber hexagon
    setTimeout(() => {
      createHexagonMarker(LOCATIONS.MINYA_CITY, 'amber-hexagon', COLORS.MARKER_AMBER, 28)
    }, ANIMATION.MARKER_DELAY)

    // Draw paths to Mallawi and Idmo
    setTimeout(() => {
      drawPath(LOCATIONS.MINYA_CITY, LOCATIONS.MALLAWI, COLORS.PATH_CYAN, 3)
      setTimeout(() => {
        drawPath(LOCATIONS.MALLAWI, LOCATIONS.IDMO_VILLAGE, COLORS.PATH_CYAN, 3)
        createDiamondMarker(LOCATIONS.MALLAWI, 'amber-diamond', COLORS.MARKER_AMBER, 24)
      }, ANIMATION.PATH_DRAW_STAGE_4)
    }, ANIMATION.MARKER_DELAY + ANIMATION.PATH_DRAW_STAGE_4)
  }

  // Stage 5: System Normalization & Monitoring
  const executeStage5 = async (): Promise<void> => {
    // Transition all markers to green
    setTimeout(() => {
      transitionMarkersToGreen()
      transitionPathsToGreen()
      
      // Create final star marker
      setTimeout(() => {
        createStarMarker(LOCATIONS.IDMO_VILLAGE, 'green-star', COLORS.MARKER_STAR, 32)
        createTextOverlay(LOCATIONS.IDMO_VILLAGE, 'Family #248: 20 meals delivered')
      }, ANIMATION.COLOR_TRANSITION)
    }, ANIMATION.MARKER_DELAY)
  }

  // Marker creation functions
  const createPulsingMarker = (location: [number, number], id: string, color: string, size: number) => {
    if (!map.current) return

    const marker = document.createElement('div')
    marker.id = id
    marker.className = 'marker-pulse'
    marker.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 0 4px ${color}33, 0 0 20px ${color}66;
      animation: pulse ${ANIMATION.MARKER_PULSE}ms infinite;
    `

    new mapboxgl.Marker(marker).setLngLat(location).addTo(map.current)
    setAnimationState(prev => ({ ...prev, activeMarkers: [...prev.activeMarkers, id] }))
  }

  const createRotatingMarker = (location: [number, number], id: string, color: string, size: number) => {
    if (!map.current) return

    const marker = document.createElement('div')
    marker.id = id
    marker.className = 'marker-rotate'
    marker.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border: 2px solid white;
      animation: rotate ${ANIMATION.MARKER_ROTATION}ms linear infinite;
    `

    new mapboxgl.Marker(marker).setLngLat(location).addTo(map.current)
    setAnimationState(prev => ({ ...prev, activeMarkers: [...prev.activeMarkers, id] }))
  }

  const createHexagonMarker = (location: [number, number], id: string, color: string, size: number) => {
    if (!map.current) return

    const marker = document.createElement('div')
    marker.id = id
    marker.className = 'marker-hexagon'
    marker.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      border: 2px solid white;
    `

    new mapboxgl.Marker(marker).setLngLat(location).addTo(map.current)
    setAnimationState(prev => ({ ...prev, activeMarkers: [...prev.activeMarkers, id] }))
  }

  const createDiamondMarker = (location: [number, number], id: string, color: string, size: number) => {
    if (!map.current) return

    const marker = document.createElement('div')
    marker.id = id
    marker.className = 'marker-diamond'
    marker.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      transform: rotate(45deg);
      border: 2px solid white;
    `

    new mapboxgl.Marker(marker).setLngLat(location).addTo(map.current)
    setAnimationState(prev => ({ ...prev, activeMarkers: [...prev.activeMarkers, id] }))
  }

  const createStarMarker = (location: [number, number], id: string, color: string, size: number) => {
    if (!map.current) return

    const marker = document.createElement('div')
    marker.id = id
    marker.className = 'marker-star'
    marker.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
      border: 2px solid white;
      animation: scaleIn ${ANIMATION.SCALE_ANIMATION}ms ease-in-out;
    `

    new mapboxgl.Marker(marker).setLngLat(location).addTo(map.current)
    setAnimationState(prev => ({ ...prev, activeMarkers: [...prev.activeMarkers, id] }))
  }

  const createTextOverlay = (location: [number, number], text: string) => {
    if (!map.current) return

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'text-overlay'
    })
      .setLngLat(location)
      .setHTML(`<div style="color: white; font-size: 12px; font-weight: bold;">${text}</div>`)
      .addTo(map.current)
  }

  // Path drawing functions
  const drawPath = (start: [number, number], end: [number, number], color: string, width: number) => {
    if (!map.current) return

    const pathId = `path-${start[0]}-${start[1]}-${end[0]}-${end[1]}`
    
    const route: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [start, end]
      },
      properties: {}
    }

    map.current.addSource(pathId, {
      type: 'geojson',
      data: route
    })

    map.current.addLayer({
      id: pathId,
      type: 'line',
      source: pathId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': color,
        'line-width': width,
        'line-opacity': 0.8
      }
    })

    setAnimationState(prev => ({ ...prev, activePaths: [...prev.activePaths, pathId] }))
  }

  const drawBezierPath = (start: [number, number], end: [number, number], color: string, width: number) => {
    if (!map.current) return

    const controlPoint: [number, number] = [31.35, 30.01]
    const pathId = `bezier-path-${start[0]}-${start[1]}-${end[0]}-${end[1]}`
    
    // Create bezier curve with control point
    const route: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [start, controlPoint, end]
      },
      properties: {}
    }

    map.current.addSource(pathId, {
      type: 'geojson',
      data: route
    })

    map.current.addLayer({
      id: pathId,
      type: 'line',
      source: pathId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': color,
        'line-width': width,
        'line-opacity': 0.8
      }
    })

    setAnimationState(prev => ({ ...prev, activePaths: [...prev.activePaths, pathId] }))
  }

  const animateMarkerAlongRoute = (waypoints: [number, number][], color: string, size: number) => {
    if (!map.current || waypoints.length < 2) return

    const marker = document.createElement('div')
    marker.id = 'traveling-marker'
    marker.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border-radius: 50%;
      border: 2px solid white;
    `

    const mapboxMarker = new mapboxgl.Marker(marker).setLngLat(waypoints[0]).addTo(map.current)

    // Animate along waypoints
    let currentWaypoint = 0
    const animate = () => {
      if (currentWaypoint < waypoints.length - 1) {
        const start = waypoints[currentWaypoint]
        const end = waypoints[currentWaypoint + 1]
        
        // Simple linear interpolation for now
        mapboxMarker.setLngLat(end)
        currentWaypoint++
        
        setTimeout(animate, ANIMATION.MARKER_TRAVEL / waypoints.length)
      }
    }

    setTimeout(animate, ANIMATION.MARKER_DELAY)
  }

  const transitionMarkersToGreen = () => {
    // Implementation for transitioning all markers to green
    console.log('Transitioning markers to green')
  }

  const transitionPathsToGreen = () => {
    // Implementation for transitioning all paths to green
    console.log('Transitioning paths to green')
  }

  // Loading state
  if (isMapLoading) {
    return (
      <div className="fixed inset-0 w-full h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing Egyptian Food Bank Tracking System...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (mapError) {
    return (
      <div className="fixed inset-0 w-full h-full bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-white text-xl font-bold mb-4">System Error</h1>
          <p className="text-gray-300 mb-6">{mapError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      {/* Map Container - Full Viewport */}
      <div 
        ref={mapContainer} 
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="Egyptian Food Bank donation tracking map"
      />

      {/* EFB Logo Panel - Top Left */}
      <div className="absolute top-6 left-6 md:top-24 md:left-24 w-40 md:w-48 z-10">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs md:text-sm">EFB</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-base md:text-lg">EFB</h1>
              <p className="text-gray-400 text-xs uppercase tracking-wider">OPERATIONAL NETWORK</p>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Pipeline Panel - Top Right */}
      <div className="absolute top-6 right-6 md:top-24 md:right-24 w-72 md:w-80 z-10">
        <div 
          className="rounded-lg p-3 md:p-4 border border-white/20"
          style={{ backgroundColor: COLORS.PANEL_BG }}
        >
          <h2 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">PROCESSING PIPELINE</h2>
          <div className="space-y-2" role="list" aria-label="Donation processing stages">
                  {phases.map((phase, index) => (
              <motion.div
                      key={phase.id} 
                role="listitem"
                tabIndex={phase.isClickable ? 0 : -1}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  phase.isClickable 
                    ? 'hover:bg-white/10' 
                    : 'cursor-not-allowed opacity-50'
                }`}
                onClick={() => phase.isClickable && executeStage(index)}
                onKeyDown={(e) => {
                  if (phase.isClickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    executeStage(index)
                  }
                }}
                whileHover={phase.isClickable ? { scale: 1.02 } : {}}
                aria-label={`Stage ${phase.id}: ${phase.title}. ${phase.isClickable ? 'Click to execute' : 'Not available'}`}
              >
                <div 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    phase.status === 'completed' 
                      ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                      : phase.isClickable 
                        ? 'bg-white' 
                        : 'bg-gray-500'
                  }`}
                  style={{
                    animation: phase.status === 'completed' || (index === 0 && phase.isClickable) 
                      ? 'pulse 1s infinite' 
                      : 'none'
                  }}
                />
                <div className="flex-1">
                  <h3 className={`text-sm font-medium ${
                    phase.isClickable ? 'text-white' : 'text-gray-400'
                  }`}>
                    {phase.title}
                  </h3>
                      </div>
              </motion.div>
                  ))}
                </div>
              </div>
            </div>

      {/* Operational Status Panel - Bottom Left */}
      <div className="absolute bottom-6 left-6 md:bottom-24 md:left-24 w-80 md:w-96 z-10">
        <div 
          className="rounded-lg p-3 md:p-4 border border-white/20"
          style={{ backgroundColor: COLORS.PANEL_BG }}
        >
          <h2 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">OPERATIONAL</h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStage}
              className="text-white/80 text-sm leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              role="status"
              aria-live="polite"
              aria-label="Current operational status"
            >
              {phases[currentStage]?.operationalText || phases[0].operationalText}
            </motion.p>
          </AnimatePresence>
            </div>
          </div>
          
      {/* Network Analytics Panel - Bottom Right */}
      <div className="absolute bottom-6 right-6 md:bottom-24 md:right-24 w-56 md:w-60 z-10">
        <div 
          className="rounded-lg p-3 md:p-4 border border-white/20"
          style={{ backgroundColor: COLORS.PANEL_BG }}
        >
          <h2 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">NETWORK ANALYTICS</h2>
          <div className="space-y-3" role="list" aria-label="Network performance metrics">
            <div className="flex justify-between items-center" role="listitem">
              <span className="text-gray-400 text-xs">TOTAL</span>
              <span className="text-white font-bold">$1.2K</span>
            </div>
            <div className="flex justify-between items-center" role="listitem">
              <span className="text-gray-400 text-xs">INPUTS</span>
              <span className="text-white font-bold">25</span>
            </div>
            <div className="flex justify-between items-center" role="listitem">
              <span className="text-gray-400 text-xs">TARGETS</span>
              <span className="text-white font-bold">200+</span>
            </div>
            <div className="flex justify-between items-center" role="listitem">
              <span className="text-gray-400 text-xs">EFFICIENCY</span>
              <span className="text-green-500 font-bold">+15%</span>
              </div>
            </div>
          </div>
        </div>

    </div>
  )
})

export default function EgyptianFoodBankTrackerWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <EgyptianFoodBankTracker />
    </ErrorBoundary>
  )
}
