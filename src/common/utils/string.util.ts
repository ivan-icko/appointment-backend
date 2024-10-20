export const getEnv = (key: string, defaultValue?: string): string => {
  return process.env[key] ?? defaultValue ?? '';
};

export const getEnvArray = (
  key: string,
  defaultValue: string[] = [],
): string[] => {
  const value = process.env[key];
  return value ? value.split(',').map((item) => item.trim()) : defaultValue;
};
