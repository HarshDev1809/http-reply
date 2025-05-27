export const Log = (message, label = 'INFO') => {
  console.log(`[${label}] ${formatMessage(message)}`);
};

export const ErrorLog = (error, label = 'ERROR') => {
  console.error(`\x1b[31m[${label}] ${formatMessage(error)}\x1b[0m`);
};

export const WarnLog = (warning, label = 'WARN') => {
  console.warn(`\x1b[33m[${label}] ${formatMessage(warning)}\x1b[0m`);
};

// Utility to handle objects, arrays, etc.
const formatMessage = (msg) => {
  if (typeof msg === 'object') {
    try {
      return JSON.stringify(msg, null); // Pretty print
    } catch (e) {
      return '[Unserializable Object]';
    }
  }
  return msg;
};
