'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
// Import statements removed - using direct HTML elements for enterprise styling
import { 
  LOCATIONS, 
  COLORS, 
  ANIMATION, 
  DonationPhase, 
  MapAnimator, 
  MapUtils 
} from '@/lib/donation-tracker-utils'
import { useDonationTracker } from '@/hooks/useDonationTracker'

// Set Mapbox access token with validation
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibW9oc2Vuc2FyaGFuIiwiYSI6ImNtZnliaWFpeTBpdTUyanNieGdydXRjMmUifQ.W14WRrNn17S-bCR6nEK8Yg'

// Debug token loading
console.log('Environment token available:', !!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN)
console.log('Using token:', MAPBOX_TOKEN.substring(0, 10) + '...')

// Validate token format
if (!MAPBOX_TOKEN || !MAPBOX_TOKEN.startsWith('pk.') || MAPBOX_TOKEN.length < 50) {
  console.error('Invalid Mapbox token format. Using fallback token.')
}

mapboxgl.accessToken = MAPBOX_TOKEN

const donationPhases: DonationPhase[] = [
  {
    id: 1,
    title: 'Operational Data Ingestion',
    description: 'Donation record initiated. Awaiting network synchronization and resource validation.',
    status: 'pending',
    progress: 0,
    location: LOCATIONS.CAIRO,
    animationType: 'ingestion',
  },
  {
    id: 2,
    title: 'Resource Allocation Analysis',
    description:
      'Contribution parameters analyzed. Optimal distribution vector calculated and assigned to logistics network.',
    status: 'pending',
    progress: 0,
    location: LOCATIONS.NEW_CAIRO,
    animationType: 'allocation',
  },
  {
    id: 3,
    title: 'Logistics Network Activation',
    description: 'Secure transport protocol activated. Resources in transit to designated operational sector.',
    status: 'pending',
    progress: 0,
    location: LOCATIONS.NEW_CAIRO,
    destination: LOCATIONS.MINYA,
    animationType: 'transport',
  },
  {
    id: 4,
    title: 'Impact Validation & Transmission',
    description:
      'Resources successfully delivered. Impact converted to 8 family support units. Data transmitted back to network.',
    status: 'pending',
    progress: 0,
    location: LOCATIONS.MINYA,
    animationType: 'impact',
    impactMultiplier: 8,
  },
  {
    id: 5,
    title: 'System Normalization & Monitoring',
    description:
      'Operation complete. Network status returned to nominal monitoring state. Awaiting next operational cycle.',
    status: 'pending',
    progress: 0,
    location: LOCATIONS.MINYA,
    animationType: 'normalization',
  },
]

export default function DonationTracker() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const mapAnimator = useRef<MapAnimator | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isPanelExpanded, setIsPanelExpanded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isPhaseTransitioning, setIsPhaseTransitioning] = useState(false)
  const [animationMessage, setAnimationMessage] = useState<string>('')
  const [isCriticalError, setIsCriticalError] = useState(false)
  
  const {
    currentPhase,
    phases,
    advancePhase,
    goToPhase,
    resetJourney,
    getStatusColor
  } = useDonationTracker(donationPhases)

  // Initialize map with proper error handling and cleanup
  const initializeMap = useCallback(() => {
    if (!mapContainer.current || map.current) return

    try {
      // Ensure container has proper dimensions
      const container = mapContainer.current
      if (!container.offsetWidth || !container.offsetHeight) {
        setTimeout(() => initializeMap(), 100)
        return
      }

    map.current = new mapboxgl.Map({
        container: container,
      style: 'mapbox://styles/mapbox/dark-v11',
        center: [31.2357, 30.0444], // Use explicit coordinates instead of LOCATIONS.CAIRO
      zoom: 10,
        attributionControl: false,
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: false
    })

    map.current.addControl(new mapboxgl.AttributionControl({
      compact: true
    }))

    map.current.on('load', () => {
        try {
      setIsMapLoaded(true)
          setMapError(null)
          
          if (map.current && map.current.isStyleLoaded()) {
      mapAnimator.current = new MapAnimator(map.current)
            MapUtils.addLocationMarkers(map.current)
          }
        } catch (err) {
          console.error('Map feature initialization error:', err)
          setMapError('Failed to initialize map features')
        }
      })

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e)
        const errorMessage = e.error?.message || e.error || 'Unknown error'
        
        // Handle specific Mapbox errors
        if (typeof errorMessage === 'string') {
          if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') || errorMessage === 'Ke') {
            setMapError('Mapbox API authentication failed. Using fallback mode.')
            setIsCriticalError(true)
          } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
            setMapError('Network error. Please check your internet connection.')
          } else {
            setMapError(`Map error: ${errorMessage}`)
          }
        } else {
          setMapError('Map initialization failed. Using fallback mode.')
          setIsCriticalError(true)
        }
      })

      map.current.on('sourcedata', (e) => {
        if (e.isSourceLoaded && map.current && !map.current.isStyleLoaded()) {
          // Wait for style to fully load
        }
      })

    } catch (err) {
      console.error('Map initialization error:', err)
      setMapError('Failed to create map instance')
    }
  }, [])

  // Map initialization effect
  useEffect(() => {
    initializeMap()

    return () => {
      if (mapAnimator.current) {
        mapAnimator.current.cleanup()
        mapAnimator.current = null
      }
      if (map.current) {
        map.current.remove()
        map.current = null
      }
      setIsMapLoaded(false)
      setMapError(null)
    }
  }, [])

  // Enhanced map update with sophisticated animations
  const updateMapForPhase = useCallback((phase: DonationPhase) => {
    // If map failed, still update UI but skip map animations
    if (!map.current || !mapAnimator.current || !map.current.isStyleLoaded() || isCriticalError) {
      setIsPhaseTransitioning(true)
      setAnimationMessage(`Processing: ${phase.title}...`)
      
      // Simulate processing time for better UX
      setTimeout(() => {
        setAnimationMessage('')
        setIsPhaseTransitioning(false)
      }, 1500)
      return
    }

    setIsPhaseTransitioning(true)

    // Cleanup existing animations
    mapAnimator.current.cleanup()

    // Validate coordinates before using them
    if (phase.location && Array.isArray(phase.location) && 
        typeof phase.location[0] === 'number' && typeof phase.location[1] === 'number' &&
        !isNaN(phase.location[0]) && !isNaN(phase.location[1])) {
      
      try {
        map.current.flyTo({
          center: phase.location,
          zoom: 12,
          duration: ANIMATION.MAP_FLY_DURATION / 2,
          easing: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        })
      } catch (err) {
        console.error('Map flyTo error:', err)
        setIsPhaseTransitioning(false)
        return
      }
    }

    // Execute phase-specific animation after a brief delay
    setTimeout(() => {
      switch (phase.animationType) {
        case 'ingestion':
          if (phase.location) {
            setAnimationMessage('Initializing network nodes...')
            mapAnimator.current?.animateDonationReceived(
              phase.location,
              () => {
                // If there's a route, show it after donation animation
                if (phase.destination) {
                  setAnimationMessage('Establishing data pathway...')
                  mapAnimator.current?.drawRoute(
                    phase.location!,
                    phase.destination,
                    COLORS.PRIMARY,
                    () => {
                      setAnimationMessage('')
                      setIsPhaseTransitioning(false)
                    }
                  )
                } else {
                  setAnimationMessage('')
                  setIsPhaseTransitioning(false)
                }
              }
            )
          }
          break

        case 'allocation':
          if (phase.location) {
            setAnimationMessage('Optimizing resource allocation...')
            mapAnimator.current?.animateProcessingStage(
              phase.location,
              'allocation',
              () => {
                setAnimationMessage('')
                setIsPhaseTransitioning(false)
              }
            )
          }
          break

        case 'transport':
    if (phase.location && phase.destination) {
            setAnimationMessage('Optimizing transport route...')
            // First draw the route
            mapAnimator.current?.drawRoute(
        phase.location, 
        phase.destination, 
              COLORS.PRIMARY,
        () => {
                // Fit map to show full route
                const bounds = MapUtils.calculateBounds([phase.location!, phase.destination!])
          MapUtils.fitMapToBounds(map.current!, bounds, 120)
          
                // Then animate transport
                setTimeout(() => {
                  setAnimationMessage('Data transfer in progress...')
                  mapAnimator.current?.animateTransport(
                    phase.location!,
                    phase.destination!,
                    'truck',
                    () => {
                      setAnimationMessage('')
                      setIsPhaseTransitioning(false)
                    }
                  )
                }, 800)
              }
            )
          }
          break

        case 'impact':
          if (phase.location) {
            setAnimationMessage('Calculating impact metrics...')
            mapAnimator.current?.animateImpactMultiplication(
              phase.location,
              phase.impactMultiplier || 1,
              () => {
                // Follow with completion if milestone exists
                if (phase.milestone) {
                  setAnimationMessage('Finalizing operation status...')
                  mapAnimator.current?.animateMilestoneCelebration(
                    phase.location!,
                    phase.milestone,
                    () => {
                      setAnimationMessage('')
                      setIsPhaseTransitioning(false)
                    }
                  )
                } else {
                  setAnimationMessage('')
                  setIsPhaseTransitioning(false)
                }
              }
            )
          }
          break

        case 'normalization':
          if (phase.location) {
            setAnimationMessage('System normalization complete.')
            mapAnimator.current?.animateMilestoneCelebration(
              phase.location,
              'System Normalization Complete',
              () => {
                setAnimationMessage('')
                setIsPhaseTransitioning(false)
              }
            )
          }
          break

        default:
          // Fallback to basic animation
          if (phase.location && phase.destination) {
            mapAnimator.current?.drawRoute(
              phase.location,
              phase.destination,
              COLORS.PRIMARY,
              () => {
          setTimeout(() => {
            mapAnimator.current?.animateMarker(
              phase.location!, 
              phase.destination!, 
                    () => setIsPhaseTransitioning(false),
                    COLORS.PRIMARY
            )
          }, 500)
        }
      )
          } else {
          setIsPhaseTransitioning(false)
        }
      }
    }, ANIMATION.MAP_FLY_DURATION / 2 + 200)
  }, [isCriticalError])

  // Update map when phase changes
  useEffect(() => {
    if (map.current && phases[currentPhase] && isMapLoaded) {
      updateMapForPhase(phases[currentPhase])
    }
  }, [currentPhase, phases, isMapLoaded, updateMapForPhase])

  // Initialize with first phase when map loads
  useEffect(() => {
    if (isMapLoaded && phases[currentPhase] && !mapError) {
      updateMapForPhase(phases[currentPhase])
    }
  }, [isMapLoaded, mapError])

  // Enhanced reset journey with map reset
  const handleResetJourney = useCallback(() => {
    resetJourney()
    
    // Reset map view
    if (map.current && isMapLoaded) {
      map.current.flyTo({
        center: LOCATIONS.CAIRO,
        zoom: 10,
        duration: ANIMATION.MAP_FLY_DURATION
      })
    }
  }, [resetJourney, isMapLoaded])

  // Toggle mobile panel expansion
  const togglePanel = useCallback(() => {
    setIsPanelExpanded(prev => !prev)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header - Sleek & Techy */}
      <div className="absolute top-0 left-0 right-0 z-30 p-3 lg:p-4">
        <div className="flex items-center justify-between max-w-full">
          {/* Logo with Live Dot - Top Left */}
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <div className="relative">
              {/* Your Logo - Direct Overlay */}
              <img 
                src="/logo.png" 
                alt="EFB Logo"
                className="w-8 h-8 lg:w-10 lg:h-10 cursor-pointer hover:scale-110 transition-all duration-300"
                onDoubleClick={handleResetJourney}
                title="Double-tap to reset journey"
              />
              {/* Live Green Dot - Next to Logo */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50 border-2 border-black"></div>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-sm lg:text-lg font-bold text-white/95 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent font-mono">EFB</h1>
              <p className="text-xs text-white/70 font-medium font-mono">OPERATIONAL NETWORK</p>
            </div>
          </div>
          
          {/* Mobile Title */}
          <div className="lg:hidden text-center flex-1 min-w-0 px-2">
            <h1 className="text-sm lg:text-base font-bold text-white/95 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent truncate font-mono">EFB NETWORK</h1>
            <p className="text-xs text-white/70 font-medium font-mono">OPERATIONAL STATUS</p>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 transition-all duration-700 ease-in-out">
        {/* Map Container - Hero on Mobile, Side on Desktop */}
        <div className="flex-1 relative min-h-0 md:flex-1">
          <div ref={mapContainer} className="w-full h-full" />
          
          {/* Loading and error overlay */}
          {(!isMapLoaded || mapError) && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="text-center max-w-sm mx-auto p-6">
                {mapError ? (
                  isCriticalError ? (
                    <>
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-black text-lg font-bold">⚠</span>
                      </div>
                      <p className="text-sm text-yellow-300 mb-2 font-mono">FALLBACK MODE ACTIVE</p>
                      <p className="text-xs text-muted-foreground mb-4">{mapError}</p>
                      <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                        <p className="text-xs text-gray-300 font-mono mb-2">SYSTEM STATUS:</p>
                        <p className="text-xs text-green-400 font-mono">✓ Processing Pipeline: ACTIVE</p>
                        <p className="text-xs text-green-400 font-mono">✓ Network Analytics: ACTIVE</p>
                        <p className="text-xs text-yellow-400 font-mono">⚠ Map Visualization: OFFLINE</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-4">Donation tracking continues without map visualization</p>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-destructive-foreground text-xs">!</span>
                      </div>
                      <p className="text-sm text-destructive mb-2">Map Error</p>
                      <p className="text-xs text-muted-foreground">{mapError}</p>
                    </>
                  )
                ) : (
                  <>
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground font-mono">Initializing map systems...</p>
                  </>
                )}
              </div>
            </div>
          )}
          
          {/* Floating Data Tiles - Tablet/Desktop Only */}
          <div className="hidden md:block absolute top-4 right-4 space-y-3">
            {/* Processing Pipeline Tile */}
            <div className="group relative">
              <div className="glass rounded-xl p-3 w-64 cursor-pointer hover:scale-105 transition-all duration-200 ease-out">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white/90 font-mono">PROCESSING PIPELINE</h3>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {phases.map((phase, index) => (
                    <div 
                      key={phase.id} 
                      className="text-center cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-all duration-150 ease-out active:scale-95"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        goToPhase(index);
                      }}
                    >
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className={`w-2 h-2 rounded-full transition-all duration-150 ease-out ${
                          phase.status === 'completed' ? 'bg-green-500 shadow-lg shadow-green-500/50' :
                          phase.status === 'in_progress' ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-white/40'
                        }`} />
                      </div>
                      <div className="text-xs text-white/80 hover:text-white transition-colors duration-150">{phase.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Network Analytics Tile */}
            <div className="group relative">
              <div className="glass rounded-xl p-3 w-64 cursor-pointer hover:scale-105 transition-all duration-200 ease-out">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white/90 font-mono">NETWORK ANALYTICS</h3>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white font-mono">$1.2K</div>
                    <div className="text-xs text-white/60 font-mono">TOTAL</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white font-mono">25</div>
                    <div className="text-xs text-white/60 font-mono">INPUTS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white font-mono">200+</div>
                    <div className="text-xs text-white/60 font-mono">TARGETS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400 font-mono">+15%</div>
                    <div className="text-xs text-white/60 font-mono">EFFICIENCY</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Overlay - Responsive Positioning */}
          <div 
            className={`absolute top-20 left-3 right-3 md:top-16 lg:top-14 xl:top-16 lg:left-6 lg:right-auto lg:max-w-sm bg-black/20 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-white/10 cursor-pointer hover:bg-black/30 transition-all duration-100 hover:scale-[1.02] active:scale-95 z-20 ${isPhaseTransitioning ? 'opacity-75 pointer-events-none' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isPhaseTransitioning) {
              advancePhase();
              }
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(phases[currentPhase]?.status)} ${isPhaseTransitioning ? 'animate-pulse' : ''} shadow-lg`} />
              <span className="text-xs font-medium text-white/90 font-mono">
                {isPhaseTransitioning ? 'PROCESSING' : 'OPERATIONAL'}
              </span>
              {isPhaseTransitioning && animationMessage && (
                <div className="ml-2 px-2 py-1 bg-blue-500/20 rounded border border-blue-500/30">
                  <span className="text-xs font-medium text-blue-200 font-mono">ACTIVE</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h3 className={`text-sm lg:text-base font-semibold leading-tight transition-all duration-100 font-mono ${isPhaseTransitioning ? 'text-blue-200' : 'text-white'}`}>
                {phases[currentPhase]?.title}
              </h3>
              <p className="text-xs lg:text-sm text-white/80 leading-relaxed line-clamp-2 transition-all duration-100">
                {phases[currentPhase]?.description}
              </p>
              {isPhaseTransitioning && phases[currentPhase]?.impactMultiplier && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-gray-800/40 rounded border border-gray-600/30">
                  <span className="text-xs text-gray-300 font-mono">TARGET UNITS:</span>
                  <span className="text-xs font-bold text-green-400 font-mono">
                    {phases[currentPhase]?.impactMultiplier}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-white/60 font-mono">
                {isPhaseTransitioning ? (
                  animationMessage || 'PROCESSING...'
                ) : 'TAP TO EXECUTE'}
              </span>
              <div className="w-4 h-4 bg-white/10 border border-white/20 rounded flex items-center justify-center">
                {isPhaseTransitioning ? (
                  <div className="w-2 h-2 border border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <div className="w-1 h-1 bg-green-400 rounded-full shadow-sm shadow-green-400/50"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Panel - Bottom Collapsible */}
        <div className={`md:hidden w-full bg-black/10 backdrop-blur-md border-t border-white/10 flex flex-col shadow-2xl fixed bottom-0 left-0 right-0 transform translate-y-0 transition-all duration-500 ease-in-out ${isPanelExpanded ? 'h-auto' : 'h-16'}`}>
          {/* Mobile Slide Handle */}
          <div className="flex justify-center py-2 cursor-pointer active:bg-white/5 transition-all duration-200 ease-out" onClick={togglePanel}>
            <div className="w-8 h-1 bg-white/40 rounded-full transition-all duration-200 ease-out hover:bg-white/60"></div>
          </div>
          
          {/* Collapsed State - Just Titles */}
          <div 
            className="p-2 bg-black/20 backdrop-blur-md border-t border-white/10 cursor-pointer active:bg-white/5 transition-all duration-200 ease-out" 
            onClick={togglePanel}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-white/90 font-mono">PROCESSING PIPELINE</h2>
              <h2 className="text-xs font-bold text-white/90 font-mono">NETWORK ANALYTICS</h2>
            </div>
              </div>
          
           <div className={`p-3 flex-1 overflow-y-auto transition-all duration-500 ease-in-out max-h-[45vh] ${isPanelExpanded ? 'block' : 'hidden'}`}>
             {/* Split Layout - Processing Pipeline Left, Analytics Right */}
             <div className="flex gap-3 h-full">
               {/* Left Side - Processing Pipeline */}
               <div className="flex-1 min-w-0">
                 <div className="flex items-center justify-between mb-2">
                   <h2 className="text-sm font-bold text-white/90 font-mono">PROCESSING PIPELINE</h2>
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                 </div>

                 {/* Phases Grid - Match Analytics Style */}
                 <motion.div layout className="space-y-4">
                   {phases.map((phase, index) => (
                     <motion.div
                       key={phase.id}
                       layoutId={`phase-card-${phase.id}`}
                       className={`relative transition-opacity duration-500 ${
                         index > currentPhase ? 'opacity-50' : 'opacity-100'
                       }`}
                       onClick={() => goToPhase(index)}
                     >
                       <div className={`flex items-start gap-4 cursor-pointer`}>
                         <div className="flex items-center justify-center gap-1 mb-1">
                           <div className={`w-2 h-2 rounded-full transition-all duration-150 ease-out ${
                             phase.status === 'completed' ? 'bg-green-500 shadow-lg shadow-green-500/50' :
                             phase.status === 'in_progress' ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-white/40'
                           }`} />
                         </div>
                         <div className="flex-1">
                           <h3 className="font-bold text-sm text-white/90 font-mono">
                             {phase.title}
                           </h3>
                           <AnimatePresence initial={false}>
                             {index === currentPhase && (
                               <motion.p
                                 className="text-xs text-white/70 mt-1 font-mono"
                                 initial={{ opacity: 0 }}
                                 animate={{ opacity: 1 }}
                                 exit={{ opacity: 0 }}
                                 transition={{ duration: 0.5 }}
                               >
                                 {phase.description}
                               </motion.p>
                             )}
                           </AnimatePresence>
                         </div>
                       </div>
                     </motion.div>
                   ))}
                 </motion.div>
               </div>

               {/* Right Side - Network Analytics */}
               <div className="flex-1 min-w-0">
                 <div className="flex items-center justify-between mb-2">
                   <h2 className="text-sm font-bold text-white/90 font-mono">NETWORK ANALYTICS</h2>
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                 </div>

                 {/* Stats Grid - Professional Style */}
                 <div className="grid grid-cols-2 gap-2">
                   <div className="text-center">
                     <div className="text-lg font-bold text-white font-mono">$1.2K</div>
                     <div className="text-xs text-white/60 font-mono">TOTAL</div>
                   </div>
                   <div className="text-center">
                     <div className="text-lg font-bold text-white font-mono">25</div>
                     <div className="text-xs text-white/60 font-mono">INPUTS</div>
                   </div>
                   <div className="text-center">
                     <div className="text-lg font-bold text-white font-mono">200+</div>
                     <div className="text-xs text-white/60 font-mono">TARGETS</div>
                   </div>
                   <div className="text-center">
                     <div className="text-lg font-bold text-green-400 font-mono">+15%</div>
                     <div className="text-xs text-white/60 font-mono">EFFICIENCY</div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}