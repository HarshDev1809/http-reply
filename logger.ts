// logger.ts

type LogLabel = 'INFO' | 'ERROR' | 'WARN' | string;

const formatMessage = (msg: unknown): string => {
  if (typeof msg === 'object' && msg !== null) {
    try {
      return JSON.stringify(msg, null, 2); // Pretty print with indentation
    } catch {
      return '[Unserializable Object]';
    }
  }
  return String(msg);
};

export const Log = (message: unknown, label: LogLabel = 'INFO'): void => {
  console.log(`[${label}] ${formatMessage(message)}`);
};

export const ErrorLog = (error: unknown, label: LogLabel = 'ERROR'): void => {
  console.error(`\x1b[31m[${label}] ${formatMessage(error)}\x1b[0m`);
};

export const WarnLog = (warning: unknown, label: LogLabel = 'WARN'): void => {
  console.warn(`\x1b[33m[${label}] ${formatMessage(warning)}\x1b[0m`);
};
