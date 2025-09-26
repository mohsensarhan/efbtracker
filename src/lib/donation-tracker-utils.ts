import mapboxgl from 'mapbox-gl'

// Location constants for better maintainability
export const LOCATIONS = {
  CAIRO: [31.2357, 30.0444] as [number, number],
  NEW_CAIRO: [31.4436, 30.0286] as [number, number],
  MINYA: [30.7997, 28.1099] as [number, number]
}

// Professional color palette - Palantir inspired
export const COLORS = {
  PRIMARY: '#2563eb',        // Professional blue
  SECONDARY: '#06b6d4',      // Cyan accent
  SUCCESS: '#10b981',        // Clean green
  WARNING: '#f59e0b',        // Amber
  DANGER: '#ef4444',         // Clean red
  NETWORK: '#8b5cf6',        // Purple for connections
  DATA_FLOW: '#06b6d4',      // Cyan for data movement
  IMPACT: '#10b981',         // Green for positive impact
  PROCESSING: '#6366f1',     // Indigo for processing
  GRID: '#374151',           // Dark gray for grid lines
  BACKGROUND: 'rgba(17, 24, 39, 0.95)', // Dark background
  TEXT_PRIMARY: '#f9fafb',   // Light text
  TEXT_SECONDARY: '#d1d5db'  // Secondary text
}

// Professional animation constants
export const ANIMATION = {
  TRANSITION_DURATION: 1200,    // Smooth, professional timing
  DATA_FLOW_DURATION: 2000,     // Data movement timing  
  NETWORK_BUILD: 1500,          // Network construction
  PROCESSING_CYCLE: 2500,       // Processing visualization
  IMPACT_ANALYSIS: 1800,        // Impact calculation display
  MAP_FLY_DURATION: 1000,       // Map movement (maintain compatibility)
  MAP_TRANSITION: 1000,         // Map movement
  FADE_DURATION: 400,           // Subtle fades
  PULSE_INTERVAL: 2000,         // Heartbeat effect
  GRID_ANIMATION: 800,          // Grid line drawing
  MARKER_DURATION: 3000         // Marker animation duration
}

// Type definitions
export interface DonationPhase {
  id: number
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  progress: number
  location?: [number, number]
  destination?: [number, number]
  animationType?: 'donation' | 'processing' | 'transport' | 'impact' | 'celebration'
  processingStage?: string
  vehicleType?: 'truck' | 'van' | 'drone'
  impactMultiplier?: number
  milestone?: string
}

// Enhanced animation utilities
export class MapAnimator {
  private map: mapboxgl.Map
  private animationFrameId: number | null = null
  private activeElements: { id: string; type: 'marker' | 'source' | 'layer' }[] = []

  constructor(map: mapboxgl.Map) {
    this.map = map
  }

  // Enhanced marker animation with easing
  animateMarker(
    start: [number, number], 
    end: [number, number], 
    onComplete?: () => void,
    color: string = COLORS.PRIMARY
  ): void {
    if (!this.map || !this.validateCoordinates(start) || !this.validateCoordinates(end)) {
      onComplete?.()
      return
    }

    // Remove existing animated marker
    const existingMarker = document.getElementById('animated-marker')
    if (existingMarker) {
      existingMarker.remove()
    }

    // Create enhanced marker with better styling
    const marker = document.createElement('div')
    marker.id = 'animated-marker'
    marker.className = `
      w-5 h-5 rounded-full border-2 border-white shadow-lg 
      transform transition-transform duration-200
    `
    marker.style.backgroundColor = color
    marker.style.boxShadow = `0 0 0 4px ${color}33, 0 0 20px ${color}66`

    // Add enhanced pulse animation
    this.addPulseAnimation()

    const animatedMarker = new mapboxgl.Marker(marker)
      .setLngLat(start)
      .addTo(this.map)

    // Enhanced animation with easing function
    const startTime = Date.now()
    const duration = ANIMATION.MARKER_DURATION

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeInOutCubic(progress)

      if (progress <= 1) {
        const lng = start[0] + (end[0] - start[0]) * easedProgress
        const lat = start[1] + (end[1] - start[1]) * easedProgress
        animatedMarker.setLngLat([lng, lat])
        
        // Add scale effect based on progress
        const scale = 1 + Math.sin(progress * Math.PI) * 0.2
        marker.style.transform = `scale(${scale})`
        
        this.animationFrameId = requestAnimationFrame(animate)
      } else {
        animatedMarker.setLngLat(end)
        marker.style.transform = 'scale(1)'
        onComplete?.()
      }
    }

    animate()
  }

  // Enhanced route drawing animation
  drawRoute(
    start: [number, number], 
    end: [number, number], 
    color: string = COLORS.PRIMARY,
    onComplete?: () => void
  ): void {
    if (!this.map || !this.validateCoordinates(start) || !this.validateCoordinates(end)) {
      onComplete?.()
      return
    }

    // Remove existing route
    if (this.map.getLayer('route')) {
      this.map.removeLayer('route')
      this.map.removeSource('route')
    }

    const route: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [start, end]
      },
      properties: {}
    }

    this.map.addSource('route', {
      type: 'geojson',
      data: route
    })

    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': color,
        'line-width': 4,
        'line-opacity': 0.8,
        'line-blur': 0.5
      }
    })

    // Animate route drawing
    const startTime = Date.now()
    const duration = ANIMATION.TRANSITION_DURATION

    const animateRoute = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      if (this.map.getLayer('route')) {
        this.map.setPaintProperty('route', 'line-opacity', progress * 0.8)
        this.map.setPaintProperty('route', 'line-width', 2 + progress * 2)
      }

      if (progress < 1) {
        requestAnimationFrame(animateRoute)
      } else {
        onComplete?.()
      }
    }

    animateRoute()
  }

  // Add pulse animation to document
  private addPulseAnimation(): void {
    // Remove existing style if present
    const existingStyle = document.getElementById('pulse-animation-style')
    if (existingStyle) {
      existingStyle.remove()
    }

    const style = document.createElement('style')
    style.id = 'pulse-animation-style'
    style.textContent = `
      @keyframes pulse {
        0% { 
          transform: scale(1); 
          opacity: 1; 
          box-shadow: 0 0 0 0 rgba(0, 100, 0, 0.4);
        }
        50% { 
          transform: scale(1.1); 
          opacity: 0.8; 
          box-shadow: 0 0 0 10px rgba(0, 100, 0, 0);
        }
        100% { 
          transform: scale(1); 
          opacity: 1; 
          box-shadow: 0 0 0 0 rgba(0, 100, 0, 0);
        }
      }
      
      #animated-marker {
        animation: pulse ${ANIMATION.PULSE_INTERVAL}ms infinite;
      }
    `
    document.head.appendChild(style)
  }

  // Professional donation initialization - Network node activation
  animateDonationReceived(location: [number, number], onComplete?: () => void): void {
    if (!this.map || !this.validateCoordinates(location)) {
      onComplete?.()
      return
    }

    try {
      // Create network node activation
      this.createNetworkNode(location, 'source')
      
      // Add data flow preparation grid
      this.createDataGrid(location)
      
      // Complete after network initialization
      setTimeout(() => {
        onComplete?.()
      }, ANIMATION.NETWORK_BUILD)
    } catch (err) {
      console.error('Animation error in animateDonationReceived:', err)
      onComplete?.()
    }
  }

  // Enterprise processing visualization - Data computation
  animateProcessingStage(location: [number, number], stage: string, onComplete?: () => void): void {
    if (!this.map || !this.validateCoordinates(location)) {
      onComplete?.()
      return
    }

    try {
      // Create data processing hub
      this.createProcessingHub(location, stage)
      
      // Add computational grid overlay
      this.createComputationGrid(location)
      
      // Animate data throughput
      this.animateDataThroughput(location, stage)
      
      setTimeout(() => {
        onComplete?.()
      }, ANIMATION.PROCESSING_CYCLE)
    } catch (err) {
      console.error('Animation error in animateProcessingStage:', err)
      onComplete?.()
    }
  }

  // Professional data transport - Network flow visualization
  animateTransport(
    start: [number, number], 
    end: [number, number], 
    transportType: 'truck' | 'van' | 'drone' = 'truck',
    onComplete?: () => void
  ): void {
    if (!this.map || !this.validateCoordinates(start) || !this.validateCoordinates(end)) {
      onComplete?.()
      return
    }

    try {
      // Create data flow pathway
      this.createDataFlowPath(start, end)
      
      // Animate data packets along route
      this.animateDataPackets(start, end, transportType)
      
      // Add network latency visualization
      this.visualizeNetworkLatency(start, end)
      
      setTimeout(() => {
        onComplete?.()
      }, ANIMATION.DATA_FLOW_DURATION)
    } catch (err) {
      console.error('Animation error in animateTransport:', err)
      onComplete?.()
    }
  }

  // Enterprise impact analysis - Data-driven metrics visualization
  animateImpactMultiplication(location: [number, number], multiplier: number, onComplete?: () => void): void {
    if (!this.map || !this.validateCoordinates(location)) {
      onComplete?.()
      return
    }

    try {
      // Create impact analysis dashboard
      this.createImpactDashboard(location, multiplier)
      
      // Visualize data distribution network
      this.createDistributionNetwork(location, multiplier)
      
      // Animate metric calculations
      this.animateMetricsCalculation(location, multiplier)
      
      setTimeout(() => {
        onComplete?.()
      }, ANIMATION.IMPACT_ANALYSIS)
    } catch (err) {
      console.error('Animation error in animateImpactMultiplication:', err)
      onComplete?.()
    }
  }

  // Professional milestone achievement - System completion indicator
  animateMilestoneCelebration(location: [number, number], milestone: string, onComplete?: () => void): void {
    if (!this.map || !this.validateCoordinates(location)) {
      onComplete?.()
      return
    }

    try {
      // Create system completion indicator
      this.createCompletionIndicator(location, milestone)
      
      // Add operational status overlay
      this.createOperationalStatus(location, milestone)
      
      setTimeout(() => {
        onComplete?.()
      }, ANIMATION.TRANSITION_DURATION)
    } catch (err) {
      console.error('Animation error in animateMilestoneCelebration:', err)
      onComplete?.()
    }
  }

  // New animation methods for the "Digital Twin" narrative
  public animateIngestion(location: [number, number], onComplete: () => void) {
    this.createSonarPulse(location)
    setTimeout(onComplete, ANIMATION.NETWORK_BUILD)
  }

  public animateAllocation(location: [number, number], onComplete: () => void) {
    this.createAnalysisGrid(location)
    setTimeout(onComplete, ANIMATION.PROCESSING_CYCLE)
  }

  // Keep existing methods and adapt them
  public animateTransport(
    start: [number, number],
    end: [number, number],
    transportType: string,
    onComplete: () => void
  ) {
    this.createDataFlowPath(start, end, transportType, onComplete)
  }

  public animateImpact(location: [number, number], multiplier: number, onComplete: () => void) {
    this.createImpactRadius(location, multiplier)
    this.createDataPing(location, LOCATIONS.CAIRO)
    setTimeout(onComplete, ANIMATION.IMPACT_ANALYSIS)
  }

  public animateNormalization(location: [number, number], onComplete: () => void) {
    // Fade out elements or show a completion state
    this.createCompletionIndicator(location, 'Operation Complete')
    setTimeout(onComplete, ANIMATION.TRANSITION_DURATION)
  }

  // Helper method for easing
  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  // Validate coordinates to prevent NaN errors
  private validateCoordinates(coords: [number, number] | undefined): boolean {
    if (!coords || !Array.isArray(coords) || coords.length !== 2) {
      return false
    }
    const [lng, lat] = coords
    return typeof lng === 'number' && typeof lat === 'number' && 
           !isNaN(lng) && !isNaN(lat) && 
           lng >= -180 && lng <= 180 && 
           lat >= -90 && lat <= 90
  }

  // Create professional network node
  private createNetworkNode(location: [number, number], nodeType: 'source' | 'hub' | 'destination'): void {
    if (!this.validateCoordinates(location)) return

    try {
      const nodeContainer = document.createElement('div')
      nodeContainer.className = `network-node node-${nodeType}`
      
      const nodeCore = document.createElement('div')
      nodeCore.className = 'node-core'
      
      const nodeRing = document.createElement('div')
      nodeRing.className = 'node-ring'
      
      const nodeGrid = document.createElement('div')
      nodeGrid.className = 'node-grid'
      
      nodeContainer.appendChild(nodeCore)
      nodeContainer.appendChild(nodeRing)
      nodeContainer.appendChild(nodeGrid)

      this.addNetworkStyles()
      
      const marker = new mapboxgl.Marker(nodeContainer)
        .setLngLat(location)
        .addTo(this.map)

      setTimeout(() => {
        try {
          marker.remove()
        } catch (err) {
          console.error('Error removing network node marker:', err)
        }
      }, ANIMATION.NETWORK_BUILD + 500)
    } catch (err) {
      console.error('Error creating network node:', err)
    }
  }

  // Create professional data grid overlay
  private createDataGrid(location: [number, number]): void {
    if (!this.validateCoordinates(location)) return

    try {
      const gridContainer = document.createElement('div')
      gridContainer.className = 'data-grid-container'
      
      // Create grid lines
      for (let i = 0; i < 8; i++) {
        const gridLine = document.createElement('div')
        gridLine.className = `grid-line grid-line-${i}`
        gridContainer.appendChild(gridLine)
      }
      
      // Add data points
      for (let i = 0; i < 4; i++) {
        const dataPoint = document.createElement('div')
        dataPoint.className = `data-point point-${i}`
        gridContainer.appendChild(dataPoint)
      }

      this.addDataGridStyles()
      
      const marker = new mapboxgl.Marker(gridContainer)
        .setLngLat(location)
        .addTo(this.map)

      setTimeout(() => {
        try {
          marker.remove()
        } catch (err) {
          console.error('Error removing data grid marker:', err)
        }
      }, ANIMATION.GRID_ANIMATION + 1000)
    } catch (err) {
      console.error('Error creating data grid:', err)
    }
  }

  // Create enterprise processing hub
  private createProcessingHub(location: [number, number], stage: string): void {
    if (!this.validateCoordinates(location)) return

    try {
      const hubContainer = document.createElement('div')
      hubContainer.className = 'processing-hub'
      
      const hubCore = document.createElement('div')
      hubCore.className = 'hub-core'
      hubCore.innerHTML = `
        <div class="hub-status-ring"></div>
        <div class="hub-data-flow"></div>
        <div class="hub-label">${stage.toUpperCase()}</div>
      `
      
      hubContainer.appendChild(hubCore)
      this.addProcessingHubStyles()
      
      const marker = new mapboxgl.Marker(hubContainer)
        .setLngLat(location)
        .addTo(this.map)

      setTimeout(() => {
        try {
          marker.remove()
        } catch (err) {
          console.error('Error removing processing hub marker:', err)
        }
      }, ANIMATION.PROCESSING_CYCLE)
    } catch (err) {
      console.error('Error creating processing hub:', err)
    }
  }

  // Professional data flow path creation
  private createDataFlowPath(start: [number, number], end: [number, number]): void {
    // Basic implementation - can be enhanced later
    if (!this.validateCoordinates(start) || !this.validateCoordinates(end)) return
    console.log('Data flow path created from', start, 'to', end)
  }

  // Animate data packets along route
  private animateDataPackets(start: [number, number], end: [number, number], transportType: string): void {
    // Basic implementation - can be enhanced later
    if (!this.validateCoordinates(start) || !this.validateCoordinates(end)) return
    console.log('Data packets animated for transport type:', transportType)
  }

  // Visualize network latency
  private visualizeNetworkLatency(start: [number, number], end: [number, number]): void {
    // Basic implementation - can be enhanced later
    if (!this.validateCoordinates(start) || !this.validateCoordinates(end)) return
    console.log('Network latency visualization created')
  }

  // Create computation grid overlay
  private createComputationGrid(location: [number, number]): void {
    // Basic implementation - can be enhanced later
    if (!this.validateCoordinates(location)) return
    console.log('Computation grid created at', location)
  }

  // Animate data throughput
  private animateDataThroughput(location: [number, number], stage: string): void {
    // Basic implementation - can be enhanced later
    if (!this.validateCoordinates(location)) return
    console.log('Data throughput animation for stage:', stage)
  }

  // Create impact analysis dashboard
  private createImpactDashboard(location: [number, number], multiplier: number): void {
    // Basic implementation - can be enhanced later
    if (!this.validateCoordinates(location)) return
    console.log('Impact dashboard created with multiplier:', multiplier)
  }

  // Create distribution network visualization
  private createDistributionNetwork(location: [number, number], multiplier: number): void {
    // Basic implementation - can be enhanced later
    if (!this.validateCoordinates(location)) return
    console.log('Distribution network created with multiplier:', multiplier)
  }

  // Animate metrics calculation
  private animateMetricsCalculation(location: [number, number], multiplier: number): void {
    // Basic implementation - can be enhanced later
    if (!this.validateCoordinates(location)) return
    console.log('Metrics calculation animated with multiplier:', multiplier)
  }

  // Create system completion indicator
  private createCompletionIndicator(location: [number, number], milestone: string): void {
    // Basic implementation - can be enhanced later
    if (!this.validateCoordinates(location)) return
    console.log('Completion indicator created for milestone:', milestone)
  }

  // Create operational status overlay
  private createOperationalStatus(location: [number, number], milestone: string): void {
    // Basic implementation - can be enhanced later
    if (!this.validateCoordinates(location)) return
    console.log('Operational status overlay created for milestone:', milestone)
  }

  // New private helper methods for new narrative
  private createSonarPulse(center: [number, number]) {
    // Implementation for a sonar-like pulse effect
  }

  private createAnalysisGrid(center: [number, number]) {
    // Implementation for a grid overlay with highlighting nodes
  }

  private createImpactRadius(center: [number, number], multiplier: number) {
    // Implementation for an expanding circle of light
  }

  private createDataPing(start: [number, number], end: [number, number]) {
    // Implementation for a small animated packet traveling back to origin
  }

  // Professional cleanup - Enterprise grade
  cleanup(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }

    // Remove all professional animation elements
    const animationElements = [
      'animated-marker',
      'network-styles',
      'data-grid-styles', 
      'processing-hub-styles',
      'data-flow-styles',
      'impact-dashboard-styles',
      'completion-styles'
    ]
    
    animationElements.forEach(id => {
      const element = document.getElementById(id)
      if (element) element.remove()
    })

    // Remove all enterprise visualization elements
    document.querySelectorAll('.network-node, .data-grid-container, .processing-hub, .impact-dashboard, .completion-indicator').forEach(el => {
      el.remove()
    })
  }

  // Add professional network animation styles
  private addNetworkStyles(): void {
    if (document.getElementById('network-styles')) return
    
    const style = document.createElement('style')
    style.id = 'network-styles'
    style.textContent = `
      .network-node {
        position: relative;
        width: 40px;
        height: 40px;
        pointer-events: none;
      }
      
      .node-core {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 8px;
        transform: translate(-50%, -50%);
        background: ${COLORS.PRIMARY};
        border-radius: 50%;
        box-shadow: 0 0 20px ${COLORS.PRIMARY}80;
        animation: node-pulse 2s ease-in-out infinite;
      }
      
      .node-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 32px;
        height: 32px;
        transform: translate(-50%, -50%);
        border: 2px solid ${COLORS.SECONDARY}40;
        border-radius: 50%;
        animation: ring-expand 3s ease-out forwards;
      }
      
      .node-grid {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 60px;
        height: 60px;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, ${COLORS.GRID}20 1px, transparent 1px);
        background-size: 8px 8px;
        opacity: 0;
        animation: grid-fade-in 1s ease-in forwards 0.5s;
      }
      
      @keyframes node-pulse {
        0%, 100% { 
          transform: translate(-50%, -50%) scale(1);
          box-shadow: 0 0 20px ${COLORS.PRIMARY}80;
        }
        50% { 
          transform: translate(-50%, -50%) scale(1.2);
          box-shadow: 0 0 30px ${COLORS.PRIMARY}60;
        }
      }
      
      @keyframes ring-expand {
        0% { 
          width: 8px; 
          height: 8px; 
          opacity: 1;
          border-color: ${COLORS.SECONDARY};
        }
        100% { 
          width: 32px; 
          height: 32px; 
          opacity: 0.6;
          border-color: ${COLORS.SECONDARY}40;
        }
      }
      
      @keyframes grid-fade-in {
        0% { opacity: 0; }
        100% { opacity: 0.4; }
      }
    `
    document.head.appendChild(style)
  }

  // Add professional data grid styles
  private addDataGridStyles(): void {
    if (document.getElementById('data-grid-styles')) return
    
    const style = document.createElement('style')
    style.id = 'data-grid-styles'
    style.textContent = `
      .data-grid-container {
        position: relative;
        width: 80px;
        height: 80px;
        pointer-events: none;
      }
      
      .grid-line {
        position: absolute;
        background: ${COLORS.GRID};
        opacity: 0;
        animation: grid-line-draw 0.8s ease-out forwards;
      }
      
      .grid-line:nth-child(odd) {
        width: 80px;
        height: 1px;
        left: 0;
        animation-delay: calc(var(--line-index, 0) * 100ms);
      }
      
      .grid-line:nth-child(even) {
        width: 1px;
        height: 80px;
        top: 0;
        animation-delay: calc(var(--line-index, 0) * 100ms + 400ms);
      }
      
      .data-point {
        position: absolute;
        width: 4px;
        height: 4px;
        background: ${COLORS.DATA_FLOW};
        border-radius: 50%;
        box-shadow: 0 0 8px ${COLORS.DATA_FLOW}80;
        opacity: 0;
        animation: data-point-activate 0.6s ease-out forwards;
        animation-delay: calc(var(--point-index, 0) * 150ms + 800ms);
      }
      
      @keyframes grid-line-draw {
        0% { 
          opacity: 0;
          transform: scaleX(0);
        }
        100% { 
          opacity: 0.6;
          transform: scaleX(1);
        }
      }
      
      @keyframes data-point-activate {
        0% { 
          opacity: 0;
          transform: scale(0);
        }
        60% { 
          opacity: 1;
          transform: scale(1.5);
        }
        100% { 
          opacity: 0.8;
          transform: scale(1);
        }
      }
    `
    document.head.appendChild(style)
  }

  // Add professional processing hub styles
  private addProcessingHubStyles(): void {
    if (document.getElementById('processing-hub-styles')) return
    
    const style = document.createElement('style')
    style.id = 'processing-hub-styles'
    style.textContent = `
      .processing-hub {
        position: relative;
        width: 60px;
        height: 60px;
        pointer-events: none;
      }
      
      .hub-core {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      
      .hub-status-ring {
        position: absolute;
        width: 48px;
        height: 48px;
        border: 3px solid ${COLORS.PROCESSING}40;
        border-top: 3px solid ${COLORS.PROCESSING};
        border-radius: 50%;
        animation: hub-rotate 2s linear infinite;
      }
      
      .hub-data-flow {
        position: absolute;
        width: 36px;
        height: 36px;
        border: 2px dashed ${COLORS.DATA_FLOW}60;
        border-radius: 50%;
        animation: flow-pulse 1.5s ease-in-out infinite reverse;
      }
      
      .hub-label {
        position: absolute;
        bottom: -24px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 10px;
        font-weight: 600;
        color: ${COLORS.TEXT_SECONDARY};
        letter-spacing: 1px;
        white-space: nowrap;
        text-shadow: 0 0 8px ${COLORS.BACKGROUND};
      }
      
      @keyframes hub-rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes flow-pulse {
        0%, 100% { 
          transform: scale(1);
          opacity: 0.6;
        }
        50% { 
          transform: scale(1.1);
          opacity: 0.9;
        }
      }
    `
    document.head.appendChild(style)
  }
}

// Utility functions for map operations
export const MapUtils = {
  // Add location markers with custom styling
  addLocationMarkers(map: mapboxgl.Map): void {
    if (!map) return

    // Cairo marker
    new mapboxgl.Marker({ 
      color: COLORS.PRIMARY,
      element: this.createCustomMarker(COLORS.PRIMARY, 'Cairo')
    })
      .setLngLat(LOCATIONS.CAIRO)
      .addTo(map)

    // New Cairo marker
    new mapboxgl.Marker({ 
      color: COLORS.SECONDARY,
      element: this.createCustomMarker(COLORS.SECONDARY, 'New Cairo')
    })
      .setLngLat(LOCATIONS.NEW_CAIRO)
      .addTo(map)

    // Minya marker
    new mapboxgl.Marker({ 
      color: COLORS.NETWORK,
      element: this.createCustomMarker(COLORS.NETWORK, 'Minya')
    })
      .setLngLat(LOCATIONS.MINYA)
      .addTo(map)
  },

  // Create custom marker element
  createCustomMarker(color: string, label: string): HTMLElement {
    const marker = document.createElement('div')
    marker.className = 'relative group'
    marker.innerHTML = `
      <div class="w-6 h-6 rounded-full border-2 border-white shadow-lg transform transition-transform group-hover:scale-110" 
           style="background-color: ${color}; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
      </div>
      <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        ${label}
      </div>
    `
    return marker
  },

  // Fit map to show bounds with animation
  fitMapToBounds(map: mapboxgl.Map, bounds: mapboxgl.LngLatBounds, padding: number = 100): void {
    if (!map) return
    
    map.fitBounds(bounds, {
      padding: padding,
      duration: ANIMATION.MAP_TRANSITION,
      easing: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    })
  },

  // Calculate bounds for multiple locations
  calculateBounds(locations: [number, number][]): mapboxgl.LngLatBounds {
    const bounds = new mapboxgl.LngLatBounds()
    locations.forEach(location => {
      bounds.extend(location)
    })
    return bounds
  }
}