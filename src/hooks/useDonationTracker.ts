import { useState, useCallback } from 'react'
import { DonationPhase } from '@/lib/donation-tracker-utils'

export const useDonationTracker = (initialPhases: DonationPhase[]) => {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [phases, setPhases] = useState<DonationPhase[]>(initialPhases)

  const advancePhase = useCallback(() => {
    if (currentPhase < phases.length - 1) {
      // Immediate update - no animation delay
      const updatedPhases = [...phases]
      
      // Mark current phase as completed
      updatedPhases[currentPhase] = {
        ...updatedPhases[currentPhase],
        status: 'completed',
        progress: 100
      }
      
      // Move to next phase immediately
      setCurrentPhase(prev => prev + 1)
      setPhases(updatedPhases)
    }
  }, [currentPhase, phases])

  const goToPhase = useCallback((targetPhase: number) => {
    if (targetPhase >= 0 && targetPhase < phases.length) {
      const updatedPhases = [...phases]
      
      // Update all phases based on target
      updatedPhases.forEach((phase, index) => {
        if (index < targetPhase) {
          phase.status = 'completed'
          phase.progress = 100
        } else if (index === targetPhase) {
          phase.status = 'in_progress'
          phase.progress = 50
        } else {
          phase.status = 'pending'
          phase.progress = 0
        }
      })
      
      setCurrentPhase(targetPhase)
      setPhases(updatedPhases)
    }
  }, [phases])

  const resetJourney = useCallback(() => {
    setCurrentPhase(0)
    setPhases(initialPhases)
  }, [initialPhases])

  const getProgressPercentage = useCallback(() => {
    return Math.round((currentPhase / (phases.length - 1)) * 100)
  }, [currentPhase, phases.length])

  const getStatusColor = useCallback((status: DonationPhase['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'in_progress':
        return 'bg-blue-500'
      default:
        return 'bg-white/40'
    }
  }, [])

  return {
    currentPhase,
    phases,
    advancePhase,
    goToPhase,
    resetJourney,
    getProgressPercentage,
    getStatusColor
  }
}