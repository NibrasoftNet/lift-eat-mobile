import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { LogLevel, LogCategory } from '@/utils/enum/logging.enum';

/**
 * Service de logging conservé comme exception à l'architecture MCP.
 * Justification: Service transversal sans accès aux données, utilisé par tous
 * les composants y compris les handlers MCP eux-mêmes.
 * Ce service suit le pattern singleton et fournit une interface cohérente
 * pour la journalisation et la mesure des performances dans toute l'application.
 */

// Log categories for better organization

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private isDebugMode: boolean;

  private constructor() {
    // Activate debug logs in development (__DEV__) or when the Expo extra flag
    // "logDebug" is set to true in app.json / app.config.(ts|js).
    // Example:
    //   {
    //     "expo": {
    //       "extra": {
    //         "logDebug": true
    //       }
    //     }
    //   }
    // Fallback also supports the legacy manifest field and env variable EXPO_PUBLIC_LOG_DEBUG.
    const extra: any =
      // SDK 50+ (expoConfig)
      (Constants as any).expoConfig?.extra ??
      // Older SDKs (manifest)
      (Constants as any).manifest?.extra ?? {};

    const envFlag = (process.env.EXPO_PUBLIC_LOG_DEBUG ?? '').toString().toLowerCase();

    this.isDebugMode =
      __DEV__ ||
      extra?.logDebug === true ||
      extra?.logDebug === 'true' ||
      envFlag === 'true';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLog(entry: LogEntry): string {
    const platform = Platform.OS.toUpperCase();
    const formattedData = entry.data
      ? `\nData: ${JSON.stringify(entry.data, null, 2)}`
      : '';
    return `[${entry.timestamp}][${platform}][${entry.level}][${entry.category}] ${entry.message}${formattedData}`;
  }

  private createLogEntry(
    level: LogLevel,
    category: LogCategory,
    message: string,
    data?: any,
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
    };
  }

  public debug(category: LogCategory, message: string, data?: any) {
    if (this.isDebugMode) {
      const entry = this.createLogEntry(
        LogLevel.DEBUG,
        category,
        message,
        data,
      );
      console.debug(this.formatLog(entry));
    }
  }

  public info(category: LogCategory, message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.INFO, category, message, data);
    console.info(this.formatLog(entry));
  }

  public warn(category: LogCategory, message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.WARN, category, message, data);
    console.warn(this.formatLog(entry));
  }

  public error(category: LogCategory, message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.ERROR, category, message, data);
    console.error(this.formatLog(entry));
  }

  public startPerformanceLog(operation: string): number {
    this.debug(LogCategory.PERFORMANCE, `Starting ${operation}`);
    return performance.now();
  }

  public endPerformanceLog(operation: string, startTime: number) {
    const duration = performance.now() - startTime;
    this.debug(LogCategory.PERFORMANCE, `${operation} completed`, {
      durationMs: duration,
    });
  }
}

export const logger = Logger.getInstance();
