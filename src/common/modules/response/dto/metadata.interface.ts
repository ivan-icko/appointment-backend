export interface IMetadata {
  duration?: number;
  timestamp?: string;
  fromCache?: boolean;
  systemMessage?: string;

  [propName: string]: any;
}
