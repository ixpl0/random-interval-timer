const logs: string[] = [];

const addLog = (message: string): void => {
  const now = new Date();

  const hours = now.getHours()
    .toString()
    .padStart(2, '0');

  const minutes = now.getMinutes()
    .toString()
    .padStart(2, '0');

  const seconds = now.getSeconds()
    .toString()
    .padStart(2, '0');

  const timestamp = `${hours}:${minutes}:${seconds}`;
  const logEntry = `${timestamp} ${message}`;

  logs.push(logEntry);

  if (window.electronAPI?.writeLog) {
    window.electronAPI.writeLog(logEntry);
  }
};

export const initLogger = (): void => {
  const now = new Date();
  const hours = now.getHours()
    .toString()
    .padStart(2, '0');
  const minutes = now.getMinutes()
    .toString()
    .padStart(2, '0');
  const seconds = now.getSeconds()
    .toString()
    .padStart(2, '0');
  const timestamp = `${hours}:${minutes}:${seconds}`;
  const initMessage = `=== Timer Debug Log - ${timestamp} ===`;

  logs.length = 0;
  logs.push(initMessage);

  if (window.electronAPI?.initLog) {
    window.electronAPI.initLog(initMessage);
  }
};

const formatTimestamp = (): string => {
  const now = new Date();
  const hours = now.getHours()
    .toString()
    .padStart(2, '0');
  const minutes = now.getMinutes()
    .toString()
    .padStart(2, '0');
  const seconds = now.getSeconds()
    .toString()
    .padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

export const logTimer = (message: string): void => {
  const timestamp = formatTimestamp();
  const logMessage = `[${timestamp}] [TIMER] ${message}`;

  // eslint-disable-next-line no-console
  console.log(logMessage);
  addLog(logMessage);
};

export const logSound = (message: string): void => {
  const timestamp = formatTimestamp();
  const logMessage = `[${timestamp}] [SOUND] ${message}`;

  // eslint-disable-next-line no-console
  console.log(logMessage);
  addLog(logMessage);
};

export const getLogs = (): string[] => logs;
