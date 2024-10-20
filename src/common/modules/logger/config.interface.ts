export interface TransportConfig {
  name: string;
  active: boolean;
  level: string;
  format: string;
  file?: string;
  host?: string;
  port?: number;
  mailTo?: string;
  mailFrom?: string;
  subject?: string;
}
