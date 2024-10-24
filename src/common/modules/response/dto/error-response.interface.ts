import { IMetadata } from './metadata.interface';

export interface IErrorResponse {
  code: string;
  message: string;
  metadata: IMetadata;
  status?: number;
  error?: string;
  userMessage?: string;
  info?: string;
}
