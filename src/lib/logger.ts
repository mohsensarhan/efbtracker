// Simple, effective logging utility for EFB Tracker
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  source?: string
}

class Logger {
  private level: LogLevel
  private isDev: boolean

  constructor() {
    this.isDev = process.env.NODE_ENV !== 'production'
    this.level = this.isDev ? LogLevel.DEBUG : LogLevel.INFO
  }

  private formatTimestamp(): string {
    return new Date().toISOString()
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level
  }

  private log(level: LogLevel, message: string, data?: any, source?: string): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      message,
      data,
      source
    }

    const levelNames = ['ERROR', 'WARN', 'INFO', 'DEBUG']
    const prefix = `[${entry.timestamp}] ${levelNames[level]}${source ? ` [${source}]` : ''}`
    
    if (this.isDev) {
      // In development, use console for better readability
      const logMethod = level === LogLevel.ERROR ? console.error :
                       level === LogLevel.WARN ? console.warn :
                       console.log
      
      if (data) {
        logMethod(`${prefix}: ${message}`, data)
      } else {
        logMethod(`${prefix}: ${message}`)
      }
    } else {
      // In production, log as structured JSON for log aggregation
      console.log(JSON.stringify(entry))
    }
  }

  error(message: string, data?: any, source?: string): void {
    this.log(LogLevel.ERROR, message, data, source)
  }

  warn(message: string, data?: any, source?: string): void {
    this.log(LogLevel.WARN, message, data, source)
  }

  info(message: string, data?: any, source?: string): void {
    this.log(LogLevel.INFO, message, data, source)
  }

  debug(message: string, data?: any, source?: string): void {
    this.log(LogLevel.DEBUG, message, data, source)
  }

  // Convenience methods for common use cases
  server(message: string, data?: any): void {
    this.info(message, data, 'SERVER')
  }

  socket(message: string, data?: any): void {
    this.info(message, data, 'SOCKET')
  }

  db(message: string, data?: any): void {
    this.debug(message, data, 'DATABASE')
  }

  map(message: string, data?: any): void {
    this.debug(message, data, 'MAP')
  }
}

// Export singleton instance
export const logger = new Logger()

// Export default for convenience
export default logger
